import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidenav from "./Sidenav";
import MenuIcon from "@mui/icons-material/Menu";
function LayoutDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className=" lg:grid lg:grid-cols-12 md:whitespace-nowrap whitespace-normal ">
     <div
        className={`lg:sticky h-screen  top-0 left-0 2xl:col-span-2 xl:col-span-3 lg:col-span-4  ${
          isSidebarOpen
            ? "fixed lg:sticky z-50" 
            : "hidden lg:block" 
        }`}
      >
       
        <Sidenav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex-1   overflow-y-auto flex  justify-center items-center  bg-[#2E2E2E]    text-white   2xl:col-span-10 xl:col-span-9 lg:col-span-8  col-span-12 ">
      {!isSidebarOpen && (
        <div
          className="absolute top-6  left-0 lg:hidden block"
          onClick={() => toggleSidebar()}
        >
          <button className="md:text-white text-black text-4xl focus:outline-none">
            <MenuIcon />
          </button>
        </div>
      )}
        <Outlet />
      </div>
    </div>
  );
}

export default LayoutDashboard;
