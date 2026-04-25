import DevicePresenceSummary from "../components/DevicePresenceSummary";
import DevicePanel from "../components/DevicePanel";
import { useDashboard } from "../context/DashboardContext";

const DeviceStatusPage = () => {
  const { devices, connected, hardwareStatus, hardwareDevices } = useDashboard();

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-sky-300/10 bg-[linear-gradient(135deg,rgba(7,24,44,0.98),rgba(12,42,74,0.92))] p-4 shadow-glow sm:rounded-[28px] sm:p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Unit Status</p>
        <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">Presence and link health</h2>
        <p className="mt-3 text-slate-300">
          Stream link: {connected ? "connected and receiving live updates" : "currently offline"}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${hardwareStatus.tone}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${hardwareStatus.dot}`} />
            {hardwareStatus.label}
          </div>
          <div className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10">
            {hardwareDevices.length} physical unit(s) registered
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-400">{hardwareStatus.helper}</p>
      </div>
      <DevicePresenceSummary devices={devices} />
      <DevicePanel devices={devices} />
    </div>
  );
};

export default DeviceStatusPage;
