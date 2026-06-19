import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfigurator } from "@/context/ConfiguratorContext";

/**
 * Stepper
 * -----------------------------------------------------------------------
 * Left-rail wizard navigation. A step is considered "complete" once the
 * corresponding selection exists (non-null for single-select, any length
 * for multi-select, where even an empty Extras selection counts as
 * intentionally visited once the user has passed through it).
 */
export default function Stepper() {
  const { steps, currentStepIndex, goToStep, selections } = useConfigurator();

  function isComplete(step, index) {
    if (index > currentStepIndex) return false;
    const value = selections[step.id];
    if (step.multiSelect) return index < currentStepIndex; // extras: complete once passed
    return Boolean(value);
  }

  return (
    <nav aria-label="Build steps" className="flex flex-col gap-1">
      {steps.map((step, index) => {
        const active = index === currentStepIndex;
        const complete = isComplete(step, index);
        const reachable = index <= currentStepIndex || complete;

        return (
          <button
            key={step.id}
            onClick={() => goToStep(index)}
            className={cn(
              "group flex items-start gap-3 rounded-md px-3 py-2.5 text-left transition-colors",
              active ? "bg-espresso text-paper" : "hover:bg-stone-light/50 text-espresso"
            )}
          >
            <span
              className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-mono",
                active
                  ? "border-paper bg-paper text-espresso"
                  : complete
                  ? "border-pine bg-pine text-paper"
                  : "border-stone-light text-stone"
              )}
            >
              {complete && !active ? <Check className="h-3 w-3" /> : index + 1}
            </span>
            <span className="flex flex-col">
              <span className={cn("text-sm font-medium", active ? "text-paper" : "text-espresso")}>
                {step.label}
              </span>
              <span className={cn("text-xs", active ? "text-paper/70" : "text-stone")}>
                {step.description}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
