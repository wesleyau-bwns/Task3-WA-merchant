import { createContext, useContext, useState } from "react";
import {
  getAuthenticatedMerchant,
  getPermissions,
} from "../api/endpoints/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [merchant, setMerchant] = useState(null);
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMerchant = async () => {
    setLoading(true);
    try {
      const response = await getAuthenticatedMerchant();
      const merchant = response.data.merchant || null;
      setMerchant(merchant);
    } catch {
      setMerchant(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await getPermissions();
      const perms = response.data.permissions || [];
      setPermissions(perms);
    } catch (err) {
      setPermissions([]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        merchant,
        permissions,
        loading,
        setMerchant,
        fetchMerchant,
        fetchPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
