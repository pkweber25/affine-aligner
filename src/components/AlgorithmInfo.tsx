import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const AlgorithmInfo = () => {
  return (
    <Card className="p-6 bg-gradient-card shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <Info className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">About the Algorithm</h2>
      </div>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="overview">
          <AccordionTrigger className="text-foreground">What is Affine Gap Alignment?</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p className="mb-2">
              The Needleman-Wunsch algorithm with affine gap penalties is a dynamic programming
              approach for global sequence alignment that uses a more biologically realistic gap
              penalty model.
            </p>
            <p>
              Unlike simple linear gap penalties, affine gaps distinguish between opening a gap
              (more costly) and extending an existing gap (less costly), matching biological
              mutation patterns.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="matrices">
          <AccordionTrigger className="text-foreground">The Three-Matrix Approach</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong className="text-foreground">M[i][j]:</strong> Best score aligning sequences
                up to positions i and j with a match/mismatch
              </li>
              <li>
                <strong className="text-foreground">Ix[i][j]:</strong> Best score ending with a gap
                in sequence 2 (horizontal gap)
              </li>
              <li>
                <strong className="text-foreground">Iy[i][j]:</strong> Best score ending with a gap
                in sequence 1 (vertical gap)
              </li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="formula">
          <AccordionTrigger className="text-foreground">Gap Penalty Formula</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <p className="font-mono text-sm mb-2 text-foreground">
              penalty = gap_open + gap_extend × (length - 1)
            </p>
            <p className="mb-2">
              The <strong className="text-foreground">gap open</strong> penalty is paid once when
              starting a new gap.
            </p>
            <p>
              The <strong className="text-foreground">gap extend</strong> penalty is paid for each
              additional position in the gap.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="usage">
          <AccordionTrigger className="text-foreground">How to Use This Tool</AccordionTrigger>
          <AccordionContent className="text-muted-foreground">
            <ol className="space-y-2 list-decimal list-inside">
              <li>Enter your DNA or protein sequences in the input boxes</li>
              <li>Adjust alignment parameters using the sliders</li>
              <li>Click "Align" to compute the alignment</li>
              <li>Use animation controls to step through the algorithm</li>
              <li>Hover over matrix cells to see calculation details</li>
              <li>View the final color-coded alignment at the bottom</li>
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
};
