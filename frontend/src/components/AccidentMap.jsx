import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";

const mapCenter = [12.869444, 80.215833];

const markerColor = (level) => {
  if (level === 3) return "#3b82f6";
  if (level === 2) return "#38bdf8";
  return "#7dd3fc";
};

const liveDevices = (devices) =>
  devices.filter((device) => Number.isFinite(device.latitude) && Number.isFinite(device.longitude));

const AccidentMap = ({ accidents, devices = [] }) => (
  <div className="min-w-0 max-w-full rounded-[24px] border border-sky-300/10 bg-[linear-gradient(135deg,rgba(10,24,43,0.96),rgba(11,35,60,0.92))] p-4 shadow-glow sm:rounded-[28px] sm:p-5">
    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Geo View</p>
        <h3 className="mt-2 font-display text-xl text-white sm:text-2xl">Live route canvas</h3>
      </div>
      <div className="inline-flex self-start rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10 lg:self-auto">
        {liveDevices(devices).length} live unit pin(s)
      </div>
    </div>

    <div className="h-[280px] w-full overflow-hidden rounded-[20px] border border-white/10 sm:h-[340px] xl:h-[420px] 2xl:h-[520px]">
      <MapContainer center={mapCenter} zoom={15} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CircleMarker
          center={mapCenter}
          pathOptions={{
            color: "#bae6fd",
            fillColor: "#38bdf8",
            fillOpacity: 0.95
          }}
          radius={11}
        >
          <Popup>
            <div className="space-y-1">
              <p><strong>St. Joseph&apos;s College of Engineering</strong></p>
              <p>OMR, Chennai - 600119</p>
              <p>Coordinates: 12.8694, 80.2158</p>
            </div>
          </Popup>
        </CircleMarker>
        {liveDevices(devices).map((device) => (
          <CircleMarker
            key={`device-${device.deviceId}`}
            center={[device.latitude, device.longitude]}
            pathOptions={{
              color: "#38bdf8",
              fillColor: "#38bdf8",
              fillOpacity: 0.85
            }}
            radius={8}
          >
            <Popup>
              <div className="space-y-1">
                <p><strong>{device.deviceId}</strong></p>
                <p>Live unit location</p>
                <p>State: {device.status}</p>
                <p>Coordinates: {device.latitude.toFixed(4)}, {device.longitude.toFixed(4)}</p>
                <p>Updated: {new Date(device.locationUpdatedAt ?? device.lastSeen).toLocaleString()}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
        {accidents.slice(0, 20).map((accident) => (
          <CircleMarker
            key={accident.id}
            center={[accident.latitude, accident.longitude]}
            pathOptions={{
              color: markerColor(accident.severity_level),
              fillColor: markerColor(accident.severity_level),
              fillOpacity: 0.75
            }}
            radius={10}
          >
            <Popup>
              <div className="space-y-1">
                <p><strong>{accident.device_id}</strong></p>
                <p>Level: {accident.severity_label}</p>
                <p>Force: {accident.acceleration} m/s^2</p>
                <p>Tilt: {Number(accident.tilt_angle ?? 0).toFixed(1)} deg</p>
                <p>Speed: {Number(accident.speed ?? 0).toFixed(1)} km/h</p>
                <p>Coordinates: {accident.latitude.toFixed(4)}, {accident.longitude.toFixed(4)}</p>
                <p>Time: {new Date(accident.timestamp ?? accident.created_at).toLocaleString()}</p>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  </div>
);

export default AccidentMap;
