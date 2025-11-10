import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Mail, Link as LinkIcon, CreditCard } from "lucide-react";

export const PhishingExamples = () => {
  const examples = [
    {
      type: "Email Phishing",
      icon: Mail,
      threat: "High",
      description: "Fraudulent emails impersonating legitimate organizations",
      example: {
        from: "security@paypa1-support.com",
        subject: "URGENT: Your account will be suspended",
        body: "Your PayPal account has been limited. Click here immediately to verify your identity and restore access.",
      },
      indicators: [
        "Misspelled domain (paypa1 vs paypal)",
        "Urgency and fear tactics",
        "Suspicious sender address",
        "Request for sensitive information",
      ],
    },
    {
      type: "Spear Phishing",
      icon: AlertTriangle,
      threat: "Critical",
      description: "Targeted attacks using personal information",
      example: {
        from: "ceo@yourcompany.net",
        subject: "Urgent Wire Transfer Needed",
        body: "Hi [Your Name], I'm in a meeting and need you to process a wire transfer of $50,000 to this account immediately. I'll explain later.",
      },
      indicators: [
        "Impersonates authority figure",
        "Creates false urgency",
        "Requests unusual action",
        "Slightly different domain",
      ],
    },
    {
      type: "Phishing Links",
      icon: LinkIcon,
      threat: "High",
      description: "Malicious URLs disguised as legitimate sites",
      example: {
        from: "noreply@amazon-security.com",
        subject: "Verify Your Recent Purchase",
        body: "We noticed suspicious activity. Click here to verify: http://amaz0n-verify.suspicious-domain.com/account",
      },
      indicators: [
        "Suspicious URL structure",
        "Similar-looking characters (0 vs O)",
        "Unfamiliar domain",
        "Unsolicited verification request",
      ],
    },
    {
      type: "Credential Harvesting",
      icon: CreditCard,
      threat: "Critical",
      description: "Fake login pages stealing credentials",
      example: {
        from: "support@microsoft-security.com",
        subject: "Password Expiration Notice",
        body: "Your Microsoft 365 password will expire in 24 hours. Update it now to avoid service interruption: [Fake Login Page]",
      },
      indicators: [
        "Fake login page URL",
        "Pressure to act quickly",
        "Request for password",
        "Non-official domain",
      ],
    },
  ];

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case "Critical":
        return "destructive";
      case "High":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <section id="examples" className="py-20 px-4 bg-muted/30">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Common Phishing <span className="text-destructive">Attack Examples</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn to recognize these common phishing tactics and protect yourself from cyber threats
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {examples.map((example, index) => {
            const Icon = example.icon;
            return (
              <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-2 rounded-lg bg-destructive/10">
                      <Icon className="w-6 h-6 text-destructive" />
                    </div>
                    <Badge variant={getThreatColor(example.threat) as any}>
                      {example.threat} Threat
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl">{example.type}</CardTitle>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">From:</span> {example.example.from}
                      </div>
                      <div>
                        <span className="font-semibold">Subject:</span> {example.example.subject}
                      </div>
                      <div className="pt-2 border-t border-destructive/20">
                        <span className="italic text-muted-foreground">{example.example.body}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-warning" />
                      Warning Signs:
                    </h4>
                    <ul className="space-y-1">
                      {example.indicators.map((indicator, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-destructive mt-1">•</span>
                          {indicator}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
