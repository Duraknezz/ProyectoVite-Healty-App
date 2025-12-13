import { useState } from "react";
import api from "../api/axios";

export default function LoginPage() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/auth/login/", {
        username,
        password,
      });

      localStorage.setItem("access", response.data.access);
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `
          radial-gradient(circle at top left, rgba(34,197,94,0.35), transparent 55%),
          radial-gradient(circle at bottom right, rgba(16,185,129,0.35), transparent 55%),
          linear-gradient(135deg, #ecfdf5, #f0fdf4)
        `,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          width: "380px",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          padding: "2.5rem",
          borderRadius: "18px",
          boxShadow: "0 25px 45px rgba(0,0,0,0.15)",
          textAlign: "center",
          animation: "fadeUp 0.6s ease",
        }}
      >
        {/* Icono */}
        <div
          style={{
            fontSize: "42px",
            marginBottom: "10px",
          }}
        >
          🩺
        </div>

        <h2
          style={{
            marginBottom: "6px",
            color: "#064e3b",
            fontSize: "1.8rem",
            fontWeight: "700",
          }}
        >
          Iniciar Sesión
        </h2>

        <p
          style={{
            marginBottom: "1.8rem",
            color: "#047857",
            fontSize: "0.95rem",
          }}
        >
          Accede al sistema de gestión médica
        </p>

        <form
          onSubmit={handleLogin}
          style={{ display: "grid", gap: "1.1rem" }}
        >
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #d1fae5",
              fontSize: "1rem",
              outline: "none",
            }}
            onFocus={(e) =>
              (e.target.style.border = "1px solid #22c55e")
            }
            onBlur={(e) =>
              (e.target.style.border = "1px solid #d1fae5")
            }
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "12px 14px",
              borderRadius: "10px",
              border: "1px solid #d1fae5",
              fontSize: "1rem",
              outline: "none",
            }}
            onFocus={(e) =>
              (e.target.style.border = "1px solid #22c55e")
            }
            onBlur={(e) =>
              (e.target.style.border = "1px solid #d1fae5")
            }
          />

          <button
            type="submit"
            style={{
              background:
                "linear-gradient(135deg, #22c55e, #16a34a)",
              padding: "12px",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: "600",
              transition: "0.25s",
              marginTop: "5px",
            }}
            onMouseOver={(e) =>
              (e.target.style.transform = "translateY(-2px)")
            }
            onMouseOut={(e) =>
              (e.target.style.transform = "translateY(0)")
            }
          >
            Ingresar
          </button>
        </form>

        {error && (
          <p
            style={{
              marginTop: "1.2rem",
              color: "#b91c1c",
              background: "#fee2e2",
              padding: "0.6rem",
              borderRadius: "10px",
              fontSize: "0.9rem",
            }}
          >
            {error}
          </p>
        )}

        {/* Animaciones */}
        <style>
          {`
            @keyframes fadeUp {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
          `}
        </style>
      </div>
    </div>
  );
}
