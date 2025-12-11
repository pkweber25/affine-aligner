import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react";

interface AnimationControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  disabled?: boolean;
}

export const AnimationControls = ({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
  disabled = false
}: AnimationControlsProps) => {
  return (
    <Card className="p-6 bg-gradient-card shadow-md">
      <h2 className="text-xl font-semibold text-foreground mb-4">Animation Controls</h2>
      
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onStepBackward}
          disabled={disabled || currentStep === 0}
          className="border-border"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        {isPlaying ? (
          <Button
            variant="default"
            size="icon"
            onClick={onPause}
            disabled={disabled}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Pause className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="default"
            size="icon"
            onClick={onPlay}
            disabled={disabled || currentStep >= totalSteps}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Play className="h-4 w-4" />
          </Button>
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={onStepForward}
          disabled={disabled || currentStep >= totalSteps}
          className="border-border"
        >
          <SkipForward className="h-4 w-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          disabled={disabled}
          className="ml-2 border-border"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between items-center">
          <Label className="text-sm text-foreground">Progress</Label>
          <span className="text-sm font-mono text-muted-foreground">
            {currentStep} / {totalSteps}
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-primary transition-all duration-300"
            style={{ width: `${totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0}%` }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="speed" className="text-sm text-foreground">Animation Speed</Label>
          <span className="text-sm font-mono text-muted-foreground">{speed}x</span>
        </div>
        <Slider
          id="speed"
          min={0.5}
          max={3}
          step={0.5}
          value={[speed]}
          onValueChange={(value) => onSpeedChange(value[0])}
          disabled={disabled}
          className="cursor-pointer"
        />
      </div>
    </Card>
  );
};
