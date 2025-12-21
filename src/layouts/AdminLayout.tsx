"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { LogOut, LayoutDashboard, ChevronLeft, ChevronRight } from 'lucide-react';
import { TopNavBar } from '@/components/TopNavBar';
import { useAuth } from '@/lib/context/useAuth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50">
      {/* Fixed Top Navigation Bar - 64px height */}
      <TopNavBar />

      {/* Main Content Area with Sidebar - starts below nav bar */}
      <div className="pt-16">
        <SidebarProvider>
          {/* Vertical Sidebar with rounded corners and padding - separated from edges */}
          <div 
            className={`fixed top-20 left-4 h-[calc(100vh-6rem)] z-40 transition-all duration-300 ${
              isCollapsed ? 'w-20' : 'w-64'
            }`}
          >
            <div className="h-full bg-white rounded-2xl shadow-sidebar p-4 flex flex-col relative">
              {/* Toggle Button */}
              <button
                onClick={toggleSidebar}
                className="absolute -right-6 top-6 bg-white text-primary-blue rounded-full p-1.5 shadow-lg hover:bg-gray-50 transition-colors z-50 border-2 border-primary-blue/30"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>

              <div className="flex-1 overflow-y-auto">
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive('/admin') || isActive('/admin/dashboard')}
                      className={`text-gray-700 hover:bg-gray-100 data-[active=true]:bg-orange-gradient data-[active=true]:text-white rounded-lg transition-colors ${
                        isCollapsed ? 'justify-center px-2' : ''
                      }`}
                      title={isCollapsed ? 'Dashboard' : ''}
                    >
                      <Link href="/admin/dashboard" className="flex items-center gap-3">
                        <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span>Dashboard</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      onClick={handleLogout}
                      className={`text-gray-700 hover:bg-gray-100 rounded-lg transition-colors ${
                        isCollapsed ? 'justify-center px-2' : ''
                      }`}
                      title={isCollapsed ? 'Log Out' : ''}
                    >
                      <LogOut className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && <span>Log Out</span>}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div 
            className={`flex-1 transition-all duration-300 ${
              isCollapsed ? 'ml-28' : 'ml-72'
            }`}
          >
            <main className="p-8 min-h-[calc(100vh-4rem)] max-w-[calc(100vw-18rem)] lg:max-w-[calc(100vw-20rem)]">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
