const ONLINE_THRESHOLD_MS = 20 * 1000;
const STALE_THRESHOLD_MS = 60 * 1000;

export const getDevicePresence = (lastSeen) => {
  const timestamp = new Date(lastSeen).getTime();
  const ageMs = Number.isFinite(timestamp) ? Date.now() - timestamp : Number.POSITIVE_INFINITY;

  if (ageMs <= ONLINE_THRESHOLD_MS) {
    return {
      key: "online",
      label: "Online",
      tone: "bg-sky-300/15 text-sky-200 ring-1 ring-sky-300/30",
      dot: "bg-sky-300"
    };
  }

  if (ageMs <= STALE_THRESHOLD_MS) {
    return {
      key: "stale",
      label: "Stale",
      tone: "bg-sky-500/15 text-sky-200 ring-1 ring-sky-500/30",
      dot: "bg-sky-300"
    };
  }

  return {
    key: "offline",
    label: "Offline",
    tone: "bg-slate-500/15 text-slate-300 ring-1 ring-slate-500/30",
    dot: "bg-slate-400"
  };
};

export const formatHeartbeatAge = (lastSeen) => {
  const ageMs = Date.now() - new Date(lastSeen).getTime();

  if (ageMs < 60 * 1000) {
    return `${Math.max(1, Math.floor(ageMs / 1000))} sec ago`;
  }

  return `${Math.max(1, Math.floor(ageMs / 60000))} min ago`;
};
