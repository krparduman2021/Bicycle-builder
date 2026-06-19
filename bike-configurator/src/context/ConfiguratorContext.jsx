import React, { createContext, useContext, useState, useCallback } from "react";
import { STEPS, DEFAULT_SELECTIONS } from "@/data/bikeOptions";

const ConfiguratorContext = createContext(null);

let saveCounter = 0;

export function ConfiguratorProvider({ children }) {
  const [selections, setSelections] = useState(DEFAULT_SELECTIONS);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [savedConfigs, setSavedConfigs] = useState([]);
  const [compareIds, setCompareIds] = useState([]);

  const currentStep = STEPS[currentStepIndex];

  /** Select a single-choice option for a step (radio-style). */
  const selectOption = useCallback((stepId, optionId) => {
    setSelections((prev) => ({ ...prev, [stepId]: optionId }));
  }, []);

  /** Toggle an option within a multi-select step (checkbox-style, e.g. Extras). */
  const toggleMultiOption = useCallback((stepId, optionId) => {
    setSelections((prev) => {
      const current = prev[stepId] || [];
      const next = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      return { ...prev, [stepId]: next };
    });
  }, []);

  const goToStep = useCallback((index) => {
    setCurrentStepIndex(Math.max(0, Math.min(STEPS.length - 1, index)));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStepIndex((i) => Math.min(STEPS.length - 1, i + 1));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStepIndex((i) => Math.max(0, i - 1));
  }, []);

  const resetConfiguration = useCallback(() => {
    setSelections(DEFAULT_SELECTIONS);
    setCurrentStepIndex(0);
  }, []);

  /** Persist the current build under a name, for later recall or comparison. */
  const saveConfiguration = useCallback(
    (name, total) => {
      saveCounter += 1;
      const entry = {
        id: `build-${Date.now()}-${saveCounter}`,
        name: name?.trim() || `Custom Build ${saveCounter}`,
        selections: { ...selections },
        total,
        savedAt: new Date().toISOString(),
      };
      setSavedConfigs((prev) => [entry, ...prev]);
      return entry;
    },
    [selections]
  );

  const deleteSavedConfiguration = useCallback((id) => {
    setSavedConfigs((prev) => prev.filter((c) => c.id !== id));
    setCompareIds((prev) => prev.filter((cid) => cid !== id));
  }, []);

  const loadConfiguration = useCallback((id) => {
    setSavedConfigs((prev) => {
      const found = prev.find((c) => c.id === id);
      if (found) setSelections(found.selections);
      return prev;
    });
    setCurrentStepIndex(0);
  }, []);

  /** Bonus: compare mode — toggle a saved build in/out of the comparison set. */
  const toggleCompare = useCallback((id) => {
    setCompareIds((prev) =>
      prev.includes(id)
        ? prev.filter((cid) => cid !== id)
        : prev.length >= 3
        ? prev // cap comparisons at 3 builds for a readable layout
        : [...prev, id]
    );
  }, []);

  const clearCompare = useCallback(() => setCompareIds([]), []);

  const value = {
    selections,
    setSelections,
    currentStep,
    currentStepIndex,
    steps: STEPS,
    selectOption,
    toggleMultiOption,
    goToStep,
    nextStep,
    prevStep,
    resetConfiguration,
    savedConfigs,
    saveConfiguration,
    deleteSavedConfiguration,
    loadConfiguration,
    compareIds,
    toggleCompare,
    clearCompare,
  };

  return (
    <ConfiguratorContext.Provider value={value}>
      {children}
    </ConfiguratorContext.Provider>
  );
}

export function useConfigurator() {
  const ctx = useContext(ConfiguratorContext);
  if (!ctx) {
    throw new Error("useConfigurator must be used within a ConfiguratorProvider");
  }
  return ctx;
}
