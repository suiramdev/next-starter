"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/registry/new-york-v4/ui/breadcrumb";
import { useSelectedLayoutSegments } from "next/navigation";

export default function BreadcrumbSlot() {
  const segment = useSelectedLayoutSegments();
  const segments = segment.slice(1);

  const breadcrumbItems = segments.map((segment) => (
    <React.Fragment key={segment}>
      <BreadcrumbItem>
        <BreadcrumbLink href={`/${segments.join("/")}`} className="capitalize">
          {segment}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
    </React.Fragment>
  ));

  const breadcrumbPage =
    segments.length > 0 ? (
      <BreadcrumbPage className="capitalize">
        {segments[segments.length - 1]}
      </BreadcrumbPage>
    ) : (
      <BreadcrumbPage>Homepage</BreadcrumbPage>
    );

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems}
        {breadcrumbPage}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
