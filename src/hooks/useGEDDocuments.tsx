import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useStorageConfig } from "./useStorageConfig";

export interface GEDDocument {
  id: string;
  name: string;
  friendlyName?: string;
  size: number;
  type: string;
  extension: string;
  path: string;

  // Metadados
  tags: string[];
  description?: string;

  // Relacionamentos
  clientId?: string;
  clientName?: string;
  processNumber?: string;
  contractId?: string;
  ticketId?: string;

  // Origem
  source:
    | "UPLOAD_DIRETO"
    | "CRM"
    | "ATENDIMENTO"
    | "IA"
    | "AGENDA"
    | "PORTAL_CLIENTE";

  // Permissões e visibilidade
  visibility: "INTERNO" | "VISIVEL_CLIENTE";
  uploadedBy: string;
  uploadedByType: "ADVOGADO" | "ESTAGIARIO" | "ADMIN" | "CLIENTE";

  // Timestamps
  createdAt: string;
  modifiedAt: string;
  lastAccessedAt?: string;

  // Estados
  isFavorite: boolean;
  isDeleted: boolean;
  deletedAt?: string;

  // Versioning
  version: number;
  parentId?: string;

  // Comentários internos
  comments: DocumentComment[];

  // Estatísticas
  downloadCount: number;
  viewCount: number;
}

export interface DocumentComment {
  id: string;
  documentId: string;
  content: string;
  author: string;
  authorType: "ADVOGADO" | "ESTAGIARIO" | "ADMIN";
  createdAt: string;
  isResolved: boolean;
}

export interface DocumentFilter {
  search?: string;
  clientId?: string;
  processNumber?: string;
  tags?: string[];
  source?: string;
  visibility?: string;
  uploadedBy?: string;
  dateFrom?: string;
  dateTo?: string;
  fileType?: string;
  isFavorite?: boolean;
  isDeleted?: boolean;
}

export interface DocumentStats {
  total: number;
  byClient: Record<string, number>;
  byProcess: Record<string, number>;
  bySource: Record<string, number>;
  byType: Record<string, number>;
  totalSize: number;
  favorites: number;
  deleted: number;
  clientVisible: number;
}

export function useGEDDocuments() {
  const [documents, setDocuments] = useState<GEDDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const { uploadFile, getUploadPath } = useStorageConfig();

  // Carregar documentos
  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      // Carregar documentos do localStorage
      const savedDocs = localStorage.getItem("lawdesk-ged-documents");
      let docs: GEDDocument[] = [];

      if (savedDocs) {
        docs = JSON.parse(savedDocs);
      } else {
        // Inicializar com dados de exemplo
        docs = generateInitialDocuments();
        localStorage.setItem("lawdesk-ged-documents", JSON.stringify(docs));
      }

      setDocuments(docs);
      generateStats(docs);
    } catch (error) {
      console.error("Erro ao carregar documentos:", error);
      toast.error("Erro ao carregar documentos do GED");
    } finally {
      setLoading(false);
    }
  };

  const generateInitialDocuments = (): GEDDocument[] => {
    return [
      {
        id: "doc_001",
        name: "Contrato_Prestacao_Servicos.pdf",
        friendlyName: "Contrato de Prestação de Serviços - João Silva",
        size: 2048576,
        type: "application/pdf",
        extension: "PDF",
        path: "/clientes/cliente_001/documentos/Contrato_Prestacao_Servicos.pdf",
        tags: ["contrato", "prestação de serviços", "pessoa jurídica"],
        description:
          "Contrato de prestação de serviços jurídicos para consultoria empresarial",
        clientId: "cliente_001",
        clientName: "João Silva & Associados",
        source: "CRM",
        visibility: "VISIVEL_CLIENTE",
        uploadedBy: "Advogado Silva",
        uploadedByType: "ADVOGADO",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        modifiedAt: new Date(
          Date.now() - 1000 * 60 * 60 * 24 * 2,
        ).toISOString(),
        lastAccessedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        isFavorite: true,
        isDeleted: false,
        version: 2,
        comments: [
          {
            id: "comment_001",
            documentId: "doc_001",
            content: "Contrato revisado e aprovado pelo cliente",
            author: "Advogado Silva",
            authorType: "ADVOGADO",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
            isResolved: true,
          },
        ],
        downloadCount: 8,
        viewCount: 15,
      },
      {
        id: "doc_002",
        name: "Procuracao_Maria_Santos.pdf",
        friendlyName: "Procuração com Poderes Específicos - Maria Santos",
        size: 1536000,
        type: "application/pdf",
        extension: "PDF",
        path: "/clientes/cliente_002/documentos/Procuracao_Maria_Santos.pdf",
        tags: ["procuração", "poderes específicos", "cível"],
        clientId: "cliente_002",
        clientName: "Maria Santos",
        source: "PORTAL_CLIENTE",
        visibility: "VISIVEL_CLIENTE",
        uploadedBy: "Maria Santos",
        uploadedByType: "CLIENTE",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        modifiedAt: new Date(
          Date.now() - 1000 * 60 * 60 * 24 * 3,
        ).toISOString(),
        isFavorite: false,
        isDeleted: false,
        version: 1,
        comments: [],
        downloadCount: 3,
        viewCount: 7,
      },
      {
        id: "doc_003",
        name: "Peticao_Inicial_Indenizacao.docx",
        friendlyName: "Petição Inicial - Ação de Indenização por Danos Morais",
        size: 512000,
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        extension: "DOCX",
        path: "/processos/0001234-56.2024.8.26.0001/anexos/Peticao_Inicial_Indenizacao.docx",
        tags: ["petição inicial", "danos morais", "cível"],
        processNumber: "0001234-56.2024.8.26.0001",
        clientId: "cliente_002",
        clientName: "Maria Santos",
        source: "IA",
        visibility: "INTERNO",
        uploadedBy: "Sistema IA",
        uploadedByType: "ADMIN",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        modifiedAt: new Date(
          Date.now() - 1000 * 60 * 60 * 24 * 6,
        ).toISOString(),
        lastAccessedAt: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
        isFavorite: true,
        isDeleted: false,
        version: 3,
        comments: [
          {
            id: "comment_002",
            documentId: "doc_003",
            content: "Revisar fundamentação jurídica do artigo 186 CC",
            author: "Estagiário João",
            authorType: "ESTAGIARIO",
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
            isResolved: false,
          },
        ],
        downloadCount: 12,
        viewCount: 25,
      },
      {
        id: "doc_004",
        name: "Comprovante_Pagamento_Honorarios.jpg",
        friendlyName: "Comprovante de Pagamento - Honorários Advocatícios",
        size: 1024000,
        type: "image/jpeg",
        extension: "JPG",
        path: "/tickets/ticket_001/anexos/Comprovante_Pagamento_Honorarios.jpg",
        tags: ["comprovante", "pagamento", "honorários"],
        ticketId: "ticket_001",
        clientId: "cliente_001",
        clientName: "João Silva & Associados",
        source: "ATENDIMENTO",
        visibility: "INTERNO",
        uploadedBy: "Cliente Portal",
        uploadedByType: "CLIENTE",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        isFavorite: false,
        isDeleted: false,
        version: 1,
        comments: [],
        downloadCount: 1,
        viewCount: 3,
      },
      {
        id: "doc_005",
        name: "Documento_Antigo_Para_Exclusao.pdf",
        friendlyName: "Documento Obsoleto - Para Exclusão",
        size: 256000,
        type: "application/pdf",
        extension: "PDF",
        path: "/clientes/cliente_003/documentos/Documento_Antigo_Para_Exclusao.pdf",
        tags: ["obsoleto"],
        clientId: "cliente_003",
        clientName: "Cliente Inativo",
        source: "UPLOAD_DIRETO",
        visibility: "INTERNO",
        uploadedBy: "Advogado Silva",
        uploadedByType: "ADVOGADO",
        createdAt: new Date(
          Date.now() - 1000 * 60 * 60 * 24 * 30,
        ).toISOString(),
        modifiedAt: new Date(
          Date.now() - 1000 * 60 * 60 * 24 * 30,
        ).toISOString(),
        isFavorite: false,
        isDeleted: true,
        deletedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        version: 1,
        comments: [],
        downloadCount: 0,
        viewCount: 1,
      },
    ];
  };

  const generateStats = (docs: GEDDocument[]) => {
    const activeDocs = docs.filter((doc) => !doc.isDeleted);

    const stats: DocumentStats = {
      total: activeDocs.length,
      byClient: {},
      byProcess: {},
      bySource: {},
      byType: {},
      totalSize: activeDocs.reduce((sum, doc) => sum + doc.size, 0),
      favorites: activeDocs.filter((doc) => doc.isFavorite).length,
      deleted: docs.filter((doc) => doc.isDeleted).length,
      clientVisible: activeDocs.filter(
        (doc) => doc.visibility === "VISIVEL_CLIENTE",
      ).length,
    };

    // Estatísticas por cliente
    activeDocs.forEach((doc) => {
      if (doc.clientName) {
        stats.byClient[doc.clientName] =
          (stats.byClient[doc.clientName] || 0) + 1;
      }
    });

    // Estatísticas por processo
    activeDocs.forEach((doc) => {
      if (doc.processNumber) {
        stats.byProcess[doc.processNumber] =
          (stats.byProcess[doc.processNumber] || 0) + 1;
      }
    });

    // Estatísticas por fonte
    activeDocs.forEach((doc) => {
      stats.bySource[doc.source] = (stats.bySource[doc.source] || 0) + 1;
    });

    // Estatísticas por tipo
    activeDocs.forEach((doc) => {
      stats.byType[doc.extension] = (stats.byType[doc.extension] || 0) + 1;
    });

    setStats(stats);
  };

  // Filtrar documentos
  const filterDocuments = (
    docs: GEDDocument[],
    filter: DocumentFilter,
  ): GEDDocument[] => {
    return docs.filter((doc) => {
      // Filtro de exclusão
      if (
        filter.isDeleted !== undefined &&
        doc.isDeleted !== filter.isDeleted
      ) {
        return false;
      }

      // Busca textual
      if (filter.search) {
        const searchTerm = filter.search.toLowerCase();
        const searchFields = [
          doc.name,
          doc.friendlyName,
          doc.description,
          doc.clientName,
          doc.processNumber,
          doc.tags.join(" "),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchFields.includes(searchTerm)) {
          return false;
        }
      }

      // Filtros específicos
      if (filter.clientId && doc.clientId !== filter.clientId) return false;
      if (filter.processNumber && doc.processNumber !== filter.processNumber)
        return false;
      if (filter.source && doc.source !== filter.source) return false;
      if (filter.visibility && doc.visibility !== filter.visibility)
        return false;
      if (
        filter.uploadedBy &&
        !doc.uploadedBy.toLowerCase().includes(filter.uploadedBy.toLowerCase())
      )
        return false;
      if (filter.fileType && doc.extension !== filter.fileType) return false;
      if (
        filter.isFavorite !== undefined &&
        doc.isFavorite !== filter.isFavorite
      )
        return false;

      // Filtro por tags
      if (filter.tags && filter.tags.length > 0) {
        const hasAllTags = filter.tags.every((tag) =>
          doc.tags.some((docTag) =>
            docTag.toLowerCase().includes(tag.toLowerCase()),
          ),
        );
        if (!hasAllTags) return false;
      }

      // Filtro por data
      if (filter.dateFrom) {
        const docDate = new Date(doc.createdAt);
        const fromDate = new Date(filter.dateFrom);
        if (docDate < fromDate) return false;
      }

      if (filter.dateTo) {
        const docDate = new Date(doc.createdAt);
        const toDate = new Date(filter.dateTo + " 23:59:59");
        if (docDate > toDate) return false;
      }

      return true;
    });
  };

  // Upload de documento
  const uploadDocument = async (
    file: File,
    metadata: Partial<GEDDocument>,
  ): Promise<string> => {
    try {
      // Determinar caminho baseado no tipo de entidade
      let entityType = "OUTROS";
      let entityId = "geral";

      if (metadata.clientId) {
        entityType = "CLIENTE";
        entityId = metadata.clientId;
      } else if (metadata.processNumber) {
        entityType = "PROCESSO";
        entityId = metadata.processNumber;
      } else if (metadata.ticketId) {
        entityType = "TICKET";
        entityId = metadata.ticketId;
      }

      const path = getUploadPath(entityType, entityId);
      const fileId = await uploadFile(file, path, entityType, entityId);

      // Criar documento no GED
      const newDocument: GEDDocument = {
        id: fileId,
        name: file.name,
        friendlyName: metadata.friendlyName || file.name,
        size: file.size,
        type: file.type,
        extension: file.name.split(".").pop()?.toUpperCase() || "UNKNOWN",
        path: `${path}/${file.name}`,
        tags: metadata.tags || [],
        description: metadata.description,
        clientId: metadata.clientId,
        clientName: metadata.clientName,
        processNumber: metadata.processNumber,
        contractId: metadata.contractId,
        ticketId: metadata.ticketId,
        source: metadata.source || "UPLOAD_DIRETO",
        visibility: metadata.visibility || "INTERNO",
        uploadedBy: "Usuário Atual",
        uploadedByType: "ADVOGADO",
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        isFavorite: false,
        isDeleted: false,
        version: 1,
        comments: [],
        downloadCount: 0,
        viewCount: 0,
      };

      // Salvar documento
      const updatedDocs = [...documents, newDocument];
      setDocuments(updatedDocs);
      localStorage.setItem(
        "lawdesk-ged-documents",
        JSON.stringify(updatedDocs),
      );
      generateStats(updatedDocs);

      toast.success(`📄 ${file.name} adicionado ao GED com sucesso!`);
      return fileId;
    } catch (error: any) {
      toast.error(`❌ Erro ao adicionar documento: ${error.message}`);
      throw error;
    }
  };

  // Atualizar documento
  const updateDocument = async (
    documentId: string,
    updates: Partial<GEDDocument>,
  ): Promise<void> => {
    const updatedDocs = documents.map((doc) =>
      doc.id === documentId
        ? { ...doc, ...updates, modifiedAt: new Date().toISOString() }
        : doc,
    );

    setDocuments(updatedDocs);
    localStorage.setItem("lawdesk-ged-documents", JSON.stringify(updatedDocs));
    generateStats(updatedDocs);

    toast.success("📝 Documento atualizado com sucesso!");
  };

  // Adicionar comentário
  const addComment = async (
    documentId: string,
    content: string,
  ): Promise<void> => {
    const comment: DocumentComment = {
      id: `comment_${Date.now()}`,
      documentId,
      content,
      author: "Usuário Atual",
      authorType: "ADVOGADO",
      createdAt: new Date().toISOString(),
      isResolved: false,
    };

    const updatedDocs = documents.map((doc) =>
      doc.id === documentId
        ? { ...doc, comments: [...doc.comments, comment] }
        : doc,
    );

    setDocuments(updatedDocs);
    localStorage.setItem("lawdesk-ged-documents", JSON.stringify(updatedDocs));

    toast.success("💬 Comentário adicionado!");
  };

  // Toggle favorito
  const toggleFavorite = async (documentId: string): Promise<void> => {
    const doc = documents.find((d) => d.id === documentId);
    if (!doc) return;

    await updateDocument(documentId, { isFavorite: !doc.isFavorite });

    toast.success(
      doc.isFavorite
        ? "⭐ Removido dos favoritos"
        : "⭐ Adicionado aos favoritos",
    );
  };

  // Mover para lixeira
  const moveToTrash = async (documentId: string): Promise<void> => {
    await updateDocument(documentId, {
      isDeleted: true,
      deletedAt: new Date().toISOString(),
    });

    toast.success("🗑️ Documento movido para a lixeira");
  };

  // Restaurar da lixeira
  const restoreFromTrash = async (documentId: string): Promise<void> => {
    await updateDocument(documentId, {
      isDeleted: false,
      deletedAt: undefined,
    });

    toast.success("♻️ Documento restaurado da lixeira");
  };

  // Excluir permanentemente
  const deletePermanently = async (documentId: string): Promise<void> => {
    const updatedDocs = documents.filter((doc) => doc.id !== documentId);
    setDocuments(updatedDocs);
    localStorage.setItem("lawdesk-ged-documents", JSON.stringify(updatedDocs));
    generateStats(updatedDocs);

    toast.success("🗑️ Documento excluído permanentemente");
  };

  return {
    documents,
    stats,
    loading,
    filterDocuments,
    uploadDocument,
    updateDocument,
    addComment,
    toggleFavorite,
    moveToTrash,
    restoreFromTrash,
    deletePermanently,
    refreshDocuments: loadDocuments,
  };
}
