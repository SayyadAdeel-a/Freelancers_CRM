"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/Card";
import { Alert } from "@/components/Alert";

export function Settings() {
  const [user] = useState({
    email: "user@example.com",
    plan: "Free",
  });

  const [apiKey, setApiKey] = useState("");

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card className="p-8">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-mono uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm outline-none"
              value={user.email}
              readOnly
            />
          </div>
        </div>
      </Card>

      {/* Plan Settings */}
      <Card className="p-8">
        <CardHeader>
          <CardTitle>Plan & Billing</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <div>
              <div className="text-sm font-mono font-medium text-gray-900 dark:text-gray-100">
                Current Plan
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{user.plan}</div>
            </div>
            {user.plan === "Free" ? (
              <button className="px-4 py-2 border border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 font-mono text-sm hover:bg-gray-900 hover:text-white dark:hover:bg-gray-100 dark:hover:text-gray-900 transition-colors">
                Upgrade
              </button>
            ) : (
              <button className="px-4 py-2 border border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 font-mono text-sm hover:bg-gray-900 hover:text-white dark:hover:bg-gray-100 dark:hover:text-gray-900 transition-colors">
                Manage Subscription
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* API Settings */}
      <Card className="p-8">
        <CardHeader>
          <CardTitle>API Integration</CardTitle>
        </CardHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-mono uppercase tracking-wider text-gray-600 dark:text-gray-400 mb-1">
              API Key
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 dark:border-gray-600 bg-transparent px-3 py-2 text-sm outline-none font-mono"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <Alert variant="default">
            API keys can be used to integrate with third-party tools and automation workflows.
          </Alert>
        </div>
      </Card>
    </div>
  );
}