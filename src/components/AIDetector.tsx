import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const AIDetector = () => {
  const [emailText, setEmailText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const analyzeEmail = async () => {
    if (!emailText.trim()) {
      toast({
        title: "Enter email first",
        variant: "destructive",
      });
      return;
    }

    setAnalyzing(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailText }),
      });

      const data = await res.json();
      setResult(data);

    } catch (err) {
      console.log(err);
    }

    setAnalyzing(false);
  };

  return (
    <section id="detector" className="py-20 px-4">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI Powered Detection</span>
          </div>

          <h2 className="text-4xl font-bold">
            Email <span className="text-primary">Phishing Detector</span>
          </h2>

          <p className="text-muted-foreground mt-2">
            Paste suspicious email and let AI detect threats in real-time
          </p>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* LEFT PANEL */}
          <Card className="p-6 backdrop-blur bg-white/50 dark:bg-gray-900/50 border shadow-xl">

            <h3 className="text-lg font-semibold mb-3">Email Input</h3>

            <Textarea
              placeholder="Paste email here..."
              className="min-h-[300px] font-mono text-sm"
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
            />

            <Button
              onClick={analyzeEmail}
              disabled={analyzing}
              className="w-full mt-4 text-lg"
            >
              {analyzing ? (
                <>
                  <Loader2 className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Shield /> Scan Email
                </>
              )}
            </Button>

          </Card>

          {/* RIGHT PANEL */}
          <Card className="p-6 backdrop-blur bg-white/50 dark:bg-gray-900/50 border shadow-xl">

            {!result ? (
              <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground">
                <Shield className="w-16 h-16 mb-4" />
                <p>No results yet</p>
              </div>
            ) : (
              <div className="space-y-6">

                {/* RESULT CARD */}
                <div className={`p-5 rounded-xl border-2 ${
                  result.isPhishing
                    ? "border-red-500 bg-red-500/10"
                    : "border-green-500 bg-green-500/10"
                }`}>

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">
                      {result.isPhishing ? (
                        <AlertTriangle className="text-red-500 w-8 h-8" />
                      ) : (
                        <CheckCircle2 className="text-green-500 w-8 h-8" />
                      )}

                      <div>
                        <h3 className="text-lg font-bold">
                          {result.isPhishing ? "Phishing Detected" : "Safe Email"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Confidence: {result.confidence}%
                        </p>
                      </div>
                    </div>

                    <Badge variant={result.isPhishing ? "destructive" : "success"}>
                      {result.isPhishing ? "DANGER" : "SAFE"}
                    </Badge>
                  </div>
                </div>

                {/* INDICATORS */}
                <div>
                  <h4 className="font-semibold mb-2">Indicators</h4>
                  <ul className="space-y-2">
                    {result.indicators?.map((item: string, i: number) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <span className={result.isPhishing ? "text-red-500" : "text-green-500"}>
                          {result.isPhishing ? "⚠" : "✓"}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* RECOMMENDATION */}
                <div className="p-4 rounded-lg bg-muted">
                  <h4 className="font-semibold mb-2">Recommendation</h4>
                  <p className="text-sm text-muted-foreground">
                    {result.recommendation}
                  </p>
                </div>

              </div>
            )}

          </Card>

        </div>

      </div>
    </section>
  );
};