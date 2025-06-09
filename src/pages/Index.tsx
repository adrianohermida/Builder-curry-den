import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Scale,
  Users,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  ArrowRight,
  Shield,
  Zap,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index: React.FC = () => {
  const navigate = useNavigate();

  const recursos = [
    {
      icone: Scale,
      titulo: "Gestão Jurídica",
      descricao: "Controle completo de processos e casos jurídicos",
      rota: "/crm",
      cor: "text-blue-600",
      bgCor: "bg-blue-50",
    },
    {
      icone: Users,
      titulo: "CRM Advocacia",
      descricao: "Gestão inteligente de clientes e relacionamentos",
      rota: "/crm",
      cor: "text-green-600",
      bgCor: "bg-green-50",
    },
    {
      icone: FileText,
      titulo: "GED Jurídico",
      descricao: "Gestão eletrônica de documentos com segurança",
      rota: "/ged",
      cor: "text-purple-600",
      bgCor: "bg-purple-50",
    },
    {
      icone: Calendar,
      titulo: "Agenda Jurídica",
      descricao: "Calendário integrado com prazos processuais",
      rota: "/agenda",
      cor: "text-orange-600",
      bgCor: "bg-orange-50",
    },
    {
      icone: BarChart3,
      titulo: "Analytics",
      descricao: "Relatórios e métricas para tomada de decisão",
      rota: "/dashboard",
      cor: "text-indigo-600",
      bgCor: "bg-indigo-50",
    },
    {
      icone: Settings,
      titulo: "Configurações",
      descricao: "Personalização e configuração do sistema",
      rota: "/settings",
      cor: "text-gray-600",
      bgCor: "bg-gray-50",
    },
  ];

  const diferenciais = [
    {
      icone: Shield,
      titulo: "Segurança Jurídica",
      descricao: "Conformidade LGPD e criptografia end-to-end",
    },
    {
      icone: Zap,
      titulo: "Performance",
      descricao: "Sistema otimizado para alta performance",
    },
    {
      icone: Globe,
      titulo: "Acessibilidade",
      descricao: "Interface responsiva e acessível",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="mb-6">
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2 text-sm font-medium">
              🏛️ Sistema Jurídico Completo
            </Badge>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Lawdesk
            <span className="text-blue-600 block text-3xl font-normal mt-2">
              Gestão Jurídica Inteligente
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Plataforma completa para gestão de escritórios de advocacia com CRM,
            GED, controle de processos, agenda jurídica e analytics avançados.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/painel")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Acessar Painel
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/login")}
              className="px-8 py-3 text-lg"
            >
              Fazer Login
            </Button>
          </div>
        </motion.div>

        {/* Recursos Principais */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Recursos do Sistema
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recursos.map((recurso, index) => {
              const Icone = recurso.icone;
              return (
                <motion.div
                  key={recurso.titulo}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                >
                  <Card
                    className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-lg"
                    onClick={() => navigate(recurso.rota)}
                  >
                    <CardHeader className="pb-4">
                      <div
                        className={`w-16 h-16 rounded-2xl ${recurso.bgCor} flex items-center justify-center mb-4`}
                      >
                        <Icone className={`h-8 w-8 ${recurso.cor}`} />
                      </div>
                      <CardTitle className="text-xl font-semibold text-gray-900">
                        {recurso.titulo}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">
                        {recurso.descricao}
                      </p>
                      <div className="mt-4 flex items-center text-blue-600 font-medium">
                        Acessar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Diferenciais */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Nossos Diferenciais
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {diferenciais.map((diferencial, index) => {
              const Icone = diferencial.icone;
              return (
                <motion.div
                  key={diferencial.titulo}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 * index, duration: 0.5 }}
                  className="text-center"
                >
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icone className="h-10 w-10 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {diferencial.titulo}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {diferencial.descricao}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* CTA Final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="text-center bg-white rounded-2xl p-12 shadow-xl border-0"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Acesse o sistema e descubra como o Lawdesk pode transformar a gestão
            do seu escritório jurídico.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/painel")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 text-lg rounded-xl"
          >
            Entrar no Sistema
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
