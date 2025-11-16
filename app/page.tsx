"use client";

import * as libRaw from "clicons-react";
import { Input } from "@/components/ui/input";
import { Search } from "clicons-react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { IconDrawer } from "@/components/icon-drawer";
import { useRef, useState, useLayoutEffect, useMemo, useEffect } from "react";
import Fuse from "fuse.js";
import { useIconMetadata } from "@/hooks/use-icon-metadata";
import { toast } from "sonner";
import { Loader, Loader2 } from "lucide-react";

const lib = libRaw as Record<string, React.ComponentType<any>>;

export default function Page() {
  const parentRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [missingIcons, setMissingIcons] = useState<Set<string>>(new Set());

  const { data: metadata, isPending, isError, error } = useIconMetadata();

  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch metadata");
    }
  }, [isError]);

  // Check for missing icons when metadata loads
  useEffect(() => {
    if (metadata?.icons) {
      const missing = metadata.icons
        .filter((icon) => !lib[icon.name])
        .map((icon) => icon.name);

      if (missing.length > 0) {
        const missingSet = new Set(missing);
        setMissingIcons(missingSet);

        // Show error toast
        toast.error(
          `${missing.length} icon${
            missing.length > 1 ? "s" : ""
          } failed to load`,
          {
            description: "Some icons are missing from the library",
          }
        );

        // Console error in dev mode
        if (process.env.NODE_ENV === "development") {
          toast.error(
            `${missing.length} icon${
              missing.length > 1 ? "s" : ""
            } failed to load`,
            {
              description: "Some icons are missing from the library",
            }
          );
          console.error("Missing icons:", missing);
          console.error("Total missing:", missing.length);
        }
      }
    }
  }, [metadata]);

  const fuse = useMemo(() => {
    if (!metadata?.icons) return null;

    // Filter out missing icons from search
    const validIcons = metadata.icons.filter(
      (icon) => !missingIcons.has(icon.name)
    );

    return new Fuse(validIcons, {
      keys: [
        { name: "name", weight: 1 },
        { name: "tags", weight: 0.3 },
      ],
      includeScore: true,
      threshold: 0.05,
      ignoreLocation: true,
      minMatchCharLength: 1,
      shouldSort: true,
    });
  }, [metadata, missingIcons]);

  const filtered = useMemo(() => {
    if (!metadata?.icons) return [];

    // Filter out missing icons
    const validIcons = metadata.icons.filter(
      (icon) => !missingIcons.has(icon.name)
    );

    if (!searchQuery.trim()) return validIcons;
    if (!fuse) return [];
    return fuse.search(searchQuery).map((r) => r.item);
  }, [metadata, searchQuery, fuse, missingIcons]);

  useLayoutEffect(() => {
    const updateWidth = () => {
      if (parentRef.current) setContainerWidth(parentRef.current.offsetWidth);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (((e.metaKey || e.ctrlKey) && e.key === "k") || e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const itemSize = 80;
  const gap = 10;
  const itemsPerRow = Math.max(
    1,
    Math.floor((containerWidth + gap) / (itemSize + gap))
  );
  const rowCount = Math.ceil(filtered.length / itemsPerRow);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemSize + gap,
    overscan: 5,
  });

  return (
    <div
      ref={parentRef}
      className="w-full max-w-[1920px] h-screen overflow-auto"
    >
      <div className="sticky top-0 z-10 pt-8 pb-6 px-8 bg-linear-to-b from-background from-85% to-transparent">
        <div className="relative flex-1 w-full">
          {isPending && (
            <libRaw.Loading3 className="size-4 absolute right-16 top-1/2 -translate-y-1/2 animate-spin" />
          )}
          <KbdGroup className="absolute right-3 top-1/2 -translate-y-1/2">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder={`Search ${filtered.length} icons ...`}
            className="p-6 pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="pb-8 px-8">
        <div
          style={{
            height: rowVirtualizer.getTotalSize(),
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const start = virtualRow.index * itemsPerRow;
            const end = Math.min(start + itemsPerRow, filtered.length);
            const rowItems = filtered.slice(start, end);

            return (
              <div
                key={virtualRow.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  display: "flex",
                  gap: `${gap}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {rowItems.map((icon) => {
                  const Icon = lib[icon.name];

                  // Skip if icon doesn't exist (should be filtered out, but extra safety)
                  if (!Icon) {
                    if (process.env.NODE_ENV === "development") {
                      console.warn(
                        `Icon component not found during render: ${icon.name}`
                      );
                    }
                    return null;
                  }

                  return (
                    <div
                      key={icon.name}
                      style={{
                        width: `${itemSize}px`,
                        height: `${itemSize}px`,
                        flexShrink: 0,
                      }}
                    >
                      <IconDrawer
                        Icon={Icon}
                        name={icon.name}
                        tags={icon.tags}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
