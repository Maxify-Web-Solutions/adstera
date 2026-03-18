import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Footer from "../../Components/Footer";
import DashboardHeader from "./DashboardHeader";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-gray-300 flex flex-col">

            {/* Header Top */}
            <DashboardHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* Main Section */}
            <div className="flex flex-1">

                {/* Sidebar */}
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                {/* Content */}
                <div className="flex-1 flex flex-col">

                    <main className="md:ml-64 flex-1 p-4 md:p-8 overflow-y-auto min-h-screen transition-all duration-300">
                        <Outlet />
                    </main>


                </div>

            </div>

                    {/* <Footer /> */}
        </div>
    );
};

export default Layout;