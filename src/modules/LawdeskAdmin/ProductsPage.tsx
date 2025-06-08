import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, DollarSign, Users, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Planos Ativos
                </p>
                <p className="text-2xl font-bold text-blue-600">8</p>
              </div>
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <Badge className="mt-2 bg-blue-100 text-blue-800">3 tiers</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ARR Total</p>
                <p className="text-2xl font-bold text-green-600">R$ 33.6M</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <Badge className="mt-2 bg-green-100 text-green-800">
              +127% ano
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Usuários Pagos
                </p>
                <p className="text-2xl font-bold text-purple-600">1,247</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <Badge className="mt-2 bg-purple-100 text-purple-800">
              94% do total
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Upgrade Rate
                </p>
                <p className="text-2xl font-bold text-orange-600">23%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600" />
            </div>
            <Badge className="mt-2 bg-orange-100 text-orange-800">mensal</Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Módulo de Produtos em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Gestão de Produtos e Monetização
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Criação e manutenção de planos SaaS, detalhamento de features por
              plano e conexão com Agente de Monetização Inteligente.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
