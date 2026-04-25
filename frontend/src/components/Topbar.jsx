import { BellRing, Cpu, MapPinned, Radio } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";

const Topbar = () => {
  const { connected, alerts, hardwareStatus, hardwareDevices } = useDashboard();
  const locatedHardware = hardwareDevices.filter(
    (device) => device.latitude != null && device.longitude != null
  ).length;
  const activeAlerts = alerts.filter((alert) => !alert.acknowledged).length;

  return (
    <header className="flex flex-col gap-4 rounded-[24px] border border-sky-300/10 bg-[linear-gradient(135deg,rgba(7,24,44,0.98),rgba(12,42,74,0.92))] px-4 py-4 shadow-glow backdrop-blur sm:gap-5 sm:rounded-[32px] sm:px-6 sm:py-6 2xl:px-8 2xl:py-7 xl:flex-row xl:items-end xl:justify-between">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-300/80 sm:text-sm sm:tracking-[0.25em]">Mission Overview</p>
        <h2 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl 2xl:text-4xl">
          Bluewatch Nexus
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-300 sm:mt-3 2xl:max-w-2xl">
          One shared surface for impact signals, route awareness, and operator decisions.
        </p>
      </div>

      <div className="grid gap-3 xl:min-w-[640px] 2xl:min-w-[760px]">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-[22px] bg-white/6 px-4 py-4 ring-1 ring-white/10">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              <Radio size={14} className={connected ? "text-sky-300" : "text-blue-400"} />
              Feed
            </div>
            <p className="mt-2 text-sm font-semibold text-white">
              {connected ? "Live stream active" : "Live stream offline"}
            </p>
          </div>
          <div className="rounded-[22px] bg-white/6 px-4 py-4 ring-1 ring-white/10">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              <Cpu size={14} className={hardwareStatus.dot} />
              Units
            </div>
            <p className="mt-2 text-sm font-semibold text-white">{hardwareStatus.label}</p>
          </div>
          <div className="rounded-[22px] bg-white/6 px-4 py-4 ring-1 ring-white/10">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-400">
              <MapPinned size={14} className="text-cyan-300" />
              Route Pins
            </div>
            <p className="mt-2 text-sm font-semibold text-white">{locatedHardware} live hardware location(s)</p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center xl:justify-end">
          <div className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm text-sky-100 ring-1 ring-blue-400/20 sm:justify-start">
            <BellRing size={16} />
            {activeAlerts} active priority events
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
