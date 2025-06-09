import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSignature,
  Check,
  X,
  Upload,
  Download,
  Eye,
  Clock,
  Shield,
  User,
  Building,
  AlertTriangle,
  CheckCircle,
  Mail,
  Phone,
  Calendar,
  Fingerprint,
  QrCode,
  Camera,
  Smartphone,
  Lock,
  Verified,
  Activity,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

interface ContratoAssinatura {
  id: string;
  titulo: string;
  cliente: {
    id: string;
    nome: string;
    email: string;
    telefone: string;
    tipo: "fisica" | "juridica";
    documento: string;
  };
  advogado: {
    id: string;
    nome: string;
    email: string;
    oab: string;
  };
  status:
    | "aguardando_cliente"
    | "aguardando_advogado"
    | "completo"
    | "expirado";
  dataEnvio: string;
  dataLimite: string;
  assinaturas: {
    cliente?: {
      assinado: boolean;
      dataAssinatura?: string;
      metodo: "digital" | "biometrica" | "certificado_digital";
      ip?: string;
      localizacao?: string;
      dispositivo?: string;
      hash?: string;
    };
    advogado?: {
      assinado: boolean;
      dataAssinatura?: string;
      metodo: "digital" | "certificado_digital";
      ip?: string;
      hash?: string;
    };
    testemunhas?: Array<{
      nome: string;
      email: string;
      assinado: boolean;
      dataAssinatura?: string;
      metodo: string;
    }>;
  };
  documentos: {
    original: string;
    assinado?: string;
    certificados?: string[];
  };
  configuracoes: {
    exigirBiometria: boolean;
    exigirCertificadoDigital: boolean;
    permitirTestemunhas: boolean;
    notificarPorEmail: boolean;
    notificarPorSMS: boolean;
    lembretesDias: number[];
  };
  auditoria: {
    criadoPor: string;
    criadoEm: string;
    historicoEventos: Array<{
      evento: string;
      usuario: string;
      timestamp: string;
      detalhes: string;
    }>;
  };
}

interface AssinaturaDigitalProps {
  contrato: ContratoAssinatura;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (contratoId: string, novoStatus: string) => void;
  userRole: "cliente" | "advogado" | "admin";
  currentUserId: string;
}

export function AssinaturaDigital({
  contrato,
  isOpen,
  onClose,
  onStatusChange,
  userRole,
  currentUserId,
}: AssinaturaDigitalProps) {
  const [currentTab, setCurrentTab] = useState("overview");
  const [isSigningMode, setIsSigningMode] = useState(false);
  const [signatureType, setSignatureType] = useState<
    "digital" | "biometrica" | "certificado"
  >("digital");
  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [biometricData, setBiometricData] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // Verificar se o usuário pode assinar
  const canSign = () => {
    if (userRole === "cliente") {
      return !contrato.assinaturas.cliente?.assinado;
    } else if (userRole === "advogado") {
      return !contrato.assinaturas.advogado?.assinado;
    }
    return false;
  };

  // Verificar progresso das assinaturas
  const getSignatureProgress = () => {
    let total = 2; // Cliente + Advogado
    let signed = 0;

    if (contrato.assinaturas.cliente?.assinado) signed++;
    if (contrato.assinaturas.advogado?.assinado) signed++;

    if (contrato.configuracoes.permitirTestemunhas) {
      total += contrato.assinaturas.testemunhas?.length || 0;
      signed +=
        contrato.assinaturas.testemunhas?.filter((t) => t.assinado).length || 0;
    }

    return { signed, total, percentage: Math.round((signed / total) * 100) };
  };

  const progress = getSignatureProgress();

  // Configurar canvas para assinatura digital
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, [isSigningMode]);

  // Funções do canvas
  const startDrawing = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }, []);

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    },
    [isDrawing],
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  // Solicitar verificação biométrica
  const requestBiometricVerification = useCallback(async () => {
    try {
      // Simular API de biometria
      setIsProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simular captura biométrica
      const mockBiometricData =
        "bio_" + Math.random().toString(36).substr(2, 9);
      setBiometricData(mockBiometricData);

      toast.success("Biometria capturada com sucesso!");
      return true;
    } catch (error) {
      toast.error("Erro na verificação biométrica");
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Enviar código de verificação
  const sendVerificationCode = useCallback(async () => {
    try {
      setIsProcessing(true);
      // Simular envio de SMS/Email
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setShowCodeInput(true);
      toast.success("Código de verificação enviado!");
    } catch (error) {
      toast.error("Erro ao enviar código");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Processar assinatura
  const processSignature = useCallback(async () => {
    try {
      setIsProcessing(true);

      // Validações específicas por tipo de assinatura
      if (signatureType === "digital") {
        const canvas = canvasRef.current;
        if (!canvas) {
          toast.error("Assinatura digital é obrigatória");
          return;
        }

        // Verificar se canvas não está vazio
        const ctx = canvas.getContext("2d");
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        const isCanvasEmpty = imageData?.data.every((value) => value === 0);

        if (isCanvasEmpty) {
          toast.error("Por favor, desenhe sua assinatura");
          return;
        }
      }

      if (signatureType === "biometrica" && !biometricData) {
        toast.error("Verificação biométrica é obrigatória");
        return;
      }

      if (showCodeInput && !verificationCode) {
        toast.error("Código de verificação é obrigatório");
        return;
      }

      // Simular processamento da assinatura
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Gerar hash da assinatura
      const signatureHash = "sig_" + Math.random().toString(36).substr(2, 16);

      // Atualizar contrato com assinatura
      const novaAssinatura = {
        assinado: true,
        dataAssinatura: new Date().toISOString(),
        metodo: signatureType,
        ip: "192.168.1.1", // Em produção, capturar IP real
        localizacao: "São Paulo, SP",
        dispositivo: navigator.userAgent,
        hash: signatureHash,
      };

      if (userRole === "cliente") {
        contrato.assinaturas.cliente = novaAssinatura;
      } else if (userRole === "advogado") {
        contrato.assinaturas.advogado = novaAssinatura;
      }

      // Adicionar ao histórico de auditoria
      contrato.auditoria.historicoEventos.push({
        evento: "ASSINATURA_REALIZADA",
        usuario: currentUserId,
        timestamp: new Date().toISOString(),
        detalhes: `Assinatura ${signatureType} realizada com sucesso`,
      });

      // Verificar se contrato está completo
      const isComplete =
        contrato.assinaturas.cliente?.assinado &&
        contrato.assinaturas.advogado?.assinado;
      const newStatus = isComplete ? "completo" : contrato.status;

      onStatusChange(contrato.id, newStatus);
      setIsSigningMode(false);

      toast.success("Contrato assinado com sucesso!");

      // Se for administrador ou ambos assinaram, fechar modal
      if (userRole === "admin" || isComplete) {
        onClose();
      }
    } catch (error) {
      toast.error("Erro ao processar assinatura");
    } finally {
      setIsProcessing(false);
    }
  }, [
    signatureType,
    biometricData,
    verificationCode,
    showCodeInput,
    userRole,
    currentUserId,
    contrato,
    onStatusChange,
    onClose,
  ]);

  // Reenviar lembrete
  const sendReminder = useCallback(async () => {
    try {
      setIsProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Lembrete enviado com sucesso!");
    } catch (error) {
      toast.error("Erro ao enviar lembrete");
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Status e Progresso */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Status das Assinaturas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Progresso Geral</span>
              <Badge
                variant={progress.percentage === 100 ? "default" : "secondary"}
              >
                {progress.signed}/{progress.total} assinadas
              </Badge>
            </div>
            <Progress value={progress.percentage} className="h-2" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* Assinatura do Cliente */}
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {contrato.assinaturas.cliente?.assinado ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <Clock className="h-8 w-8 text-yellow-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{contrato.cliente.nome}</div>
                  <div className="text-sm text-muted-foreground">Cliente</div>
                  {contrato.assinaturas.cliente?.assinado ? (
                    <div className="text-xs text-green-600">
                      Assinado em{" "}
                      {new Date(
                        contrato.assinaturas.cliente.dataAssinatura!,
                      ).toLocaleString("pt-BR")}
                    </div>
                  ) : (
                    <div className="text-xs text-yellow-600">
                      Aguardando assinatura
                    </div>
                  )}
                </div>
                {contrato.cliente.tipo === "juridica" ? (
                  <Building className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <User className="h-4 w-4 text-muted-foreground" />
                )}
              </div>

              {/* Assinatura do Advogado */}
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {contrato.assinaturas.advogado?.assinado ? (
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  ) : (
                    <Clock className="h-8 w-8 text-yellow-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{contrato.advogado.nome}</div>
                  <div className="text-sm text-muted-foreground">
                    Advogado - OAB: {contrato.advogado.oab}
                  </div>
                  {contrato.assinaturas.advogado?.assinado ? (
                    <div className="text-xs text-green-600">
                      Assinado em{" "}
                      {new Date(
                        contrato.assinaturas.advogado.dataAssinatura!,
                      ).toLocaleString("pt-BR")}
                    </div>
                  ) : (
                    <div className="text-xs text-yellow-600">
                      Aguardando assinatura
                    </div>
                  )}
                </div>
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Contrato */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Informações do Contrato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">Título</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {contrato.titulo}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Data Limite</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(contrato.dataLimite).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Enviado em</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {new Date(contrato.dataEnvio).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Status</Label>
              <Badge className="mt-1">
                {contrato.status === "completo"
                  ? "Completo"
                  : contrato.status === "aguardando_cliente"
                    ? "Aguardando Cliente"
                    : contrato.status === "aguardando_advogado"
                      ? "Aguardando Advogado"
                      : "Expirado"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      {canSign() && (
        <Card>
          <CardHeader>
            <CardTitle>Ações Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsSigningMode(true)} className="flex-1">
                <FileSignature className="h-4 w-4 mr-2" />
                Assinar Contrato
              </Button>
              <Button
                variant="outline"
                onClick={sendReminder}
                disabled={isProcessing}
              >
                <Mail className="h-4 w-4 mr-2" />
                Lembrete
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderSigningTab = () => (
    <div className="space-y-6">
      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Assinatura Digital Segura</AlertTitle>
        <AlertDescription>
          Sua assinatura será criptografada e terá validade jurídica conforme MP
          2.200-2/2001.
        </AlertDescription>
      </Alert>

      {/* Seleção do Tipo de Assinatura */}
      <Card>
        <CardHeader>
          <CardTitle>Escolha o Método de Assinatura</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setSignatureType("digital")}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                signatureType === "digital"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <FileSignature className="h-8 w-8 mb-2 text-blue-600" />
              <div className="font-medium">Assinatura Digital</div>
              <div className="text-sm text-muted-foreground">
                Desenhe sua assinatura na tela
              </div>
            </button>

            <button
              onClick={() => setSignatureType("biometrica")}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                signatureType === "biometrica"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Fingerprint className="h-8 w-8 mb-2 text-green-600" />
              <div className="font-medium">Biometria</div>
              <div className="text-sm text-muted-foreground">
                Verificação por impressão digital
              </div>
            </button>

            <button
              onClick={() => setSignatureType("certificado")}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                signatureType === "certificado"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <Verified className="h-8 w-8 mb-2 text-purple-600" />
              <div className="font-medium">Certificado Digital</div>
              <div className="text-sm text-muted-foreground">
                A3 ou A1 padrão ICP-Brasil
              </div>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Interface de Assinatura Digital */}
      {signatureType === "digital" && (
        <Card>
          <CardHeader>
            <CardTitle>Desenhe sua Assinatura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={200}
                  className="w-full h-32 border border-gray-200 rounded cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-muted-foreground">
                    Desenhe sua assinatura acima
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearSignature}
                  >
                    Limpar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Interface de Biometria */}
      {signatureType === "biometrica" && (
        <Card>
          <CardHeader>
            <CardTitle>Verificação Biométrica</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              {!biometricData ? (
                <>
                  <Fingerprint className="h-16 w-16 mx-auto text-green-600" />
                  <p className="text-muted-foreground">
                    Posicione seu dedo no sensor biométrico
                  </p>
                  <Button
                    onClick={requestBiometricVerification}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Capturando...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="h-4 w-4 mr-2" />
                        Capturar Biometria
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="space-y-2">
                  <CheckCircle className="h-16 w-16 mx-auto text-green-600" />
                  <p className="font-medium text-green-600">
                    Biometria Capturada!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Verificação biométrica realizada com sucesso
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Verificação por Código */}
      <Card>
        <CardHeader>
          <CardTitle>Verificação de Segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {!showCodeInput ? (
              <Button
                onClick={sendVerificationCode}
                disabled={isProcessing}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Smartphone className="h-4 w-4 mr-2" />
                    Enviar Código de Verificação
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="verification">Código de Verificação</Label>
                <Input
                  id="verification"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Digite o código recebido"
                  maxLength={6}
                />
                <p className="text-sm text-muted-foreground">
                  Código enviado para {contrato.cliente.telefone} e{" "}
                  {contrato.cliente.email}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Finalizar Assinatura */}
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={processSignature}
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Processando Assinatura...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Finalizar Assinatura
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderAuditTab = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Log de Auditoria
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contrato.auditoria.historicoEventos.map((evento, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 border rounded-lg"
            >
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
              <div className="flex-1">
                <div className="font-medium">
                  {evento.evento.replace("_", " ")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {evento.detalhes}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {new Date(evento.timestamp).toLocaleString("pt-BR")} •{" "}
                  {evento.usuario}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSignature className="h-5 w-5" />
            Assinatura Digital - {contrato.titulo}
          </DialogTitle>
          <DialogDescription>
            {contrato.status === "completo"
              ? "Todas as assinaturas foram coletadas"
              : "Gerencie as assinaturas do contrato"}
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={isSigningMode ? "signing" : currentTab}
          onValueChange={setCurrentTab}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger
              value="signing"
              disabled={!canSign() && !isSigningMode}
            >
              Assinar
            </TabsTrigger>
            <TabsTrigger value="audit">Auditoria</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {renderOverviewTab()}
          </TabsContent>

          <TabsContent value="signing" className="space-y-6">
            {renderSigningTab()}
          </TabsContent>

          <TabsContent value="audit" className="space-y-6">
            {renderAuditTab()}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          {isSigningMode && (
            <Button
              variant="outline"
              onClick={() => setIsSigningMode(false)}
              disabled={isProcessing}
            >
              Voltar
            </Button>
          )}
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
