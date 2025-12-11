import { Card } from "@/components/ui/card";
import { AlignmentMatrices, AlignmentStep } from "@/lib/alignment";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MatrixVisualizationProps {
  matrices: AlignmentMatrices;
  seq1: string;
  seq2: string;
  currentStep?: AlignmentStep;
  tracebackPath?: Array<{ i: number; j: number; matrix: 'M' | 'Ix' | 'Iy' }>;
}

export const MatrixVisualization = ({ 
  matrices, 
  seq1, 
  seq2,
  currentStep,
  tracebackPath = []
}: MatrixVisualizationProps) => {
  const renderMatrix = (
    matrix: typeof matrices.M,
    matrixName: 'M' | 'Ix' | 'Iy',
    color: string
  ) => {
    const isInTraceback = (i: number, j: number) => 
      tracebackPath.some(p => p.i === i && p.j === j && p.matrix === matrixName);
    
    const isCurrentCell = (i: number, j: number) => 
      currentStep?.i !== undefined && 
      currentStep.matrix === matrixName && 
      currentStep.i === i && 
      currentStep.j === j;

    return (
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold mb-2 text-foreground flex items-center gap-2">
          <div className={`w-3 h-3 rounded ${color}`} />
          Matrix {matrixName}
        </h3>
        <div className="overflow-auto max-h-96 border border-border rounded-lg bg-background">
          <table className="text-xs border-collapse min-w-full">
            <thead>
              <tr>
                <th className="border border-border bg-muted p-1 sticky top-0 z-10"></th>
                <th className="border border-border bg-muted p-1 sticky top-0 z-10">-</th>
                {seq2.split('').map((char, idx) => (
                  <th key={idx} className="border border-border bg-muted p-1 font-mono sticky top-0 z-10">
                    {char}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  <th className="border border-border bg-muted p-1 font-mono sticky left-0 z-10">
                    {i === 0 ? '-' : seq1[i - 1]}
                  </th>
                  {row.map((cell, j) => {
                    const inTraceback = isInTraceback(i, j);
                    const isCurrent = isCurrentCell(i, j);
                    
                    return (
                      <TooltipProvider key={j}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <td
                              className={`border border-border p-1 text-center font-mono transition-colors cursor-help
                                ${isCurrent ? 'bg-visualization-current' : ''}
                                ${inTraceback && !isCurrent ? `${color} bg-opacity-30` : ''}
                                ${!isCurrent && !inTraceback ? 'hover:bg-muted' : ''}
                              `}
                            >
                              {cell.score === -Infinity ? '-∞' : cell.score.toFixed(1)}
                            </td>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="text-xs">
                              <p className="font-semibold">{matrixName}[{i}][{j}]</p>
                              <p>Score: {cell.score === -Infinity ? '-∞' : cell.score.toFixed(2)}</p>
                              {cell.traceback && <p>From: {cell.traceback}</p>}
                              {isCurrent && currentStep?.calculation && (
                                <p className="mt-1 text-muted-foreground">{currentStep.calculation}</p>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-6 bg-gradient-card shadow-md">
      <h2 className="text-xl font-semibold text-foreground mb-4">Alignment Matrices</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {renderMatrix(matrices.M, 'M', 'bg-matrix-m')}
        {renderMatrix(matrices.Ix, 'Ix', 'bg-matrix-ix')}
        {renderMatrix(matrices.Iy, 'Iy', 'bg-matrix-iy')}
      </div>
    </Card>
  );
};
