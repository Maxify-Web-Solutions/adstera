import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="h-screen bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-gray-300 flex flex-col overflow-hidden">

            {/* Sticky Header */}
            <header className="sticky top-0 z-50 flex-shrink-0">
                <DashboardHeader
                    onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
                />
            </header>

            {/* Main Area */}
            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />

                {/* Page Content */}
                <main className="flex-1 md:ml-64 overflow-y-auto overflow-x-hidden p-4 md:p-8 min-w-0">
                    <Outlet />
                </main>

            </div>
        </div>
    );
};

export default Layout;