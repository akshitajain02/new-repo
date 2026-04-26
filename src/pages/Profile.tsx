import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { User, Mail, Clock, Shield, AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type RecentScan = {
  id: string;
  email_content: string;
  is_phishing: boolean;
  confidence: number;
  indicators: string[];
  created_at: string;
};

export default function Profile() {
  const { user, profile, loading } = useAuth();
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [loadingScans, setLoadingScans] = useState(true);

  useEffect(() => {
    const fetchScans = async () => {
      if (!user) return;

      setLoadingScans(true);

      const { data } = await supabase
        .from("phishing_scans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(10);

      setRecentScans(data || []);
      setLoadingScans(false);
    };

    fetchScans();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto px-4 py-8 space-y-6">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-3">
              <User className="w-8 h-8 text-primary" />
              User Profile
            </CardTitle>
            <CardDescription>
              Your account details and saved phishing scan history.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border bg-muted/40">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <User className="w-4 h-4" />
                Name
              </div>
              <div className="text-lg font-semibold">
                {profile?.full_name || "User"}
              </div>
            </div>

            <div className="p-4 rounded-xl border bg-muted/40">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Mail className="w-4 h-4" />
                Email
              </div>
              <div className="text-lg font-semibold break-all">
                {user.email}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <div>
                <div className="text-2xl font-bold">{recentScans.length}</div>
                <div className="text-xs text-muted-foreground">Recent Scans</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <div>
                <div className="text-2xl font-bold text-red-500">
                  {recentScans.filter((s) => s.is_phishing).length}
                </div>
                <div className="text-xs text-muted-foreground">Threats Found</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {recentScans.filter((s) => !s.is_phishing).length}
                </div>
                <div className="text-xs text-muted-foreground">Safe Emails</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Scans
            </CardTitle>
            <CardDescription>
              Latest scans saved after login.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {loadingScans ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : recentScans.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No saved scans yet.
              </div>
            ) : (
              <div className="space-y-3">
                {recentScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="p-4 rounded-xl border bg-muted/30"
                  >
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <Badge variant={scan.is_phishing ? "destructive" : "secondary"}>
                        {scan.is_phishing ? "PHISHING" : "SAFE"}
                      </Badge>

                      <span className="text-sm text-muted-foreground">
                        {scan.confidence}% confidence
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {scan.email_content}
                    </p>

                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(scan.created_at).toLocaleString("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}