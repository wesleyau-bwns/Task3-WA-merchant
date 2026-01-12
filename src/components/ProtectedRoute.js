import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({
  children,
  allowedPermissions = [],
  requireAll = false,
}) {
  const { merchant, permissions, loading, fetchMerchant, fetchPermissions } =
    useAuth();
  const [initialized, setInitialized] = useState(false);
  const location = useLocation();

  // Fetch merchant profile (name and email)
  useEffect(() => {
    if (!merchant && !loading) {
      fetchMerchant().finally(() => setInitialized(true));
    } else {
      setInitialized(true);
    }
  }, [merchant, loading, fetchMerchant]);

  // Ensure permissions are loaded ONLY if needed
  useEffect(() => {
    if (merchant && allowedPermissions.length > 0 && permissions === null) {
      fetchPermissions();
    }
  }, [merchant, permissions, allowedPermissions, fetchPermissions]);

  // Still loading profile or permissions
  if (
    !initialized ||
    loading ||
    (allowedPermissions.length > 0 && permissions === null)
  ) {
    return null;
  }

  // Not authenticated
  if (!merchant) {
    return <Navigate to="/login" replace />;
  }

  // Authorization check (UI-level only)
  if (allowedPermissions.length > 0) {
    const hasPermission = requireAll
      ? allowedPermissions.every((p) => permissions.includes(p))
      : allowedPermissions.some((p) => permissions.includes(p));

    if (!hasPermission) {
      console.log("[ProtectedRoute] Unauthorized access", {
        path: location.pathname,
        permissions,
        allowedPermissions,
      });

      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Render protected content
  return children;
}
