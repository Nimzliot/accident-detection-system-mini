import Accident3DViewer from "../components/Accident3DViewer";
import AccidentMap from "../components/AccidentMap";
import AccidentTable from "../components/AccidentTable";
import { useDashboard } from "../context/DashboardContext";

const MonitoringPage = () => {
  const { accidents, latestAccident, devices } = useDashboard();

  return (
    <div className="grid min-w-0 gap-4 overflow-x-hidden sm:gap-6">
      <Accident3DViewer accident={latestAccident} />
      <AccidentMap accidents={accidents} devices={devices} />
      <AccidentTable accidents={accidents} />
    </div>
  );
};

export default MonitoringPage;
