"use client";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Icons } from "@/components/icons";
import NavItem from "@/components/nav/navitem";
import Status from "@/components/status";
import { Button } from "@/components/ui/button";
import { useWebSocket } from "@/lib/context/websocket-provider";
import { cn, formatReceipientId, formatTimeAgo, getChatsForUser } from "@/lib/utils";
import { routes } from "@/routing";
import { ChatTab } from "@/types/chat";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeftFromLine, Copy, HelpCircle, Info, Menu, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
//! TODO: CONNECT TO ROUTE



// const activeCagents: CAgent[] = [
//   {
//     status: "Active",
//     type: "Voice",
//     receipientId: "4057194190",
//     id: "1",
//     recentActivity: new Date(),
//   },
//   {
//     status: "Inactive",
//     type: "SMS",
//     receipientId: "4057194190",
//     id: "2",
//     recentActivity: new Date(Date.now() - 1000 * 60 * 2),
//   },
//   {
//     status: "Complete",
//     type: "Voice",
//     receipientId: "4057194190",
//     id: "3",
//     recentActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
//   },
//   {
//     status: "Active",
//     type: "Voice",
//     receipientId: "4057194190",
//     id: "4",
//     recentActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
//   },
//   {
//     status: "Active",
//     type: "Voice",
//     receipientId: "4057194190",
//     id: "5",
//     recentActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
//   },
//   {
//     status: "Active",
//     type: "Voice",
//     receipientId: "4057194190",
//     id: "6",
//     recentActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
//   },
//   {
//     status: "Active",
//     type: "Voice",
//     receipientId: "4057194190",
//     id: "7",
//     recentActivity: new Date(Date.now() - 1000 * 60 * 60 * 2),
//   },
// ];

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSidebarTempOpen, setIsSidebarTempOpen] = useState(false);

  const { currentChatId } = useWebSocket()

  // Modify the mouse enter handler to be smoother
  const handleMouseEnter = () => {
    if (!isSidebarOpen && !isSidebarTempOpen) {
      setIsSidebarTempOpen(true);
      // Add a tiny delay before expanding to prevent flickering
      setTimeout(() => {
        setIsSidebarOpen(true);
      }, 50);
    }
  };

  const handleMouseLeave = () => {
    if (isSidebarTempOpen) {
      setIsSidebarOpen(false);
      setTimeout(() => {
        setIsSidebarTempOpen(false);
      }, 300);
    }
  };

  function handleNavigation() {
    setIsMobileMenuOpen(false);
  }

  const { data: chats, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: getChatsForUser,
  })

  return (
    <>
      <button
        type="button"
        className="lg:hidden fixed top-3 left-3 z-[70] p-2 rounded-lg bg-white dark:bg-[#0F0F12] shadow-md"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-300" />
      </button>
      <nav
        className={`
          fixed inset-y-0 left-0 z-[60] bg-white dark:bg-[#0F0F12]
          transform transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
          lg:translate-x-0 border-r border-gray-200 dark:border-[#1F1F23]
          ${isSidebarOpen ? 'w-64' : 'w-16'}
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:relative
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="h-full flex flex-col">
          <div className={`
            h-16 w-full ${isSidebarOpen ? "md:pl-6" : "pl-2"} pr-2 flex items-center justify-center md:justify-start 
            border-b border-gray-200 dark:border-[#1F1F23]
            transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
          `}>
            <Link
              href="/"
              rel="noopener noreferrer"
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className="relative w-10 h-10 flex-shrink-0">
                <Icons.Logo
                  className={`
                    absolute left-0 top-0 dark:block
                    transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
                    ${!isSidebarOpen ? 'translate-x-0.5' : ''}
                  `}
                  width={40}
                  height={40}
                />
              </div>
              <span className={`
                text-lg font-semibold text-gray-900 dark:text-white
                transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
                ${isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 hidden'}
              `}>
                relaiy
              </span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`
                ml-auto h-9 w-9 p-0 hidden md:flex
                transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
                ${!isSidebarOpen ? 'opacity-0 scale-75 w-0' : 'opacity-100 scale-100'}
              `}
              onClick={() => {
                if (isSidebarOpen && !isSidebarTempOpen) {
                  setIsSidebarOpen(false);
                } else if (isSidebarTempOpen) {
                  setIsSidebarOpen(true);
                  setIsSidebarTempOpen(false);
                }
              }}
            >
              <ArrowLeftFromLine className={`
                transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
                ${isSidebarOpen && isSidebarTempOpen ? 'rotate-180' : ''}
              `} />
            </Button>
          </div>

          <div className={`
            flex-1 overflow-y-auto overflow-x-hidden py-4
            transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]
            ${isSidebarOpen ? "px-4" : "px-2"}
          `}>
            <div className="space-y-6">
              <div>
                <div className={`px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                  Overview
                </div>
                <div className="space-y-1">
                  {routes.filter((route) => route.group === "Overview").map((route) => (
                    <NavItem key={route.name} href={route.href} icon={route.icon} handleNavigation={handleNavigation} collapsed={!isSidebarOpen}>
                      {route.name}
                    </NavItem>
                  ))}
                </div>
              </div>

              <div>
                <div className={`px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                  Modifications
                </div>
                <div className="space-y-1">
                  {routes.filter((route) => route.group === "Modifications").map((route) => (
                    <NavItem key={route.name} href={route.href} icon={route.icon} handleNavigation={handleNavigation} collapsed={!isSidebarOpen}>
                      {route.name}
                    </NavItem>
                  ))}
                </div>
              </div>

              {chats && chats.length > 0 && isSidebarOpen && (
                <div>
                  <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Recent C-Agents
                  </div>
                  <div className="space-y-1">
                    {chats?.map((cagent: ChatTab) => (
                      <Link
                        key={cagent.id + cagent.type + cagent.status + cagent.recipient_address}
                        href={`/conversation/${cagent.id}`}
                        className={cn("gap-4 animate-in fade-in-0 duration-300 w-full flex justify-start items-center px-3 py-1 text-sm rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]", 
                          currentChatId === cagent.id ? "bg-gray-50 dark:bg-[#1F1F23]" : ""
                        )}
                      >
                        <Status status={cagent.status } />
                        <div className="flex flex-col items-start">
                          <div className="flex items-center gap-2">
                            {formatReceipientId(cagent.recipient_address, cagent.type)}
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{`${cagent.type.toUpperCase()} • ${cagent.status.charAt(0).toUpperCase() + cagent.status.slice(1)} ${formatTimeAgo(new Date(cagent.last_activity))}`}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className={`py-4 border-t border-gray-200 dark:border-[#1F1F23] ${isSidebarOpen ? "px-4" : "px-2"} transform transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]`}>
            <div className="space-y-1">
              <NavItem 
                key={"Settings"} 
                href={"/settings"} 
                icon={Settings} 
                handleNavigation={handleNavigation} 
                collapsed={!isSidebarOpen}  
                onClick={(e) => {
                e.preventDefault()
                toast({
                  title: "LLM Config Feature WIP",
                  description: "LLM editing is coming soon!",
                })
              }}>
                Settings
              </NavItem>

              <Dialog>
                <DialogTrigger asChild>
                  <button
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]"
                    )}
                  >
                    <Info className="h-4 w-4" />
                    {!isSidebarOpen ? null : <span>Info</span>}
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Information</DialogTitle>
                    <DialogDescription>
                      Howdy, and thank you for trying <code>relaiy</code>! You're probably here from a friend's github or from Devpost. While we have your attention, thank you for checking out our project!
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-2">
                      <h3 className="font-medium">Devpost</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        This project was built during Hacklahoma 2025 at the University of Oklahoma.
                      </p>
                      <span className="w-full flex justify-evenly items-center gap-2 py-2">
                          <Link href="https://github.com/lryanle/relai-y">
                            <Button >
                              View on Github
                            </Button>
                          </Link>
                          <Link href="https://devpost.com/software/relaiy">
                            <Button variant="outline">
                              View the Devpost
                            </Button>
                          </Link>
                      </span>
                    </div>
                    <div className="grid gap-2">
                      <h3 className="font-medium">Credits</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        This project was built by <Link className="text-blue-500" href="https://github.com/lryanle">Ryan Lahlou</Link>, <Link className="text-blue-500" href="https://github.com/phamleduy04">Duy Pham</Link>, and <Link className="text-blue-500" href="https://github.com/BlueStarBurst">Bryant Hargreaves</Link>.
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Inspiration for this project was derived from <Link href="https://devpost.com/software/social-stockfish-yd1k23">Social Stockfish</Link>, a project from <Link href="https://devfest2025.devpost.com/">Columbia's DevFest 2025</Link>.
                      </p>
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                      <Button type="button" variant="secondary">
                        Close
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[55] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
