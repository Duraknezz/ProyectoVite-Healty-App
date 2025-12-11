// src/router.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./views/LoginPage";
import Dashboard from "./views/Dashboard";
import PacientesList from "./modules/pacientes/PacientesListF";
import PacienteForm from "./modules/pacientes/PacienteForm";
import CitasForm from "./modules/citas/CitasForm";
import CitasList from "./modules/citas/CitasList";


function PrivateRoute({ children }) {
  const token = localStorage.getItem("access");
  return token ? children : <Navigate to="/login" />;
}

export default function AppRouter() {
return (
    <BrowserRouter>
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Dashboard />
                    </PrivateRoute>
                }
            />
            <Route
                path="/pacientes"
                element={
                    <PrivateRoute>
                        <PacientesList />
                    </PrivateRoute>
                }
            />
            <Route
                path="/pacientes/nuevo"
                element={
                    <PrivateRoute>
                        <PacienteForm />
                    </PrivateRoute>
                }
            />
            <Route
                path="/pacientes/:id/editar"
                element={
                    <PrivateRoute>
                        <PacienteForm />
                    </PrivateRoute>
                }
            />
            <Route
                path="/citas"
                element={
                    <PrivateRoute>
                        <CitasList />
                    </PrivateRoute>
                }
            />
            <Route
                path="/citas/nueva"
                element={
                    <PrivateRoute>
                        <CitasForm />
                    </PrivateRoute>
                }
            />
            <Route
                path="/citas/:id/editar"
                element={
                    <PrivateRoute>
                        <CitasForm />
                    </PrivateRoute>
                }
            />
            <Route
                path="/pacientes/:id/citas"
                element={
                    <PrivateRoute>
                        <CitasList />
                    </PrivateRoute>
                }
            />
        </Routes>
    </BrowserRouter>
);
}
