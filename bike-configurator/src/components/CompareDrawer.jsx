import React from "react";
import { Scale, X } from "lucide-react";
import { formatCurrency, formatDelta, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { STEPS, OPTION_LOOKUP } from "@/data/bikeOptions";
import { useConfigurator } from "@/context/ConfiguratorContext";

export default function CompareDrawer() {
  const { savedConfigs, compareIds, toggleCompare, clearCompare } = useConfigurator();
  const comparedConfigs = savedConfigs.filter((c) => compareIds.includes(c.id));

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full" disabled={comparedConfigs.length === 0}>
          <Scale className="h-4 w-4" />
          Compare builds
          {comparedConfigs.length > 0 && (
            <span className="ml-1 rounded-full bg-rust px-1.5 py-0.5 text-[10px] text-paper">
              {comparedConfigs.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="max-w-none">
        <SheetHeader>
          <SheetTitle>Compare builds</SheetTitle>
          <SheetDescription>
            Side-by-side view of your saved configurations. Add up to 3 from the saved builds list.
          </SheetDescription>
        </SheetHeader>

        {comparedConfigs.length === 0 ? (
          <p className="text-sm text-stone py-6">
            Nothing to compare yet — save a build and tap the scale icon to add it here.
          </p>
        ) : (
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full min-w-[480px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="text-left font-medium text-stone p-2 w-32">Step</th>
                  {comparedConfigs.map((config) => (
                    <th key={config.id} className="text-left p-2 min-w-[180px]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display font-semibold text-espresso">{config.name}</span>
                        <button
                          onClick={() => toggleCompare(config.id)}
                          className="text-stone hover:text-destructive"
                          title="Remove from comparison"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STEPS.map((step) => (
                  <tr key={step.id} className="border-t border-stone-light">
                    <td className="p-2 text-stone font-medium align-top">{step.label}</td>
                    {comparedConfigs.map((config) => {
                      const value = config.selections[step.id];
                      const ids = Array.isArray(value) ? value : value ? [value] : [];
                      return (
                        <td key={config.id} className="p-2 align-top">
                          {ids.length === 0 ? (
                            <span className="text-stone/60">—</span>
                          ) : (
                            <ul className="flex flex-col gap-0.5">
                              {ids.map((id) => (
                                <li key={id} className="text-espresso">
                                  {OPTION_LOOKUP[id]?.name ?? id}
                                </li>
                              ))}
                            </ul>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr className="border-t-2 border-espresso">
                  <td className="p-2 font-semibold text-espresso">Total</td>
                  {comparedConfigs.map((config) => (
                    <td key={config.id} className="p-2 font-mono font-semibold text-rust">
                      {formatCurrency(config.total)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {comparedConfigs.length > 0 && (
          <div className="pt-2">
            <Button variant="ghost" size="sm" onClick={clearCompare}>
              Clear comparison
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
