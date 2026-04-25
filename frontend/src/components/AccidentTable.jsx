import SeverityBadge from "./SeverityBadge";

const AccidentTable = ({ accidents }) => (
  <div className="min-w-0 max-w-full rounded-[24px] border border-sky-300/10 bg-[linear-gradient(135deg,rgba(10,24,43,0.96),rgba(11,35,60,0.92))] p-4 shadow-glow sm:rounded-[28px] sm:p-5">
    <div className="mb-4">
      <p className="text-sm uppercase tracking-[0.2em] text-cyan-200/80">Event Archive</p>
      <h3 className="mt-2 font-display text-xl text-white sm:text-2xl">Recent activity ledger</h3>
    </div>

    <div className="-mx-1 max-w-full overflow-x-auto sm:mx-0">
      <table className="min-w-[760px] w-full text-left text-sm text-slate-200 2xl:min-w-full">
        <thead className="text-slate-400">
          <tr>
            <th className="pb-3">Device</th>
            <th className="pb-3">Force</th>
            <th className="pb-3">Tilt</th>
            <th className="pb-3">Speed</th>
            <th className="pb-3">Level</th>
            <th className="pb-3">Location</th>
            <th className="pb-3">State</th>
            <th className="pb-3">Time</th>
          </tr>
        </thead>
        <tbody>
          {accidents.map((accident) => (
            <tr key={accident.id} className="border-t border-white/5">
              <td className="py-4 pr-4 font-medium text-white whitespace-nowrap">{accident.device_id}</td>
              <td className="py-4 pr-4">{accident.acceleration} m/s^2</td>
              <td className="py-4 pr-4">{Number(accident.tilt_angle ?? 0).toFixed(1)} deg</td>
              <td className="py-4 pr-4">{Number(accident.speed ?? 0).toFixed(1)} km/h</td>
              <td className="py-4 pr-4">
                <SeverityBadge label={accident.severity_label} />
              </td>
              <td className="py-4 pr-4">
                {accident.latitude?.toFixed?.(4)}, {accident.longitude?.toFixed?.(4)}
              </td>
              <td className="py-4 pr-4 capitalize">{accident.status}</td>
              <td className="py-4 whitespace-nowrap">{new Date(accident.timestamp ?? accident.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AccidentTable;
