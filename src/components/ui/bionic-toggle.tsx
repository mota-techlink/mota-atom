"use client";

import { useBionic } from "@/components/providers/bionic-provider";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export function BionicToggle() {
  const { isBionic, toggleBionic } = useBionic();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleBionic}
      className="gap-1 transition-colors px-2"
      title={isBionic ? "Turn off Bionic Reading" : "Turn on Bionic Reading"}
    >
      {isBionic ? (
        <>
          <Eye className="h-4 w-4 text-primary" />
          <span className="font-medium text-primary hidden sm:inline">Bionic</span>
        </>
      ) : (
        <>
          <EyeOff className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground hidden sm:inline">Bionic</span>
        </>
      )}
    </Button>
  );
}