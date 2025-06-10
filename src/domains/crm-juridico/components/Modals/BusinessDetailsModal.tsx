/**
 * Business Details Modal Component
 *
 * Modal for viewing and editing business details
 */

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Business } from "../../types/business";

interface BusinessDetailsModalProps {
  open: boolean;
  onClose: () => void;
  business: Business | null;
}

export const BusinessDetailsModal: React.FC<BusinessDetailsModalProps> = ({
  open,
  onClose,
  business,
}) => {
  const [activeTab, setActiveTab] = useState("overview");

  if (!business) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: business.currency || "BRL",
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "text-blue-600 bg-blue-100";
      case "won":
        return "text-green-600 bg-green-100";
      case "lost":
        return "text-red-600 bg-red-100";
      case "postponed":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">{business.title}</DialogTitle>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(business.status)}>
                {business.status}
              </Badge>
              <Badge variant="outline">{business.probability}%</Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="contact">Cliente</TabsTrigger>
            <TabsTrigger value="activities">Atividades</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="notes">Anotações</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Business Summary */}
            <div className="grid grid-cols-2 gap-6">
              {/* Financial Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Informações Financeiras
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor do Negócio:</span>
                    <span className="font-semibold">
                      {formatCurrency(business.value)}
                    </span>
                  </div>
                  {business.retainerFee && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Honorários Iniciais:
                      </span>
                      <span className="font-semibold">
                        {formatCurrency(business.retainerFee)}
                      </span>
                    </div>
                  )}
                  {business.hourlyRate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Valor/Hora:</span>
                      <span className="font-semibold">
                        {formatCurrency(business.hourlyRate)}
                      </span>
                    </div>
                  )}
                  {business.estimatedHours && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Horas Estimadas:</span>
                      <span className="font-semibold">
                        {business.estimatedHours}h
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Legal Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Detalhes Jurídicos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Serviço:</span>
                    <Badge variant="secondary">{business.legalService}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo de Caso:</span>
                    <Badge variant="outline">{business.caseType}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Complexidade:</span>
                    <Badge variant="outline">{business.complexity}</Badge>
                  </div>
                  {business.courtLevel && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Instância:</span>
                      <Badge variant="outline">{business.courtLevel}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Criado em:</span>
                    <div className="font-medium">
                      {new Date(business.createdAt).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Última atualização:</span>
                    <div className="font-medium">
                      {new Date(business.updatedAt).toLocaleDateString("pt-BR")}
                    </div>
                  </div>
                  {business.expectedCloseDate && (
                    <div>
                      <span className="text-gray-600">
                        Fechamento previsto:
                      </span>
                      <div className="font-medium">
                        {new Date(
                          business.expectedCloseDate,
                        ).toLocaleDateString("pt-BR")}
                      </div>
                    </div>
                  )}
                  {business.lastActivityAt && (
                    <div>
                      <span className="text-gray-600">Última atividade:</span>
                      <div className="font-medium">
                        {new Date(business.lastActivityAt).toLocaleDateString(
                          "pt-BR",
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            {business.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {business.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            {business.contact && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Informações do Cliente
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {business.contact.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{business.contact.name}</h3>
                      <p className="text-gray-600">{business.contact.email}</p>
                      <p className="text-gray-600">{business.contact.phone}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Documento:</span>
                      <div className="font-medium">
                        {business.contact.document}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-600">Tipo:</span>
                      <div className="font-medium">
                        {business.contact.type === "person"
                          ? "Pessoa Física"
                          : "Pessoa Jurídica"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activities" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Atividades Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                {business.activities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma atividade registrada
                  </div>
                ) : (
                  <div className="space-y-4">
                    {business.activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="border-l-2 border-blue-200 pl-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{activity.title}</h4>
                          <span className="text-sm text-gray-500">
                            {new Date(activity.createdAt).toLocaleDateString(
                              "pt-BR",
                            )}
                          </span>
                        </div>
                        {activity.description && (
                          <p className="text-gray-600 text-sm mt-1">
                            {activity.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documentos</CardTitle>
              </CardHeader>
              <CardContent>
                {business.documents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum documento anexado
                  </div>
                ) : (
                  <div className="space-y-4">
                    {business.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div>
                          <h4 className="font-medium">{doc.name}</h4>
                          <p className="text-sm text-gray-600">
                            {doc.type} • {(doc.size / 1024 / 1024).toFixed(2)}{" "}
                            MB
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          Baixar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Anotações</CardTitle>
              </CardHeader>
              <CardContent>
                {business.notes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhuma anotação registrada
                  </div>
                ) : (
                  <div className="space-y-4">
                    {business.notes.map((note) => (
                      <div key={note.id} className="p-3 border rounded">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{note.user?.name}</span>
                          <span className="text-sm text-gray-500">
                            {new Date(note.createdAt).toLocaleDateString(
                              "pt-BR",
                            )}
                          </span>
                        </div>
                        <p className="text-gray-700">{note.content}</p>
                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {note.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button>Editar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BusinessDetailsModal;
