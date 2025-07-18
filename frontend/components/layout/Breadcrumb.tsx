"use client";

import React from "react";
import { ChevronRight, Home } from "lucide-react";
import { clsx } from "clsx";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav className={clsx("flex", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 text-sm">
        <li>
          <a
            href="https://www.metisnation.org/"
            className="text-blue-200 hover:text-white flex items-center focus:outline-none focus:ring-2 focus:ring-blue-300 rounded px-1"
            aria-label="Go to MNO Home"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span className="sr-only">Home</span>
          </a>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight
              className="w-4 h-4 text-blue-200 mx-1"
              aria-hidden="true"
            />
            {item.href ? (
              <a
                href={item.href}
                className="text-blue-200 hover:text-white px-1 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-white font-medium px-1" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
