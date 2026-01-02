import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import { hasAccessToken } from "../services/tokenService";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({
  children,
  allowedPermissions = [],
  requireAll = false,
}) {
  const { merchant, loading, fetchMerchant } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Attempt to fetch merchant
    if (hasAccessToken() && !merchant && !loading) fetchMerchant();
  }, [merchant, loading, fetchMerchant]);

  // Merchant fetch in progress
  if (loading) return <LoadingScreen />;

  // Merchant fetch unsuccessful
  if (!merchant && !loading) return <Navigate to="/login" replace />;

  // Check permissions if specified
  if (allowedPermissions.length > 0) {
    const hasPermission = requireAll
      ? allowedPermissions.every((p) => merchant.permissions?.includes(p))
      : allowedPermissions.some((p) => merchant.permissions?.includes(p));

    if (!hasPermission) {
      console.log("[ProtectedRoute] Unauthorized access:", {
        path: location.pathname,
        merchantPermissions: merchant.permissions,
        allowedPermissions,
      });

      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Render protected content
  return children;
}
