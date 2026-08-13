"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

const T = {
  greenDeep:  "#0A1F0D",
  greenDark:  "#122A16",
  greenBrand: "#2D7A38",
  yellowGold: "#F0C419",
  yellowPale: "#FFFBDF",
  offWhite:   "#F5F5EE",
  red:        "#ef4444",
};

interface AdminLoginProps {
  onClose: () => void;
}

export default function AdminLogin({ onClose: onClose }: AdminLoginProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // reference prop to avoid unused variable lint/error
  void onClose;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push("/admin");
        router.refresh();
      }
      } catch (err) {
        // log the caught error to avoid unused variable lint/error
        // and help with debugging
        console.error(err);
        setError("An error occurred. Please try again.");
    }

    setLoading(false);
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/admin" });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@400;500;600;700&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: ${T.yellowPale}; font-family: 'Outfit', sans-serif; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${T.greenDeep} 0%, ${T.greenDark} 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}>
        <div style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "2.5rem",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close login"
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            width: "34px",
            height: "34px",
            borderRadius: "50%",
            border: "1px solid rgba(10,31,13,0.12)",
            background: "transparent",
            color: T.greenDeep,
            fontSize: "1.2rem",
            lineHeight: 1,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >

          ×
        </button>
          {/* Logo/Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{
              fontSize: "3rem",
              marginBottom: "0.5rem",
            }}></div>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.8rem",
              fontWeight: 700,
              color: T.greenDeep,
              marginBottom: "0.25rem",
            }}>
              Login
            </h1>
            {/* <p style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.85rem",
              color: "rgba(10,31,13,0.5)",
            }}>
              Jomo's Bakehouse Dashboard
            </p> */}
          </div>

          {/* Error message */}
          {(error || searchParams?.get("error")) && (
            <div style={{
              padding: "1rem",
              background: "rgba(239,68,68,0.1)",
              border: `1px solid ${T.red}`,
              borderRadius: "6px",
              marginBottom: "1.5rem",
              fontFamily: "'Outfit', sans-serif",
              fontSize: "0.85rem",
              color: T.red,
            }}>
              {error || searchParams.get("error")}
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{
                display: "block",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: T.greenBrand,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "0.5rem",
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid rgba(10,31,13,0.2)",
                  borderRadius: "6px",
                  fontSize: "0.95rem",
                  fontFamily: "'Outfit', sans-serif",
                }}
              />
            </div>

            <div style={{ marginBottom: "1.75rem" }}>
              <label style={{
                display: "block",
                fontFamily: "'Outfit', sans-serif",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: T.greenBrand,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "0.5rem",
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  border: "1px solid rgba(10,31,13,0.2)",
                  borderRadius: "6px",
                  fontSize: "0.95rem",
                  fontFamily: "'Outfit', sans-serif",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px",
                background: loading ? "rgba(45,122,56,0.5)" : T.greenBrand,
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontSize: "1rem",
                fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Outfit', sans-serif",
                marginBottom: "1rem",
              }}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            margin: "1.5rem 0",
          }}>
            <div style={{ flex: 1, height: "1px", background: "rgba(10,31,13,0.1)" }} />
            <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: "0.75rem", color: "rgba(10,31,13,0.4)" }}>
              OR
            </span>
            <div style={{ flex: 1, height: "1px", background: "rgba(10,31,13,0.1)" }} />
          </div>

          {/* Google sign-in */}
          <button
            onClick={handleGoogleSignIn}
            style={{
              width: "100%",
              padding: "12px",
              background: "#fff",
              color: T.greenDeep,
              border: "1px solid rgba(10,31,13,0.2)",
              borderRadius: "6px",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.335z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continue with Google
          </button>

          <p style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "0.75rem",
            color: "rgba(10,31,13,0.4)",
            textAlign: "center",
            marginTop: "1.5rem",
          }}>
            Admin access only. Unauthorized access is monitored and logged.
          </p>
        </div>
      </div>
    </>
  );
}
