"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  Truck,
  ShoppingCart,
  FileText,
  TrendingUp,
  Settings,
  Flame,
  ChevronRight,
  LogOut,
  IndianRupee,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

const items = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Inventory", href: "/dashboard/inventory", icon: Package },
  { label: "Deliveries", href: "/dashboard/deliveries", icon: Truck },
  { label: "Collections", href: "/dashboard/collections", icon: IndianRupee },
  { label: "Purchase Orders", href: "/dashboard/purchases", icon: ShoppingCart },
  { label: "Reports", href: "/dashboard/reports", icon: FileText },
  { label: "Profit & Loss", href: "/dashboard/profit", icon: TrendingUp },
];

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border bg-sidebar px-4 py-4">
        <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
                      <Image src="/image.png" alt="logo" width={100} height={100} className=" rounded-full " />
                  </div>
          <div className="flex flex-col overflow-hidden transition-all duration-300 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
            <span className="text-sm font-bold tracking-tight text-sidebar-foreground">Amman Gas</span>
            <span className="text-[10px] font-medium text-sidebar-foreground/50 uppercase tracking-widest leading-none">Management</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-sidebar-foreground/40 mb-2">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className={cn(
                        "transition-all duration-200 h-10 px-3",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90" 
                          : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70 hover:text-sidebar-foreground"
                      )}
                    >
                      <Link href={item.href} onClick={() => setOpenMobile(false)}>
                        <item.icon className={cn("size-4", isActive ? "text-primary-foreground" : "text-sidebar-foreground/40")} />
                        <span className="font-medium tracking-tight ml-1">{item.label}</span>
                        {isActive && (
                          <div className="ml-auto flex size-4 items-center justify-center">
                            <ChevronRight className="size-3 animate-in fade-in slide-in-from-left-1" />
                          </div>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild
              className="hover:bg-sidebar-accent/50 text-sidebar-foreground/70"
              tooltip="Settings"
            >
              <Link href="/dashboard/settings">
                <Settings className="size-4 text-sidebar-foreground/40" />
                <span className="font-medium tracking-tight ml-1">Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={logout}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              tooltip="Logout"
            >
              <LogOut className="size-4" />
              <span className="font-medium tracking-tight ml-1">Logout</span>
              </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
