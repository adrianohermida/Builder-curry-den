import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Página de redirecionamento para a nova estrutura
export default function ConfiguracaoArmazenamento() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirecionar para a nova rota
    navigate("/configuracao-armazenamento", { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecionando para nova página...</p>
      </div>
    </div>
  );
}
