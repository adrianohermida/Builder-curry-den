/**
 * DASHBOARD TOUR STEP
 * Step 6: Show personalized dashboard with interactive guided tour
 */

import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Rocket,
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  CheckSquare,
  Briefcase,
  Bell,
  Play,
  SkipForward,
  ArrowRight,
  Star,
  Zap,
} from "lucide-react";
import Card from "@/components/ui/OptimizedCard";
import Button from "@/components/ui/OptimizedButton";

// ===== TYPES =====
interface OnboardingStepProps {
  onNext: (data?: any) => void;
  onPrev: () => void;
  data: any;
  updateData: (updates: any) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

interface TourStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number }>;
  route: string;
  features: string[];
}

// ===== TOUR STEPS =====
const TOUR_STEPS: TourStep[] = [
  {
    id: "dashboard",
    title: "Painel de Controle",
    description: "Visão geral completa do seu escritório",
    icon: LayoutDashboard,
    route: "/painel",
    features: [
      "Resumo de casos e processos",
      "Agenda do dia",
      "Publicações pendentes",
      "Indicadores financeiros",
    ],
  },
  {
    id: "crm",
    title: "CRM Jurídico",
    description: "Gestão completa de clientes e processos",
    icon: Users,
    route: "/crm-modern",
    features: [
      "Cadastro de clientes",
      "Acompanhamento de processos",
      "Histórico de interações",
      "Relatórios detalhados",
    ],
  },
  {
    id: "agenda",
    title: "Agenda",
    description: "Calendário integrado com prazos automáticos",
    icon: Calendar,
    route: "/agenda",
    features: [
      "Compromissos e reuniões",
      "Prazos processuais",
      "Lembretes automáticos",
      "Sincronização com Google Calendar",
    ],
  },
  {
    id: "publicacoes",
    title: "Publicações",
    description: "Monitoramento automático de diários oficiais",
    icon: Bell,
    route: "/publicacoes",
    features: [
      "Alertas em tempo real",
      "Filtros inteligentes",
      "Histórico completo",
      "Análise de prazos",
    ],
  },
  {
    id: "tarefas",
    title: "Tarefas",
    description: "Organização e produtividade da equipe",
    icon: CheckSquare,
    route: "/tarefas",
    features: [
      "Gestão de tarefas",
      "Colaboração em equipe",
      "Controle de tempo",
      "Relatórios de produtividade",
    ],
  },
  {
    id: "contratos",
    title: "Contratos",
    description: "Gestão completa de contratos e documentos",
    icon: Briefcase,
    route: "/contratos",
    features: [
      "Biblioteca de modelos",
      "Assinatura digital",
      "Controle de versões",
      "Alertas de vencimento",
    ],
  },
];

// ===== COMPONENT =====
const DashboardTourStep: React.FC<OnboardingStepProps> = ({
  data,
  updateData,
  setLoading,
}) => {
  const navigate = useNavigate();
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [isViewingTour, setIsViewingTour] = useState(false);

  // ===== HANDLERS =====
  const startTour = useCallback(() => {
    setIsViewingTour(true);
  }, []);

  const skipTour = useCallback(() => {
    updateData({ tourCompleted: false });
    navigate("/painel");
  }, [updateData, navigate]);

  const completeTour = useCallback(() => {
    updateData({ tourCompleted: true });
    navigate("/painel");
  }, [updateData, navigate]);

  const goToModule = useCallback((route: string) => {
    // This would normally navigate to the module
    // For now, we'll just show it in the tour
    console.log(`Navigating to: ${route}`);
  }, []);

  const nextTourStep = useCallback(() => {
    if (currentTourStep < TOUR_STEPS.length - 1) {
      setCurrentTourStep((prev) => prev + 1);
    } else {
      completeTour();
    }
  }, [currentTourStep, completeTour]);

  const prevTourStep = useCallback(() => {
    setCurrentTourStep((prev) => Math.max(prev - 1, 0));
  }, []);

  // ===== SUCCESS SUMMARY =====
  const getSetupSummary = useCallback(() => {
    const summary = {
      profileConfigured: Boolean(data.confirmedProfile || data.legalProfile),
      alertsConfigured: data.enableAlerts && data.monitoredNames?.length > 0,
      teamInvited: data.teamMembers?.length > 0,
      processesFound: data.foundProfile?.processes?.length || 0,
      estimatedTimeValue: "2-3 horas por semana economizadas",
    };

    return summary;
  }, [data]);

  const summary = getSetupSummary();

  if (isViewingTour) {
    const currentStep = TOUR_STEPS[currentTourStep];

    return (
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "var(--primary-50)",
              color: "var(--primary-600)",
              borderRadius: "var(--radius-lg)",
              fontSize: "0.875rem",
              fontWeight: "500",
              marginBottom: "1rem",
            }}
          >
            <Play size={16} />
            Tour Guiado - {currentTourStep + 1} de {TOUR_STEPS.length}
          </div>
          <h2 style={{ margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
            {currentStep.title}
          </h2>
          <p style={{ color: "var(--text-secondary)", margin: 0 }}>
            {currentStep.description}
          </p>
        </div>

        <Card padding="lg">
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <currentStep.icon
              size={80}
              style={{
                color: "var(--primary-500)",
                margin: "0 auto 1rem",
                display: "block",
              }}
            />
          </div>

          <div
            style={{
              backgroundColor: "var(--surface-secondary)",
              padding: "2rem",
              borderRadius: "var(--radius-lg)",
              marginBottom: "2rem",
            }}
          >
            <h3
              style={{
                margin: "0 0 1rem",
                color: "var(--text-primary)",
                textAlign: "center",
              }}
            >
              Principais recursos:
            </h3>
            <div style={{ display: "grid", gap: "0.75rem" }}>
              {currentStep.features.map((feature, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: "var(--primary-500)",
                    }}
                  />
                  <span style={{ color: "var(--text-primary)" }}>
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Button
              variant="secondary"
              onClick={prevTourStep}
              disabled={currentTourStep === 0}
            >
              Anterior
            </Button>

            <div style={{ flex: 1, textAlign: "center" }}>
              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "center",
                }}
              >
                {TOUR_STEPS.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor:
                        index <= currentTourStep
                          ? "var(--primary-500)"
                          : "var(--surface-secondary)",
                      transition: "background-color 0.3s ease",
                    }}
                  />
                ))}
              </div>
            </div>

            <Button
              variant="primary"
              onClick={nextTourStep}
              icon={
                currentTourStep === TOUR_STEPS.length - 1
                  ? CheckCircle
                  : ArrowRight
              }
              iconPosition="right"
            >
              {currentTourStep === TOUR_STEPS.length - 1
                ? "Finalizar"
                : "Próximo"}
            </Button>
          </div>

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Button variant="ghost" onClick={skipTour}>
              Pular tour
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Rocket
          size={64}
          style={{
            color: "var(--color-success)",
            margin: "0 auto 1rem",
            display: "block",
          }}
        />
        <h2 style={{ margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
          🎉 Parabéns! Configuração concluída
        </h2>
        <p style={{ color: "var(--text-secondary)", margin: 0 }}>
          Seu escritório digital está pronto para uso!
        </p>
      </div>

      <Card padding="lg">
        {/* Success Summary */}
        <div
          style={{
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            padding: "2rem",
            borderRadius: "var(--radius-lg)",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          <CheckCircle
            size={48}
            style={{ color: "var(--color-success)", marginBottom: "1rem" }}
          />
          <h3 style={{ margin: "0 0 1rem", color: "var(--color-success)" }}>
            Configuração realizada com sucesso!
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            <div
              style={{
                padding: "1rem",
                backgroundColor: "var(--surface-primary)",
                borderRadius: "var(--radius-md)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "var(--primary-500)",
                }}
              >
                {summary.processesFound}
              </div>
              <div
                style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
              >
                Processos encontrados
              </div>
            </div>
            <div
              style={{
                padding: "1rem",
                backgroundColor: "var(--surface-primary)",
                borderRadius: "var(--radius-md)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "var(--color-success)",
                }}
              >
                {data.monitoredNames?.length || 0}
              </div>
              <div
                style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
              >
                Alertas configurados
              </div>
            </div>
            <div
              style={{
                padding: "1rem",
                backgroundColor: "var(--surface-primary)",
                borderRadius: "var(--radius-md)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "var(--color-info)",
                }}
              >
                {data.teamMembers?.length || 0}
              </div>
              <div
                style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
              >
                Convites enviados
              </div>
            </div>
          </div>
        </div>

        {/* Estimated Value */}
        <div
          style={{
            backgroundColor: "var(--surface-secondary)",
            padding: "1.5rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          <Zap
            size={32}
            style={{ color: "var(--color-warning)", marginBottom: "0.5rem" }}
          />
          <h4 style={{ margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
            Tempo economizado estimado:
          </h4>
          <div
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              color: "var(--primary-500)",
            }}
          >
            {summary.estimatedTimeValue}
          </div>
          <p style={{ margin: "0.5rem 0 0", color: "var(--text-secondary)" }}>
            Com automação de alertas e organização centralizada
          </p>
        </div>

        {/* Tour Invitation */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h3 style={{ margin: "0 0 1rem", color: "var(--text-primary)" }}>
            Que tal conhecer seu novo escritório digital?
          </h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>
            Faça um tour rápido pelos principais módulos e descubra todas as
            funcionalidades disponíveis.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
              gap: "1rem",
              marginBottom: "2rem",
            }}
          >
            {TOUR_STEPS.slice(0, 6).map((step) => (
              <div
                key={step.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "1rem",
                  backgroundColor: "var(--surface-secondary)",
                  borderRadius: "var(--radius-md)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--surface-tertiary)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--surface-secondary)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <step.icon size={24} style={{ color: "var(--primary-500)" }} />
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "var(--text-primary)",
                    textAlign: "center",
                  }}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexDirection: "column",
          }}
        >
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={startTour}
            icon={Play}
            iconPosition="left"
          >
            Iniciar tour guiado (recomendado)
          </Button>

          <Button
            variant="secondary"
            size="lg"
            fullWidth
            onClick={skipTour}
            icon={SkipForward}
            iconPosition="left"
          >
            Ir direto para o painel
          </Button>
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: "var(--surface-secondary)",
            borderRadius: "var(--radius-md)",
          }}
        >
          <Star
            size={20}
            style={{ color: "var(--color-warning)", marginBottom: "0.5rem" }}
          />
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
            }}
          >
            Você pode refazer este tour a qualquer momento através do menu de
            ajuda.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default DashboardTourStep;
