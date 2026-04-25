const PresenceCard = ({ label, value, accent, helper }) => (
  <div className="rounded-[24px] border border-sky-300/10 bg-[linear-gradient(135deg,rgba(10,24,43,0.96),rgba(11,35,60,0.92))] p-5 shadow-glow">
    <div className={`mb-4 h-2 w-14 rounded-full ${accent}`} />
    <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">{label}</p>
    <div className="mt-3 flex items-end justify-between gap-4">
      <h3 className="font-display text-4xl font-semibold text-white">{value}</h3>
      <p className="max-w-[10rem] text-right text-xs text-slate-400">{helper}</p>
    </div>
  </div>
);

const DevicePresenceSummary = ({ devices }) => {
  const online = devices.filter((device) => device.presence.key === "online").length;
  const stale = devices.filter((device) => device.presence.key === "stale").length;
  const offline = devices.filter((device) => device.presence.key === "offline").length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:gap-5">
      <PresenceCard
        label="Online Units"
        value={online}
        accent="bg-sky-200"
        helper="Healthy beacon received in the last 20 seconds."
      />
      <PresenceCard
        label="Stale Units"
        value={stale}
        accent="bg-sky-300"
        helper="Beacon delay detected. Unit should be checked."
      />
      <PresenceCard
        label="Offline Units"
        value={offline}
        accent="bg-slate-400"
        helper="No beacon received for more than one minute."
      />
    </div>
  );
};

export default DevicePresenceSummary;
