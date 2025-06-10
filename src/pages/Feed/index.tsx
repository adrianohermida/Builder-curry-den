import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Users,
  MessageSquare,
  Heart,
  Share2,
  Paperclip,
  Image,
  Video,
  File,
  Calendar,
  Target,
  Scale,
  TrendingUp,
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  Send,
  Smile,
  AtSign,
  Hash,
  Pin,
  Edit,
  Trash2,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { usePermissions } from "@/hooks/usePermissions";
import { cn } from "@/lib/utils";

// Types
interface FeedPost {
  id: string;
  type: "post" | "task" | "client" | "process" | "meeting" | "announcement";
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  content: string;
  attachments?: FeedAttachment[];
  mentions?: string[];
  tags?: string[];
  relatedTo?: {
    type: "client" | "process" | "task" | "meeting";
    id: string;
    title: string;
  };
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isPinned?: boolean;
  visibility: "public" | "team" | "private";
}

interface FeedAttachment {
  id: string;
  type: "image" | "video" | "document" | "link";
  name: string;
  size?: string;
  url: string;
  thumbnail?: string;
}

interface FeedComment {
  id: string;
  postId: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}

interface FeedNotification {
  id: string;
  type: "like" | "comment" | "mention" | "task" | "deadline" | "client";
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  relatedPost?: string;
  actionUrl?: string;
}

const FeedPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = usePermissions();

  // State
  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [notifications, setNotifications] = useState<FeedNotification[]>([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostType, setNewPostType] = useState<FeedPost["type"]>("post");
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Sample data - DADOS REALISTAS DO ESCRITÓRIO JURÍDICO
  useEffect(() => {
    const samplePosts: FeedPost[] = [
      {
        id: "1",
        type: "announcement",
        author: {
          id: "admin",
          name: "Dr. Roberto Silva",
          avatar: "/api/placeholder/40/40",
          role: "Sócio-Diretor",
        },
        content:
          "🎉 Grande vitória no processo trabalhista da TechCorp! Conseguimos reverter a decisão em segunda instância. Parabéns a toda equipe envolvida, especialmente à Dra. Ana Costa pela excelente estratégia jurídica.",
        relatedTo: {
          type: "process",
          id: "proc-001",
          title: "Ação Trabalhista TechCorp #2024-001",
        },
        timestamp: "2 horas atrás",
        likes: 12,
        comments: 5,
        isLiked: false,
        isPinned: true,
        visibility: "public",
        tags: ["vitória", "trabalhista", "techcorp"],
      },
      {
        id: "2",
        type: "task",
        author: {
          id: "ana",
          name: "Dra. Ana Costa",
          avatar: "/api/placeholder/40/40",
          role: "Advogada Senior",
        },
        content:
          "Finalizei a revisão contratual para a StartupLegal. Encontrei algumas cláusulas que precisam ser ajustadas. @carlos.lima pode revisar a parte de propriedade intelectual?",
        relatedTo: {
          type: "client",
          id: "client-003",
          title: "StartupLegal Inc",
        },
        attachments: [
          {
            id: "att-1",
            type: "document",
            name: "Contrato_StartupLegal_v2.pdf",
            size: "2.3 MB",
            url: "/documents/contract.pdf",
          },
        ],
        mentions: ["carlos.lima"],
        timestamp: "4 horas atrás",
        likes: 3,
        comments: 2,
        isLiked: true,
        visibility: "team",
        tags: ["contrato", "startup", "revisão"],
      },
      {
        id: "3",
        type: "client",
        author: {
          id: "pedro",
          name: "Pedro Oliveira",
          avatar: "/api/placeholder/40/40",
          role: "Advogado Júnior",
        },
        content:
          "Novo cliente cadastrado: Silva & Associados LTDA. Primeira consulta agendada para amanhã às 14h. Área: Direito Empresarial. Valor estimado do contrato: R$ 85.000",
        relatedTo: {
          type: "client",
          id: "client-004",
          title: "Silva & Associados LTDA",
        },
        timestamp: "6 horas atrás",
        likes: 8,
        comments: 3,
        isLiked: false,
        visibility: "public",
        tags: ["novo-cliente", "empresarial", "consulta"],
      },
      {
        id: "4",
        type: "meeting",
        author: {
          id: "carlos",
          name: "Carlos Lima",
          avatar: "/api/placeholder/40/40",
          role: "Advogado Pleno",
        },
        content:
          "Reunião produtiva com o cliente MegaCorp! Fechamos o contrato de consultoria jurídica mensal. Próximos passos: elaborar cronograma de atividades e definir KPIs.",
        relatedTo: {
          type: "meeting",
          id: "meet-001",
          title: "Reunião MegaCorp - Consultoria",
        },
        timestamp: "1 dia atrás",
        likes: 15,
        comments: 7,
        isLiked: true,
        visibility: "public",
        tags: ["megacorp", "consultoria", "contrato-fechado"],
      },
      {
        id: "5",
        type: "process",
        author: {
          id: "maria",
          name: "Dra. Maria Santos",
          avatar: "/api/placeholder/40/40",
          role: "Advogada Senior",
        },
        content:
          "⚠️ ATENÇÃO: Prazo do processo #2024-005 vence em 3 dias! Preciso finalizar a contestação. Se alguém puder ajudar com a pesquisa jurisprudencial, agradeço muito.",
        relatedTo: {
          type: "process",
          id: "proc-005",
          title: "Ação Civil Pública #2024-005",
        },
        timestamp: "1 dia atrás",
        likes: 2,
        comments: 4,
        isLiked: false,
        visibility: "team",
        tags: ["prazo", "urgente", "contestação"],
      },
    ];

    const sampleNotifications: FeedNotification[] = [
      {
        id: "notif-1",
        type: "mention",
        title: "Você foi mencionado",
        description: "Ana Costa te mencionou em um post sobre contrato",
        timestamp: "30 min atrás",
        isRead: false,
        relatedPost: "2",
      },
      {
        id: "notif-2",
        type: "task",
        title: "Nova tarefa atribuída",
        description: "Revisar documentos da StartupLegal",
        timestamp: "2 horas atrás",
        isRead: false,
        actionUrl: "/crm/tarefas",
      },
      {
        id: "notif-3",
        type: "deadline",
        title: "Prazo próximo",
        description: "Processo #2024-005 vence em 3 dias",
        timestamp: "3 horas atrás",
        isRead: true,
        actionUrl: "/crm/processos",
      },
      {
        id: "notif-4",
        type: "client",
        title: "Novo cliente",
        description: "Silva & Associados foi cadastrado",
        timestamp: "6 horas atrás",
        isRead: true,
        actionUrl: "/crm/clientes",
      },
    ];

    setPosts(samplePosts);
    setNotifications(sampleNotifications);
  }, []);

  // Handlers
  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;

    const newPost: FeedPost = {
      id: Date.now().toString(),
      type: newPostType,
      author: {
        id: user?.id || "current",
        name: user?.name || "Usuário",
        avatar: user?.avatar,
        role: user?.role || "Advogado",
      },
      content: newPostContent,
      timestamp: "Agora",
      likes: 0,
      comments: 0,
      isLiked: false,
      visibility: "public",
    };

    setPosts([newPost, ...posts]);
    setNewPostContent("");
    setIsCreatingPost(false);
  };

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  };

  const handleNavigateToRelated = (relatedTo: FeedPost["relatedTo"]) => {
    if (!relatedTo) return;

    switch (relatedTo.type) {
      case "client":
        navigate(`/crm/clientes/${relatedTo.id}`);
        break;
      case "process":
        navigate(`/crm/processos/${relatedTo.id}`);
        break;
      case "task":
        navigate(`/crm/tarefas/${relatedTo.id}`);
        break;
      case "meeting":
        navigate(`/agenda/${relatedTo.id}`);
        break;
    }
  };

  const getPostTypeIcon = (type: FeedPost["type"]) => {
    switch (type) {
      case "announcement":
        return <Bell className="w-4 h-4" />;
      case "task":
        return <Target className="w-4 h-4" />;
      case "client":
        return <Users className="w-4 h-4" />;
      case "process":
        return <Scale className="w-4 h-4" />;
      case "meeting":
        return <Calendar className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getPostTypeColor = (type: FeedPost["type"]) => {
    switch (type) {
      case "announcement":
        return "text-blue-600 bg-blue-100";
      case "task":
        return "text-green-600 bg-green-100";
      case "client":
        return "text-purple-600 bg-purple-100";
      case "process":
        return "text-orange-600 bg-orange-100";
      case "meeting":
        return "text-indigo-600 bg-indigo-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (activeTab === "all") return true;
    if (activeTab === "my") return post.author.id === user?.id;
    return post.type === activeTab;
  });

  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Feed</h1>
              <p className="text-gray-600 mt-1">
                Colaboração e comunicação da equipe
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <DropdownMenu
                open={showNotifications}
                onOpenChange={setShowNotifications}
              >
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="relative">
                    <Bell className="w-4 h-4" />
                    {unreadNotifications > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500">
                        {unreadNotifications}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="font-medium">Notificações</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100",
                          !notification.isRead && "bg-blue-50",
                        )}
                        onClick={() => {
                          if (notification.actionUrl) {
                            navigate(notification.actionUrl);
                          }
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "p-1 rounded-full",
                              notification.type === "mention" &&
                                "bg-blue-100 text-blue-600",
                              notification.type === "task" &&
                                "bg-green-100 text-green-600",
                              notification.type === "deadline" &&
                                "bg-red-100 text-red-600",
                              notification.type === "client" &&
                                "bg-purple-100 text-purple-600",
                            )}
                          >
                            {notification.type === "mention" && (
                              <AtSign className="w-3 h-3" />
                            )}
                            {notification.type === "task" && (
                              <Target className="w-3 h-3" />
                            )}
                            {notification.type === "deadline" && (
                              <Clock className="w-3 h-3" />
                            )}
                            {notification.type === "client" && (
                              <Users className="w-3 h-3" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {notification.description}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.timestamp}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-gray-200">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full"
                      onClick={() => navigate("/notificacoes")}
                    >
                      Ver todas as notificações
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input placeholder="Buscar no feed..." className="pl-10 w-64" />
              </div>

              {/* Create Post */}
              <Dialog open={isCreatingPost} onOpenChange={setIsCreatingPost}>
                <DialogTrigger asChild>
                  <Button className="bg-gray-900 text-white hover:bg-gray-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Post
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Criar Nova Publicação</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    {/* Post Type */}
                    <div className="flex gap-2">
                      {[
                        { type: "post", label: "Post", icon: MessageSquare },
                        {
                          type: "announcement",
                          label: "Comunicado",
                          icon: Bell,
                        },
                        { type: "task", label: "Tarefa", icon: Target },
                        { type: "client", label: "Cliente", icon: Users },
                        { type: "process", label: "Processo", icon: Scale },
                      ].map((item) => (
                        <Button
                          key={item.type}
                          variant={
                            newPostType === item.type ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setNewPostType(item.type as FeedPost["type"])
                          }
                        >
                          <item.icon className="w-4 h-4 mr-2" />
                          {item.label}
                        </Button>
                      ))}
                    </div>

                    {/* Content */}
                    <Textarea
                      placeholder="O que você gostaria de compartilhar?"
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      className="min-h-32"
                    />

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Paperclip className="w-4 h-4 mr-2" />
                          Anexar
                        </Button>
                        <Button variant="ghost" size="sm">
                          <AtSign className="w-4 h-4 mr-2" />
                          Mencionar
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Hash className="w-4 h-4 mr-2" />
                          Tags
                        </Button>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsCreatingPost(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleCreatePost}
                          disabled={!newPostContent.trim()}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Publicar
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Filters */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="my">Meus Posts</TabsTrigger>
            <TabsTrigger value="announcement">Comunicados</TabsTrigger>
            <TabsTrigger value="task">Tarefas</TabsTrigger>
            <TabsTrigger value="client">Clientes</TabsTrigger>
            <TabsTrigger value="process">Processos</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Feed Posts */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    {/* Post Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback className="bg-gray-200 text-gray-700">
                            {post.author.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900">
                              {post.author.name}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              {post.author.role}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              className={cn(
                                "text-xs",
                                getPostTypeColor(post.type),
                              )}
                            >
                              {getPostTypeIcon(post.type)}
                              <span className="ml-1 capitalize">
                                {post.type}
                              </span>
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {post.timestamp}
                            </span>
                            {post.isPinned && (
                              <Pin className="w-4 h-4 text-blue-600" />
                            )}
                          </div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-1">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="w-4 h-4 mr-2" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="w-4 h-4 mr-2" />
                            Compartilhar
                          </DropdownMenuItem>
                          {post.author.id === user?.id && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Excluir
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                      </p>

                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Related Item */}
                      {post.relatedTo && (
                        <Card
                          className="mt-4 border-l-4 border-l-blue-500 cursor-pointer hover:bg-gray-50"
                          onClick={() =>
                            handleNavigateToRelated(post.relatedTo)
                          }
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                              {post.relatedTo.type === "client" && (
                                <Users className="w-4 h-4 text-blue-600" />
                              )}
                              {post.relatedTo.type === "process" && (
                                <Scale className="w-4 h-4 text-blue-600" />
                              )}
                              {post.relatedTo.type === "task" && (
                                <Target className="w-4 h-4 text-blue-600" />
                              )}
                              {post.relatedTo.type === "meeting" && (
                                <Calendar className="w-4 h-4 text-blue-600" />
                              )}
                              <span className="text-sm font-medium text-gray-900">
                                {post.relatedTo.title}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {post.relatedTo.type}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Attachments */}
                      {post.attachments && post.attachments.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {post.attachments.map((attachment) => (
                            <div
                              key={attachment.id}
                              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                            >
                              <File className="w-6 h-6 text-gray-600" />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {attachment.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {attachment.size}
                                </p>
                              </div>
                              <Button variant="ghost" size="sm">
                                Download
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex gap-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikePost(post.id)}
                          className={cn(
                            "gap-2",
                            post.isLiked && "text-red-600",
                          )}
                        >
                          <Heart
                            className={cn(
                              "w-4 h-4",
                              post.isLiked && "fill-red-600",
                            )}
                          />
                          {post.likes}
                        </Button>

                        <Button variant="ghost" size="sm" className="gap-2">
                          <MessageSquare className="w-4 h-4" />
                          {post.comments}
                        </Button>

                        <Button variant="ghost" size="sm" className="gap-2">
                          <Share2 className="w-4 h-4" />
                          Compartilhar
                        </Button>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Eye className="w-4 h-4" />
                        <span>{post.visibility}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline">Carregar mais posts</Button>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
