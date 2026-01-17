import { useState } from "react";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";

import ExportButton from "./ExportButton";
import { SHAPE_LIMITS } from "../config/limits";
import {
  layerToTurf,
  isFullyContaining,
  isOverlapping,
  trimOverlap,
} from "../utils/geoUtils";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

interface DrawnFeature {
  id: string;
  type: string;
  layer: L.Layer;
}

const MapView = () => {
  const [features, setFeatures] = useState<DrawnFeature[]>([]);

  const countByType = (type: string) =>
    features.filter((f) => f.type === type).length;

  const onCreated = (e: any) => {
    const { layerType, layer } = e;

    // Check dynamic limits
    if (countByType(layerType) >= (SHAPE_LIMITS as any)[layerType]) {
      alert(
        `Maximum ${
          SHAPE_LIMITS[layerType as keyof typeof SHAPE_LIMITS]
        } ${layerType}s allowed`
      );
      return;
    }

    // LineStrings are excluded from overlap rules
    if (layerType === "polyline") {
      setFeatures((prev) => [
        ...prev,
        { id: Date.now().toString(), type: layerType, layer },
      ]);
      return;
    }

    // Convert new layer to Turf polygon
    const newPoly = layerToTurf(layer);

    // Get existing polygonal features only
    const existingPolys = features
      .filter((f) => f.type !== "polyline")
      .map((f) => layerToTurf(f.layer));

    // Block if fully enclosing
    if (isFullyContaining(newPoly, existingPolys)) {
      alert("Polygon fully contains another polygon. This is not allowed.");
      return;
    }

    // Trim if overlapping
    let finalPoly = newPoly;
    if (isOverlapping(newPoly, existingPolys)) {
      const trimmed = trimOverlap(newPoly, existingPolys);
      if (!trimmed) {
        alert("Polygon became invalid after trimming.");
        return;
      }
      finalPoly = trimmed;

      // Replace geometry in Leaflet layer
      (layer as any).setLatLngs(
        finalPoly.geometry.coordinates[0].map((c: any) => [c[1], c[0]])
      );
    }

    setFeatures((prev) => [
      ...prev,
      { id: Date.now().toString(), type: layerType, layer },
    ]);
  };

  const onDeleted = (e: any) => {
    const idsToDelete: string[] = [];
    e.layers.eachLayer((layer: L.Layer) => {
      const found = features.find((f) => f.layer === layer);
      if (found) idsToDelete.push(found.id);
    });

    setFeatures((prev) => prev.filter((f) => !idsToDelete.includes(f.id)));
  };

  return (
    <>
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={13}
        style={{ height: "90vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={onCreated}
            onDeleted={onDeleted}
            draw={{
              rectangle: true,
              polygon: true,
              circle: true,
              polyline: true,
              marker: false,
              circlemarker: false,
            }}
          />
        </FeatureGroup>
      </MapContainer>

      <ExportButton features={features} />
    </>
  );
};

export default MapView;
