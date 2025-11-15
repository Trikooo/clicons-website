"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import { FaGithub } from "react-icons/fa";
import { Button } from "./ui/button";
import Link from "next/link";

const Logo = (props: React.SVGAttributes<SVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 324 323"
    fill="currentColor"
    {...props}
  >
    <rect
      x="88.1023"
      y="144.792"
      width="151.802"
      height="36.5788"
      rx="18.2894"
      transform="rotate(-38.5799 88.1023 144.792)"
    />
    <rect
      x="85.3459"
      y="244.537"
      width="151.802"
      height="36.5788"
      rx="18.2894"
      transform="rotate(-38.5799 85.3459 244.537)"
    />
  </svg>
);

export function Navbar(props: React.HTMLAttributes<HTMLElement>) {
  return (
    <header
      className={cn(
        "w-full border-b bg-background/95 backdrop-blur px-4 md:px-6",
        props.className
      )}
      {...props}
    >
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer select-none">
              <Logo className="text-2xl" />
              <span className="font-bold text-xl">clicons</span>
            </div>
          </Link>

          <nav className="flex items-center gap-4 ml-6">
            <a
              href="/docs"
              className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              Docs
            </a>
          </nav>
        </div>

        <Button
          variant="ghost"
          size="icon"
          asChild
          href="https://github.com/trikooo/clicons"
        >
          <Link href="https://github.com/trikooo/clicons">
            <FaGithub className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </header>
  );
}
