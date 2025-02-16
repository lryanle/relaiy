"use client";

import { Icons } from "@/components/icons";
import NavItem from "@/components/nav/navitem";
import Status from "@/components/status";
import { formatReceipientId, formatTimeAgo } from "@/lib/utils";
import { routes } from "@/routing";
import { CAgent } from "@/types/types";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
//! TODO: CONNECT TO ROUTE
import { Button } from "@/components/ui/button";



const activeCagents: CAgent[] = [
  {
    status: "Active",
    type: "Voice",
    receipientId: "4057194190",
    id: "1",
    recentActivity: new Date(),
  },
  {
    status: "Inactive",
    type: "SMS",
    receipientId: "4057194190",
    id: "2",
    recentActivity: new Date(Date.now() - 1000 * 60 * 2),
  },
  {
    status: "Complete",
    type: "Voice",
    receipientId: "4057194190",
    id: "3",
    recentActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    status: "Active",
    type: "Voice",
    receipientId: "4057194190",
    id: "4",
    recentActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    status: "Active",
    type: "Voice",
    receipientId: "4057194190",
    id: "5",
    recentActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    status: "Active",
    type: "Voice",
    receipientId: "4057194190",
    id: "6",
    recentActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    status: "Active",
    type: "Voice",
    receipientId: "4057194190",
    id: "7",
    recentActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
];

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  function handleNavigation() {
    setIsMobileMenuOpen(false);
  }


  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-[70] p-2 rounded-lg bg-white dark:bg-[#0F0F12] shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <nav
        className={`
                fixed inset-y-0 left-0 z-[40] w-64 bg-white dark:bg-[#0F0F12] transform transition-transform duration-200 ease-in-out
                lg:translate-x-0 lg:static lg:w-64 border-r border-gray-200 dark:border-[#1F1F23]
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}
      >
        <div className="h-full flex flex-col">
        <div
          className="h-16 w-full pl-6 pr-2 flex justify-between items-center border-b border-gray-200 dark:border-[#1F1F23]"
        >
          <Link
            href="/"
            rel="noopener noreferrer"
            className="flex items-center gap-3"
           >
            <Icons.Logo
              className="flex-shrink-0 hidden dark:block"
              width={40}
              height={40}
            />
            <span className="text-lg font-semibold hover:cursor-pointer text-gray-900 dark:text-white">
              relaiy
            </span>
          </Link>
        </div>

          <div className="flex-1 overflow-y-auto py-4 px-4">
            <div className="space-y-6">
              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Overview
                </div>
                <div className="space-y-1">
                  {routes.filter((route) => route.group === "Overview").map((route) => (
                    <NavItem key={route.name} href={route.href} icon={route.icon} handleNavigation={handleNavigation}>
                      {route.name}
                    </NavItem>
                  ))}
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Modifications
                </div>
                <div className="space-y-1">
                  {routes.filter((route) => route.group === "Modifications").map((route) => (
                    <NavItem key={route.name} href={route.href} icon={route.icon} handleNavigation={handleNavigation}>
                      {route.name}
                    </NavItem>
                  ))}
                </div>
              </div>

              <div>
                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Recent C-Agents
                </div>
                <div className="space-y-1">
                  {activeCagents.map((cagent) => (
                    <Link
                      key={cagent.id + cagent.type + cagent.status + cagent.receipientId + cagent.recentActivity}
                      href={`/?id=${cagent.id}`}
                      className="gap-4 w-full flex justify-start items-center px-3 py-1 text-sm rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]"
                    >
                      <Status status={cagent.status} />
                      <div className="flex flex-col items-start">
                        <div className="flex items-center gap-2">
                          {formatReceipientId(cagent.receipientId, cagent.type)}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{`${cagent.type.toUpperCase()} • active ${formatTimeAgo(cagent.recentActivity)}`}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
            <div className="space-y-1">
              {routes.filter((route) => route.group === "Settings").map((route) => (
                <NavItem key={route.name} href={route.href} icon={route.icon} handleNavigation={handleNavigation}>
                  {route.name}
                </NavItem>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[65] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
