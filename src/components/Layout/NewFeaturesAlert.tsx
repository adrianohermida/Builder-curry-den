import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Search,
  Zap,
  Users,
  Scale,
  Target,
  Filter,
  Menu,
  MoreHorizontal,
  X,
  ChevronRight,
  Keyboard,
  Eye,
  TrendingUp,
  Layers,
  Star,
  Palette,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

const NewFeaturesAlert: React.FC = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentDemo, setCurrentDemo] = useState<string | null>(null);

  const features = [
    {
      id: "global-search",
      icon: Search,
      title: "Busca Global",
      description: "Busque clientes, processos e tarefas instantaneamente",
      shortcut: "⌘K",
      color: "from-blue-500 to-blue-600",
      demo: "Pressione ⌘K para testar",
    },
    {
      id: "quick-actions",
      icon: Zap,
      title: "Quick Actions",
      description: "Crie registros rapidamente com atalhos",
      shortcut: "⌘C, ⌘P, ⌘T",
      color: "from-purple-500 to-purple-600",
      demo: "⌘C = Cliente, ⌘P = Processo, ⌘T = Tarefa",
    },
    {
      id: "collapsible-widgets",
      icon: Layers,
      title: "Widgets Colapsáveis",
      description: "Organize sua tela colapsando seções por prioridade",
      shortcut: "Clique nos títulos",
      color: "from-green-500 to-green-600",
      demo: "Clique nos títulos das seções para colapsar",
    },
    {
      id: "contextual-menu",
      icon: MoreHorizontal,
      title: "Menu Contextual",
      description: "Ações rápidas em todos os itens (ver, editar, vincular)",
      shortcut: "⋯ (3 pontos)",
      color: "from-orange-500 to-orange-600",
      demo: "Clique nos 3 pontos em qualquer item",
    },
    {
      id: "ai-insights",
      icon: Star,
      title: "Insights IA",
      description: "Sugestões inteligentes e detecção de duplicatas",
      shortcut: "⚡ no header",
      color: "from-indigo-500 to-indigo-600",
      demo: "Clique no ícone ⚡ no cabeçalho",
    },
    {
      id: "sticky-filters",
      icon: Filter,
      title: "Filtros Sticky",
      description: "Filtros que permanecem visíveis durante scroll",
      shortcut: "🔽 no header",
      color: "from-teal-500 to-teal-600",
      demo: "Use os filtros no cabeçalho",
    },
  ];

  const handleTourStart = () => {
    // Iniciar tour guiado
    setCurrentDemo("global-search");
    setIsExpanded(true);
  };

  const handleFeatureDemo = (featureId: string) => {
    setCurrentDemo(featureId);

    // Demonstrações específicas
    switch (featureId) {
      case "global-search":
        // Focar no campo de busca
        setTimeout(() => {
          const searchInput = document.getElementById("global-search");
          searchInput?.focus();
        }, 100);
        break;

      case "crm-navigation":
        navigate("/crm");
        break;

      default:
        // Mostrar demo visual
        break;
    }
  };

  const handleExploreCRM = () => {
    navigate("/crm");
  };

  return (
    <Card className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-indigo-200 dark:border-indigo-700 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <span className="text-indigo-800 dark:text-indigo-300 font-bold">
                🎉 Layout Minimalista Ativado!
              </span>
              <Badge className="ml-2 bg-purple-600 text-white animate-pulse">
                Novo
              </Badge>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-indigo-600 dark:text-indigo-400"
          >
            {isExpanded ? (
              <X className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Resumo Principal */}
        <div className="text-sm text-indigo-700 dark:text-indigo-300">
          <p className="mb-3">
            <strong>CRM-V3-MINIMALIA</strong> está ativo! Novo design SaaS 2025
            com funcionalidades inteligentes para aumentar sua produtividade.
          </p>

          {/* Estatísticas */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
              <div className="text-lg font-bold text-indigo-600">6</div>
              <div className="text-xs">Novas Funcionalidades</div>
            </div>
            <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
              <div className="text-lg font-bold text-purple-600">50%</div>
              <div className="text-xs">Mais Produtividade</div>
            </div>
            <div className="text-center p-3 bg-white/60 dark:bg-gray-800/60 rounded-lg">
              <div className="text-lg font-bold text-pink-600">100%</div>
              <div className="text-xs">Responsivo</div>
            </div>
          </div>

          {/* Ações Principais */}
          <div className="flex gap-3 mb-4">
            <Button
              onClick={handleExploreCRM}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Explorar CRM Renovado
            </Button>
            <Button
              onClick={handleTourStart}
              variant="outline"
              className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Tour Guiado
            </Button>
          </div>
        </div>

        {/* Funcionalidades Expandidas */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-4">
                {/* Atalhos Rápidos */}
                <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
                  <Keyboard className="w-4 h-4" />
                  <AlertDescription>
                    <strong>Atalhos Principais:</strong> ⌘K (Buscar), ⌘C
                    (Cliente), ⌘P (Processo), ⌘T (Tarefa)
                  </AlertDescription>
                </Alert>

                {/* Grid de Funcionalidades */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
                        currentDemo === feature.id
                          ? "bg-white dark:bg-gray-800 border-indigo-300 shadow-md"
                          : "bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                      }`}
                      onClick={() => handleFeatureDemo(feature.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-r ${feature.color} flex-shrink-0`}
                        >
                          <feature.icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                            {feature.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {feature.description}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className="text-xs">
                              {feature.shortcut}
                            </Badge>
                            <ChevronRight className="w-3 h-3 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {/* Demo específico */}
                      {currentDemo === feature.id && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-3 p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded text-xs text-indigo-700 dark:text-indigo-300"
                        >
                          💡 {feature.demo}
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Progresso da Implementação */}
                <div className="bg-white/60 dark:bg-gray-800/60 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Status da Implementação
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Layout Minimalista</span>
                      <span className="text-green-600 font-medium">100%</span>
                    </div>
                    <Progress value={100} className="h-2" />

                    <div className="flex justify-between text-sm">
                      <span>Funcionalidades IA</span>
                      <span className="text-green-600 font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />

                    <div className="flex justify-between text-sm">
                      <span>Integrações</span>
                      <span className="text-yellow-600 font-medium">70%</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                </div>

                {/* Links Rápidos */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/crm/clientes")}
                    className="justify-start"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Clientes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/crm/processos")}
                    className="justify-start"
                  >
                    <Scale className="w-4 h-4 mr-2" />
                    Processos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/diagnostico-conclusao")}
                    className="justify-start"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Diagnóstico
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open("/MINIMALIST_USAGE_GUIDE.md", "_blank")
                    }
                    className="justify-start"
                  >
                    <Palette className="w-4 h-4 mr-2" />
                    Guia Completo
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default NewFeaturesAlert;
