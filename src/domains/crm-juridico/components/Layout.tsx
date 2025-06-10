/**
 * CRM Jurídico Layout Component
 *
 * Layout wrapper for the CRM domain
 */

import React from "react";
import { Outlet } from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
