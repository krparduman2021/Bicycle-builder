import React from "react";
import { Check, Lock } from "lucide-react";
import { cn, formatDelta } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";

/**
 * OptionCard
 * -----------------------------------------------------------------------
 * Renders one selectable option (e.g. "Carbon Road" frame) as a card.
 * Visual state covers four cases: selected, disabled-by-compatibility,
 * hovered/default, and disabled. Disabled cards remain visible (never
 * hidden) so the user always understands the full catalog and why a
 * particular option isn't available right now.
 */
export default function OptionCard({
  option,
  selected,
  disabled,
  disabledReason,
  onSelect,
  multiSelect = false,
}) {
  const card = (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onSelect(option.id)}
      aria-pressed={selected}
      className={cn(
        "relative flex w-full flex-col gap-3 rounded-lg border p-4 text-left transition-all",
        selected
          ? "border-rust bg-rust/5 shadow-card-hover ring-1 ring-rust"
          : "border-stone-light bg-card hover:border-espresso/30 hover:shadow-card-hover",
        disabled && "opacity-50 cursor-not-allowed hover:border-stone-light hover:shadow-none"
      )}
    >
      {selected && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-rust text-paper">
          <Check className="h-3 w-3" />
        </span>
      )}
      {disabled && (
        <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-stone-light text-stone">
          <Lock className="h-3 w-3" />
        </span>
      )}

      <div className="flex items-center gap-3">
        {option.swatch && (
          <span
            className="h-8 w-8 shrink-0 rounded-full border border-stone-light/80 shadow-sm"
            style={{ background: option.swatch }}
            aria-hidden="true"
          />
        )}
        <div className="flex flex-col">
          <span className="font-display text-sm font-semibold text-espresso">{option.name}</span>
          {option.blurb && <span className="text-xs text-stone">{option.blurb}</span>}
        </div>
      </div>

      {option.specs && (
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(option.specs).map(([key, val]) => (
            <Badge key={key} variant="outline" className="font-mono text-[10px] text-stone">
              {val}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-center justify-between pt-1">
        <span
          className={cn(
            "font-mono text-sm font-medium",
            option.price === 0 ? "text-pine" : "text-espresso"
          )}
        >
          {formatDelta(option.price)}
        </span>
        {multiSelect && (
          <span
            className={cn(
              "flex h-4 w-4 items-center justify-center rounded border",
              selected ? "border-rust bg-rust" : "border-stone-light"
            )}
          >
            {selected && <Check className="h-3 w-3 text-paper" />}
          </span>
        )}
      </div>
    </button>
  );

  if (disabled && disabledReason) {
    return (
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>{card}</TooltipTrigger>
          <TooltipContent>{disabledReason}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return card;
}
