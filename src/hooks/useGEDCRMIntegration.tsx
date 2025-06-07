import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

export interface CRMEntity {
  id: string;
  name: string;
  type: "client" | "process" | "contract";
  cpfCnpj?: string;
  processNumber?: string;
  contractNumber?: string;
  status: "active" | "inactive" | "archived";
  createdAt: string;
  metadata?: {
    email?: string;
    phone?: string;
    address?: string;
    responsibleLawyer?: string;
    processType?: string;
    courtInstance?: string;
    contractType?: string;
    contractValue?: number;
  };
}

export interface FolderTemplate {
  id: string;
  name: string;
  description: string;
  type: "client" | "process" | "contract";
  folders: {
    name: string;
    icon: string;
    description: string;
    subfolders?: string[];
  }[];
}

export interface GEDIntegrationHook {
  // CRM Entities
  clients: CRMEntity[];
  processes: CRMEntity[];
  contracts: CRMEntity[];

  // Templates
  folderTemplates: FolderTemplate[];

  // Actions
  createEntityFolder: (entity: CRMEntity, templateId?: string) => Promise<void>;
  deleteEntityFolder: (
    entityId: string,
    action: "archive" | "transfer" | "delete",
  ) => Promise<void>;
  linkDocumentToEntity: (documentId: string, entityId: string) => Promise<void>;
  transferDocuments: (
    fromEntityId: string,
    toEntityId: string,
  ) => Promise<void>;

  // Template management
  createFolderFromTemplate: (
    templateId: string,
    entityId: string,
  ) => Promise<void>;
  saveFolderAsTemplate: (
    folderId: string,
    templateName: string,
  ) => Promise<void>;

  // Synchronization
  syncCRMEntities: () => Promise<void>;
  validateFolderStructure: () => Promise<any[]>;

  // Loading states
  loading: boolean;
  syncing: boolean;
}

const defaultTemplates: FolderTemplate[] = [
  {
    id: "template_client_standard",
    name: "Cliente Padrão",
    description: "Estrutura padrão para novos clientes",
    type: "client",
    folders: [
      {
        name: "Documentos Pessoais",
        icon: "👤",
        description: "CPF, RG, comprovante de endereço",
      },
      {
        name: "Procurações",
        icon: "⚖️",
        description: "Procurações e instrumentos de mandato",
      },
      {
        name: "Contratos",
        icon: "📝",
        description: "Contratos de prestação de serviços",
      },
      {
        name: "Correspondências",
        icon: "📧",
        description: "E-mails e comunicações",
      },
      { name: "Pagamentos", icon: "💰", description: "Comprovantes e recibos" },
    ],
  },
  {
    id: "template_process_civil",
    name: "Processo Cível Padrão",
    description: "Estrutura para processos cíveis",
    type: "process",
    folders: [
      {
        name: "Petição Inicial",
        icon: "📋",
        description: "Peça inaugural e documentos",
      },
      { name: "Contestação", icon: "🛡️", description: "Defesa e documentos" },
      {
        name: "Provas",
        icon: "🔍",
        description: "Documentos, laudos e perícias",
      },
      { name: "Audiências", icon: "🎙️", description: "Atas e gravações" },
      { name: "Sentenças", icon: "⚖️", description: "Decisões e acórdãos" },
      { name: "Recursos", icon: "📤", description: "Recursos e contrarrazões" },
      { name: "Execução", icon: "🎯", description: "Fase de execução" },
    ],
  },
  {
    id: "template_process_trabalhista",
    name: "Processo Trabalhista",
    description: "Estrutura para processos trabalhistas",
    type: "process",
    folders: [
      {
        name: "Reclamação Trabalhista",
        icon: "📋",
        description: "Petição inicial trabalhista",
      },
      {
        name: "Defesa",
        icon: "🛡️",
        description: "Contestação e documentos da empresa",
      },
      {
        name: "Documentos Trabalhistas",
        icon: "📄",
        description: "CTPS, contratos, holerites",
      },
      {
        name: "Perícias",
        icon: "🔬",
        description: "Laudos periciais e assistente técnico",
      },
      {
        name: "Audiências",
        icon: "🎙️",
        description: "Atas de audiência e conciliação",
      },
      {
        name: "Acordos",
        icon: "🤝",
        description: "Propostas e termos de acordo",
      },
      {
        name: "Execução",
        icon: "💰",
        description: "Cálculos e execução de sentença",
      },
    ],
  },
  {
    id: "template_contract_standard",
    name: "Contrato Padrão",
    description: "Estrutura para gestão de contratos",
    type: "contract",
    folders: [
      {
        name: "Minuta Original",
        icon: "📝",
        description: "Versão original do contrato",
      },
      {
        name: "Aditivos",
        icon: "➕",
        description: "Termos aditivos e alterações",
      },
      {
        name: "Garantias",
        icon: "🛡️",
        description: "Seguros e garantias contratuais",
      },
      {
        name: "Comunicações",
        icon: "📧",
        description: "Notificações e correspondências",
      },
      { name: "Pagamentos", icon: "💰", description: "Faturas e comprovantes" },
      { name: "Rescisão", icon: "❌", description: "Documentos de rescisão" },
    ],
  },
];

export function useGEDCRMIntegration(): GEDIntegrationHook {
  const [clients, setClients] = useState<CRMEntity[]>([]);
  const [processes, setProcesses] = useState<CRMEntity[]>([]);
  const [contracts, setContracts] = useState<CRMEntity[]>([]);
  const [folderTemplates, setFolderTemplates] =
    useState<FolderTemplate[]>(defaultTemplates);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Load initial data
  useEffect(() => {
    loadCRMEntities();
    loadCustomTemplates();
  }, []);

  const loadCRMEntities = useCallback(async () => {
    try {
      // Load from localStorage (simulating API calls)
      const storedClients = localStorage.getItem("lawdesk-crm-clients");
      const storedProcesses = localStorage.getItem("lawdesk-crm-processes");
      const storedContracts = localStorage.getItem("lawdesk-crm-contracts");

      if (storedClients) setClients(JSON.parse(storedClients));
      if (storedProcesses) setProcesses(JSON.parse(storedProcesses));
      if (storedContracts) setContracts(JSON.parse(storedContracts));

      // If no data exists, create sample data
      if (!storedClients) {
        const sampleClients: CRMEntity[] = [
          {
            id: "client_001",
            name: "João Silva & Associados",
            type: "client",
            cpfCnpj: "12.345.678/0001-90",
            status: "active",
            createdAt: new Date().toISOString(),
            metadata: {
              email: "joao@silva.com.br",
              phone: "(11) 98765-4321",
              responsibleLawyer: "Dr. Carlos Santos",
            },
          },
          {
            id: "client_002",
            name: "Maria Santos",
            type: "client",
            cpfCnpj: "123.456.789-01",
            status: "active",
            createdAt: new Date().toISOString(),
            metadata: {
              email: "maria@email.com",
              phone: "(11) 91234-5678",
              responsibleLawyer: "Dra. Ana Paula",
            },
          },
        ];
        setClients(sampleClients);
        localStorage.setItem(
          "lawdesk-crm-clients",
          JSON.stringify(sampleClients),
        );
      }

      if (!storedProcesses) {
        const sampleProcesses: CRMEntity[] = [
          {
            id: "process_001",
            name: "Ação de Indenização",
            type: "process",
            processNumber: "0001234-56.2024.8.26.0001",
            status: "active",
            createdAt: new Date().toISOString(),
            metadata: {
              processType: "Cível",
              courtInstance: "1ª Vara Cível",
              responsibleLawyer: "Dr. Carlos Santos",
            },
          },
        ];
        setProcesses(sampleProcesses);
        localStorage.setItem(
          "lawdesk-crm-processes",
          JSON.stringify(sampleProcesses),
        );
      }
    } catch (error) {
      console.error("Erro ao carregar entidades do CRM:", error);
    }
  }, []);

  const loadCustomTemplates = useCallback(() => {
    try {
      const storedTemplates = localStorage.getItem("lawdesk-ged-templates");
      if (storedTemplates) {
        const customTemplates = JSON.parse(storedTemplates);
        setFolderTemplates([...defaultTemplates, ...customTemplates]);
      }
    } catch (error) {
      console.error("Erro ao carregar templates:", error);
    }
  }, []);

  const createEntityFolder = useCallback(
    async (entity: CRMEntity, templateId?: string) => {
      setLoading(true);
      try {
        // Get current tree structure
        const treeData = JSON.parse(
          localStorage.getItem("lawdesk_ged_tree") || "[]",
        );

        // Find appropriate parent folder
        let parentFolder;
        switch (entity.type) {
          case "client":
            parentFolder = findOrCreateFolder(treeData, "clients", "Clientes");
            break;
          case "process":
            parentFolder = findOrCreateFolder(
              treeData,
              "processes",
              "Processos",
            );
            break;
          case "contract":
            parentFolder = findOrCreateFolder(
              treeData,
              "contracts",
              "Contratos",
            );
            break;
        }

        // Create entity folder
        const entityFolder = {
          id: `${entity.type}_${entity.id}`,
          name: entity.name,
          type: entity.type,
          parentId: parentFolder.id,
          fileCount: 0,
          metadata: {
            entityId: entity.id,
            ...(entity.type === "client" && { clientId: entity.id }),
            ...(entity.type === "process" && {
              processNumber: entity.processNumber,
            }),
            ...(entity.type === "contract" && {
              contractNumber: entity.contractNumber,
            }),
          },
          children: [],
        };

        // Apply template if specified
        if (templateId) {
          const template = folderTemplates.find((t) => t.id === templateId);
          if (template) {
            entityFolder.children = template.folders.map((folder) => ({
              id: `${entityFolder.id}_${folder.name.toLowerCase().replace(/\s+/g, "_")}`,
              name: folder.name,
              type: "folder",
              parentId: entityFolder.id,
              fileCount: 0,
              metadata: { description: folder.description, icon: folder.icon },
              children:
                folder.subfolders?.map((subfolder) => ({
                  id: `${entityFolder.id}_${folder.name.toLowerCase().replace(/\s+/g, "_")}_${subfolder.toLowerCase().replace(/\s+/g, "_")}`,
                  name: subfolder,
                  type: "folder",
                  parentId: `${entityFolder.id}_${folder.name.toLowerCase().replace(/\s+/g, "_")}`,
                  fileCount: 0,
                  children: [],
                })) || [],
            }));
          }
        }

        // Add to parent
        if (!parentFolder.children) parentFolder.children = [];
        parentFolder.children.push(entityFolder);

        // Save updated tree
        localStorage.setItem("lawdesk_ged_tree", JSON.stringify(treeData));

        toast.success(
          `Pasta criada para ${entity.name}${templateId ? " com template aplicado" : ""}`,
        );
      } catch (error) {
        console.error("Erro ao criar pasta da entidade:", error);
        toast.error("Erro ao criar pasta da entidade");
      } finally {
        setLoading(false);
      }
    },
    [folderTemplates],
  );

  const deleteEntityFolder = useCallback(
    async (entityId: string, action: "archive" | "transfer" | "delete") => {
      setLoading(true);
      try {
        const treeData = JSON.parse(
          localStorage.getItem("lawdesk_ged_tree") || "[]",
        );

        switch (action) {
          case "archive":
            // Move to archived folder
            const archivedFolder = findOrCreateFolder(
              treeData,
              "archived",
              "Arquivados",
            );
            moveEntityFolder(treeData, entityId, archivedFolder.id);
            toast.success("Pasta arquivada com sucesso");
            break;

          case "transfer":
            // This will be handled by transferDocuments function
            toast.info("Selecione o destino para transferência");
            break;

          case "delete":
            // Remove completely
            removeEntityFolder(treeData, entityId);
            toast.success("Pasta excluída permanentemente");
            break;
        }

        localStorage.setItem("lawdesk_ged_tree", JSON.stringify(treeData));
      } catch (error) {
        console.error("Erro ao processar exclusão:", error);
        toast.error("Erro ao processar exclusão da pasta");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const linkDocumentToEntity = useCallback(
    async (documentId: string, entityId: string) => {
      try {
        const files = JSON.parse(
          localStorage.getItem("lawdesk_ged_files") || "[]",
        );
        const fileIndex = files.findIndex((f: any) => f.id === documentId);

        if (fileIndex >= 0) {
          const entity = [...clients, ...processes, ...contracts].find(
            (e) => e.id === entityId,
          );
          if (entity) {
            files[fileIndex].associatedWith = {
              type: entity.type,
              id: entity.id,
              name: entity.name,
            };
            localStorage.setItem("lawdesk_ged_files", JSON.stringify(files));
            toast.success(`Documento vinculado a ${entity.name}`);
          }
        }
      } catch (error) {
        console.error("Erro ao vincular documento:", error);
        toast.error("Erro ao vincular documento");
      }
    },
    [clients, processes, contracts],
  );

  const transferDocuments = useCallback(
    async (fromEntityId: string, toEntityId: string) => {
      setLoading(true);
      try {
        const files = JSON.parse(
          localStorage.getItem("lawdesk_ged_files") || "[]",
        );
        const treeData = JSON.parse(
          localStorage.getItem("lawdesk_ged_tree") || "[]",
        );

        // Update file associations
        const updatedFiles = files.map((file: any) => {
          if (file.associatedWith?.id === fromEntityId) {
            const newEntity = [...clients, ...processes, ...contracts].find(
              (e) => e.id === toEntityId,
            );
            if (newEntity) {
              return {
                ...file,
                associatedWith: {
                  type: newEntity.type,
                  id: newEntity.id,
                  name: newEntity.name,
                },
              };
            }
          }
          return file;
        });

        // Move folder structure
        moveEntityFolder(treeData, fromEntityId, toEntityId);

        localStorage.setItem("lawdesk_ged_files", JSON.stringify(updatedFiles));
        localStorage.setItem("lawdesk_ged_tree", JSON.stringify(treeData));

        toast.success("Documentos transferidos com sucesso");
      } catch (error) {
        console.error("Erro ao transferir documentos:", error);
        toast.error("Erro ao transferir documentos");
      } finally {
        setLoading(false);
      }
    },
    [clients, processes, contracts],
  );

  const createFolderFromTemplate = useCallback(
    async (templateId: string, entityId: string) => {
      const entity = [...clients, ...processes, ...contracts].find(
        (e) => e.id === entityId,
      );
      if (entity) {
        await createEntityFolder(entity, templateId);
      }
    },
    [clients, processes, contracts, createEntityFolder],
  );

  const saveFolderAsTemplate = useCallback(
    async (folderId: string, templateName: string) => {
      try {
        const treeData = JSON.parse(
          localStorage.getItem("lawdesk_ged_tree") || "[]",
        );
        const folder = findFolderById(treeData, folderId);

        if (folder && folder.children) {
          const newTemplate: FolderTemplate = {
            id: `template_custom_${Date.now()}`,
            name: templateName,
            description: `Template personalizado criado a partir de ${folder.name}`,
            type: folder.type as "client" | "process" | "contract",
            folders: folder.children.map((child: any) => ({
              name: child.name,
              icon: child.metadata?.icon || "📁",
              description: child.metadata?.description || "",
              subfolders: child.children?.map((sub: any) => sub.name) || [],
            })),
          };

          const customTemplates = JSON.parse(
            localStorage.getItem("lawdesk-ged-templates") || "[]",
          );
          customTemplates.push(newTemplate);
          localStorage.setItem(
            "lawdesk-ged-templates",
            JSON.stringify(customTemplates),
          );

          setFolderTemplates((prev) => [...prev, newTemplate]);
          toast.success("Template salvo com sucesso");
        }
      } catch (error) {
        console.error("Erro ao salvar template:", error);
        toast.error("Erro ao salvar template");
      }
    },
    [],
  );

  const syncCRMEntities = useCallback(async () => {
    setSyncing(true);
    try {
      // Simulate API sync
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await loadCRMEntities();
      toast.success("Sincronização com CRM concluída");
    } catch (error) {
      console.error("Erro na sincronização:", error);
      toast.error("Erro na sincronização com CRM");
    } finally {
      setSyncing(false);
    }
  }, [loadCRMEntities]);

  const validateFolderStructure = useCallback(async () => {
    try {
      const treeData = JSON.parse(
        localStorage.getItem("lawdesk_ged_tree") || "[]",
      );
      const files = JSON.parse(
        localStorage.getItem("lawdesk_ged_files") || "[]",
      );
      const issues = [];

      // Check for orphaned folders
      const allEntities = [...clients, ...processes, ...contracts];
      const entityFolders = findAllEntityFolders(treeData);

      entityFolders.forEach((folder) => {
        if (!allEntities.find((e) => e.id === folder.metadata?.entityId)) {
          issues.push({
            type: "orphaned_folder",
            message: `Pasta órfã encontrada: ${folder.name}`,
            folderId: folder.id,
            severity: "warning",
          });
        }
      });

      // Check for files without entity association
      const unlinkedFiles = files.filter((file: any) => !file.associatedWith);
      if (unlinkedFiles.length > 0) {
        issues.push({
          type: "unlinked_files",
          message: `${unlinkedFiles.length} arquivos sem vinculação com entidades`,
          files: unlinkedFiles,
          severity: "info",
        });
      }

      return issues;
    } catch (error) {
      console.error("Erro na validação:", error);
      return [];
    }
  }, [clients, processes, contracts]);

  // Helper functions
  const findOrCreateFolder = (treeData: any[], id: string, name: string) => {
    let folder = findFolderById(treeData, id);
    if (!folder) {
      folder = {
        id,
        name,
        type: "folder",
        parentId: "root",
        fileCount: 0,
        children: [],
      };
      treeData.push(folder);
    }
    return folder;
  };

  const findFolderById = (treeData: any[], id: string): any => {
    for (const item of treeData) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findFolderById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const findAllEntityFolders = (treeData: any[]): any[] => {
    const entityFolders: any[] = [];
    const traverse = (items: any[]) => {
      items.forEach((item) => {
        if (item.metadata?.entityId) {
          entityFolders.push(item);
        }
        if (item.children) {
          traverse(item.children);
        }
      });
    };
    traverse(treeData);
    return entityFolders;
  };

  const moveEntityFolder = (
    treeData: any[],
    entityId: string,
    newParentId: string,
  ) => {
    // Implementation for moving folders
    // This is a simplified version - full implementation would handle deep moves
  };

  const removeEntityFolder = (treeData: any[], entityId: string) => {
    // Implementation for removing folders
    // This is a simplified version - full implementation would handle cascading deletes
  };

  return {
    clients,
    processes,
    contracts,
    folderTemplates,
    createEntityFolder,
    deleteEntityFolder,
    linkDocumentToEntity,
    transferDocuments,
    createFolderFromTemplate,
    saveFolderAsTemplate,
    syncCRMEntities,
    validateFolderStructure,
    loading,
    syncing,
  };
}
