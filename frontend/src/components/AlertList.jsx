import { useDashboard } from "../context/DashboardContext";
import { BellRing, MapPinned } from "lucide-react";
import SeverityBadge from "./SeverityBadge";

const AlertList = () => {
  const { alerts, acknowledgeAlert } = useDashboard();

  return (
    <div className="rounded-[24px] border border-white/10 bg-panel/80 p-4 shadow-glow sm:rounded-[28px] sm:p-5">
      <div className="mb-4">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Priority Queue</p>
        <h3 className="mt-2 font-display text-xl text-white sm:text-2xl">Review and clear events</h3>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="rounded-[20px] border border-sky-300/15 bg-[linear-gradient(135deg,rgba(11,29,50,0.92),rgba(8,22,39,0.94))] p-4 sm:rounded-[24px] sm:p-5">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-semibold text-white">{alert.accident?.device_id ?? "Priority Event"}</p>
                  <SeverityBadge label={alert.accident?.severity_label ?? "Level 3"} />
                </div>
                <p className="mt-2 text-sm text-slate-300">{alert.message}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cyan-200/70">
                  Queue state: {alert.sent ? "open" : "cleared"}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-xs text-slate-200 ring-1 ring-white/10">
                    <BellRing size={14} />
                    Queue item active
                  </div>
                  {alert.accident?.latitude != null && alert.accident?.longitude != null ? (
                    <a
                      href={`https://maps.google.com/?q=${Number(alert.accident.latitude).toFixed(6)},${Number(alert.accident.longitude).toFixed(6)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-sky-300 px-3 py-2 text-xs font-semibold text-slate-950 transition hover:bg-sky-200"
                    >
                      <MapPinned size={14} />
                      Open Map
                    </a>
                  ) : null}
                </div>
              </div>
              <button
                type="button"
                onClick={() => acknowledgeAlert(alert.accidentId ?? alert.accident_id)}
                disabled={!alert.sent}
                className="w-full rounded-full bg-cyan-200 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100 sm:w-auto"
              >
                {alert.sent ? "Mark Resolved" : "Resolved"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertList;
