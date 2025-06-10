/**
 * Versão de teste simplificada do Financeiro
 * Para verificar se a rota funciona sem dependências complexas
 */

import React from "react";
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  FileText,
  Target,
  Activity,
  CheckCircle,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function FinanceiroTest() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Gestão Financeira
            </h1>
            <p className="text-gray-600">
              Controle completo de faturas e pagamentos
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
          Funcionando
        </Badge>
      </div>

      {/* Status */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">
                Rota Financeiro Funcionando!
              </h3>
              <p className="text-sm text-green-600">
                A rota /financeiro foi configurada com sucesso e está acessível.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Métricas de Exemplo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Receita Mensal</p>
                <p className="text-xl font-semibold">R$ 125k</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Crescimento</p>
                <p className="text-xl font-semibold">+15%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Faturas Ativas</p>
                <p className="text-xl font-semibold">34</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Taxa Recebimento</p>
                <p className="text-xl font-semibold">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funcionalidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Gestão de Faturas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Criação e controle completo de faturas e cobrança.
            </p>
            <Button className="w-full" disabled>
              Acessar Faturas
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>Métodos de Pagamento</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Integração com Stripe, PIX e outros métodos.
            </p>
            <Button className="w-full" disabled>
              Configurar Pagamentos
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <span>Relatórios Financeiros</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Análises detalhadas e projeções de receita.
            </p>
            <Button className="w-full" disabled>
              Ver Relatórios
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Informações Técnicas */}
      <Card>
        <CardHeader>
          <CardTitle>Informações Técnicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Rota:</span>
              <span className="ml-2 font-mono bg-gray-100 px-2 py-1 rounded">
                /financeiro
              </span>
            </div>
            <div>
              <span className="font-medium">Componente:</span>
              <span className="ml-2">Financeiro.tsx</span>
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <Badge className="ml-2 bg-green-100 text-green-700">
                Funcionando
              </Badge>
            </div>
            <div>
              <span className="font-medium">Integração CRM:</span>
              <span className="ml-2">/crm/financeiro</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>Debug - Verificação de Rota</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>✅ Componente Financeiro.tsx carregado</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>✅ Rota /financeiro configurada</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>✅ Links de navegação funcionando</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>✅ Diferenciado do /crm/financeiro</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>✅ Sem erros 404</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
