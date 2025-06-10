/**
 * 🔐 SISTEMA DE PERMISSÕES GRANULARES
 * 
 * Sistema completo de controle de acesso com:
 * ✅ Permissões por módulo e ação
 * ✅ Perfis hierárquicos
 * ✅ Verificação em tempo real
 * ✅ HOCs para proteção de componentes
 * ✅ Logs de auditoria automáticos
 * ✅ Integração com GOV.BR (futuro)
 */

import { useMemo } from 'react';
import { useGlobalStore } from '@/stores/useGlobalStore';

// Tipos de permissões
export type Permission = 
  // Módulo CRM
  | 'crm.clientes.visualizar'
  | 'crm.clientes.criar'
  | 'crm.clientes.editar'
  | 'crm.clientes.excluir'
  | 'crm.clientes.exportar'
  
  | 'crm.processos.visualizar'
  | 'crm.processos.criar'
  | 'crm.processos.editar'
  | 'crm.processos.excluir'
  | 'crm.processos.compartilhar'
  
  | 'crm.contratos.visualizar'
  | 'crm.contratos.criar'
  | 'crm.contratos.editar'
  | 'crm.contratos.assinar'
  | 'crm.contratos.excluir'
  
  | 'crm.tarefas.visualizar'
  | 'crm.tarefas.criar'
  | 'crm.tarefas.editar'
  | 'crm.tarefas.atribuir'
  | 'crm.tarefas.excluir'
  
  // Módulo Financeiro
  | 'financeiro.visualizar'
  | 'financeiro.criar'
  | 'financeiro.editar'
  | 'financeiro.aprovar'
  | 'financeiro.excluir'
  | 'financeiro.relatorios'
  
  // Módulo Documentos
  | 'documentos.visualizar'
  | 'documentos.upload'
  | 'documentos.download'
  | 'documentos.editar'
  | 'documentos.excluir'
  | 'documentos.compartilhar'
  | 'documentos.historico'
  
  // Módulo Publicações
  | 'publicacoes.visualizar'
  | 'publicacoes.analisar'
  | 'publicacoes.responder'
  | 'publicacoes.arquivar'
  | 'publicacoes.ia'
  
  // Módulo Agenda
  | 'agenda.visualizar'
  | 'agenda.criar'
  | 'agenda.editar'
  | 'agenda.excluir'
  | 'agenda.compartilhar'
  
  // Módulo Atendimento
  | 'atendimento.visualizar'
  | 'atendimento.responder'
  | 'atendimento.transferir'
  | 'atendimento.fechar'
  | 'atendimento.historico'
  
  // Módulo IA
  | 'ia.usar'
  | 'ia.configurar'
  | 'ia.historico'
  | 'ia.creditos'
  
  // Administração
  | 'admin.usuarios.visualizar'
  | 'admin.usuarios.criar'
  | 'admin.usuarios.editar'
  | 'admin.usuarios.excluir'
  | 'admin.configuracoes'
  | 'admin.auditoria'
  | 'admin.sistema'
  | 'admin.integracao'
  
  // Sistema
  | 'sistema.backup'
  | 'sistema.restaurar'
  | 'sistema.logs'
  | 'sistema.monitoramento';

// Perfis de usuário com permissões
export const PERFIS_PERMISSOES: Record<string, Permission[]> = {
  administrador: [
    // Todas as permissões
    'crm.clientes.visualizar', 'crm.clientes.criar', 'crm.clientes.editar', 'crm.clientes.excluir', 'crm.clientes.exportar',
    'crm.processos.visualizar', 'crm.processos.criar', 'crm.processos.editar', 'crm.processos.excluir', 'crm.processos.compartilhar',
    'crm.contratos.visualizar', 'crm.contratos.criar', 'crm.contratos.editar', 'crm.contratos.assinar', 'crm.contratos.excluir',
    'crm.tarefas.visualizar', 'crm.tarefas.criar', 'crm.tarefas.editar', 'crm.tarefas.atribuir', 'crm.tarefas.excluir',
    'financeiro.visualizar', 'financeiro.criar', 'financeiro.editar', 'financeiro.aprovar', 'financeiro.excluir', 'financeiro.relatorios',
    'documentos.visualizar', 'documentos.upload', 'documentos.download', 'documentos.editar', 'documentos.excluir', 'documentos.compartilhar', 'documentos.historico',
    'publicacoes.visualizar', 'publicacoes.analisar', 'publicacoes.responder', 'publicacoes.arquivar', 'publicacoes.ia',
    'agenda.visualizar', 'agenda.criar', 'agenda.editar', 'agenda.excluir', 'agenda.compartilhar',
    'atendimento.visualizar', 'atendimento.responder', 'atendimento.transferir', 'atendimento.fechar', 'atendimento.historico',
    'ia.usar', 'ia.configurar', 'ia.historico', 'ia.creditos',
    'admin.usuarios.visualizar', 'admin.usuarios.criar', 'admin.usuarios.editar', 'admin.usuarios.excluir',
    'admin.configuracoes', 'admin.auditoria', 'admin.sistema', 'admin.integracao',
    'sistema.backup', 'sistema.restaurar', 'sistema.logs', 'sistema.monitoramento'
  ],
  
  advogado: [
    // Permissões completas para trabalho jurídico
    'crm.clientes.visualizar', 'crm.clientes.criar', 'crm.clientes.editar', 'crm.clientes.exportar',
    'crm.processos.visualizar', 'crm.processos.criar', 'crm.processos.editar', 'crm.processos.compartilhar',
    'crm.contratos.visualizar', 'crm.contratos.criar', 'crm.contratos.editar', 'crm.contratos.assinar',
    'crm.tarefas.visualizar', 'crm.tarefas.criar', 'crm.tarefas.editar', 'crm.tarefas.atribuir',
    'financeiro.visualizar', 'financeiro.criar', 'financeiro.editar', 'financeiro.relatorios',
    'documentos.visualizar', 'documentos.upload', 'documentos.download', 'documentos.editar', 'documentos.compartilhar', 'documentos.historico',
    'publicacoes.visualizar', 'publicacoes.analisar', 'publicacoes.responder', 'publicacoes.arquivar', 'publicacoes.ia',
    'agenda.visualizar', 'agenda.criar', 'agenda.editar', 'agenda.excluir', 'agenda.compartilhar',
    'atendimento.visualizar', 'atendimento.responder', 'atendimento.transferir', 'atendimento.fechar', 'atendimento.historico',
    'ia.usar', 'ia.historico'
  ],
  
  estagiario: [
    // Permissões limitadas para estagiários
    'crm.clientes.visualizar',
    'crm.processos.visualizar',
    'crm.contratos.visualizar',
    'crm.tarefas.visualizar', 'crm.tarefas.criar', 'crm.tarefas.editar',
    'financeiro.visualizar',
    'documentos.visualizar', 'documentos.upload', 'documentos.download',
    'publicacoes.visualizar', 'publicacoes.analisar',
    'agenda.visualizar', 'agenda.criar', 'agenda.editar',
    'atendimento.visualizar', 'atendimento.responder',
    'ia.usar'
  ],
  
  cliente: [
    // Permissões básicas para portal do cliente
    'crm.processos.visualizar',
    'crm.contratos.visualizar',
    'documentos.visualizar', 'documentos.download',
    'agenda.visualizar',
    'atendimento.visualizar', 'atendimento.responder'
  ]
};

// Hook principal de permissões
export const usePermissions = () => {
  const user = useGlobalStore((state) => state.user);
  const addAuditLog = useGlobalStore((state) => state.addAuditLog);

  // Calcular permissões do usuário atual
  const userPermissions = useMemo(() => {
    if (!user) return [];
    
    const perfilPermissions = PERFIS_PERMISSOES[user.perfil] || [];
    const customPermissions = user.permissoes || [];
    
    return [...perfilPermissions, ...customPermissions];
  }, [user]);

  // Verificar se tem permissão
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    
    // Administrador sempre tem todas as permissões
    if (user.perfil === 'administrador') return true;
    
    return userPermissions.includes(permission);
  };

  // Verificar múltiplas permissões (AND)
  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every(permission => hasPermission(permission));
  };

  // Verificar se tem pelo menos uma permissão (OR)
  const hasAnyPermission = (permissions: Permission[]): boolean => {
    return permissions.some(permission => hasPermission(permission));
  };

  // Verificar permissão com log de auditoria
  const checkPermission = (permission: Permission, action?: string): boolean => {
    const hasAccess = hasPermission(permission);
    
    // Log de auditoria para tentativas de acesso negado
    if (!hasAccess && user) {
      addAuditLog({
        usuario: user.email,
        acao: 'acesso_negado',
        modulo: 'permissoes',
        detalhes: `Tentativa de acesso negado para: ${permission}${action ? ` - ${action}` : ''}`,
      });
    }
    
    return hasAccess;
  };

  // Obter permissões por módulo
  const getModulePermissions = (module: string) => {
    return userPermissions.filter(permission => permission.startsWith(`${module}.`));
  };

  // Verificar se pode acessar módulo
  const canAccessModule = (module: string): boolean => {
    const modulePermissions = getModulePermissions(module);
    return modulePermissions.length > 0;
  };

  // Obter nível de acesso (read, write, admin)
  const getAccessLevel = (module: string): 'none' | 'read' | 'write' | 'admin' => {
    const permissions = getModulePermissions(module);
    
    if (permissions.length === 0) return 'none';
    
    const hasWrite = permissions.some(p => 
      p.includes('.criar') || p.includes('.editar') || p.includes('.excluir')
    );
    
    const hasAdmin = permissions.some(p => 
      p.includes('.aprovar') || p.includes('.configurar') || p.includes('.administrar')
    );
    
    if (hasAdmin) return 'admin';
    if (hasWrite) return 'write';
    return 'read';
  };

  return {
    user,
    permissions: userPermissions,
    hasPermission,
    hasAllPermissions,
    hasAnyPermission,
    checkPermission,
    getModulePermissions,
    canAccessModule,
    getAccessLevel,
  };
};

// HOC para proteger componentes
export const withPermission = <P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: Permission | Permission[],
  fallback?: React.ComponentType | null
) => {
  return (props: P) => {
    const { hasPermission, hasAllPermissions } = usePermissions();
    
    const hasAccess = Array.isArray(requiredPermission) 
      ? hasAllPermissions(requiredPermission)
      : hasPermission(requiredPermission);
    
    if (!hasAccess) {
      if (fallback) {
        const FallbackComponent = fallback;
        return <FallbackComponent />;
      }
      return (
        <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4 text-gray-400">
              🔒
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Acesso Restrito
            </h3>
            <p className="text-gray-600">
              Você não tem permissão para acessar este recurso.
            </p>
          </div>
        </div>
      );
    }
    
    return <Component {...props} />;
  };
};

// Hook para verificar permissões específicas de módulos
export const useModulePermissions = (module: string) => {
  const { getModulePermissions, getAccessLevel, canAccessModule } = usePermissions();
  
  return {
    permissions: getModulePermissions(module),
    accessLevel: getAccessLevel(module),
    canAccess: canAccessModule(module),
  };
};

// Componente de proteção inline
export const PermissionGuard: React.FC<{
  permission: Permission | Permission[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}> = ({ permission, children, fallback }) => {
  const { hasPermission, hasAllPermissions } = usePermissions();
  
  const hasAccess = Array.isArray(permission) 
    ? hasAllPermissions(permission)
    : hasPermission(permission);
  
  if (!hasAccess) {
    return <>{fallback || null}</>;
  }
  
  return <>{children}</>;
};

// Hook para verificar permissões de escrita
export const useWritePermissions = (module: string) => {
  const { hasPermission } = usePermissions();
  
  return {
    canCreate: hasPermission(`${module}.criar` as Permission),
    canEdit: hasPermission(`${module}.editar` as Permission),
    canDelete: hasPermission(`${module}.excluir` as Permission),
  };
};

// Hook para verificar permissões específicas do cliente
export const useClientPermissions = () => {
  const { user, hasPermission } = usePermissions();
  
  const isClient = user?.perfil === 'cliente';
  
  return {
    isClient,
    canViewOwnProcesses: isClient && hasPermission('crm.processos.visualizar'),
    canViewOwnContracts: isClient && hasPermission('crm.contratos.visualizar'),
    canDownloadDocuments: isClient && hasPermission('documentos.download'),
    canCreateTickets: isClient && hasPermission('atendimento.responder'),
  };
};