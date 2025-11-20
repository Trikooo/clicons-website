"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { Copy } from "clicons-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import type { BundledLanguage } from "@/components/ui/shadcn-io/code-block";
import {
  CodeBlock,
  CodeBlockBody,
  CodeBlockContent,
  CodeBlockItem,
  CodeBlockHeader,
  CodeBlockCopyButton,
} from "@/components/ui/shadcn-io/code-block";

export function IconDrawer({
  Icon,
  name,
  tags,
}: {
  Icon: React.ComponentType<any>;
  name: string;
  tags: string[];
}) {
  const [open, setOpen] = useState(false);

  const codeData = {
    react: {
      language: "tsx",
      filename: `${name}.tsx`,
      code: `import { ${name} } from "clicons-react";

export default function Example() {
  return <${name} className="size-6" strokeWidth={1.5}/>;
}`,
    },
  };

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Open badge drawer">
        <Card
          key={name}
          className="flex items-center justify-center w-14 h-14 p-0 hover:bg-card/70"
        >
          <Icon className="size-6" />
        </Card>
      </button>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <DrawerTitle asChild>
            <VisuallyHidden>{name}</VisuallyHidden>
          </DrawerTitle>
          <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10"
              >
                <X className="w-5 h-5" />
              </Button>
            </DrawerClose>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="shrink-0">
                  <div
                    className="relative size-32 sm:size-36 overflow-hidden rounded-lg border"
                    style={{
                      backgroundImage: `linear-gradient(color-mix(in oklch, var(--foreground) 10%, transparent) 1px, transparent 1px),
                    linear-gradient(90deg, color-mix(in oklch, var(--foreground) 10%, transparent) 1px, transparent 1px)`,
                      backgroundSize: "calc(100% / 16) calc(100% / 16)",
                      backgroundColor: "hsl(var(--background))",
                    }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <Icon className="size-20 sm:size-24" />
                    </div>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-3">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
                      {name}
                    </h1>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => navigator.clipboard.writeText(name)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy component name</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {tags?.length ? tags.join(" • ") : "No tags"}
                  </p>
                </div>
              </div>
              <CodeBlock
                data={[codeData.react]}
                defaultValue={codeData.react.language}
              >
                <CodeBlockHeader>
                  <CodeBlockCopyButton />
                </CodeBlockHeader>
                <CodeBlockBody>
                  {(item) => (
                    <CodeBlockItem
                      key={item.language}
                      value={item.language}
                      lineNumbers={false}
                    >
                      <CodeBlockContent
                        language={item.language as BundledLanguage}
                      >
                        {item.code}
                      </CodeBlockContent>
                    </CodeBlockItem>
                  )}
                </CodeBlockBody>
              </CodeBlock>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
