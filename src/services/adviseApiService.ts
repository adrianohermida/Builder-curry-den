/**
 * ADVISE API MOCK SERVICE
 * Simulates integration with Brazilian legal API
 * Used during onboarding to fetch lawyer and process data
 */

// ===== TYPES =====
export interface LawyerProfile {
  name: string;
  oab: string;
  state: string;
  status: "Ativo" | "Inativo" | "Suspenso";
  specialty: string;
  inscription_date: string;
  email?: string;
  phone?: string;
}

export interface LegalProcess {
  number: string;
  court: string;
  judge: string;
  status: "Em andamento" | "Julgado" | "Suspenso" | "Arquivado";
  subject: string;
  value?: number;
  start_date: string;
  last_update: string;
  parties: {
    plaintiff: string[];
    defendant: string[];
    lawyers: string[];
  };
}

export interface Publication {
  id: string;
  process_number: string;
  court: string;
  date: string;
  content: string;
  type: "Citação" | "Intimação" | "Sentença" | "Despacho" | "Outras";
  deadline?: string;
  status: "Pendente" | "Visualizada" | "Processada";
}

export interface AdviseApiResponse {
  lawyer: LawyerProfile;
  processes: LegalProcess[];
  publications: Publication[];
  summary: {
    total_processes: number;
    active_processes: number;
    pending_publications: number;
    next_deadlines: number;
  };
}

// ===== MOCK DATA GENERATOR =====
const generateMockLawyer = (
  name: string,
  oab: string,
  state: string,
): LawyerProfile => {
  return {
    name,
    oab: `${oab}/${state}`,
    state,
    status: "Ativo",
    specialty: "Direito Civil, Direito Empresarial, Direito Trabalhista",
    inscription_date: "2015-03-15",
    email: `${name.toLowerCase().replace(/\s+/g, ".")}@email.com`,
    phone: "(11) 99999-9999",
  };
};

const generateMockProcesses = (count: number = 5): LegalProcess[] => {
  const courts = [
    "TJSP - 1ª Vara Cível",
    "TJSP - 2ª Vara Empresarial",
    "TJRJ - 3ª Vara de Família",
    "TST - 1ª Turma",
    "STJ - 3ª Turma",
  ];

  const subjects = [
    "Ação de Cobrança",
    "Dissolução de Sociedade",
    "Divórcio Consensual",
    "Reclamação Trabalhista",
    "Recurso Especial",
  ];

  const processes: LegalProcess[] = [];

  for (let i = 0; i < count; i++) {
    const processNumber = `${String(Math.floor(Math.random() * 9999999)).padStart(7, "0")}-${String(Math.floor(Math.random() * 99)).padStart(2, "0")}.2023.8.26.${String(Math.floor(Math.random() * 9999)).padStart(4, "0")}`;

    processes.push({
      number: processNumber,
      court: courts[i % courts.length],
      judge: `Dr. João Silva ${i + 1}`,
      status: ["Em andamento", "Julgado", "Suspenso"][
        Math.floor(Math.random() * 3)
      ] as any,
      subject: subjects[i % subjects.length],
      value: Math.floor(Math.random() * 100000) + 10000,
      start_date: `2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
      last_update: `2023-12-${String(Math.floor(Math.random() * 20) + 1).padStart(2, "0")}`,
      parties: {
        plaintiff: [`Autor ${i + 1} Ltda.`],
        defendant: [`Réu ${i + 1} S.A.`],
        lawyers: [`Advogado ${i + 1}`],
      },
    });
  }

  return processes;
};

const generateMockPublications = (processes: LegalProcess[]): Publication[] => {
  const publications: Publication[] = [];
  const types = [
    "Citação",
    "Intimação",
    "Sentença",
    "Despacho",
    "Outras",
  ] as const;

  processes.forEach((process, index) => {
    // Generate 1-3 publications per process
    const pubCount = Math.floor(Math.random() * 3) + 1;

    for (let i = 0; i < pubCount; i++) {
      publications.push({
        id: `pub-${process.number}-${i}`,
        process_number: process.number,
        court: process.court,
        date: `2023-12-${String(Math.floor(Math.random() * 20) + 1).padStart(2, "0")}`,
        content: `Publicação referente ao processo ${process.number}. ${types[i % types.length]} para comparecimento em audiência marcada para o dia 15/01/2024.`,
        type: types[i % types.length],
        deadline:
          i === 0
            ? `2024-01-${String(Math.floor(Math.random() * 15) + 15).padStart(2, "0")}`
            : undefined,
        status: ["Pendente", "Visualizada"][
          Math.floor(Math.random() * 2)
        ] as any,
      });
    }
  });

  return publications;
};

// ===== API SERVICE =====
export class AdviseApiService {
  private static readonly BASE_URL = "https://api.advise.com.br/v1";
  private static readonly API_TOKEN = "mock-token-lawdesk-integration";

  /**
   * Search lawyer profile by OAB number and state
   */
  static async searchLawyerByOAB(
    oabNumber: string,
    state: string,
    userName?: string,
  ): Promise<AdviseApiResponse> {
    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1500 + Math.random() * 1000),
    );

    // Simulate 90% success rate
    if (Math.random() < 0.1) {
      throw new Error("OAB não encontrada ou inválida");
    }

    const lawyer = generateMockLawyer(
      userName || "Advogado Teste",
      oabNumber,
      state,
    );
    const processes = generateMockProcesses(Math.floor(Math.random() * 8) + 3);
    const publications = generateMockPublications(processes);

    const response: AdviseApiResponse = {
      lawyer,
      processes,
      publications,
      summary: {
        total_processes: processes.length,
        active_processes: processes.filter((p) => p.status === "Em andamento")
          .length,
        pending_publications: publications.filter(
          (p) => p.status === "Pendente",
        ).length,
        next_deadlines: publications.filter((p) => p.deadline).length,
      },
    };

    return response;
  }

  /**
   * Setup publication monitoring for specific names and processes
   */
  static async setupPublicationAlerts(
    monitoredNames: string[],
    monitoredProcesses: string[],
  ): Promise<{ success: boolean; message: string; alert_id: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate 95% success rate
    if (Math.random() < 0.05) {
      throw new Error("Erro ao configurar alertas. Tente novamente.");
    }

    return {
      success: true,
      message: `Monitoramento configurado para ${monitoredNames.length} nomes e ${monitoredProcesses.length} processos. Alertas serão ativados em até 48 horas.`,
      alert_id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  /**
   * Send team invitations
   */
  static async sendTeamInvitations(
    teamMembers: Array<{ email: string; name: string; role: string }>,
  ): Promise<{ success: boolean; sent_count: number; failed: string[] }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate some failures for invalid emails
    const failed = teamMembers
      .filter((member) => !member.email.includes("@"))
      .map((member) => member.email);

    const sent_count = teamMembers.length - failed.length;

    return {
      success: sent_count > 0,
      sent_count,
      failed,
    };
  }

  /**
   * Create user account
   */
  static async createAccount(accountData: {
    name: string;
    email: string;
    phone: string;
    document: string;
    password: string;
    account_type: string;
  }): Promise<{ success: boolean; user_id: string; message: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Simulate 98% success rate
    if (Math.random() < 0.02) {
      throw new Error("E-mail já cadastrado no sistema");
    }

    return {
      success: true,
      user_id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      message: "Conta criada com sucesso! Verificação de e-mail enviada.",
    };
  }

  /**
   * Validate CPF/CNPJ format (basic validation)
   */
  static validateDocument(document: string): boolean {
    const cleaned = document.replace(/[^\d]/g, "");

    // CPF: 11 digits
    if (cleaned.length === 11) {
      return true; // Simplified validation
    }

    // CNPJ: 14 digits
    if (cleaned.length === 14) {
      return true; // Simplified validation
    }

    return false;
  }

  /**
   * Format document for display
   */
  static formatDocument(document: string): string {
    const cleaned = document.replace(/[^\d]/g, "");

    if (cleaned.length === 11) {
      // CPF format: 000.000.000-00
      return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    if (cleaned.length === 14) {
      // CNPJ format: 00.000.000/0000-00
      return cleaned.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5",
      );
    }

    return document;
  }

  /**
   * Get setup progress summary
   */
  static getSetupSummary(onboardingData: any): {
    completed_steps: number;
    total_steps: number;
    estimated_time_saved: string;
    ready_for_use: boolean;
  } {
    let completed = 0;
    const total = 6;

    if (onboardingData.name && onboardingData.email) completed++;
    if (onboardingData.foundProfile || onboardingData.skipAutomation)
      completed++;
    if (onboardingData.legalProfile) completed++;
    if (onboardingData.enableAlerts !== undefined) completed++;
    if (onboardingData.teamMembers !== undefined) completed++;
    if (onboardingData.tourCompleted !== undefined) completed++;

    return {
      completed_steps: completed,
      total_steps: total,
      estimated_time_saved: "2-3 horas por semana",
      ready_for_use: completed >= 4, // Minimum for basic usage
    };
  }
}

export default AdviseApiService;
