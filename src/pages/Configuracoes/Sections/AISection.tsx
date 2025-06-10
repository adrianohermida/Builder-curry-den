/**
 * 🧠 AI SECTION - USER SETTINGS
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

interface AISectionProps {
  onUnsavedChanges: (hasChanges: boolean) => void;
  userRole: string;
}

const AISection: React.FC<AISectionProps> = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5" />
          Configurações de IA Jurídica
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Configurações de IA em desenvolvimento...
        </p>
      </CardContent>
    </Card>
  );
};

export default AISection;
