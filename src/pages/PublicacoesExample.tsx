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
import { PublicacaoDetalhada } from "@/components/CRM/PublicacaoDetalhada";
import { PublicacaoData } from "@/hooks/useProcessualIntelligence";
import { toast } from "sonner";

export default function PublicacoesExample() {
  const [selectedPublicacao, setSelectedPublicacao] =
    useState<PublicacaoData | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterUrgency, setFilterUrgency] = useState("");
  const [filterTribunal, setFilterTribunal] = useState("");

  // Dados de exemplo das publicações
  const publicacoes: PublicacaoData[] = [
    {
      id: "pub_001",
      titulo: "Intimação para Contestação - Ação de Cobrança",
      conteudo: `INTIMAÇÃO

      O(A) DOUTOR(A) JOÃO SILVA, MM. JUIZ(A) DE DIREITO DA 1ª VARA CÍVEL DO FORO CENTRAL DA COMARCA DE SÃO PAULO, ESTADO DE SÃO PAULO, na forma da Lei, etc.

      FAZ SABER aos que o presente edital virem ou dele conhecimento tiverem que, nos autos da Ação de Cobrança, Processo nº 0001234-56.2024.8.26.0001, requerente BANCO EXEMPLO S/A, requerido JOÃO DOS SANTOS, foi determinada a INTIMAÇÃO do requerido para, no prazo de 15 (quinze) dias, apresentar contestação, sob pena de revelia e confissão ficta.

      O referido processo trata de cobrança de dívida no valor de R$ 50.000,00, decorrente de contrato de financiamento não quitado. 

      PRAZO: 15 dias corridos a partir desta publicação.

      E, para que chegue ao conhecimento de todos e ninguém possa alegar ignorância, mandou expedir o presente edital que será publicado uma vez no Diário Oficial.

      São Paulo, 15 de Janeiro de 2025.`,
      data: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      tribunal: "TJSP - Tribunal de Justiça de São Paulo",
      tipo: "Intimação para Contestação",
      numeroProcesso: "0001234-56.2024.8.26.0001",
      prazo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 13).toISOString(), // 13 dias
      assunto: "Ação de Cobrança",
      lida: false,
      visivel_cliente: true,
    },
    {
      id: "pub_002",
      titulo: "Sentença - Ação de Indenização por Danos Morais",
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
      data: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      tribunal: "TJSP - Tribunal de Justiça de São Paulo",
      tipo: "Sentença",
      numeroProcesso: "0007890-12.2024.8.26.0002",
      assunto: "Indenização por Danos Morais",
      lida: true,
      visivel_cliente: true,
    },
    {
      id: "pub_003",
      titulo: "Citação - Ação de Execução",
      conteudo: `MANDADO DE CITAÇÃO

      EXECUÇÃO DE TÍTULO EXTRAJUDICIAL
      Processo nº 0003456-78.2024.8.26.0003

      O(A) DOUTOR(A) ANA PAULA FERREIRA, MM. JUIZ(A) DE DIREITO DA 2ª VARA CÍVEL, determina a CITAÇÃO de JOSÉ ANTONIO SILVA, CPF 123.456.789-00, para:

      1) Efetuar o pagamento da dívida no valor de R$ 75.000,00, corrigida monetariamente e acrescida de juros, no prazo de 03 (três) dias;

      2) Caso não efetue o pagamento, nomear bens à penhora, sob pena de serem penhorados tantos bens quantos bastem para garantir a execução;

      3) Apresentar embargos à execução no prazo de 15 (quinze) dias, caso queira se opor à execução.

      ADVERTÊNCIA: O não cumprimento da obrigação no prazo estabelecido acarretará o bloqueio de valores nas contas bancárias e a penhora de bens.

      São Paulo, 13 de Janeiro de 2025.`,
      data: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      tribunal: "TJSP - Tribunal de Justiça de São Paulo",
      tipo: "Citação",
      numeroProcesso: "0003456-78.2024.8.26.0003",
      prazo: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(), // 1 dia
      assunto: "Execução de Título Extrajudicial",
      lida: false,
      visivel_cliente: false,
    },
    {
      id: "pub_004",
      titulo: "Despacho - Análise de Petição Inicial",
      conteudo: `DESPACHO

      Vistos.

      Recebo a inicial e determino:

      1) A emenda da petição inicial para que o autor esclareça melhor os fatos constitutivos do seu direito, especificando as datas e circunstâncias dos alegados danos;

      2) Recolhimento das custas processuais no valor de R$ 500,00;

      3) Juntada de procuração com poderes específicos;

      4) Apresentação de documentos que comprovem a relação jurídica alegada.

      Prazo: 15 (quinze) dias para cumprimento.

      Após o cumprimento das determinações, dê-se vista ao Ministério Público e tornem conclusos para decisão sobre o processamento da ação.

      Intimem-se.

      São Paulo, 12 de Janeiro de 2025.

      Dra. Fernanda Costa
      Juíza de Direito`,
      data: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
      tribunal: "TJSP - Tribunal de Justiça de São Paulo",
      tipo: "Despacho",
      numeroProcesso: "0005678-90.2024.8.26.0004",
      prazo: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12).toISOString(), // 12 dias
      assunto: "Ação de Reparação de Danos",
      lida: true,
      visivel_cliente: true,
    },
  ];

  const handleOpenDetail = (publicacao: PublicacaoData) => {
    setSelectedPublicacao(publicacao);
    setIsDetailModalOpen(true);
  };

  const handleUpdatePublicacao = (updatedPublicacao: PublicacaoData) => {
    // Aqui você atualizaria a publicação na sua base de dados
    console.log("Publicação atualizada:", updatedPublicacao);
    toast.success("Publicação atualizada com sucesso");
  };

  const getUrgencyFromPrazo = (
    prazo?: string,
  ): "BAIXA" | "MEDIA" | "ALTA" | "CRITICA" => {
    if (!prazo) return "BAIXA";

    const now = new Date();
    const prazoDate = new Date(prazo);
    const diffDays = Math.ceil(
      (prazoDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDays <= 1) return "CRITICA";
    if (diffDays <= 3) return "ALTA";
    if (diffDays <= 7) return "MEDIA";
    return "BAIXA";
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "CRITICA":
        return "bg-red-500 text-white";
      case "ALTA":
        return "bg-orange-500 text-white";
      case "MEDIA":
        return "bg-yellow-500 text-white";
      default:
        return "bg-green-500 text-white";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "CRITICA":
        return <AlertTriangle className="h-4 w-4" />;
      case "ALTA":
        return <Clock className="h-4 w-4" />;
      case "MEDIA":
        return <Eye className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Filtrar publicações
  const filteredPublicacoes = publicacoes.filter((pub) => {
    const matchesSearch =
      pub.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.conteudo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pub.numeroProcesso && pub.numeroProcesso.includes(searchTerm));

    const urgency = getUrgencyFromPrazo(pub.prazo);
    const matchesUrgency = !filterUrgency || urgency === filterUrgency;
    const matchesTribunal =
      !filterTribunal || pub.tribunal.includes(filterTribunal);

    return matchesSearch && matchesUrgency && matchesTribunal;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Bell className="h-8 w-8 text-[rgb(var(--theme-primary))]" />
            <span>Publicações Jurídicas</span>
          </h1>
          <p className="text-muted-foreground">
            Acompanhe publicações, intimações e sentenças dos tribunais
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button>
            <Bot className="h-4 w-4 mr-2" />
            Análise IA
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar publicações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterUrgency} onValueChange={setFilterUrgency}>
              <SelectTrigger>
                <SelectValue placeholder="Urgência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="CRITICA">Crítica</SelectItem>
                <SelectItem value="ALTA">Alta</SelectItem>
                <SelectItem value="MEDIA">Média</SelectItem>
                <SelectItem value="BAIXA">Baixa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTribunal} onValueChange={setFilterTribunal}>
              <SelectTrigger>
                <SelectValue placeholder="Tribunal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="TJSP">TJSP</SelectItem>
                <SelectItem value="TRF">TRF</SelectItem>
                <SelectItem value="TST">TST</SelectItem>
                <SelectItem value="STJ">STJ</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setFilterUrgency("");
                setFilterTribunal("");
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Publicações */}
      <div className="grid grid-cols-1 gap-4">
        {filteredPublicacoes.map((publicacao, index) => {
          const urgency = getUrgencyFromPrazo(publicacao.prazo);

          return (
            <motion.div
              key={publicacao.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  !publicacao.lida
                    ? "border-l-4 border-l-[rgb(var(--theme-primary))]"
                    : ""
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-2">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {publicacao.tribunal}
                          </span>
                        </div>
                        <Badge variant="outline">{publicacao.tipo}</Badge>
                        <Badge className={getUrgencyColor(urgency)}>
                          {getUrgencyIcon(urgency)}
                          <span className="ml-1">{urgency}</span>
                        </Badge>
                        {!publicacao.lida && (
                          <Badge variant="secondary">
                            <Bell className="h-3 w-3 mr-1" />
                            Nova
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold">
                        {publicacao.titulo}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            Publicado em{" "}
                            {new Date(publicacao.data).toLocaleDateString(
                              "pt-BR",
                            )}
                          </span>
                        </div>
                        {publicacao.numeroProcesso && (
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono">
                              {publicacao.numeroProcesso}
                            </span>
                          </div>
                        )}
                        {publicacao.prazo && (
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>
                              Prazo:{" "}
                              {new Date(publicacao.prazo).toLocaleDateString(
                                "pt-BR",
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {publicacao.conteudo.substring(0, 200)}...
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {publicacao.lida ? (
                            <Eye className="h-4 w-4 text-green-500" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="text-xs text-muted-foreground">
                            {publicacao.lida ? "Lida" : "Não lida"}
                          </span>
                          {publicacao.visivel_cliente && (
                            <>
                              <span className="text-xs text-muted-foreground">
                                •
                              </span>
                              <span className="text-xs text-blue-600">
                                Visível no portal
                              </span>
                            </>
                          )}
                        </div>
                        <Button
                          onClick={() => handleOpenDetail(publicacao)}
                          size="sm"
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredPublicacoes.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">
              Nenhuma publicação encontrada
            </h3>
            <p className="text-muted-foreground text-center">
              Tente ajustar os filtros ou aguarde novas publicações dos
              tribunais.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal de Detalhes */}
      <PublicacaoDetalhada
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        publicacao={selectedPublicacao}
        onUpdate={handleUpdatePublicacao}
      />
    </div>
  );
}
