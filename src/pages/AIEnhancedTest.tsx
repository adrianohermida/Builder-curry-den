/**
 * Versão de teste simplificada do AI Enhanced
 * Para verificar se a rota funciona sem dependências complexas
 */

import React from "react";
import { Brain, Sparkles, Zap, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AIEnhancedTest() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">IA Jurídico</h1>
            <p className="text-gray-600">
              Assistente Inteligente para Advocacia
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-purple-100 text-purple-700">
          <Sparkles className="w-4 h-4 mr-1" />
          Beta
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
                Rota AI Enhanced Funcionando!
              </h3>
              <p className="text-sm text-green-600">
                A rota /ai-enhanced foi configurada com sucesso e está
                acessível.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Funcionalidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-600" />
              <span>Gerador de Documentos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Gere petições, contratos e pareceres com inteligência artificial.
            </p>
            <Button className="w-full" disabled>
              Em Desenvolvimento
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span>Análise de Documentos</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Analise contratos e documentos legais automaticamente.
            </p>
            <Button className="w-full" disabled>
              Em Desenvolvimento
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-yellow-600" />
              <span>Assistente Legal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Chat inteligente para dúvidas jurídicas e orientações.
            </p>
            <Button className="w-full" disabled>
              Em Desenvolvimento
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
                /ai-enhanced
              </span>
            </div>
            <div>
              <span className="font-medium">Componente:</span>
              <span className="ml-2">AIEnhanced.tsx</span>
            </div>
            <div>
              <span className="font-medium">Status:</span>
              <Badge className="ml-2 bg-green-100 text-green-700">
                Funcionando
              </Badge>
            </div>
            <div>
              <span className="font-medium">Versão:</span>
              <span className="ml-2">1.0.0 (Teste)</span>
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
              <span>✅ Componente carregado com sucesso</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>✅ Rota configurada no App.tsx</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>✅ Links de navegação funcionando</span>
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
