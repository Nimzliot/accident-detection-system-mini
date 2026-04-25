import AlertList from "../components/AlertList";

const EmergencyAlertsPage = () => (
  <div className="space-y-6">
    <div className="rounded-[24px] border border-sky-300/10 bg-[linear-gradient(135deg,rgba(7,24,44,0.98),rgba(12,42,74,0.92))] p-4 shadow-glow sm:rounded-[28px] sm:p-6">
      <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Priority Queue</p>
      <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">High-priority event board</h2>
      <p className="mt-3 text-slate-300">
        Level 3 detections open a live queue item for operator follow-through.
      </p>
    </div>
    <AlertList />
  </div>
);

export default EmergencyAlertsPage;
