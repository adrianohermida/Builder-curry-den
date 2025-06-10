/**
 * 🎧 ATENDIMENTO - PÁGINA BÁSICA
 */

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Mail, Clock } from "lucide-react";

export const Atendimento: React.FC = () => {
  return (
    <div className="p-6 space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Atendimento</h1>
          <p className="text-gray-600">
            Sistema de suporte e atendimento ao cliente
          </p>
        </div>
        <Button className="gap-2">
          <MessageCircle className="w-4 h-4" />
          Novo Ticket
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              Tickets Abertos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">23</div>
            <p className="text-sm text-gray-500">8 aguardando resposta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Tempo Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">2h 15m</div>
            <p className="text-sm text-gray-500">Tempo de primeira resposta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Badge className="w-5 h-5 text-green-600" />
              Satisfação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">94%</div>
            <p className="text-sm text-gray-500">Avaliação dos clientes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tickets Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                id: "#001",
                titulo: "Dúvida sobre processo",
                cliente: "João Silva",
                status: "aberto",
                prioridade: "alta",
                tempo: "2h",
              },
              {
                id: "#002",
                titulo: "Problema no login",
                cliente: "Maria Santos",
                status: "respondido",
                prioridade: "media",
                tempo: "4h",
              },
              {
                id: "#003",
                titulo: "Solicitação de documento",
                cliente: "Carlos Lima",
                status: "fechado",
                prioridade: "baixa",
                tempo: "1d",
              },
            ].map((ticket) => (
              <div
                key={ticket.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{ticket.id}</span>
                    <span className="text-gray-900">{ticket.titulo}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {ticket.cliente} • {ticket.tempo}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      ticket.status === "aberto" ? "destructive" : "secondary"
                    }
                  >
                    {ticket.status}
                  </Badge>
                  <Badge variant="outline">{ticket.prioridade}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Atendimento;
