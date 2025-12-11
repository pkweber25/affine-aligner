import { Card } from "@/components/ui/card";

interface AlignmentDisplayProps {
  seq1: string;
  seq2: string;
  score: number;
}

export const AlignmentDisplay = ({ seq1, seq2, score }: AlignmentDisplayProps) => {
  const getAlignmentSymbols = () => {
    const symbols: string[] = [];
    for (let i = 0; i < seq1.length; i++) {
      if (seq1[i] === '-' || seq2[i] === '-') {
        symbols.push(' ');
      } else if (seq1[i] === seq2[i]) {
        symbols.push('|');
      } else {
        symbols.push(':');
      }
    }
    return symbols.join('');
  };

  const renderSequence = (seq: string, isFirst: boolean) => {
    return seq.split('').map((char, idx) => {
      let bgColor = '';
      if (char === '-') {
        bgColor = 'bg-alignment-gap';
      } else if (isFirst) {
        if (seq2[idx] === char) {
          bgColor = 'bg-alignment-match';
        } else if (seq2[idx] !== '-') {
          bgColor = 'bg-alignment-mismatch';
        }
      }

      return (
        <span
          key={idx}
          className={`inline-block w-6 text-center font-mono text-sm ${bgColor} ${
            char === '-' ? 'text-foreground/50' : 'text-foreground'
          }`}
        >
          {char}
        </span>
      );
    });
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-foreground">Final Alignment</h2>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Alignment Score</p>
          <p className="text-2xl font-bold text-primary">{score.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-background p-4 rounded-lg border border-border overflow-x-auto">
        <div className="mb-2">
          <span className="text-xs text-muted-foreground mr-2">Seq 1:</span>
          <div className="inline-block">{renderSequence(seq1, true)}</div>
        </div>
        <div className="mb-2 ml-16">
          <div className="inline-block font-mono text-sm text-muted-foreground">
            {getAlignmentSymbols()}
          </div>
        </div>
        <div>
          <span className="text-xs text-muted-foreground mr-2">Seq 2:</span>
          <div className="inline-block">{renderSequence(seq2, false)}</div>
        </div>
      </div>

      <div className="mt-4 flex gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-alignment-match rounded" />
          <span className="text-foreground">Match</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-alignment-mismatch rounded" />
          <span className="text-foreground">Mismatch</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-alignment-gap rounded" />
          <span className="text-foreground">Gap</span>
        </div>
      </div>
    </Card>
  );
};
