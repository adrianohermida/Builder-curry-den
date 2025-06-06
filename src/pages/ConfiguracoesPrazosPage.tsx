import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Settings,
  Clock,
  Bot,
  Shield,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfiguracoesPrazos } from "@/components/Publicacoes/ConfiguracoesPrazos";
import { useRegrasProcessuais } from "@/contexts/RegrasProcessuaisContext";
import { useAdviseAPI } from "@/hooks/useAdviseAPI";

export default function ConfiguracoesPrazosPage() {
  const { configuracao, regras } = useRegrasProcessuais();
  const { config: configAdvise, ultimaSync } = useAdviseAPI();

  const statusCards = [
    {
      title: "Modo de Contagem",
      value: configuracao.modoContagem,
      icon: Clock,
      color: "blue",
      description:
        configuracao.modoContagem === "ia"
          ? "Usando Inteligência Artificial"
          : configuracao.modoContagem === "automatica"
            ? "Cálculo Automático"
            : "Configuração Manual",
    },
    {
      title: "Tipo Padrão",
      value: configuracao.tipoProcessoPadrao.toUpperCase(),
      icon: Settings,
      color: "green",
      description:
        regras.tiposProcesso[configuracao.tipoProcessoPadrao]?.nome || "N/A",
    },
    {
      title: "Integração IA",
      value: configuracao.integracaoIA ? "Ativa" : "Inativa",
      icon: Bot,
      color: configuracao.integracaoIA ? "green" : "gray",
      description: configuracao.integracaoIA
        ? "Análise automática ativada"
        : "Análise manual",
    },
    {
      title: "API Advise",
      value: configAdvise.ativo ? "Conectada" : "Desconectada",
      icon: Download,
      color: configAdvise.ativo ? "green" : "red",
      description: ultimaSync
        ? `Última sync: ${ultimaSync.toLocaleString("pt-BR")}`
        : "Nunca sincronizado",
    },
  ];

  const colorMap = {
    blue: "border-blue-200 bg-blue-50",
    green: "border-green-200 bg-green-50",
    gray: "border-gray-200 bg-gray-50",
    red: "border-red-200 bg-red-50",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Settings className="h-8 w-8" />
                Configurações de Prazos Processuais
              </h1>
              <p className="text-muted-foreground mt-2">
                Configure regras de cálculo de prazos, integração com APIs e
                automações judiciais
              </p>
            </div>
            <Badge variant="outline" className="bg-blue-50">
              Versão {regras.versao}
            </Badge>
          </div>
        </motion.div>

        {/* Status Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8"
        >
          {statusCards.map((card, index) => (
            <Card
              key={index}
              className={`border-l-4 ${colorMap[card.color as keyof typeof colorMap]}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">
                    {card.title}
                  </CardTitle>
                  <card.icon className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{card.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {card.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Estatísticas Rápidas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid gap-6 md:grid-cols-3 mb-8"
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Regras por Processo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(regras.tiposProcesso).map(([key, processo]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm">{processo.nome}</span>
                    <Badge variant="secondary">
                      {Object.keys(processo.prazos).length} regras
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                Multiplicadores de Partes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(regras.tiposPartes).map(([key, parte]) => (
                  <div key={key} className="flex justify-between items-center">
                    <span className="text-sm capitalize">
                      {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </span>
                    <Badge
                      variant={
                        parte.multiplicador > 1 ? "destructive" : "default"
                      }
                    >
                      {parte.multiplicador}x
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Notificação Antecipada</span>
                  <Badge variant="outline">
                    {configuracao.notificacaoAntecipada} dias
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Backup Local</span>
                  <Badge
                    variant={configuracao.backupLocal ? "default" : "secondary"}
                  >
                    {configuracao.backupLocal ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Feriados Nacionais</span>
                  <Badge variant="outline">
                    {regras.feriados.nacionais.length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Configurações Principais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ConfiguracoesPrazos />
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-4 bg-muted/30 rounded-lg"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>
              Todas as configurações são criptografadas e armazenadas localmente
              em conformidade com a LGPD. Última atualização:{" "}
              {new Date(regras.dataAtualizacao).toLocaleDateString("pt-BR")}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
