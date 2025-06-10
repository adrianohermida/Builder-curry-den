/**
 * 🔐 USER PERMISSIONS HOOK
 *
 * Hook para gerenciar permissões baseadas em roles:
 * - Admin: Acesso total
 * - Advogado: Funcionalidades jurídicas completas
 * - Colaborador: Funcionalidades básicas
 * - Cliente: Acesso limitado
 */

import { useState, useEffect } from "react";

export type UserRole = "admin" | "advogado" | "colaborador" | "cliente";

export interface UserPermissions {
  // Configurações gerais
  "settings.profile": boolean;
  "settings.notifications": boolean;
  "settings.calendar": boolean;
  "settings.documents": boolean;
  "settings.ai": boolean;
  "settings.crm": boolean;
  "settings.integrations": boolean;
  "settings.modules": boolean;

  // Integrações específicas
  "integrations.google.drive": boolean;
  "integrations.google.calendar": boolean;
  "integrations.google.docs": boolean;
  "integrations.google.sheets": boolean;
  "integrations.zapier": boolean;
  "integrations.make": boolean;
  "integrations.rdstation": boolean;
  "integrations.hubspot": boolean;
  "integrations.bitrix24": boolean;
  "integrations.zapsign": boolean;

  // Integrações administrativas (apenas admin)
  "integrations.oab": boolean;
  "integrations.publicacoes": boolean;
  "integrations.stripe": boolean;
  "integrations.freshdesk": boolean;
  "integrations.freshsales": boolean;
  "integrations.freshchat": boolean;

  // Módulos do sistema
  "modules.crm": boolean;
  "modules.processos": boolean;
  "modules.contratos": boolean;
  "modules.tarefas": boolean;
  "modules.financeiro": boolean;
  "modules.documentos": boolean;
  "modules.agenda": boolean;
  "modules.publicacoes": boolean;
  "modules.atendimento": boolean;

  // Funcionalidades avançadas
  "ai.advanced": boolean;
  "crm.customFields": boolean;
  "documents.ocr": boolean;
  "financial.view": boolean;
  "reports.advanced": boolean;
}

const ROLE_PERMISSIONS: Record<UserRole, Partial<UserPermissions>> = {
  admin: {
    // Admin tem acesso a tudo
    "settings.profile": true,
    "settings.notifications": true,
    "settings.calendar": true,
    "settings.documents": true,
    "settings.ai": true,
    "settings.crm": true,
    "settings.integrations": true,
    "settings.modules": true,

    // Todas as integrações
    "integrations.google.drive": true,
    "integrations.google.calendar": true,
    "integrations.google.docs": true,
    "integrations.google.sheets": true,
    "integrations.zapier": true,
    "integrations.make": true,
    "integrations.rdstation": true,
    "integrations.hubspot": true,
    "integrations.bitrix24": true,
    "integrations.zapsign": true,
    "integrations.oab": true,
    "integrations.publicacoes": true,
    "integrations.stripe": true,
    "integrations.freshdesk": true,
    "integrations.freshsales": true,
    "integrations.freshchat": true,

    // Todos os módulos
    "modules.crm": true,
    "modules.processos": true,
    "modules.contratos": true,
    "modules.tarefas": true,
    "modules.financeiro": true,
    "modules.documentos": true,
    "modules.agenda": true,
    "modules.publicacoes": true,
    "modules.atendimento": true,

    // Funcionalidades avançadas
    "ai.advanced": true,
    "crm.customFields": true,
    "documents.ocr": true,
    "financial.view": true,
    "reports.advanced": true,
  },

  advogado: {
    // Advogado: funcionalidades jurídicas completas
    "settings.profile": true,
    "settings.notifications": true,
    "settings.calendar": true,
    "settings.documents": true,
    "settings.ai": true,
    "settings.crm": true,
    "settings.integrations": true,
    "settings.modules": true,

    // Integrações do usuário (não administrativas)
    "integrations.google.drive": true,
    "integrations.google.calendar": true,
    "integrations.google.docs": true,
    "integrations.google.sheets": true,
    "integrations.zapier": true,
    "integrations.make": true,
    "integrations.rdstation": true,
    "integrations.hubspot": true,
    "integrations.bitrix24": true,
    "integrations.zapsign": true,

    // Módulos jurídicos
    "modules.crm": true,
    "modules.processos": true,
    "modules.contratos": true,
    "modules.tarefas": true,
    "modules.documentos": true,
    "modules.agenda": true,
    "modules.publicacoes": true,

    // Funcionalidades avançadas limitadas
    "ai.advanced": true,
    "crm.customFields": true,
    "documents.ocr": true,
    "financial.view": false, // Sem acesso financeiro
  },

  colaborador: {
    // Colaborador: funcionalidades básicas
    "settings.profile": true,
    "settings.notifications": true,
    "settings.calendar": true,
    "settings.documents": true,
    "settings.ai": false, // IA limitada
    "settings.crm": true,
    "settings.integrations": true,
    "settings.modules": false, // Sem configuração de módulos

    // Integrações básicas
    "integrations.google.drive": true,
    "integrations.google.calendar": true,
    "integrations.google.docs": true,
    "integrations.zapier": false,
    "integrations.make": false,

    // Módulos básicos
    "modules.crm": true,
    "modules.tarefas": true,
    "modules.documentos": true,
    "modules.agenda": true,
    "modules.atendimento": true,

    // Funcionalidades limitadas
    "crm.customFields": false,
    "documents.ocr": false,
    "financial.view": false,
  },

  cliente: {
    // Cliente: acesso muito limitado
    "settings.profile": true,
    "settings.notifications": true,
    "settings.calendar": false,
    "settings.documents": false,
    "settings.ai": false,
    "settings.crm": false,
    "settings.integrations": false,
    "settings.modules": false,

    // Apenas visualização básica
    "modules.atendimento": true, // Apenas para ver tickets
  },
};

export function useUserPermissions() {
  const [userRole, setUserRole] = useState<UserRole>("colaborador");
  const [permissions, setPermissions] = useState<UserPermissions>(
    {} as UserPermissions,
  );

  useEffect(() => {
    // TODO: Buscar role do usuário da API/contexto
    // Por enquanto, simulando um colaborador
    const mockUserRole: UserRole = "advogado";

    setUserRole(mockUserRole);

    // Combinar permissões padrão com as específicas do role
    const defaultPermissions: UserPermissions = {
      "settings.profile": false,
      "settings.notifications": false,
      "settings.calendar": false,
      "settings.documents": false,
      "settings.ai": false,
      "settings.crm": false,
      "settings.integrations": false,
      "settings.modules": false,
      "integrations.google.drive": false,
      "integrations.google.calendar": false,
      "integrations.google.docs": false,
      "integrations.google.sheets": false,
      "integrations.zapier": false,
      "integrations.make": false,
      "integrations.rdstation": false,
      "integrations.hubspot": false,
      "integrations.bitrix24": false,
      "integrations.zapsign": false,
      "integrations.oab": false,
      "integrations.publicacoes": false,
      "integrations.stripe": false,
      "integrations.freshdesk": false,
      "integrations.freshsales": false,
      "integrations.freshchat": false,
      "modules.crm": false,
      "modules.processos": false,
      "modules.contratos": false,
      "modules.tarefas": false,
      "modules.financeiro": false,
      "modules.documentos": false,
      "modules.agenda": false,
      "modules.publicacoes": false,
      "modules.atendimento": false,
      "ai.advanced": false,
      "crm.customFields": false,
      "documents.ocr": false,
      "financial.view": false,
      "reports.advanced": false,
    };

    const rolePermissions = ROLE_PERMISSIONS[mockUserRole] || {};

    setPermissions({
      ...defaultPermissions,
      ...rolePermissions,
    });
  }, []);

  const hasPermission = (permission: keyof UserPermissions): boolean => {
    return permissions[permission] === true;
  };

  const hasAnyPermission = (
    permissionsList: (keyof UserPermissions)[],
  ): boolean => {
    return permissionsList.some((permission) => hasPermission(permission));
  };

  const hasAllPermissions = (
    permissionsList: (keyof UserPermissions)[],
  ): boolean => {
    return permissionsList.every((permission) => hasPermission(permission));
  };

  const getAvailableIntegrations = () => {
    const integrationKeys = Object.keys(permissions).filter((key) =>
      key.startsWith("integrations."),
    ) as (keyof UserPermissions)[];

    return integrationKeys
      .filter((key) => permissions[key])
      .map((key) => ({
        key,
        name: key.replace("integrations.", "").replace(".", " "),
        enabled: permissions[key],
      }));
  };

  const getAvailableModules = () => {
    const moduleKeys = Object.keys(permissions).filter((key) =>
      key.startsWith("modules."),
    ) as (keyof UserPermissions)[];

    return moduleKeys
      .filter((key) => permissions[key])
      .map((key) => ({
        key,
        name: key.replace("modules.", ""),
        enabled: permissions[key],
      }));
  };

  return {
    userRole,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    getAvailableIntegrations,
    getAvailableModules,
    isAdmin: userRole === "admin",
    isAdvogado: userRole === "advogado",
    isColaborador: userRole === "colaborador",
    isCliente: userRole === "cliente",
  };
}

export default useUserPermissions;
