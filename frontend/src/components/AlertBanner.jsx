import { MapPinned, RadioTower, TriangleAlert } from "lucide-react";
import { useDashboard } from "../context/DashboardContext";

const AlertBanner = () => {
  const { latestAccident, alerts } = useDashboard();
  const latest = latestAccident;

  const latestAlert = alerts.find(
    (alert) =>
      (alert.accidentId === latest?.id || alert.accident_id === latest?.id) && alert.sent
  );

  if (!latest || latest.severity_level !== 3 || !latestAlert) {
    return null;
  }

  const mapLink =
    latest.latitude != null && latest.longitude != null
      ? `https://maps.google.com/?q=${Number(latest.latitude).toFixed(6)},${Number(latest.longitude).toFixed(6)}`
      : null;

  return (
    <div className="animate-pulse-alert overflow-hidden rounded-[24px] border border-sky-300/20 bg-[linear-gradient(135deg,rgba(7,29,51,0.98),rgba(14,61,94,0.94))] p-0 shadow-glow sm:rounded-[32px]">
      <div className="grid gap-0 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="flex flex-col gap-4 p-4 sm:p-6">
          <TriangleAlert className="mt-1 text-cyan-300" />
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">
              Level 3 priority event
            </p>
            <h3 className="mt-1 text-lg font-semibold text-white sm:text-xl 2xl:text-2xl">
              {latest.device_id} raised a critical signal at {new Date(
                latest.timestamp ?? latest.created_at
              ).toLocaleTimeString()}
            </h3>
            <p className="mt-3 text-sm text-cyan-50/85">
              The stream crossed the highest alert level and operator attention is now active.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-cyan-50 ring-1 ring-white/10">
              <RadioTower size={16} />
              Queue item opened
            </div>
            {mapLink ? (
              <a
                href={mapLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-200 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
              >
                <MapPinned size={16} />
                Open Route View
              </a>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-cyan-50 ring-1 ring-white/10">
                <MapPinned size={16} />
                Waiting for route lock
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-between border-t border-white/10 bg-black/20 p-4 sm:p-6 xl:border-l xl:border-t-0">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/75">Operator Brief</p>
            <p className="mt-3 text-sm leading-6 text-cyan-50/85">
              Live updates, route context, and the queue card remain active until the operator clears this event.
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Severity</p>
              <p className="mt-2 text-lg font-semibold text-white">{latest.severity_label}</p>
            </div>
            <div className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200/70">Coordinates</p>
              <p className="mt-2 text-sm font-medium text-white">
                {latest.latitude != null && latest.longitude != null
                  ? `${Number(latest.latitude).toFixed(4)}, ${Number(latest.longitude).toFixed(4)}`
                  : "Pending GPS"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
