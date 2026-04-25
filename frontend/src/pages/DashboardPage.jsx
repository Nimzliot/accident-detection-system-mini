import { useEffect, useRef, useState } from "react";
import AlertBanner from "../components/AlertBanner";
import Accident3DViewer from "../components/Accident3DViewer";
import ChartsPanel from "../components/ChartsPanel";
import DevicePanel from "../components/DevicePanel";
import MetricCard from "../components/MetricCard";
import AccidentMap from "../components/AccidentMap";
import AccidentTable from "../components/AccidentTable";
import { useDashboard } from "../context/DashboardContext";

const DashboardPage = () => {
  const { summary, devices, accidents, latestAccident, hardwareStatus } = useDashboard();
  const previousSummaryRef = useRef(summary);
  const [flashState, setFlashState] = useState({
    minor: false,
    medium: false,
    severe: false
  });

  useEffect(() => {
    const previousSummary = previousSummaryRef.current;
    const timeouts = [];
    const nextFlashState = {};

    ["minor", "medium", "severe"].forEach((key) => {
      if ((summary[key] ?? 0) > (previousSummary[key] ?? 0)) {
        nextFlashState[key] = true;
        timeouts.push(
          window.setTimeout(() => {
            setFlashState((current) => ({ ...current, [key]: false }));
          }, 1400)
        );
      }
    });

    if (Object.keys(nextFlashState).length > 0) {
      setFlashState((current) => ({ ...current, ...nextFlashState }));
    }

    previousSummaryRef.current = summary;

    return () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [summary]);

  return (
    <div className="space-y-6">
      <AlertBanner />

      <section>
        <div className="rounded-[32px] border border-sky-300/10 bg-[linear-gradient(135deg,rgba(7,24,44,0.98),rgba(12,42,74,0.92))] p-6 shadow-glow">
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-300/80">Network Snapshot</p>
          <h3 className="mt-3 font-display text-4xl text-white">Live route risk supervision</h3>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
            This workspace blends sensor movement data, location awareness, and operator action into one continuous live view.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${hardwareStatus.tone}`}>
              <span className={`h-2.5 w-2.5 rounded-full ${hardwareStatus.dot}`} />
              {hardwareStatus.label}
            </div>
            <div className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10">
              {summary.activeDevices} active unit(s) in the last minute
            </div>
            <div className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300 ring-1 ring-white/10">
              {summary.openAlerts} open priority event(s)
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4 2xl:gap-5">
        <MetricCard
          label="Total Signals"
          value={summary.total}
          accent="bg-cyan-300"
          helper="All logged event records across connected units."
        />
        <MetricCard
          label="Level 1"
          value={summary.minor}
          accent="bg-sky-200"
          glowClass={`metric-card-glow metric-card-glow-minor ${
            flashState.minor ? "metric-card-flash metric-card-flash-minor" : ""
          }`}
          helper="Light anomalies that stay in observation."
        />
        <MetricCard
          label="Level 2"
          value={summary.medium}
          accent="bg-sky-300"
          glowClass={`metric-card-glow metric-card-glow-medium ${
            flashState.medium ? "metric-card-flash metric-card-flash-medium" : ""
          }`}
          helper="Raised-risk events that need a human check."
        />
        <MetricCard
          label="Level 3"
          value={summary.severe}
          accent="bg-blue-400"
          glowClass={`metric-card-glow metric-card-glow-severe ${
            flashState.severe ? "metric-card-flash metric-card-flash-severe" : ""
          }`}
          helper="Highest-priority events promoted to the queue."
        />
      </div>

      <Accident3DViewer accident={latestAccident} />

      <ChartsPanel accidents={accidents} summary={summary} />

      <div className="grid gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
        <AccidentMap accidents={accidents} devices={devices} />
        <DevicePanel devices={devices} />
      </div>

      <AccidentTable accidents={accidents.slice(0, 10)} />
    </div>
  );
};

export default DashboardPage;
