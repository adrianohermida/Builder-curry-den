/**
 * DOCUMENTOS GALLERY COMPONENT
 * Placeholder component for document management
 */

import React from "react";
import { FolderOpen, FileText, Upload, Search } from "lucide-react";
import Card from "@/components/ui/OptimizedCard";
import Button from "@/components/ui/OptimizedButton";

interface DocumentosGalleryProps {
  searchQuery: string;
  viewMode: "cards" | "table" | "kanban" | "timeline";
  onViewModeChange: (mode: "cards" | "table" | "kanban" | "timeline") => void;
}

const DocumentosGallery: React.FC<DocumentosGalleryProps> = ({
  searchQuery,
  viewMode,
  onViewModeChange,
}) => {
  const mockFolders = [
    { name: "Contratos", count: 48, color: "var(--primary-500)" },
    { name: "Petições", count: 127, color: "var(--color-info)" },
    { name: "Documentos Pessoais", count: 23, color: "var(--color-success)" },
    { name: "Pareceres", count: 67, color: "var(--color-warning)" },
  ];

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h2
            style={{
              margin: "0 0 0.5rem",
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "var(--text-primary)",
            }}
          >
            GED - Gestão de Documentos
          </h2>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>
            Biblioteca digital centralizada
          </p>
        </div>
        <Button variant="primary" icon={Upload}>
          Upload Documento
        </Button>
      </div>

      {/* Folders Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {mockFolders.map((folder, index) => (
          <Card
            key={index}
            padding="lg"
            hover
            interactive
            style={{ cursor: "pointer" }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "var(--radius-lg)",
                  backgroundColor: `${folder.color}20`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                }}
              >
                <FolderOpen size={32} style={{ color: folder.color }} />
              </div>
              <h3
                style={{
                  margin: "0 0 0.5rem",
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "var(--text-primary)",
                }}
              >
                {folder.name}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                }}
              >
                {folder.count} documentos
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Coming Soon */}
      <Card padding="lg">
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <FileText
            size={64}
            style={{ color: "var(--text-tertiary)", marginBottom: "1rem" }}
          />
          <h3 style={{ margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
            GED Completo em Desenvolvimento
          </h3>
          <p style={{ margin: "0 0 1rem", color: "var(--text-secondary)" }}>
            Sistema completo de gestão documental em breve
          </p>
          <div
            style={{ display: "flex", gap: "1rem", justifyContent: "center" }}
          >
            <Button variant="secondary" icon={Search}>
              Busca Avançada
            </Button>
            <Button variant="primary" icon={Upload}>
              Upload em Lote
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default React.memo(DocumentosGallery);
