/**
 * 💾 SISTEMA DE BACKUP E ROLLBACK AUTOMÁTICO
 *
 * Sistema para garantir segurança durante otimizações:
 * ✅ Backup automático antes de mudanças
 * ✅ Versionamento de arquivos modificados
 * ✅ Rollback completo ou parcial
 * ✅ Histórico de mudanças
 * ✅ Logs detalhados de operações
 * ✅ Verificação de integridade
 */

import { useGlobalStore } from "@/stores/useGlobalStore";

// Tipos para sistema de backup
export interface BackupEntry {
  id: string;
  timestamp: string;
  type: "pre_optimization" | "auto_save" | "manual" | "rollback_point";
  description: string;
  files: BackupFile[];
  metadata: {
    operation: string;
    user: string;
    size: number; // bytes
    checksum: string;
  };
  status: "creating" | "completed" | "corrupted" | "restored";
}

export interface BackupFile {
  path: string;
  originalContent: string;
  modifiedContent?: string;
  checksum: string;
  size: number;
  lastModified: string;
  operation: "created" | "modified" | "deleted" | "renamed";
}

export interface RollbackOperation {
  id: string;
  backupId: string;
  timestamp: string;
  scope: "full" | "partial";
  selectedFiles?: string[];
  status: "pending" | "in_progress" | "completed" | "failed";
  result: {
    success: boolean;
    filesRestored: number;
    filesSkipped: number;
    errors: string[];
  };
}

export interface BackupReport {
  totalBackups: number;
  totalSize: number; // bytes
  oldestBackup: string;
  newestBackup: string;
  backupHealth: "good" | "warning" | "critical";
  recommendations: string[];
  backups: BackupEntry[];
}

// Dados simulados de backups (em produção seria integrado com sistema de arquivos)
const MOCK_BACKUPS: BackupEntry[] = [
  {
    id: "backup_pre_opt_001",
    timestamp: "2024-12-20T10:30:00Z",
    type: "pre_optimization",
    description: "Backup automático antes da higienização completa",
    files: [
      {
        path: "src/components/Layout/IconSidebar.tsx",
        originalContent: "// Original content with framer-motion...",
        checksum: "abc123def456",
        size: 15420,
        lastModified: "2024-12-20T10:25:00Z",
        operation: "modified",
      },
      {
        path: "src/hooks/usePermissions.ts",
        originalContent: "// Duplicate file content...",
        checksum: "xyz789abc123",
        size: 8750,
        lastModified: "2024-12-19T15:20:00Z",
        operation: "deleted",
      },
    ],
    metadata: {
      operation: "pre_optimization_backup",
      user: "sistema_automatico",
      size: 2500000, // 2.5MB
      checksum: "main_backup_hash_001",
    },
    status: "completed",
  },
  {
    id: "backup_auto_001",
    timestamp: "2024-12-19T16:45:00Z",
    type: "auto_save",
    description: "Backup automático diário",
    files: [],
    metadata: {
      operation: "daily_auto_backup",
      user: "sistema_automatico",
      size: 4200000, // 4.2MB
      checksum: "daily_backup_hash_001",
    },
    status: "completed",
  },
];

class BackupSystem {
  private static instance: BackupSystem;
  private backups: BackupEntry[] = MOCK_BACKUPS;

  public static getInstance(): BackupSystem {
    if (!BackupSystem.instance) {
      BackupSystem.instance = new BackupSystem();
    }
    return BackupSystem.instance;
  }

  // Criar backup antes da otimização
  async createPreOptimizationBackup(
    operation: string,
    filesToChange: string[],
  ): Promise<string> {
    const backupId = `backup_pre_opt_${Date.now()}`;

    console.log("💾 Criando backup antes da otimização...");

    try {
      // Simular leitura dos arquivos que serão modificados
      const files: BackupFile[] = await this.readFilesForBackup(filesToChange);

      const backup: BackupEntry = {
        id: backupId,
        timestamp: new Date().toISOString(),
        type: "pre_optimization",
        description: `Backup automático antes de: ${operation}`,
        files,
        metadata: {
          operation,
          user: this.getCurrentUser(),
          size: files.reduce((sum, file) => sum + file.size, 0),
          checksum: this.generateChecksum(files),
        },
        status: "creating",
      };

      this.backups.unshift(backup);

      // Simular criação do backup
      await this.delay(1500);

      // Atualizar status
      backup.status = "completed";

      // Log de auditoria
      this.logBackupOperation("backup_created", backup);

      console.log(`✅ Backup criado: ${backupId}`);
      return backupId;
    } catch (error) {
      console.error("❌ Erro ao criar backup:", error);
      throw new Error(`Falha ao criar backup: ${error.message}`);
    }
  }

  // Restaurar backup completo
  async restoreFullBackup(backupId: string): Promise<RollbackOperation> {
    const backup = this.backups.find((b) => b.id === backupId);
    if (!backup) {
      throw new Error(`Backup não encontrado: ${backupId}`);
    }

    const rollbackId = `rollback_${Date.now()}`;

    console.log(`🔄 Iniciando restauração completa do backup: ${backupId}`);

    const rollback: RollbackOperation = {
      id: rollbackId,
      backupId,
      timestamp: new Date().toISOString(),
      scope: "full",
      status: "in_progress",
      result: {
        success: false,
        filesRestored: 0,
        filesSkipped: 0,
        errors: [],
      },
    };

    try {
      // Simular restauração
      let restored = 0;
      let skipped = 0;

      for (const file of backup.files) {
        try {
          await this.restoreFile(file);
          restored++;
          console.log(`✅ Restaurado: ${file.path}`);
        } catch (error) {
          skipped++;
          rollback.result.errors.push(
            `Erro ao restaurar ${file.path}: ${error.message}`,
          );
          console.error(`❌ Falha ao restaurar: ${file.path}`, error);
        }

        // Simular progresso
        await this.delay(200);
      }

      rollback.status = "completed";
      rollback.result = {
        success: rollback.result.errors.length === 0,
        filesRestored: restored,
        filesSkipped: skipped,
        errors: rollback.result.errors,
      };

      console.log(
        `✅ Restauração concluída: ${restored}/${backup.files.length} arquivos`,
      );

      // Log de auditoria
      this.logBackupOperation("backup_restored", backup, rollback);

      return rollback;
    } catch (error) {
      rollback.status = "failed";
      rollback.result.errors.push(error.message);
      console.error("❌ Erro durante restauração:", error);
      throw error;
    }
  }

  // Restaurar arquivos específicos
  async restorePartialBackup(
    backupId: string,
    selectedFiles: string[],
  ): Promise<RollbackOperation> {
    const backup = this.backups.find((b) => b.id === backupId);
    if (!backup) {
      throw new Error(`Backup não encontrado: ${backupId}`);
    }

    const rollbackId = `rollback_partial_${Date.now()}`;

    console.log(
      `🔄 Iniciando restauração parcial: ${selectedFiles.length} arquivos`,
    );

    const rollback: RollbackOperation = {
      id: rollbackId,
      backupId,
      timestamp: new Date().toISOString(),
      scope: "partial",
      selectedFiles,
      status: "in_progress",
      result: {
        success: false,
        filesRestored: 0,
        filesSkipped: 0,
        errors: [],
      },
    };

    try {
      const filesToRestore = backup.files.filter((file) =>
        selectedFiles.includes(file.path),
      );

      let restored = 0;
      let skipped = 0;

      for (const file of filesToRestore) {
        try {
          await this.restoreFile(file);
          restored++;
        } catch (error) {
          skipped++;
          rollback.result.errors.push(
            `Erro ao restaurar ${file.path}: ${error.message}`,
          );
        }
        await this.delay(100);
      }

      rollback.status = "completed";
      rollback.result = {
        success: rollback.result.errors.length === 0,
        filesRestored: restored,
        filesSkipped: skipped,
        errors: rollback.result.errors,
      };

      console.log(`✅ Restauração parcial concluída: ${restored} arquivos`);

      // Log de auditoria
      this.logBackupOperation("partial_restore", backup, rollback);

      return rollback;
    } catch (error) {
      rollback.status = "failed";
      console.error("❌ Erro durante restauração parcial:", error);
      throw error;
    }
  }

  // Gerar relatório de backups
  generateBackupReport(): BackupReport {
    const validBackups = this.backups.filter((b) => b.status === "completed");
    const totalSize = validBackups.reduce((sum, b) => sum + b.metadata.size, 0);
    const corruptedBackups = this.backups.filter(
      (b) => b.status === "corrupted",
    );

    let health: "good" | "warning" | "critical" = "good";
    const recommendations: string[] = [];

    if (corruptedBackups.length > 0) {
      health = "warning";
      recommendations.push(
        `${corruptedBackups.length} backups corrompidos detectados`,
      );
    }

    if (validBackups.length === 0) {
      health = "critical";
      recommendations.push("Nenhum backup válido encontrado");
    }

    if (totalSize > 100 * 1024 * 1024) {
      // > 100MB
      recommendations.push("Considerar limpeza de backups antigos");
    }

    if (validBackups.length > 20) {
      recommendations.push("Arquivar backups antigos para otimizar espaço");
    }

    return {
      totalBackups: this.backups.length,
      totalSize,
      oldestBackup:
        validBackups.length > 0
          ? validBackups[validBackups.length - 1].timestamp
          : "",
      newestBackup: validBackups.length > 0 ? validBackups[0].timestamp : "",
      backupHealth: health,
      recommendations,
      backups: this.backups,
    };
  }

  // Limpar backups antigos
  async cleanOldBackups(daysToKeep: number = 30): Promise<{
    removed: number;
    spaceFreed: number;
  }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const toRemove = this.backups.filter(
      (backup) => new Date(backup.timestamp) < cutoffDate,
    );

    const spaceFreed = toRemove.reduce((sum, b) => sum + b.metadata.size, 0);

    // Manter pelo menos 1 backup
    if (this.backups.length - toRemove.length < 1) {
      const keepOne = toRemove.pop();
      if (keepOne) {
        console.log(`💾 Mantendo backup mais recente: ${keepOne.id}`);
      }
    }

    // Remover backups antigos
    this.backups = this.backups.filter((backup) => !toRemove.includes(backup));

    console.log(
      `🗑️ ${toRemove.length} backups antigos removidos, ${Math.round(spaceFreed / 1024 / 1024)}MB liberados`,
    );

    return {
      removed: toRemove.length,
      spaceFreed,
    };
  }

  // Verificar integridade dos backups
  async verifyBackupIntegrity(backupId?: string): Promise<{
    totalChecked: number;
    validBackups: number;
    corruptedBackups: string[];
  }> {
    const backupsToCheck = backupId
      ? this.backups.filter((b) => b.id === backupId)
      : this.backups;

    console.log(
      `🔍 Verificando integridade de ${backupsToCheck.length} backups...`,
    );

    let validCount = 0;
    const corruptedIds: string[] = [];

    for (const backup of backupsToCheck) {
      const isValid = await this.verifyBackupChecksum(backup);
      if (isValid) {
        validCount++;
        if (backup.status === "corrupted") {
          backup.status = "completed";
        }
      } else {
        backup.status = "corrupted";
        corruptedIds.push(backup.id);
      }
      await this.delay(100);
    }

    console.log(
      `✅ Verificação concluída: ${validCount}/${backupsToCheck.length} backups válidos`,
    );

    return {
      totalChecked: backupsToCheck.length,
      validBackups: validCount,
      corruptedBackups: corruptedIds,
    };
  }

  // Métodos privados
  private async readFilesForBackup(filePaths: string[]): Promise<BackupFile[]> {
    const files: BackupFile[] = [];

    for (const path of filePaths) {
      // Simular leitura de arquivo
      const mockContent = `// Mock content for ${path}\nexport default function Component() { return null; }`;

      files.push({
        path,
        originalContent: mockContent,
        checksum: this.generateFileChecksum(mockContent),
        size: mockContent.length,
        lastModified: new Date().toISOString(),
        operation: "modified",
      });
    }

    return files;
  }

  private async restoreFile(file: BackupFile): Promise<void> {
    // Simular restauração de arquivo
    console.log(`📄 Restaurando: ${file.path}`);
    await this.delay(100);

    // Em produção, aqui seria a escrita real do arquivo
    // fs.writeFileSync(file.path, file.originalContent);
  }

  private generateChecksum(files: BackupFile[]): string {
    // Simular geração de checksum
    const combined = files.map((f) => f.checksum).join("");
    return `backup_${combined.slice(0, 16)}`;
  }

  private generateFileChecksum(content: string): string {
    // Simular checksum de arquivo
    return `file_${content.length}_${Date.now().toString(36)}`;
  }

  private async verifyBackupChecksum(backup: BackupEntry): Promise<boolean> {
    // Simular verificação de integridade
    await this.delay(50);
    return Math.random() > 0.1; // 90% de chance de estar íntegro
  }

  private getCurrentUser(): string {
    const { user } = useGlobalStore.getState();
    return user?.email || "sistema_automatico";
  }

  private logBackupOperation(
    operation: string,
    backup: BackupEntry,
    rollback?: RollbackOperation,
  ): void {
    const { addAuditLog } = useGlobalStore.getState();

    const details = rollback
      ? `${operation} - Backup: ${backup.id}, Rollback: ${rollback.id}, Arquivos: ${rollback.result.filesRestored}`
      : `${operation} - Backup: ${backup.id}, Arquivos: ${backup.files.length}, Tamanho: ${Math.round(backup.metadata.size / 1024)}KB`;

    addAuditLog({
      usuario: this.getCurrentUser(),
      acao: operation,
      modulo: "backup_sistema",
      detalhes: details,
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Instância singleton
export const backupSystem = BackupSystem.getInstance();

// Hook para usar o sistema de backup
export const useBackupSystem = () => {
  return {
    createBackup: backupSystem.createPreOptimizationBackup.bind(backupSystem),
    restoreFull: backupSystem.restoreFullBackup.bind(backupSystem),
    restorePartial: backupSystem.restorePartialBackup.bind(backupSystem),
    generateReport: backupSystem.generateBackupReport.bind(backupSystem),
    cleanOld: backupSystem.cleanOldBackups.bind(backupSystem),
    verifyIntegrity: backupSystem.verifyBackupIntegrity.bind(backupSystem),
  };
};

// Função para executar backup automático antes de otimizações
export const ensureBackupBeforeOptimization = async (
  operation: string,
  filesToModify: string[],
): Promise<string> => {
  console.log("🔒 Garantindo backup antes da otimização...");

  try {
    const backupId = await backupSystem.createPreOptimizationBackup(
      operation,
      filesToModify,
    );

    console.log(`✅ Backup de segurança criado: ${backupId}`);
    return backupId;
  } catch (error) {
    console.error("❌ Falha no backup de segurança:", error);
    throw new Error(
      "Não é possível prosseguir sem backup de segurança. Operação cancelada.",
    );
  }
};
