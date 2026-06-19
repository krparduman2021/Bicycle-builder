import { useMemo } from "react";
import { OPTION_LOOKUP, BASE_PRICE, STEPS } from "@/data/bikeOptions";

/**
 * usePricing
 * -----------------------------------------------------------------------
 * Derives a price breakdown (base + line items) from the current
 * selections map. Pure derivation, recalculated whenever selections
 * change — there is no separately-tracked "total" state to drift out
 * of sync with the selections themselves.
 */
export function usePricing(selections) {
  return useMemo(() => {
    const lineItems = [];

    STEPS.forEach((step) => {
      const value = selections[step.id];
      if (!value) return;

      if (Array.isArray(value)) {
        value.forEach((id) => {
          const opt = OPTION_LOOKUP[id];
          if (opt) lineItems.push({ stepId: step.id, stepLabel: step.label, ...opt });
        });
      } else {
        const opt = OPTION_LOOKUP[value];
        if (opt) lineItems.push({ stepId: step.id, stepLabel: step.label, ...opt });
      }
    });

    const componentsTotal = lineItems.reduce((sum, item) => sum + item.price, 0);
    const total = BASE_PRICE + componentsTotal;

    return { basePrice: BASE_PRICE, lineItems, componentsTotal, total };
  }, [selections]);
}
