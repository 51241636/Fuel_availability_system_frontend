
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "../pages/login";
import Dashboard from "../pages/dashboard";
import Register from "../pages/register";
import AddStationMap from "../pages/addStationMap";
import {AuthProvider } from "../context/AuthConext";
import Unauthorized from "../pages/Unauthorized";
import ProtectedRoute from "../components/protectedRoute";
import MyStation from "../pages/myStations";
import { StationProvider } from "../context/StationContext";
import FuelStock from "../pages/fuelStockManage";
import Setting from "../pages/setting";

function AppRoutes() {
  return (
    <BrowserRouter>
       <AuthProvider>
               <StationProvider>
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
          <Route
            path="/myStation"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <MyStation/>
              </ProtectedRoute>
            }
          />

           <Route
            path="/fuelStock"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <FuelStock/>
              </ProtectedRoute>
            }
          />

          <Route
            path="/setting"
            element={
              <ProtectedRoute allowedRoles={["owner"]}>
                <Setting/>
              </ProtectedRoute>
            }
          />
          
        </Routes>

         </StationProvider>
    </AuthProvider>
      </BrowserRouter>

  );
}

export default AppRoutes;
