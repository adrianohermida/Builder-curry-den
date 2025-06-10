/**
 * 👥 CRM SECTION - USER SETTINGS
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface CRMSectionProps {
  onUnsavedChanges: (hasChanges: boolean) => void;
  userRole: string;
}

const CRMSection: React.FC<CRMSectionProps> = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          CRM Personalizado
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Configurações de CRM em desenvolvimento...
        </p>
      </CardContent>
    </Card>
  );
};

export default CRMSection;
