"use client";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function HeatmapLayer({ points }: { points: [number, number, number][] }) {
  const map = useMap();
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet.heat" as any).then(() => {
        const heatLayer = (L as any).heatLayer(points, {
          radius: 25,
          blur: 15,
          maxZoom: 14,
        }).addTo(map);

        return () => {
          map.removeLayer(heatLayer);
        };
      });
    }
  }, [map, points]);

  return null;
}

export default function CrimeMap({ cases }: { cases: any[] }) {
  const defaultCenter: [number, number] = [37.7749, -122.4194]; // Default Center
  
  const heatPoints: [number, number, number][] = cases
    .filter(c => c.location?.coordinates && c.location.coordinates.length === 2 && !isNaN(c.location.coordinates[0]))
    .map(c => [c.location.coordinates[1], c.location.coordinates[0], 0.8]);

  const center = heatPoints.length > 0 ? [heatPoints[0][0], heatPoints[0][1]] as [number, number] : defaultCenter;

  return (
    <div className="h-[600px] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200">
      <MapContainer center={center} zoom={11} className="h-full w-full z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {heatPoints.length > 0 && <HeatmapLayer points={heatPoints} />}
        
        {cases.map((c) => {
          if (!c.location?.coordinates || c.location.coordinates.length < 2) return null;
          return (
            <Marker key={c._id} position={[c.location.coordinates[1], c.location.coordinates[0]]}>
              <Popup>
                <div className="p-1 min-w-[200px]">
                  <strong className="block mb-2 font-bold text-slate-900 border-b pb-1">{c.title}</strong>
                  <div className="mb-2">
                    <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] uppercase font-bold px-2 py-0.5 rounded tracking-wide">{c.category}</span>
                  </div>
                  <p className="mt-2 text-slate-600 line-clamp-3 text-sm leading-relaxed">{c.description}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
