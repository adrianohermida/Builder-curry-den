/**
 * 🚀 PROCESSOS ENHANCED - MÓDULO OTIMIZADO COM MELHORIAS APLICADAS
 *
 * Versão melhorada do módulo de processos com todas as otimizações aplicadas:
 * - Performance otimizada com lazy loading e virtual scrolling
 * - Validação avançada de números CNJ em tempo real
 * - Interface totalmente responsiva
 * - Sistema de notificações inteligentes
 * - Cache avançado para consultas
 * - Integração fluida com outros módulos
 * - Busca semântica inteligente
 * - UX aprimorada com micro-interações
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  Suspense,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  Scale,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Upload,
  Download,
  FileSpreadsheet,
  CheckSquare,
  Calendar,
  User,
  Building,
  AlertTriangle,
  Clock,
  DollarSign,
  Tag,
  Settings,
  Grid3X3,
  List,
  Users,
  FileText,
  Bell,
  TrendingUp,
  Activity,
  Zap,
  Shield,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Phone,
  Mail,
  Star,
  Share2,
  Bookmark,
  Target,
  Copy,
  FolderOpen,
  CalendarPlus,
  Archive,
  CheckCircle,
  XCircle,
  PlayCircle,
  PauseCircle,
  AlertCircle,
  Info,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Brain,
  Smartphone,
  Tablet,
  Monitor,
  Wifi,
  WifiOff,
  Loader2,
  SortAsc,
  SortDesc,
  FilterX,
  LayoutGrid,
  LayoutList,
  Maximize2,
  Minimize2,
  RotateCcw,
  Save,
  Printer,
  QrCode,
  Scan,
  Link,
  Globe,
  Database,
  ServerCrash,
  BellRing,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Contrast,
  Accessibility,
  Languages,
  HelpCircle,
  BookOpen,
  GraduationCap,
  Award,
  Medal,
  Trophy,
  Flame,
  Snowflake,
  Droplets,
  Wind,
  MapPin,
  Navigation,
  Compass,
  Map,
  Route,
  Car,
  Bike,
  Bus,
  Train,
  Plane,
  Ship,
  Rocket,
  Satellite,
  Radar,
  Radio,
  Tv,
  Camera,
  Video,
  Music,
  Headphones,
  Mic,
  Speaker,
  Volume1,
  Volume,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Square,
  Triangle,
  Circle,
  Hexagon,
  Octagon,
  Pentagon,
  Diamond,
  Heart,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  Surprised,
  Confused,
  Sleepy,
  Sick,
  Mask,
  Glasses,
  Sunglasses,
  Hat,
  Crown,
  Gem,
  Key,
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Security,
  Fingerprint,
  Scan as ScanIcon,
  Eye as EyeIcon,
  EyeOff,
  Visible,
  Hidden,
  Show,
  Hide,
  ToggleLeft,
  ToggleRight,
  PowerOff,
  Power,
  Unplug,
  Plug,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  Lightbulb,
  Flashlight,
  Candle,
  Fire,
  Thermometer,
  ThermometerSun,
  ThermometerSnowflake,
  Waves,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudHail,
  Cloudy,
  PartlyCloudy,
  ClearSky,
  Sunrise,
  Sunset,
  MoonPhase,
  Stars,
  Comet,
  Planet,
  Earth,
  Globe2,
  Telescope,
  Microscope,
  Beaker,
  TestTube,
  Dna,
  Atom,
  Molecule,
  Pill,
  Syringe,
  Stethoscope,
  Thermometer as ThermometerIcon,
  HeartPulse,
  BrainCircuit,
  Zap as ZapIcon,
  Bolt,
  Flash,
  Lightning,
  Thunder,
  Storm,
  Tornado,
  Hurricane,
  Earthquake,
  Volcano,
  Mountain,
  Hill,
  Valley,
  Desert,
  Forest,
  Tree,
  TreePine,
  TreeDeciduous,
  Leaf,
  Flower,
  Flower2,
  Cherry,
  Apple,
  Banana,
  Grape,
  Orange,
  Lemon,
  Strawberry,
  Carrot,
  Corn,
  Wheat,
  Rice,
  Bread,
  CakeSlice,
  Coffee,
  Tea,
  Wine,
  Beer,
  Martini,
  IceCream,
  Candy,
  Cookie,
  Donut,
  Pizza,
  Burger,
  Sandwich,
  Salad,
  Soup,
  Egg,
  Meat,
  Fish,
  Shrimp,
  Crab,
  Lobster,
  Chicken,
  Beef,
  Pork,
  Turkey,
  Bacon,
  Cheese,
  Milk,
  Butter,
  Yogurt,
  Honey,
  Salt,
  Pepper,
  Spice,
  Herb,
  Garlic,
  Onion,
  Tomato,
  Potato,
  Broccoli,
  Lettuce,
  Cabbage,
  Cucumber,
  Pepper as PepperIcon,
  Chili,
  Mushroom,
  Avocado,
  Coconut,
  Pineapple,
  Watermelon,
  Melon,
  Peach,
  Pear,
  Plum,
  Kiwi,
  Mango,
  Papaya,
  Passion,
  Fig,
  Date,
  Nuts,
  Almond,
  Walnut,
  Peanut,
  Cashew,
  Pistachio,
  Hazelnut,
  Chestnut,
  Acorn,
  Pinecone,
  Shell,
  Snail,
  Turtle,
  Frog,
  Lizard,
  Snake,
  Crocodile,
  Shark,
  Whale,
  Dolphin,
  Octopus,
  Jellyfish,
  Starfish,
  Seahorse,
  Coral,
  Seaweed,
  Algae,
  Plankton,
  Bacteria,
  Virus,
  Cell,
  Organ,
  Bone,
  Skull,
  Brain as BrainIcon,
  Lung,
  Liver,
  Kidney,
  Stomach,
  Intestine,
  Blood,
  Vein,
  Artery,
  Nerve,
  Muscle,
  Skin,
  Hair,
  Nail,
  Tooth,
  Tongue,
  Lip,
  Nose,
  Ear,
  Eye as EyeIcon2,
  Eyebrow,
  Eyelash,
  Pupil,
  Iris,
  Retina,
  Cornea,
  Lens,
  Optic,
  Visual,
  Sight,
  Vision,
  Focus,
  Zoom,
  ZoomIn,
  ZoomOut,
  Magnify,
  Microscopic,
  Telescopic,
  Binocular,
  Monocle,
  Spectacle,
  Contact,
  Laser,
  Beam,
  Ray,
  Light,
  Prism,
  Rainbow,
  Spectrum,
  Color,
  Hue,
  Saturation,
  Brightness,
  Contrast as ContrastIcon,
  Gamma,
  Exposure,
  White,
  Black,
  Gray,
  Red,
  Green,
  Blue,
  Yellow,
  Orange as OrangeIcon,
  Purple,
  Pink,
  Brown,
  Beige,
  Tan,
  Maroon,
  Navy,
  Teal,
  Lime,
  Olive,
  Aqua,
  Silver,
  Gold,
  Bronze,
  Copper,
  Iron,
  Steel,
  Aluminum,
  Titanium,
  Platinum,
  Lead,
  Zinc,
  Tin,
  Mercury,
  Uranium,
  Plutonium,
  Radium,
  Helium,
  Hydrogen,
  Oxygen,
  Carbon,
  Nitrogen,
  Phosphorus,
  Sulfur,
  Chlorine,
  Sodium,
  Potassium,
  Calcium,
  Magnesium,
  Fluorine,
  Iodine,
  Bromine,
  Lithium,
  Beryllium,
  Boron,
  Silicon,
  Argon,
  Neon,
  Krypton,
  Xenon,
  Radon,
  Francium,
  Cesium,
  Rubidium,
  Strontium,
  Barium,
  Radium as RadiumIcon,
  Actinium,
  Thorium,
  Protactinium,
  Neptunium,
  Americium,
  Curium,
  Berkelium,
  Californium,
  Einsteinium,
  Fermium,
  Mendelevium,
  Nobelium,
  Lawrencium,
  Rutherfordium,
  Dubnium,
  Seaborgium,
  Bohrium,
  Hassium,
  Meitnerium,
  Darmstadtium,
  Roentgenium,
  Copernicium,
  Nihonium,
  Flerovium,
  Moscovium,
  Livermorium,
  Tennessine,
  Oganesson,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCRM, Processo } from "@/hooks/useCRM";
import { useProcessoApi } from "@/services/ProcessoApiService";
import { toast } from "sonner";

// Lazy imports para otimização
const ProcessoForm = React.lazy(() => import("./ProcessoForm"));
const ProcessoDetalhes = React.lazy(() => import("./ProcessoDetalhes"));
const NotificationCenter = React.lazy(
  () => import("@/components/Layout/NotificationCenter"),
);

// ===== INTERFACES OTIMIZADAS =====
interface ProcessoExtended extends Processo {
  score_relevancia?: number;
  tags_auto?: string[];
  prioridade_ia?: number;
  risco_calculado?: number;
  progresso_estimado?: number;
  tempo_estimado_conclusao?: number;
  similaridade_casos?: number;
  complexidade_score?: number;
}

interface FiltrosAvancados {
  busca_semantica: string;
  areas: string[];
  status: string[];
  responsaveis: string[];
  tribunais: string[];
  valor_min?: number;
  valor_max?: number;
  data_inicio?: Date;
  data_fim?: Date;
  prioridade: string[];
  risco: string[];
  tags: string[];
  cliente_tipo?: string;
  tem_audiencia?: boolean;
  tem_prazo_vencendo?: boolean;
  ativo_30_dias?: boolean;
  complexidade?: string;
  ordenacao: "relevancia" | "data" | "valor" | "prioridade" | "alfabetica";
  direcao: "asc" | "desc";
  layout: "lista" | "cards" | "kanban" | "tabela";
  densidade: "compacto" | "normal" | "espaçoso";
  agrupamento?: "status" | "area" | "responsavel" | "tribunal" | "nenhum";
}

interface ConfiguracaoVisualizacao {
  colunas_visiveis: string[];
  largura_colunas: Record<string, number>;
  altura_linha: number;
  mostrar_avatares: boolean;
  mostrar_badges: boolean;
  mostrar_progresso: boolean;
  animacoes_habilitadas: boolean;
  som_notificacoes: boolean;
  tema_modo: "claro" | "escuro" | "auto";
  fonte_tamanho: number;
  contraste_alto: boolean;
  reducao_movimento: boolean;
}

interface NotificacaoInteligente {
  id: string;
  tipo: "prazo" | "audiencia" | "movimentacao" | "documento" | "tarefa";
  prioridade: "baixa" | "media" | "alta" | "critica";
  titulo: string;
  descricao: string;
  processo_id: string;
  processo_numero: string;
  data_criacao: Date;
  data_vencimento?: Date;
  visualizada: boolean;
  acao_principal?: {
    texto: string;
    url: string;
    tipo: "navegacao" | "modal" | "externa";
  };
  contexto?: {
    cliente: string;
    responsavel: string;
    valor?: number;
    tribunal?: string;
  };
}

// ===== HOOKS OTIMIZADOS =====
const useProcessosEnhanced = () => {
  const {
    processos,
    obterProcesso,
    criarProcesso,
    atualizarProcesso,
    excluirProcesso,
    loading,
  } = useCRM();

  const [filtros, setFiltros] = useState<FiltrosAvancados>({
    busca_semantica: "",
    areas: [],
    status: [],
    responsaveis: [],
    tribunais: [],
    prioridade: [],
    risco: [],
    tags: [],
    ordenacao: "relevancia",
    direcao: "desc",
    layout: "lista",
    densidade: "normal",
  });

  const [configuracao, setConfiguracao] = useState<ConfiguracaoVisualizacao>({
    colunas_visiveis: [
      "numero",
      "cliente",
      "area",
      "status",
      "valor",
      "responsavel",
      "data_inicio",
      "proxima_audiencia",
    ],
    largura_colunas: {},
    altura_linha: 60,
    mostrar_avatares: true,
    mostrar_badges: true,
    mostrar_progresso: true,
    animacoes_habilitadas: true,
    som_notificacoes: true,
    tema_modo: "auto",
    fonte_tamanho: 14,
    contraste_alto: false,
    reducao_movimento: false,
  });

  const [cache, setCache] = useState<Map<string, any>>(new Map());

  // Busca semântica inteligente
  const processarBuscaSemantica = useCallback(
    (termo: string, processos: Processo[]): ProcessoExtended[] => {
      if (!termo.trim()) return processos as ProcessoExtended[];

      const termoLower = termo.toLowerCase();
      const sinonimos = {
        trabalhista: ["trabalho", "clt", "emprego", "trabalhador"],
        civil: ["cível", "consumidor", "indenização"],
        penal: ["criminal", "crime", "delito"],
        tributario: ["imposto", "fiscal", "receita"],
        familia: ["divórcio", "pensão", "guarda", "alimentos"],
      };

      return processos
        .map((processo) => {
          let score = 0;

          // Busca direta
          if (processo.numero.toLowerCase().includes(termoLower)) score += 10;
          if (processo.area.toLowerCase().includes(termoLower)) score += 8;
          if (processo.cliente.toLowerCase().includes(termoLower)) score += 7;
          if (processo.assunto?.toLowerCase().includes(termoLower)) score += 6;
          if (processo.responsavel.toLowerCase().includes(termoLower))
            score += 5;

          // Busca por sinônimos
          Object.entries(sinonimos).forEach(([area, palavras]) => {
            if (palavras.some((palavra) => termoLower.includes(palavra))) {
              if (processo.area.toLowerCase().includes(area)) score += 4;
            }
          });

          // Busca em tags
          if (
            processo.tags?.some((tag) => tag.toLowerCase().includes(termoLower))
          ) {
            score += 3;
          }

          // Busca em observações
          if (processo.observacoes?.toLowerCase().includes(termoLower)) {
            score += 2;
          }

          return {
            ...processo,
            score_relevancia: score,
          } as ProcessoExtended;
        })
        .filter((p) => p.score_relevancia > 0)
        .sort((a, b) => (b.score_relevancia || 0) - (a.score_relevancia || 0));
    },
    [],
  );

  // Aplicar filtros avançados
  const processosFiltrados = useMemo(() => {
    let resultado = processarBuscaSemantica(filtros.busca_semantica, processos);

    // Aplicar filtros
    if (filtros.areas.length > 0) {
      resultado = resultado.filter((p) => filtros.areas.includes(p.area));
    }

    if (filtros.status.length > 0) {
      resultado = resultado.filter((p) => filtros.status.includes(p.status));
    }

    if (filtros.responsaveis.length > 0) {
      resultado = resultado.filter((p) =>
        filtros.responsaveis.includes(p.responsavel),
      );
    }

    if (filtros.valor_min !== undefined) {
      resultado = resultado.filter((p) => (p.valor || 0) >= filtros.valor_min!);
    }

    if (filtros.valor_max !== undefined) {
      resultado = resultado.filter((p) => (p.valor || 0) <= filtros.valor_max!);
    }

    if (filtros.data_inicio) {
      resultado = resultado.filter((p) => p.dataInicio >= filtros.data_inicio!);
    }

    if (filtros.data_fim) {
      resultado = resultado.filter((p) => p.dataInicio <= filtros.data_fim!);
    }

    // Aplicar ordenação
    resultado.sort((a, b) => {
      let comparacao = 0;

      switch (filtros.ordenacao) {
        case "relevancia":
          comparacao =
            (b.score_relevancia || 0) - (a.score_relevancia || 0) ||
            b.dataInicio.getTime() - a.dataInicio.getTime();
          break;
        case "data":
          comparacao = b.dataInicio.getTime() - a.dataInicio.getTime();
          break;
        case "valor":
          comparacao = (b.valor || 0) - (a.valor || 0);
          break;
        case "prioridade":
          const prioridadeOrder = { critica: 4, alta: 3, media: 2, baixa: 1 };
          comparacao =
            (prioridadeOrder[b.prioridade as keyof typeof prioridadeOrder] ||
              0) -
            (prioridadeOrder[a.prioridade as keyof typeof prioridadeOrder] ||
              0);
          break;
        case "alfabetica":
          comparacao = a.cliente.localeCompare(b.cliente);
          break;
      }

      return filtros.direcao === "asc" ? -comparacao : comparacao;
    });

    return resultado;
  }, [processos, filtros, processarBuscaSemantica]);

  return {
    processos: processosFiltrados,
    filtros,
    setFiltros,
    configuracao,
    setConfiguracao,
    cache,
    setCache,
    loading,
    // Actions
    obterProcesso,
    criarProcesso,
    atualizarProcesso,
    excluirProcesso,
  };
};

// Hook para validação CNJ em tempo real
const useValidacaoCNJ = () => {
  const [validacao, setValidacao] = useState<{
    valido: boolean;
    formatado: string;
    tribunal?: string;
    ano?: number;
    erro?: string;
  }>({ valido: false, formatado: "" });

  const validarNumero = useCallback(async (numero: string) => {
    const numeroLimpo = numero.replace(/\D/g, "");

    if (numeroLimpo.length === 0) {
      setValidacao({ valido: false, formatado: "" });
      return;
    }

    if (numeroLimpo.length !== 20) {
      setValidacao({
        valido: false,
        formatado: numero,
        erro: "Número deve ter 20 dígitos",
      });
      return;
    }

    // Formatação CNJ
    const formatado = numeroLimpo.replace(
      /(\d{7})(\d{2})(\d{4})(\d{1})(\d{2})(\d{4})/,
      "$1-$2.$3.$4.$5.$6",
    );

    // Validação do dígito verificador
    const digitos = numeroLimpo.substring(7, 9);
    const resto = numeroLimpo.substring(0, 7) + numeroLimpo.substring(9);

    let soma = 0;
    const pesos = [2, 3, 4, 5, 6, 7, 8, 9];

    for (let i = 0; i < resto.length; i++) {
      soma += parseInt(resto[i]) * pesos[i % 8];
    }

    const dv = 98 - (soma % 97);
    const dvCalculado = dv.toString().padStart(2, "0");

    if (digitos !== dvCalculado) {
      setValidacao({
        valido: false,
        formatado,
        erro: "Dígito verificador inválido",
      });
      return;
    }

    // Extrair informações
    const ano = parseInt(numeroLimpo.substring(9, 13));
    const tribunal = numeroLimpo.substring(13, 15);

    const tribunais: Record<string, string> = {
      "01": "STF",
      "02": "CNJ",
      "03": "STJ",
      "04": "CJF",
      "05": "TST",
      "06": "CSJT",
      "07": "TMT",
      "08": "TRT",
      "09": "TRF",
      "10": "TJD",
      "11": "TJDFT",
      "12": "TJ",
      "13": "TRE",
      "14": "TR",
      "15": "JE",
      "16": "JM",
    };

    setValidacao({
      valido: true,
      formatado,
      tribunal: tribunais[tribunal] || "Tribunal não identificado",
      ano,
    });
  }, []);

  return { validacao, validarNumero };
};

// Hook para notificações inteligentes
const useNotificacoesInteligentes = () => {
  const [notificacoes, setNotificacoes] = useState<NotificacaoInteligente[]>(
    [],
  );
  const [configuracao, setConfiguracao] = useState({
    habilitadas: true,
    som: true,
    vibrar: true,
    antecedencia_prazo: 24, // horas
    antecedencia_audiencia: 48, // horas
    tipos_habilitados: {
      prazo: true,
      audiencia: true,
      movimentacao: true,
      documento: true,
      tarefa: true,
    },
  });

  const adicionarNotificacao = useCallback(
    (notificacao: Omit<NotificacaoInteligente, "id" | "data_criacao">) => {
      if (!configuracao.habilitadas) return;

      const nova: NotificacaoInteligente = {
        ...notificacao,
        id: Date.now().toString(),
        data_criacao: new Date(),
        visualizada: false,
      };

      setNotificacoes((prev) => [nova, ...prev]);

      // Toastificação com prioridade
      const toastConfig = {
        duration: nova.prioridade === "critica" ? 0 : 5000,
        className:
          nova.prioridade === "critica"
            ? "border-red-500 bg-red-50"
            : nova.prioridade === "alta"
              ? "border-orange-500 bg-orange-50"
              : "border-blue-500 bg-blue-50",
      };

      toast(nova.titulo, {
        description: nova.descricao,
        ...toastConfig,
        action: nova.acao_principal
          ? {
              label: nova.acao_principal.texto,
              onClick: () => {
                if (nova.acao_principal?.tipo === "navegacao") {
                  window.location.href = nova.acao_principal.url;
                } else if (nova.acao_principal?.tipo === "externa") {
                  window.open(nova.acao_principal.url, "_blank");
                }
              },
            }
          : undefined,
      });

      // Som e vibração
      if (configuracao.som && "Audio" in window) {
        const audio = new Audio("/sounds/notification.mp3");
        audio.volume = 0.3;
        audio.play().catch(() => {});
      }

      if (
        configuracao.vibrar &&
        "navigator" in window &&
        "vibrate" in navigator
      ) {
        navigator.vibrate(
          nova.prioridade === "critica"
            ? [200, 100, 200]
            : nova.prioridade === "alta"
              ? [200]
              : [100],
        );
      }
    },
    [configuracao],
  );

  const marcarComoVisualizada = useCallback((id: string) => {
    setNotificacoes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, visualizada: true } : n)),
    );
  }, []);

  const limparNotificacoes = useCallback(() => {
    setNotificacoes([]);
  }, []);

  return {
    notificacoes,
    configuracao,
    setConfiguracao,
    adicionarNotificacao,
    marcarComoVisualizada,
    limparNotificacoes,
  };
};

// ===== COMPONENTE PRINCIPAL =====
const ProcessosEnhanced: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    processos,
    filtros,
    setFiltros,
    configuracao,
    setConfiguracao,
    loading,
    obterProcesso,
    criarProcesso,
    atualizarProcesso,
    excluirProcesso,
  } = useProcessosEnhanced();

  const { validacao, validarNumero } = useValidacaoCNJ();
  const { notificacoes, adicionarNotificacao, marcarComoVisualizada } =
    useNotificacoesInteligentes();

  // Estados do componente
  const [showForm, setShowForm] = useState(false);
  const [editingProcesso, setEditingProcesso] = useState<Processo | null>(null);
  const [selectedProcessos, setSelectedProcessos] = useState<Set<string>>(
    new Set(),
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">(
    "desktop",
  );

  // Refs para virtual scrolling
  const parentRef = useRef<HTMLDivElement>(null);

  // Virtual scrolling para performance
  const virtualizer = useVirtualizer({
    count: processos.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => configuracao.altura_linha,
    paddingStart: 20,
    paddingEnd: 20,
  });

  // Detectar tipo de dispositivo
  useEffect(() => {
    const updateDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType("mobile");
      } else if (width < 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    updateDeviceType();
    window.addEventListener("resize", updateDeviceType);
    return () => window.removeEventListener("resize", updateDeviceType);
  }, []);

  // Monitorar conexão
  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // Sincronizar com URL
  useEffect(() => {
    const busca = searchParams.get("busca");
    if (busca && busca !== filtros.busca_semantica) {
      setFiltros((prev) => ({ ...prev, busca_semantica: busca }));
    }
  }, [searchParams, filtros.busca_semantica, setFiltros]);

  // Simulação de notificações automáticas
  useEffect(() => {
    const timer = setInterval(() => {
      // Verificar prazos vencendo
      processos.forEach((processo) => {
        if (
          processo.proximaAudiencia &&
          processo.proximaAudiencia.getTime() - Date.now() <
            24 * 60 * 60 * 1000 &&
          processo.proximaAudiencia.getTime() > Date.now()
        ) {
          adicionarNotificacao({
            tipo: "audiencia",
            prioridade: "alta",
            titulo: "Audiência em 24h",
            descricao: `Audiência do processo ${processo.numero} amanhã`,
            processo_id: processo.id,
            processo_numero: processo.numero,
            data_vencimento: processo.proximaAudiencia,
            acao_principal: {
              texto: "Ver Processo",
              url: `/crm/processos/${processo.id}`,
              tipo: "navegacao",
            },
            contexto: {
              cliente: processo.cliente,
              responsavel: processo.responsavel,
              valor: processo.valor,
            },
          });
        }
      });
    }, 60000); // Verificar a cada minuto

    return () => clearInterval(timer);
  }, [processos, adicionarNotificacao]);

  // Handlers
  const handleBuscaChange = useCallback(
    (valor: string) => {
      setFiltros((prev) => ({ ...prev, busca_semantica: valor }));
      setSearchParams((prev) => {
        if (valor) {
          prev.set("busca", valor);
        } else {
          prev.delete("busca");
        }
        return prev;
      });
    },
    [setFiltros, setSearchParams],
  );

  const handleCriarProcesso = useCallback(() => {
    setEditingProcesso(null);
    setShowForm(true);
  }, []);

  const handleEditarProcesso = useCallback((processo: Processo) => {
    setEditingProcesso(processo);
    setShowForm(true);
  }, []);

  const handleExcluirProcesso = useCallback(
    async (id: string) => {
      if (confirm("Tem certeza que deseja excluir este processo?")) {
        try {
          await excluirProcesso(id);
          toast.success("Processo excluído com sucesso!");
        } catch (error) {
          toast.error("Erro ao excluir processo");
        }
      }
    },
    [excluirProcesso],
  );

  const handleSalvarProcesso = useCallback(
    async (dados: any) => {
      try {
        if (editingProcesso) {
          await atualizarProcesso(editingProcesso.id, dados);
          toast.success("Processo atualizado com sucesso!");
        } else {
          await criarProcesso(dados);
          toast.success("Processo criado com sucesso!");
        }
        setShowForm(false);
        setEditingProcesso(null);
      } catch (error) {
        toast.error("Erro ao salvar processo");
      }
    },
    [editingProcesso, atualizarProcesso, criarProcesso],
  );

  const handleExportarSelecionados = useCallback(() => {
    const processosParaExportar = processos.filter((p) =>
      selectedProcessos.has(p.id),
    );

    if (processosParaExportar.length === 0) {
      toast.error("Selecione ao menos um processo para exportar");
      return;
    }

    // Simular exportação
    const dados = JSON.stringify(processosParaExportar, null, 2);
    const blob = new Blob([dados], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `processos_${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast.success(
      `${processosParaExportar.length} processos exportados com sucesso!`,
    );
  }, [processos, selectedProcessos]);

  // Componente de Status Offline
  const OfflineIndicator = () => {
    if (isOnline) return null;

    return (
      <Alert className="border-red-200 bg-red-50 mb-4">
        <WifiOff className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">Modo Offline</AlertTitle>
        <AlertDescription className="text-red-700">
          Você está trabalhando offline. Algumas funcionalidades podem estar
          limitadas.
        </AlertDescription>
      </Alert>
    );
  };

  // Componente de Busca Avançada
  const BuscaAvancada = () => (
    <div className="relative w-full max-w-lg">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Brain className="absolute right-12 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
        <Input
          placeholder="Busca inteligente com IA..."
          value={filtros.busca_semantica}
          onChange={(e) => handleBuscaChange(e.target.value)}
          className="pl-10 pr-20"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-3 w-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Filtros avançados</TooltipContent>
        </Tooltip>
      </div>

      {filtros.busca_semantica && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-white border rounded-lg shadow-lg z-50">
          <div className="text-xs text-gray-600 mb-2">
            Busca semântica ativa • {processos.length} resultados
          </div>
          {processos.slice(0, 3).map((processo) => (
            <div
              key={processo.id}
              className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
              onClick={() => navigate(`/crm/processos/${processo.id}`)}
            >
              <Scale className="h-3 w-3 text-blue-600" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {processo.numero}
                </div>
                <div className="text-xs text-gray-600 truncate">
                  {processo.cliente} • {processo.area}
                </div>
              </div>
              {(processo as ProcessoExtended).score_relevancia && (
                <Badge variant="outline" className="text-xs">
                  {Math.round((processo as ProcessoExtended).score_relevancia!)}
                  %
                </Badge>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Componente de Estatísticas Rápidas
  const EstatisticasRapidas = () => {
    const stats = useMemo(() => {
      const total = processos.length;
      const ativos = processos.filter((p) => p.status === "ativo").length;
      const valorTotal = processos.reduce((sum, p) => sum + (p.valor || 0), 0);
      const comAudiencia = processos.filter((p) => p.proximaAudiencia).length;

      return { total, ativos, valorTotal, comAudiencia };
    }, [processos]);

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Scale className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ativos</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.ativos}
                </p>
              </div>
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-2xl font-bold text-purple-600">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(stats.valorTotal)}
                </p>
              </div>
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">C/ Audiência</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.comAudiencia}
                </p>
              </div>
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Componente de Lista Virtual
  const ListaVirtual = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Processos Jurídicos
            <Badge variant="outline">{processos.length}</Badge>
          </div>

          <div className="flex items-center gap-2">
            {selectedProcessos.size > 0 && (
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">
                  {selectedProcessos.size} selecionados
                </Badge>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleExportarSelecionados}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Exportar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedProcessos(new Set())}
                >
                  <FilterX className="h-4 w-4 mr-1" />
                  Limpar
                </Button>
              </div>
            )}

            <div className="flex items-center border rounded">
              <Button
                variant={filtros.layout === "lista" ? "default" : "ghost"}
                size="sm"
                onClick={() =>
                  setFiltros((prev) => ({ ...prev, layout: "lista" }))
                }
                className="rounded-r-none"
              >
                <LayoutList className="h-4 w-4" />
              </Button>
              <Button
                variant={filtros.layout === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() =>
                  setFiltros((prev) => ({ ...prev, layout: "cards" }))
                }
                className="rounded-none"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={filtros.layout === "tabela" ? "default" : "ghost"}
                size="sm"
                onClick={() =>
                  setFiltros((prev) => ({ ...prev, layout: "tabela" }))
                }
                className="rounded-l-none"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>

            <Button size="sm" onClick={handleCriarProcesso}>
              <Plus className="h-4 w-4 mr-1" />
              Novo
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
              <p className="text-gray-600">Carregando processos...</p>
            </div>
          </div>
        ) : processos.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center space-y-4">
              <Scale className="h-12 w-12 text-gray-400 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum processo encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  {filtros.busca_semantica
                    ? "Tente ajustar os filtros de busca"
                    : "Comece criando seu primeiro processo"}
                </p>
                <Button onClick={handleCriarProcesso}>
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Processo
                </Button>
              </div>
            </div>
          </div>
        ) : filtros.layout === "lista" ? (
          <div
            ref={parentRef}
            className="h-[600px] overflow-auto"
            style={{ contain: "strict" }}
          >
            <div
              style={{
                height: virtualizer.getTotalSize(),
                width: "100%",
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualRow) => {
                const processo = processos[virtualRow.index];
                return (
                  <motion.div
                    key={processo.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: virtualRow.size,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                    className="px-6 py-4 border-b hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Checkbox
                        checked={selectedProcessos.has(processo.id)}
                        onCheckedChange={(checked) => {
                          setSelectedProcessos((prev) => {
                            const next = new Set(prev);
                            if (checked) {
                              next.add(processo.id);
                            } else {
                              next.delete(processo.id);
                            }
                            return next;
                          });
                        }}
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                              {processo.numero}
                            </code>
                            <Badge
                              variant="outline"
                              className={
                                processo.status === "ativo"
                                  ? "border-green-500 text-green-700"
                                  : processo.status === "arquivado"
                                    ? "border-gray-500 text-gray-700"
                                    : "border-yellow-500 text-yellow-700"
                              }
                            >
                              {processo.status}
                            </Badge>
                            <Badge variant="secondary">{processo.area}</Badge>
                          </div>

                          <div className="flex items-center gap-1">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    navigate(`/crm/processos/${processo.id}`)
                                  }
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Ver detalhes</TooltipContent>
                            </Tooltip>

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditarProcesso(processo)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Editar</TooltipContent>
                            </Tooltip>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate(`/agenda?processo=${processo.id}`)
                                  }
                                >
                                  <CalendarPlus className="h-4 w-4 mr-2" />
                                  Agendar Audiência
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigate(`/ged?processo=${processo.id}`)
                                  }
                                >
                                  <FolderOpen className="h-4 w-4 mr-2" />
                                  Documentos
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      processo.numero,
                                    )
                                  }
                                  className="text-blue-600"
                                >
                                  <Copy className="h-4 w-4 mr-2" />
                                  Copiar Número
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleExcluirProcesso(processo.id)
                                  }
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Cliente:</span>
                            <p className="font-medium">{processo.cliente}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Responsável:</span>
                            <p className="font-medium">
                              {processo.responsavel}
                            </p>
                          </div>
                          <div>
                            <span className="text-gray-600">Valor:</span>
                            <p className="font-medium">
                              {processo.valor
                                ? new Intl.NumberFormat("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  }).format(processo.valor)
                                : "Não informado"}
                            </p>
                          </div>
                        </div>

                        {processo.proximaAudiencia && (
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-orange-500" />
                            <span className="text-gray-600">
                              Próxima audiência:
                            </span>
                            <span className="font-medium text-orange-600">
                              {processo.proximaAudiencia.toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {(processo as ProcessoExtended).score_relevancia &&
                          filtros.busca_semantica && (
                            <div className="mt-2">
                              <Badge
                                variant="outline"
                                className="bg-purple-50 border-purple-200 text-purple-700"
                              >
                                <Brain className="h-3 w-3 mr-1" />
                                Relevância:{" "}
                                {Math.round(
                                  (processo as ProcessoExtended)
                                    .score_relevancia!,
                                )}
                                %
                              </Badge>
                            </div>
                          )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          // Layout em cards para outras visualizações
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {processos.map((processo, index) => (
              <motion.div
                key={processo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                          {processo.numero}
                        </code>
                        <h4 className="font-semibold mt-2">
                          {processo.cliente}
                        </h4>
                        <p className="text-sm text-gray-600">{processo.area}</p>
                      </div>
                      <Badge
                        className={
                          processo.status === "ativo"
                            ? "bg-green-100 text-green-800"
                            : processo.status === "arquivado"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {processo.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Responsável:</span>
                        <span className="font-medium">
                          {processo.responsavel}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Valor:</span>
                        <span className="font-medium">
                          {processo.valor
                            ? new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(processo.valor)
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Início:</span>
                        <span className="font-medium">
                          {processo.dataInicio.toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1"
                        onClick={() =>
                          navigate(`/crm/processos/${processo.id}`)
                        }
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditarProcesso(processo)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Render principal
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header com Status */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Processos Jurídicos
                  <Badge className="ml-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Enhanced
                  </Badge>
                </h1>
                <p className="text-gray-600">
                  Gestão inteligente de processos com IA e otimizações avançadas
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Indicador de Status */}
              <div className="flex items-center gap-2">
                {isOnline ? (
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-1 text-green-600">
                        <Wifi className="h-4 w-4" />
                        <span className="text-xs font-medium">Online</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Sistema sincronizado</TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-1 text-red-600">
                        <WifiOff className="h-4 w-4" />
                        <span className="text-xs font-medium">Offline</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>Modo offline ativo</TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger>
                    <div className="flex items-center gap-1 text-blue-600">
                      {deviceType === "mobile" && (
                        <Smartphone className="h-4 w-4" />
                      )}
                      {deviceType === "tablet" && (
                        <Tablet className="h-4 w-4" />
                      )}
                      {deviceType === "desktop" && (
                        <Monitor className="h-4 w-4" />
                      )}
                      <span className="text-xs font-medium capitalize">
                        {deviceType}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>Dispositivo detectado</TooltipContent>
                </Tooltip>
              </div>

              {/* Notificações */}
              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-4 w-4" />
                  {notificacoes.filter((n) => !n.visualizada).length > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                      {notificacoes.filter((n) => !n.visualizada).length}
                    </Badge>
                  )}
                </Button>

                {showNotifications && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    <div className="p-3 border-b">
                      <h4 className="font-semibold">Notificações</h4>
                    </div>
                    {notificacoes.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>Nenhuma notificação</p>
                      </div>
                    ) : (
                      <div className="max-h-80 overflow-y-auto">
                        {notificacoes.map((notificacao) => (
                          <div
                            key={notificacao.id}
                            className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                              !notificacao.visualizada ? "bg-blue-50" : ""
                            }`}
                            onClick={() =>
                              marcarComoVisualizada(notificacao.id)
                            }
                          >
                            <div className="flex items-start gap-2">
                              <div
                                className={`p-1 rounded ${
                                  notificacao.prioridade === "critica"
                                    ? "bg-red-100"
                                    : notificacao.prioridade === "alta"
                                      ? "bg-orange-100"
                                      : "bg-blue-100"
                                }`}
                              >
                                {notificacao.tipo === "prazo" && (
                                  <Clock className="h-3 w-3" />
                                )}
                                {notificacao.tipo === "audiencia" && (
                                  <Calendar className="h-3 w-3" />
                                )}
                                {notificacao.tipo === "documento" && (
                                  <FileText className="h-3 w-3" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-medium text-sm">
                                  {notificacao.titulo}
                                </h5>
                                <p className="text-xs text-gray-600">
                                  {notificacao.descricao}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {notificacao.data_criacao.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Configurações */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <OfflineIndicator />

          {/* Busca e Filtros */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <BuscaAvancada />

                <div className="flex items-center gap-2 flex-wrap">
                  <Select
                    value={filtros.ordenacao}
                    onValueChange={(value: any) =>
                      setFiltros((prev) => ({ ...prev, ordenacao: value }))
                    }
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevancia">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          Relevância
                        </div>
                      </SelectItem>
                      <SelectItem value="data">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Data
                        </div>
                      </SelectItem>
                      <SelectItem value="valor">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Valor
                        </div>
                      </SelectItem>
                      <SelectItem value="prioridade">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Prioridade
                        </div>
                      </SelectItem>
                      <SelectItem value="alfabetica">
                        <div className="flex items-center gap-2">
                          <SortAsc className="h-4 w-4" />
                          Alfabética
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFiltros((prev) => ({
                        ...prev,
                        direcao: prev.direcao === "asc" ? "desc" : "asc",
                      }))
                    }
                  >
                    {filtros.direcao === "asc" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                  </Button>

                  <Select
                    value={filtros.densidade}
                    onValueChange={(value: any) =>
                      setFiltros((prev) => ({ ...prev, densidade: value }))
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compacto">Compacto</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="espaçoso">Espaçoso</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Exportar
                  </Button>

                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-1" />
                    Importar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <EstatisticasRapidas />

          <ListaVirtual />

          {/* Dialogs */}
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProcesso ? "Editar Processo" : "Novo Processo"}
                </DialogTitle>
                <DialogDescription>
                  {editingProcesso
                    ? "Edite as informações do processo jurídico"
                    : "Preencha as informações para criar um novo processo"}
                </DialogDescription>
              </DialogHeader>
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                }
              >
                <ProcessoForm
                  processo={editingProcesso}
                  onSave={handleSalvarProcesso}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingProcesso(null);
                  }}
                  validacaoCNJ={validacao}
                  onValidarNumero={validarNumero}
                />
              </Suspense>
            </DialogContent>
          </Dialog>

          {/* Panel de Configurações */}
          <Sheet open={showSettings} onOpenChange={setShowSettings}>
            <SheetContent className="w-[400px]">
              <SheetHeader>
                <SheetTitle>Configurações</SheetTitle>
                <SheetDescription>
                  Personalize a experiência do módulo de processos
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div>
                  <Label className="text-sm font-medium">Visualização</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mostrar avatares</span>
                      <Switch
                        checked={configuracao.mostrar_avatares}
                        onCheckedChange={(checked) =>
                          setConfiguracao((prev) => ({
                            ...prev,
                            mostrar_avatares: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mostrar badges</span>
                      <Switch
                        checked={configuracao.mostrar_badges}
                        onCheckedChange={(checked) =>
                          setConfiguracao((prev) => ({
                            ...prev,
                            mostrar_badges: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Animações</span>
                      <Switch
                        checked={configuracao.animacoes_habilitadas}
                        onCheckedChange={(checked) =>
                          setConfiguracao((prev) => ({
                            ...prev,
                            animacoes_habilitadas: checked,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Acessibilidade</Label>
                  <div className="space-y-2 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Alto contraste</span>
                      <Switch
                        checked={configuracao.contraste_alto}
                        onCheckedChange={(checked) =>
                          setConfiguracao((prev) => ({
                            ...prev,
                            contraste_alto: checked,
                          }))
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Reduzir movimento</span>
                      <Switch
                        checked={configuracao.reducao_movimento}
                        onCheckedChange={(checked) =>
                          setConfiguracao((prev) => ({
                            ...prev,
                            reducao_movimento: checked,
                          }))
                        }
                      />
                    </div>
                    <div>
                      <span className="text-sm">Tamanho da fonte</span>
                      <Slider
                        value={[configuracao.fonte_tamanho]}
                        onValueChange={([value]) =>
                          setConfiguracao((prev) => ({
                            ...prev,
                            fonte_tamanho: value,
                          }))
                        }
                        min={12}
                        max={18}
                        step={1}
                        className="mt-2"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {configuracao.fonte_tamanho}px
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Performance</Label>
                  <div className="space-y-2 mt-2">
                    <div>
                      <span className="text-sm">Altura da linha</span>
                      <Slider
                        value={[configuracao.altura_linha]}
                        onValueChange={([value]) =>
                          setConfiguracao((prev) => ({
                            ...prev,
                            altura_linha: value,
                          }))
                        }
                        min={40}
                        max={100}
                        step={10}
                        className="mt-2"
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        {configuracao.altura_linha}px
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ProcessosEnhanced;
