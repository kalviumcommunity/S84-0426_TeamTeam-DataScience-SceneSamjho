import { useEffect } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import { AccidentRecord } from "@/data/sampleData";
import "leaflet/dist/leaflet.css";

const severityColors: Record<string, string> = {
  Minor: "#00e5a0",
  Moderate: "#f5a623",
  Severe: "#ff6b6b",
  Fatal: "#ff0055",
};

const severityRadius: Record<string, number> = {
  Minor: 6,
  Moderate: 8,
  Severe: 10,
  Fatal: 14,
};

interface AccidentMapProps {
  data: AccidentRecord[];
}

export default function AccidentMap({ data }: AccidentMapProps) {
  const center: [number, number] = [28.6139, 77.2090];

  return (
    <div className="chart-container overflow-hidden" style={{ height: 500 }}>
      <h3 className="font-display text-sm font-semibold text-foreground mb-4">Accident Locations</h3>
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: "calc(100% - 30px)", borderRadius: "0.5rem" }}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {data.map((accident) => (
          <CircleMarker
            key={accident.id}
            center={[accident.latitude, accident.longitude]}
            radius={severityRadius[accident.severity]}
            pathOptions={{
              color: severityColors[accident.severity],
              fillColor: severityColors[accident.severity],
              fillOpacity: 0.5,
              weight: 2,
            }}
          >
            <Popup>
              <div style={{ color: "#111", fontSize: 12 }}>
                <strong>{accident.id}</strong> — {accident.severity}<br />
                {accident.date} at {accident.time}<br />
                Weather: {accident.weather} | Road: {accident.roadType}<br />
                Casualties: {accident.casualties} | Zone: {accident.zone}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
