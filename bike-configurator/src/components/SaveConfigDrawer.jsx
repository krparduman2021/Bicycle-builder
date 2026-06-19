import React, { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useConfigurator } from "@/context/ConfiguratorContext";

export default function SaveConfigDrawer({ total }) {
  const { saveConfiguration } = useConfigurator();
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  function handleSave() {
    saveConfiguration(name, total);
    setJustSaved(true);
    setTimeout(() => {
      setOpen(false);
      setJustSaved(false);
      setName("");
    }, 700);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          <Save className="h-4 w-4" />
          Save this build
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Save your configuration</SheetTitle>
          <SheetDescription>
            Give this build a name so you can find it later or compare it against other builds.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-2">
          <label htmlFor="config-name" className="text-sm font-medium text-espresso">
            Build name
          </label>
          <input
            id="config-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Weekend Gravel Build"
            className="h-10 rounded-md border border-stone-light bg-card px-3 text-sm text-espresso outline-none focus-visible:ring-2 focus-visible:ring-rust"
            autoFocus
          />
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button variant="ghost">Cancel</Button>
          </SheetClose>
          <Button variant="accent" onClick={handleSave} disabled={justSaved}>
            {justSaved ? "Saved ✓" : "Save build"}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
