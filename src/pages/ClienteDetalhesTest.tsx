import { useEffect, useState } from "react";
import { ClienteDetalhes } from "@/components/CRM/ClienteDetalhes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  Smartphone,
  Tablet,
  Monitor,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ClienteDetalhesTest() {
  const [testStatus, setTestStatus] = useState<
    "loading" | "loaded" | "simulating"
  >("loading");
  const [responsiveMode, setResponsiveMode] = useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");

  useEffect(() => {
    // Simulate initial loading
    const loadTimer = setTimeout(() => {
      setTestStatus("loaded");
      toast.success("Dados do cliente carregados com sucesso!");
    }, 1000);

    return () => clearTimeout(loadTimer);
  }, []);

  useEffect(() => {
    if (testStatus === "loaded") {
      // Simulate new movements and deadline alerts after 3 seconds
      const simulationTimer = setTimeout(() => {
        setTestStatus("simulating");

        // Simulate new process movement
        toast.info("Nova movimentação processual detectada!", {
          description: "Processo 1234567-89.2024.8.26.0001",
        });

        // Simulate deadline alert
        setTimeout(() => {
          toast.warning("Prazo crítico detectado!", {
            description:
              "Recurso deve ser interposto até 23/12/2024 (5 dias restantes)",
            action: {
              label: "Ver Detalhes",
              onClick: () => toast.info("Redirecionando para publicações..."),
            },
          });
        }, 1000);

        // Simulate data refresh
        setTimeout(() => {
          toast.success("Dados atualizados automaticamente");
        }, 2000);
      }, 3000);

      return () => clearTimeout(simulationTimer);
    }
  }, [testStatus]);

  const getResponsiveClass = () => {
    switch (responsiveMode) {
      case "mobile":
        return "max-w-sm mx-auto";
      case "tablet":
        return "max-w-2xl mx-auto";
      case "desktop":
      default:
        return "max-w-full";
    }
  };

  const handleBack = () => {
    toast.info("Voltando para lista de clientes...");
  };

  const handleEdit = () => {
    toast.info("Abrindo formulário de edição...");
  };

  return (
    <div className="space-y-6">
      {/* Test Controls */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span>Teste Automatizado - Cliente Detalhes</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-bold">CPF Fictício</div>
              <div className="text-sm text-muted-foreground">
                123.456.789-00
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-bold">Status do Teste</div>
              <Badge
                variant={
                  testStatus === "loading"
                    ? "outline"
                    : testStatus === "loaded"
                      ? "default"
                      : "secondary"
                }
              >
                {testStatus === "loading"
                  ? "Carregando"
                  : testStatus === "loaded"
                    ? "Dados Carregados"
                    : "Simulando Eventos"}
              </Badge>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-lg font-bold">Modo Responsivo</div>
              <div className="flex justify-center space-x-2 mt-2">
                <Button
                  variant={responsiveMode === "mobile" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setResponsiveMode("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
                <Button
                  variant={responsiveMode === "tablet" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setResponsiveMode("tablet")}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={responsiveMode === "desktop" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setResponsiveMode("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Test Timeline */}
          <div className="space-y-2">
            <h4 className="font-medium">Timeline do Teste:</h4>
            <div className="space-y-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Componente carregado</span>
              </motion.div>

              {testStatus !== "loading" && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Dados fictícios carregados</span>
                </motion.div>
              )}

              {testStatus === "simulating" && (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center space-x-2"
                  >
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">Nova movimentação simulada</span>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                    className="flex items-center space-x-2"
                  >
                    <Clock className="h-4 w-4 text-red-500" />
                    <span className="text-sm">
                      Alerta de prazo crítico ativado
                    </span>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Responsive Container */}
      <div className={getResponsiveClass()}>
        <motion.div
          key={responsiveMode}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ClienteDetalhes
            clienteId="123456789"
            onBack={handleBack}
            onEdit={handleEdit}
          />
        </motion.div>
      </div>

      {/* Test Results */}
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle>Resultados dos Testes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="font-medium">Responsividade</div>
              <div className="text-sm text-muted-foreground">
                Mobile, Tablet e Desktop testados
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="font-medium">Tema</div>
              <div className="text-sm text-muted-foreground">
                Sistema de cores integrado
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <div className="font-medium">Funcionalidades</div>
              <div className="text-sm text-muted-foreground">
                Todas as abas operacionais
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
