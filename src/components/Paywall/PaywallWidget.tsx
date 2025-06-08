import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Unlock,
  CreditCard,
  User,
  Eye,
  Star,
  Zap,
  X,
  CheckCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PaywallWidgetProps {
  isBlocked: boolean;
  contentType:
    | "petition"
    | "flipbook"
    | "template"
    | "consultation"
    | "contract";
  title: string;
  price: number;
  freePages?: number;
  currentPage?: number;
  onUnlock?: (method: "payment" | "login" | "password") => void;
  onClose?: () => void;
  theme?: "light" | "dark";
  showPreview?: boolean;
}

interface UnlockMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  price?: number;
}

export const PaywallWidget: React.FC<PaywallWidgetProps> = ({
  isBlocked,
  contentType,
  title,
  price,
  freePages = 3,
  currentPage = 1,
  onUnlock,
  onClose,
  theme = "light",
  showPreview = true,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isBlocked) {
      setShowModal(true);
    }
  }, [isBlocked]);

  const unlockMethods: UnlockMethod[] = [
    {
      id: "payment",
      name: "Pagamento Seguro",
      description: `Acesso completo por R$ ${price.toFixed(2)}`,
      icon: <CreditCard className="w-5 h-5" />,
      action: "Pagar Agora",
      price: price,
    },
    {
      id: "login",
      name: "Portal do Cliente",
      description: "Faça login se já possui acesso",
      icon: <User className="w-5 h-5" />,
      action: "Fazer Login",
    },
    {
      id: "password",
      name: "Senha de Acesso",
      description: "Digite a senha especial",
      icon: <Unlock className="w-5 h-5" />,
      action: "Desbloquear",
    },
  ];

  const handleUnlock = async (method: string) => {
    setIsProcessing(true);
    setSelectedMethod(method);

    // Simulate processing
    setTimeout(() => {
      onUnlock?.(method as any);
      setShowModal(false);
      setIsProcessing(false);
    }, 2000);
  };

  const getContentTypeIcon = () => {
    switch (contentType) {
      case "petition":
        return <Zap className="w-6 h-6 text-blue-600" />;
      case "flipbook":
        return <Eye className="w-6 h-6 text-purple-600" />;
      case "template":
        return <Star className="w-6 h-6 text-yellow-600" />;
      case "consultation":
        return <User className="w-6 h-6 text-green-600" />;
      case "contract":
        return <CreditCard className="w-6 h-6 text-red-600" />;
      default:
        return <Lock className="w-6 h-6 text-gray-600" />;
    }
  };

  const getContentTypeLabel = () => {
    switch (contentType) {
      case "petition":
        return "Petição IA";
      case "flipbook":
        return "Flipbook";
      case "template":
        return "Template";
      case "consultation":
        return "Consultoria";
      case "contract":
        return "Contrato";
      default:
        return "Conteúdo";
    }
  };

  if (!isBlocked) {
    return null;
  }

  return (
    <AnimatePresence>
      {showModal && (
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent
            className={`max-w-2xl ${theme === "dark" ? "bg-gray-900 text-white" : ""}`}
          >
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {getContentTypeIcon()}
                <span>Conteúdo Premium</span>
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                  {getContentTypeLabel()}
                </Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Content Info */}
              <div className="text-center space-y-3">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold">{title}</h3>
                {freePages && (
                  <p className="text-gray-600">
                    Você visualizou {currentPage} de {freePages} páginas
                    gratuitas. Desbloqueie para acessar o conteúdo completo.
                  </p>
                )}
              </div>

              {/* Preview Section */}
              {showPreview && (
                <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Preview do Conteúdo
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="h-2 bg-gray-300 rounded"></div>
                    <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-300 rounded w-1/2"></div>
                    <div className="text-center py-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-full border">
                        <Lock className="w-3 h-3" />
                        <span className="text-xs">Conteúdo bloqueado</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Unlock Methods */}
              <div className="space-y-4">
                <h4 className="font-medium text-center">
                  Escolha como desbloquear:
                </h4>

                <div className="grid gap-4">
                  {unlockMethods.map((method) => (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className={`cursor-pointer transition-all border-2 ${
                          selectedMethod === method.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedMethod(method.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              {method.icon}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium">{method.name}</h5>
                              <p className="text-sm text-gray-600">
                                {method.description}
                              </p>
                            </div>
                            {method.price && (
                              <div className="text-right">
                                <div className="text-lg font-bold text-green-600">
                                  R$ {method.price.toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500">
                                  pagamento único
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Password Input */}
                {selectedMethod === "password" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2"
                  >
                    <Label htmlFor="access-password">Senha de Acesso</Label>
                    <Input
                      id="access-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite a senha especial"
                    />
                  </motion.div>
                )}

                {/* Action Button */}
                {selectedMethod && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Button
                      onClick={() => handleUnlock(selectedMethod)}
                      disabled={
                        isProcessing ||
                        (selectedMethod === "password" && !password)
                      }
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processando...
                        </>
                      ) : (
                        <>
                          {selectedMethod === "payment" && (
                            <CreditCard className="w-4 h-4 mr-2" />
                          )}
                          {selectedMethod === "login" && (
                            <User className="w-4 h-4 mr-2" />
                          )}
                          {selectedMethod === "password" && (
                            <Unlock className="w-4 h-4 mr-2" />
                          )}
                          {
                            unlockMethods.find((m) => m.id === selectedMethod)
                              ?.action
                          }
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </div>

              {/* Security Badge */}
              <div className="text-center pt-4 border-t">
                <div className="inline-flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>
                    Pagamento seguro • SSL criptografado • Sem dados armazenados
                  </span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};
