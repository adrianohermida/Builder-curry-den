/**
 * 📁 MODERN DOCUMENTOS MODULE - LAWDESK REFACTORED
 *
 * GED inteligente integrado ao CRM:
 * - Upload com OCR automático
 * - Classificação por IA
 * - Vinculação inteligente com clientes/processos
 * - Busca semântica avançada
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FolderOpen,
  Upload,
  FileText,
  Image,
  File,
  Brain,
  Search,
  Filter,
  Grid3X3,
  List,
  Plus,
  Eye,
  Download,
  Share,
  Tag,
  Calendar,
  User,
  Building,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Document {
  id: string;
  nome: string;
  tipo: "pdf" | "docx" | "jpg" | "png" | "txt";
  tamanho: number;
  dataUpload: Date;
  classificadoPorIA: boolean;
  confiancaIA?: number;
  vinculacoes: {
    cliente?: string;
    processo?: string;
    contrato?: string;
  };
  tags: string[];
  status: "processando" | "classificado" | "pendente" | "erro";
  uploadedBy: string;
  ocrText?: string;
}

type ViewMode = "grid" | "list";

const ModernDocumentosModule: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const mockDocuments: Document[] = [
    {
      id: "1",
      nome: "Contrato_Servicos_JoaoSilva.pdf",
      tipo: "pdf",
      tamanho: 2345600, // 2.3 MB
      dataUpload: new Date(Date.now() - 86400000),
      classificadoPorIA: true,
      confiancaIA: 95,
      vinculacoes: {
        cliente: "João Silva Advocacia",
        contrato: "CT001/2024",
      },
      tags: ["Contrato", "Prestação de Serviços", "Corporate"],
      status: "classificado",
      uploadedBy: "Ana Santos",
      ocrText: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS ADVOCATÍCIOS...",
    },
    {
      id: "2",
      nome: "Peticao_Inicial_001_2024.docx",
      tipo: "docx",
      tamanho: 1876400, // 1.8 MB
      dataUpload: new Date(Date.now() - 172800000),
      classificadoPorIA: true,
      confiancaIA: 88,
      vinculacoes: {
        cliente: "João Silva Advocacia",
        processo: "001/2024",
      },
      tags: ["Petição", "Trabalhista", "Inicial"],
      status: "classificado",
      uploadedBy: "Dr. Carlos",
    },
    {
      id: "3",
      nome: "Documentos_Pessoais_Cliente.zip",
      tipo: "jpg",
      tamanho: 5242880, // 5.2 MB
      dataUpload: new Date(Date.now() - 604800000),
      classificadoPorIA: false,
      vinculacoes: {
        cliente: "Maria Santos",
      },
      tags: ["Documentos Pessoais"],
      status: "pendente",
      uploadedBy: "Bruno Reis",
    },
  ];

  const getFileIcon = (tipo: string) => {
    switch (tipo) {
      case "pdf":
        return <FileText className="w-6 h-6 text-red-600" />;
      case "docx":
        return <FileText className="w-6 h-6 text-blue-600" />;
      case "jpg":
      case "png":
        return <Image className="w-6 h-6 text-green-600" />;
      default:
        return <File className="w-6 h-6 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "classificado":
        return "bg-green-100 text-green-800";
      case "processando":
        return "bg-blue-100 text-blue-800";
      case "pendente":
        return "bg-yellow-100 text-yellow-800";
      case "erro":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesSearch =
      doc.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      (doc.ocrText &&
        doc.ocrText.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === "all" || doc.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const renderDocumentCard = (document: Document) => (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">{getFileIcon(document.tipo)}</div>
          <div className="flex-grow min-w-0 space-y-2">
            <h4 className="font-medium text-gray-900 truncate">
              {document.nome}
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{formatFileSize(document.tamanho)}</span>
              <span>•</span>
              <span>{document.dataUpload.toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Status and AI Confidence */}
        <div className="flex items-center justify-between">
          <Badge className={getStatusColor(document.status)}>
            {document.status}
          </Badge>
          {document.classificadoPorIA && document.confiancaIA && (
            <div className="flex items-center gap-1 text-xs text-blue-600">
              <Brain className="w-3 h-3" />
              {document.confiancaIA}%
            </div>
          )}
        </div>

        {/* Vinculações */}
        {(document.vinculacoes.cliente ||
          document.vinculacoes.processo ||
          document.vinculacoes.contrato) && (
          <div className="space-y-1">
            {document.vinculacoes.cliente && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <User className="w-3 h-3" />
                {document.vinculacoes.cliente}
              </div>
            )}
            {document.vinculacoes.processo && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <FileText className="w-3 h-3" />#{document.vinculacoes.processo}
              </div>
            )}
            {document.vinculacoes.contrato && (
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <Building className="w-3 h-3" />
                {document.vinculacoes.contrato}
              </div>
            )}
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {document.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {document.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{document.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Uploaded by */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Avatar className="w-4 h-4">
              <AvatarFallback className="text-xs bg-gray-100">
                {document.uploadedBy.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {document.uploadedBy}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Eye className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Download className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Share className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderDocumentList = (document: Document) => (
    <Card className="hover:shadow-sm transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">{getFileIcon(document.tipo)}</div>

          <div className="flex-grow grid grid-cols-4 gap-4 items-center">
            <div className="space-y-1">
              <h4 className="font-medium text-gray-900 truncate">
                {document.nome}
              </h4>
              <p className="text-xs text-gray-500">
                {formatFileSize(document.tamanho)}
              </p>
            </div>

            <div className="space-y-1">
              <Badge className={getStatusColor(document.status)}>
                {document.status}
              </Badge>
              {document.classificadoPorIA && (
                <div className="flex items-center gap-1 text-xs text-blue-600">
                  <Brain className="w-3 h-3" />
                  IA: {document.confiancaIA}%
                </div>
              )}
            </div>

            <div className="space-y-1 text-xs text-gray-600">
              {document.vinculacoes.cliente && (
                <div>{document.vinculacoes.cliente}</div>
              )}
              {document.vinculacoes.processo && (
                <div>#{document.vinculacoes.processo}</div>
              )}
            </div>

            <div className="text-right space-y-1">
              <p className="text-xs text-gray-500">
                {document.dataUpload.toLocaleDateString()}
              </p>
              <p className="text-xs text-gray-500">{document.uploadedBy}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Gestão de Documentos
          </h2>
          <Badge variant="secondary">
            {filteredDocuments.length} documentos
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar documentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 h-8"
            />
          </div>

          <div className="flex items-center border border-gray-200 rounded-lg p-0.5">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="h-7 px-2"
            >
              <Grid3X3 className="w-3 h-3" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="h-7 px-2"
            >
              <List className="w-3 h-3" />
            </Button>
          </div>

          <Button size="sm">
            <Upload className="w-4 h-4 mr-1" />
            Upload
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <FolderOpen className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">1,247</p>
                <p className="text-sm text-gray-600">Total</p>
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
                <p className="text-lg font-semibold text-gray-900">1,150</p>
                <p className="text-sm text-gray-600">Classificados</p>
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
                <p className="text-lg font-semibold text-gray-900">1,198</p>
                <p className="text-sm text-gray-600">Processados</p>
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
                <p className="text-lg font-semibold text-gray-900">49</p>
                <p className="text-sm text-gray-600">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
        <CardContent className="p-8 text-center">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Faça upload dos seus documentos
          </h3>
          <p className="text-gray-600 mb-4">
            Arraste e solte os arquivos aqui ou clique para selecionar
          </p>
          <div className="flex gap-2 justify-center">
            <Button>
              <Plus className="w-4 h-4 mr-1" />
              Selecionar Arquivos
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-1" />
              Upload em Lote
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents Grid/List */}
      <div>
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDocuments.map((document, index) => (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {renderDocumentCard(document)}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocuments.map((document, index) => (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {renderDocumentList(document)}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhum documento encontrado
          </h3>
          <p className="text-gray-600">
            Tente ajustar os filtros de busca ou faça upload de novos
            documentos.
          </p>
        </div>
      )}
    </div>
  );
};

export default ModernDocumentosModule;
