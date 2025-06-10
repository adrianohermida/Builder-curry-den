import React from "react";

/**
 * Basic 404 component with no external dependencies
 * Used as a fallback when hooks or other dependencies fail
 */
const BasicNotFound: React.FC = () => {
  const handleGoHome = () => {
    try {
      window.location.href = "/painel";
    } catch (error) {
      window.location.href = "/";
    }
  };

  const handleGoBack = () => {
    try {
      window.history.back();
    } catch (error) {
      handleGoHome();
    }
  };

  const handleReload = () => {
    try {
      window.location.reload();
    } catch (error) {
      handleGoHome();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          textAlign: "center",
          maxWidth: "500px",
          padding: "2rem",
          backgroundColor: "white",
          borderRadius: "12px",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Error Icon */}
        <div
          style={{
            fontSize: "5rem",
            marginBottom: "1rem",
          }}
        >
          ⚠️
        </div>

        {/* 404 Title */}
        <h1
          style={{
            fontSize: "4rem",
            fontWeight: "bold",
            color: "#1e293b",
            margin: "0 0 1rem 0",
          }}
        >
          404
        </h1>

        {/* Description */}
        <h2
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "#374151",
            marginBottom: "0.5rem",
          }}
        >
          Página Não Encontrada
        </h2>

        <p
          style={{
            color: "#6b7280",
            marginBottom: "2rem",
            lineHeight: "1.6",
          }}
        >
          A página que você está procurando não existe ou foi movida. Tente uma
          das opções abaixo.
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handleGoHome}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#2563eb";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#3b82f6";
            }}
          >
            🏠 Ir para Início
          </button>

          <button
            onClick={handleGoBack}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#6b7280",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#4b5563";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#6b7280";
            }}
          >
            ⬅️ Voltar
          </button>

          <button
            onClick={handleReload}
            style={{
              padding: "0.75rem 1.5rem",
              backgroundColor: "#10b981",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#059669";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "#10b981";
            }}
          >
            🔄 Recarregar
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "#f8fafc",
            borderRadius: "8px",
            fontSize: "0.875rem",
            color: "#6b7280",
          }}
        >
          <p style={{ margin: 0 }}>
            © 2025 Lawdesk CRM • Se o problema persistir, entre em contato com
            o suporte
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicNotFound;
