import { BrowserRouter, Route, Routes } from "react-router-dom";

import Dashboard from "../pages/dashboard";
import Register from "../pages/register";
import AddStationMap from "../pages/addStationMap";
import { AuthProvider } from "../context/AuthConext";
import Unauthorized from "../pages/Unauthorized";
import ProtectedRoute from "../components/protectedRoute";
import MyStation from "../pages/myStations";
import { StationProvider } from "../context/StationContext";
import FuelStock from "../pages/fuelStockManage";
import Setting from "../pages/setting";
import MapView from "../pages/mapView";
import CustomerMapView from "../pages/customerMapView";
import CustomerSetting from "../pages/customerSetting";
import LoginRedirect from "./loginRedirect";

function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StationProvider>
          <Routes>
            <Route path="/login" element={<LoginRedirect />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            <Route
              path="/stationMap"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <AddStationMap />
                </ProtectedRoute>
              }
            />

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
                  <MyStation />
                </ProtectedRoute>
              }
            />

            <Route
              path="/fuelStock"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <FuelStock />
                </ProtectedRoute>
              }
            />

            <Route
              path="/setting"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <Setting />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mapView"
              element={
                <ProtectedRoute allowedRoles={["owner"]}>
                  <MapView />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customerMapView"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <CustomerMapView />
                </ProtectedRoute>
              }
            />

            <Route
              path="/customerSetting"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <CustomerSetting />
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
