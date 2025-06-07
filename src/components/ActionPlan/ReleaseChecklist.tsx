import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Alert, AlertDescription } from "../ui/alert";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  Play,
  Pause,
  Bot,
  User,
  Shield,
  Zap,
  FileText,
  Eye,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

import {
  ReleaseItem,
  ReleaseChecklistItem,
  ChecklistStatus,
  ChecklistCategory,
} from "../../types/releaseFramework";
import { releaseFrameworkService } from "../../services/releaseFrameworkService";

interface ReleaseChecklistProps {
  release: ReleaseItem;
  onUpdate?: (release: ReleaseItem) => void;
  readonly?: boolean;
}

export const ReleaseChecklist: React.FC<ReleaseChecklistProps> = ({
  release,
  onUpdate,
  readonly = false,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<
    Set<ChecklistCategory>
  >(new Set());
  const [isValidating, setIsValidating] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);

  const toggleCategory = (category: ChecklistCategory) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleStatusChange = async (
    itemId: string,
    newStatus: ChecklistStatus,
  ) => {
    try {
      const updatedRelease = await releaseFrameworkService.updateChecklistItem(
        release.id,
        itemId,
        { status: newStatus },
      );
      onUpdate?.(updatedRelease);
    } catch (error) {
      console.error("Erro ao atualizar item:", error);
    }
  };

  const handleNotesUpdate = async (itemId: string, notes: string) => {
    try {
      const updatedRelease = await releaseFrameworkService.updateChecklistItem(
        release.id,
        itemId,
        { notes },
      );
      onUpdate?.(updatedRelease);
      setEditingNotes(null);
    } catch (error) {
      console.error("Erro ao atualizar notas:", error);
    }
  };

  const handleAutoValidation = async (itemId: string) => {
    if (!release.checklist.find((item) => item.id === itemId)?.auto_validatable)
      return;

    setIsValidating(itemId);
    try {
      // Auto-validation é feita no service quando status é alterado para 'concluído'
      await handleStatusChange(itemId, "concluído");
    } finally {
      setIsValidating(null);
    }
  };

  const getStatusIcon = (status: ChecklistStatus) => {
    switch (status) {
      case "concluído":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case "em progresso":
        return <Clock className="h-4 w-4 text-blue-600" />;
      case "bloqueado":
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 border border-gray-300 rounded" />;
    }
  };

  const getStatusColor = (status: ChecklistStatus) => {
    switch (status) {
      case "concluído":
        return "text-green-600";
      case "em progresso":
        return "text-blue-600";
      case "bloqueado":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getCategoryIcon = (category: ChecklistCategory) => {
    const iconMap = {
      design_responsivo: "📱",
      mapeamento_eventos: "📊",
      permissões_papéis: "🔐",
      integração_ia: "🤖",
      testes_carga: "⚡",
      documentação: "📚",
      monetização: "💰",
      segurança_rollback: "🔒",
      acessibilidade: "♿",
      compliance: "⚖️",
    };
    return iconMap[category] || "📋";
  };

  const getCategoryName = (category: ChecklistCategory) => {
    const nameMap = {
      design_responsivo: "Design Responsivo",
      mapeamento_eventos: "Mapeamento de Eventos",
      permissões_papéis: "Permissões e Papéis",
      integração_ia: "Integração IA",
      testes_carga: "Testes de Carga",
      documentação: "Documentação",
      monetização: "Monetização",
      segurança_rollback: "Segurança e Rollback",
      acessibilidade: "Acessibilidade",
      compliance: "Compliance",
    };
    return nameMap[category] || category;
  };

  const groupedItems = release.checklist.reduce(
    (groups, item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
      return groups;
    },
    {} as Record<ChecklistCategory, ReleaseChecklistItem[]>,
  );

  const totalItems = release.checklist.length;
  const completedItems = release.checklist.filter(
    (item) => item.status === "concluído",
  ).length;
  const requiredItems = release.checklist.filter(
    (item) => item.required,
  ).length;
  const completedRequired = release.checklist.filter(
    (item) => item.required && item.status === "concluído",
  ).length;

  const overallProgress =
    totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  const requiredProgress =
    requiredItems > 0 ? (completedRequired / requiredItems) * 100 : 100;

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Progresso do Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso Geral</span>
                <span>
                  {completedItems}/{totalItems} ({overallProgress.toFixed(0)}%)
                </span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Itens Obrigatórios</span>
                <span>
                  {completedRequired}/{requiredItems} (
                  {requiredProgress.toFixed(0)}%)
                </span>
              </div>
              <Progress value={requiredProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {completedItems}
                </div>
                <div className="text-xs text-muted-foreground">Concluídos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {
                    release.checklist.filter(
                      (item) => item.status === "em progresso",
                    ).length
                  }
                </div>
                <div className="text-xs text-muted-foreground">
                  Em Progresso
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {
                    release.checklist.filter(
                      (item) => item.status === "pendente",
                    ).length
                  }
                </div>
                <div className="text-xs text-muted-foreground">Pendentes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {
                    release.checklist.filter(
                      (item) => item.status === "bloqueado",
                    ).length
                  }
                </div>
                <div className="text-xs text-muted-foreground">Bloqueados</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items by Category */}
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([category, items]) => {
          const categoryCompleted = items.filter(
            (item) => item.status === "concluído",
          ).length;
          const categoryProgress =
            items.length > 0 ? (categoryCompleted / items.length) * 100 : 0;
          const isExpanded = expandedCategories.has(
            category as ChecklistCategory,
          );

          return (
            <Card key={category}>
              <CardHeader
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => toggleCategory(category as ChecklistCategory)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {getCategoryIcon(category as ChecklistCategory)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">
                        {getCategoryName(category as ChecklistCategory)}
                      </CardTitle>
                      <CardDescription>
                        {categoryCompleted}/{items.length} itens concluídos (
                        {categoryProgress.toFixed(0)}%)
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress value={categoryProgress} className="w-20 h-2" />
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-4 space-y-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            {getStatusIcon(item.status)}
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium flex items-center gap-2">
                                  {item.title}
                                  {item.required && (
                                    <Badge
                                      variant="destructive"
                                      className="text-xs"
                                    >
                                      Obrigatório
                                    </Badge>
                                  )}
                                  {item.auto_validatable && (
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      <Bot className="h-3 w-3 mr-1" />
                                      Auto-validável
                                    </Badge>
                                  )}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {item.description}
                                </p>
                              </div>

                              {!readonly && (
                                <div className="flex items-center gap-2">
                                  <select
                                    value={item.status}
                                    onChange={(e) =>
                                      handleStatusChange(
                                        item.id,
                                        e.target.value as ChecklistStatus,
                                      )
                                    }
                                    className="px-2 py-1 border rounded text-sm"
                                  >
                                    <option value="pendente">Pendente</option>
                                    <option value="em progresso">
                                      Em Progresso
                                    </option>
                                    <option value="concluído">Concluído</option>
                                    <option value="bloqueado">Bloqueado</option>
                                  </select>

                                  {item.auto_validatable && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        handleAutoValidation(item.id)
                                      }
                                      disabled={isValidating === item.id}
                                    >
                                      {isValidating === item.id ? (
                                        <Clock className="h-3 w-3 animate-spin" />
                                      ) : (
                                        <Zap className="h-3 w-3" />
                                      )}
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Validation Result */}
                            {item.validation_result && (
                              <Alert
                                className={`${
                                  item.validation_result.success
                                    ? "border-green-200 bg-green-50"
                                    : "border-red-200 bg-red-50"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {item.validation_result.success ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                  )}
                                  <div className="flex-1">
                                    <AlertDescription className="text-sm">
                                      <strong>
                                        {item.validation_result.success
                                          ? "Validado"
                                          : "Falha na validação"}
                                        {item.validation_result.score &&
                                          ` (${item.validation_result.score}%)`}
                                      </strong>
                                      <div className="mt-1">
                                        {item.validation_result.details}
                                      </div>
                                      {item.validation_result.evidence && (
                                        <div className="mt-2 text-xs">
                                          <strong>Evidências:</strong>
                                          <ul className="list-disc pl-4 mt-1">
                                            {item.validation_result.evidence.map(
                                              (evidence, idx) => (
                                                <li key={idx}>{evidence}</li>
                                              ),
                                            )}
                                          </ul>
                                        </div>
                                      )}
                                    </AlertDescription>
                                  </div>
                                </div>
                              </Alert>
                            )}

                            {/* Notes Section */}
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">
                                  Observações:
                                </span>
                                {!readonly && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() =>
                                      setEditingNotes(
                                        editingNotes === item.id
                                          ? null
                                          : item.id,
                                      )
                                    }
                                  >
                                    <FileText className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>

                              {editingNotes === item.id ? (
                                <div className="space-y-2">
                                  <Textarea
                                    defaultValue={item.notes || ""}
                                    placeholder="Adicionar observações..."
                                    rows={3}
                                    onBlur={(e) =>
                                      handleNotesUpdate(item.id, e.target.value)
                                    }
                                  />
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground min-h-[20px]">
                                  {item.notes || "Nenhuma observação"}
                                </div>
                              )}
                            </div>

                            {/* Completion Info */}
                            {item.completed_at && (
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                Concluído em{" "}
                                {new Date(item.completed_at).toLocaleString()}
                                {item.responsible && ` por ${item.responsible}`}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* Summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold">{release.readiness_score}%</div>
            <div className="text-sm text-muted-foreground">
              Score de Prontidão
            </div>
            <Progress
              value={release.readiness_score}
              className="max-w-xs mx-auto"
            />

            {release.readiness_score >= 80 ? (
              <Badge variant="default" className="bg-green-100 text-green-800">
                ✅ Pronto para lançamento
              </Badge>
            ) : release.readiness_score >= 60 ? (
              <Badge
                variant="secondary"
                className="bg-yellow-100 text-yellow-800"
              >
                ⚠️ Necessita atenção
              </Badge>
            ) : (
              <Badge variant="destructive">❌ Não pronto</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
