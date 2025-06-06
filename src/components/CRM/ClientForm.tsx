import { useState, useEffect } from "react";
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
  FileText,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Validation schemas
const clientSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  document: z.string().min(11, "CPF/CNPJ inválido"),
  email: z.string().email("E-mail inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  cep: z.string().min(8, "CEP inválido"),
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(2, "Estado é obrigatório"),
  complement: z.string().optional(),
  govBrCode: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface AddressData {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

interface ClientFormProps {
  onSubmit: (data: ClientFormData) => void;
  onCancel: () => void;
  initialData?: Partial<ClientFormData>;
  isLoading?: boolean;
}

// CPF/CNPJ validation functions
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

// Format CPF/CNPJ
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

// Format CEP
const formatCEP = (value: string): string => {
  const numbers = value.replace(/[^\d]/g, "");
  return numbers.replace(/(\d{5})(\d{3})/, "$1-$2");
};

export function ClientForm({
  onSubmit,
  onCancel,
  initialData,
  isLoading,
}: ClientFormProps) {
  const [documentValidation, setDocumentValidation] = useState<{
    isValid: boolean;
    type: "cpf" | "cnpj" | null;
    message: string;
  }>({ isValid: false, type: null, message: "" });

  const [cepLoading, setCepLoading] = useState(false);
  const [duplicateCheck, setDuplicateCheck] = useState<{
    loading: boolean;
    found: boolean;
    clientName?: string;
  }>({ loading: false, found: false });

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      document: "",
      email: "",
      phone: "",
      cep: "",
      street: "",
      number: "",
      neighborhood: "",
      city: "",
      state: "",
      complement: "",
      govBrCode: "",
      ...initialData,
    },
  });

  const watchDocument = form.watch("document");
  const watchCep = form.watch("cep");

  // Validate document (CPF/CNPJ)
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

      // Check for duplicates
      if (isValid) {
        checkDuplicateClient(numbers);
      }
    } else if (numbers.length === 14) {
      const isValid = validateCNPJ(numbers);
      setDocumentValidation({
        isValid,
        type: "cnpj",
        message: isValid ? "CNPJ válido" : "CNPJ inválido",
      });

      // Check for duplicates
      if (isValid) {
        checkDuplicateClient(numbers);
      }
    } else {
      setDocumentValidation({
        isValid: false,
        type: null,
        message: "Digite CPF ou CNPJ",
      });
    }
  }, [watchDocument]);

  // Check for duplicate clients
  const checkDuplicateClient = async (document: string) => {
    setDuplicateCheck({ loading: true, found: false });

    try {
      // Simulate API call to check duplicates
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock response - in real app, this would be an actual API call
      const isDuplicate = Math.random() > 0.8; // 20% chance of duplicate for demo

      if (isDuplicate) {
        setDuplicateCheck({
          loading: false,
          found: true,
          clientName: "Cliente Exemplo",
        });
        toast.error("Cliente já cadastrado no sistema");
      } else {
        setDuplicateCheck({ loading: false, found: false });
      }
    } catch (error) {
      setDuplicateCheck({ loading: false, found: false });
    }
  };

  // Fetch address by CEP
  const fetchAddressByCEP = async (cep: string) => {
    const cleanCep = cep.replace(/[^\d]/g, "");
    if (cleanCep.length !== 8) return;

    setCepLoading(true);

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cleanCep}/json/`,
      );
      const data: AddressData = await response.json();

      if (data.erro) {
        toast.error("CEP não encontrado");
        return;
      }

      // Fill address fields
      form.setValue("street", data.logradouro);
      form.setValue("neighborhood", data.bairro);
      form.setValue("city", data.localidade);
      form.setValue("state", data.uf);

      toast.success("Endereço preenchido automaticamente");
    } catch (error) {
      toast.error("Erro ao buscar CEP");
    } finally {
      setCepLoading(false);
    }
  };

  // Handle CEP change
  useEffect(() => {
    if (watchCep && watchCep.replace(/[^\d]/g, "").length === 8) {
      fetchAddressByCEP(watchCep);
    }
  }, [watchCep]);

  const handleDocumentChange = (value: string) => {
    const formatted = formatDocument(value);
    form.setValue("document", formatted);
  };

  const handleCepChange = (value: string) => {
    const formatted = formatCEP(value);
    form.setValue("cep", formatted);
  };

  const handleSubmit = (data: ClientFormData) => {
    if (!documentValidation.isValid) {
      toast.error("Verifique o CPF/CNPJ informado");
      return;
    }

    if (duplicateCheck.found) {
      toast.error("Cliente já existe no sistema");
      return;
    }

    onSubmit(data);
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="h-5 w-5 text-[rgb(var(--theme-primary))]" />
            <span>Cadastro de Cliente</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Informações Básicas</h3>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Digite o nome completo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="document"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF/CNPJ</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="000.000.000-00 ou 00.000.000/0000-00"
                            {...field}
                            onChange={(e) =>
                              handleDocumentChange(e.target.value)
                            }
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                            {documentValidation.type && (
                              <Badge
                                variant={
                                  documentValidation.type === "cpf"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {documentValidation.type === "cpf"
                                  ? "Pessoa Física"
                                  : "Pessoa Jurídica"}
                              </Badge>
                            )}
                            {duplicateCheck.loading ? (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            ) : documentValidation.isValid ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              watchDocument && (
                                <AlertCircle className="h-4 w-4 text-red-500" />
                              )
                            )}
                            {documentValidation.type === "cpf" &&
                              documentValidation.isValid && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  title="Integração GOV.BR (Em breve)"
                                >
                                  <Shield className="h-4 w-4 text-blue-600" />
                                </Button>
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
                      {duplicateCheck.found && (
                        <p className="text-xs text-red-600">
                          Cliente já cadastrado: {duplicateCheck.clientName}
                        </p>
                      )}
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="email@exemplo.com"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Celular</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="(11) 99999-9999"
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-[rgb(var(--theme-primary))]" />
                  <span>Endereço</span>
                </h3>

                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="00000-000"
                            {...field}
                            onChange={(e) => handleCepChange(e.target.value)}
                          />
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            {cepLoading ? (
                              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            ) : (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => fetchAddressByCEP(field.value)}
                                disabled={
                                  !field.value ||
                                  field.value.replace(/[^\d]/g, "").length !== 8
                                }
                              >
                                <Search className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rua/Logradouro</FormLabel>
                          <FormControl>
                            <Input placeholder="Nome da rua" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="neighborhood"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do bairro" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da cidade" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estado</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="UF" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="SP">São Paulo</SelectItem>
                            <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                            <SelectItem value="MG">Minas Gerais</SelectItem>
                            <SelectItem value="RS">
                              Rio Grande do Sul
                            </SelectItem>
                            <SelectItem value="PR">Paraná</SelectItem>
                            <SelectItem value="SC">Santa Catarina</SelectItem>
                            {/* Add more states as needed */}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="complement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Complemento (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Apto 123, Bloco A, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* GOV.BR Integration */}
              {documentValidation.type === "cpf" &&
                documentValidation.isValid && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center space-x-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span>Integração GOV.BR</span>
                      <Badge variant="outline">Em breve</Badge>
                    </h3>

                    <FormField
                      control={form.control}
                      name="govBrCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Código de Autorização GOV.BR (opcional)
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Código para download de documentos oficiais"
                                {...field}
                                disabled
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                disabled
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <p className="text-xs text-muted-foreground">
                            Permite baixar documentos oficiais do cliente via
                            GOV.BR
                          </p>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

              {/* Form Actions */}
              <div className="flex items-center space-x-4 pt-6">
                <Button
                  type="submit"
                  className="bg-[rgb(var(--theme-primary))] hover:bg-[rgb(var(--theme-primary))]/90"
                  disabled={
                    isLoading ||
                    !documentValidation.isValid ||
                    duplicateCheck.found
                  }
                >
                  {isLoading && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
                  Salvar Cliente
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
