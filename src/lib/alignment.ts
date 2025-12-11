export interface AlignmentParams {
  match: number;
  mismatch: number;
  gapOpen: number;
  gapExtend: number;
}

export interface MatrixCell {
  score: number;
  traceback: 'M' | 'Ix' | 'Iy' | null;
}

export interface AlignmentMatrices {
  M: MatrixCell[][];
  Ix: MatrixCell[][];
  Iy: MatrixCell[][];
}

export interface AlignmentStep {
  type: 'fill' | 'traceback';
  matrix: 'M' | 'Ix' | 'Iy';
  i: number;
  j: number;
  score?: number;
  calculation?: string;
}

export interface AlignmentResult {
  seq1Aligned: string;
  seq2Aligned: string;
  score: number;
  matrices: AlignmentMatrices;
  steps: AlignmentStep[];
  tracebackPath: Array<{ i: number; j: number; matrix: 'M' | 'Ix' | 'Iy' }>;
}

const NEG_INF = -Infinity;

export function performAlignment(
  seq1: string,
  seq2: string,
  params: AlignmentParams
): AlignmentResult {
  const { match, mismatch, gapOpen, gapExtend } = params;
  const m = seq1.length;
  const n = seq2.length;

  // Initialize matrices
  const M: MatrixCell[][] = Array(m + 1).fill(null).map(() =>
    Array(n + 1).fill(null).map(() => ({ score: NEG_INF, traceback: null }))
  );
  const Ix: MatrixCell[][] = Array(m + 1).fill(null).map(() =>
    Array(n + 1).fill(null).map(() => ({ score: NEG_INF, traceback: null }))
  );
  const Iy: MatrixCell[][] = Array(m + 1).fill(null).map(() =>
    Array(n + 1).fill(null).map(() => ({ score: NEG_INF, traceback: null }))
  );

  const steps: AlignmentStep[] = [];

  // Initialize base cases
  M[0][0].score = 0;
  Ix[0][0].score = NEG_INF;
  Iy[0][0].score = NEG_INF;

  // Initialize first row (gaps in seq1)
  for (let j = 1; j <= n; j++) {
    M[0][j].score = NEG_INF;
    Ix[0][j].score = NEG_INF;
    Iy[0][j].score = gapOpen + gapExtend * (j - 1);
    Iy[0][j].traceback = 'Iy';
    steps.push({ type: 'fill', matrix: 'Iy', i: 0, j, score: Iy[0][j].score });
  }

  // Initialize first column (gaps in seq2)
  for (let i = 1; i <= m; i++) {
    M[i][0].score = NEG_INF;
    Ix[i][0].score = gapOpen + gapExtend * (i - 1);
    Ix[i][0].traceback = 'Ix';
    Iy[i][0].score = NEG_INF;
    steps.push({ type: 'fill', matrix: 'Ix', i, j: 0, score: Ix[i][0].score });
  }

  // Fill matrices
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // Calculate M[i][j]
      const matchScore = seq1[i - 1] === seq2[j - 1] ? match : mismatch;
      const fromM = M[i - 1][j - 1].score + matchScore;
      const fromIx = Ix[i - 1][j - 1].score + matchScore;
      const fromIy = Iy[i - 1][j - 1].score + matchScore;
      
      M[i][j].score = Math.max(fromM, fromIx, fromIy);
      if (M[i][j].score === fromM) M[i][j].traceback = 'M';
      else if (M[i][j].score === fromIx) M[i][j].traceback = 'Ix';
      else M[i][j].traceback = 'Iy';

      steps.push({ 
        type: 'fill', 
        matrix: 'M', 
        i, 
        j, 
        score: M[i][j].score,
        calculation: `max(M:${fromM.toFixed(1)}, Ix:${fromIx.toFixed(1)}, Iy:${fromIy.toFixed(1)})`
      });

      // Calculate Ix[i][j] (gap in seq2)
      const fromMtoIx = M[i - 1][j].score + gapOpen;
      const extendIx = Ix[i - 1][j].score + gapExtend;
      
      Ix[i][j].score = Math.max(fromMtoIx, extendIx);
      Ix[i][j].traceback = Ix[i][j].score === fromMtoIx ? 'M' : 'Ix';

      steps.push({ 
        type: 'fill', 
        matrix: 'Ix', 
        i, 
        j, 
        score: Ix[i][j].score,
        calculation: `max(M+open:${fromMtoIx.toFixed(1)}, extend:${extendIx.toFixed(1)})`
      });

      // Calculate Iy[i][j] (gap in seq1)
      const fromMtoIy = M[i][j - 1].score + gapOpen;
      const extendIy = Iy[i][j - 1].score + gapExtend;
      
      Iy[i][j].score = Math.max(fromMtoIy, extendIy);
      Iy[i][j].traceback = Iy[i][j].score === fromMtoIy ? 'M' : 'Iy';

      steps.push({ 
        type: 'fill', 
        matrix: 'Iy', 
        i, 
        j, 
        score: Iy[i][j].score,
        calculation: `max(M+open:${fromMtoIy.toFixed(1)}, extend:${extendIy.toFixed(1)})`
      });
    }
  }

  // Traceback
  const tracebackPath: Array<{ i: number; j: number; matrix: 'M' | 'Ix' | 'Iy' }> = [];
  let seq1Aligned = '';
  let seq2Aligned = '';
  
  let i = m;
  let j = n;
  let currentMatrix: 'M' | 'Ix' | 'Iy' = 'M';
  
  // Find best final score
  const finalScores = {
    M: M[m][n].score,
    Ix: Ix[m][n].score,
    Iy: Iy[m][n].score
  };
  currentMatrix = Object.entries(finalScores).reduce((a, b) => 
    finalScores[a[0] as 'M' | 'Ix' | 'Iy'] > finalScores[b[0] as 'M' | 'Ix' | 'Iy'] ? a : b
  )[0] as 'M' | 'Ix' | 'Iy';

  const finalScore = finalScores[currentMatrix];

  while (i > 0 || j > 0) {
    tracebackPath.push({ i, j, matrix: currentMatrix });
    steps.push({ type: 'traceback', matrix: currentMatrix, i, j });

    const currentCell = currentMatrix === 'M' ? M[i][j] : 
                       currentMatrix === 'Ix' ? Ix[i][j] : Iy[i][j];

    if (currentMatrix === 'M' && i > 0 && j > 0) {
      seq1Aligned = seq1[i - 1] + seq1Aligned;
      seq2Aligned = seq2[j - 1] + seq2Aligned;
      currentMatrix = currentCell.traceback || 'M';
      i--;
      j--;
    } else if (currentMatrix === 'Ix' && i > 0) {
      seq1Aligned = seq1[i - 1] + seq1Aligned;
      seq2Aligned = '-' + seq2Aligned;
      currentMatrix = currentCell.traceback || 'Ix';
      i--;
    } else if (currentMatrix === 'Iy' && j > 0) {
      seq1Aligned = '-' + seq1Aligned;
      seq2Aligned = seq2[j - 1] + seq2Aligned;
      currentMatrix = currentCell.traceback || 'Iy';
      j--;
    } else {
      break;
    }
  }

  return {
    seq1Aligned,
    seq2Aligned,
    score: finalScore,
    matrices: { M, Ix, Iy },
    steps,
    tracebackPath
  };
}
