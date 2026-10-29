
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import Register from "../pages/register";
import AddStationMap from "../pages/addStationMap";
import {AuthProvider,useAuth } from "../context/AuthConext";
import Unauthorized from "../pages/Unauthorized";
import ProtectedRoute from "../components/protectedRoute";
import LocationSearchMap from "../pages/addStationMap";

function AppRoutes() {
  return (
    <BrowserRouter>
       <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />}/>
          <Route path="/stationMap" element={<AddStationMap />}/>

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/addNewStation"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <AddStationMap />
              </ProtectedRoute>
            }
          />


        
{/* 
          <Route
            path="/stationMap"
            element={
              <ProtectedRoute />
            }
          /> */}
{/* 
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="*" element={<Navigate to="/login" replace />} /> */}
        </Routes>

      
    </AuthProvider>
      </BrowserRouter>

  );
}

export default AppRoutes;
