// OBSOLETE: Este arquivo foi substituído por CRM/CRMUnificado.tsx
// Redirecionamento automático para a nova implementação
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CRM() {
  const navigate = useNavigate();

  useEffect() {
    navigate("/crm-modern", { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando para CRM Unificado...</p>
      </div>
    </div>
  );
}