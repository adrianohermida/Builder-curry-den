import { useState } from "react";
import {
  Brain,
  Plus,
  FileText,
  Sparkles,
  Download,
  Eye,
  Edit,
  History,
  Search,
  Filter,
  Wand2,
  Clock,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AI() {
  const [activeTab, setActiveTab] = useState("generator");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [prompt, setPrompt] = useState("");

  const documentTemplates = [
    {
      id: "peticao_inicial",
      name: "Petição Inicial",
      description: "Petição inicial para processos cíveis",
      category: "Direito Civil",
      usage: 45,
    },
    {
      id: "contestacao",
      name: "Contestação",
      description: "Contestação para defesa processual",
      category: "Direito Civil",
      usage: 32,
    },
    {
      id: "recurso_apelacao",
      name: "Recurso de Apelação",
      description: "Recurso contra sentença de primeiro grau",
      category: "Recursos",
      usage: 28,
    },
    {
      id: "habeas_corpus",
      name: "Habeas Corpus",
      description: "Petição de habeas corpus",
      category: "Direito Penal",
      usage: 15,
    },
  ];

  const generatedDocuments = [
    {
      id: 1,
      title: "Petição Inicial - João Silva vs. Empresa ABC",
      template: "Petição Inicial",
      client: "João Silva",
      process: "1234567-89.2024.8.26.0001",
      createdAt: "2024-12-15T10:30:00",
      status: "finalizado",
      versions: 3,
      lawyer: "Dr. Pedro Costa",
    },
    {
      id: 2,
      title: "Contestação - Empresa XYZ vs. Maria Santos",
      template: "Contestação",
      client: "Empresa XYZ",
      process: "9876543-21.2024.8.26.0001",
      createdAt: "2024-12-14T16:45:00",
      status: "revisao",
      versions: 2,
      lawyer: "Dra. Ana Lima",
    },
    {
      id: 3,
      title: "Recurso de Apelação - Carlos Oliveira",
      template: "Recurso de Apelação",
      client: "Carlos Oliveira",
      process: "5555555-55.2024.8.26.0001",
      createdAt: "2024-12-13T14:20:00",
      status: "rascunho",
      versions: 1,
      lawyer: "Dr. Pedro Costa",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "finalizado":
        return <Badge variant="default">Finalizado</Badge>;
      case "revisao":
        return <Badge variant="outline">Em Revisão</Badge>;
      case "rascunho":
        return <Badge variant="secondary">Rascunho</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center space-x-2">
            <Brain className="h-8 w-8 text-[rgb(var(--theme-primary))]" />
            <span>IA Jurídica</span>
          </h1>
          <p className="text-muted-foreground">
            Geração automática de petições e documentos jurídicos
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Documentos Gerados
                </p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <FileText className="h-8 w-8 text-[rgb(var(--theme-primary))]" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              +12% vs. mês passado
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Templates Usados
                </p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Sparkles className="h-8 w-8 text-yellow-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Mais popular: Petição Inicial
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Tempo Economizado
                </p>
                <p className="text-2xl font-bold">45h</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Neste mês</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Taxa de Aprovação
                </p>
                <p className="text-2xl font-bold">94%</p>
              </div>
              <Wand2 className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Documentos aprovados
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">Gerador de Documentos</TabsTrigger>
          <TabsTrigger value="documents">Meus Documentos</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Document Generator */}
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wand2 className="h-5 w-5 text-[rgb(var(--theme-primary))]" />
                  <span>Novo Documento</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Tipo de Documento
                  </label>
                  <Select
                    value={selectedTemplate}
                    onValueChange={setSelectedTemplate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um template" />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTemplates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Cliente/Processo
                  </label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="joao">
                        João Silva - Proc. 1234567
                      </SelectItem>
                      <SelectItem value="maria">
                        Maria Santos - Proc. 9876543
                      </SelectItem>
                      <SelectItem value="carlos">
                        Carlos Oliveira - Proc. 5555555
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Instruções para IA
                  </label>
                  <Textarea
                    placeholder="Descreva os detalhes específicos do caso, fatos relevantes, pedidos, argumentos jurídicos, etc..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Seja específico sobre os fatos, legislação aplicável e
                    pedidos desejados.
                  </p>
                </div>

                <Button
                  className="w-full bg-[rgb(var(--theme-primary))] hover:bg-[rgb(var(--theme-primary))]/90"
                  disabled={!selectedTemplate || !prompt.trim()}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Gerar Documento
                </Button>
              </CardContent>
            </Card>

            {/* Popular Templates */}
            <Card className="rounded-2xl shadow-md">
              <CardHeader>
                <CardTitle>Templates Populares</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {documentTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {template.category}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{template.usage}</p>
                      <p className="text-xs text-muted-foreground">usos</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          {/* Search and Filters */}
          <Card className="rounded-2xl shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar documentos..." className="pl-10" />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <div className="space-y-4">
            {generatedDocuments.map((doc) => (
              <Card
                key={doc.id}
                className="rounded-2xl shadow-md hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-[rgb(var(--theme-primary))]" />
                        <h3 className="font-semibold">{doc.title}</h3>
                        {getStatusBadge(doc.status)}
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{doc.client}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            {new Date(doc.createdAt).toLocaleDateString(
                              "pt-BR",
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <History className="h-4 w-4" />
                          <span>{doc.versions} versões</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <Badge variant="outline">{doc.template}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Por: {doc.lawyer}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card className="rounded-2xl shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Templates Disponíveis</CardTitle>
                <Button className="bg-[rgb(var(--theme-primary))] hover:bg-[rgb(var(--theme-primary))]/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="border hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <FileText className="h-6 w-6 text-[rgb(var(--theme-primary))]" />
                          <Badge variant="outline">{template.category}</Badge>
                        </div>
                        <div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {template.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {template.usage} usos
                          </span>
                          <Button size="sm" variant="outline">
                            Usar Template
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
