import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Bell,
  Clock,
  AlertTriangle,
  Building,
  Calendar,
  Filter,
  Search,
  Eye,
  EyeOff,
  Bot,
  Download,
  Zap,
  CheckCircle,
  Users,
  Gavel,
  ExternalLink,
  Star,
  Archive,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PublicacaoDetalhada,
  PublicacaoData,
} from "@/components/CRM/PublicacaoDetalhada";
import { toast } from "sonner";

export default function PublicacoesExample() {
  const [selectedPublicacao, setSelectedPublicacao] =
    useState<PublicacaoData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUrgency, setFilterUrgency] = useState("");
  const [filterTribunal, setFilterTribunal] = useState("");
  const [publicacoes, setPublicacoes] = useState<PublicacaoData[]>([
    {
      id: "pub_001",
      numeroProcesso: "0001234-56.2024.8.26.0001",
      tribunal: "TJSP - Tribunal de Justiça de São Paulo",
      dataPublicacao: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      conteudo: `INTIMAÇÃO

O(A) DOUTOR(A) JOÃO SILVA, MM. JUIZ(A) DE DIREITO DA 1ª VARA CÍVEL DO FORO CENTRAL DA COMARCA DE SÃO PAULO, ESTADO DE SÃO PAULO, na forma da Lei, etc.

FAZ SABER aos que o presente edital virem ou dele conhecimento tiverem que, nos autos da Ação de Cobrança, Processo nº 0001234-56.2024.8.26.0001, requerente BANCO EXEMPLO S/A, requerido JOÃO DOS SANTOS, foi determinada a INTIMAÇÃO do requerido para, no prazo de 15 (quinze) dias, apresentar contestação, sob pena de revelia e confissão ficta.

O referido processo trata de cobrança de dívida no valor de R$ 50.000,00, decorrente de contrato de financiamento não quitado. 

PRAZO: 15 dias corridos a partir desta publicação.

E, para que chegue ao conhecimento de todos e ninguém possa alegar ignorância, mandou expedir o presente edital que será publicado uma vez no Diário Oficial.

São Paulo, 15 de Janeiro de 2025.`,
      tipo: "intimacao",
      partes: ["BANCO EXEMPLO S/A", "JOÃO DOS SANTOS"],
      urgencia: "alta",
      status: "nao_lida",
      origem: "djen",
      metadados: {
        segredoJustica: false,
        valorCausa: 50000,
        classe: "Ação de Cobrança",
        assunto: "Cobrança de Dívida Bancária",
      },
      visivelCliente: true,
      tags: ["cobrança", "financiamento", "contestação"],
    },
    {
      id: "pub_002",
      numeroProcesso: "0007890-12.2024.8.26.0002",
      tribunal: "TJSP - Tribunal de Justiça de São Paulo",
      dataPublicacao: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      conteudo: `SENTENÇA

Vistos.

MARIA SANTOS ajuizou ação de indenização por danos morais em face de EMPRESA XYZ LTDA., alegando que teve seu nome indevidamente inscrito nos órgãos de proteção ao crédito.

A empresa ré contestou a ação, alegando que o débito era legítimo e que agiu no exercício regular de direito.

É o relatório. DECIDO.

As provas dos autos demonstram que a inscrição do nome da autora foi indevida, uma vez que o débito já havia sido quitado anteriormente. A empresa ré não conseguiu comprovar a legitimidade da cobrança.

Configurado está o dano moral, que dispensa prova específica. O valor da indenização deve ser fixado de forma a reparar o dano e desencorajar a repetição da conduta.

DISPOSITIVO:
Julgo PROCEDENTE a ação para condenar a ré ao pagamento de R$ 10.000,00 a título de danos morais, corrigidos monetariamente e acrescidos de juros de mora de 1% ao mês, ambos a partir desta data.

Condeno a ré ao pagamento das custas processuais e honorários advocatícios fixados em 20% sobre o valor da condenação.

P.R.I.C.

São Paulo, 14 de Janeiro de 2025.

Dr. Carlos Mendonça
Juiz de Direito`,
      tipo: "sentenca",
      partes: ["MARIA SANTOS", "EMPRESA XYZ LTDA."],
      urgencia: "urgente",
      status: "lida",
      origem: "djen",
      metadados: {
        segredoJustica: false,
        valorCausa: 10000,
        classe: "Ação de Indenização",
        assunto: "Danos Morais - Inscrição Indevida",
      },
      visivelCliente: false,
      tags: ["danos morais", "indenização", "procedente"],
    },
    {
      id: "pub_003",
      numeroProcesso: "5001234-67.2024.5.02.0001",
      tribunal: "TRT 2ª Região - São Paulo",
      dataPublicacao: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      conteudo: `DESPACHO

Vistos.

Trata-se de Reclamação Trabalhista ajuizada por JOSÉ SILVA em face de METALÚRGICA ABC LTDA., pleiteando o pagamento de verbas rescisórias, horas extras e adicional noturno.

A empresa reclamada apresentou defesa alegando que todas as verbas foram pagas corretamente e que não há horas extras a serem pagas.

Analisando os autos, verifico que há necessidade de prova pericial contábil para apuração dos valores efetivamente devidos.

DEFIRO a realização de perícia contábil.

Nomeio como perito o Sr. JOÃO CONTADOR, CRC nº 123456/SP.

Fixo os honorários periciais em R$ 3.000,00, a serem depositados pela reclamante no prazo de 15 dias.

O perito deverá apresentar o laudo no prazo de 30 dias após o depósito dos honorários.

Intimem-se as partes.

São Paulo, 15 de Janeiro de 2025.

Dra. Ana Paula Silva
Juíza do Trabalho`,
      tipo: "despacho",
      partes: ["JOSÉ SILVA", "METALÚRGICA ABC LTDA."],
      urgencia: "media",
      status: "nao_lida",
      origem: "domicilio_judicial",
      metadados: {
        segredoJustica: false,
        valorCausa: 25000,
        classe: "Reclamação Trabalhista",
        assunto: "Verbas Rescisórias e Horas Extras",
      },
      visivelCliente: true,
      tags: ["trabalhista", "perícia", "horas extras"],
    },
    {
      id: "pub_004",
      numeroProcesso: "0010001-23.2024.8.26.0003",
      tribunal: "TJSP - Tribunal de Justiça de São Paulo",
      dataPublicacao: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      conteudo: `DECISÃO INTERLOCUTÓRIA

Vistos.

Trata-se de pedido de tutela antecipada formulado por CONSTRUTORA XYZ LTDA. em face do MUNICÍPIO DE SÃO PAULO, pleiteando a suspensão de multa aplicada por suposta irregularidade em obra.

Analisando os documentos apresentados, verifico que estão presentes os requisitos para a concessão da tutela antecipada:

1) Probabilidade do direito (fumus boni iuris): Os documentos demonstram que a obra estava devidamente licenciada e dentro dos parâmetros legais.

2) Perigo de dano irreparável (periculum in mora): A manutenção da multa pode causar prejuízos irreparáveis à requerente, impedindo o prosseguimento da obra e causando perdas financeiras.

Assim, DEFIRO O PEDIDO DE TUTELA ANTECIPADA para suspender a exigibilidade da multa no valor de R$ 500.000,00, até decisão final do mérito.

Oficie-se ao Município para cumprimento desta decisão no prazo de 48 horas.

Cite-se o requerido para contestar no prazo legal.

Int.

São Paulo, 14 de Janeiro de 2025.

Dr. Roberto Fernandes
Juiz de Direito`,
      tipo: "despacho",
      partes: ["CONSTRUTORA XYZ LTDA.", "MUNICÍPIO DE SÃO PAULO"],
      urgencia: "urgente",
      status: "nao_lida",
      origem: "djen",
      metadados: {
        segredoJustica: false,
        valorCausa: 500000,
        classe: "Mandado de Segurança",
        assunto: "Suspensão de Multa Administrativa",
      },
      visivelCliente: true,
      tags: ["tutela antecipada", "multa", "município", "construção"],
    },
  ]);

  const handleOpenDetail = (publicacao: PublicacaoData) => {
    setSelectedPublicacao(publicacao);
    setIsDetailModalOpen(true);
  };

  const handleUpdatePublicacao = (updatedPublicacao: PublicacaoData) => {
    setPublicacoes((prev) =>
      prev.map((pub) =>
        pub.id === updatedPublicacao.id ? updatedPublicacao : pub,
      ),
    );
  };

  const filteredPublicacoes = publicacoes.filter((pub) => {
    const matchesSearch =
      pub.numeroProcesso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.conteudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.tribunal.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesUrgency =
      filterUrgency === "" || pub.urgencia === filterUrgency;
    const matchesTribunal =
      filterTribunal === "" || pub.tribunal.includes(filterTribunal);

    return matchesSearch && matchesUrgency && matchesTribunal;
  });

  const urgenciaColors = {
    baixa: "bg-green-100 text-green-800 border-green-200",
    media: "bg-yellow-100 text-yellow-800 border-yellow-200",
    alta: "bg-orange-100 text-orange-800 border-orange-200",
    urgente: "bg-red-100 text-red-800 border-red-200",
  };

  const urgenciaIcons = {
    baixa: CheckCircle,
    media: Clock,
    alta: AlertTriangle,
    urgente: Zap,
  };

  const statusColors = {
    nao_lida: "bg-blue-100 text-blue-800",
    lida: "bg-gray-100 text-gray-800",
    processada: "bg-green-100 text-green-800",
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bell className="h-8 w-8" />
              Publicações Judiciais
            </h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe publicações, calcule prazos e gerencie ações processuais
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
            <Button size="sm">
              <Bot className="h-4 w-4 mr-2" />
              Análise IA
            </Button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{publicacoes.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Não Lidas</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {publicacoes.filter((p) => p.status === "nao_lida").length}
                  </p>
                </div>
                <Bell className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Urgentes</p>
                  <p className="text-2xl font-bold text-red-600">
                    {publicacoes.filter((p) => p.urgencia === "urgente").length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Com Prazo</p>
                  <p className="text-2xl font-bold text-green-600">
                    {publicacoes.filter((p) => p.tipo === "intimacao").length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.div>

      {/* Filtros */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Processo, conteúdo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Urgência</label>
                <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as urgências" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas as urgências</SelectItem>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tribunal</label>
                <Select
                  value={filterTribunal}
                  onValueChange={setFilterTribunal}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tribunais" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os tribunais</SelectItem>
                    <SelectItem value="TJSP">TJSP</SelectItem>
                    <SelectItem value="TRT">TRT</SelectItem>
                    <SelectItem value="TRF">TRF</SelectItem>
                    <SelectItem value="STJ">STJ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Ações</label>
                <Button variant="outline" className="w-full">
                  <Archive className="h-4 w-4 mr-2" />
                  Arquivar Selecionadas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de Publicações */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-4"
      >
        {filteredPublicacoes.map((publicacao, index) => {
          const UrgenciaIcon = urgenciaIcons[publicacao.urgencia];

          return (
            <motion.div
              key={publicacao.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer hover:shadow-lg transition-all duration-200 ${
                  publicacao.status === "nao_lida"
                    ? "border-l-4 border-l-blue-500"
                    : ""
                }`}
                onClick={() => handleOpenDetail(publicacao)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={urgenciaColors[publicacao.urgencia]}>
                          <UrgenciaIcon className="h-3 w-3 mr-1" />
                          {publicacao.urgencia.charAt(0).toUpperCase() +
                            publicacao.urgencia.slice(1)}
                        </Badge>
                        <Badge className={statusColors[publicacao.status]}>
                          {publicacao.status === "nao_lida"
                            ? "Não Lida"
                            : publicacao.status === "lida"
                              ? "Lida"
                              : "Processada"}
                        </Badge>
                        <Badge variant="outline">{publicacao.tipo}</Badge>
                        {publicacao.visivelCliente && (
                          <Badge variant="outline" className="bg-green-50">
                            <Eye className="h-3 w-3 mr-1" />
                            Cliente
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-semibold text-lg mb-2">
                        Processo: {publicacao.numeroProcesso}
                      </h3>

                      <div className="grid gap-2 md:grid-cols-2 mb-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building className="h-4 w-4" />
                          {publicacao.tribunal}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {new Date(
                            publicacao.dataPublicacao,
                          ).toLocaleDateString("pt-BR")}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Gavel className="h-4 w-4" />
                          {publicacao.metadados?.classe}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {publicacao.partes.length} parte(s)
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {publicacao.conteudo.substring(0, 200)}...
                      </p>

                      {publicacao.tags && publicacao.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {publicacao.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(publicacao);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>

                      {publicacao.status === "nao_lida" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            toast.success("Marcada como lida");
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marcar Lida
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toast.success("Análise IA iniciada");
                        }}
                      >
                        <Bot className="h-4 w-4 mr-2" />
                        IA
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}

        {filteredPublicacoes.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nenhuma publicação encontrada
              </h3>
              <p className="text-muted-foreground">
                Ajuste os filtros ou tente uma busca diferente
              </p>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Modal de Detalhes */}
      {selectedPublicacao && (
        <PublicacaoDetalhada
          publicacao={selectedPublicacao}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onUpdate={handleUpdatePublicacao}
        />
      )}
    </div>
  );
}
