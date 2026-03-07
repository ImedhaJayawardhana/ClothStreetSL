import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #eef2ff 0%, #f5f3ff 100%)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div style={{
        background: "white", borderRadius: "16px", padding: "40px",
        maxWidth: "500px", width: "100%", textAlign: "center",
        boxShadow: "0 20px 60px rgba(99,102,241,0.15)"
      }}>

        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧵</div>

        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#1f2937", margin: "0 0 8px" }}>
          ClothStreet
        </h1>

        <p style={{ color: "#6b7280", marginBottom: "32px" }}>
          Sri Lanka's Textile Marketplace
        </p>

        {user ? (
          /* Logged in state */
          <div>
            <div style={{
              background: "#eef2ff", borderRadius: "12px",
              padding: "16px", marginBottom: "24px"
            }}>
              <p style={{ margin: "0 0 4px", fontSize: "13px", color: "#6b7280" }}>
                Logged in as
              </p>
              <p style={{ margin: "0 0 4px", fontWeight: "700", color: "#1f2937" }}>
                {user.name || user.email}
              </p>
              <span style={{
                background: "#6366f1", color: "white",
                padding: "2px 10px", borderRadius: "20px",
                fontSize: "12px", fontWeight: "600",
                textTransform: "capitalize"
              }}>
                {user.role || "user"}
              </span>
            </div>

            <p style={{
              color: "#16a34a", fontWeight: "600",
              marginBottom: "24px", fontSize: "15px"
            }}>
              ✅ Firebase Authentication is working!
            </p>

            <button
              onClick={handleLogout}
              style={{
                padding: "10px 32px",
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                color: "white", border: "none", borderRadius: "8px",
                fontSize: "14px", fontWeight: "600", cursor: "pointer"
              }}
            >
              Logout
            </button>
          </div>
        ) : (
          /* Logged out state */
          <div>
            <p style={{ color: "#6b7280", marginBottom: "24px" }}>
              Test your Firebase Authentication below
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <Link to="/login">
                <button style={{
                  padding: "10px 28px",
                  background: "linear-gradient(135deg, #6366f1, #7c3aed)",
                  color: "white", border: "none", borderRadius: "8px",
                  fontSize: "14px", fontWeight: "600", cursor: "pointer"
                }}>
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button style={{
                  padding: "10px 28px",
                  background: "white", color: "#6366f1",
                  border: "1.5px solid #6366f1", borderRadius: "8px",
                  fontSize: "14px", fontWeight: "600", cursor: "pointer"
                }}>
                  Register
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}