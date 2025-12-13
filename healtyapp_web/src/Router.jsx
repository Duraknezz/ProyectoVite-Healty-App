// src/router.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./views/LoginPage";
import Dashboard from "./views/Dashboard";
import PacientesList from "./modules/pacientes/PacientesListF";
import PacienteForm from "./modules/pacientes/PacienteForm";
import CitasForm from "./modules/citas/CitasForm";
import CitasList from "./modules/citas/CitasList";
import PlanList from "./modules/plan/planList";
import PlanForm from "./modules/plan/planForm";
import PlanDetail from "./modules/plan/planDetail";
import Reportes from "./modules/reportes/Reportes";


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
            <Route path="/plan" element={<PrivateRoute><PlanList/></PrivateRoute>} />
            <Route path="/plan/nuevo" element={<PrivateRoute><PlanForm/></PrivateRoute>} />
            <Route path="/plan/:id/editar" element={<PrivateRoute><PlanForm/></PrivateRoute>} />
            <Route path="/plan/:id" element={<PlanDetail />} />
            <Route path="/reportes" element={<PrivateRoute><Reportes /></PrivateRoute>} />
        </Routes>
    </BrowserRouter>
);
}
