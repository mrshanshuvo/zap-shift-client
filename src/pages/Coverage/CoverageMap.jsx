import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix leaflet default icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Component to fly to a district when searched
const FlyToDistrict = ({ coords }) => {
  const map = useMap();
  map.flyTo(coords, 10, {
    duration: 1.5,
  });
  return null;
};

const CoverageMap = ({ serviceCenters, targetCoords }) => {
  const bangladeshCenter = [23.685, 90.3563];

  return (
    <div className="h-[600px] w-full rounded-2xl overflow-hidden shadow-md">
      <h2 className="text-xl md:text-2xl font-semibold text-center text-gray-700 mb-4">
        We deliver <span className="text-green-500">almost all over Bangladesh</span>
      </h2>

      <MapContainer
        center={bangladeshCenter}
        zoom={7}
        scrollWheelZoom={true}
        className="h-full w-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🔍 Fly to searched district */}
        {targetCoords && <FlyToDistrict coords={targetCoords} />}

        {/* 📍 Render markers */}
        {serviceCenters.map((district) => (
          <Marker
            key={district.district}
            position={[district.latitude, district.longitude]}
          >
            <Popup>
              <div>
                <h3 className="font-bold text-primary">{district.city}</h3>
                <p className="text-sm">District: {district.district}</p>
                <p className="text-sm">Region: {district.region}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Covered Areas: {district.covered_area.join(", ")}
                </p>
                <a
                  href={district.flowchart}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-xs underline mt-1 inline-block"
                >
                  View Flowchart
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default CoverageMap;
