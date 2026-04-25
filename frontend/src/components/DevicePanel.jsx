import { formatHeartbeatAge } from "../utils/deviceStatus";

const DevicePanel = ({ devices }) => (
  <div className="rounded-[24px] border border-sky-300/10 bg-[linear-gradient(135deg,rgba(10,24,43,0.96),rgba(11,35,60,0.92))] p-4 shadow-glow sm:rounded-[28px] sm:p-5">
    <div className="mb-4">
      <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Unit Registry</p>
      <h3 className="mt-2 font-display text-xl text-white sm:text-2xl">Presence timeline</h3>
      <p className="mt-2 text-sm text-slate-400">
        Online: under 20 sec, Stale: 20 to 60 sec, Offline: over 60 sec since last beacon.
      </p>
    </div>
    <div className="space-y-3">
      {devices.map((device) => (
        <div key={device.deviceId} className="rounded-2xl border border-white/10 bg-black/10 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-semibold text-white">{device.deviceId}</p>
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${device.presence.tone}`}>
                  <span className={`h-2 w-2 rounded-full ${device.presence.dot}`} />
                  {device.presence.label}
                </span>
              </div>
              <p className="mt-2 text-sm capitalize text-slate-400">
                Unit state: {device.status}
              </p>
            </div>
            <div className="text-left text-sm text-slate-300 md:text-right">
              <p>Beacon {formatHeartbeatAge(device.lastSeen)}</p>
              <p>{new Date(device.lastSeen).toLocaleTimeString()}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Last Seen</p>
              <p className="mt-1 text-sm text-slate-200">{new Date(device.lastSeen).toLocaleString()}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Presence</p>
              <p className="mt-1 text-sm text-slate-200">{device.presence.label}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Unit State</p>
              <p className="mt-1 text-sm text-slate-200 capitalize">{device.status}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Route Position</p>
              <p className="mt-1 text-sm text-slate-200">
                {device.latitude != null && device.longitude != null
                  ? `${device.latitude.toFixed(4)}, ${device.longitude.toFixed(4)}`
                  : "Waiting for lock"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default DevicePanel;
