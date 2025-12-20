import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { LogOut, LayoutDashboard, ChevronLeft, ChevronRight, Users, GraduationCap, FileText, DollarSign, BarChart3, Settings, MessageSquare, MapPin } from 'lucide-react';
import { TopNavBar } from '@/components/TopNavBar';
import { useAuth } from '@/lib/context/useAuth';
import { hasPermission, PERMISSIONS } from '@/lib/permissions';

export default function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isActive = (path: string) => location.pathname === path;

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
                  {/* Dashboard - Visible to All Admins */}
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      asChild 
                      isActive={isActive('/admin') || isActive('/admin/dashboard')}
                      className={`text-gray-700 hover:bg-gray-100 data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#D70F0E] data-[active=true]:to-[#E5600B] data-[active=true]:text-white rounded-lg transition-colors ${
                        isCollapsed ? 'justify-center px-2' : ''
                      }`}
                      title={isCollapsed ? 'Dashboard' : ''}
                    >
                      <Link to="/admin/dashboard" className="flex items-center gap-3">
                        <LayoutDashboard className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span>Dashboard</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Members / Teacher Management */}
                  {(hasPermission(user, PERMISSIONS.VIEW_ALL_MEMBERS) || hasPermission(user, PERMISSIONS.VIEW_REGION_MEMBERS)) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive('/admin/teacher-management')}
                        className={`text-gray-700 hover:bg-gray-100 data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#D70F0E] data-[active=true]:to-[#E5600B] data-[active=true]:text-white rounded-lg transition-colors ${
                          isCollapsed ? 'justify-center px-2' : ''
                        }`}
                        title={isCollapsed ? 'Members' : ''}
                      >
                        <Link to="/admin/teacher-management" className="flex items-center gap-3">
                          <GraduationCap className="h-5 w-5 flex-shrink-0" />
                          {!isCollapsed && <span>Members</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}

                  {/* Join Applications */}
                  {(hasPermission(user, PERMISSIONS.APPROVE_MEMBERS_SINGLE) || hasPermission(user, PERMISSIONS.APPROVE_MEMBERS_BATCH)) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive('/admin/join-applications')}
                        className={`text-gray-700 hover:bg-gray-100 data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#D70F0E] data-[active=true]:to-[#E5600B] data-[active=true]:text-white rounded-lg transition-colors ${
                          isCollapsed ? 'justify-center px-2' : ''
                        }`}
                        title={isCollapsed ? 'Join Applications' : ''}
                      >
                        <Link to="/admin/join-applications" className="flex items-center gap-3">
                          <FileText className="h-5 w-5 flex-shrink-0" />
                          {!isCollapsed && <span>Join Applications</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}

                  {/* Approvals - Only for President/VP/Super Admin */}
                  {(user?.role === 'president' || user?.role === 'vice_president' || user?.role === 'super_admin') && (
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive('/admin/approvals')}
                        className={`text-gray-700 hover:bg-gray-100 data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#D70F0E] data-[active=true]:to-[#E5600B] data-[active=true]:text-white rounded-lg transition-colors ${
                          isCollapsed ? 'justify-center px-2' : ''
                        }`}
                        title={isCollapsed ? 'Approvals' : ''}
                      >
                        <Link to="/admin/approvals" className="flex items-center gap-3">
                          <MessageSquare className="h-5 w-5 flex-shrink-0" />
                          {!isCollapsed && <span>Approvals</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}

                  {/* Financials / Referrals */}
                  {(hasPermission(user, PERMISSIONS.VIEW_ALL_FINANCIALS) || hasPermission(user, PERMISSIONS.APPROVE_PAYOUTS)) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive('/admin/referrals')}
                        className={`text-gray-700 hover:bg-gray-100 data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#D70F0E] data-[active=true]:to-[#E5600B] data-[active=true]:text-white rounded-lg transition-colors ${
                          isCollapsed ? 'justify-center px-2' : ''
                        }`}
                        title={isCollapsed ? 'Financials' : ''}
                      >
                        <Link to="/admin/referrals" className="flex items-center gap-3">
                          <DollarSign className="h-5 w-5 flex-shrink-0" />
                          {!isCollapsed && <span>Financials</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}

                  {/* Reports */}
                  {(hasPermission(user, PERMISSIONS.VIEW_ALL_MEMBERS) || hasPermission(user, PERMISSIONS.VIEW_REGION_MEMBERS)) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive('/admin/reports')}
                        className={`text-gray-700 hover:bg-gray-100 data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#D70F0E] data-[active=true]:to-[#E5600B] data-[active=true]:text-white rounded-lg transition-colors ${
                          isCollapsed ? 'justify-center px-2' : ''
                        }`}
                        title={isCollapsed ? 'Reports' : ''}
                      >
                        <Link to="/admin/reports" className="flex items-center gap-3">
                          <BarChart3 className="h-5 w-5 flex-shrink-0" />
                          {!isCollapsed && <span>Reports</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}

                  {/* Region Management */}
                  {hasPermission(user, PERMISSIONS.MANAGE_USERS) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive('/admin/regions')}
                        className={`text-gray-700 hover:bg-gray-100 data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#D70F0E] data-[active=true]:to-[#E5600B] data-[active=true]:text-white rounded-lg transition-colors ${
                          isCollapsed ? 'justify-center px-2' : ''
                        }`}
                        title={isCollapsed ? 'Regions' : ''}
                      >
                        <Link to="/admin/regions" className="flex items-center gap-3">
                          <MapPin className="h-5 w-5 flex-shrink-0" />
                          {!isCollapsed && <span>Regions</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}

                  {/* User Management */}
                  {hasPermission(user, PERMISSIONS.MANAGE_USERS) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive('/admin/team-management')}
                        className={`text-gray-700 hover:bg-gray-100 data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#D70F0E] data-[active=true]:to-[#E5600B] data-[active=true]:text-white rounded-lg transition-colors ${
                          isCollapsed ? 'justify-center px-2' : ''
                        }`}
                        title={isCollapsed ? 'User Management' : ''}
                      >
                        <Link to="/admin/team-management" className="flex items-center gap-3">
                          <Users className="h-5 w-5 flex-shrink-0" />
                          {!isCollapsed && <span>User Management</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}

                  {/* System Settings / Audit Logs */}
                  {(hasPermission(user, PERMISSIONS.SYSTEM_SETTINGS) || hasPermission(user, PERMISSIONS.VIEW_AUDIT_LOGS)) && (
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive('/admin/settings')}
                        className={`text-gray-700 hover:bg-gray-100 data-[active=true]:bg-gradient-to-r data-[active=true]:from-[#D70F0E] data-[active=true]:to-[#E5600B] data-[active=true]:text-white rounded-lg transition-colors ${
                          isCollapsed ? 'justify-center px-2' : ''
                        }`}
                        title={isCollapsed ? 'System' : ''}
                      >
                        <Link to="/admin/settings" className="flex items-center gap-3">
                          <Settings className="h-5 w-5 flex-shrink-0" />
                          {!isCollapsed && <span>System</span>}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
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
              <Outlet />
            </main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
}
