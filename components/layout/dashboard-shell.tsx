"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Get current page title from pathname
  const getPageTitle = (path: string) => {
    const parts = path.split("/");
    const last = parts[parts.length - 1];
    if (last === "dashboard") return "Overview";
    return last.charAt(0).toUpperCase() + last.slice(1).replace("-", " ");
  };

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background overflow-hidden">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden transition-all duration-300">
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b bg-background/80 px-4 py-4 backdrop-blur-md transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-border mx-2" />
            <h1 className="text-sm font-bold tracking-tight text-foreground md:text-base">
              {getPageTitle(pathname)}
            </h1>
            
            <div className="ml-auto flex items-center gap-2 md:gap-4">
              <div className="hidden items-center gap-2 rounded-full border bg-muted/30 px-3 py-1.5 md:flex ring-offset-background transition-all hover:bg-muted/50 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
                <Search className="size-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Universal search..." 
                  className="bg-transparent text-xs outline-none w-40"
                />
                <kbd className="hidden rounded border bg-background px-1.5 text-[10px] font-medium text-muted-foreground md:inline-block">
                  ⌘K
                </kbd>
              </div>
              
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                <Bell className="size-5" />
                <span className="absolute top-2 right-2 flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex size-2 rounded-full bg-primary"></span>
                </span>
              </Button>
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-4 md:p-8">
            <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-500">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
