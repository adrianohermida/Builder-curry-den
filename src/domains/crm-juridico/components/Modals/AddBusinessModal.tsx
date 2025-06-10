/**
 * Add Business Modal Component
 *
 * Modal for creating new business/deal
 */

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCRMStore } from "../../store";
import type { Business, CreateBusinessRequest } from "../../types/business";

interface AddBusinessModalProps {
  open: boolean;
  onClose: () => void;
  initialStageId?: string;
  onBusinessCreated: (business: Business) => void;
}

export const AddBusinessModal: React.FC<AddBusinessModalProps> = ({
  open,
  onClose,
  initialStageId = "",
  onBusinessCreated,
}) => {
  const { stages, contacts, addBusiness } = useCRMStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateBusinessRequest>>({
    title: "",
    contactId: "",
    value: 0,
    stageId: initialStageId,
    assignedTo: "current_user", // TODO: get from auth context
    legalService: "litigation",
    caseType: "civil",
    complexity: "medium",
    tags: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create mock business object
      const newBusiness: Business = {
        id: `business_${Date.now()}`,
        title: formData.title!,
        contactId: formData.contactId!,
        contact: contacts.find((c) => c.id === formData.contactId),
        value: formData.value || 0,
        currency: "BRL",
        stageId: formData.stageId!,
        stage: stages.find((s) => s.id === formData.stageId),
        assignedTo: formData.assignedTo!,
        status: "open",
        probability:
          stages.find((s) => s.id === formData.stageId)?.probability || 10,
        source: "manual",
        tags: formData.tags || [],
        legalService: formData.legalService!,
        caseType: formData.caseType!,
        courtLevel: formData.courtLevel,
        complexity: formData.complexity!,
        retainerFee: formData.retainerFee,
        hourlyRate: formData.hourlyRate,
        estimatedHours: formData.estimatedHours,
        activities: [],
        documents: [],
        notes: [],
        customFields: formData.customFields || {},
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "current_user",
      };

      onBusinessCreated(newBusiness);
      onClose();

      // Reset form
      setFormData({
        title: "",
        contactId: "",
        value: 0,
        stageId: initialStageId,
        assignedTo: "current_user",
        legalService: "litigation",
        caseType: "civil",
        complexity: "medium",
        tags: [],
      });
    } catch (error) {
      console.error("Error creating business:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof CreateBusinessRequest,
    value: any,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Negócio</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Ex: Ação de cobrança..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="value">Valor (R$) *</Label>
              <Input
                id="value"
                type="number"
                value={formData.value || ""}
                onChange={(e) =>
                  handleInputChange("value", Number(e.target.value))
                }
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Contact and Stage */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactId">Cliente *</Label>
              <Select
                value={formData.contactId}
                onValueChange={(value) => handleInputChange("contactId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {contacts.map((contact) => (
                    <SelectItem key={contact.id} value={contact.id}>
                      {contact.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stageId">Etapa *</Label>
              <Select
                value={formData.stageId}
                onValueChange={(value) => handleInputChange("stageId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma etapa" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.id} value={stage.id}>
                      {stage.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Legal Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="legalService">Serviço Jurídico *</Label>
              <Select
                value={formData.legalService}
                onValueChange={(value) =>
                  handleInputChange("legalService", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="litigation">Contencioso</SelectItem>
                  <SelectItem value="contracts">Contratos</SelectItem>
                  <SelectItem value="consulting">Consultoria</SelectItem>
                  <SelectItem value="due_diligence">Due Diligence</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="labor">Trabalhista</SelectItem>
                  <SelectItem value="tax">Tributário</SelectItem>
                  <SelectItem value="family">Família</SelectItem>
                  <SelectItem value="criminal">Criminal</SelectItem>
                  <SelectItem value="corporate">Empresarial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="caseType">Tipo de Caso *</Label>
              <Select
                value={formData.caseType}
                onValueChange={(value) => handleInputChange("caseType", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="civil">Cível</SelectItem>
                  <SelectItem value="criminal">Criminal</SelectItem>
                  <SelectItem value="labor">Trabalhista</SelectItem>
                  <SelectItem value="tax">Tributário</SelectItem>
                  <SelectItem value="family">Família</SelectItem>
                  <SelectItem value="corporate">Empresarial</SelectItem>
                  <SelectItem value="administrative">Administrativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Financial Details */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="retainerFee">Honorários Iniciais</Label>
              <Input
                id="retainerFee"
                type="number"
                value={formData.retainerFee || ""}
                onChange={(e) =>
                  handleInputChange("retainerFee", Number(e.target.value))
                }
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hourlyRate">Valor/Hora</Label>
              <Input
                id="hourlyRate"
                type="number"
                value={formData.hourlyRate || ""}
                onChange={(e) =>
                  handleInputChange("hourlyRate", Number(e.target.value))
                }
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Horas Estimadas</Label>
              <Input
                id="estimatedHours"
                type="number"
                value={formData.estimatedHours || ""}
                onChange={(e) =>
                  handleInputChange("estimatedHours", Number(e.target.value))
                }
                placeholder="0"
                min="0"
                step="0.5"
              />
            </div>
          </div>

          {/* Complexity and Expected Close Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="complexity">Complexidade</Label>
              <Select
                value={formData.complexity}
                onValueChange={(value) =>
                  handleInputChange("complexity", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simples</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="complex">Complexa</SelectItem>
                  <SelectItem value="very_complex">Muito Complexa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expectedCloseDate">
                Data Prevista de Fechamento
              </Label>
              <Input
                id="expectedCloseDate"
                type="date"
                value={
                  formData.expectedCloseDate
                    ? new Date(formData.expectedCloseDate)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  handleInputChange(
                    "expectedCloseDate",
                    new Date(e.target.value),
                  )
                }
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar Negócio"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBusinessModal;
