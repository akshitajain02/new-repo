import { predictEmail } from "@/ml/mlModel";
import {
  Brain,
  Zap,
  Layers,
  ScanLine,
} from "lucide-react";

import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import {
  AlertTriangle,
  CheckCircle2,
  Shield,
  Loader2,
  ArrowLeft,
  Clock,
  Mail,
  Activity,
  Database,
  Eye,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const PHISHING_KEYWORDS = [
  "urgent", "immediate action", "act now", "act immediately", "expire", "expires today",
  "limited time", "last chance", "final notice", "deadline", "within 24 hours",
  "respond now", "do not ignore", "time sensitive", "important update",

  "verify", "verify your account", "verify identity", "validate", "validate your account",
  "confirm", "confirm your identity", "confirm your account", "update your information",
  "update your account", "reset password", "password reset", "change password",
  "login credentials", "your account", "account suspended", "account locked",
  "locked account", "suspended", "suspend", "deactivated", "reactivate",
  "unauthorized access", "unauthorized login", "unusual activity", "suspicious activity",
  "security alert", "security warning", "security notice", "security breach",

  "click here", "click below", "click the link", "follow this link",
  "tap here", "open attachment", "download attachment", "view document",
  "review and confirm", "sign in here", "log in to continue",

  "dear customer", "dear user", "dear client", "dear member", "dear account holder",
  "valued customer", "to whom it may concern",

  "congratulations", "you have won", "you've won", "winner", "lottery",
  "prize", "claim your prize", "claim now", "free gift", "gift card",
  "voucher", "cash prize", "jackpot", "inheritance", "beneficiary",
  "unclaimed funds", "wire transfer", "bank transfer", "money transfer",
  "transfer fee", "processing fee", "tax clearance", "western union",
  "bitcoin", "cryptocurrency", "crypto wallet", "investment opportunity",
  "guaranteed returns", "double your money", "risk free",

  "bank account", "credit card", "debit card", "card blocked", "card expired",
  "kyc update", "kyc pending", "complete kyc", "pan card", "aadhaar",
  "upi pin", "otp", "share otp", "your otp is", "atm pin",
  "cvv", "net banking", "internet banking", "ifsc",

  "social security", "ssn", "date of birth", "mother's maiden name",
  "personal information", "sensitive information", "billing information",

  "your computer is infected", "virus detected", "malware detected",
  "microsoft support", "apple support", "tech support", "system warning",
  "drivers outdated", "license expired",

  "package delivery", "package on hold", "shipment", "delivery failed",
  "customs clearance", "tracking number", "redelivery",

  "irs", "income tax refund", "tax refund", "government grant",
  "police complaint", "court notice", "legal action",

  "do not share this", "keep this confidential", "between us only",
  "i need a favor", "are you available",
];

type ScanResult = {
  isPhishing: boolean;
  confidence: number;
  indicators: string[];
  recommendation: string;
};

type RecentScan = {
  id: string;
  email_content: string;
  is_phishing: boolean;
  confidence: number;
  indicators: string[];
  created_at: string;
};

const Detector = () => {
  const [mode, setMode] = useState("keyword");
  const [emailText, setEmailText] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [loadingRecents, setLoadingRecents] = useState(true);

  const { toast } = useToast();
  const { user, logout } = useAuth();

  const stats = [
    {
      label: "Total Scans",
      value: recentScans.length,
      icon: ScanLine,
      tone: "from-primary/20 to-primary/5",
      iconColor: "text-primary",
    },
    {
      label: "Threats Found",
      value: recentScans.filter((s) => s.is_phishing).length,
      icon: AlertTriangle,
      tone: "from-destructive/20 to-destructive/5",
      iconColor: "text-destructive",
      valueClass: "text-destructive",
    },
    {
      label: "Safe Emails",
      value: recentScans.filter((s) => !s.is_phishing).length,
      icon: CheckCircle2,
      tone: "from-success/20 to-success/5",
      iconColor: "text-success",
      valueClass: "text-success",
    },
    {
      label: "Active Keywords",
      value: PHISHING_KEYWORDS.length,
      icon: Activity,
      tone: "from-warning/20 to-warning/5",
      iconColor: "text-warning",
    },
  ];

  useEffect(() => {
    fetchRecentScans();
  }, [user]);

  const fetchRecentScans = async () => {
    setLoadingRecents(true);

    if (!user) {
      setRecentScans([]);
      setLoadingRecents(false);
      return;
    }

    const { data, error } = await supabase
      .from("phishing_scans")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (!error && data) {
      setRecentScans(data);
    }

    setLoadingRecents(false);
  };

  const runKeywordAnalysis = async (): Promise<ScanResult> => {
    const text = emailText.toLowerCase();
    const foundIndicators: string[] = [];
    let suspicionScore = 0;

    PHISHING_KEYWORDS.forEach((keyword) => {
      if (text.includes(keyword)) {
        suspicionScore += 10;
        foundIndicators.push(`Keyword detected: "${keyword}"`);
      }
    });

    if (text.includes("http://") || text.match(/[a-z0-9-]+\.[a-z]{2,}/g)) {
      suspicionScore += 15;
      foundIndicators.push("Suspicious URL patterns found");
    }

    if (text.match(/\$\d+/)) {
      suspicionScore += 10;
      foundIndicators.push("Money reference detected");
    }

    const isPhishing = suspicionScore > 25;
    const confidence = Math.min(98, 45 + suspicionScore);

    const scanResult: ScanResult = {
      isPhishing,
      confidence,
      indicators:
        foundIndicators.length > 0 ? foundIndicators : ["No major red flags"],
      recommendation: isPhishing ? "⚠️ Phishing detected" : "✅ Looks safe",
    };

    setResult(scanResult);
    return scanResult;
  };

  const runAIAnalysis = async (): Promise<ScanResult> => {
  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ emailText }),
    });

    const textResponse = await res.text();

    if (!textResponse) {
      throw new Error("Empty response from AI server");
    }

    let data: any;

    try {
      data = JSON.parse(textResponse);
    } catch {
      throw new Error("Invalid JSON response from AI server");
    }

    if (!res.ok) {
      throw new Error(data?.error || data?.details || "AI request failed");
    }

    const scanResult: ScanResult = {
      isPhishing: Boolean(data.isPhishing),
      confidence: Number(data.confidence ?? 50),
      indicators: Array.isArray(data.indicators)
        ? data.indicators
        : ["AI analysis completed"],
      recommendation:
        data.recommendation ||
        "Review this email carefully before taking action.",
    };

    setResult(scanResult);
    return scanResult;
  } catch (err) {
    console.error("AI ERROR:", err);

    const message =
      err instanceof Error ? err.message : "AI analysis failed";

    const scanResult: ScanResult = {
      isPhishing: true,
      confidence: 50,
      indicators: [
        "AI service did not return a valid response",
        message,
      ],
      recommendation:
        "AI analysis is currently unavailable. Please use Keyword or ML mode for now.",
    };

    setResult(scanResult);
    return scanResult;
  }
};

  const runMLAnalysis = async (): Promise<ScanResult> => {
  const mlResult = predictEmail(emailText);
  const text = emailText.toLowerCase();

  const indicators: string[] = [];

  if (text.includes("urgent") || text.includes("immediately") || text.includes("final warning")) {
    indicators.push("Urgent or pressure-based language detected");
  }

  if (text.includes("verify") || text.includes("login") || text.includes("credentials")) {
    indicators.push("Account verification or credential-related request found");
  }

  if (text.includes("bank") || text.includes("payment") || text.includes("card")) {
    indicators.push("Financial terms detected in the email content");
  }

  if (text.includes("otp") || text.includes("pin") || text.includes("cvv")) {
    indicators.push("Sensitive authentication information mentioned");
  }

  if (text.includes("click") || text.includes("link") || text.includes("download")) {
    indicators.push("Email contains action-oriented link or download language");
  }

  if (indicators.length === 0) {
    indicators.push(
      mlResult.label === 1
        ? "Text pattern is similar to known phishing examples"
        : "No strong phishing indicators were found"
    );
  }

  const scanResult: ScanResult = {
    isPhishing: mlResult.label === 1,
    confidence: mlResult.confidence,
    indicators,
    recommendation:
      mlResult.label === 1
        ? "This email shows phishing-like patterns. Avoid clicking links, downloading attachments, or sharing personal information."
        : "This email appears safe based on the trained ML pattern, but still verify the sender if anything feels unusual.",
  };

  setResult(scanResult);
  return scanResult;
};
const analyzeEmail = async () => {
  console.log("MODE:", mode);

  if (!emailText.trim()) {
    toast({
      title: "Email required",
      description: "Please paste an email before running the scan.",
      variant: "destructive",
    });
    return;
  }

  setAnalyzing(true);
  setResult(null);

  try {
    let scanResult: ScanResult;

    if (mode === "keyword") {
      scanResult = await runKeywordAnalysis();
    } else if (mode === "ai") {
      scanResult = await runAIAnalysis();
    } else if (mode === "ml") {
      scanResult = await runMLAnalysis();
    } else {
      scanResult = await runKeywordAnalysis();
    }

    setAnalyzing(false);

    if (user && scanResult) {
      supabase
        .from("phishing_scans")
        .insert({
          email_content: emailText,
          is_phishing: scanResult.isPhishing,
          confidence: scanResult.confidence,
          indicators: scanResult.indicators,
          user_id: user.id,
        })
        .then(({ error }) => {
          if (error) {
            console.error("Scan save error:", error);
          } else {
            fetchRecentScans();
          }
        });
    }
  } catch (error) {
    console.error("Analysis error:", error);

    toast({
      title: "Analysis failed",
      description: "Something went wrong while scanning this email.",
      variant: "destructive",
    });

    setAnalyzing(false);
  }
};
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-50">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </Link>

            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold">Phishing Detector</h1>
            </div>

            {user ? (
              <Button onClick={logout} variant="outline" size="sm">
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
            )}
          </div>

          <Badge variant="outline" className="gap-1">
            <Database className="w-3 h-3" />
            {recentScans.length} Scans Recorded
          </Badge>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Tabs value={mode} onValueChange={(v) => setMode(v)} className="mb-4">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger value="ai" className="gap-2 py-2.5">
              <Brain className="w-4 h-4" />
              AI Analysis
            </TabsTrigger>

            <TabsTrigger value="keyword" className="gap-2 py-2.5">
              <Zap className="w-4 h-4" />
              Keyword
            </TabsTrigger>

            <TabsTrigger value="ml" className="gap-2 py-2.5">
              <Layers className="w-4 h-4" />
              ML
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => {
            const Icon = s.icon;

            return (
              <Card
                key={s.label}
                className={`relative overflow-hidden border bg-gradient-to-br ${s.tone}`}
              >
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-background/70 backdrop-blur-sm shadow-sm">
                    <Icon className={`w-5 h-5 ${s.iconColor}`} />
                  </div>

                  <div>
                    <div className={`text-2xl font-bold ${s.valueClass ?? ""}`}>
                      {s.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-2 border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  <CardTitle>Email Scanner</CardTitle>
                </div>
                <CardDescription>
                  Paste complete email content including headers, subject line,
                  and body
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <Textarea
                  placeholder={
                    "From: suspicious@email.com\nSubject: Urgent Account Verification Required\n\nDear customer,\nYour account has been compromised. Click here to verify your identity immediately..."
                  }
                  className="min-h-[220px] font-mono text-sm bg-muted/30"
                  value={emailText}
                  onChange={(e) => setEmailText(e.target.value)}
                />

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {emailText.length} characters
                  </span>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEmailText("");
                        setResult(null);
                      }}
                      disabled={!emailText}
                    >
                      Clear
                    </Button>

                    <Button
                      onClick={analyzeEmail}
                      disabled={analyzing || !emailText.trim()}
                      variant="hero"
                      size="sm"
                    >
                      {analyzing ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4" />
                          Run Scan
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border bg-gradient-to-br from-muted/40 to-background">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="w-4 h-4 text-primary" />
                  <h3 className="font-semibold text-sm uppercase tracking-wider">
                    AI vs Keyword vs ML — Quick Comparison
                  </h3>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="rounded-lg border border-primary/20 p-4 bg-background/50 hover:scale-105 transition">
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-sm">AI Analysis</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-muted-foreground hover:scale-105 transition">
                      <li className="flex gap-2">
                        <span className="text-success">+</span> Understands
                        meaning & context
                      </li>
                      <li className="flex gap-2">
                        <span className="text-success">+</span> Catches new,
                        unseen scams
                      </li>
                      <li className="flex gap-2">
                        <span className="text-success">+</span> Explains its
                        reasoning
                      </li>
                      <li className="flex gap-2">
                        <span className="text-destructive">−</span> Slower,
                        needs internet
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-warning/20 p-4 bg-background/50 hover:scale-105 transition">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-warning" />
                      <span className="font-semibold text-sm">
                        Keyword Engine
                      </span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-muted-foreground hover:scale-105 transition">
                      <li className="flex gap-2">
                        <span className="text-success">+</span> Instant, no API
                        calls
                      </li>
                      <li className="flex gap-2">
                        <span className="text-success">+</span> Predictable &
                        transparent
                      </li>
                      <li className="flex gap-2">
                        <span className="text-destructive">−</span> Misses
                        reworded attacks
                      </li>
                      <li className="flex gap-2">
                        <span className="text-destructive">−</span> No context
                        awareness
                      </li>
                    </ul>
                  </div>

                  <div className="rounded-lg border border-success/20 p-4 bg-background/50 hover:scale-105 transition">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-success" />
                      <span className="font-semibold text-sm">ML Model</span>
                    </div>
                    <ul className="space-y-1.5 text-xs text-muted-foreground hover:scale-105 transition">
                      <li className="flex gap-2">
                        <span className="text-success">+</span> Fast pattern
                        recognition
                      </li>
                      <li className="flex gap-2">
                        <span className="text-success">+</span> Learns from past
                        data
                      </li>
                      <li className="flex gap-2">
                        <span className="text-success">+</span> Works offline
                      </li>
                      <li className="flex gap-2">
                        <span className="text-destructive">−</span> Needs
                        training data
                      </li>
                      <li className="flex gap-2">
                        <span className="text-destructive">−</span> Can miss new
                        attack styles
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground">
              Mode: {mode.toUpperCase()}
            </p>

            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  <CardTitle>Scan Results</CardTitle>
                </div>
              </CardHeader>

              <CardContent>
                {!result ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Shield className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">
                      Paste an email above and click "Run Scan" to analyze
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div
                      className="flex items-center justify-between p-5 rounded-xl border-2"
                      style={{
                        borderColor: result.isPhishing
                          ? "hsl(var(--destructive))"
                          : "hsl(var(--success))",
                        backgroundColor: result.isPhishing
                          ? "hsl(var(--destructive) / 0.08)"
                          : "hsl(var(--success) / 0.08)",
                      }}
                    >
                      <div className="flex items-center gap-4">
                        {result.isPhishing ? (
                          <div className="p-3 rounded-full bg-destructive/20">
                            <AlertTriangle className="w-8 h-8 text-destructive" />
                          </div>
                        ) : (
                          <div className="p-3 rounded-full bg-success/20">
                            <CheckCircle2 className="w-8 h-8 text-success" />
                          </div>
                        )}

                        <div>
                          <div className="font-bold text-xl">
                            {result.isPhishing
                              ? "⚠ Phishing Detected"
                              : "✓ Appears Safe"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Confidence: {result.confidence}%
                          </div>
                        </div>
                      </div>

                      <Badge
                        variant={result.isPhishing ? "destructive" : "success"}
                        className="text-sm px-4 py-1"
                      >
                        {result.isPhishing ? "HIGH RISK" : "LOW RISK"}
                      </Badge>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium">Threat Level</span>
                        <span className="text-muted-foreground">
                          {result.confidence}%
                        </span>
                      </div>

                      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${result.confidence}%`,
                            backgroundColor: result.isPhishing
                              ? "hsl(var(--destructive))"
                              : "hsl(var(--success))",
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                        Detected Indicators
                      </h4>

                      <div className="space-y-2">
                        {result.indicators.map((indicator, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 text-sm"
                          >
                            <span
                              className={`mt-0.5 ${
                                result.isPhishing
                                  ? "text-destructive"
                                  : "text-success"
                              }`}
                            >
                              {result.isPhishing ? "⚠" : "✓"}
                            </span>
                            <span>{indicator}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-muted border">
                      <h4 className="font-semibold mb-2 text-sm">
                        Recommendation
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {result.recommendation}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <CardTitle className="text-lg">Recent Scans</CardTitle>
                  </div>

                  <Button variant="ghost" size="sm" onClick={fetchRecentScans}>
                    <Loader2
                      className={`w-3 h-3 ${
                        loadingRecents ? "animate-spin" : ""
                      }`}
                    />
                  </Button>
                </div>
              </CardHeader>

              <CardContent>
                {loadingRecents ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : recentScans.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No scans yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Login and scan an email to save results here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {recentScans.map((scan) => (
                      <div
                        key={scan.id}
                        className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/60 transition-colors cursor-default"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Badge
                            variant={
                              scan.is_phishing ? "destructive" : "success"
                            }
                            className="text-xs"
                          >
                            {scan.is_phishing ? "PHISHING" : "SAFE"}
                          </Badge>

                          <span className="text-xs text-muted-foreground">
                            {scan.confidence}%
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2 mb-1">
                          {scan.email_content.substring(0, 100)}...
                        </p>

                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {new Date(scan.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border">
              <CardHeader>
                <CardTitle className="text-lg">Active Keywords</CardTitle>
                <CardDescription>Patterns being scanned</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-1.5">
                  {PHISHING_KEYWORDS.slice(0, 35).map((kw) => (
                    <Badge key={kw} variant="outline" className="text-xs">
                      {kw}
                    </Badge>
                  ))}

                  <Badge variant="secondary" className="text-xs">
                    +{PHISHING_KEYWORDS.length - 35} more
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detector;