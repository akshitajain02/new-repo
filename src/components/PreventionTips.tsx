import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

export const PreventionTips = () => {
  const tips = [
    {
      icon: Eye,
      title: "Verify the Sender",
      description: "Always check the sender's email address carefully",
      actions: [
        "Look for slight misspellings in the domain",
        "Hover over links to see the actual URL",
        "Check if the domain matches the official website",
        "Be suspicious of generic greetings",
      ],
    },
    {
      icon: Lock,
      title: "Use Strong Authentication",
      description: "Enable multi-factor authentication (MFA) on all accounts",
      actions: [
        "Use authenticator apps instead of SMS",
        "Enable biometric authentication when available",
        "Use unique passwords for each account",
        "Consider using a password manager",
      ],
    },
    {
      icon: Shield,
      title: "Think Before You Click",
      description: "Never click suspicious links or download unknown attachments",
      actions: [
        "Manually type URLs instead of clicking links",
        "Scan attachments with antivirus software",
        "Verify requests through official channels",
        "Don't trust urgent or threatening messages",
      ],
    },
    {
      icon: RefreshCw,
      title: "Keep Software Updated",
      description: "Regular updates patch security vulnerabilities",
      actions: [
        "Enable automatic updates for OS and browsers",
        "Update security software regularly",
        "Keep all applications up to date",
        "Use supported software versions only",
      ],
    },
    {
      icon: AlertCircle,
      title: "Recognize Red Flags",
      description: "Be aware of common phishing indicators",
      actions: [
        "Urgency and pressure tactics",
        "Too good to be true offers",
        "Requests for sensitive information",
        "Poor grammar and spelling errors",
      ],
    },
    {
      icon: CheckCircle2,
      title: "Verify Before Acting",
      description: "Confirm through official channels before responding",
      actions: [
        "Call the company directly using official numbers",
        "Log in through official websites, not email links",
        "Verify with IT department for work emails",
        "Report suspicious emails to security team",
      ],
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="container max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-success">Prevention</span> Best Practices
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Follow these essential guidelines to protect yourself from phishing attacks
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <Card key={index} className="border-2 hover:border-success/50 transition-colors">
                <CardHeader>
                  <div className="p-3 rounded-lg bg-success/10 w-fit mb-3">
                    <Icon className="w-6 h-6 text-success" />
                  </div>
                  <CardTitle className="text-xl">{tip.title}</CardTitle>
                  <CardDescription>{tip.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tip.actions.map((action, i) => (
                      <li key={i} className="text-sm flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 p-8 rounded-xl bg-gradient-to-r from-success/10 to-primary/10 border-2 border-success/20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-success/20">
              <Shield className="w-8 h-8 text-success" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">Security Awareness Training</h3>
              <p className="text-muted-foreground mb-4">
                Regular training and awareness programs are crucial for maintaining a strong security posture. 
                Organizations should conduct periodic phishing simulations and educational sessions to keep 
                employees vigilant against evolving threats.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-success/20 text-sm font-medium">
                  Monthly Training
                </span>
                <span className="px-3 py-1 rounded-full bg-success/20 text-sm font-medium">
                  Phishing Simulations
                </span>
                <span className="px-3 py-1 rounded-full bg-success/20 text-sm font-medium">
                  Security Updates
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
