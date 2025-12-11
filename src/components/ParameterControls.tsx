import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { AlignmentParams } from "@/lib/alignment";

interface ParameterControlsProps {
  params: AlignmentParams;
  onParamsChange: (params: AlignmentParams) => void;
}

export const ParameterControls = ({ params, onParamsChange }: ParameterControlsProps) => {
  const updateParam = (key: keyof AlignmentParams, value: number) => {
    onParamsChange({ ...params, [key]: value });
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-md">
      <h2 className="text-xl font-semibold text-foreground mb-4">Alignment Parameters</h2>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="match" className="text-foreground">Match Score</Label>
            <span className="text-sm font-mono text-muted-foreground">{params.match}</span>
          </div>
          <Slider
            id="match"
            min={0}
            max={10}
            step={1}
            value={[params.match]}
            onValueChange={(value) => updateParam('match', value[0])}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="mismatch" className="text-foreground">Mismatch Penalty</Label>
            <span className="text-sm font-mono text-muted-foreground">{params.mismatch}</span>
          </div>
          <Slider
            id="mismatch"
            min={-10}
            max={0}
            step={1}
            value={[params.mismatch]}
            onValueChange={(value) => updateParam('mismatch', value[0])}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="gapOpen" className="text-foreground">Gap Open Penalty</Label>
            <span className="text-sm font-mono text-muted-foreground">{params.gapOpen}</span>
          </div>
          <Slider
            id="gapOpen"
            min={-20}
            max={0}
            step={1}
            value={[params.gapOpen]}
            onValueChange={(value) => updateParam('gapOpen', value[0])}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="gapExtend" className="text-foreground">Gap Extend Penalty</Label>
            <span className="text-sm font-mono text-muted-foreground">{params.gapExtend}</span>
          </div>
          <Slider
            id="gapExtend"
            min={-10}
            max={0}
            step={1}
            value={[params.gapExtend]}
            onValueChange={(value) => updateParam('gapExtend', value[0])}
            className="cursor-pointer"
          />
        </div>
      </div>
    </Card>
  );
};
