/**
 * 📁 MÓDULO GED VINCULADO - CRM Jurídico
 *
 * Gestão documental inteligente vinculada
 * - OCR e classificação automática
 * - Vinculação a clientes e processos
 * - Controle de versões
 * - Busca inteligente
 */

import React, { useState, useMemo } from "react";
import {
  FolderOpen,
  Plus,
  Search,
  FileText,
  Image,
  Upload,
  Eye,
  Download,
  Share,
  Tag,
  Link,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  ConfigurableList,
  ColumnConfig,
  ListItem,
  Discussion,
} from "@/components/CRM/ConfigurableList";

// Tipos específicos
interface Documento {
  id: string;
  nome: string;
  tipo: "pdf" | "doc" | "img" | "xlsx" | "outros";
  categoria: "contrato" | "processo" | "correspondencia" | "outros";
  status: "classificado" | "pendente_classificacao" | "revisao" | "arquivado";
  tamanho: number; // em KB
  dataUpload: Date;
  dataModificacao: Date;
  cliente?: string;
  clienteId?: string;
  processoVinculado?: string;
  contratoVinculado?: string;
  classificadoPorIA: boolean;
  confiancaIA?: number;
  textoExtraido?: string;
  tags: string[];
  responsavel: string;
  observacoes?: string;
  versao: number;
  versaoOriginal?: string;
}

interface GEDVinculadoModuleProps {
  searchQuery?: string;
  viewMode?: "list" | "kanban";
  onNotification?: (message: string) => void;
  className?: string;
}

// Mock data
const MOCK_DOCUMENTOS: Documento[] = [
  {
    id: "1",
    nome: "Contrato_Prestacao_Servicos_JoaoSilva_v2.pdf",
    tipo: "pdf",
    categoria: "contrato",
    status: "classificado",
    tamanho: 1024,
    dataUpload: new Date(Date.now() - 86400000 * 2),
    dataModificacao: new Date(Date.now() - 86400000),
    cliente: "João Silva & Associados",
    clienteId: "1",
    contratoVinculado: "CTR-2024-001",
    classificadoPorIA: true,
    confiancaIA: 95,
    textoExtraido: "Contrato de prestação de serviços jurídicos...",
    tags: ["contrato", "prestacao-servicos", "revisado"],
    responsavel: "Maria Santos",
    versao: 2,
  },
  {
    id: "2",
    nome: "Peticao_Inicial_TechCorp.pdf",
    tipo: "pdf",
    categoria: "processo",
    status: "classificado",
    tamanho: 2048,
    dataUpload: new Date(Date.now() - 86400000 * 5),
    dataModificacao: new Date(Date.now() - 86400000 * 4),
    cliente: "TechCorp Ltda",
    clienteId: "2",
    processoVinculado: "5005678-34.2024.4.03.6100",
    classificadoPorIA: true,
    confiancaIA: 88,
    tags: ["peticao", "inicial", "trabalhista"],
    responsavel: "Carlos Oliveira",
    versao: 1,
  },
  {
    id: "3",
    nome: "Procuracao_AnaCosta.pdf",
    tipo: "pdf",
    categoria: "outros",
    status: "pendente_classificacao",
    tamanho: 512,
    dataUpload: new Date(Date.now() - 86400000),
    dataModificacao: new Date(Date.now() - 86400000),
    cliente: "Ana Costa",
    clienteId: "3",
    classificadoPorIA: false,
    tags: ["procuracao"],
    responsavel: "João Silva",
    versao: 1,
  },
  {
    id: "4",
    nome: "Correspondencia_Cliente_Pedro.docx",
    tipo: "doc",
    categoria: "correspondencia",
    status: "revisao",
    tamanho: 256,
    dataUpload: new Date(),
    dataModificacao: new Date(),
    cliente: "Pedro Almeida",
    clienteId: "4",
    classificadoPorIA: true,
    confiancaIA: 72,
    tags: ["correspondencia", "resposta"],
    responsavel: "Ana Silva",
    versao: 1,
  },
];

// Configuração das colunas
const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: "nome", label: "Nome", visible: true, sortable: true },
  { key: "categoria", label: "Categoria", visible: true, sortable: true },
  { key: "cliente", label: "Cliente", visible: true, sortable: true },
  { key: "status", label: "Status", visible: true, sortable: true },
  { key: "dataUpload", label: "Upload", visible: true, sortable: true },
  { key: "tamanho", label: "Tamanho", visible: true, sortable: true },
  { key: "responsavel", label: "Responsável", visible: true, sortable: true },
  { key: "confiancaIA", label: "IA %", visible: false, sortable: true },
  { key: "versao", label: "Versão", visible: false, sortable: true },
  { key: "vinculacoes", label: "Vínculos", visible: false, sortable: false },
];

export const GEDVinculadoModule: React.FC<GEDVinculadoModuleProps> = ({
  searchQuery = "",
  viewMode = "list",
  onNotification,
  className,
}) => {
  const [documentos, setDocumentos] = useState<Documento[]>(MOCK_DOCUMENTOS);
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [filterCategoria, setFilterCategoria] = useState<string>("todos");
  const [filterTipo, setFilterTipo] = useState<string>("todos");

  // Filtrar documentos
  const filteredDocumentos = useMemo(() => {
    return documentos.filter((doc) => {
      const matchesSearch =
        searchQuery === "" ||
        doc.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.cliente?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase()),
        );

      const matchesStatus =
        filterStatus === "todos" || doc.status === filterStatus;

      const matchesCategoria =
        filterCategoria === "todos" || doc.categoria === filterCategoria;

      const matchesTipo = filterTipo === "todos" || doc.tipo === filterTipo;

      return matchesSearch && matchesStatus && matchesCategoria && matchesTipo;
    });
  }, [documentos, searchQuery, filterStatus, filterCategoria, filterTipo]);

  // Converter para formato da lista
  const listItems: ListItem[] = useMemo(() => {
    return filteredDocumentos.map((doc) => {
      const vinculacoes = [];
      if (doc.processoVinculado)
        vinculacoes.push(`Proc: ${doc.processoVinculado}`);
      if (doc.contratoVinculado)
        vinculacoes.push(`Contr: ${doc.contratoVinculado}`);

      return {
        id: doc.id,
        status: doc.status,
        data: {
          nome: doc.nome,
          categoria: getCategoriaLabel(doc.categoria),
          cliente: doc.cliente || "Não vinculado",
          status: getStatusLabel(doc.status),
          dataUpload: doc.dataUpload.toLocaleDateString(),
          tamanho: formatTamanho(doc.tamanho),
          responsavel: doc.responsavel,
          confiancaIA: doc.confiancaIA ? `${doc.confiancaIA}%` : "N/A",
          versao: `v${doc.versao}`,
          vinculacoes: vinculacoes.join(", ") || "Nenhum",
          tipo: getTipoLabel(doc.tipo),
          tags: doc.tags.join(", "),
          classificadoPorIA: doc.classificadoPorIA ? "Sim" : "Não",
        },
        discussions: [
          {
            id: "1",
            author: doc.responsavel,
            message: "Documento revisado e classificado",
            timestamp: new Date(),
            internal: true,
          },
        ],
      };
    });
  }, [filteredDocumentos]);

  // Status columns para Kanban
  const statusColumns = [
    "pendente_classificacao",
    "revisao",
    "classificado",
    "arquivado",
  ];

  // Handlers
  const handleItemUpdate = (item: ListItem) => {
    const updatedDocumentos = documentos.map((doc) => {
      if (doc.id === item.id) {
        return { ...doc, status: item.status as Documento["status"] };
      }
      return doc;
    });
    setDocumentos(updatedDocumentos);
    onNotification?.("Documento atualizado com sucesso");
  };

  const handleDiscussion = (
    itemId: string,
    discussion: Omit<Discussion, "id" | "timestamp">,
  ) => {
    onNotification?.("Discussão adicionada ao documento");
  };

  // Estatísticas
  const stats = useMemo(() => {
    const pendentesClassificacao = documentos.filter(
      (d) => d.status === "pendente_classificacao",
    ).length;

    const classificadosIA = documentos.filter(
      (d) => d.classificadoPorIA,
    ).length;

    const tamanhoTotal = documentos.reduce((acc, doc) => acc + doc.tamanho, 0);

    return {
      total: documentos.length,
      pendentesClassificacao,
      classificadosIA,
      percentualIA: Math.round((classificadosIA / documentos.length) * 100),
      tamanhoTotal,
    };
  }, [documentos]);

  return (
    <div className={`p-6 space-y-6 ${className}`}>
      {/* Estatísticas */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total de Documentos</p>
                <p className="text-xl font-semibold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Tag className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Classificados por IA</p>
                <p className="text-xl font-semibold">{stats.percentualIA}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Search className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pendentes</p>
                <p className="text-xl font-semibold">
                  {stats.pendentesClassificacao}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Upload className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Armazenamento</p>
                <p className="text-xl font-semibold">
                  {formatTamanho(stats.tamanhoTotal)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas importantes */}
      {stats.pendentesClassificacao > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Tag className="w-5 h-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">
                  {stats.pendentesClassificacao} documento(s) aguardando
                  classificação
                </p>
                <p className="text-sm text-orange-600">
                  Revise e classifique para melhorar a organização
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os Status</SelectItem>
              <SelectItem value="pendente_classificacao">Pendente</SelectItem>
              <SelectItem value="revisao">Em Revisão</SelectItem>
              <SelectItem value="classificado">Classificado</SelectItem>
              <SelectItem value="arquivado">Arquivado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCategoria} onValueChange={setFilterCategoria}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas</SelectItem>
              <SelectItem value="contrato">Contratos</SelectItem>
              <SelectItem value="processo">Processos</SelectItem>
              <SelectItem value="correspondencia">Correspondência</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterTipo} onValueChange={setFilterTipo}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="doc">DOC</SelectItem>
              <SelectItem value="img">Imagem</SelectItem>
              <SelectItem value="xlsx">Excel</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Link className="w-4 h-4 mr-2" />
            Vincular
          </Button>
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            OCR
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      {/* Lista configurável */}
      <ConfigurableList
        items={listItems}
        columns={columns}
        viewMode={viewMode}
        onItemUpdate={handleItemUpdate}
        onColumnUpdate={setColumns}
        onDiscussion={handleDiscussion}
        statusColumns={statusColumns}
      />
    </div>
  );
};

// Funções auxiliares
const getStatusLabel = (status: Documento["status"]): string => {
  const labels = {
    classificado: "Classificado",
    pendente_classificacao: "Pendente",
    revisao: "Em Revisão",
    arquivado: "Arquivado",
  };
  return labels[status];
};

const getCategoriaLabel = (categoria: Documento["categoria"]): string => {
  const labels = {
    contrato: "Contrato",
    processo: "Processo",
    correspondencia: "Correspondência",
    outros: "Outros",
  };
  return labels[categoria];
};

const getTipoLabel = (tipo: Documento["tipo"]): string => {
  const labels = {
    pdf: "PDF",
    doc: "DOC",
    img: "Imagem",
    xlsx: "Excel",
    outros: "Outros",
  };
  return labels[tipo];
};

const formatTamanho = (tamanhoKB: number): string => {
  if (tamanhoKB < 1024) {
    return `${tamanhoKB} KB`;
  } else if (tamanhoKB < 1024 * 1024) {
    return `${(tamanhoKB / 1024).toFixed(1)} MB`;
  } else {
    return `${(tamanhoKB / (1024 * 1024)).toFixed(1)} GB`;
  }
};

export default GEDVinculadoModule;
