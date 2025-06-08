import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Headphones, MessageSquare, Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tickets Abertos
                </p>
                <p className="text-2xl font-bold text-orange-600">23</p>
              </div>
              <MessageSquare className="w-8 h-8 text-orange-600" />
            </div>
            <Badge className="mt-2 bg-orange-100 text-orange-800">
              -5 vs ontem
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Satisfação</p>
                <p className="text-2xl font-bold text-green-600">4.8/5</p>
              </div>
              <Star className="w-8 h-8 text-green-600" />
            </div>
            <Badge className="mt-2 bg-green-100 text-green-800">+0.2 mês</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tempo Médio</p>
                <p className="text-2xl font-bold text-blue-600">2.3h</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
            <Badge className="mt-2 bg-blue-100 text-blue-800">-15min mês</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Taxa Resolução
                </p>
                <p className="text-2xl font-bold text-purple-600">94%</p>
              </div>
              <Headphones className="w-8 h-8 text-purple-600" />
            </div>
            <Badge className="mt-2 bg-purple-100 text-purple-800">
              1º contato
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Módulo de Suporte B2B em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Headphones className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Suporte e Atendimento B2B
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Sistema completo de tickets dos clientes, integração com CRM e IA
              para respostas automáticas, histórico de atendimento e métricas de
              satisfação.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
