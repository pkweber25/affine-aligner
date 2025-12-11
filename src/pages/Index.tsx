import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { SequenceInput } from "@/components/SequenceInput";
import { ParameterControls } from "@/components/ParameterControls";
import { AnimationControls } from "@/components/AnimationControls";
import { MatrixVisualization } from "@/components/MatrixVisualization";
import { AlignmentDisplay } from "@/components/AlignmentDisplay";
import { AlgorithmInfo } from "@/components/AlgorithmInfo";
import { performAlignment, AlignmentParams, AlignmentResult } from "@/lib/alignment";
import { toast } from "sonner";
import { Dna } from "lucide-react";

const Index = () => {
  const [seq1, setSeq1] = useState("GAATTC");
  const [seq2, setSeq2] = useState("GATTA");
  const [params, setParams] = useState<AlignmentParams>({
    match: 2,
    mismatch: -1,
    gapOpen: -5,
    gapExtend: -1,
  });

  const [result, setResult] = useState<AlignmentResult | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  const handleAlign = () => {
    if (!seq1.trim() || !seq2.trim()) {
      toast.error("Please enter both sequences");
      return;
    }

    try {
      const alignmentResult = performAlignment(seq1.trim(), seq2.trim(), params);
      setResult(alignmentResult);
      setCurrentStep(0);
      setIsPlaying(false);
      toast.success("Alignment computed successfully!");
    } catch (error) {
      toast.error("Error computing alignment");
      console.error(error);
    }
  };

  const handleStepForward = useCallback(() => {
    if (result && currentStep < result.steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  }, [result, currentStep]);

  const handleStepBackward = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handlePlay = () => {
    if (result && currentStep < result.steps.length) {
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  useEffect(() => {
    if (isPlaying && result) {
      const interval = setInterval(() => {
        if (currentStep < result.steps.length) {
          setCurrentStep(prev => prev + 1);
        } else {
          setIsPlaying(false);
          toast.success("Animation complete!");
        }
      }, 1000 / speed);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentStep, result, speed]);

  const currentStepData = result?.steps[currentStep - 1];
  const tracebackPath = result && currentStepData?.type === 'traceback' 
    ? result.steps
        .slice(0, currentStep)
        .filter(s => s.type === 'traceback')
        .map(s => ({ i: s.i, j: s.j, matrix: s.matrix }))
    : [];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-gradient-primary shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Dna className="h-8 w-8 text-primary-foreground" />
            <div>
              <h1 className="text-3xl font-bold text-primary-foreground">AffineAlign Visualizer</h1>
              <p className="text-sm text-primary-foreground/80">
                Interactive Needleman-Wunsch with Affine Gap Penalties
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <SequenceInput
              seq1={seq1}
              seq2={seq2}
              onSeq1Change={setSeq1}
              onSeq2Change={setSeq2}
            />
          </div>
          <div>
            <ParameterControls params={params} onParamsChange={setParams} />
          </div>
        </div>

        <div className="mb-6">
          <Button
            onClick={handleAlign}
            size="lg"
            className="w-full lg:w-auto bg-gradient-primary text-primary-foreground hover:opacity-90 shadow-md"
          >
            Compute Alignment
          </Button>
        </div>

        {result && (
          <>
            <div className="mb-6">
              <AnimationControls
                isPlaying={isPlaying}
                currentStep={currentStep}
                totalSteps={result.steps.length}
                speed={speed}
                onPlay={handlePlay}
                onPause={handlePause}
                onStepForward={handleStepForward}
                onStepBackward={handleStepBackward}
                onReset={handleReset}
                onSpeedChange={setSpeed}
              />
            </div>

            <div className="mb-6">
              <MatrixVisualization
                matrices={result.matrices}
                seq1={seq1}
                seq2={seq2}
                currentStep={currentStepData}
                tracebackPath={tracebackPath}
              />
            </div>

            {currentStep >= result.steps.length && (
              <div className="mb-6">
                <AlignmentDisplay
                  seq1={result.seq1Aligned}
                  seq2={result.seq2Aligned}
                  score={result.score}
                />
              </div>
            )}
          </>
        )}

        <div className="mt-6">
          <AlgorithmInfo />
        </div>
      </main>

      <footer className="border-t border-border mt-12 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Educational tool for visualizing sequence alignment algorithms</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
