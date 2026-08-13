import { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { chiptune } from "@/lib/chiptune";

export function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    setOn(chiptune.isEnabled());
    if (chiptune.isEnabled()) chiptune.playLoop();
  }, []);

  const toggle = () => {
    const next = chiptune.toggle();
    setOn(next);
    if (next) {
      chiptune.blipSuccess();
      chiptune.playLoop();
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={on ? "Disable sound" : "Enable sound"}
      title={on ? "Sound on" : "Sound off"}
      className={`rounded-sm border p-1.5 transition-colors hover:text-neon ${
        on ? "border-neon/50 text-neon" : "border-border/60 text-muted-foreground/60"
      }`}
    >
      {on ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
    </button>
  );
}
