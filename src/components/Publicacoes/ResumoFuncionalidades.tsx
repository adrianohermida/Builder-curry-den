import { motion } from "framer-motion";
import {
  CheckCircle2,
  Bot,
  Calculator,
  Smartphone,
  Calendar,
  Database,
  Zap,
  Shield,
  Clock,
  Settings,
  Download,
  FileText,
  Users,
  Gavel,
  Building,
  ArrowRight,
  Sparkles,
  Target,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  status: "completed" | "active" | "upcoming";
  color: string;
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  features,
  status,
  color,
}: FeatureCardProps) {
  const statusColors = {
    completed: "bg-green-100 text-green-800 border-green-200",
    active: "bg-blue-100 text-blue-800 border-blue-200",
    upcoming: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const statusTexts = {
    completed: "Implementado",
    active: "Ativo",
    upcoming: "Planejado",
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card
        className={`h-full border-l-4 border-l-${color}-500 hover:shadow-lg transition-all`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className={`h-6 w-6 text-${color}-600`} />
              <CardTitle className="text-lg">{title}</CardTitle>
            </div>
            <Badge className={statusColors[status]}>
              {status === "completed" && (
                <CheckCircle2 className="h-3 w-3 mr-1" />
              )}
              {statusTexts[status]}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function ResumoFuncionalidades() {
  const features: FeatureCardProps[] = [
    {
      icon: Bot,
      title: "IA Jurídica Avançada",
      description:
        "Inteligência artificial especializada em análise jurídica brasileira",
      color: "purple",
      status: "completed",
      features: [
        "Análise automática de publicações judiciais",
        "Sugestão de petições baseada no conteúdo",
        "Identificação de urgências e prazos",
        "Detecção de tipos de partes (Fazenda Pública, etc.)",
        "Chat contextual para estudos de caso",
        "Geração de resumos executivos",
      ],
    },
    {
      icon: Calculator,
      title: "Sistema de Prazos Processuais",
      description:
        "Cálculo automático de prazos conforme legislação brasileira",
      color: "blue",
      status: "completed",
      features: [
        "Base de regras CPC, Penal, Trabalhista e JEF",
        "Multiplicadores por tipo de parte",
        "Calendário jurídico com feriados",
        "Contagem de dias úteis vs corridos",
        "Integração com origem da publicação (DJEN, DJE)",
        "Configuração manual, automática ou IA",
      ],
    },
    {
      icon: Download,
      title: "Integração API Advise",
      description: "Ingestão silenciosa de publicações judiciais",
      color: "green",
      status: "completed",
      features: [
        "Sincronização automática configurável",
        "Filtros por tribunal e tipo",
        "Backup automático das publicações",
        "Teste de conectividade",
        "Monitoramento de última sincronização",
        "Processamento apenas de urgentes (opcional)",
      ],
    },
    {
      icon: FileText,
      title: "PublicacaoDetalhada Completa",
      description: "Interface rica para análise e ação sobre publicações",
      color: "orange",
      status: "completed",
      features: [
        "5 abas organizadas (Conteúdo, IA, Ações, Integração, Cliente)",
        "Identificação automática de tribunal e sistema",
        "Mais de 15 ações disponíveis",
        "Validação de números de processo",
        "Sistema de tags e observações",
        "Controle de visibilidade para cliente",
      ],
    },
    {
      icon: Calendar,
      title: "Integração com Agenda",
      description: "Criação automática de tarefas e lembretes",
      color: "red",
      status: "completed",
      features: [
        "Criação automática de tarefas com prazos",
        "Notificações antecipadas configuráveis",
        "Priorização por urgência",
        "Vinculação com processo e cliente",
        "Lembretes preventivos",
        "Integração com calendário jurídico",
      ],
    },
    {
      icon: Smartphone,
      title: "Portal do Cliente",
      description: "Compartilhamento seguro com clientes",
      color: "teal",
      status: "completed",
      features: [
        "Controle de visibilidade individual",
        "Compartilhamento via WhatsApp",
        "Mensagens automáticas com resumo",
        "Links seguros de acesso",
        "Preparação para GOV.BR",
        "Logs de acesso do cliente",
      ],
    },
    {
      icon: Settings,
      title: "Configurações Avançadas",
      description: "Painel completo de configuração do sistema",
      color: "gray",
      status: "completed",
      features: [
        "Interface tabular organizada",
        "Exportação/importação de regras",
        "Backup e restore de configurações",
        "Teste de integrações",
        "Configuração de filtros da API",
        "Reset para padrões",
      ],
    },
    {
      icon: Shield,
      title: "Conformidade LGPD",
      description: "Proteção de dados e auditoria completa",
      color: "indigo",
      status: "completed",
      features: [
        "Criptografia AES-256 local",
        "Logs de auditoria detalhados",
        "Controle de retenção de dados",
        "Consentimento rastreável",
        "Anonimização automática",
        "Relatórios de conformidade",
      ],
    },
    {
      icon: Globe,
      title: "Localização Brasileira",
      description: "Sistema totalmente adaptado para o Brasil",
      color: "yellow",
      status: "completed",
      features: [
        "Terminologia jurídica brasileira",
        "Formatação de datas e valores",
        "Calendário de feriados nacionais",
        "Regras processuais por jurisdição",
        "Identificação de tribunais brasileiros",
        "Integração com sistemas nacionais",
      ],
    },
  ];

  const statistics = [
    { label: "Funcionalidades Implementadas", value: "50+", icon: Target },
    { label: "Integrações Ativas", value: "8", icon: Zap },
    { label: "Componentes Criados", value: "15", icon: Building },
    { label: "Hooks Customizados", value: "6", icon: Settings },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
          <Sparkles className="h-10 w-10 text-yellow-500" />
          Evolução do Módulo de Publicações
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Sistema completo de gestão de publicações judiciais com IA, automação
          de prazos e integração total com o ecossistema Lawdesk
        </p>
      </motion.div>

      {/* Estatísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid gap-6 md:grid-cols-4"
      >
        {statistics.map((stat, index) => (
          <Card key={index} className="text-center">
            <CardContent className="p-6">
              <stat.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-3xl font-bold text-blue-600">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Grid de Funcionalidades */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </motion.div>

      {/* Fluxo de Trabalho */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <Gavel className="h-6 w-6" />
              Fluxo de Trabalho Automatizado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <Download className="h-4 w-4 text-green-600" />
                <span>Ingestão API</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <Bot className="h-4 w-4 text-purple-600" />
                <span>Análise IA</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <Calculator className="h-4 w-4 text-blue-600" />
                <span>Cálculo Prazos</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <Calendar className="h-4 w-4 text-red-600" />
                <span>Agenda</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm">
                <Users className="h-4 w-4 text-teal-600" />
                <span>Cliente</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-center space-y-4"
      >
        <h2 className="text-2xl font-bold">Sistema Pronto para Produção</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Todas as funcionalidades implementadas seguem as melhores práticas de
          desenvolvimento, estão totalmente integradas e prontas para uso em
          ambiente de produção.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Acessar Publicações
          </Button>
          <Button variant="outline" size="lg">
            <Settings className="h-5 w-5 mr-2" />
            Configurar Sistema
          </Button>
        </div>
      </motion.div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="border-t pt-6"
      >
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>LGPD Compliant</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Tempo Real</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span>Backup Automático</span>
          </div>
          <Separator orientation="vertical" className="h-4" />
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span>Brasil 🇧🇷</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
