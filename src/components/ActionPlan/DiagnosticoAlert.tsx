import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Play, TrendingUp, CheckCircle } from "lucide-react";

const DiagnosticoAlert: React.FC = () => {
  const navigate = useNavigate();

  const handleExecutarDiagnostico = () => {
    navigate("/diagnostico-conclusao");
  };

  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-emerald-800">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Activity className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <span>Diagnóstico de Conclusão Disponível</span>
            <Badge className="ml-2 bg-emerald-600 text-white">Novo</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-emerald-700">
          <p className="mb-3">
            O sistema de análise inteligente para o módulo{" "}
            <strong>"Casos e Processos"</strong> foi completamente implementado
            e está pronto para execução.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Sistema de Intelligence implementado</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Módulo Enhanced configurado</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Diagnóstico Final pronto</span>
            </div>
          </div>

          <div className="bg-white bg-opacity-60 rounded-lg p-3 mb-4">
            <h4 className="font-semibold text-emerald-800 mb-2">
              O que será analisado:
            </h4>
            <ul className="text-xs space-y-1 text-emerald-700">
              <li>• Performance e otimizações aplicadas</li>
              <li>• Status das integrações de APIs</li>
              <li>• Melhorias de UX/UI implementadas</li>
              <li>• Funcionalidades avançadas</li>
              <li>• Segurança e confiabilidade</li>
              <li>• Relatório executivo completo</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleExecutarDiagnostico}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Play className="w-4 h-4" />
            Executar Diagnóstico
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Ver Detalhes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DiagnosticoAlert;
