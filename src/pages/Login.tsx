import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Missing details",
        description: "Please enter email and password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    await refreshUser();

    toast({
      title: "Login successful",
      description: "Welcome back!",
    });

    navigate("/detector");
  };

  const handleSignup = async () => {
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    if (!email.trim() || !password.trim()) {
      toast({
        title: "Missing details",
        description: "Please enter email and password.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setLoading(false);

      toast({
        title: "Signup failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        name: name.trim(),
        email,
      });

      if (profileError) {
        console.log(profileError);
      }
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (loginError) {
      toast({
        title: "Signup successful",
        description: "Please login manually.",
      });
      setMode("login");
      return;
    }

    await refreshUser();

    toast({
      title: "Signup successful",
      description: "Your account has been created.",
    });

    navigate("/detector");
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4 bg-background">
      <Card className="w-full max-w-md border-2 shadow-xl">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Shield className="w-7 h-7 text-primary" />
          </div>

          <CardTitle className="text-2xl">
            {mode === "login" ? "Login" : "Create Account"}
          </CardTitle>

          <CardDescription>
            {mode === "login"
              ? "Login to save your phishing scan history."
              : "Create an account to save scans and post with your name."}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label>Your Name</Label>
              <Input
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            disabled={loading}
            onClick={mode === "login" ? handleLogin : handleSignup}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Please wait...
              </>
            ) : mode === "login" ? (
              "Login"
            ) : (
              "Sign Up"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                New here?{" "}
                <button
                  className="text-primary font-medium hover:underline"
                  onClick={() => setMode("signup")}
                >
                  Create account
                </button>
              </>
            ) : (
              <>
                Already have account?{" "}
                <button
                  className="text-primary font-medium hover:underline"
                  onClick={() => setMode("login")}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}