/**
 * 📆 CALENDAR SECTION - USER SETTINGS
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface CalendarSectionProps {
  onUnsavedChanges: (hasChanges: boolean) => void;
  userRole: string;
}

const CalendarSection: React.FC<CalendarSectionProps> = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Configurações da Agenda
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Configurações da agenda em desenvolvimento...
        </p>
      </CardContent>
    </Card>
  );
};

export default CalendarSection;
