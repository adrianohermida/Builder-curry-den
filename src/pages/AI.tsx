/**
 * 🤖 IA JURÍDICA - MÓDULO DE INTELIGÊNCIA ARTIFICIAL
 *
 * Consolidação das funcionalidades de IA jurídica:
 * - Análise de documentos
 * - Geração de pareceres
 * - Pesquisa de jurisprudência
 * - Assistente virtual
 */

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Brain,
  FileText,
  Search,
  MessageSquare,
  Upload,
  Download,
  Sparkles,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react";

const AIJuridica: React.FC = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  const aiFeatures = [
    {
      id: "doc-analysis",
      title: "Análise de Documentos",
      description: "IA analisa contratos, petições e documentos jurídicos",
      icon: FileText,
      status: "Ativo",
      usage: "245 análises este mês",
    },
    {
      id: "jurisprudence",
      title: "Pesquisa de Jurisprudência",
      description: "Busca inteligente em bancos de jurisprudência",
      icon: Search,
      status: "Ativo",
      usage: "1.2k pesquisas realizadas",
    },
    {
      id: "assistant",
      title: "Assistente Virtual",
      description: "Chat com IA especializada em direito brasileiro",
      icon: MessageSquare,
      status: "Beta",
      usage: "89 conversas ativas",
    },
    {
      id: "report-gen",
      title: "Geração de Relatórios",
      description: "Criação automática de pareceres e resumos",
      icon: Sparkles,
      status: "Em breve",
      usage: "Aguardando lançamento",
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Brain className="h-8 w-8 mr-3 text-primary" />
            IA Jurídica
          </h1>
          <p className="text-muted-foreground mt-2">
            Inteligência artificial especializada para o direito brasileiro
          </p>
        </div>
        <div className="flex space-x-2">
          <Badge variant="outline" className="flex items-center">
            <Zap className="h-3 w-3 mr-1" />
            Sistema Ativo
          </Badge>
          <Badge variant="secondary">GPT-4 Jurídico</Badge>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Análises Realizadas
                </p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-600">+23% este mês</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Precisão Média
                </p>
                <p className="text-2xl font-bold">94.2%</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-muted-foreground">Alta confiabilidade</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tempo Economizado
                </p>
                <p className="text-2xl font-bold">156h</p>
              </div>
              <Zap className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-muted-foreground">Neste mês</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Usuários Ativos
                </p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <Brain className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2 flex items-center text-sm">
              <span className="text-muted-foreground">Do escritório</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funcionalidades */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="analysis">Análise</TabsTrigger>
          <TabsTrigger value="search">Pesquisa</TabsTrigger>
          <TabsTrigger value="assistant">Assistente</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {aiFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {feature.title}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          feature.status === "Ativo"
                            ? "default"
                            : feature.status === "Beta"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {feature.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {feature.usage}
                      </span>
                      <Button
                        size="sm"
                        disabled={feature.status === "Em breve"}
                      >
                        {feature.status === "Em breve" ? "Em breve" : "Usar"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Análise de Documentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Envie um documento para análise
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Formatos suportados: PDF, DOC, DOCX (até 10MB)
                  </p>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Selecionar Arquivo
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Pesquisa de Jurisprudência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-6 bg-muted/50 rounded-lg text-center">
                  <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Pesquisa Inteligente de Jurisprudência
                  </h3>
                  <p className="text-muted-foreground">
                    Funcionalidade em desenvolvimento
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assistant">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                Assistente Virtual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-6 bg-muted/50 rounded-lg text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Chat com IA Jurídica
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Versão Beta - Funcionalidade em desenvolvimento
                  </p>
                  <Badge variant="secondary">Em Breve</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIJuridica;
