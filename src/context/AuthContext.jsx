import React, { createContext, useContext, useState } from 'react';
import { AuthService } from '../services';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [tenants, setTenants] = useState([]);
  const [currentTenant, setCurrentTenant] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const switchTenant = (tenantId) => {
    const found = tenants.find((t) => t.id === tenantId);
    if (found) {
      setCurrentTenant(found);
    }
  };

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      // Dynamic API call
      const data = await AuthService.login(credentials);

      // Extract token dynamically
      const token =
        data?.token ||
        data?.data?.token ||
        data?.accessToken ||
        data?.access_token ||
        null;
      if (token) {
        setAuthToken(token);
      }

      // Extract user dynamically
      const userData =
        data?.user ||
        data?.data?.user ||
        data?.data ||
        (data ? { email: credentials.email, ...data } : null);
      if (userData) {
        setUser(userData);
      }

      // Extract tenants dynamically if provided
      const tenantList =
        data?.tenants ||
        data?.data?.tenants ||
        data?.user?.tenants ||
        [];
      if (Array.isArray(tenantList) && tenantList.length > 0) {
        setTenants(tenantList);
        setCurrentTenant(tenantList[0]);
      } else if (data?.company) {
        const compTenant = {
          id: data.company.id,
          name: data.company.name,
          code: (data.company.name || 'COMP').slice(0, 4).toUpperCase(),
          odoo_partner_id: data.company.odoo_partner_id,
        };
        setTenants([compTenant]);
        setCurrentTenant(compTenant);
      } else if (userData?.tenant) {
        setTenants([userData.tenant]);
        setCurrentTenant(userData.tenant);
      } else if (userData?.organization) {
        const orgTenant = {
          id: userData.organization.id || 'org_1',
          name: userData.organization.name || 'Organization',
          code: userData.organization.code || 'ORG',
        };
        setTenants([orgTenant]);
        setCurrentTenant(orgTenant);
      }

      setIsAuthenticated(true);
      return data;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    setTenants([]);
    setCurrentTenant(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authToken,
        tenants,
        currentTenant,
        switchTenant,
        isAuthenticated,
        setIsAuthenticated,
        isLoading,
        login,
        logout,
        setTenants,
        setCurrentTenant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
