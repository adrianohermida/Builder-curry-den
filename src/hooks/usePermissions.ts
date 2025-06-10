/**
 * 🔐 SISTEMA DE PERMISSÕES - VERSÃO COMPATÍVEL
 *
 * Hook simples para verificação de permissões
 */

import { useMemo } from "react";

// Mock para evitar erro circular
const mockUser = {
  id: "admin",
  nome: "Administrador",
  email: "admin@lawdesk.com",
  perfil: "administrador" as const,
  configuracoes: {
    tema: "claro" as const,
    idioma: "pt-BR" as const,
    notificacoes: true,
    timezone: "America/Sao_Paulo",
  },
  permissoes: ["admin.sistema"],
};

// Tipos de permissões simplificados
export type Permission = string;

// Perfis simplificados
const PERFIS_PERMISSOES: Record<string, Permission[]> = {
  administrador: ["admin.sistema", "admin.usuarios"],
  advogado: ["crm.visualizar", "crm.editar"],
  estagiario: ["crm.visualizar"],
  cliente: ["portal.visualizar"],
};

// Hook principal simplificado
export const usePermissions = () => {
  const user = useMemo(() => mockUser, []);

  const hasPermission = (permission: Permission): boolean => {
    if (user.perfil === "administrador") return true;
    return user.permissoes.includes(permission);
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every((permission) => hasPermission(permission));
  };

  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some((permission) => hasPermission(permission));
  };

  return {
    user,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
  };
};

// Funções auxiliares simples
export const useModulePermissions = (module: string) => {
  const { hasPermission } = usePermissions();
  return {
    canAccess: hasPermission(`${module}.visualizar`),
  };
};
