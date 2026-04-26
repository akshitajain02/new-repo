import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Mail, ShieldCheck, UserX } from "lucide-react";
import { useState, useEffect } from "react";

export const ContactSection = () => {
  const [stealing, setStealing] = useState(false);

  // sirf animation (no navigation now)
  useEffect(() => {
    const interval = setInterval(() => {
      setStealing(true);
      setTimeout(() => setStealing(false), 5000);
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const developers = [
    {
      name: "Akshita",
      role: "Developer",
      phone: "6266636***",
      email: "25cs1ak14@mitsgwl.ac.in",
    },
    {
      name: "Abhayraj",
      role: "Developer",
      phone: "9131711***",
      email: "25cs1ab4@mitsgwl.ac.in",
    },
  ];

  return (
    <section id="contact" className="relative py-20 px-4 overflow-hidden">
      <div className="container max-w-5xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Contact the Team
          </h2>
          <p className="text-muted-foreground">
            Reach out to developers — but beware, scammers are always watching 👀
          </p>
        </div>

        {/* Contact Card */}
        <div className="relative">
          <Card
            className={`relative border-2 border-primary/30 shadow-xl overflow-hidden transition ${
              stealing ? "animate-shake-x" : ""
            }`}
          >
            {/* Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-green-500/10 border text-green-500 text-xs font-semibold">
              <ShieldCheck className="w-3 h-3" />
              Verified
            </div>

            <CardHeader>
              <CardTitle>Developers</CardTitle>
              <CardDescription>Cybersecurity Enthusiasts</CardDescription>
            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-4">

              {developers.map((dev) => (
                <div
                  key={dev.name}
                  className="p-4 rounded-xl border bg-card hover:border-primary/40 transition"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">{dev.name}</div>
                      <div className="text-xs text-muted-foreground">{dev.role}</div>
                    </div>
                  </div>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {dev.phone}
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {dev.email}
                    </div>
                  </div>
                </div>
              ))}

            </CardContent>
          </Card>

          {/* Scammer Animation */}
          <div
            className={`absolute top-0 left-0 ${
              stealing ? "animate-scammer-run opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex flex-col items-center">
              <div className="p-3 rounded-full bg-red-500/20 border-2 border-red-500">
                <UserX className="w-6 h-6 text-red-500" />
              </div>
              <span className="text-xs font-bold text-red-500">SCAMMER</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};