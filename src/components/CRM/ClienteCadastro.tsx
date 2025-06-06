import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  Search,
  Upload,
  X,
  Check,
  AlertCircle,
  Camera,
  FileText,
  Shield,
  Save,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Validation schema
const clienteSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  documento: z.string().min(11, "CPF/CNPJ inválido"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  cep: z.string().min(8, "CEP inválido"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().min(2, "Estado é obrigatório"),
  complemento: z.string().optional(),
  observacoes: z.string().optional(),
  avatar: z.string().optional(),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

interface ClienteCadastroProps {
  onSave?: (data: ClienteFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<ClienteFormData>;
}

// CPF/CNPJ validation
const validateCPF = (cpf: string): boolean => {
  cpf = cpf.replace(/[^\d]/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  return remainder === parseInt(cpf.charAt(10));
};

const validateCNPJ = (cnpj: string): boolean => {
  cnpj = cnpj.replace(/[^\d]/g, "");
  if (cnpj.length !== 14) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(cnpj.charAt(i)) * weights1[i];
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;

  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(cnpj.charAt(i)) * weights2[i];
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;

  return (
    digit1 === parseInt(cnpj.charAt(12)) && digit2 === parseInt(cnpj.charAt(13))
  );
};

// Format helpers
const formatDocument = (value: string): string => {
  const numbers = value.replace(/[^\d]/g, "");
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  } else {
    return numbers.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5",
    );
  }
};

const formatCEP = (value: string): string => {
  const numbers = value.replace(/[^\d]/g, "");
  return numbers.replace(/(\d{5})(\d{3})/, "$1-$2");
};

const formatPhone = (value: string): string => {
  const numbers = value.replace(/[^\d]/g, "");
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }
};

export function ClienteCadastro({
  onSave,
  onCancel,
  initialData,
}: ClienteCadastroProps) {
  const [documentValidation, setDocumentValidation] = useState<{
    isValid: boolean;
    type: "cpf" | "cnpj" | null;
    message: string;
  }>({ isValid: false, type: null, message: "" });

  const [cepLoading, setCepLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewAvatar, setPreviewAvatar] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: {
      nome: "",
      documento: "",
      email: "",
      telefone: "",
      cep: "",
      endereco: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: "",
      complemento: "",
      observacoes: "",
      avatar: "",
      ...initialData,
    },
  });

  const watchDocument = form.watch("documento");
  const watchCep = form.watch("cep");

  // Document validation effect
  useEffect(() => {
    if (!watchDocument) {
      setDocumentValidation({ isValid: false, type: null, message: "" });
      return;
    }

    const numbers = watchDocument.replace(/[^\d]/g, "");

    if (numbers.length === 11) {
      const isValid = validateCPF(numbers);
      setDocumentValidation({
        isValid,
        type: "cpf",
        message: isValid ? "CPF válido" : "CPF inválido",
      });
    } else if (numbers.length === 14) {
      const isValid = validateCNPJ(numbers);
      setDocumentValidation({
        isValid,
        type: "cnpj",
        message: isValid ? "CNPJ válido" : "CNPJ inválido",
      });
    } else {
      setDocumentValidation({
        isValid: false,
        type: null,
        message: "Digite CPF ou CNPJ",
      });
    }
  }, [watchDocument]);

  // CEP lookup effect
  useEffect(() => {
    if (watchCep && watchCep.replace(/[^\d]/g, "").length === 8) {
      fetchAddressByCEP(watchCep);
    }
  }, [watchCep]);

  const fetchAddressByCEP = async (cep: string) => {
    const cleanCep = cep.replace(/[^\d]/g, "");
    setCepLoading(true);

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`,
      );
      const data = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }

      form.setValue("endereco", data.logradouro);
      form.setValue("bairro", data.bairro);
      form.setValue("cidade", data.localidade);
      form.setValue("estado", data.uf);

      toast.success("Endereço preenchido automaticamente");
    } catch (error) {
      toast.error("Erro ao buscar CEP");
    } finally {
      setCepLoading(false);
    }
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Arquivo muito grande. Máximo 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewAvatar(result);
        form.setValue("avatar", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);

    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        toast.success(`${files.length} arquivo(s) carregado(s)`);
      }
    }, 100);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (data: ClienteFormData) => {
    if (!documentValidation.isValid) {
      toast.error("Verifique o CPF/CNPJ informado");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Cliente cadastrado com sucesso!");
      onSave?.(data);
    } catch (error) {
      toast.error("Erro ao cadastrar cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPersonType = () => {
    if (documentValidation.type === "cpf") {
      return { label: "Pessoa Física", icon: User, color: "bg-blue-500" };
    } else if (documentValidation.type === "cnpj") {
      return {
        label: "Pessoa Jurídica",
        icon: Building,
        color: "bg-purple-500",
      };
    }
    return null;
  };

  const personType = getPersonType();

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Cadastro de Cliente</h1>
            <p className="text-muted-foreground">
              Informações completas do cliente e documentos
            </p>
          </div>
          {personType && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Badge className={`${personType.color} text-white`}>
                <personType.icon className="h-4 w-4 mr-2" />
                {personType.label}
              </Badge>
            </motion.div>
          )}
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            {/* Desktop 3-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Column 1: Basic Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="rounded-2xl shadow-md h-fit">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-t-2xl">
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-[rgb(var(--theme-primary))]" />
                      <span>Informações Básicas</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* Avatar Upload */}
                    <div className="flex flex-col items-center space-y-4">
                      <div className="relative">
                        <Avatar className="h-24 w-24">
                          <AvatarImage
                            src={previewAvatar}
                            alt="Avatar do cliente"
                          />
                          <AvatarFallback className="text-2xl">
                            <Camera className="h-8 w-8 text-muted-foreground" />
                          </AvatarFallback>
                        </Avatar>
                        <Button
                          type="button"
                          size="sm"
                          className="absolute -bottom-2 -right-2 rounded-full h-8 w-8 p-0"
                          onClick={() => avatarInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4" />
                        </Button>
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                          aria-label="Upload de foto do cliente"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Clique para adicionar foto
                        <br />
                        JPG, PNG até 2MB
                      </p>
                    </div>

                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Completo *</FormLabel>
                          <FormControl>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                              <Input
                                placeholder="Ex: João Silva dos Santos"
                                autoComplete="name"
                                aria-label="Nome completo do cliente"
                                {...field}
                              />
                            </motion.div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="documento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CPF/CNPJ *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <motion.div whileFocus={{ scale: 1.02 }}>
                                <Input
                                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                                  autoComplete="off"
                                  aria-label="CPF ou CNPJ do cliente"
                                  {...field}
                                  onChange={(e) => {
                                    const formatted = formatDocument(
                                      e.target.value,
                                    );
                                    field.onChange(formatted);
                                  }}
                                />
                              </motion.div>
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                                {documentValidation.isValid ? (
                                  <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                  watchDocument && (
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                  )
                                )}
                                {documentValidation.type === "cpf" &&
                                  documentValidation.isValid && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0"
                                        >
                                          <Shield className="h-4 w-4 text-blue-600" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Integração GOV.BR (Em breve)</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  )}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                          {documentValidation.message && (
                            <p
                              className={`text-xs ${documentValidation.isValid ? "text-green-600" : "text-red-600"}`}
                            >
                              {documentValidation.message}
                            </p>
                          )}
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <motion.div whileFocus={{ scale: 1.02 }}>
                                  <Input
                                    placeholder="cliente@exemplo.com.br"
                                    type="email"
                                    autoComplete="email"
                                    aria-label="E-mail do cliente"
                                    className="pl-10"
                                    {...field}
                                  />
                                </motion.div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="telefone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone *</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <motion.div whileFocus={{ scale: 1.02 }}>
                                  <Input
                                    placeholder="(11) 99999-9999"
                                    autoComplete="tel"
                                    aria-label="Telefone do cliente"
                                    className="pl-10"
                                    {...field}
                                    onChange={(e) => {
                                      const formatted = formatPhone(
                                        e.target.value,
                                      );
                                      field.onChange(formatted);
                                    }}
                                  />
                                </motion.div>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Column 2: Address */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="rounded-2xl shadow-md h-fit">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-t-2xl">
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-[rgb(var(--theme-primary))]" />
                      <span>Endereço</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <FormField
                      control={form.control}
                      name="cep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CEP *</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <motion.div whileFocus={{ scale: 1.02 }}>
                                <Input
                                  placeholder="00000-000"
                                  autoComplete="postal-code"
                                  aria-label="CEP do endereço"
                                  {...field}
                                  onChange={(e) => {
                                    const formatted = formatCEP(e.target.value);
                                    field.onChange(formatted);
                                  }}
                                />
                              </motion.div>
                              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                {cepLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                ) : (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          fetchAddressByCEP(field.value)
                                        }
                                        disabled={
                                          !field.value ||
                                          field.value.replace(/[^\d]/g, "")
                                            .length !== 8
                                        }
                                      >
                                        <Search className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Buscar endereço automaticamente</p>
                                    </TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                          <FormDescription>
                            O endereço será preenchido automaticamente
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name="endereco"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Endereço *</FormLabel>
                              <FormControl>
                                <motion.div whileFocus={{ scale: 1.02 }}>
                                  <Input
                                    placeholder="Rua das Flores"
                                    autoComplete="street-address"
                                    aria-label="Endereço completo"
                                    {...field}
                                  />
                                </motion.div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="numero"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número *</FormLabel>
                            <FormControl>
                              <motion.div whileFocus={{ scale: 1.02 }}>
                                <Input
                                  placeholder="123"
                                  autoComplete="off"
                                  aria-label="Número do endereço"
                                  {...field}
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="bairro"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bairro *</FormLabel>
                            <FormControl>
                              <motion.div whileFocus={{ scale: 1.02 }}>
                                <Input
                                  placeholder="Centro"
                                  autoComplete="off"
                                  aria-label="Bairro"
                                  {...field}
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="complemento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complemento</FormLabel>
                            <FormControl>
                              <motion.div whileFocus={{ scale: 1.02 }}>
                                <Input
                                  placeholder="Apto 101, Bloco A"
                                  autoComplete="off"
                                  aria-label="Complemento do endereço"
                                  {...field}
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="cidade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade *</FormLabel>
                            <FormControl>
                              <motion.div whileFocus={{ scale: 1.02 }}>
                                <Input
                                  placeholder="São Paulo"
                                  autoComplete="address-level2"
                                  aria-label="Cidade"
                                  {...field}
                                />
                              </motion.div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="estado"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger aria-label="Estado">
                                  <SelectValue placeholder="UF" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="SP">São Paulo</SelectItem>
                                <SelectItem value="RJ">
                                  Rio de Janeiro
                                </SelectItem>
                                <SelectItem value="MG">Minas Gerais</SelectItem>
                                <SelectItem value="RS">
                                  Rio Grande do Sul
                                </SelectItem>
                                <SelectItem value="PR">Paraná</SelectItem>
                                <SelectItem value="SC">
                                  Santa Catarina
                                </SelectItem>
                                <SelectItem value="BA">Bahia</SelectItem>
                                <SelectItem value="GO">Goiás</SelectItem>
                                <SelectItem value="ES">
                                  Espírito Santo
                                </SelectItem>
                                <SelectItem value="MT">Mato Grosso</SelectItem>
                                <SelectItem value="MS">
                                  Mato Grosso do Sul
                                </SelectItem>
                                <SelectItem value="DF">
                                  Distrito Federal
                                </SelectItem>
                                <SelectItem value="CE">Ceará</SelectItem>
                                <SelectItem value="PE">Pernambuco</SelectItem>
                                <SelectItem value="PB">Paraíba</SelectItem>
                                <SelectItem value="RN">
                                  Rio Grande do Norte
                                </SelectItem>
                                <SelectItem value="AL">Alagoas</SelectItem>
                                <SelectItem value="SE">Sergipe</SelectItem>
                                <SelectItem value="PI">Piauí</SelectItem>
                                <SelectItem value="MA">Maranhão</SelectItem>
                                <SelectItem value="PA">Pará</SelectItem>
                                <SelectItem value="AM">Amazonas</SelectItem>
                                <SelectItem value="RO">Rondônia</SelectItem>
                                <SelectItem value="AC">Acre</SelectItem>
                                <SelectItem value="RR">Roraima</SelectItem>
                                <SelectItem value="AP">Amapá</SelectItem>
                                <SelectItem value="TO">Tocantins</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Column 3: Documents & Notes */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="rounded-2xl shadow-md h-fit">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-t-2xl">
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-[rgb(var(--theme-primary))]" />
                      <span>Documentos & Observações</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    {/* File Upload */}
                    <div className="space-y-4">
                      <Label>Documentos do Cliente</Label>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center space-y-4">
                        <FileText className="h-8 w-8 text-muted-foreground mx-auto" />
                        <div>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Escolher Arquivos
                          </Button>
                          <p className="text-xs text-muted-foreground mt-2">
                            PDF, DOC, JPG até 5MB cada
                          </p>
                        </div>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                        className="hidden"
                        aria-label="Upload de documentos do cliente"
                      />

                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Enviando...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <Progress value={uploadProgress} />
                        </div>
                      )}

                      <AnimatePresence>
                        {uploadedFiles.map((file, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{file.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>

                    {/* Smart Notes with Markdown support */}
                    <FormField
                      control={form.control}
                      name="observacoes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Observações Inteligentes</FormLabel>
                          <FormControl>
                            <motion.div whileFocus={{ scale: 1.02 }}>
                              <Textarea
                                placeholder="**Informações importantes sobre o cliente**&#10;&#10;- Histórico de casos&#10;- Preferências de atendimento&#10;- Observações estratégicas&#10;&#10;_Suporte a Markdown ativado_"
                                className="min-h-32 resize-none"
                                aria-label="Observações sobre o cliente"
                                {...field}
                              />
                            </motion.div>
                          </FormControl>
                          <FormDescription>
                            Use **negrito**, *itálico*, e listas para organizar
                            informações
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-end space-x-4 pt-6 border-t"
            >
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !documentValidation.isValid}
                className="bg-[rgb(var(--theme-primary))] hover:bg-[rgb(var(--theme-primary))]/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Cliente
                  </>
                )}
              </Button>
            </motion.div>
          </form>
        </Form>
      </motion.div>
    </TooltipProvider>
  );
}
