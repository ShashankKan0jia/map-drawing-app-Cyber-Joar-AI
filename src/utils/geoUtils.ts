import * as turf from "@turf/turf";

// We keep geometry types loose to avoid GeoJSON + Turf typing conflicts
export type TurfPolygon = any;

// Convert Leaflet layer to Turf geometry
export function layerToTurf(layer: any): TurfPolygon {
  return layer.toGeoJSON();
}

// Check if new polygon fully contains any existing polygon
export function isFullyContaining(
  newPoly: TurfPolygon,
  existingPolys: TurfPolygon[]
): boolean {
  return existingPolys.some((p) => turf.booleanContains(newPoly, p));
}

// Check if polygon intersects any existing polygon
export function isOverlapping(
  newPoly: TurfPolygon,
  existingPolys: TurfPolygon[]
): boolean {
  return existingPolys.some((p) => turf.booleanIntersects(newPoly, p));
}

// Trim overlapping parts from new polygon
export function trimOverlap(
  newPoly: TurfPolygon,
  existingPolys: TurfPolygon[]
): TurfPolygon | null {
  let result = newPoly;

  for (const p of existingPolys) {
    if (turf.booleanIntersects(result, p)) {
      const diff = turf.difference(result, p) as any;

      // If completely removed after trimming, reject
      if (!diff) return null;

      result = diff;
    }
  }

  return result;
}
