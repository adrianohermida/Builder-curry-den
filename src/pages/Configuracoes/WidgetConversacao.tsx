import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  MessageCircle,
  Palette,
  Clock,
  Users,
  Bot,
  Shield,
  BarChart3,
  Save,
  TestTube,
  Download,
  Upload,
  Trash2,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/usePermissions";
import { useViewMode } from "@/contexts/ViewModeContext";

interface ConfiguracaoWidget {
  // Aparência
  ativo: boolean;
  tema: "claro" | "escuro" | "auto";
  corPrimaria: string;
  corSecundaria: string;
  posicao: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  logoUrl: string;

  // Funcionalidades
  chat: boolean;
  videoChamada: boolean;
  anexos: boolean;
  emojis: boolean;
  faq: boolean;
  avaliacaoRapida: boolean;

  // Automação
  boasVindas: {
    ativo: boolean;
    mensagem: string;
    delay: number;
  };
  respostasAutomaticas: boolean;
  iaHabilitada: boolean;

  // Horários
  horarioFuncionamento: {
    ativo: boolean;
    fusoHorario: string;
    mensagemForaHorario: string;
  };

  // Roteamento
  departamentoPadrao: string;
  roteamentoInteligente: boolean;

  // Permissões
  acessoPublico: boolean;
  acessoClientes: boolean;
  acessoAdvogados: boolean;

  // Integração
  integracaoWhatsapp: boolean;
  integracaoEmail: boolean;
  webhooks: boolean;
}

const configuracaoPadrao: ConfiguracaoWidget = {
  ativo: true,
  tema: "auto",
  corPrimaria: "#3B82F6",
  corSecundaria: "#1E40AF",
  posicao: "bottom-right",
  logoUrl: "",
  chat: true,
  videoChamada: false,
  anexos: true,
  emojis: true,
  faq: true,
  avaliacaoRapida: true,
  boasVindas: {
    ativo: true,
    mensagem: "Olá! Como posso ajudar você hoje?",
    delay: 2,
  },
  respostasAutomaticas: true,
  iaHabilitada: true,
  horarioFuncionamento: {
    ativo: true,
    fusoHorario: "America/Sao_Paulo",
    mensagemForaHorario:
      "Estamos fora do horário de atendimento. Deixe sua mensagem que responderemos em breve.",
  },
  departamentoPadrao: "suporte",
  roteamentoInteligente: true,
  acessoPublico: false,
  acessoClientes: true,
  acessoAdvogados: true,
  integracaoWhatsapp: false,
  integracaoEmail: true,
  webhooks: false,
};

export default function WidgetConversacao() {
  const [config, setConfig] = useState<ConfiguracaoWidget>(configuracaoPadrao);
  const [previewMode, setPreviewMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isAdmin } = usePermissions();
  const { isAdminMode } = useViewMode();

  // Atualizar configuração
  const updateConfig = (key: keyof ConfiguracaoWidget, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  // Salvar configurações
  const salvarConfiguracoes = async () => {
    setIsLoading(true);
    try {
      // Simular salvamento no backend
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    } finally {
      setIsLoading(false);
    }
  };

  // Exportar configurações
  const exportarConfiguracoes = () => {
    const dataStr = JSON.stringify(config, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `widget-config-${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast.success("Configurações exportadas!");
  };

  // Resetar configurações
  const resetarConfiguracoes = () => {
    setConfig(configuracaoPadrao);
    toast.success("Configurações resetadas para o padrão");
  };

  if (!isAdmin()) {
    return (
      <div className="container mx-auto max-w-4xl p-6">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Acesso restrito. Apenas administradores podem configurar o widget de
            conversação.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            Configuração do Widget de Conversação
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure a aparência, funcionalidades e comportamento do sistema de
            atendimento
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {previewMode ? "Sair do Preview" : "Preview"}
          </Button>
          <Button onClick={salvarConfiguracoes} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </motion.div>

      {/* Status do Widget */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${config.ativo ? "bg-green-500" : "bg-red-500"}`}
              />
              <div>
                <h3 className="font-semibold">Widget de Conversação</h3>
                <p className="text-sm text-muted-foreground">
                  {config.ativo ? "Ativo e funcionando" : "Desabilitado"}
                </p>
              </div>
            </div>
            <Switch
              checked={config.ativo}
              onCheckedChange={(checked) => updateConfig("ativo", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Configurações Principais */}
      <Tabs defaultValue="aparencia" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="aparencia" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Aparência
          </TabsTrigger>
          <TabsTrigger
            value="funcionalidades"
            className="flex items-center gap-2"
          >
            <Settings className="h-4 w-4" />
            Funcionalidades
          </TabsTrigger>
          <TabsTrigger value="automacao" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            Automação
          </TabsTrigger>
          <TabsTrigger value="horarios" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Horários
          </TabsTrigger>
          <TabsTrigger value="permissoes" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Permissões
          </TabsTrigger>
          <TabsTrigger value="avancado" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Avançado
          </TabsTrigger>
        </TabsList>

        {/* Aparência */}
        <TabsContent value="aparencia" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tema e Cores</CardTitle>
                <CardDescription>
                  Personalize a aparência visual do widget
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tema">Tema</Label>
                  <Select
                    value={config.tema}
                    onValueChange={(value: any) => updateConfig("tema", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="claro">Claro</SelectItem>
                      <SelectItem value="escuro">Escuro</SelectItem>
                      <SelectItem value="auto">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="corPrimaria">Cor Primária</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="color"
                        value={config.corPrimaria}
                        onChange={(e) =>
                          updateConfig("corPrimaria", e.target.value)
                        }
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={config.corPrimaria}
                        onChange={(e) =>
                          updateConfig("corPrimaria", e.target.value)
                        }
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="corSecundaria">Cor Secundária</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        type="color"
                        value={config.corSecundaria}
                        onChange={(e) =>
                          updateConfig("corSecundaria", e.target.value)
                        }
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={config.corSecundaria}
                        onChange={(e) =>
                          updateConfig("corSecundaria", e.target.value)
                        }
                        placeholder="#1E40AF"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Posicionamento</CardTitle>
                <CardDescription>
                  Onde o widget aparecerá na tela
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Posição do Widget</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {[
                      { value: "top-left", label: "Superior Esquerdo" },
                      { value: "top-right", label: "Superior Direito" },
                      { value: "bottom-left", label: "Inferior Esquerdo" },
                      { value: "bottom-right", label: "Inferior Direito" },
                    ].map((pos) => (
                      <Button
                        key={pos.value}
                        variant={
                          config.posicao === pos.value ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => updateConfig("posicao", pos.value)}
                        className="h-auto p-3 text-xs"
                      >
                        {pos.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="logoUrl">URL do Logo (opcional)</Label>
                  <Input
                    value={config.logoUrl}
                    onChange={(e) => updateConfig("logoUrl", e.target.value)}
                    placeholder="https://exemplo.com/logo.png"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Funcionalidades */}
        <TabsContent value="funcionalidades" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recursos do Chat</CardTitle>
                <CardDescription>
                  Habilite ou desabilite funcionalidades específicas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    key: "chat",
                    label: "Chat de Texto",
                    desc: "Conversação por texto básica",
                  },
                  {
                    key: "anexos",
                    label: "Envio de Anexos",
                    desc: "Permitir upload de arquivos",
                  },
                  {
                    key: "emojis",
                    label: "Emojis e Reações",
                    desc: "Emojis e reações nas mensagens",
                  },
                  {
                    key: "faq",
                    label: "FAQ Integrado",
                    desc: "Perguntas frequentes no widget",
                  },
                  {
                    key: "avaliacaoRapida",
                    label: "Avaliação Rápida",
                    desc: "Avaliação do atendimento",
                  },
                ].map((func) => (
                  <div
                    key={func.key}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{func.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {func.desc}
                      </div>
                    </div>
                    <Switch
                      checked={
                        config[func.key as keyof ConfiguracaoWidget] as boolean
                      }
                      onCheckedChange={(checked) =>
                        updateConfig(
                          func.key as keyof ConfiguracaoWidget,
                          checked,
                        )
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recursos Avançados</CardTitle>
                <CardDescription>
                  Funcionalidades premium do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    key: "videoChamada",
                    label: "Vídeo Chamada",
                    desc: "Chamadas de vídeo com agentes",
                    premium: true,
                  },
                  {
                    key: "iaHabilitada",
                    label: "IA Jurídica",
                    desc: "Respostas automáticas inteligentes",
                    premium: true,
                  },
                  {
                    key: "roteamentoInteligente",
                    label: "Roteamento Inteligente",
                    desc: "Distribuição automática por especialidade",
                  },
                ].map((func) => (
                  <div
                    key={func.key}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-sm flex items-center gap-2">
                        {func.label}
                        {func.premium && (
                          <Badge variant="secondary" className="text-xs">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {func.desc}
                      </div>
                    </div>
                    <Switch
                      checked={
                        config[func.key as keyof ConfiguracaoWidget] as boolean
                      }
                      onCheckedChange={(checked) =>
                        updateConfig(
                          func.key as keyof ConfiguracaoWidget,
                          checked,
                        )
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Automação */}
        <TabsContent value="automacao" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mensagem de Boas-vindas</CardTitle>
                <CardDescription>
                  Configure a primeira mensagem automática
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Ativar Boas-vindas</Label>
                  <Switch
                    checked={config.boasVindas.ativo}
                    onCheckedChange={(checked) =>
                      updateConfig("boasVindas", {
                        ...config.boasVindas,
                        ativo: checked,
                      })
                    }
                  />
                </div>

                {config.boasVindas.ativo && (
                  <>
                    <div>
                      <Label>Mensagem</Label>
                      <Textarea
                        value={config.boasVindas.mensagem}
                        onChange={(e) =>
                          updateConfig("boasVindas", {
                            ...config.boasVindas,
                            mensagem: e.target.value,
                          })
                        }
                        placeholder="Digite a mensagem de boas-vindas..."
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Delay (segundos)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="30"
                        value={config.boasVindas.delay}
                        onChange={(e) =>
                          updateConfig("boasVindas", {
                            ...config.boasVindas,
                            delay: Number(e.target.value),
                          })
                        }
                      />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Inteligência Artificial</CardTitle>
                <CardDescription>
                  Configure respostas automáticas inteligentes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">IA Jurídica Ativada</div>
                    <div className="text-sm text-muted-foreground">
                      Respostas automáticas baseadas em IA
                    </div>
                  </div>
                  <Switch
                    checked={config.iaHabilitada}
                    onCheckedChange={(checked) =>
                      updateConfig("iaHabilitada", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Respostas Automáticas</div>
                    <div className="text-sm text-muted-foreground">
                      Responder perguntas comuns automaticamente
                    </div>
                  </div>
                  <Switch
                    checked={config.respostasAutomaticas}
                    onCheckedChange={(checked) =>
                      updateConfig("respostasAutomaticas", checked)
                    }
                  />
                </div>

                {config.iaHabilitada && (
                  <Alert>
                    <Bot className="h-4 w-4" />
                    <AlertDescription>
                      A IA Jurídica utilizará a base de conhecimento do sistema
                      para fornecer respostas precisas sobre funcionalidades e
                      procedimentos legais.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Horários */}
        <TabsContent value="horarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Horário de Funcionamento</CardTitle>
              <CardDescription>
                Configure quando o atendimento está disponível
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Controle de Horário Ativo</Label>
                <Switch
                  checked={config.horarioFuncionamento.ativo}
                  onCheckedChange={(checked) =>
                    updateConfig("horarioFuncionamento", {
                      ...config.horarioFuncionamento,
                      ativo: checked,
                    })
                  }
                />
              </div>

              {config.horarioFuncionamento.ativo && (
                <>
                  <div>
                    <Label>Fuso Horário</Label>
                    <Select
                      value={config.horarioFuncionamento.fusoHorario}
                      onValueChange={(value) =>
                        updateConfig("horarioFuncionamento", {
                          ...config.horarioFuncionamento,
                          fusoHorario: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">
                          Brasília (GMT-3)
                        </SelectItem>
                        <SelectItem value="America/New_York">
                          Nova York (GMT-4)
                        </SelectItem>
                        <SelectItem value="Europe/London">
                          Londres (GMT+1)
                        </SelectItem>
                        <SelectItem value="Asia/Tokyo">
                          Tóquio (GMT+9)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Mensagem Fora do Horário</Label>
                    <Textarea
                      value={config.horarioFuncionamento.mensagemForaHorario}
                      onChange={(e) =>
                        updateConfig("horarioFuncionamento", {
                          ...config.horarioFuncionamento,
                          mensagemForaHorario: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissões */}
        <TabsContent value="permissoes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Controle de Acesso</CardTitle>
              <CardDescription>
                Configure quem pode usar o widget de conversação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  key: "acessoPublico",
                  label: "Acesso Público",
                  desc: "Visitantes não autenticados",
                },
                {
                  key: "acessoClientes",
                  label: "Clientes Lawdesk",
                  desc: "Usuários cadastrados no sistema",
                },
                {
                  key: "acessoAdvogados",
                  label: "Advogados",
                  desc: "Profissionais jurídicos cadastrados",
                },
              ].map((perm) => (
                <div
                  key={perm.key}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-sm">{perm.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {perm.desc}
                    </div>
                  </div>
                  <Switch
                    checked={
                      config[perm.key as keyof ConfiguracaoWidget] as boolean
                    }
                    onCheckedChange={(checked) =>
                      updateConfig(
                        perm.key as keyof ConfiguracaoWidget,
                        checked,
                      )
                    }
                  />
                </div>
              ))}

              <Separator />

              <div>
                <Label>Departamento Padrão</Label>
                <Select
                  value={config.departamentoPadrao}
                  onValueChange={(value) =>
                    updateConfig("departamentoPadrao", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="suporte">Suporte Técnico</SelectItem>
                    <SelectItem value="comercial">Comercial</SelectItem>
                    <SelectItem value="juridico">Jurídico</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Avançado */}
        <TabsContent value="avancado" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Integrações Externas</CardTitle>
                <CardDescription>
                  Conecte com outras plataformas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    key: "integracaoWhatsapp",
                    label: "WhatsApp Business",
                    desc: "Integração com WhatsApp",
                  },
                  {
                    key: "integracaoEmail",
                    label: "E-mail",
                    desc: "Tickets por e-mail",
                  },
                  {
                    key: "webhooks",
                    label: "Webhooks",
                    desc: "Notificações para sistemas externos",
                  },
                ].map((integ) => (
                  <div
                    key={integ.key}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{integ.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {integ.desc}
                      </div>
                    </div>
                    <Switch
                      checked={
                        config[integ.key as keyof ConfiguracaoWidget] as boolean
                      }
                      onCheckedChange={(checked) =>
                        updateConfig(
                          integ.key as keyof ConfiguracaoWidget,
                          checked,
                        )
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Importar/Exportar</CardTitle>
                <CardDescription>
                  Backup e restauração de configurações
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={exportarConfiguracoes}>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById("import-config")?.click()
                    }
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Importar
                  </Button>
                  <input
                    id="import-config"
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          try {
                            const importedConfig = JSON.parse(
                              event.target?.result as string,
                            );
                            setConfig(importedConfig);
                            toast.success("Configurações importadas!");
                          } catch (error) {
                            toast.error("Arquivo inválido");
                          }
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                  <Button variant="outline" onClick={resetarConfiguracoes}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Resetar
                  </Button>
                  <Button variant="outline">
                    <TestTube className="h-4 w-4 mr-2" />
                    Testar
                  </Button>
                </div>

                <Separator />

                <div className="text-sm space-y-2">
                  <h4 className="font-medium">Informações do Sistema</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div>Versão: 2025.1.0</div>
                    <div>Última atualização: Hoje</div>
                    <div>Status: Ativo</div>
                    <div>Uptime: 99.9%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
