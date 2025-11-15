// app/docs/page.tsx

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React from "react";
import { FaGithub } from "react-icons/fa";

export default function DocsPlaceholder() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-2xl w-full rounded-xl border bg-card p-10 text-center shadow-md">
        <h1 className="text-3xl font-bold mb-3">Docs page not created yet</h1>
        <p className="text-sm text-muted-foreground mb-6">
          You can find documentation to this library in the following links:
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Button
            variant="outline"
            href="https://github.com/Trikooo/clicons/tree/main/react/README.md"
          >
            <FaGithub />
            React README
          </Button>
          <Button
            variant="outline"
            href="https://github.com/Trikooo/clicons/tree/main/svelte/README.md"
          >
            <FaGithub />
            Svelte README
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Contributions to this documentation can be submitted as pull requests
          to the project repository:
        </p>
        <Button
          variant="outline"
          href="https://github.com/trikooo/clicons-website"
        >
          <FaGithub />
          clicons-website Repository
        </Button>
      </Card>
    </main>
  );
}
