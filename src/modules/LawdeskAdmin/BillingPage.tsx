import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, TrendingUp, Users, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">MRR Total</p>
                <p className="text-2xl font-bold text-green-600">R$ 2.8M</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <Badge className="mt-2 bg-green-100 text-green-800">
              +12.3% mês
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Churn Rate</p>
                <p className="text-2xl font-bold text-red-600">2.4%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
            <Badge className="mt-2 bg-red-100 text-red-800">-0.8% mês</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Clientes Ativos
                </p>
                <p className="text-2xl font-bold text-blue-600">1,247</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <Badge className="mt-2 bg-blue-100 text-blue-800">+47 novos</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Stripe Volume
                </p>
                <p className="text-2xl font-bold text-purple-600">R$ 3.2M</p>
              </div>
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
            <Badge className="mt-2 bg-purple-100 text-purple-800">
              96.8% aprovação
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Módulo de Faturamento em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Faturamento e Gestão Financeira
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Relatórios de receitas, integração completa com Stripe Dashboard,
              gestão de planos ativos e monitoramento de uso por cliente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
