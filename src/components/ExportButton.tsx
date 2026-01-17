import L from "leaflet";

interface ExportButtonProps {
  features: {
    id: string;
    type: string;
    layer: L.Layer;
  }[];
}

const ExportButton = ({ features }: ExportButtonProps) => {
  const handleExport = () => {
    const geoJsonFeatures = features.map((f) => {
      const geo = (f.layer as any).toGeoJSON();

      return {
        type: "Feature",
        geometry: geo.geometry,
        properties: {
          id: f.id,
          shapeType: f.type,
        },
      };
    });

    const geoJson = {
      type: "FeatureCollection",
      features: geoJsonFeatures,
    };

    const blob = new Blob([JSON.stringify(geoJson, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "drawn-features.geojson";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      style={{
        position: "absolute",
        bottom: 20,
        right: 20,
        padding: "10px 16px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        zIndex: 1000,
      }}
    >
      Export GeoJSON
    </button>
  );
};

export default ExportButton;
