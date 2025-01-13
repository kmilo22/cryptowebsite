import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rutas protegidas */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            {/* Ruta por defecto */}
            <Route path="*" element={<Login />} />
        </Routes>
    );
};

export default AppRoutes;
