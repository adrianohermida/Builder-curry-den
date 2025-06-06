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
import { useTheme, defaultPresets } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const { theme, themeColor, setTheme, setThemeColor } = useTheme();

  const subscriptionPlan = {
    name: "Plano Profissional",
    price: "R$ 299,90",
    period: "/mês",
    features: [
      "Até 5 usuários",
      "Documentos ilimitados",
      "IA Jurídica avançada",
      "Integrações premium",
      "Suporte prioritário",
    ],
    nextBilling: "2025-01-15",
  };

  const notificationSettings = [
    {
      id: "email_audiencias",
      title: "Audiências por E-mail",
      description: "Receber lembretes de audiências via e-mail",
      enabled: true,
    },
    {
      id: "sms_urgentes",
      title: "SMS para Urgências",
      description: "Notificações SMS para casos urgentes",
      enabled: false,
    },
    {
      id: "push_novos_casos",
      title: "Novos Casos",
      description: "Notificações push para novos casos",
      enabled: true,
    },
    {
      id: "email_relatorios",
      title: "Relatórios Semanais",
      description: "Receber relatórios semanais por e-mail",
      enabled: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <SettingsIcon className="h-8 w-8 text-[rgb(var(--theme-primary))]" />
            <span>Configurações</span>
          </h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema e preferências
          </p>
        </div>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="storage">Armazenamento</TabsTrigger>
          <TabsTrigger value="billing">Assinatura</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Information */}
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-[rgb(var(--theme-primary))]" />
                  <span>Informações Pessoais</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-lg">AS</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Alterar Foto
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG até 2MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nome</Label>
                    <Input id="firstName" defaultValue="Advogado" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Sobrenome</Label>
                    <Input id="lastName" defaultValue="Silva" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="silva@lawfirm.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" defaultValue="(11) 99999-9999" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="oab">OAB</Label>
                  <Input id="oab" defaultValue="SP 123.456" />
                </div>

                <Button className="w-full bg-[rgb(var(--theme-primary))] hover:bg-[rgb(var(--theme-primary))]/90">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </Button>
              </CardContent>
            </Card>

            {/* Firm Information */}
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-[rgb(var(--theme-primary))]" />
                  <span>Informações do Escritório</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firmName">Nome do Escritório</Label>
                  <Input id="firmName" defaultValue="Silva & Associados" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" defaultValue="12.345.678/0001-90" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input id="address" defaultValue="Av. Paulista, 1000" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input id="city" defaultValue="São Paulo" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Select defaultValue="SP">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firmPhone">Telefone do Escritório</Label>
                  <Input id="firmPhone" defaultValue="(11) 3333-4444" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firmEmail">E-mail Institucional</Label>
                  <Input
                    id="firmEmail"
                    defaultValue="contato@silvaassociados.com.br"
                  />
                </div>

                <Button variant="outline" className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Atualizar Informações
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-[rgb(var(--theme-primary))]" />
                <span>Preferências de Notificação</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {notificationSettings.map((setting, index) => (
                <div key={setting.id}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{setting.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {setting.description}
                      </p>
                    </div>
                    <Switch defaultChecked={setting.enabled} />
                  </div>
                  {index < notificationSettings.length - 1 && (
                    <Separator className="mt-6" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Password */}
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-[rgb(var(--theme-primary))]" />
                  <span>Alterar Senha</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Senha Atual</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
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
                  <Input id="newPassword" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                  <Input id="confirmPassword" type="password" />
                </div>

                <Button className="w-full bg-[rgb(var(--theme-primary))] hover:bg-[rgb(var(--theme-primary))]/90">
                  Alterar Senha
                </Button>
              </CardContent>
            </Card>

            {/* Two Factor Authentication */}
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle>Autenticação de Dois Fatores</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">2FA via SMS</h4>
                    <p className="text-sm text-muted-foreground">
                      Receber códigos via SMS
                    </p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">2FA via E-mail</h4>
                    <p className="text-sm text-muted-foreground">
                      Receber códigos via e-mail
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Sessões Ativas</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Windows - Chrome</p>
                        <p className="text-sm text-muted-foreground">
                          São Paulo, SP • Atual
                        </p>
                      </div>
                      <Badge variant="outline">Ativo</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">iPhone - Safari</p>
                        <p className="text-sm text-muted-foreground">
                          São Paulo, SP • 2h atrás
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Encerrar
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5 text-[rgb(var(--theme-primary))]" />
                <span>Aparência do Sistema</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <Label>Tema</Label>
                <div className="flex space-x-4">
                  <Button
                    variant={theme === "light" ? "default" : "outline"}
                    onClick={() => setTheme("light")}
                    className="flex-1"
                  >
                    Claro
                  </Button>
                  <Button
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => setTheme("dark")}
                    className="flex-1"
                  >
                    Escuro
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Color Selection */}
              <div className="space-y-3">
                <Label>Cor Principal</Label>
                <div className="grid grid-cols-6 gap-3">
                  {defaultPresets.map((color) => (
                    <button
                      key={color}
                      onClick={() => setThemeColor(color)}
                      className={cn(
                        "w-12 h-12 rounded-lg border-2 transition-all hover:scale-110",
                        themeColor === color
                          ? "border-foreground scale-110"
                          : "border-border",
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <Separator />

              {/* Language Selection */}
              <div className="space-y-3">
                <Label htmlFor="language">Idioma</Label>
                <Select defaultValue="pt-BR">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4" />
                        <span>Português (Brasil)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  O sistema está configurado para uso exclusivo em português
                  brasileiro.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-6">
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HardDrive className="h-5 w-5 text-[rgb(var(--theme-primary))]" />
                <span>Configuração de Armazenamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Configure onde e como os documentos jurídicos são armazenados
                  na plataforma.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Provedor Atual</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Configure o destino dos documentos, contratos e anexos.
                    </p>
                    <Link to="/configuracoes/armazenamento">
                      <Button className="w-full bg-[rgb(var(--theme-primary))] hover:bg-[rgb(var(--theme-primary))]/90">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar Armazenamento
                        <ExternalLink className="h-3 w-3 ml-2" />
                      </Button>
                    </Link>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Monitoramento</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Visualize estatísticas e logs de atividade.
                    </p>
                    <Link to="/configuracoes/armazenamento?tab=dashboard">
                      <Button variant="outline" className="w-full">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Ver Dashboard
                        <ChevronRight className="h-3 w-3 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 dark:text-blue-200">
                        Conformidade LGPD
                      </h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Mantenha seus documentos seguros e em conformidade com a
                        Lei Geral de Proteção de Dados.
                      </p>
                      <Link
                        to="/configuracoes/armazenamento?tab=configuracao"
                        className="inline-block mt-2"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-300 text-blue-700 hover:bg-blue-100"
                        >
                          Revisar Configurações
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Current Plan */}
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-[rgb(var(--theme-primary))]" />
                  <span>Plano Atual</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-bold">
                    {subscriptionPlan.name}
                  </h3>
                  <div className="flex items-baseline justify-center space-x-1">
                    <span className="text-3xl font-bold text-[rgb(var(--theme-primary))]">
                      {subscriptionPlan.price}
                    </span>
                    <span className="text-muted-foreground">
                      {subscriptionPlan.period}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {subscriptionPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-[rgb(var(--theme-primary))]" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Próxima cobrança em{" "}
                    {new Date(subscriptionPlan.nextBilling).toLocaleDateString(
                      "pt-BR",
                    )}
                  </p>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">
                      Alterar Plano
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Cancelar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle>Forma de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded"></div>
                    <div>
                      <p className="font-medium">•••• •••• •••• 1234</p>
                      <p className="text-sm text-muted-foreground">
                        Expira 12/2027
                      </p>
                    </div>
                  </div>
                  <Badge variant="default">Principal</Badge>
                </div>

                <Button variant="outline" className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Adicionar Cartão
                </Button>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">Histórico de Pagamentos</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>15/12/2024</span>
                      <span>R$ 299,90</span>
                      <Badge variant="default">Pago</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>15/11/2024</span>
                      <span>R$ 299,90</span>
                      <Badge variant="default">Pago</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>15/10/2024</span>
                      <span>R$ 299,90</span>
                      <Badge variant="default">Pago</Badge>
                    </div>
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
