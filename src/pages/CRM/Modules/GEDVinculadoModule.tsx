/**
 * 📁 MÓDULO GED VINCULADO - CRM Unicorn
 *
 * Gestão documental inteligente integrada ao CRM
 * - Classificação automática de documentos com OCR e IA
 * - Vinculação automática com clientes, processos e contratos
 * - Busca semântica avançada
 * - Workflow de aprovação e versionamento
 */

import React, { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FolderOpen,
  Plus,
  Search,
  Filter,
  MoreVertical,
  FileText,
  Image,
  Download,
  Eye,
  Edit,
  Trash2,
  Upload,
  Link,
  Users,
  Scale,
  Calendar,
  Tag,
  Brain,
  Zap,
  CheckCircle,
  Clock,
  AlertTriangle,
  Star,
  Share,
  Archive,
  Lock,
  Unlock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Hooks
import { useGEDUnicorn } from "@/hooks/useGEDUnicorn";
import { useOCRProcessing } from "@/hooks/useOCRProcessing";
import { useAIDocumentClassification } from "@/hooks/useAIDocumentClassification";

// Tipos
interface Documento {
  id: string;
  nome: string;
  tipo: "pdf" | "docx" | "xlsx" | "jpg" | "png" | "outros";
  tamanho: number;
  dataUpload: Date;
  dataModificacao: Date;
  uploadedBy: string;
  // Vinculações
  clienteId?: string;
  clienteNome?: string;
  processoId?: string;
  processoNumero?: string;
  contratoId?: string;
  contratoNumero?: string;
  // Classificação
  categoria: string;
  subcategoria?: string;
  tags: string[];
  confidencial: boolean;
  // IA e OCR
  classificadoPorIA: boolean;
  confiancaIA?: number;
  textoExtraido?: string;
  metadados: Record<string, any>;
  // Status
  status: "processando" | "aprovado" | "rejeitado" | "pendente_revisao";
  versao: number;
  versionamento: Array<{
    versao: number;
    data: Date;
    usuario: string;
    alteracoes: string;
  }>;
  // Acesso
  compartilhadoCom: string[];
  permissoes: "leitura" | "escrita" | "admin";
  url?: string;
  thumbnail?: string;
}

interface PastaGED {
  id: string;
  nome: string;
  clienteId?: string;
  processoId?: string;
  contratoId?: string;
  totalDocumentos: number;
  ultimaAtualizacao: Date;
  cor: string;
  icone: string;
  privada: boolean;
}

interface GEDVinculadoModuleProps {
  searchQuery?: string;
  onNotification?: (message: string) => void;
  className?: string;
}

// Dados mock
const MOCK_PASTAS: PastaGED[] = [
  {
    id: "pasta-001",
    nome: "Maria Silva Advocacia",
    clienteId: "cli-001",
    totalDocumentos: 24,
    ultimaAtualizacao: new Date("2025-01-22"),
    cor: "blue",
    icone: "Users",
    privada: false,
  },
  {
    id: "pasta-002",
    nome: "Processo Tributário - 1234567",
    clienteId: "cli-001",
    processoId: "proc-001",
    totalDocumentos: 18,
    ultimaAtualizacao: new Date("2025-01-20"),
    cor: "purple",
    icone: "Scale",
    privada: true,
  },
  {
    id: "pasta-003",
    nome: "Contrato Prestação Serviços",
    clienteId: "cli-001",
    contratoId: "cont-001",
    totalDocumentos: 8,
    ultimaAtualizacao: new Date("2025-01-18"),
    cor: "green",
    icone: "FileText",
    privada: false,
  },
];

const MOCK_DOCUMENTOS: Documento[] = [
  {
    id: "doc-001",
    nome: "Petição Inicial - Repetição ICMS.pdf",
    tipo: "pdf",
    tamanho: 2048576, // 2MB
    dataUpload: new Date("2025-01-20"),
    dataModificacao: new Date("2025-01-20"),
    uploadedBy: "Dr. João Santos",
    clienteId: "cli-001",
    clienteNome: "Maria Silva Advocacia",
    processoId: "proc-001",
    processoNumero: "1234567-89.2024.8.26.0100",
    categoria: "Petição",
    subcategoria: "Inicial",
    tags: ["ICMS", "Repetição", "Tributário"],
    confidencial: true,
    classificadoPorIA: true,
    confiancaIA: 95,
    textoExtraido: "EXCELENTÍSSIMO SENHOR DOUTOR JUIZ...",
    metadados: {
      tribunal: "TJSP",
      vara: "4ª Vara Cível",
      valor: 2500000,
    },
    status: "aprovado",
    versao: 2,
    versionamento: [
      {
        versao: 1,
        data: new Date("2025-01-19"),
        usuario: "Dr. João Santos",
        alteracoes: "Versão inicial",
      },
      {
        versao: 2,
        data: new Date("2025-01-20"),
        usuario: "Dr. João Santos",
        alteracoes: "Correção de valores e dados",
      },
    ],
    compartilhadoCom: ["cli-001"],
    permissoes: "admin",
    thumbnail: "/thumbnails/doc-001.jpg",
  },
  {
    id: "doc-002",
    nome: "Contrato Prestação Serviços v2.docx",
    tipo: "docx",
    tamanho: 512000, // 512KB
    dataUpload: new Date("2025-01-22"),
    dataModificacao: new Date("2025-01-22"),
    uploadedBy: "Dra. Ana Costa",
    clienteId: "cli-002",
    clienteNome: "Carlos Mendes",
    contratoId: "cont-002",
    contratoNumero: "CTR-2024-002",
    categoria: "Contrato",
    subcategoria: "Prestação de Serviços",
    tags: ["Trabalhista", "Consultoria"],
    confidencial: false,
    classificadoPorIA: true,
    confiancaIA: 88,
    textoExtraido: "CONTRATO DE PRESTAÇÃO DE SERVIÇOS...",
    metadados: {
      valor: 24000,
      vigencia: "6 meses",
      renovacao: false,
    },
    status: "pendente_revisao",
    versao: 1,
    versionamento: [
      {
        versao: 1,
        data: new Date("2025-01-22"),
        usuario: "Dra. Ana Costa",
        alteracoes: "Versão inicial do contrato",
      },
    ],
    compartilhadoCom: ["cli-002"],
    permissoes: "escrita",
  },
  {
    id: "doc-003",
    nome: "Comprovante Pagamento Janeiro.jpg",
    tipo: "jpg",
    tamanho: 1024000, // 1MB
    dataUpload: new Date("2025-01-15"),
    dataModificacao: new Date("2025-01-15"),
    uploadedBy: "Sistema Automatizado",
    clienteId: "cli-001",
    clienteNome: "Maria Silva Advocacia",
    categoria: "Comprovante",
    subcategoria: "Pagamento",
    tags: ["Pagamento", "Janeiro", "Automatico"],
    confidencial: false,
    classificadoPorIA: true,
    confiancaIA: 92,
    textoExtraido: "COMPROVANTE DE TRANSFERÊNCIA...",
    metadados: {
      valor: 45000,
      banco: "Banco do Brasil",
      data_pagamento: "2025-01-15",
    },
    status: "aprovado",
    versao: 1,
    versionamento: [
      {
        versao: 1,
        data: new Date("2025-01-15"),
        usuario: "Sistema Automatizado",
        alteracoes: "Upload automático via integração bancária",
      },
    ],
    compartilhadoCom: [],
    permissoes: "leitura",
    thumbnail: "/thumbnails/doc-003.jpg",
  },
];

export function GEDVinculadoModule({
  searchQuery = "",
  onNotification,
  className,
}: GEDVinculadoModuleProps) {
  // Estados
  const [viewMode, setViewMode] = useState<"pastas" | "documentos">("pastas");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  const [selectedStatus, setSelectedStatus] = useState<string>("todos");
  const [showConfidential, setShowConfidential] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);

  // Hooks
  const {
    documentos,
    pastas,
    loading,
    uploadDocument,
    deleteDocument,
    shareDocument,
  } = useGEDUnicorn();

  const {
    processDocument,
    extractText,
    loading: ocrLoading,
  } = useOCRProcessing();

  const {
    classifyDocument,
    suggestTags,
    findSimilarDocuments,
    loading: aiLoading,
  } = useAIDocumentClassification();

  // Dados filtrados
  const filteredData = useMemo(() => {
    if (viewMode === "pastas") {
      let filtered = MOCK_PASTAS;

      if (searchQuery) {
        filtered = filtered.filter((pasta) =>
          pasta.nome.toLowerCase().includes(searchQuery.toLowerCase()),
        );
      }

      return filtered.sort(
        (a, b) => b.ultimaAtualizacao.getTime() - a.ultimaAtualizacao.getTime(),
      );
    } else {
      let filtered = MOCK_DOCUMENTOS;

      if (searchQuery) {
        filtered = filtered.filter(
          (doc) =>
            doc.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.textoExtraido
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            doc.tags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        );
      }

      if (selectedCategory !== "todas") {
        filtered = filtered.filter((doc) => doc.categoria === selectedCategory);
      }

      if (selectedStatus !== "todos") {
        filtered = filtered.filter((doc) => doc.status === selectedStatus);
      }

      if (!showConfidential) {
        filtered = filtered.filter((doc) => !doc.confidencial);
      }

      if (selectedFolder) {
        // Filtrar por pasta selecionada
        const pasta = MOCK_PASTAS.find((p) => p.id === selectedFolder);
        if (pasta) {
          if (pasta.clienteId) {
            filtered = filtered.filter(
              (doc) => doc.clienteId === pasta.clienteId,
            );
          }
          if (pasta.processoId) {
            filtered = filtered.filter(
              (doc) => doc.processoId === pasta.processoId,
            );
          }
          if (pasta.contratoId) {
            filtered = filtered.filter(
              (doc) => doc.contratoId === pasta.contratoId,
            );
          }
        }
      }

      return filtered.sort(
        (a, b) => b.dataUpload.getTime() - a.dataUpload.getTime(),
      );
    }
  }, [
    viewMode,
    searchQuery,
    selectedCategory,
    selectedStatus,
    showConfidential,
    selectedFolder,
  ]);

  // Estatísticas
  const stats = useMemo(() => {
    const totalDocumentos = MOCK_DOCUMENTOS.length;
    const totalPastas = MOCK_PASTAS.length;
    const pendentesRevisao = MOCK_DOCUMENTOS.filter(
      (d) => d.status === "pendente_revisao",
    ).length;
    const classificadosIA = MOCK_DOCUMENTOS.filter(
      (d) => d.classificadoPorIA,
    ).length;
    const confidenciais = MOCK_DOCUMENTOS.filter((d) => d.confidencial).length;
    const tamanhoTotal = MOCK_DOCUMENTOS.reduce((acc, d) => acc + d.tamanho, 0);

    return {
      totalDocumentos,
      totalPastas,
      pendentesRevisao,
      classificadosIA,
      confidenciais,
      tamanhoTotal,
    };
  }, []);

  // Handlers
  const handleUploadDocument = useCallback(
    async (files: FileList) => {
      setAiProcessing(true);
      try {
        for (const file of Array.from(files)) {
          await uploadDocument(file);
          // Processar com IA
          await processDocument(file);
        }
        onNotification?.(`${files.length} documento(s) enviado(s) com sucesso`);
      } catch (error) {
        toast.error("Erro ao enviar documentos");
      } finally {
        setAiProcessing(false);
      }
    },
    [uploadDocument, processDocument, onNotification],
  );

  const handleClassifyWithAI = useCallback(
    async (documentId: string) => {
      try {
        await classifyDocument(documentId);
        onNotification?.("Documento classificado pela IA");
      } catch (error) {
        toast.error("Erro na classificação automática");
      }
    },
    [classifyDocument, onNotification],
  );

  // Renderizador de pasta
  const renderFolderCard = (pasta: PastaGED) => {
    const IconComponent =
      pasta.icone === "Users"
        ? Users
        : pasta.icone === "Scale"
          ? Scale
          : FileText;

    return (
      <motion.div
        key={pasta.id}
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className={cn(
            "relative overflow-hidden cursor-pointer transition-all",
            "hover:shadow-lg border-l-4",
            pasta.cor === "blue" && "border-l-blue-500 bg-blue-50",
            pasta.cor === "purple" && "border-l-purple-500 bg-purple-50",
            pasta.cor === "green" && "border-l-green-500 bg-green-50",
          )}
          onClick={() => {
            setSelectedFolder(pasta.id);
            setViewMode("documentos");
          }}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={cn(
                    "p-3 rounded-lg",
                    pasta.cor === "blue" && "bg-blue-100 text-blue-600",
                    pasta.cor === "purple" && "bg-purple-100 text-purple-600",
                    pasta.cor === "green" && "bg-green-100 text-green-600",
                  )}
                >
                  <IconComponent className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1">{pasta.nome}</h3>
                  <p className="text-xs text-muted-foreground">
                    {pasta.totalDocumentos} documentos
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {pasta.privada && <Lock className="h-4 w-4 text-orange-500" />}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Abrir Pasta
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Documento
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share className="h-4 w-4 mr-2" />
                      Compartilhar
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Renomear
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                Atualizada em{" "}
                {pasta.ultimaAtualizacao.toLocaleDateString("pt-BR")}
              </div>

              {/* Vinculações */}
              <div className="flex flex-wrap gap-1">
                {pasta.clienteId && (
                  <Badge variant="outline" className="text-xs">
                    <Users className="h-3 w-3 mr-1" />
                    Cliente
                  </Badge>
                )}
                {pasta.processoId && (
                  <Badge variant="outline" className="text-xs">
                    <Scale className="h-3 w-3 mr-1" />
                    Processo
                  </Badge>
                )}
                {pasta.contratoId && (
                  <Badge variant="outline" className="text-xs">
                    <FileText className="h-3 w-3 mr-1" />
                    Contrato
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {pasta.totalDocumentos} arquivos
                </span>
                {pasta.privada && (
                  <Badge variant="secondary" className="text-xs">
                    Privada
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  // Renderizador de documento
  const renderDocumentCard = (documento: Documento) => {
    const getFileIcon = () => {
      switch (documento.tipo) {
        case "pdf":
          return <FileText className="h-6 w-6 text-red-500" />;
        case "docx":
          return <FileText className="h-6 w-6 text-blue-500" />;
        case "xlsx":
          return <FileText className="h-6 w-6 text-green-500" />;
        case "jpg":
        case "png":
          return <Image className="h-6 w-6 text-purple-500" />;
        default:
          return <FileText className="h-6 w-6 text-gray-500" />;
      }
    };

    return (
      <motion.div
        key={documento.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -1 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          className={cn(
            "relative overflow-hidden cursor-pointer transition-all",
            "hover:shadow-md",
            documento.confidencial &&
              "border-l-4 border-l-orange-500 bg-orange-50",
            documento.status === "pendente_revisao" &&
              "border-l-4 border-l-yellow-500 bg-yellow-50",
          )}
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0">
                  {documento.thumbnail ? (
                    <img
                      src={documento.thumbnail}
                      alt={documento.nome}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                      {getFileIcon()}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge
                      variant={
                        documento.status === "aprovado"
                          ? "default"
                          : documento.status === "pendente_revisao"
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-xs"
                    >
                      {documento.status.replace("_", " ").toUpperCase()}
                    </Badge>

                    {documento.classificadoPorIA && (
                      <Badge variant="outline" className="text-xs">
                        🤖 {documento.confiancaIA}%
                      </Badge>
                    )}

                    {documento.confidencial && (
                      <Badge variant="destructive" className="text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        CONFIDENCIAL
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-semibold text-sm mb-1 truncate">
                    {documento.nome}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {documento.clienteNome}
                  </p>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share className="h-4 w-4 mr-2" />
                    Compartilhar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleClassifyWithAI(documento.id)}
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Reclassificar IA
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Archive className="h-4 w-4 mr-2" />
                    Arquivar
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            {/* Metadados */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-xs text-muted-foreground">Categoria</p>
                <p className="text-sm font-medium">{documento.categoria}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tamanho</p>
                <p className="text-sm font-medium">
                  {(documento.tamanho / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
            </div>

            {/* Vincula��ões */}
            <div className="mb-3">
              {documento.processoNumero && (
                <div className="flex items-center text-xs text-muted-foreground mb-1">
                  <Scale className="h-3 w-3 mr-1" />
                  {documento.processoNumero}
                </div>
              )}
              {documento.contratoNumero && (
                <div className="flex items-center text-xs text-muted-foreground mb-1">
                  <FileText className="h-3 w-3 mr-1" />
                  {documento.contratoNumero}
                </div>
              )}
            </div>

            {/* Data de upload */}
            <div className="mb-3">
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1" />
                Upload: {documento.dataUpload.toLocaleDateString("pt-BR")}
              </div>
              <p className="text-xs text-muted-foreground">
                Por: {documento.uploadedBy}
              </p>
            </div>

            {/* Versionamento */}
            {documento.versao > 1 && (
              <div className="mb-3">
                <Badge variant="outline" className="text-xs">
                  v{documento.versao}
                </Badge>
                <span className="text-xs text-muted-foreground ml-2">
                  {documento.versionamento.length} versões
                </span>
              </div>
            )}

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {documento.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {documento.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{documento.tags.length - 3}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header do módulo */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">GED Vinculado</h2>
          <p className="text-muted-foreground">
            Gestão documental inteligente e integrada
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {selectedFolder && viewMode === "documentos" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedFolder(null);
                setViewMode("pastas");
              }}
            >
              ← Voltar para Pastas
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowConfidential(!showConfidential)}
          >
            {showConfidential ? <Unlock /> : <Lock />}
            <span className="ml-2">
              {showConfidential ? "Ocultar" : "Mostrar"} Confidencial
            </span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setViewMode(viewMode === "pastas" ? "documentos" : "pastas")
            }
          >
            {viewMode === "pastas" ? "Ver Documentos" : "Ver Pastas"}
          </Button>

          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          {
            title: "Documentos",
            value: stats.totalDocumentos,
            icon: FileText,
            color: "text-blue-600",
          },
          {
            title: "Pastas",
            value: stats.totalPastas,
            icon: FolderOpen,
            color: "text-purple-600",
          },
          {
            title: "Pendentes",
            value: stats.pendentesRevisao,
            icon: Clock,
            color: "text-orange-600",
          },
          {
            title: "IA Classificados",
            value: stats.classificadosIA,
            icon: Brain,
            color: "text-green-600",
          },
          {
            title: "Confidenciais",
            value: stats.confidenciais,
            icon: Lock,
            color: "text-red-600",
          },
          {
            title: "Armazenamento",
            value: `${(stats.tamanhoTotal / 1024 / 1024 / 1024).toFixed(1)}GB`,
            icon: Archive,
            color: "text-indigo-600",
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <Icon className={cn("h-8 w-8", stat.color)} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
          <TabsList>
            <TabsTrigger value="pastas">Pastas</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
          </TabsList>
        </Tabs>

        {viewMode === "documentos" && (
          <>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as Categorias</SelectItem>
                <SelectItem value="Petição">Petições</SelectItem>
                <SelectItem value="Contrato">Contratos</SelectItem>
                <SelectItem value="Comprovante">Comprovantes</SelectItem>
                <SelectItem value="Parecer">Pareceres</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="pendente_revisao">
                  Pendente Revisão
                </SelectItem>
                <SelectItem value="rejeitado">Rejeitado</SelectItem>
                <SelectItem value="processando">Processando</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}

        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtros Avançados
        </Button>

        <Button variant="outline" size="sm">
          <Brain className="h-4 w-4 mr-2" />
          Busca Semântica
        </Button>
      </div>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {viewMode === "pastas"
          ? (filteredData as PastaGED[]).map(renderFolderCard)
          : (filteredData as Documento[]).map(renderDocumentCard)}
      </div>

      {/* Loading states */}
      {(loading || ocrLoading || aiLoading || aiProcessing) && (
        <div className="fixed bottom-4 right-4 z-50">
          <Card className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">
                {aiProcessing
                  ? "Processando com IA..."
                  : ocrLoading
                    ? "Extraindo texto..."
                    : aiLoading
                      ? "Classificando documento..."
                      : "Carregando..."}
              </span>
            </div>
          </Card>
        </div>
      )}

      {/* Empty state */}
      {filteredData.length === 0 && !loading && (
        <div className="text-center py-12">
          {viewMode === "pastas" ? (
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          ) : (
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          )}
          <h3 className="text-lg font-semibold mb-2">
            Nenhum{" "}
            {viewMode === "pastas"
              ? "pasta encontrada"
              : "documento encontrado"}
          </h3>
          <p className="text-muted-foreground mb-4">
            Comece fazendo upload de documentos ou criando pastas
          </p>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Documento
          </Button>
        </div>
      )}
    </div>
  );
}
