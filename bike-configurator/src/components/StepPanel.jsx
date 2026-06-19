import React from "react";
import { OPTIONS } from "@/data/bikeOptions";
import { useConfigurator } from "@/context/ConfiguratorContext";
import { useCompatibility } from "@/hooks/useCompatibility";
import OptionCard from "@/components/OptionCard";
import CompatibilityNotice from "@/components/CompatibilityNotice";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function StepPanel() {
  const {
    currentStep,
    currentStepIndex,
    steps,
    selections,
    selectOption,
    toggleMultiOption,
    nextStep,
    prevStep,
  } = useConfigurator();

  const { issues, isOptionDisabled, disabledReason } = useCompatibility(selections);
  const options = OPTIONS[currentStep.id] || [];
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const relevantIssues = issues.filter((i) => i.stepIds.includes(currentStep.id));

  function handleSelect(optionId) {
    if (currentStep.multiSelect) {
      toggleMultiOption(currentStep.id, optionId);
    } else {
      selectOption(currentStep.id, optionId);
    }
  }

  function isSelected(optionId) {
    const value = selections[currentStep.id];
    return currentStep.multiSelect ? value.includes(optionId) : value === optionId;
  }

  return (
    <section className="flex flex-col gap-5" aria-labelledby="step-heading">
      <div className="flex flex-col gap-1">
        <span className="text-xs font-mono uppercase tracking-wide text-stone">
          Step {currentStepIndex + 1} of {steps.length}
        </span>
        <h2 id="step-heading" className="font-display text-2xl font-bold text-espresso">
          {currentStep.label}
        </h2>
        <p className="text-sm text-stone">{currentStep.description}</p>
      </div>

      <CompatibilityNotice issues={relevantIssues} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => {
          const disabled = isOptionDisabled(currentStep.id, option.id) && !isSelected(option.id);
          return (
            <OptionCard
              key={option.id}
              option={option}
              selected={isSelected(option.id)}
              disabled={disabled}
              disabledReason={disabled ? disabledReason(currentStep.id, option.id) : null}
              onSelect={handleSelect}
              multiSelect={currentStep.multiSelect}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="outline" onClick={prevStep} disabled={isFirstStep}>
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button variant="accent" onClick={nextStep} disabled={isLastStep}>
          {isLastStep ? "Review your build" : "Continue"}
          {!isLastStep && <ChevronRight className="h-4 w-4" />}
        </Button>
      </div>
    </section>
  );
}
