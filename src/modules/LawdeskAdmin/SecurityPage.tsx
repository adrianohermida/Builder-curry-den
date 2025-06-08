import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Compliance Score
                </p>
                <p className="text-2xl font-bold text-green-600">100%</p>
              </div>
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <Badge className="mt-2 bg-green-100 text-green-800">LGPD OK</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tentativas Login
                </p>
                <p className="text-2xl font-bold text-red-600">12</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <Badge className="mt-2 bg-red-100 text-red-800">bloqueadas</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Sessões Ativas
                </p>
                <p className="text-2xl font-bold text-blue-600">847</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
            <Badge className="mt-2 bg-blue-100 text-blue-800">
              verificadas
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Logs Auditoria
                </p>
                <p className="text-2xl font-bold text-purple-600">2.4K</p>
              </div>
              <Lock className="w-8 h-8 text-purple-600" />
            </div>
            <Badge className="mt-2 bg-purple-100 text-purple-800">
              este mês
            </Badge>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Módulo de Segurança em Desenvolvimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Segurança e Conformidade
            </h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Auditoria completa de dados e acessos, logs de alterações
              sensíveis e validação automática de conformidade com LGPD.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
