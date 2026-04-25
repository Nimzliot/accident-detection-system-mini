import {
  Cell,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const ChartsPanel = ({ accidents, summary }) => {
  const timeline = accidents
    .slice(0, 7)
    .reverse()
    .map((accident, index) => ({
      name: `E${index + 1}`,
      severity: accident.severity_level,
      acceleration: accident.acceleration
    }));

  const distribution = [
    { label: "Level 1", value: summary.minor, color: "#7dd3fc" },
    { label: "Level 2", value: summary.medium, color: "#38bdf8" },
    { label: "Level 3", value: summary.severe, color: "#3b82f6" }
  ];

  return (
    <div className="grid gap-4 xl:grid-cols-2 sm:gap-6">
      <div className="rounded-[24px] border border-sky-300/10 bg-[linear-gradient(135deg,rgba(10,24,43,0.96),rgba(11,35,60,0.92))] p-4 shadow-glow sm:rounded-[28px] sm:p-5">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Activity Line</p>
        <h3 className="mt-2 font-display text-xl text-white sm:text-2xl">Recent force pattern</h3>
        <div className="mt-5 h-56 sm:mt-6 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeline}>
              <CartesianGrid stroke="rgba(148,163,184,0.15)" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line
                dataKey="acceleration"
                type="monotone"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{ fill: "#38bdf8", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-[24px] border border-sky-300/10 bg-[linear-gradient(135deg,rgba(10,24,43,0.96),rgba(11,35,60,0.92))] p-4 shadow-glow sm:rounded-[28px] sm:p-5">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Level Mix</p>
        <h3 className="mt-2 font-display text-xl text-white sm:text-2xl">Signal distribution</h3>
        <div className="mt-5 h-56 sm:mt-6 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip />
              <Pie
                data={distribution}
                dataKey="value"
                nameKey="label"
                innerRadius={55}
                outerRadius={92}
                paddingAngle={4}
              >
                {distribution.map((entry) => (
                  <Cell key={entry.label} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartsPanel;
