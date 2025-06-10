/**
 * ⚙️ MODULES SECTION - USER SETTINGS
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings } from "lucide-react";

interface ModulesSectionProps {
  onUnsavedChanges: (hasChanges: boolean) => void;
  userRole: string;
}

const ModulesSection: React.FC<ModulesSectionProps> = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Módulos do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Configurações de módulos em desenvolvimento...
        </p>
      </CardContent>
    </Card>
  );
};

export default ModulesSection;
