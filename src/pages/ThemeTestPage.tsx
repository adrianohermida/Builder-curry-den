import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useTheme } from "@/providers/ThemeProvider";
import {
  Palette,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  Tablet,
  Desktop,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  Heart,
  Star,
  Settings,
  Eye,
  Users,
  FileText,
  Calendar,
  BarChart3,
} from "lucide-react";

export default function ThemeTestPage() {
  const { config, isDark, effectiveMode } = useTheme();
  const [sliderValue, setSliderValue] = React.useState(50);
  const [progressValue, setProgressValue] = React.useState(75);

  return (
    <div className="container-responsive space-y-8 py-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="heading-responsive font-bold text-foreground">
              Sistema de Temas e Responsividade
            </h1>
            <p className="text-responsive text-muted-foreground">
              Teste abrangente do sistema de temas e design responsivo do
              Lawdesk CRM
            </p>
          </div>
          <ThemeToggle variant="full" showLabel />
        </div>

        {/* Theme Info */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-primary" />
              Informações do Tema Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Modo</Label>
                <div className="flex items-center gap-2">
                  {effectiveMode === "dark" ? (
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Sun className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Badge variant="secondary">
                    {config.mode === "system"
                      ? `Sistema (${effectiveMode})`
                      : config.mode}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Paleta de Cores</Label>
                <Badge variant="outline">{config.colorTheme}</Badge>
              </div>
              <div className="space-y-2">
                <Label>Acessibilidade</Label>
                <div className="flex flex-wrap gap-1">
                  {config.accessibility.highContrast && (
                    <Badge variant="secondary" className="text-xs">
                      Alto Contraste
                    </Badge>
                  )}
                  {config.accessibility.largeText && (
                    <Badge variant="secondary" className="text-xs">
                      Texto Grande
                    </Badge>
                  )}
                  {config.accessibility.reducedMotion && (
                    <Badge variant="secondary" className="text-xs">
                      Movimento Reduzido
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Responsive Test */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            Teste de Responsividade
          </CardTitle>
          <CardDescription>
            Componentes que se adaptam a diferentes tamanhos de tela
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Breakpoint Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="block sm:hidden">
                <Alert className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-900 dark:text-blue-100">
                    Mobile
                  </AlertTitle>
                  <AlertDescription className="text-blue-700 dark:text-blue-200">
                    &lt; 640px
                  </AlertDescription>
                </Alert>
              </div>
              <div className="hidden sm:block md:hidden">
                <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950">
                  <Tablet className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-900 dark:text-green-100">
                    Small
                  </AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-200">
                    640px - 768px
                  </AlertDescription>
                </Alert>
              </div>
              <div className="hidden md:block lg:hidden">
                <Alert className="border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-950">
                  <Tablet className="h-4 w-4 text-yellow-600" />
                  <AlertTitle className="text-yellow-900 dark:text-yellow-100">
                    Medium
                  </AlertTitle>
                  <AlertDescription className="text-yellow-700 dark:text-yellow-200">
                    768px - 1024px
                  </AlertDescription>
                </Alert>
              </div>
              <div className="hidden lg:block xl:hidden">
                <Alert className="border-purple-200 bg-purple-50 dark:border-purple-900 dark:bg-purple-950">
                  <Desktop className="h-4 w-4 text-purple-600" />
                  <AlertTitle className="text-purple-900 dark:text-purple-100">
                    Large
                  </AlertTitle>
                  <AlertDescription className="text-purple-700 dark:text-purple-200">
                    1024px - 1280px
                  </AlertDescription>
                </Alert>
              </div>
              <div className="hidden xl:block">
                <Alert className="border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950">
                  <Desktop className="h-4 w-4 text-indigo-600" />
                  <AlertTitle className="text-indigo-900 dark:text-indigo-100">
                    Extra Large
                  </AlertTitle>
                  <AlertDescription className="text-indigo-700 dark:text-indigo-200">
                    ≥ 1280px
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            {/* Responsive Grid */}
            <div className="grid-responsive">
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Grid responsivo que se adapta automaticamente
                  </p>
                </CardContent>
              </Card>
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    CRM
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Mínimo 280px por coluna
                  </p>
                </CardContent>
              </Card>
              <Card className="card-enhanced">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Agenda
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Máximo flexível baseado no espaço disponível
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Component Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Colors and States */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle>Cores e Estados</CardTitle>
            <CardDescription>
              Demonstração das cores do tema em diferentes estados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Buttons */}
            <div className="space-y-3">
              <Label>Botões</Label>
              <div className="flex flex-wrap gap-2">
                <Button>Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </div>

            {/* Badges */}
            <div className="space-y-3">
              <Label>Badges</Label>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge className="bg-success text-success-foreground">
                  Success
                </Badge>
                <Badge className="bg-warning text-warning-foreground">
                  Warning
                </Badge>
              </div>
            </div>

            {/* Alerts */}
            <div className="space-y-3">
              <Label>Alerts</Label>
              <div className="space-y-2">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Info</AlertTitle>
                  <AlertDescription>
                    Informação importante para o usuário.
                  </AlertDescription>
                </Alert>

                <Alert className="border-success/50 text-success bg-success/10 [&>svg]:text-success">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Sucesso</AlertTitle>
                  <AlertDescription>
                    Operação realizada com sucesso!
                  </AlertDescription>
                </Alert>

                <Alert className="border-warning/50 text-warning bg-warning/10 [&>svg]:text-warning">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Atenção</AlertTitle>
                  <AlertDescription>
                    Verifique os dados antes de continuar.
                  </AlertDescription>
                </Alert>

                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Erro</AlertTitle>
                  <AlertDescription>
                    Erro ao processar a solicitação.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Components */}
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle>Componentes de Formulário</CardTitle>
            <CardDescription>
              Elementos de entrada com design consistente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Text Inputs */}
            <div className="space-y-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="input-enhanced"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                placeholder="Digite sua mensagem..."
                rows={3}
              />
            </div>

            {/* Switches */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifications">Notificações</Label>
                <Switch id="notifications" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="marketing">Marketing</Label>
                <Switch id="marketing" defaultChecked />
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-3">
              <Label>Volume: {sliderValue}%</Label>
              <Slider
                value={[sliderValue]}
                onValueChange={(value) => setSliderValue(value[0])}
                max={100}
                step={1}
              />
            </div>

            {/* Progress */}
            <div className="space-y-3">
              <Label>Progresso: {progressValue}%</Label>
              <Progress value={progressValue} className="w-full" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Tabs */}
      <Card className="card-enhanced">
        <CardHeader>
          <CardTitle>Componentes Interativos</CardTitle>
          <CardDescription>
            Elementos que respondem à interação do usuário
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="design" className="w-full">
            <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3">
              <TabsTrigger value="design">Design System</TabsTrigger>
              <TabsTrigger value="responsive">Responsivo</TabsTrigger>
              <TabsTrigger value="accessibility">Acessibilidade</TabsTrigger>
            </TabsList>

            <TabsContent value="design" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Consistência Visual</h4>
                  <p className="text-sm text-muted-foreground">
                    Todos os componentes seguem o mesmo sistema de design,
                    garantindo uma experiência visual coesa em toda a aplicação.
                  </p>
                  <div className="flex gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <Star className="h-4 w-4 text-yellow-500" />
                    <Settings className="h-4 w-4 text-blue-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Paleta de Cores</h4>
                  <div className="grid grid-cols-6 gap-2">
                    <div className="h-8 bg-primary rounded border"></div>
                    <div className="h-8 bg-secondary rounded border"></div>
                    <div className="h-8 bg-accent rounded border"></div>
                    <div className="h-8 bg-muted rounded border"></div>
                    <div className="h-8 bg-success rounded border"></div>
                    <div className="h-8 bg-destructive rounded border"></div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="responsive" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Design Mobile-First</h4>
                <p className="text-sm text-muted-foreground">
                  O layout é projetado primeiro para dispositivos móveis e
                  depois expandido para telas maiores, garantindo uma
                  experiência otimizada em todos os dispositivos.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  <div className="text-xs text-center p-2 bg-muted rounded">
                    <Smartphone className="h-4 w-4 mx-auto mb-1" />
                    Mobile
                  </div>
                  <div className="text-xs text-center p-2 bg-muted rounded">
                    <Tablet className="h-4 w-4 mx-auto mb-1" />
                    Tablet
                  </div>
                  <div className="text-xs text-center p-2 bg-muted rounded">
                    <Desktop className="h-4 w-4 mx-auto mb-1" />
                    Desktop
                  </div>
                  <div className="text-xs text-center p-2 bg-muted rounded">
                    <Monitor className="h-4 w-4 mx-auto mb-1" />
                    Large
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="accessibility" className="space-y-4">
              <div className="space-y-4">
                <h4 className="font-medium">Recursos de Acessibilidade</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Suporte a Teclado</h5>
                    <p className="text-xs text-muted-foreground">
                      Navegação completa via teclado com indicadores de foco
                      visíveis.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Alto Contraste</h5>
                    <p className="text-xs text-muted-foreground">
                      Modo de alto contraste para melhor legibilidade.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Texto Escalável</h5>
                    <p className="text-xs text-muted-foreground">
                      Opção de aumentar o tamanho do texto em 20%.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Movimento Reduzido</h5>
                    <p className="text-xs text-muted-foreground">
                      Respeita preferências de movimento reduzido do usuário.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card className="card-enhanced">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Sistema de Temas e Responsividade do Lawdesk CRM
            </p>
            <p className="text-xs text-muted-foreground">
              Desenvolvido com React, TypeScript, Tailwind CSS e Radix UI
            </p>
            <Badge variant="outline" className="mt-2">
              Versão 3.1.0 - Totalmente Responsivo
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
