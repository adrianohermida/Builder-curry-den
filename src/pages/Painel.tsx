// OBSOLETE: Este arquivo foi substituído por CleanPainelControle.tsx
// Redirecionamento automático para a nova implementação
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Painel() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/painel", { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando...</p>
      </div>
    </div>
  );
}
