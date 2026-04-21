"use client";


import { Navbar } from "@/components/Navbar";
import { ClientList } from "./ClientList";

export function DashboardLayout() {


  return (
    <div className="flex h-screen">
      {/* Sidebar - minimal, just logo */}
      <aside className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="flex items-center justify-center h-20 border-b border-gray-200 dark:border-gray-800">
          <span className="text-2xl font-light font-mono text-gray-900 dark:text-gray-100">
            Nudge
          </span>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#dashboard" className="block px-3 py-2 text-gray-600 dark:text-gray-400 text-sm font-mono hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            Clients
          </a>
          <a href="#settings" className="block px-3 py-2 text-gray-600 dark:text-gray-400 text-sm font-mono hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
            Settings
          </a>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          <ClientList />
        </main>
      </div>
    </div>
  );
}