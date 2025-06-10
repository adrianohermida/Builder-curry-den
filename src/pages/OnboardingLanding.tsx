/**
 * ONBOARDING LANDING PAGE
 * Initial entry point for new users to start their journey
 * Shows benefits and starts the onboarding flow
 */

import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap,
  Shield,
  Clock,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  BarChart3,
  Bell,
  FileText,
} from "lucide-react";
import Card from "@/components/ui/OptimizedCard";
import Button from "@/components/ui/OptimizedButton";

// ===== BENEFITS DATA =====
const BENEFITS = [
  {
    icon: Zap,
    title: "Automação Inteligente",
    description: "Busca automática de processos via API Advise",
    value: "80% menos tempo em consultas",
  },
  {
    icon: Bell,
    title: "Alertas em Tempo Real",
    description: "Notificações de publicações por email e WhatsApp",
    value: "Zero prazos perdidos",
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description: "Dados criptografados e conformidade LGPD",
    value: "100% seguro e confiável",
  },
  {
    icon: Users,
    title: "Colaboração em Equipe",
    description: "Convide colaboradores e gerencie permissões",
    value: "Produtividade em equipe",
  },
  {
    icon: BarChart3,
    title: "Relatórios Inteligentes",
    description: "Dashboards com indicadores de performance",
    value: "Decisões baseadas em dados",
  },
  {
    icon: Clock,
    title: "Configuração Rápida",
    description: "Seu escritório digital pronto em 3 minutos",
    value: "Ativação imediata",
  },
];

const TESTIMONIALS = [
  {
    name: "Dr. Carlos Silva",
    role: "Advogado Civilista",
    content:
      "O Lawdesk revolucionou minha prática. Não perco mais prazos e economizo 5 horas por semana.",
    rating: 5,
  },
  {
    name: "Dra. Maria Santos",
    role: "Escritório Empresarial",
    content:
      "A automação dos alertas é incrível. Nossa equipe está muito mais produtiva e organizada.",
    rating: 5,
  },
  {
    name: "Dr. João Oliveira",
    role: "Advogado Trabalhista",
    content:
      "Interface moderna e intuitiva. A configuração foi muito simples e rápida.",
    rating: 5,
  },
];

// ===== COMPONENT =====
const OnboardingLanding: React.FC = () => {
  const navigate = useNavigate();

  const startOnboarding = useCallback(() => {
    navigate("/onboarding");
  }, [navigate]);

  const goToLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        background:
          "linear-gradient(135deg, var(--primary-50) 0%, var(--bg-primary) 100%)",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "var(--primary-500)",
          }}
        >
          ⚖️ Lawdesk
        </div>
        <Button variant="ghost" onClick={goToLogin}>
          Já tenho conta
        </Button>
      </header>

      {/* Hero Section */}
      <section
        style={{
          padding: "4rem 2rem",
          textAlign: "center",
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "800",
            color: "var(--text-primary)",
            marginBottom: "1rem",
            lineHeight: 1.2,
          }}
        >
          Seu escritório jurídico{" "}
          <span style={{ color: "var(--primary-500)" }}>digitalizado</span>
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            color: "var(--text-secondary)",
            marginBottom: "2rem",
            lineHeight: 1.6,
          }}
        >
          Automatize alertas de publicações, gerencie processos e economize até
          5 horas por semana com nossa plataforma inteligente.
        </p>

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            marginBottom: "3rem",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="primary"
            size="lg"
            onClick={startOnboarding}
            icon={ArrowRight}
            iconPosition="right"
          >
            Começar teste grátis de 7 dias
          </Button>
          <Button variant="secondary" size="lg" onClick={goToLogin}>
            Ver demonstração
          </Button>
        </div>

        <div
          style={{
            display: "flex",
            gap: "2rem",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            fontSize: "0.875rem",
            color: "var(--text-secondary)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CheckCircle size={16} style={{ color: "var(--color-success)" }} />
            Sem cartão de crédito
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CheckCircle size={16} style={{ color: "var(--color-success)" }} />
            Configuração em 3 minutos
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CheckCircle size={16} style={{ color: "var(--color-success)" }} />
            Suporte brasileiro
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        style={{
          padding: "4rem 2rem",
          backgroundColor: "var(--surface-primary)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              textAlign: "center",
              marginBottom: "3rem",
              color: "var(--text-primary)",
            }}
          >
            Por que escolher o Lawdesk?
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
              gap: "2rem",
            }}
          >
            {BENEFITS.map((benefit, index) => (
              <Card
                key={index}
                padding="lg"
                hover
                style={{
                  height: "100%",
                  border: "1px solid var(--border-primary)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "var(--radius-lg)",
                      backgroundColor: "var(--primary-50)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <benefit.icon
                      size={24}
                      style={{ color: "var(--primary-500)" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        margin: "0 0 0.5rem",
                        fontSize: "1.25rem",
                        fontWeight: "600",
                        color: "var(--text-primary)",
                      }}
                    >
                      {benefit.title}
                    </h3>
                    <p
                      style={{
                        margin: "0 0 1rem",
                        color: "var(--text-secondary)",
                        lineHeight: 1.6,
                      }}
                    >
                      {benefit.description}
                    </p>
                    <div
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "var(--surface-secondary)",
                        borderRadius: "var(--radius-md)",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        color: "var(--primary-600)",
                        display: "inline-block",
                      }}
                    >
                      {benefit.value}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={{ padding: "4rem 2rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              textAlign: "center",
              marginBottom: "3rem",
              color: "var(--text-primary)",
            }}
          >
            O que nossos clientes dizem
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "2rem",
            }}
          >
            {TESTIMONIALS.map((testimonial, index) => (
              <Card
                key={index}
                padding="lg"
                style={{
                  backgroundColor: "var(--surface-primary)",
                  border: "1px solid var(--border-primary)",
                }}
              >
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ display: "flex", gap: "0.25rem" }}>
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill="var(--color-warning)"
                        style={{ color: "var(--color-warning)" }}
                      />
                    ))}
                  </div>
                </div>
                <p
                  style={{
                    margin: "0 0 1rem",
                    color: "var(--text-primary)",
                    lineHeight: 1.6,
                    fontSize: "1.1rem",
                  }}
                >
                  "{testimonial.content}"
                </p>
                <div>
                  <div
                    style={{
                      fontWeight: "600",
                      color: "var(--text-primary)",
                    }}
                  >
                    {testimonial.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {testimonial.role}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "4rem 2rem",
          backgroundColor: "var(--primary-500)",
          color: "white",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              marginBottom: "1rem",
            }}
          >
            Pronto para transformar sua prática jurídica?
          </h2>
          <p
            style={{ fontSize: "1.25rem", marginBottom: "2rem", opacity: 0.9 }}
          >
            Junte-se a mais de 1.000 advogados que já economizam tempo e
            aumentaram sua produtividade com o Lawdesk.
          </p>
          <Button
            variant="secondary"
            size="lg"
            onClick={startOnboarding}
            icon={ArrowRight}
            iconPosition="right"
            style={{
              backgroundColor: "white",
              color: "var(--primary-500)",
              fontWeight: "600",
            }}
          >
            Começar agora - É grátis!
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "2rem",
          textAlign: "center",
          color: "var(--text-secondary)",
          borderTop: "1px solid var(--border-primary)",
          backgroundColor: "var(--surface-primary)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <p style={{ margin: 0 }}>
            © 2024 Lawdesk - Plataforma jurídica brasileira • Feito com ❤️ para
            advogados
          </p>
        </div>
      </footer>
    </div>
  );
};

export default OnboardingLanding;
