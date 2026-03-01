// Complete DocSidebar Component for API Documentation
// Copy this file to: src/components/doc-sidebar.tsx

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Logo } from "./logo";
import { cn } from "@/utils";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface NavItem {
  title: string;
  url: string;
  isActive?: boolean;
  method?: HttpMethod;
}

interface NavSection {
  title: string;
  url: string;
  items?: NavItem[];
}

// ============================================================================
// NAVIGATION DATA
// ============================================================================

const data: { navMain: NavSection[] } = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
        {
          title: "Introduction",
          url: "/docs",
        },
        {
          title: "Quick Start",
          url: "/docs/quick-start",
        },
      ],
    },
    {
      title: "Querying",
      url: "#",
      items: [
        {
          title: "Overview",
          url: "/docs/query-msisdn",
        },
        {
          title: "Institution Aggregates",
          url: "/docs/institution-aggregates",
          method: "GET",
        },
        {
          title: "Institution Breakdown",
          url: "/docs/institution-breakdown",
          method: "GET",
        },
        {
          title: "MSISDN Aggregates",
          url: "/docs/system-aggregates",
          method: "GET",
        },
        {
          title: "MSISDN Breakdown",
          url: "/docs/system-breakdown",
          method: "GET",
        },
      ],
    },
    {
      title: "Reporting",
      url: "#",
      items: [
        {
          title: "Single Report",
          url: "/docs/single-report",
          method: "POST",
        },
        {
          title: "Bulk Report",
          url: "/docs/bulk-report",
          method: "POST",
        },
      ],
    },
  ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const getMethodColors = (method: HttpMethod, isActive: boolean = false) => {
  if (isActive) {
    const activeColors = {
      GET: "bg-blue-500 text-white",
      POST: "bg-green-500 text-white",
      PUT: "bg-orange-500 text-white",
      DELETE: "bg-red-500 text-white",
      PATCH: "bg-purple-500 text-white",
    };
    return activeColors[method];
  }

  const colors = {
    GET: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400",
    POST: "bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400",
    PUT: "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400",
    DELETE: "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400",
    PATCH:
      "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400",
  };
  return colors[method];
};

// ============================================================================
// COMPONENT
// ============================================================================

export function DocSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="sidebar" {...props}>
      {/* Header with logo and version */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <Logo />
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Documentation</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main navigation content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                {/* Section header */}
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-bold">
                    {item.title}
                  </a>
                </SidebarMenuButton>

                {/* Sub-items (if any) */}
                {item.items?.length ? (
                  <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={subItem.isActive}
                        >
                          <a
                            href={subItem.url}
                            className="flex items-center gap-2"
                          >
                            {/* HTTP method badge */}
                            {subItem.method && (
                              <span
                                className={cn(
                                  "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase",
                                  getMethodColors(
                                    subItem.method,
                                    subItem.isActive,
                                  ),
                                )}
                              >
                                {subItem.method}
                              </span>
                            )}
                            {/* Item title */}
                            <span
                              className={subItem.method ? "text-gray-500" : ""}
                            >
                              {subItem.title}
                            </span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

// ============================================================================
// CUSTOMIZATION GUIDE
// ============================================================================

/*
 * HOW TO CUSTOMIZE:
 *
 * 1. ADD A NEW SECTION:
 *    Add to the data.navMain array:
 *    {
 *      title: "New Section",
 *      url: "#",
 *      items: [
 *        { title: "Item", url: "/docs/item", method: "GET" }
 *      ]
 *    }
 *
 * 2. ADD AN ITEM TO EXISTING SECTION:
 *    Add to the items array within a section:
 *    { title: "New Item", url: "/docs/new-item", method: "POST" }
 *
 * 3. CHANGE VERSION NUMBER:
 *    Edit: <span className="">v1.0.0</span>
 *    To: <span className="">v2.0.0</span>
 *
 * 4. CHANGE SIDEBAR TITLE:
 *    Edit: <span className="font-medium">Documentation</span>
 *    To: <span className="font-medium">API Reference</span>
 *
 * 5. HIDE METHOD BADGES:
 *    Remove the `method` property from an item
 *
 * 6. CHANGE SPACING BETWEEN SECTIONS:
 *    Edit: <SidebarMenu className="gap-2">
 *    Options: gap-1 (tight), gap-2 (default), gap-4 (loose)
 *
 * 7. CHANGE SIDEBAR WIDTH:
 *    In src/routes/docs.tsx, edit SidebarProvider:
 *    style={{ "--sidebar-width": "20rem" }}
 *    (Default is "19rem")
 *
 * 8. HIDE SIDEBAR ON MOBILE:
 *    Add to Sidebar: className="hidden md:block"
 */
