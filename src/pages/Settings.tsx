import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  CreditCard,
  Upload,
  Save,
  Eye,
  EyeOff,
  Globe,
  Building,
  Mail,
  Phone,
  HardDrive,
  ExternalLink,
  ChevronRight,
  BarChart3,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useTheme } from "@/providers/ThemeProvider";
import { cn } from "@/lib/utils";

// Define default color presets for backwards compatibility
const defaultPresets = [
  { name: "Azul", value: "blue", color: "#3b82f6" },
  { name: "Verde", value: "green", color: "#10b981" },
  { name: "Âmbar", value: "orange", color: "#f59e0b" },
  { name: "Vermelho", value: "red", color: "#ef4444" },
  { name: "Roxo", value: "purple", color: "#8b5cf6" },
  { name: "Padrão", value: "default", color: "#06b6d4" },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const {
    config,
    setMode,
    setColorTheme,
    setAccessibility,
    setBranding,
    isDark,
  } = useTheme();

  const subscriptionPlan = {
    name: "Plano Profissional",
    price: "R$ 299,90",
    period: "/mês",
    features: [
      "Até 5 usuários",
      "Documentos ilimitados",
      "IA Jurídica avançada",
      "Suporte prioritário",
      "Integração com tribunais",
      "Backup automático",
    ],
    status: "Ativo",
    renewal: "15 de fevereiro de 2024",
  };

  const handleModeChange = (mode: "light" | "dark" | "system") => {
    setMode(mode);
  };

  const handleColorChange = (
    colorTheme: "default" | "blue" | "green" | "purple" | "orange" | "red",
  ) => {
    setColorTheme(colorTheme);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie sua conta e preferências do sistema
          </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Salvar Alterações
        </Button>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2"
          >
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Aparência</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            <span className="hidden sm:inline">Cobrança</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-lg">AS</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Alterar Foto
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    JPG, PNG ou GIF. Máximo 2MB.
                  </p>
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input id="firstName" defaultValue="Advogado" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input id="lastName" defaultValue="Silva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="silva@lawfirm.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" defaultValue="+55 (11) 99999-9999" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="oab">OAB</Label>
                  <Input id="oab" defaultValue="SP 123.456" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <Select defaultValue="partner">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="partner">Sócio</SelectItem>
                      <SelectItem value="lawyer">Advogado</SelectItem>
                      <SelectItem value="intern">Estagiário</SelectItem>
                      <SelectItem value="secretary">Secretária</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Informações da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Nome da Empresa</Label>
                  <Input id="company" defaultValue="Silva & Associados" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" defaultValue="12.345.678/0001-90" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" defaultValue="Rua das Flores, 123" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    defaultValue="www.silvaassociados.com.br"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Preferências de Notificação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notificações por Email</h3>
                <div className="space-y-3">
                  {[
                    {
                      id: "newClients",
                      label: "Novos clientes",
                      description:
                        "Receber email quando um novo cliente for cadastrado",
                    },
                    {
                      id: "deadlines",
                      label: "Prazos",
                      description: "Alertas de prazos processuais importantes",
                    },
                    {
                      id: "publications",
                      label: "Publicações",
                      description: "Novas publicações nos diários oficiais",
                    },
                    {
                      id: "payments",
                      label: "Pagamentos",
                      description: "Status de pagamentos e faturas",
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between space-x-2"
                    >
                      <div className="space-y-0.5">
                        <Label htmlFor={item.id}>{item.label}</Label>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Switch id={item.id} defaultChecked />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Push Notifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notificações Push</h3>
                <div className="space-y-3">
                  {[
                    {
                      id: "urgentDeadlines",
                      label: "Prazos urgentes",
                      description:
                        "Notificações imediatas para prazos críticos",
                    },
                    {
                      id: "mentions",
                      label: "Menções",
                      description: "Quando você for mencionado em comentários",
                    },
                    {
                      id: "updates",
                      label: "Atualizações do sistema",
                      description: "Novas funcionalidades e atualizações",
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between space-x-2"
                    >
                      <div className="space-y-0.5">
                        <Label htmlFor={item.id}>{item.label}</Label>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                      <Switch id={item.id} defaultChecked />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Personalização de Aparência
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Mode */}
              <div className="space-y-3">
                <Label>Modo de Tema</Label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={config.mode === "light" ? "default" : "outline"}
                    onClick={() => handleModeChange("light")}
                    className="flex items-center gap-2 h-16"
                  >
                    <Sun className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Claro</div>
                      <div className="text-xs text-muted-foreground">
                        Tema claro
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant={config.mode === "dark" ? "default" : "outline"}
                    onClick={() => handleModeChange("dark")}
                    className="flex items-center gap-2 h-16"
                  >
                    <Moon className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Escuro</div>
                      <div className="text-xs text-muted-foreground">
                        Tema escuro
                      </div>
                    </div>
                  </Button>
                  <Button
                    variant={config.mode === "system" ? "default" : "outline"}
                    onClick={() => handleModeChange("system")}
                    className="flex items-center gap-2 h-16"
                  >
                    <Monitor className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Sistema</div>
                      <div className="text-xs text-muted-foreground">Auto</div>
                    </div>
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Color Selection */}
              <div className="space-y-3">
                <Label>Cor Principal</Label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {defaultPresets.map((preset) => (
                    <Button
                      key={preset.value}
                      variant={
                        config.colorTheme === preset.value
                          ? "default"
                          : "outline"
                      }
                      onClick={() => handleColorChange(preset.value as any)}
                      className="flex items-center gap-2 h-16"
                    >
                      <div
                        className="w-6 h-6 rounded-full border-2 border-background shadow-sm"
                        style={{ backgroundColor: preset.color }}
                      />
                      <div className="text-left">
                        <div className="font-medium text-sm">{preset.name}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Accessibility */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Acessibilidade</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <Label>Alto Contraste</Label>
                      <p className="text-sm text-muted-foreground">
                        Aumenta o contraste para melhor legibilidade
                      </p>
                    </div>
                    <Switch
                      checked={config.accessibility.highContrast}
                      onCheckedChange={(checked) =>
                        setAccessibility({
                          ...config.accessibility,
                          highContrast: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <Label>Texto Grande</Label>
                      <p className="text-sm text-muted-foreground">
                        Aumenta o tamanho da fonte em 20%
                      </p>
                    </div>
                    <Switch
                      checked={config.accessibility.largeText}
                      onCheckedChange={(checked) =>
                        setAccessibility({
                          ...config.accessibility,
                          largeText: checked,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <div className="space-y-0.5">
                      <Label>Movimento Reduzido</Label>
                      <p className="text-sm text-muted-foreground">
                        Reduz animações e transições
                      </p>
                    </div>
                    <Switch
                      checked={config.accessibility.reducedMotion}
                      onCheckedChange={(checked) =>
                        setAccessibility({
                          ...config.accessibility,
                          reducedMotion: checked,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Segurança da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Change */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Alterar Senha</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Senha Atual</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Digite sua senha atual"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nova Senha</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Digite a nova senha"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirmar Nova Senha
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirme a nova senha"
                    />
                  </div>
                  <Button>Alterar Senha</Button>
                </div>
              </div>

              <Separator />

              {/* Two-Factor Authentication */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Autenticação de Dois Fatores
                </h3>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium">2FA não configurado</p>
                    <p className="text-sm text-muted-foreground">
                      Adicione uma camada extra de segurança à sua conta
                    </p>
                  </div>
                  <Button variant="outline">Configurar 2FA</Button>
                </div>
              </div>

              <Separator />

              {/* Active Sessions */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sessões Ativas</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Sessão Atual</p>
                      <p className="text-sm text-muted-foreground">
                        Chrome no Windows • São Paulo, SP • Agora
                      </p>
                    </div>
                    <Badge variant="secondary">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">Dispositivo Móvel</p>
                      <p className="text-sm text-muted-foreground">
                        iPhone Safari • São Paulo, SP • 2 horas atrás
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Revogar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Informações de Cobrança
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Plan */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">
                      {subscriptionPlan.name}
                    </h3>
                    <p className="text-2xl font-bold">
                      {subscriptionPlan.price}
                      <span className="text-base font-normal text-muted-foreground">
                        {subscriptionPlan.period}
                      </span>
                    </p>
                  </div>
                  <Badge variant="secondary">{subscriptionPlan.status}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subscriptionPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button variant="outline">Alterar Plano</Button>
                  <Button variant="outline">Cancelar Assinatura</Button>
                </div>
              </div>

              <Separator />

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Método de Pagamento</h3>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                      VISA
                    </div>
                    <div>
                      <p className="font-medium">**** **** **** 4242</p>
                      <p className="text-sm text-muted-foreground">
                        Expira em 12/2025
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Alterar
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Billing History */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Histórico de Cobrança</h3>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver Todos
                  </Button>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      date: "15 Jan 2024",
                      amount: "R$ 299,90",
                      status: "Pago",
                    },
                    {
                      date: "15 Dez 2023",
                      amount: "R$ 299,90",
                      status: "Pago",
                    },
                    {
                      date: "15 Nov 2023",
                      amount: "R$ 299,90",
                      status: "Pago",
                    },
                  ].map((invoice, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{invoice.amount}</p>
                          <p className="text-sm text-muted-foreground">
                            {invoice.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{invoice.status}</Badge>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
