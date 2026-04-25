import ChartsPanel from "../components/ChartsPanel";
import { useDashboard } from "../context/DashboardContext";

const ReportsPage = () => {
  const { summary, accidents } = useDashboard();

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-cyan-400/10 bg-[linear-gradient(135deg,rgba(9,23,40,0.96),rgba(13,41,62,0.9))] p-4 shadow-glow sm:rounded-[28px] sm:p-6">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Insight Deck</p>
        <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">Pattern review and signal mix</h2>
        <p className="mt-3 text-slate-300">
          A compact view for trend reading, operating reviews, and event distribution snapshots.
        </p>
      </div>
      <ChartsPanel accidents={accidents} summary={summary} />
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 sm:gap-5">
        <div className="rounded-[24px] border border-sky-300/10 bg-[linear-gradient(135deg,rgba(10,24,43,0.96),rgba(11,35,60,0.92))] p-4 shadow-glow sm:rounded-[28px] sm:p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Level 1</p>
          <h3 className="mt-3 font-display text-3xl text-sky-200 sm:text-4xl">{summary.minor}</h3>
        </div>
        <div className="rounded-[24px] border border-sky-300/10 bg-[linear-gradient(135deg,rgba(10,24,43,0.96),rgba(11,35,60,0.92))] p-4 shadow-glow sm:rounded-[28px] sm:p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Level 2</p>
          <h3 className="mt-3 font-display text-3xl text-sky-300 sm:text-4xl">{summary.medium}</h3>
        </div>
        <div className="rounded-[24px] border border-sky-300/10 bg-[linear-gradient(135deg,rgba(10,24,43,0.96),rgba(11,35,60,0.92))] p-4 shadow-glow sm:rounded-[28px] sm:p-6 sm:col-span-2 md:col-span-1">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Level 3</p>
          <h3 className="mt-3 font-display text-3xl text-blue-300 sm:text-4xl">{summary.severe}</h3>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
