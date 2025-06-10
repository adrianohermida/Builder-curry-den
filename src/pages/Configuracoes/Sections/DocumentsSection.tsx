/**
 * 📁 DOCUMENTS SECTION - USER SETTINGS
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FolderOpen } from "lucide-react";

interface DocumentsSectionProps {
  onUnsavedChanges: (hasChanges: boolean) => void;
  userRole: string;
}

const DocumentsSection: React.FC<DocumentsSectionProps> = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5" />
          Configurações de Documentos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Configurações de documentos em desenvolvimento...
        </p>
      </CardContent>
    </Card>
  );
};

export default DocumentsSection;
