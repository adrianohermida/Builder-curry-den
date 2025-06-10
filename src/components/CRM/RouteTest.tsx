/**
 * Componente de teste para verificar se as rotas do CRM estão funcionando
 */

import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from "lucide-react";

export const RouteTest: React.FC = () => {
  const routes = [
    {
      path: "/crm",
      label: "CRM Principal",
      description: "Dashboard principal do CRM",
    },
    {
      path: "/crm/clientes",
      label: "Clientes",
      description: "Gestão de clientes",
    },
    {
      path: "/crm/processos",
      label: "Processos",
      description: "Acompanhamento processual",
    },
    {
      path: "/crm/contratos",
      label: "Contratos",
      description: "Gestão contratual",
    },
    {
      path: "/crm/tarefas",
      label: "Tarefas",
      description: "Tarefas por cliente",
    },
    {
      path: "/crm/financeiro",
      label: "Financeiro",
      description: "Gestão financeira",
    },
    { path: "/crm/ged", label: "Documentos", description: "Gestão documental" },
    {
      path: "/ai-enhanced",
      label: "IA Jurídico",
      description: "Assistente inteligente",
    },
    {
      path: "/ai-enhanced-test",
      label: "IA Jurídico (Teste)",
      description: "Versão simplificada para teste",
    },
    {
      path: "/ged-juridico",
      label: "GED (Redirect)",
      description: "Deve redirecionar para /crm/ged",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span>Teste de Rotas CRM Jurídico</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Teste todas as rotas do CRM para verificar se estão funcionando
            corretamente.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {routes.map((route) => (
              <Card key={route.path} className="border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{route.label}</h3>
                      <p className="text-sm text-gray-500">
                        {route.description}
                      </p>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                        {route.path}
                      </code>
                    </div>
                    <Link to={route.path}>
                      <Button variant="outline" size="sm">
                        Testar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800">Nota Importante</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  A rota <code>/ged-juridico</code> deve redirecionar
                  automaticamente para <code>/crm/ged</code>. Se você encontrar
                  um erro 404, verifique se o redirecionamento está funcionando
                  corretamente.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteTest;
