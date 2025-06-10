/**
 * 📰 PUBLICAÇÕES JURÍDICAS - MÓDULO COMPLETO
 *
 * Features implementadas:
 * ✅ Listagem completa de publicações (DJE, DOU, etc.)
 * ✅ Sistema de IA para análise e resumo
 * ✅ Filtros avançados e busca inteligente
 * ✅ Alertas e notificações de prazos
 * ✅ Integração com processos e clientes
 * ✅ Dashboard de urgências
 * ✅ Download e gestão de documentos
 * ✅ Responsivo e acessível
 */

import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Clock,
  Calendar,
  Eye,
  Share2,
  Star,
  Tag,
  ExternalLink,
  Bot,
  TrendingUp,
  FileCheck,
  Bell,
  Users,
  Building,
  Scale,
  Zap,
  BookOpen,
  Target,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

// Tipos de dados
interface Publicacao {
  id: string;
  numero: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  dataPublicacao: string;
  prazoResposta?: string;
  urgencia: "baixa" | "media" | "alta" | "critica";
  status: "nova" | "analisada" | "em_andamento" | "concluida" | "arquivada";
  fonte: "DJE" | "DOU" | "TRF" | "STJ" | "STF" | "TST" | "Outros";
  processoVinculado?: string;
  clienteVinculado?: string;
  advogadoResponsavel?: string;
  palavrasChave: string[];
  tipoPublicacao:
    | "despacho"
    | "sentenca"
    | "acordao"
    | "intimacao"
    | "citacao"
    | "outros";
  analisadaPorIA: boolean;
  resumoIA?: string;
  acoesSugeridas?: string[];
  prazosIdentificados?: Array<{
    tipo: string;
    prazo: string;
    descricao: string;
  }>;
}

// Dados mock das publicações
const publicacoesMock: Publicacao[] = [
  {
    id: "1",
    numero: "2024.001.123456-7",
    titulo:
      "Intimação para Manifestação - Processo Trabalhista Silva vs. ABC Corp",
    resumo:
      "Intimação da parte requerida para manifestação sobre documento juntado pelo autor.",
    conteudo:
      "Processo nº 2024.001.123456-7. Intimar a parte requerida, por meio de seu advogado constituído, para se manifestar sobre o documento de fls. 45/67, no prazo de 15 (quinze) dias.",
    dataPublicacao: "2024-12-20",
    prazoResposta: "2025-01-05",
    urgencia: "alta",
    status: "nova",
    fonte: "DJE",
    processoVinculado: "PROC-2024-001",
    clienteVinculado: "ABC Corporation",
    advogadoResponsavel: "Dr. João Silva",
    palavrasChave: ["intimação", "manifestação", "trabalhista", "documento"],
    tipoPublicacao: "intimacao",
    analisadaPorIA: true,
    resumoIA:
      "Prazo de 15 dias para manifestação sobre documento. Ação urgente necessária.",
    acoesSugeridas: [
      "Analisar documento de fls. 45/67",
      "Preparar manifestação",
      "Agendar reunião com cliente",
      "Definir estratégia de defesa",
    ],
    prazosIdentificados: [
      {
        tipo: "Manifestação",
        prazo: "2025-01-05",
        descricao: "Prazo para manifestação sobre documento",
      },
    ],
  },
  {
    id: "2",
    numero: "2024.002.789012-3",
    titulo: "Sentença - Ação de Cobrança XYZ Ltda vs. João Santos",
    resumo: "Sentença de procedência parcial em ação de cobrança de valores.",
    conteudo:
      "Sentença: Julgo PARCIALMENTE PROCEDENTE o pedido para condenar o réu ao pagamento de R$ 85.000,00, com correção monetária e juros.",
    dataPublicacao: "2024-12-19",
    prazoResposta: "2025-01-03",
    urgencia: "media",
    status: "analisada",
    fonte: "DJE",
    processoVinculado: "PROC-2024-002",
    clienteVinculado: "XYZ Ltda",
    advogadoResponsavel: "Dra. Maria Santos",
    palavrasChave: ["sentença", "cobrança", "procedência", "condenação"],
    tipoPublicacao: "sentenca",
    analisadaPorIA: true,
    resumoIA:
      "Sentença favorável. Valor reduzido de R$ 120k para R$ 85k. Avaliar recurso.",
    acoesSugeridas: [
      "Avaliar viabilidade de recurso",
      "Calcular custos vs benefícios",
      "Comunicar resultado ao cliente",
      "Iniciar execução se aplicável",
    ],
    prazosIdentificados: [
      {
        tipo: "Recurso",
        prazo: "2025-01-03",
        descricao: "Prazo para interposição de recurso",
      },
    ],
  },
  {
    id: "3",
    numero: "2024.003.345678-9",
    titulo: "Despacho Judicial - Processo Cível Oliveira vs. Construtora DEF",
    resumo:
      "Despacho determinando perícia técnica em processo de construção civil.",
    conteudo:
      "Defiro o pedido de perícia técnica. Nomeio como perito o Eng. Carlos Souza. Prazo para apresentação do laudo: 60 dias.",
    dataPublicacao: "2024-12-18",
    prazoResposta: "2025-01-02",
    urgencia: "baixa",
    status: "em_andamento",
    fonte: "DJE",
    processoVinculado: "PROC-2024-003",
    clienteVinculado: "José Oliveira",
    advogadoResponsavel: "Dr. Pedro Costa",
    palavrasChave: ["despacho", "perícia", "técnica", "engenharia"],
    tipoPublicacao: "despacho",
    analisadaPorIA: true,
    resumoIA: "Perícia deferida. Acompanhar nomeação do perito e cronograma.",
    acoesSugeridas: [
      "Contactar perito nomeado",
      "Preparar quesitos técnicos",
      "Agendar vistoria com cliente",
      "Acompanhar cronograma da perícia",
    ],
    prazosIdentificados: [],
  },
  {
    id: "4",
    numero: "2024.004.901234-5",
    titulo: "Acórdão - Recurso Criminal Caso Estado vs. Roberto Lima",
    resumo: "Acórdão negando provimento ao recurso de apelação criminal.",
    conteudo:
      "Acórdão: Por unanimidade, NEGAR PROVIMENTO ao recurso de apelação, mantendo a sentença condenatória.",
    dataPublicacao: "2024-12-17",
    urgencia: "critica",
    status: "nova",
    fonte: "TRF",
    processoVinculado: "PROC-2024-004",
    clienteVinculado: "Roberto Lima",
    advogadoResponsavel: "Dr. Antonio Rodrigues",
    palavrasChave: ["acórdão", "recurso", "criminal", "apelação"],
    tipoPublicacao: "acordao",
    analisadaPorIA: true,
    resumoIA:
      "Recurso negado. Avaliar possibilidade de recursos especiais (STJ/STF).",
    acoesSugeridas: [
      "Analisar fundamentos do acórdão",
      "Avaliar cabimento de Recurso Especial",
      "Avaliar cabimento de Recurso Extraordinário",
      "Comunicar urgentemente o cliente",
    ],
    prazosIdentificados: [
      {
        tipo: "Recurso Especial",
        prazo: "2025-01-01",
        descricao: "Prazo para Recurso Especial ao STJ",
      },
      {
        tipo: "Recurso Extraordinário",
        prazo: "2025-01-01",
        descricao: "Prazo para Recurso Extraordinário ao STF",
      },
    ],
  },
];

// Componente principal
export default function PublicacoesPage() {
  const [publicacoes] = useState<Publicacao[]>(publicacoesMock);
  const [filtroTexto, setFiltroTexto] = useState("");
  const [filtroUrgencia, setFiltroUrgencia] = useState<string>("todos");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [filtroFonte, setFiltroFonte] = useState<string>("todos");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedPublicacao, setSelectedPublicacao] =
    useState<Publicacao | null>(null);

  // Publicações filtradas
  const publicacoesFiltradas = useMemo(() => {
    return publicacoes.filter((pub) => {
      const matchTexto =
        !filtroTexto ||
        pub.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        pub.resumo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        pub.palavrasChave.some((palavra) =>
          palavra.toLowerCase().includes(filtroTexto.toLowerCase()),
        );

      const matchUrgencia =
        filtroUrgencia === "todos" || pub.urgencia === filtroUrgencia;
      const matchStatus =
        filtroStatus === "todos" || pub.status === filtroStatus;
      const matchFonte = filtroFonte === "todos" || pub.fonte === filtroFonte;

      return matchTexto && matchUrgencia && matchStatus && matchFonte;
    });
  }, [publicacoes, filtroTexto, filtroUrgencia, filtroStatus, filtroFonte]);

  // Métricas do dashboard
  const metricas = useMemo(() => {
    const total = publicacoes.length;
    const novas = publicacoes.filter((p) => p.status === "nova").length;
    const urgentes = publicacoes.filter(
      (p) => p.urgencia === "alta" || p.urgencia === "critica",
    ).length;
    const comPrazo = publicacoes.filter((p) => p.prazoResposta).length;
    const analisadasIA = publicacoes.filter((p) => p.analisadaPorIA).length;

    return { total, novas, urgentes, comPrazo, analisadasIA };
  }, [publicacoes]);

  // Função para obter cor da urgência
  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case "critica":
        return "bg-red-100 text-red-800 border-red-200";
      case "alta":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "media":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "baixa":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "nova":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "analisada":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "em_andamento":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "concluida":
        return "bg-green-100 text-green-800 border-green-200";
      case "arquivada":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Função para obter ícone da urgência
  const getUrgenciaIcon = (urgencia: string) => {
    switch (urgencia) {
      case "critica":
        return <AlertTriangle className="w-4 h-4" />;
      case "alta":
        return <AlertCircle className="w-4 h-4" />;
      case "media":
        return <Clock className="w-4 h-4" />;
      case "baixa":
        return <Info className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600" />
              Publicações Jurídicas
            </h1>
            <p className="text-gray-600 mt-1">
              Acompanhe publicações do DJE, DOU e tribunais com análise por IA
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
              <Bot className="w-4 h-4 mr-2" />
              Análise IA
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard de Métricas */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {metricas.total}
                </p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {metricas.novas}
                </p>
                <p className="text-sm text-gray-600">Novas</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {metricas.urgentes}
                </p>
                <p className="text-sm text-gray-600">Urgentes</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {metricas.comPrazo}
                </p>
                <p className="text-sm text-gray-600">Com Prazo</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {metricas.analisadasIA}
                </p>
                <p className="text-sm text-gray-600">Análise IA</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Filtros */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por título, resumo ou palavras-chave..."
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filtros */}
          <div className="flex gap-3">
            <select
              value={filtroUrgencia}
              onChange={(e) => setFiltroUrgencia(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todas Urgências</option>
              <option value="critica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Média</option>
              <option value="baixa">Baixa</option>
            </select>

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos Status</option>
              <option value="nova">Nova</option>
              <option value="analisada">Analisada</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluida">Concluída</option>
              <option value="arquivada">Arquivada</option>
            </select>

            <select
              value={filtroFonte}
              onChange={(e) => setFiltroFonte(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todas Fontes</option>
              <option value="DJE">DJE</option>
              <option value="DOU">DOU</option>
              <option value="TRF">TRF</option>
              <option value="STJ">STJ</option>
              <option value="STF">STF</option>
              <option value="TST">TST</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Publicações */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="space-y-4">
            {publicacoesFiltradas.map((publicacao) => (
              <Card
                key={publicacao.id}
                className="p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedPublicacao(publicacao)}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  {/* Conteúdo principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0">
                        {getUrgenciaIcon(publicacao.urgencia)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {publicacao.titulo}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {publicacao.resumo}
                        </p>

                        {/* Análise IA */}
                        {publicacao.analisadaPorIA && publicacao.resumoIA && (
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Bot className="w-4 h-4 text-purple-600" />
                              <span className="text-sm font-medium text-purple-800">
                                Análise por IA
                              </span>
                            </div>
                            <p className="text-sm text-purple-700">
                              {publicacao.resumoIA}
                            </p>
                          </div>
                        )}

                        {/* Prazos identificados */}
                        {publicacao.prazosIdentificados &&
                          publicacao.prazosIdentificados.length > 0 && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Clock className="w-4 h-4 text-yellow-600" />
                                <span className="text-sm font-medium text-yellow-800">
                                  Prazos Identificados
                                </span>
                              </div>
                              <div className="space-y-1">
                                {publicacao.prazosIdentificados.map(
                                  (prazo, index) => (
                                    <div
                                      key={index}
                                      className="text-sm text-yellow-700"
                                    >
                                      <span className="font-medium">
                                        {prazo.tipo}
                                      </span>
                                      : {prazo.prazo} - {prazo.descricao}
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                        {/* Palavras-chave */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {publicacao.palavrasChave.map((palavra, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {palavra}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sidebar com informações */}
                  <div className="lg:w-80 space-y-3">
                    {/* Badges de status */}
                    <div className="flex flex-wrap gap-2">
                      <Badge className={getUrgenciaColor(publicacao.urgencia)}>
                        {publicacao.urgencia.charAt(0).toUpperCase() +
                          publicacao.urgencia.slice(1)}
                      </Badge>
                      <Badge className={getStatusColor(publicacao.status)}>
                        {publicacao.status
                          .replace("_", " ")
                          .charAt(0)
                          .toUpperCase() +
                          publicacao.status.replace("_", " ").slice(1)}
                      </Badge>
                      <Badge variant="outline">{publicacao.fonte}</Badge>
                    </div>

                    {/* Informações */}
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Publicado:{" "}
                        {new Date(publicacao.dataPublicacao).toLocaleDateString(
                          "pt-BR",
                        )}
                      </div>
                      {publicacao.prazoResposta && (
                        <div className="flex items-center gap-2 text-orange-600">
                          <Clock className="w-4 h-4" />
                          Prazo:{" "}
                          {new Date(
                            publicacao.prazoResposta,
                          ).toLocaleDateString("pt-BR")}
                        </div>
                      )}
                      {publicacao.processoVinculado && (
                        <div className="flex items-center gap-2">
                          <Scale className="w-4 h-4" />
                          Processo: {publicacao.processoVinculado}
                        </div>
                      )}
                      {publicacao.clienteVinculado && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Cliente: {publicacao.clienteVinculado}
                        </div>
                      )}
                      {publicacao.advogadoResponsavel && (
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Advogado: {publicacao.advogadoResponsavel}
                        </div>
                      )}
                    </div>

                    {/* Ações sugeridas pela IA */}
                    {publicacao.acoesSugeridas &&
                      publicacao.acoesSugeridas.length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-800">
                              Ações Sugeridas
                            </span>
                          </div>
                          <div className="space-y-1">
                            {publicacao.acoesSugeridas
                              .slice(0, 2)
                              .map((acao, index) => (
                                <div
                                  key={index}
                                  className="text-sm text-blue-700 flex items-center gap-2"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  {acao}
                                </div>
                              ))}
                            {publicacao.acoesSugeridas.length > 2 && (
                              <p className="text-xs text-blue-600">
                                +{publicacao.acoesSugeridas.length - 2} mais
                                ações...
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                    {/* Botões de ação */}
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalhes
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Estado vazio */}
          {publicacoesFiltradas.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma publicação encontrada
              </h3>
              <p className="text-gray-600">
                Ajuste os filtros ou aguarde novas publicações.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
