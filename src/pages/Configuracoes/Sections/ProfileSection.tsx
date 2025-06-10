/**
 * 👤 PROFILE SECTION - USER SETTINGS
 *
 * Seção de perfil e conta com:
 * - Dados pessoais
 * - Avatar e assinatura
 * - Idioma e fuso horário
 * - Tema e preferências
 * - Segurança (senha e 2FA)
 * - Histórico de sessões
 */

import React, { useState } from "react";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  User,
  Camera,
  Shield,
  Globe,
  Smartphone,
  Monitor,
  Sun,
  Moon,
  Key,
  Eye,
  EyeOff,
  Clock,
  MapPin,
  Save,
  Upload,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

// Schema de validação do perfil
const profileSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().regex(/^\(\d{2}\) \d{4,5}-\d{4}$/, "Telefone inválido"),
  cargo: z.string().optional(),
  biografia: z
    .string()
    .max(500, "Biografia deve ter no máximo 500 caracteres")
    .optional(),
  idioma: z.enum(["pt-BR", "en-US", "es-ES"]),
  fusoHorario: z.string(),
  tema: z.enum(["light", "dark", "system"]),
});

const securitySchema = z
  .object({
    senhaAtual: z.string().min(1, "Senha atual é obrigatória"),
    novaSenha: z.string().min(8, "Nova senha deve ter pelo menos 8 caracteres"),
    confirmarSenha: z.string(),
    habilitarTwoFA: z.boolean(),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "Senhas não coincidem",
    path: ["confirmarSenha"],
  });

type ProfileFormData = z.infer<typeof profileSchema>;
type SecurityFormData = z.infer<typeof securitySchema>;

interface ProfileSectionProps {
  onUnsavedChanges: (hasChanges: boolean) => void;
  userRole: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
  onUnsavedChanges,
  userRole,
}) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // Profile form
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nome: "João Silva",
      email: "joao@silva.adv.br",
      telefone: "(11) 99999-9999",
      cargo: "Advogado Sênior",
      biografia:
        "Especialista em Direito Empresarial com 10+ anos de experiência.",
      idioma: "pt-BR",
      fusoHorario: "America/Sao_Paulo",
      tema: "system",
    },
  });

  // Security form
  const securityForm = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
      habilitarTwoFA: false,
    },
  });

  // Handle avatar upload
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      onUnsavedChanges(true);
    }
  };

  // Submit handlers
  const onSubmitProfile = (data: ProfileFormData) => {
    console.log("Profile data:", data);
    onUnsavedChanges(false);
  };

  const onSubmitSecurity = (data: SecurityFormData) => {
    console.log("Security data:", data);
    setShowPasswordForm(false);
    securityForm.reset();
  };

  // Mock active sessions
  const activeSessions = [
    {
      id: "1",
      device: "Chrome no Windows",
      location: "São Paulo, Brasil",
      lastActive: "Agora",
      current: true,
    },
    {
      id: "2",
      device: "Safari no iPhone",
      location: "São Paulo, Brasil",
      lastActive: "2 horas atrás",
      current: false,
    },
  ];

  const timeZones = [
    { value: "America/Sao_Paulo", label: "São Paulo (UTC-3)" },
    { value: "America/New_York", label: "Nova York (UTC-5)" },
    { value: "Europe/London", label: "Londres (UTC+0)" },
    { value: "Europe/Berlin", label: "Berlim (UTC+1)" },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(onSubmitProfile)}
              className="space-y-6"
            >
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    {avatarPreview ? (
                      <AvatarImage src={avatarPreview} alt="Preview" />
                    ) : (
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xl">
                        JS
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1.5 cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    <Camera className="w-3 h-3 text-white" />
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Foto do Perfil</h3>
                  <p className="text-sm text-gray-600">
                    JPG ou PNG, máximo 2MB
                  </p>
                  <Badge variant="secondary" className="mt-2 capitalize">
                    {userRole}
                  </Badge>
                </div>
              </div>

              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={profileForm.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            onUnsavedChanges(true);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          onChange={(e) => {
                            field.onChange(e);
                            onUnsavedChanges(true);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="(11) 99999-9999"
                          onChange={(e) => {
                            field.onChange(e);
                            onUnsavedChanges(true);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="cargo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            onUnsavedChanges(true);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Biografia */}
              <FormField
                control={profileForm.control}
                name="biografia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Biografia Profissional</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Descreva sua experiência e especialidades..."
                        className="resize-none"
                        rows={3}
                        onChange={(e) => {
                          field.onChange(e);
                          onUnsavedChanges(true);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Máximo 500 caracteres. Esta informação pode ser vista por
                      outros usuários.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Preferences Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={profileForm.control}
                  name="idioma"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Idioma
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          onUnsavedChanges(true);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="pt-BR">
                            Português (Brasil)
                          </SelectItem>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="es-ES">Español</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="fusoHorario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Fuso Horário
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          onUnsavedChanges(true);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeZones.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="tema"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Sun className="w-4 h-4" />
                        Tema
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          onUnsavedChanges(true);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Escuro</SelectItem>
                          <SelectItem value="system">Sistema</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <Button type="submit" className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Password Section */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Senha</h4>
              <p className="text-sm text-gray-600">
                Última alteração há 3 meses
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              <Key className="w-4 h-4 mr-2" />
              Alterar Senha
            </Button>
          </div>

          {/* Password Change Form */}
          {showPasswordForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <Form {...securityForm}>
                <form
                  onSubmit={securityForm.handleSubmit(onSubmitSecurity)}
                  className="space-y-4"
                >
                  <FormField
                    control={securityForm.control}
                    name="senhaAtual"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha Atual</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              type={showCurrentPassword ? "text" : "password"}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                              onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                              }
                            >
                              {showCurrentPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={securityForm.control}
                      name="novaSenha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nova Senha</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                {...field}
                                type={showNewPassword ? "text" : "password"}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1"
                                onClick={() =>
                                  setShowNewPassword(!showNewPassword)
                                }
                              >
                                {showNewPassword ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={securityForm.control}
                      name="confirmarSenha"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmar Nova Senha</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit">Alterar Senha</Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowPasswordForm(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </Form>
            </motion.div>
          )}

          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">
                Autenticação de Dois Fatores
              </h4>
              <p className="text-sm text-gray-600">
                Adicione uma camada extra de segurança à sua conta
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Sessões Ativas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Smartphone className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">
                        {session.device}
                      </h4>
                      {session.current && (
                        <Badge variant="default" className="text-xs">
                          Atual
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      {session.location} • {session.lastActive}
                    </div>
                  </div>
                </div>
                {!session.current && (
                  <Button variant="outline" size="sm">
                    Encerrar
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSection;
