"use client";
import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  BellIcon,
  BookIcon,
  LogOutIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import toast from "react-hot-toast";
import { useTheme } from "@/hooks/theme";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Your Notes",
    url: "/your-notes",
    icon: BookIcon,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: BellIcon,
  },
  // {
  //   title: "Search",
  //   url: "/search",
  //   icon: Search,
  // },
  {
    title: "Profile Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { logout } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    toast.success("Logged out successfully");
  };
  const { isDark, setIsDark } = useTheme();

  return (
    <Sidebar
      className={`w-64 shadow-lg ${isDark ? "bg-gray-800" : "bg-white"}`}
    >
      <SidebarContent>
        <SidebarGroup className={`${isDark ? "bg-gray-800 text-gray-100" : "bg-white"}`}>
          <SidebarGroupLabel className={`${isDark ? "bg-gray-800 text-gray-100" : "bg-white"}`}>Categories</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className={`${isDark ? "bg-gray-800 text-gray-100 " : "bg-white"}`}>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem key="Logout" className="text-red-800 font-bold">
                <SidebarMenuButton asChild>
                  <a href="#" onClick={handleLogout}>
                    <LogOutIcon />
                    <span>Logout</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
