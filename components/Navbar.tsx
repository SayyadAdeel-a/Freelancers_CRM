"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

export function Navbar() {
  const [isClientMenuOpen, setIsClientMenuOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <span className="text-2xl font-light font-mono tracking-wider text-gray-900 dark:text-gray-100">
            Nudge
          </span>
          <div className="hidden md:flex items-center gap-8">
            <a href="#dashboard" className="text-gray-600 dark:text-gray-400 text-sm font-mono hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Dashboard
            </a>
            <a href="#settings" className="text-gray-600 dark:text-gray-400 text-sm font-mono hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              Settings
            </a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm">
            Sign Out
          </Button>
        </div>
      </div>
    </nav>
  );
}