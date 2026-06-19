import React from "react";
import { Trash2, RotateCcw, Scale } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useConfigurator } from "@/context/ConfiguratorContext";

export default function SavedConfigsList() {
  const { savedConfigs, deleteSavedConfiguration, loadConfiguration, compareIds, toggleCompare } =
    useConfigurator();

  if (savedConfigs.length === 0) {
    return (
      <p className="text-xs text-stone py-2">
        No saved builds yet. Save your current configuration to compare it later.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-2">
      {savedConfigs.map((config) => {
        const inCompare = compareIds.includes(config.id);
        return (
          <li
            key={config.id}
            className="flex items-center justify-between gap-2 rounded-md border border-stone-light bg-card px-3 py-2"
          >
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium text-espresso truncate">{config.name}</span>
              <span className="font-mono text-xs text-stone">{formatCurrency(config.total)}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant={inCompare ? "accent" : "ghost"}
                size="icon"
                title={inCompare ? "Remove from comparison" : "Add to comparison"}
                onClick={() => toggleCompare(config.id)}
              >
                <Scale className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Load this build"
                onClick={() => loadConfiguration(config.id)}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                title="Delete"
                onClick={() => deleteSavedConfiguration(config.id)}
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
