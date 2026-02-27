"use client";

import { useBionic } from "@/components/providers/bionic-provider";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

export function BionicToggle() {
  const { isBionic, toggleBionic } = useBionic();
  const t = useTranslations("BionicToggle");

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleBionic}
      className="gap-1 transition-colors px-2"
      title={isBionic ? t("turnOff") : t("turnOn")}
    >
      {isBionic ? (
        <>
          <Eye className="h-4 w-4 text-primary" />
          <span className="font-medium text-primary hidden sm:inline">{t("label")}</span>
        </>
      ) : (
        <>
          <EyeOff className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground hidden sm:inline">{t("label")}</span>
        </>
      )}
    </Button>
  );
}