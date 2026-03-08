import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            navigate("/");
        } catch {
            setError("Invalid email or password. Please try again.");
        }
        setLoading(false);
    }

    async function handleGoogle() {
        setError("");
        try {
            await loginWithGoogle();
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
        }}>
            <div style={{
                background: "white",
                borderRadius: "16px",
                padding: "40px",
                width: "100%",
                maxWidth: "420px",
                boxShadow: "0 20px 60px rgba(99,102,241,0.15)"
            }}>

                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <div style={{
                        width: "50px", height: "50px",
                        background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                        borderRadius: "12px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        margin: "0 auto 12px",
                        fontSize: "24px"
                    }}>🧵</div>
                    <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#1f2937" }}>
                        Welcome Back
                    </h1>
                    <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: "14px" }}>
                        Login to ClothStreet
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div style={{
                        background: "#fef2f2", border: "1px solid #fecaca",
                        color: "#dc2626", padding: "12px", borderRadius: "8px",
                        marginBottom: "16px", fontSize: "13px"
                    }}>
                        {error}
                    </div>
                )}

                {/* Form */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                    {/* Email */}
                    <div>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: "100%", padding: "10px 14px", borderRadius: "8px",
                                border: "1.5px solid #e5e7eb", fontSize: "14px",
                                outline: "none", boxSizing: "border-box"
                            }}
                            onFocus={(e) => e.target.style.borderColor = "#6366f1"}
                            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label style={{ fontSize: "13px", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: "100%", padding: "10px 14px", borderRadius: "8px",
                                border: "1.5px solid #e5e7eb", fontSize: "14px",
                                outline: "none", boxSizing: "border-box"
                            }}
                            onFocus={(e) => e.target.style.borderColor = "#6366f1"}
                            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
                        />
                    </div>

                    {/* Submit */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{
                            width: "100%", padding: "12px",
                            background: loading ? "#a5b4fc" : "linear-gradient(135deg, #6366f1, #7c3aed)",
                            color: "white", border: "none", borderRadius: "8px",
                            fontSize: "15px", fontWeight: "600",
                            cursor: loading ? "not-allowed" : "pointer",
                            marginTop: "4px"
                        }}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {/* Divider */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
                        <span style={{ color: "#9ca3af", fontSize: "13px" }}>or</span>
                        <div style={{ flex: 1, height: "1px", background: "#e5e7eb" }} />
                    </div>

                    {/* Google */}
                    <button
                        onClick={handleGoogle}
                        style={{
                            width: "100%", padding: "11px",
                            background: "white", color: "#374151",
                            border: "1.5px solid #e5e7eb", borderRadius: "8px",
                            fontSize: "14px", fontWeight: "600", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                        }}
                    >
                        <img src="https://www.google.com/favicon.ico" width="16" height="16" alt="G" />
                        Continue with Google
                    </button>

                </div>

                {/* Register Link */}
                <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "#6b7280" }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: "#6366f1", fontWeight: "600", textDecoration: "none" }}>
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}