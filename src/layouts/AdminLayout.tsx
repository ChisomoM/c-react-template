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
import { LogOut, LayoutDashboard, ChevronLeft, ChevronRight, Package, ShoppingCart, Users, User, Store } from 'lucide-react';
import { useAuth } from '@/lib/context/useAuth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    logout();
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Main Content Area with Sidebar */}
      <div className="flex">
        <SidebarProvider>
          {/* Full-height Luxury Sidebar - charcoal with gold accents */}
          <div
            className={`fixed top-0 left-0 h-screen z-40 transition-all duration-300 bg-charcoal ${
              isCollapsed ? 'w-20' : 'w-72'
            }`}
          >
            <div className="h-full flex flex-col relative">
              {/* Toggle Button */}
              <button
                onClick={toggleSidebar}
                className="absolute -right-4 top-8 bg-charcoal text-gold-primary rounded-full p-1.5 shadow-lg hover:bg-gold-primary hover:text-charcoal transition-all duration-300 z-50 border border-gold-dark"
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </button>

              {/* Store Logo/Name Section */}
              {!isCollapsed && (
                <div className="px-6 py-8 border-b border-gray-600/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gold-primary flex items-center justify-center">
                      <Store className="h-6 w-6 text-charcoal" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-sora font-bold text-white text-lg tracking-tight">
                        Luxury
                      </h2>
                      <p className="font-sora font-light text-gray-600 text-xs">
                        Admin Panel
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {isCollapsed && (
                <div className="px-4 py-8 border-b border-gray-600/30 flex justify-center">
                  <div className="w-10 h-10 rounded-full bg-gold-primary flex items-center justify-center">
                    <Store className="h-5 w-5 text-charcoal" />
                  </div>
                </div>
              )}

              {/* Navigation Menu */}
              <div className="flex-1 overflow-y-auto py-6 px-4">
                <SidebarMenu className="space-y-2">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive('/admin') || isActive('/admin/dashboard')}
                      className={`text-gray-300 hover:bg-gray-900 hover:text-white data-[active=true]:bg-gold-primary data-[active=true]:text-charcoal rounded-lg transition-all duration-300 font-sora ${
                        isCollapsed ? 'justify-center px-2' : ''
                      }`}
                      title={isCollapsed ? 'Dashboard' : ''}
                    >
                      <Link href="/admin/dashboard" className="flex items-center gap-4 py-3 px-3">
                        <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span className="font-medium">Dashboard</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname?.startsWith('/admin/products')}
                      className={`text-gray-300 hover:bg-gray-900 hover:text-white data-[active=true]:bg-gold-primary data-[active=true]:text-charcoal rounded-lg transition-all duration-300 font-sora ${
                        isCollapsed ? 'justify-center px-2' : ''
                      }`}
                      title={isCollapsed ? 'Products' : ''}
                    >
                      <Link href="/admin/products" className="flex items-center gap-4 py-3 px-3">
                        <Package className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span className="font-medium">Products</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname?.startsWith('/admin/orders')}
                      className={`text-gray-300 hover:bg-gray-900 hover:text-white data-[active=true]:bg-gold-primary data-[active=true]:text-charcoal rounded-lg transition-all duration-300 font-sora ${
                        isCollapsed ? 'justify-center px-2' : ''
                      }`}
                      title={isCollapsed ? 'Orders' : ''}
                    >
                      <Link href="/admin/orders" className="flex items-center gap-4 py-3 px-3">
                        <ShoppingCart className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span className="font-medium">Orders</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname?.startsWith('/admin/users')}
                      className={`text-gray-300 hover:bg-gray-900 hover:text-white data-[active=true]:bg-gold-primary data-[active=true]:text-charcoal rounded-lg transition-all duration-300 font-sora ${
                        isCollapsed ? 'justify-center px-2' : ''
                      }`}
                      title={isCollapsed ? 'Users' : ''}
                    >
                      <Link href="/admin/users" className="flex items-center gap-4 py-3 px-3">
                        <Users className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span className="font-medium">Users</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                   <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname?.startsWith('/admin/branches')}
                      className={`text-gray-300 hover:bg-gray-900 hover:text-white data-[active=true]:bg-gold-primary data-[active=true]:text-charcoal rounded-lg transition-all duration-300 font-sora ${
                        isCollapsed ? 'justify-center px-2' : ''
                      }`}
                      title={isCollapsed ? 'Branches' : ''}
                    >
                      <Link href="/admin/branches" className="flex items-center gap-4 py-3 px-3">
                        <Store className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span className="font-medium">Branches</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </div>

              {/* Account & Logout Section */}
              <div className="border-t border-gray-600/30">
                {/* User Account Section */}
                {!isCollapsed && (
                  <div className="px-6 py-4 border-b border-gray-600/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gold-primary/10 flex items-center justify-center border border-gold-dark/30">
                        <User className="h-5 w-5 text-gold-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-sora font-semibold text-white text-sm truncate">
                          {user?.first_name && user?.last_name
                            ? `${user.first_name} ${user.last_name}`
                            : user?.username || 'Admin User'}
                        </h4>
                        <p className="font-sora font-light text-gray-600 text-xs truncate">
                          {user?.email || 'admin@example.com'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {isCollapsed && (
                  <div className="px-4 py-4 border-b border-gray-600/30 flex justify-center">
                    <div className="w-8 h-8 rounded-full bg-gold-primary/10 flex items-center justify-center border border-gold-dark/30">
                      <User className="h-4 w-4 text-gold-primary" />
                    </div>
                  </div>
                )}

                {/* Logout Section */}
                <div className="py-6 px-4">
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={handleLogout}
                        className={`text-gray-300 hover:bg-gray-900 hover:text-gold-primary rounded-lg transition-all duration-300 font-sora ${
                          isCollapsed ? 'justify-center px-2' : ''
                        }`}
                        title={isCollapsed ? 'Log Out' : ''}
                      >
                        <div className="flex items-center gap-4 py-3 px-3">
                          <LogOut className="h-5 w-5 flex-shrink-0" />
                          {!isCollapsed && <span className="font-medium">Log Out</span>}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </div>
              </div>
            </div>
          </div>

          {/* Main content area */}
          <div
            className={`flex-1 transition-all duration-300 ${
              isCollapsed ? 'ml-20' : 'ml-72'
            }`}
          >
            <main className="p-8 min-h-screen">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
