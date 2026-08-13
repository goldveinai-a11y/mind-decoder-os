import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { chiptune } from "@/lib/chiptune";

export function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(chiptune.isEnabled());
  }, []);

  const toggle = () => {
    const next = chiptune.toggle();
    setOn(next);
    if (next) {
      chiptune.blipSuccess();
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={on ? "Disable sound" : "Enable sound"}
      title={on ? "Sound on" : "Sound off"}
      className="rounded-sm border border-border/60 p-1.5 text-muted-foreground/60 transition-colors hover:text-neon"
    >
      {on ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
    </button>
  );
}
