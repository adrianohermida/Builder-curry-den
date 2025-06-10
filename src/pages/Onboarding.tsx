/**
 * LAWDESK INTELLIGENT ONBOARDING
 * Smart setup flow for new accounts and 7-day trials
 * Target: < 3 minutes activation time
 */

import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  Users,
  FileText,
  Bell,
  Settings,
  Zap,
  Shield,
  Clock,
  Mail,
  Phone,
  User,
  Building,
  Search,
  AlertCircle,
  CheckCircle,
  Loader,
} from "lucide-react";
import { ultimateDesignSystem } from "@/lib/ultimateDesignSystem";
import { performanceUtils } from "@/lib/performanceUtils";
import Card from "@/components/ui/OptimizedCard";
import Button from "@/components/ui/OptimizedButton";
import Input from "@/components/ui/OptimizedInput";

// ===== TYPES =====
interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  component: React.ComponentType<OnboardingStepProps>;
}

interface OnboardingStepProps {
  onNext: (data?: any) => void;
  onPrev: () => void;
  data: OnboardingData;
  updateData: (updates: Partial<OnboardingData>) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

interface OnboardingData {
  // Step 1 - Account Creation
  name: string;
  email: string;
  phone: string;
  document: string; // CPF/CNPJ
  accountType: "individual" | "firm";
  password: string;

  // Step 2 - OAB Search
  oabNumber: string;
  oabState: string;
  skipAutomation: boolean;

  // Step 3 - Profile Confirmation
  foundProfile: any;
  confirmedProfile: any;
  legalProfile: "advogado" | "parte" | "procurador" | "empresa";

  // Step 4 - Publication Alerts
  enableAlerts: boolean;
  monitoredNames: string[];
  monitoredProcesses: string[];

  // Step 5 - Team Invites
  teamMembers: Array<{
    email: string;
    role: "admin" | "user" | "viewer";
    name: string;
  }>;

  // Step 6 - Complete
  tourCompleted: boolean;
}

// ===== CONSTANTS =====
const MOTIVATIONAL_MESSAGES = [
  "Estamos configurando tudo para você em segundos...",
  "Seu escritório digital começa agora!",
  "Vamos te ajudar a ganhar tempo e evitar prejuízos com prazos!",
  "Conectando com a API Advise para buscar seus processos...",
  "Configurando alertas de publicações...",
  "Quase pronto! Preparando seu dashboard personalizado...",
];

const BRAZILIAN_STATES = [
  { code: "AC", name: "Acre" },
  { code: "AL", name: "Alagoas" },
  { code: "AP", name: "Amapá" },
  { code: "AM", name: "Amazonas" },
  { code: "BA", name: "Bahia" },
  { code: "CE", name: "Ceará" },
  { code: "DF", name: "Distrito Federal" },
  { code: "ES", name: "Espírito Santo" },
  { code: "GO", name: "Goiás" },
  { code: "MA", name: "Maranhão" },
  { code: "MT", name: "Mato Grosso" },
  { code: "MS", name: "Mato Grosso do Sul" },
  { code: "MG", name: "Minas Gerais" },
  { code: "PA", name: "Pará" },
  { code: "PB", name: "Paraíba" },
  { code: "PR", name: "Paraná" },
  { code: "PE", name: "Pernambuco" },
  { code: "PI", name: "Piauí" },
  { code: "RJ", name: "Rio de Janeiro" },
  { code: "RN", name: "Rio Grande do Norte" },
  { code: "RS", name: "Rio Grande do Sul" },
  { code: "RO", name: "Rondônia" },
  { code: "RR", name: "Roraima" },
  { code: "SC", name: "Santa Catarina" },
  { code: "SP", name: "São Paulo" },
  { code: "SE", name: "Sergipe" },
  { code: "TO", name: "Tocantins" },
];

// ===== STEP COMPONENTS =====

// Step 1: Account Creation
const AccountCreationStep: React.FC<OnboardingStepProps> = ({
  onNext,
  data,
  updateData,
  isLoading,
  setLoading,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!data.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!data.email.trim()) newErrors.email = "E-mail é obrigatório";
    if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = "E-mail inválido";
    if (!data.phone.trim()) newErrors.phone = "Telefone é obrigatório";
    if (!data.document.trim()) newErrors.document = "CPF/CNPJ é obrigatório";
    if (!data.password || data.password.length < 6) {
      newErrors.password = "Senha deve ter pelo menos 6 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [data]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Simulate account creation
      await new Promise((resolve) => setTimeout(resolve, 1500));
      onNext();
    } catch (error) {
      console.error("Account creation error:", error);
    } finally {
      setLoading(false);
    }
  }, [validateForm, setLoading, onNext]);

  const handleGoogleLogin = useCallback(() => {
    // Implement Google OAuth login
    console.log("Google login triggered");
  }, []);

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <User
          size={64}
          style={{
            color: "var(--primary-500)",
            margin: "0 auto 1rem",
            display: "block",
          }}
        />
        <h2 style={{ margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
          Crie sua conta gratuita
        </h2>
        <p style={{ color: "var(--text-secondary)", margin: 0 }}>
          Comece seu teste gratuito de 7 dias
        </p>
      </div>

      <Card padding="lg">
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <Input
            label="Nome completo"
            placeholder="Seu nome"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            error={errors.name}
            required
          />
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            error={errors.email}
            required
          />
          <Input
            label="Telefone"
            placeholder="(11) 99999-9999"
            value={data.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
            error={errors.phone}
            required
          />
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <Input
            label="CPF/CNPJ"
            placeholder="000.000.000-00"
            value={data.document}
            onChange={(e) => updateData({ document: e.target.value })}
            error={errors.document}
            required
          />
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "var(--text-primary)",
                marginBottom: "0.5rem",
              }}
            >
              Tipo de conta
            </label>
            <select
              value={data.accountType}
              onChange={(e) =>
                updateData({
                  accountType: e.target.value as "individual" | "firm",
                })
              }
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                border: "1px solid var(--border-primary)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--surface-primary)",
                color: "var(--text-primary)",
                fontSize: "0.875rem",
              }}
            >
              <option value="individual">Advogado Individual</option>
              <option value="firm">Escritório/Empresa</option>
            </select>
          </div>
        </div>

        <Input
          label="Senha"
          type="password"
          placeholder="Mínimo 6 caracteres"
          value={data.password}
          onChange={(e) => updateData({ password: e.target.value })}
          error={errors.password}
          showPasswordToggle
          required
        />

        <div
          style={{
            display: "flex",
            gap: "1rem",
            marginTop: "2rem",
            flexDirection: "column",
          }}
        >
          <Button
            variant="primary"
            fullWidth
            onClick={handleSubmit}
            loading={isLoading}
            icon={ChevronRight}
            iconPosition="right"
          >
            Criar conta e continuar
          </Button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              margin: "1rem 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "var(--border-primary)",
              }}
            />
            <span
              style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}
            >
              ou
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                backgroundColor: "var(--border-primary)",
              }}
            />
          </div>

          <Button
            variant="secondary"
            fullWidth
            onClick={handleGoogleLogin}
            icon={() => (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
          >
            Continuar com Google
          </Button>
        </div>

        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-secondary)",
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          Ao criar uma conta, você concorda com nossos{" "}
          <a href="#" style={{ color: "var(--primary-500)" }}>
            Termos de Uso
          </a>{" "}
          e{" "}
          <a href="#" style={{ color: "var(--primary-500)" }}>
            Política de Privacidade
          </a>
        </p>
      </Card>
    </div>
  );
};

// Step 2: OAB Search
const OABSearchStep: React.FC<OnboardingStepProps> = ({
  onNext,
  onPrev,
  data,
  updateData,
  isLoading,
  setLoading,
}) => {
  const [searchResults, setSearchResults] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSearch = useCallback(async () => {
    if (!data.oabNumber || !data.oabState) {
      setErrors({
        oab: "Número da OAB e UF são obrigatórios",
      });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Simulate Advise API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockResults = {
        lawyer: {
          name: data.name,
          oab: `${data.oabNumber}/${data.oabState}`,
          status: "Ativo",
          specialty: "Direito Civil, Direito Empresarial",
        },
        processes: [
          {
            number: "1234567-89.2023.8.26.0001",
            court: "TJSP - 1ª Vara Cível",
            status: "Em andamento",
            lastUpdate: "15/12/2023",
          },
          {
            number: "9876543-21.2023.8.26.0002",
            court: "TJSP - 2ª Vara Empresarial",
            status: "Julgado",
            lastUpdate: "10/12/2023",
          },
        ],
        publications: 12,
        alerts: 5,
      };

      setSearchResults(mockResults);
      updateData({ foundProfile: mockResults });
    } catch (error) {
      setErrors({
        api: "Erro ao consultar API Advise. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }, [data.oabNumber, data.oabState, data.name, setLoading, updateData]);

  const handleContinue = useCallback(() => {
    if (data.skipAutomation || searchResults) {
      onNext();
    }
  }, [data.skipAutomation, searchResults, onNext]);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Search
          size={64}
          style={{
            color: "var(--primary-500)",
            margin: "0 auto 1rem",
            display: "block",
          }}
        />
        <h2 style={{ margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
          Buscar processos automaticamente
        </h2>
        <p style={{ color: "var(--text-secondary)", margin: 0 }}>
          Informe sua OAB para encontrarmos seus processos na API Advise
        </p>
      </div>

      <Card padding="lg">
        <div
          style={{
            backgroundColor: "var(--surface-secondary)",
            padding: "1rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "0.5rem",
            }}
          >
            <Zap size={20} style={{ color: "var(--primary-500)" }} />
            <strong style={{ color: "var(--text-primary)" }}>
              Vantagens da automação:
            </strong>
          </div>
          <ul
            style={{
              margin: 0,
              paddingLeft: "1.5rem",
              color: "var(--text-secondary)",
            }}
          >
            <li>Velocidade: Encontre todos os processos em segundos</li>
            <li>Centralização: Todos os dados em um só lugar</li>
            <li>Alertas: Receba notificações automáticas de publicações</li>
          </ul>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem" }}>
          <Input
            label="Número da OAB"
            placeholder="123456"
            value={data.oabNumber}
            onChange={(e) => updateData({ oabNumber: e.target.value })}
            error={errors.oab}
          />
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: "block",
                fontSize: "0.875rem",
                fontWeight: "500",
                color: "var(--text-primary)",
                marginBottom: "0.5rem",
              }}
            >
              UF
            </label>
            <select
              value={data.oabState}
              onChange={(e) => updateData({ oabState: e.target.value })}
              style={{
                width: "100%",
                padding: "0.5rem 1rem",
                border: "1px solid var(--border-primary)",
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--surface-primary)",
                color: "var(--text-primary)",
                fontSize: "0.875rem",
              }}
            >
              <option value="">Selecione</option>
              {BRAZILIAN_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.code} - {state.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {errors.api && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "1rem",
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              borderRadius: "var(--radius-md)",
              marginBottom: "1rem",
            }}
          >
            <AlertCircle size={20} style={{ color: "var(--color-error)" }} />
            <span style={{ color: "var(--color-error)" }}>{errors.api}</span>
          </div>
        )}

        {searchResults && (
          <div
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              padding: "1rem",
              borderRadius: "var(--radius-md)",
              marginBottom: "1.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <CheckCircle
                size={20}
                style={{ color: "var(--color-success)" }}
              />
              <strong style={{ color: "var(--color-success)" }}>
                Perfil encontrado!
              </strong>
            </div>
            <div style={{ display: "grid", gap: "0.5rem" }}>
              <p style={{ margin: 0, color: "var(--text-primary)" }}>
                <strong>Advogado:</strong> {searchResults.lawyer.name}
              </p>
              <p style={{ margin: 0, color: "var(--text-primary)" }}>
                <strong>OAB:</strong> {searchResults.lawyer.oab} (
                {searchResults.lawyer.status})
              </p>
              <p style={{ margin: 0, color: "var(--text-primary)" }}>
                <strong>Processos encontrados:</strong>{" "}
                {searchResults.processes.length}
              </p>
              <p style={{ margin: 0, color: "var(--text-primary)" }}>
                <strong>Publicações pendentes:</strong>{" "}
                {searchResults.publications}
              </p>
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <Button
            variant="secondary"
            onClick={onPrev}
            icon={ChevronLeft}
            iconPosition="left"
          >
            Voltar
          </Button>

          <div style={{ flex: 1, display: "flex", gap: "1rem" }}>
            <Button
              variant="primary"
              onClick={handleSearch}
              loading={isLoading}
              icon={Search}
              iconPosition="left"
              style={{ flex: 1 }}
            >
              Consultar automaticamente
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                updateData({ skipAutomation: true });
                onNext();
              }}
              style={{ flex: 1 }}
            >
              Pular e configurar manualmente
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Step 3: Profile Confirmation
const ProfileConfirmationStep: React.FC<OnboardingStepProps> = ({
  onNext,
  onPrev,
  data,
  updateData,
}) => {
  const [selectedProfile, setSelectedProfile] = useState<string>(
    data.legalProfile || "advogado",
  );

  const handleConfirm = useCallback(() => {
    updateData({
      legalProfile: selectedProfile as any,
      confirmedProfile: data.foundProfile,
    });
    onNext();
  }, [selectedProfile, data.foundProfile, updateData, onNext]);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <CheckCircle
          size={64}
          style={{
            color: "var(--color-success)",
            margin: "0 auto 1rem",
            display: "block",
          }}
        />
        <h2 style={{ margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
          Confirmar informações
        </h2>
        <p style={{ color: "var(--text-secondary)", margin: 0 }}>
          Verifique se os dados encontrados estão corretos
        </p>
      </div>

      <Card padding="lg">
        {data.foundProfile ? (
          <div>
            <h3 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>
              Dados encontrados na OAB:
            </h3>

            <div
              style={{
                backgroundColor: "var(--surface-secondary)",
                padding: "1rem",
                borderRadius: "var(--radius-md)",
                marginBottom: "2rem",
              }}
            >
              <div style={{ display: "grid", gap: "0.5rem" }}>
                <p style={{ margin: 0 }}>
                  <strong>Nome:</strong> {data.foundProfile.lawyer?.name}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>OAB:</strong> {data.foundProfile.lawyer?.oab}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Status:</strong> {data.foundProfile.lawyer?.status}
                </p>
                <p style={{ margin: 0 }}>
                  <strong>Especialidades:</strong>{" "}
                  {data.foundProfile.lawyer?.specialty}
                </p>
              </div>
            </div>

            <h4 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>
              Como você atua principalmente?
            </h4>

            <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
              {[
                {
                  id: "advogado",
                  label: "Advogado",
                  desc: "Represento clientes e clientes",
                },
                {
                  id: "parte",
                  label: "Parte",
                  desc: "Tenho processos em meu nome",
                },
                {
                  id: "procurador",
                  label: "Procurador",
                  desc: "Represento empresas/pessoas",
                },
                {
                  id: "empresa",
                  label: "Empresa",
                  desc: "Gestão jurídica empresarial",
                },
              ].map((option) => (
                <label
                  key={option.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    border: `2px solid ${
                      selectedProfile === option.id
                        ? "var(--primary-500)"
                        : "var(--border-primary)"
                    }`,
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    backgroundColor:
                      selectedProfile === option.id
                        ? "var(--primary-50)"
                        : "var(--surface-primary)",
                    transition: "all var(--duration-normal)",
                  }}
                >
                  <input
                    type="radio"
                    name="profile"
                    value={option.id}
                    checked={selectedProfile === option.id}
                    onChange={(e) => setSelectedProfile(e.target.value)}
                    style={{ margin: 0 }}
                  />
                  <div>
                    <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                      {option.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {option.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <AlertCircle
              size={48}
              style={{ color: "var(--color-warning)", marginBottom: "1rem" }}
            />
            <h3 style={{ marginBottom: "1rem" }}>Configuração manual</h3>
            <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
              Vamos configurar seu perfil manualmente
            </p>

            <div style={{ display: "grid", gap: "1rem", textAlign: "left" }}>
              {[
                {
                  id: "advogado",
                  label: "Advogado",
                  desc: "Represento clientes",
                },
                {
                  id: "parte",
                  label: "Parte",
                  desc: "Tenho processos em meu nome",
                },
                {
                  id: "procurador",
                  label: "Procurador",
                  desc: "Represento empresas/pessoas",
                },
                {
                  id: "empresa",
                  label: "Empresa",
                  desc: "Gestão jurídica empresarial",
                },
              ].map((option) => (
                <label
                  key={option.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    border: `2px solid ${
                      selectedProfile === option.id
                        ? "var(--primary-500)"
                        : "var(--border-primary)"
                    }`,
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    backgroundColor:
                      selectedProfile === option.id
                        ? "var(--primary-50)"
                        : "var(--surface-primary)",
                  }}
                >
                  <input
                    type="radio"
                    name="profile"
                    value={option.id}
                    checked={selectedProfile === option.id}
                    onChange={(e) => setSelectedProfile(e.target.value)}
                    style={{ margin: 0 }}
                  />
                  <div>
                    <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>
                      {option.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {option.desc}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
          <Button
            variant="secondary"
            onClick={onPrev}
            icon={ChevronLeft}
            iconPosition="left"
          >
            Voltar
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            icon={ChevronRight}
            iconPosition="right"
            style={{ flex: 1 }}
          >
            Confirmar e continuar
          </Button>
        </div>
      </Card>
    </div>
  );
};

// Main Onboarding Component
const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    email: "",
    phone: "",
    document: "",
    accountType: "individual",
    password: "",
    oabNumber: "",
    oabState: "",
    skipAutomation: false,
    foundProfile: null,
    confirmedProfile: null,
    legalProfile: "advogado",
    enableAlerts: true,
    monitoredNames: [],
    monitoredProcesses: [],
    teamMembers: [],
    tourCompleted: false,
  });

  const steps: OnboardingStep[] = [
    {
      id: "account",
      title: "Criar Conta",
      description: "Informações básicas e credenciais",
      icon: User,
      component: AccountCreationStep,
    },
    {
      id: "oab-search",
      title: "Buscar Processos",
      description: "Consulta automática na API Advise",
      icon: Search,
      component: OABSearchStep,
    },
    {
      id: "profile",
      title: "Confirmar Perfil",
      description: "Validar dados encontrados",
      icon: CheckCircle,
      component: ProfileConfirmationStep,
    },
    // Add more steps here...
  ];

  const updateData = useCallback((updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const goToNext = useCallback(
    (stepData?: any) => {
      if (stepData) {
        updateData(stepData);
      }
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    },
    [updateData, steps.length],
  );

  const goToPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const CurrentStepComponent = steps[currentStep]?.component;

  // Show loading with motivational messages
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "var(--bg-primary)",
          padding: "2rem",
        }}
      >
        <Loader
          size={64}
          style={{
            color: "var(--primary-500)",
            animation: "spin 1s linear infinite",
            marginBottom: "2rem",
          }}
        />
        <h2 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>
          {MOTIVATIONAL_MESSAGES[currentStep] || MOTIVATIONAL_MESSAGES[0]}
        </h2>
        <div
          style={{
            width: "300px",
            height: "4px",
            backgroundColor: "var(--surface-secondary)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
              height: "100%",
              backgroundColor: "var(--primary-500)",
              transition: "width 0.5s ease",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        padding: "2rem 1rem",
      }}
    >
      {/* Progress Header */}
      <div style={{ maxWidth: "800px", margin: "0 auto 2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2rem",
          }}
        >
          <div>
            <h1 style={{ margin: 0, color: "var(--text-primary)" }}>
              Configuração Inicial
            </h1>
            <p style={{ margin: "0.5rem 0 0", color: "var(--text-secondary)" }}>
              Etapa {currentStep + 1} de {steps.length}
            </p>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "var(--surface-secondary)",
              borderRadius: "var(--radius-lg)",
            }}
          >
            <Clock size={16} />
            <span style={{ fontSize: "0.875rem" }}>~3 minutos</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            marginBottom: "2rem",
          }}
        >
          {steps.map((step, index) => (
            <div
              key={step.id}
              style={{
                flex: 1,
                height: "4px",
                backgroundColor:
                  index <= currentStep
                    ? "var(--primary-500)"
                    : "var(--surface-secondary)",
                borderRadius: "2px",
                transition: "background-color 0.3s ease",
              }}
            />
          ))}
        </div>

        {/* Step Icons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "3rem",
          }}
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={step.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                  opacity: isActive || isCompleted ? 1 : 0.5,
                }}
              >
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: isCompleted
                      ? "var(--color-success)"
                      : isActive
                        ? "var(--primary-500)"
                        : "var(--surface-secondary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color:
                      isCompleted || isActive
                        ? "white"
                        : "var(--text-secondary)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {isCompleted ? <Check size={24} /> : <Icon size={24} />}
                </div>
                <div style={{ textAlign: "center", maxWidth: "120px" }}>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "600",
                      color: "var(--text-primary)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {step.title}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {step.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Step */}
      {CurrentStepComponent && (
        <CurrentStepComponent
          onNext={goToNext}
          onPrev={goToPrev}
          data={data}
          updateData={updateData}
          isLoading={isLoading}
          setLoading={setIsLoading}
        />
      )}
    </div>
  );
};

export default Onboarding;
