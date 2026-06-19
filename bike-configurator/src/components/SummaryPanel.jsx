import React from "react";
import { formatCurrency, formatDelta, cn } from "@/lib/utils";
import { useConfigurator } from "@/context/ConfiguratorContext";
import { usePricing } from "@/hooks/usePricing";
import { useCompatibility } from "@/hooks/useCompatibility";
import { OPTION_LOOKUP } from "@/data/bikeOptions";
import BikePreviewSVG from "@/components/BikePreviewSVG";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import SaveConfigDrawer from "@/components/SaveConfigDrawer";
import CompareDrawer from "@/components/CompareDrawer";
import SavedConfigsList from "@/components/SavedConfigsList";
import { CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

export default function SummaryPanel() {
  const { selections, resetConfiguration } = useConfigurator();
  const { lineItems, basePrice, total } = usePricing(selections);
  const { isValid, issues } = useCompatibility(selections);

  const frameColorOption = OPTION_LOOKUP[selections.frameColor];
  const frameColorHex =
    typeof frameColorOption?.swatch === "string" && frameColorOption.swatch.startsWith("#")
      ? frameColorOption.swatch
      : "#C4501F";

  return (
    <aside className="flex flex-col gap-5 lg:sticky lg:top-6 h-fit">
      <div className="rounded-lg border border-stone-light bg-card shadow-panel overflow-hidden">
        <div className="bg-stone-light/30 p-5">
          <BikePreviewSVG
            frameColorHex={frameColorHex}
            wheelType={selections.wheels}
            extras={selections.extras}
          />
        </div>

        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-espresso">Your build</h3>
            {isValid ? (
              <Badge variant="success" className="gap-1">
                <CheckCircle2 className="h-3 w-3" /> Compatible
              </Badge>
            ) : (
              <Badge variant="warning" className="gap-1">
                <AlertCircle className="h-3 w-3" /> {issues.length} conflict
                {issues.length > 1 ? "s" : ""}
              </Badge>
            )}
          </div>

          <ul className="flex flex-col gap-2 max-h-64 overflow-y-auto scrollbar-thin">
            <li className="flex items-center justify-between text-sm">
              <span className="text-stone">Base bicycle assembly</span>
              <span className="font-mono text-espresso">{formatCurrency(basePrice)}</span>
            </li>
            {lineItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between text-sm gap-2">
                <span className="text-stone truncate">
                  <span className="text-stone/70">{item.stepLabel}: </span>
                  {item.name}
                </span>
                <span
                  className={cn(
                    "font-mono shrink-0",
                    item.price === 0 ? "text-pine" : "text-espresso"
                  )}
                >
                  {formatDelta(item.price)}
                </span>
              </li>
            ))}
          </ul>

          <Separator />

          <div className="flex items-center justify-between">
            <span className="font-display font-semibold text-espresso">Total</span>
            <span
              key={total}
              className="font-mono text-xl font-bold text-rust animate-price-pop"
            >
              {formatCurrency(total)}
            </span>
          </div>

          <div className="flex flex-col gap-2 pt-1">
            <SaveConfigDrawer total={total} />
            <CompareDrawer />
            <button
              onClick={resetConfiguration}
              className="flex items-center justify-center gap-1.5 text-xs text-stone hover:text-espresso transition-colors py-1"
            >
              <RefreshCw className="h-3 w-3" />
              Reset to stock build
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-stone-light bg-card p-4">
        <h4 className="text-sm font-semibold text-espresso mb-2">Saved builds</h4>
        <SavedConfigsList />
      </div>
    </aside>
  );
}
