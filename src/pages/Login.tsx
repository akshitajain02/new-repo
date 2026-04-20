import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // 🔐 LOGIN
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      window.location.href = "/detector"
    }
  }

  // 🆕 SIGNUP + AUTO LOGIN
  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      if (error.message.includes("already registered")) {
        alert("User already exists. Please login.")
      } else {
        alert(error.message)
      }
      return
    }

    // 🔥 AUTO LOGIN TRY
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      alert("Signup successful! Please login manually.")
      return
    }

    window.location.href = "/detector"
  }

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Login / Signup</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button
        onClick={handleLogin}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      >
        Login
      </button>

      <button
        onClick={handleSignup}
        style={{ width: "100%", padding: "10px" }}
      >
        Sign Up
      </button>
    </div>
  )
}