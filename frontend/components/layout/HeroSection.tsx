"use client";

import React from "react";
import { Breadcrumb, BreadcrumbItem } from "./Breadcrumb";
import { Button } from "@/components/ui/Button";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  breadcrumbItems?: BreadcrumbItem[];
  backgroundImage?: string;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
  children?: React.ReactNode;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  breadcrumbItems = [],
  backgroundImage = "/interior-banner.png",
  actionButton,
  children,
}) => {
  return (
    <section
      className="bg-gradient-to-r from-blue-700 to-blue-800 text-white py-8 sm:py-16"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          {breadcrumbItems.length > 0 && (
            <Breadcrumb items={breadcrumbItems} className="mb-4" />
          )}

          <h1 className="text-2xl sm:text-4xl font-bold mb-4">{title}</h1>

          {subtitle && (
            <p className="text-lg sm:text-xl text-blue-100 mb-6 max-w-3xl">
              {subtitle}
            </p>
          )}

          {actionButton && (
            <Button
              onClick={actionButton.onClick}
              variant="secondary"
              size="lg"
              className="bg-gray-800 hover:bg-gray-700 text-white cursor-pointer"
            >
              {actionButton.text}
            </Button>
          )}

          {children}
        </div>
      </div>
    </section>
  );
};
