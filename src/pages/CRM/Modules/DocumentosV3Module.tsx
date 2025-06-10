/**
 * 📁 MÓDULO DOCUMENTOS V3 - MINIMALISTA
 *
 * Gestão de documentos integrada ao CRM:
 * - Documentos vinculados por cliente/processo
 * - Classificação automática via IA
 * - Status de processamento visual
 * - Upload e organização inteligente
 */

import React from "react";
import { motion } from "framer-motion";
import { FolderOpen, Upload, FileText, Brain } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCRMV3 } from "@/hooks/useCRMV3";

const DocumentosV3Module: React.FC = () => {
  const { dashboardStats } = useCRMV3();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <FolderOpen className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {dashboardStats.documentos.total}
                </p>
                <p className="text-xs text-gray-600">Total de Documentos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {dashboardStats.documentos.processsados}
                </p>
                <p className="text-xs text-gray-600">Processados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Brain className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {dashboardStats.documentos.classificados}
                </p>
                <p className="text-xs text-gray-600">Classificados por IA</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Upload className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {dashboardStats.documentos.pendentes}
                </p>
                <p className="text-xs text-gray-600">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Área de upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Upload de Documentos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-900 mb-2">
              Faça upload dos seus documentos
            </h3>
            <p className="text-xs text-gray-600 mb-4">
              Arraste e solte os arquivos aqui ou clique para selecionar
            </p>
            <div className="flex gap-2 justify-center">
              <Button size="sm" className="h-8 px-3 text-xs">
                Selecionar Arquivos
              </Button>
              <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                Upload em Lote
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documentos recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Documentos Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Documento exemplo */}
            <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium text-sm text-gray-900">
                  Contrato de Prestação de Serviços - João Silva
                </h4>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-xs text-gray-600">PDF • 2.3 MB</p>
                  <p className="text-xs text-gray-600">Enviado hoje</p>
                  <Badge variant="secondary" className="text-xs">
                    Classificado por IA
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium text-sm text-gray-900">
                  Petição Inicial - Processo 001/2024
                </h4>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-xs text-gray-600">DOCX • 1.8 MB</p>
                  <p className="text-xs text-gray-600">2 dias atrás</p>
                  <Badge variant="default" className="text-xs">
                    Vinculado ao processo
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="p-2 bg-orange-100 rounded-lg">
                <FileText className="w-4 h-4 text-orange-600" />
              </div>
              <div className="flex-grow">
                <h4 className="font-medium text-sm text-gray-900">
                  Documentos Pessoais - Maria Santos
                </h4>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-xs text-gray-600">ZIP • 5.2 MB</p>
                  <p className="text-xs text-gray-600">1 semana atrás</p>
                  <Badge variant="outline" className="text-xs">
                    Aguardando classificação
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DocumentosV3Module;
