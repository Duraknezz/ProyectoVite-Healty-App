/* cSpell:disable */

import { useNavigate } from "react-router-dom";


const styles = {
  page: {
    minHeight: "100vh",
    background: `
      radial-gradient(circle at top left, rgba(34,197,94,0.25), transparent 60%),
      radial-gradient(circle at bottom right, rgba(16,185,129,0.25), transparent 55%),
      linear-gradient(135deg, #ecfdf5, #f0fdf4)
    `,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },

  container: {
    width: "100%",
    maxWidth: "800px",
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    borderRadius: "18px",
    padding: "40px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
  },

  header: {
    textAlign: "center",
    marginBottom: "30px",
  },

  title: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#064e3b",
    marginBottom: "8px",
  },

  subtitle: {
    fontSize: "16px",
    color: "#047857",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
    marginTop: "30px",
  },

  card: {
    padding: "24px",
    borderRadius: "14px",
    border: "1px solid rgba(0,0,0,0.06)",
    cursor: "pointer",
    transition: "all 0.25s ease",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    background: "rgba(255,255,255,0.85)",
  },

  cardHover: {
    transform: "translateY(-8px)",
    boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
    background: "#ffffff",
  },

  icon: {
    fontSize: "38px",
    marginBottom: "12px",
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#065f46",
    marginBottom: "6px",
  },

  cardText: {
    fontSize: "14px",
    color: "#047857",
  },
};


function Card({ icon, title, text, onClick }) {
  return (
    <div
      style={styles.card}
      onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.cardHover)}
      onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.card)}
      onClick={onClick}
    >
      <div style={styles.icon}>{icon}</div>
      <div style={styles.cardTitle}>{title}</div>
      <div style={styles.cardText}>{text}</div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>Panel Principal</h2>
          <p style={styles.subtitle}>
            Bienvenido a HealtyApp. Selecciona un módulo para continuar.
          </p>
        </div>

        <div style={styles.grid}>
          <Card
            icon="🧑‍⚕️"
            title="Pacientes"
            text="Gestiona la información de tus pacientes"
            onClick={() => navigate("/pacientes")}
          />

          <Card
            icon="📅"
            title="Citas"
            text="Agenda y administra las citas médicas"
            onClick={() => navigate("/citas")}
          />

          <Card
            icon="🥗"
            title="Planes Alimenticios"
            text="Crea y consulta planes nutricionales"
            onClick={() => navigate("/plan")}
          />

          <Card
            icon="📊"
            title="Reportes"
            text="Visualiza y exporta reportes del sistema"
            onClick={() => navigate("/reportes")}
          />
        </div>
      </div>
    </div>
  );
}
