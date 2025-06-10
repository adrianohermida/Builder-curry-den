/**
 * PUBLICATION ALERTS STEP
 * Step 4: Configure automated publication monitoring
 */

import React, { useState, useCallback, useEffect } from "react";
import {
  ChevronRight,
  ChevronLeft,
  Bell,
  Plus,
  Trash2,
  Clock,
  Search,
  AlertCircle,
  CheckCircle,
  FileText,
  Zap,
} from "lucide-react";
import Card from "@/components/ui/OptimizedCard";
import Button from "@/components/ui/OptimizedButton";
import Input from "@/components/ui/OptimizedInput";

// ===== TYPES =====
interface OnboardingStepProps {
  onNext: (data?: any) => void;
  onPrev: () => void;
  data: any;
  updateData: (updates: any) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

// ===== COMPONENT =====
const PublicationAlertsStep: React.FC<OnboardingStepProps> = ({
  onNext,
  onPrev,
  data,
  updateData,
  isLoading,
  setLoading,
}) => {
  const [enableAlerts, setEnableAlerts] = useState(data.enableAlerts ?? true);
  const [monitoredNames, setMonitoredNames] = useState<string[]>(
    data.monitoredNames || [data.name || ""],
  );
  const [monitoredProcesses, setMonitoredProcesses] = useState<string[]>(
    data.monitoredProcesses || [],
  );
  const [newName, setNewName] = useState("");
  const [newProcess, setNewProcess] = useState("");

  // ===== AUTO-POPULATE FROM PROFILE =====
  useEffect(() => {
    if (data.foundProfile && data.foundProfile.processes) {
      const processNumbers = data.foundProfile.processes.map(
        (p: any) => p.number,
      );
      setMonitoredProcesses((prev) => [
        ...prev,
        ...processNumbers.filter((pn: string) => !prev.includes(pn)),
      ]);
    }
  }, [data.foundProfile]);

  // ===== HANDLERS =====
  const addMonitoredName = useCallback(() => {
    if (newName.trim() && !monitoredNames.includes(newName.trim())) {
      setMonitoredNames((prev) => [...prev, newName.trim()]);
      setNewName("");
    }
  }, [newName, monitoredNames]);

  const removeMonitoredName = useCallback((index: number) => {
    setMonitoredNames((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const addMonitoredProcess = useCallback(() => {
    if (newProcess.trim() && !monitoredProcesses.includes(newProcess.trim())) {
      setMonitoredProcesses((prev) => [...prev, newProcess.trim()]);
      setNewProcess("");
    }
  }, [newProcess, monitoredProcesses]);

  const removeMonitoredProcess = useCallback((index: number) => {
    setMonitoredProcesses((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleContinue = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate API call to configure alerts
      await new Promise((resolve) => setTimeout(resolve, 2000));

      updateData({
        enableAlerts,
        monitoredNames: monitoredNames.filter((n) => n.trim()),
        monitoredProcesses: monitoredProcesses.filter((p) => p.trim()),
      });

      onNext();
    } catch (error) {
      console.error("Alert configuration error:", error);
    } finally {
      setLoading(false);
    }
  }, [
    enableAlerts,
    monitoredNames,
    monitoredProcesses,
    setLoading,
    updateData,
    onNext,
  ]);

  const handleSkip = useCallback(() => {
    updateData({
      enableAlerts: false,
      monitoredNames: [],
      monitoredProcesses: [],
    });
    onNext();
  }, [updateData, onNext]);

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Bell
          size={64}
          style={{
            color: "var(--primary-500)",
            margin: "0 auto 1rem",
            display: "block",
          }}
        />
        <h2 style={{ margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
          Configurar alertas de publicações
        </h2>
        <p style={{ color: "var(--text-secondary)", margin: 0 }}>
          Receba notificações automáticas de publicações dos seus processos
        </p>
      </div>

      <Card padding="lg">
        {/* Enable/Disable Toggle */}
        <div
          style={{
            backgroundColor: "var(--surface-secondary)",
            padding: "1.5rem",
            borderRadius: "var(--radius-md)",
            marginBottom: "2rem",
            border: "1px solid var(--border-primary)",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={enableAlerts}
              onChange={(e) => setEnableAlerts(e.target.checked)}
              style={{
                width: "20px",
                height: "20px",
                accentColor: "var(--primary-500)",
              }}
            />
            <div>
              <div
                style={{
                  fontWeight: "600",
                  color: "var(--text-primary)",
                  marginBottom: "0.25rem",
                }}
              >
                Ativar rastreamento de publicações
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "var(--text-secondary)",
                }}
              >
                Monitore automaticamente publicações no DJE e outros diários
                oficiais
              </div>
            </div>
          </label>
        </div>

        {enableAlerts && (
          <>
            {/* Benefits Info */}
            <div
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.1)",
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
                <Zap size={20} style={{ color: "var(--color-success)" }} />
                <strong style={{ color: "var(--color-success)" }}>
                  Vantagens dos alertas:
                </strong>
              </div>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "1.5rem",
                  color: "var(--text-secondary)",
                }}
              >
                <li>Notificações em tempo real por email e WhatsApp</li>
                <li>Não perca mais prazos importantes</li>
                <li>Monitoramento automático 24/7</li>
                <li>Histórico completo de publicações</li>
              </ul>
            </div>

            {/* Timing Warning */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "1rem",
                backgroundColor: "rgba(249, 115, 22, 0.1)",
                borderRadius: "var(--radius-md)",
                marginBottom: "2rem",
              }}
            >
              <Clock size={20} style={{ color: "var(--color-warning)" }} />
              <div
                style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}
              >
                <strong>Atenção:</strong> O rastreamento será ativado em até 48
                horas. Você pode personalizar os nomes monitorados a qualquer
                momento.
              </div>
            </div>

            {/* Monitored Names */}
            <div style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  margin: "0 0 1rem",
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Search size={20} />
                Nomes para monitorar
              </h3>

              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                  alignItems: "end",
                }}
              >
                <Input
                  placeholder="Digite um nome para monitorar"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addMonitoredName()}
                  style={{ flex: 1 }}
                />
                <Button
                  variant="secondary"
                  onClick={addMonitoredName}
                  icon={Plus}
                  disabled={!newName.trim()}
                >
                  Adicionar
                </Button>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {monitoredNames.map((name, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 1rem",
                      backgroundColor: "var(--primary-50)",
                      color: "var(--primary-700)",
                      borderRadius: "var(--radius-lg)",
                      fontSize: "0.875rem",
                    }}
                  >
                    <span>{name}</span>
                    <button
                      onClick={() => removeMonitoredName(index)}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        color: "var(--primary-500)",
                        cursor: "pointer",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {monitoredNames.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "2rem",
                    color: "var(--text-secondary)",
                    backgroundColor: "var(--surface-secondary)",
                    borderRadius: "var(--radius-md)",
                  }}
                >
                  <FileText
                    size={32}
                    style={{ opacity: 0.5, marginBottom: "0.5rem" }}
                  />
                  <p style={{ margin: 0 }}>
                    Adicione nomes de pessoas ou empresas para monitorar
                  </p>
                </div>
              )}
            </div>

            {/* Monitored Processes */}
            <div style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  margin: "0 0 1rem",
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FileText size={20} />
                Processos específicos
              </h3>

              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                  alignItems: "end",
                }}
              >
                <Input
                  placeholder="Ex: 1234567-89.2023.8.26.0001"
                  value={newProcess}
                  onChange={(e) => setNewProcess(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addMonitoredProcess()}
                  style={{ flex: 1 }}
                />
                <Button
                  variant="secondary"
                  onClick={addMonitoredProcess}
                  icon={Plus}
                  disabled={!newProcess.trim()}
                >
                  Adicionar
                </Button>
              </div>

              {/* Auto-found processes */}
              {data.foundProfile && data.foundProfile.processes && (
                <div
                  style={{
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    padding: "1rem",
                    borderRadius: "var(--radius-md)",
                    marginBottom: "1rem",
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
                    <CheckCircle
                      size={16}
                      style={{ color: "var(--color-success)" }}
                    />
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "var(--color-success)",
                        fontWeight: "600",
                      }}
                    >
                      Processos encontrados automaticamente:
                    </span>
                  </div>
                  <div style={{ display: "grid", gap: "0.25rem" }}>
                    {data.foundProfile.processes.map(
                      (process: any, index: number) => (
                        <div
                          key={index}
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--text-secondary)",
                          }}
                        >
                          • {process.number} - {process.court}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {monitoredProcesses.map((process, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 1rem",
                      backgroundColor: "var(--surface-secondary)",
                      borderRadius: "var(--radius-lg)",
                      fontSize: "0.875rem",
                      fontFamily: "monospace",
                    }}
                  >
                    <span>{process}</span>
                    <button
                      onClick={() => removeMonitoredProcess(index)}
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        padding: "0",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div
              style={{
                backgroundColor: "var(--surface-secondary)",
                padding: "1rem",
                borderRadius: "var(--radius-md)",
                marginBottom: "2rem",
              }}
            >
              <h4
                style={{ margin: "0 0 0.5rem", color: "var(--text-primary)" }}
              >
                Resumo da configuração:
              </h4>
              <div
                style={{
                  display: "grid",
                  gap: "0.25rem",
                  fontSize: "0.875rem",
                }}
              >
                <div>
                  📝 <strong>{monitoredNames.length}</strong> nomes monitorados
                </div>
                <div>
                  ⚖️ <strong>{monitoredProcesses.length}</strong> processos
                  específicos
                </div>
                <div>
                  🔔 Alertas por <strong>email</strong> e{" "}
                  <strong>WhatsApp</strong>
                </div>
                <div>
                  ⏱️ Ativação em <strong>até 48 horas</strong>
                </div>
              </div>
            </div>
          </>
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
              onClick={handleContinue}
              loading={isLoading}
              icon={ChevronRight}
              iconPosition="right"
              style={{ flex: 1 }}
            >
              {enableAlerts ? "Configurar alertas" : "Continuar sem alertas"}
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

export default PublicationAlertsStep;
