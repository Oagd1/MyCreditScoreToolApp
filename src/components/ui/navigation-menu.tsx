"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Ensure this exists
import { ChevronDownIcon } from "@radix-ui/react-icons"; // Radix UI icon

import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";

// Exporting all necessary components
export const NavigationMenu = NavigationMenuPrimitive.Root;
export const NavigationMenuList = NavigationMenuPrimitive.List;
export const NavigationMenuItem = NavigationMenuPrimitive.Item;
export const NavigationMenuTrigger = NavigationMenuPrimitive.Trigger;
export const NavigationMenuContent = NavigationMenuPrimitive.Content;
export const NavigationMenuLink = NavigationMenuPrimitive.Link;

// Trigger Style Function
export const navigationMenuTriggerStyle = (className?: string) =>
  cn(
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
    className
  );

// Navigation Menu Component
export const NavigationMenuDemo = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
            Menu <ChevronDownIcon className="ml-2" />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-white shadow-md rounded-md p-4">
            <NavigationMenuLink asChild>
              <Link href="/" className="block px-4 py-2 hover:bg-gray-200">
                Home
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link href="/about" className="block px-4 py-2 hover:bg-gray-200">
                About Us
              </Link>
            </NavigationMenuLink>
            <NavigationMenuLink asChild>
              <Link href="/contact" className="block px-4 py-2 hover:bg-gray-200">
                Contact
              </Link>
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
