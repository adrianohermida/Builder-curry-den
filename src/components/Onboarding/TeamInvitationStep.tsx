/**
 * TEAM INVITATION STEP
 * Step 5: Invite team members and configure roles
 */

import React, { useState, useCallback } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Plus,
  Trash2,
  Users,
  Mail,
  Shield,
} from "lucide-react";
import Card from "@/components/ui/OptimizedCard";
import Button from "@/components/ui/OptimizedButton";
import Input from "@/components/ui/OptimizedInput";

// ===== TYPES =====
interface TeamMember {
  email: string;
  name: string;
  role: "admin" | "user" | "viewer";
}

interface OnboardingStepProps {
  onNext: (data?: any) => void;
  onPrev: () => void;
  data: any;
  updateData: (updates: any) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

// ===== ROLE DEFINITIONS =====
const ROLES = [
  {
    id: "admin",
    name: "Administrador",
    description: "Acesso total, pode gerenciar equipe e configurações",
    permissions: ["Ler", "Escrever", "Gerenciar", "Configurar"],
    color: "var(--color-error)",
  },
  {
    id: "user",
    name: "Usuário",
    description: "Acesso completo aos casos e documentos",
    permissions: ["Ler", "Escrever", "Criar casos"],
    color: "var(--primary-500)",
  },
  {
    id: "viewer",
    name: "Visualizador",
    description: "Apenas visualização, sem editar documentos",
    permissions: ["Ler", "Visualizar relatórios"],
    color: "var(--text-secondary)",
  },
];

// ===== COMPONENT =====
const TeamInvitationStep: React.FC<OnboardingStepProps> = ({
  onNext,
  onPrev,
  data,
  updateData,
  isLoading,
  setLoading,
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(
    data.teamMembers || [{ email: "", name: "", role: "user" }],
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ===== HANDLERS =====
  const addTeamMember = useCallback(() => {
    setTeamMembers((prev) => [...prev, { email: "", name: "", role: "user" }]);
  }, []);

  const removeTeamMember = useCallback((index: number) => {
    setTeamMembers((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updateTeamMember = useCallback(
    (index: number, field: keyof TeamMember, value: string) => {
      setTeamMembers((prev) =>
        prev.map((member, i) =>
          i === index ? { ...member, [field]: value } : member,
        ),
      );
    },
    [],
  );

  const validateAndContinue = useCallback(async () => {
    const newErrors: Record<string, string> = {};

    // Validate email format for filled members
    teamMembers.forEach((member, index) => {
      if (member.email && !/\S+@\S+\.\S+/.test(member.email)) {
        newErrors[`email-${index}`] = "E-mail inválido";
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // Filter out empty members
    const validMembers = teamMembers.filter(
      (member) => member.email.trim() && member.name.trim(),
    );

    setLoading(true);
    try {
      // Simulate sending invitations
      await new Promise((resolve) => setTimeout(resolve, 1500));

      updateData({ teamMembers: validMembers });
      onNext();
    } catch (error) {
      console.error("Team invitation error:", error);
    } finally {
      setLoading(false);
    }
  }, [teamMembers, setLoading, updateData, onNext]);

  const handleSkip = useCallback(() => {
    updateData({ teamMembers: [] });
    onNext();
  }, [updateData, onNext]);

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Users
          size={64}
          style={{
            color: "var(--primary-500)",
            margin: "0 auto 1rem",
            display: "block",
          }}
        />
        <h2 style={{ margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
          Convidar equipe
        </h2>
        <p style={{ color: "var(--text-secondary)", margin: 0 }}>
          Adicione colaboradores e configure suas permissões
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
            <Shield size={20} style={{ color: "var(--primary-500)" }} />
            <strong style={{ color: "var(--text-primary)" }}>
              Sobre as permissões:
            </strong>
          </div>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>
            Você pode ajustar as permissões a qualquer momento na seção "Gestão
            de Equipe". Os convites serão enviados por e-mail com instruções de
            acesso.
          </p>
        </div>

        {/* Role Explanations */}
        <div style={{ marginBottom: "2rem" }}>
          <h3 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>
            Tipos de acesso:
          </h3>
          <div style={{ display: "grid", gap: "1rem" }}>
            {ROLES.map((role) => (
              <div
                key={role.id}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "1rem",
                  padding: "1rem",
                  backgroundColor: "var(--surface-secondary)",
                  borderRadius: "var(--radius-md)",
                  border: `1px solid var(--border-primary)`,
                }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: role.color,
                    marginTop: "0.25rem",
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: "600",
                      color: "var(--text-primary)",
                      marginBottom: "0.25rem",
                    }}
                  >
                    {role.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--text-secondary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {role.description}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    {role.permissions.map((permission) => (
                      <span
                        key={permission}
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.25rem 0.5rem",
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                          color: "var(--primary-500)",
                          borderRadius: "var(--radius-sm)",
                        }}
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members Form */}
        <div style={{ marginBottom: "2rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "1rem",
            }}
          >
            <h3 style={{ margin: 0, color: "var(--text-primary)" }}>
              Membros da equipe
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={addTeamMember}
              icon={Plus}
              iconPosition="left"
            >
              Adicionar membro
            </Button>
          </div>

          <div style={{ display: "grid", gap: "1rem" }}>
            {teamMembers.map((member, index) => (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr auto auto",
                  gap: "1rem",
                  alignItems: "end",
                  padding: "1rem",
                  border: "1px solid var(--border-primary)",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--surface-primary)",
                }}
              >
                <Input
                  label="Nome"
                  placeholder="Nome do colaborador"
                  value={member.name}
                  onChange={(e) =>
                    updateTeamMember(index, "name", e.target.value)
                  }
                />

                <Input
                  label="E-mail"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={member.email}
                  onChange={(e) =>
                    updateTeamMember(index, "email", e.target.value)
                  }
                  error={errors[`email-${index}`]}
                  icon={Mail}
                />

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      color: "var(--text-primary)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Função
                  </label>
                  <select
                    value={member.role}
                    onChange={(e) =>
                      updateTeamMember(index, "role", e.target.value)
                    }
                    style={{
                      width: "130px",
                      padding: "0.5rem",
                      border: "1px solid var(--border-primary)",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--surface-primary)",
                      color: "var(--text-primary)",
                      fontSize: "0.875rem",
                    }}
                  >
                    {ROLES.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTeamMember(index)}
                  icon={Trash2}
                  style={{
                    color: "var(--color-error)",
                    minWidth: "40px",
                  }}
                />
              </div>
            ))}
          </div>

          {teamMembers.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "var(--text-secondary)",
              }}
            >
              <Users size={48} style={{ marginBottom: "1rem", opacity: 0.5 }} />
              <p>Nenhum membro adicionado ainda</p>
              <Button
                variant="secondary"
                onClick={addTeamMember}
                icon={Plus}
                iconPosition="left"
              >
                Adicionar primeiro membro
              </Button>
            </div>
          )}
        </div>

        {/* Summary */}
        {teamMembers.filter((m) => m.email && m.name).length > 0 && (
          <div
            style={{
              backgroundColor: "rgba(34, 197, 94, 0.1)",
              padding: "1rem",
              borderRadius: "var(--radius-md)",
              marginBottom: "2rem",
            }}
          >
            <p style={{ margin: 0, color: "var(--color-success)" }}>
              <strong>
                {teamMembers.filter((m) => m.email && m.name).length} convite(s)
              </strong>{" "}
              serão enviados após a configuração.
            </p>
          </div>
        )}

        {/* Actions */}
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
              onClick={validateAndContinue}
              loading={isLoading}
              icon={ChevronRight}
              iconPosition="right"
              style={{ flex: 1 }}
            >
              Enviar convites e continuar
            </Button>

            <Button variant="ghost" onClick={handleSkip} style={{ flex: 1 }}>
              Pular por agora
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TeamInvitationStep;
