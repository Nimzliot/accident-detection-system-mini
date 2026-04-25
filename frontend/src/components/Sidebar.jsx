import {
  Activity,
  Bell,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  RadioTower,
  Shield,
  TriangleAlert
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDashboard } from "../context/DashboardContext";

const links = [
  { to: "/app", label: "Overview", icon: LayoutDashboard },
  { to: "/app/monitoring", label: "Live View", icon: Activity },
  { to: "/app/devices", label: "Units", icon: RadioTower },
  { to: "/app/reports", label: "Insights", icon: ClipboardList },
  { to: "/app/alerts", label: "Priority Queue", icon: Bell }
];

const NavItems = () => (
  <>
    {links.map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        end={to === "/app"}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                isActive
              ? "bg-cyan-400/10 text-cyan-100 ring-1 ring-cyan-300/20"
              : "text-slate-300 hover:bg-white/5 hover:text-white"
          }`
        }
      >
        <Icon size={18} />
        {label}
      </NavLink>
    ))}
  </>
);

const Sidebar = () => {
  const { hardwareStatus } = useDashboard();
  const { user, signOut } = useAuth();

  return (
  <>
    <div className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#08111d]/95 px-4 py-4 backdrop-blur lg:hidden">
      <div className="mb-4 flex items-center gap-3">
        <div className="relative inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(135deg,rgba(34,211,238,0.22),rgba(59,130,246,0.18))] text-cyan-200 ring-1 ring-cyan-300/20">
          <Shield size={20} />
          <TriangleAlert size={12} className="absolute bottom-2 right-2 text-white/90" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Bluewatch Nexus</h1>
          <p className="text-sm text-slate-400">Live mobility risk console</p>
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto pb-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/app"}
            className={({ isActive }) =>
              `inline-flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-sm transition ${
                isActive
                  ? "bg-cyan-400/10 text-cyan-100 ring-1 ring-cyan-300/20"
                  : "bg-white/5 text-slate-300"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${hardwareStatus.tone}`}>
        <span className={`h-2.5 w-2.5 rounded-full ${hardwareStatus.dot}`} />
        {hardwareStatus.label}
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-200 ring-1 ring-white/10">
          {user?.email}
        </div>
        <button
          type="button"
          onClick={() => signOut()}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-cyan-200 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>

    <aside className="fixed inset-y-0 left-0 z-40 hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-white/10 bg-[linear-gradient(180deg,rgba(7,17,31,0.98),rgba(9,21,36,0.94))] px-6 py-8 lg:flex lg:flex-col">
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="relative inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,rgba(34,211,238,0.22),rgba(59,130,246,0.18))] text-cyan-200 ring-1 ring-cyan-300/20 shadow-glow">
            <Shield size={24} />
            <TriangleAlert size={14} className="absolute bottom-2 right-2 text-white/90" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/80">Mobility Sentinel</p>
            <h1 className="font-display text-2xl font-semibold text-white">Bluewatch Nexus</h1>
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-400">
          Unified console for live sensor streams, route position, and priority event handling.
        </p>
        <div className={`mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm ${hardwareStatus.tone}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${hardwareStatus.dot}`} />
          {hardwareStatus.label}
        </div>
        <p className="mt-2 text-xs text-slate-500">{hardwareStatus.helper}</p>
      </div>

      <nav className="space-y-2">
        <NavItems />
      </nav>
      <div className="mt-auto border-t border-white/10 pt-6">
        <div className="rounded-2xl bg-white/5 px-4 py-3 text-sm text-slate-200 ring-1 ring-white/10">
          {user?.email}
        </div>
        <button
          type="button"
          onClick={() => signOut()}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-cyan-200 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  </>
  );
};

export default Sidebar;
