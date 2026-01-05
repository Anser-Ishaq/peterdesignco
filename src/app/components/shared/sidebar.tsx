"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardIcon,
  ProductIcon,
  TeamIcon,
  CourseIcon,
  LeadsIcon,
  EmailIcon,
  ModelIcon,
  ListIcon,
  PlusIcon,
  UserIcon,
  SettingsIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  CareerIcon,
} from "@/app/components/ui/icons";

// Type definitions for navigation items
interface SubNavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface NavItemWithDropdown {
  name: string;
  icon: React.ReactNode;
  hasDropdown: true;
  subItems: SubNavItem[];
  href?: never;
}

interface NavItemWithoutDropdown {
  name: string;
  href: string;
  icon: React.ReactNode;
  hasDropdown?: never;
  subItems?: never;
}

type NavItem = NavItemWithDropdown | NavItemWithoutDropdown;

// Navigation items for admin users
const adminNavItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Products",
    icon: <ProductIcon />,
    hasDropdown: true,
    subItems: [
      {
        name: "Product Listing",
        href: "/dashboard/products",
        icon: <ListIcon />,
      },
      {
        name: "Add Product",
        href: "/dashboard/products/add",
        icon: <PlusIcon />,
      },
    ],
  },
  {
    name: "Team",
    icon: <TeamIcon />,
    hasDropdown: true,
    subItems: [
      {
        name: "Team Listing",
        href: "/dashboard/team",
        icon: <ListIcon />,
      },
      {
        name: "Add Team",
        href: "/dashboard/team/add",
        icon: <PlusIcon />,
      },
    ],
  },
  {
    name: "Courses",
    icon: <CourseIcon />,
    hasDropdown: true,
    subItems: [
      {
        name: "Course List",
        href: "/dashboard/courses",
        icon: <ListIcon />,
      },
      {
        name: "Create Course",
        href: "/dashboard/courses/create",
        icon: <EditIcon />,
      },
    ],
  },
  {
    name: "Careers",
    icon: <CareerIcon />,
    hasDropdown: true,
    subItems: [
      {
        name: "Career List",
        href: "/dashboard/careers",
        icon: <ListIcon />,
      },
      {
        name: "Add Career",
        href: "/dashboard/careers/add",
        icon: <PlusIcon />,
      },
    ],
  },
  {
    name: "Leads",
    icon: <LeadsIcon />,
    hasDropdown: true,
    subItems: [
      {
        name: "Lead List",
        href: "/dashboard/leads",
        icon: <ListIcon />,
      },
      {
        name: "Add Lead",
        href: "/dashboard/leads/add",
        icon: <PlusIcon />,
      },
    ],
  },
  {
    name: "Email Template",
    icon: <EmailIcon />,
    hasDropdown: true,
    subItems: [
      {
        name: "Template List",
        href: "/dashboard/email-templates",
        icon: <ListIcon />,
      },
      {
        name: "Create Template",
        href: "/dashboard/email-templates/add",
        icon: <PlusIcon />,
      },
    ],
  },
  {
    name: "Model Template",
    icon: <ModelIcon />,
    hasDropdown: true,
    subItems: [
      {
        name: "Model List",
        href: "/dashboard/model-templates",
        icon: <ListIcon />,
      },
      {
        name: "Upload Model",
        href: "/dashboard/model-templates/add",
        icon: <PlusIcon />,
      },
    ],
  },
];

// Navigation items for regular users
const userNavItems: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "My Orders",
    href: "/dashboard/leads",
    icon: <LeadsIcon />,
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: <UserIcon />,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: <SettingsIcon />,
  },
];

interface SidebarProps {
  userRole?: "admin" | "user";
  isCollapsed?: boolean;
}

export default function Sidebar({
  userRole = "user",
  isCollapsed = false,
}: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [openDropdowns, setOpenDropdowns] = useState<string[]>([]);

  // Select navigation items based on user role
  const navItems = userRole === "admin" ? adminNavItems : userNavItems;

  const toggleDropdown = (itemName: string) => {
    setOpenDropdowns(prev => 
      prev.includes(itemName) 
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isDropdownOpen = (itemName: string) => openDropdowns.includes(itemName);

  return (
    <div
      className={`bg-white shadow-lg transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      } min-h-screen flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-xl font-bold text-gray-800">
              {userRole === "admin" ? "Admin Panel" : "Dashboard"}
            </h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const hasDropdown = item.hasDropdown && item.subItems;
            const isActive = item.href ? pathname === item.href : false;
            const hasActiveSubItem = hasDropdown && item.subItems?.some(subItem => pathname === subItem.href);
            const dropdownOpen = isDropdownOpen(item.name);

            return (
              <li key={item.name}>
                {hasDropdown ? (
                  <>
                    {/* Dropdown Parent */}
                    <button
                      onClick={() => !collapsed && toggleDropdown(item.name)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        hasActiveSubItem
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="mr-3">{item.icon}</span>
                        {!collapsed && (
                          <span className="font-medium">{item.name}</span>
                        )}
                      </div>
                      {!collapsed && (
                        <ChevronDownIcon 
                          className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                        />
                      )}
                    </button>
                    
                    {/* Dropdown Items */}
                    {!collapsed && dropdownOpen && (
                      <ul className="ml-4 mt-1 space-y-1">
                        {item.subItems?.map((subItem) => {
                          const isSubActive = pathname === subItem.href;
                          return (
                            <li key={subItem.name}>
                              <Link
                                href={subItem.href}
                                className={`flex items-center p-2 rounded-lg transition-colors ${
                                  isSubActive
                                    ? "bg-blue-100 text-blue-700 border-r-4 border-blue-700"
                                    : "text-gray-600 hover:bg-gray-50"
                                }`}
                              >
                                <span className="mr-2">{subItem.icon}</span>
                                <span className="text-sm font-medium">{subItem.name}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  /* Regular Link */
                  <Link
                    href={item.href!}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-700 border-r-4 border-blue-700"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {!collapsed && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        {!collapsed && (
          <div className="text-sm text-gray-500">
            Role: <span className="font-medium capitalize">{userRole}</span>
          </div>
        )}
      </div>
    </div>
  );
}