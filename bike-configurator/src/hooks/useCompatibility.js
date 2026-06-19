import { useMemo } from "react";
import { OPTION_LOOKUP, COMPATIBILITY_INDEX, OPTIONS } from "@/data/bikeOptions";

/**
 * useCompatibility
 * -----------------------------------------------------------------------
 * Given the current selections map, derive:
 *   - issues: a list of conflicts between two currently-selected options
 *   - isOptionDisabled(stepId, optionId): whether picking this option right
 *     now would conflict with something already selected elsewhere
 *   - disabledReason(stepId, optionId): human-readable reason for the above
 *
 * This is intentionally a pure derivation (useMemo) rather than stored
 * state — compatibility is always a function of the current selections,
 * never an independent source of truth. That avoids an entire class of
 * "state got out of sync" bugs.
 */
export function useCompatibility(selections) {
  return useMemo(() => {
    const selectedIds = Object.entries(selections)
      .flatMap(([stepId, value]) =>
        Array.isArray(value) ? value : value ? [value] : []
      );

    const issues = [];

    // 1. Direct incompatibility pairs among current selections
    selectedIds.forEach((id) => {
      const conflicts = COMPATIBILITY_INDEX[id];
      if (!conflicts) return;
      conflicts.forEach((conflictId) => {
        if (selectedIds.includes(conflictId)) {
          const a = OPTION_LOOKUP[id];
          const b = OPTION_LOOKUP[conflictId];
          if (!a || !b) return;
          // avoid duplicate (A,B) / (B,A) pairs
          const key = [a.id, b.id].sort().join("::");
          if (!issues.some((i) => i.key === key)) {
            issues.push({
              key,
              message: `${a.name} isn't compatible with ${b.name}.`,
              stepIds: [a.stepId, b.stepId],
            });
          }
        }
      });
    });

    // 2. "requires" constraints — option only valid if another step holds
    //    one of a specific set of values
    Object.entries(OPTIONS).forEach(([stepId, opts]) => {
      const current = selections[stepId];
      if (!current) return;
      const currentIds = Array.isArray(current) ? current : [current];

      currentIds.forEach((cid) => {
        const opt = opts.find((o) => o.id === cid);
        if (!opt?.requires) return;

        Object.entries(opt.requires).forEach(([reqStepId, allowedIds]) => {
          const reqValue = selections[reqStepId];
          const satisfied = Array.isArray(reqValue)
            ? reqValue.some((v) => allowedIds.includes(v))
            : allowedIds.includes(reqValue);

          if (!satisfied) {
            const key = `req::${opt.id}::${reqStepId}`;
            if (!issues.some((i) => i.key === key)) {
              issues.push({
                key,
                message: `${opt.name} requires a compatible selection in ${reqStepId}.`,
                stepIds: [stepId, reqStepId],
              });
            }
          }
        });
      });
    });

    /**
     * Would selecting `optionId` (in `stepId`) conflict with anything
     * currently selected in a DIFFERENT step? Used to grey out cards
     * before the user even picks them, rather than only after.
     */
    function isOptionDisabled(stepId, optionId) {
      const conflicts = COMPATIBILITY_INDEX[optionId];
      if (conflicts) {
        for (const otherStepId of Object.keys(selections)) {
          if (otherStepId === stepId) continue;
          const value = selections[otherStepId];
          const ids = Array.isArray(value) ? value : value ? [value] : [];
          if (ids.some((id) => conflicts.has(id))) return true;
        }
      }

      const opt = OPTION_LOOKUP[optionId];
      if (opt?.requires) {
        for (const [reqStepId, allowedIds] of Object.entries(opt.requires)) {
          const reqValue = selections[reqStepId];
          const satisfied = Array.isArray(reqValue)
            ? reqValue.some((v) => allowedIds.includes(v))
            : allowedIds.includes(reqValue);
          if (!satisfied) return true;
        }
      }

      return false;
    }

    function disabledReason(stepId, optionId) {
      const conflicts = COMPATIBILITY_INDEX[optionId];
      if (conflicts) {
        for (const otherStepId of Object.keys(selections)) {
          if (otherStepId === stepId) continue;
          const value = selections[otherStepId];
          const ids = Array.isArray(value) ? value : value ? [value] : [];
          const hit = ids.find((id) => conflicts.has(id));
          if (hit) {
            const other = OPTION_LOOKUP[hit];
            return `Not compatible with ${other?.name ?? "current selection"}`;
          }
        }
      }

      const opt = OPTION_LOOKUP[optionId];
      if (opt?.requires) {
        for (const [reqStepId, allowedIds] of Object.entries(opt.requires)) {
          const reqValue = selections[reqStepId];
          const satisfied = Array.isArray(reqValue)
            ? reqValue.some((v) => allowedIds.includes(v))
            : allowedIds.includes(reqValue);
          if (!satisfied) {
            const allowedNames = allowedIds
              .map((id) => OPTION_LOOKUP[id]?.name)
              .filter(Boolean)
              .join(" or ");
            return `Requires ${allowedNames}`;
          }
        }
      }

      return null;
    }

    return {
      issues,
      isValid: issues.length === 0,
      isOptionDisabled,
      disabledReason,
    };
  }, [selections]);
}
