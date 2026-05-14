import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-gray-300 flex flex-col overflow-x-hidden">

            {/* Header */}
            <DashboardHeader
                onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            {/* Main */}
            <div className="flex flex-1 w-full overflow-hidden">

                {/* Sidebar */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                {/* Content */}
                <div className="flex-1 flex flex-col min-w-0">

                    <main className="flex-1 p-4 md:p-8 overflow-y-auto overflow-x-hidden">
                        <Outlet />
                    </main>

                </div>
            </div>
        </div>
    );
};

export default Layout;