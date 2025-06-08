import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Scale,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Shield,
  CheckCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { usePermissions } from "@/hooks/usePermissions";
import { toast } from "sonner";

interface LoginFormData {
  email: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = usePermissions();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Demo users for testing
  const demoUsers = [
    {
      name: "Adriano Hermida",
      email: "adrianohermida@gmail.com",
      password: "admin",
      role: "admin" as const,
      badge: "Admin",
      color: "bg-red-100 text-red-800",
    },
    {
      name: "Usuário Teste",
      email: "teste@lawdesk.com.br",
      password: "teste@123",
      role: "cliente" as const,
      badge: "Cliente",
      color: "bg-blue-100 text-blue-800",
    },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Find demo user
      const demoUser = demoUsers.find(
        (user) =>
          user.email === formData.email && user.password === formData.password,
      );

      if (!demoUser) {
        throw new Error("Credenciais inválidas");
      }

      // Create user object
      const userData = {
        id: `user_${Date.now()}`,
        name: demoUser.name,
        email: demoUser.email,
        role: demoUser.role,
        permissions: [], // Will be set by usePermissions based on role
        active: true,
        lastLogin: new Date().toISOString(),
      };

      // Login user
      login(userData);

      toast.success(`Bem-vindo(a), ${demoUser.name}!`, {
        description: `Logado como ${demoUser.role}`,
      });

      // Redirect based on role
      const redirectPath = demoUser.role === "admin" ? "/admin" : "/dashboard";
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      toast.error("Falha no login", {
        description: "Verifique suas credenciais e tente novamente",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoUser: (typeof demoUsers)[0]) => {
    setFormData({
      email: demoUser.email,
      password: demoUser.password,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Lawdesk CRM
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Sistema Jurídico Completo
            </p>
          </div>

          {/* Login Form */}
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur">
            <CardHeader className="space-y-1 text-center">
              <CardTitle className="text-xl">Entrar na sua conta</CardTitle>
              <p className="text-sm text-muted-foreground">
                Digite suas credenciais para acessar o sistema
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Entrando...
                    </>
                  ) : (
                    "Entrar"
                  )}
                </Button>
              </form>

              <Separator />

              {/* Demo Users */}
              <div className="space-y-3">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-3">
                    Contas de demonstração:
                  </p>
                </div>

                <div className="space-y-2">
                  {demoUsers.map((user, index) => (
                    <motion.div
                      key={user.email}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <Button
                        variant="outline"
                        className="w-full justify-between p-3 h-auto"
                        onClick={() => handleDemoLogin(user)}
                        disabled={isLoading}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {user.email}
                            </div>
                          </div>
                        </div>
                        <Badge className={user.color}>{user.badge}</Badge>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Security Notice */}
              <div className="pt-4 border-t">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield className="h-3 w-3" />
                  <span>Seus dados estão protegidos com criptografia SSL</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-6 text-sm text-muted-foreground">
            <p>© 2025 Lawdesk CRM. Todos os direitos reservados.</p>
            <div className="flex justify-center gap-4 mt-2">
              <Link to="#" className="hover:underline">
                Termos de Uso
              </Link>
              <Link to="#" className="hover:underline">
                Política de Privacidade
              </Link>
              <Link to="#" className="hover:underline">
                Suporte
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
