import { createContext, useContext, useState } from "react";
import { getAuthenticatedMerchant } from "../api/endpoints/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize merchant from localStorage if available
  const [merchant, internalSetMerchant] = useState(() => {
    const storedMerchant = localStorage.getItem("merchant");
    return storedMerchant ? JSON.parse(storedMerchant) : null;
  });

  const [loading, setLoading] = useState(false);

  // Persist merchant across browser refreshes
  const setMerchant = (newMerchant) => {
    internalSetMerchant(newMerchant);
    if (newMerchant) {
      localStorage.setItem("merchant", JSON.stringify(newMerchant));
    } else {
      localStorage.removeItem("merchant");
    }
  };

  const fetchMerchant = async () => {
    setLoading(true);
    try {
      const data = await getAuthenticatedMerchant();
      setMerchant(data.merchant);
    } catch (error) {
      setMerchant(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ merchant, setMerchant, loading, fetchMerchant }}
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
