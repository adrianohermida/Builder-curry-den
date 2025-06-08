import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Mail, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MarketingPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Campanhas Ativas
                </p>
                <p className="text-2xl font-bold text-blue-600">8</p>
              </div>
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <Badge className="mt-2 bg-blue-100 text-blue-800">3 novas</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Rate</p>
                <p className="text-2xl font-bold text-green-600">31.2%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <Badge className="mt-2 bg-green-100 text-green-800">
              +2.1% mês
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Leads Gerados
                </p>
                <p className="text-2xl font-bold text-purple-600">342</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <Badge className="mt-2 bg-purple-100 text-purple-800">
              este mês
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">CTR Médio</p>
                <p className="text-2xl font-bold text-orange-600">4.7%</p>
              </div>
              <MessageSquare className="w-8 h-8 text-orange-600" />
            </div>
            <Badge className="mt-2 bg-orange-100 text-orange-800">
              +0.5% mês
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Módulo de Marketing em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Comunicação e Marketing
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Editor de campanhas e mensagens internas, integração com
              plataforma de e-mail marketing e métricas completas de engajamento
              por campanha.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
