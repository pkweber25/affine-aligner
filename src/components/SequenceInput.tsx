import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface SequenceInputProps {
  seq1: string;
  seq2: string;
  onSeq1Change: (value: string) => void;
  onSeq2Change: (value: string) => void;
}

export const SequenceInput = ({ seq1, seq2, onSeq1Change, onSeq2Change }: SequenceInputProps) => {
  return (
    <Card className="p-6 bg-gradient-card shadow-md">
      <h2 className="text-xl font-semibold text-foreground mb-4">Input Sequences</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="seq1" className="text-foreground">Sequence 1</Label>
          <Textarea
            id="seq1"
            value={seq1}
            onChange={(e) => onSeq1Change(e.target.value.toUpperCase())}
            placeholder="Enter first sequence (DNA/Protein)"
            className="mt-2 font-mono bg-background border-border"
            rows={3}
          />
          <p className="text-xs text-muted-foreground mt-1">Length: {seq1.length}</p>
        </div>
        <div>
          <Label htmlFor="seq2" className="text-foreground">Sequence 2</Label>
          <Textarea
            id="seq2"
            value={seq2}
            onChange={(e) => onSeq2Change(e.target.value.toUpperCase())}
            placeholder="Enter second sequence (DNA/Protein)"
            className="mt-2 font-mono bg-background border-border"
            rows={3}
          />
          <p className="text-xs text-muted-foreground mt-1">Length: {seq2.length}</p>
        </div>
      </div>
    </Card>
  );
};
