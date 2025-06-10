/**
 * 🔌 INTEGRATIONS SECTION - USER SETTINGS
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

interface IntegrationsSectionProps {
  onUnsavedChanges: (hasChanges: boolean) => void;
  userRole: string;
}

const IntegrationsSection: React.FC<IntegrationsSectionProps> = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Integrações
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Configurações de integrações em desenvolvimento...
        </p>
      </CardContent>
    </Card>
  );
};

export default IntegrationsSection;
