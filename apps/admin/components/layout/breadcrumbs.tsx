"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@repo/ui/registry/new-york-v4/ui/breadcrumb";

// Helper to format the label for the breadcrumb
function formatLabel(segment: string) {
  return segment.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

// Helper to detect if a segment is a UUID
function isUUID(segment: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    segment
  );
}

// Helper to detect if a segment is a number
function isNumeric(segment: string) {
  return /^\d+$/.test(segment);
}

// Helper to detect if a segment is a parameter
function isParameterSegment(segment: string) {
  return isUUID(segment) || isNumeric(segment);
}

// Helper function for rendering breadcrumb content
function renderBreadcrumbContent(crumb: {
  isParam: boolean;
  isLast: boolean;
  label: string;
  href: string;
}) {
  if (crumb.isParam) {
    return <BreadcrumbEllipsis />;
  }
  if (crumb.isLast) {
    return <BreadcrumbPage>{crumb.label}</BreadcrumbPage>;
  }
  return <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  // Split the pathname into segments
  const segments = useMemo(
    () => pathname.split("/").filter(Boolean),
    [pathname]
  );

  // Create the breadcrumbs
  const crumbs = useMemo(
    () =>
      segments.map((segment, idx) => {
        // Create the href for the breadcrumb by joining the segments
        // e.g. [users, 123] -> /users/123
        const href = "/" + segments.slice(0, idx + 1).join("/");

        // Detect parameter segment
        const isParam = isParameterSegment(segment);

        return {
          href,
          label: formatLabel(segment),
          isLast: idx === segments.length - 1,
          isParam,
        };
      }),
    [segments]
  );

  return (
    <Breadcrumb aria-label="Breadcrumb">
      <BreadcrumbList>
        {crumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.href + idx}>
            <BreadcrumbItem>{renderBreadcrumbContent(crumb)}</BreadcrumbItem>
            {idx < crumbs.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
