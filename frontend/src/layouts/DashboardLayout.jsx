import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const DashboardLayout = () => (
  <div className="min-h-screen overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(125,211,252,0.12),_transparent_20%),radial-gradient(circle_at_right,_rgba(59,130,246,0.1),_transparent_24%),linear-gradient(180deg,_#07111f,_#050b14)] font-body text-white">
    <div className="mx-auto flex min-h-screen w-full max-w-[1920px] min-w-0 flex-col 2xl:max-w-[2200px]">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden px-3 pb-4 pt-[178px] sm:px-4 sm:pb-6 sm:pt-[186px] md:px-6 lg:ml-72 lg:px-8 lg:py-8 xl:px-8 2xl:px-12">
        <Topbar />
        <div className="mt-4 min-w-0 sm:mt-6">
          <Outlet />
        </div>
      </main>
    </div>
  </div>
);

export default DashboardLayout;
