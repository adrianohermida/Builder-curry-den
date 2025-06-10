/**
 * 🎯 FEED MODULE - COLLABORATIVE SOCIAL NETWORK
 *
 * Módulo de Feed social baseado no Bitrix24 Collaboration:
 * - Timeline de atividades
 * - Postagens colaborativas
 * - Mensagens diretas
 * - Eventos da empresa
 * - Enquetes e pesquisas
 * - Integração com CRM
 */

import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  MessageSquare,
  Calendar,
  Users,
  BarChart3,
  Image,
  Video,
  FileText,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Search,
  Filter,
  Plus,
  Bell,
  Bookmark,
  Trending,
  Hash,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sub-components
import FeedPostComposer from "./components/FeedPostComposer";
import FeedPost from "./components/FeedPost";
import FeedSidebar from "./components/FeedSidebar";
import FeedHeader from "./components/FeedHeader";

// Types
interface FeedPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
    department: string;
  };
  content: {
    text?: string;
    media?: {
      type: "image" | "video" | "document";
      url: string;
      thumbnail?: string;
      filename?: string;
    }[];
    poll?: {
      question: string;
      options: string[];
      votes: Record<string, number>;
      allowMultiple: boolean;
    };
    event?: {
      title: string;
      date: Date;
      location?: string;
      attendees: string[];
    };
  };
  metadata: {
    createdAt: Date;
    updatedAt?: Date;
    tags: string[];
    mentions: string[];
    visibility: "public" | "department" | "private";
    pinned: boolean;
    important: boolean;
  };
  engagement: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
    userLiked: boolean;
    userBookmarked: boolean;
  };
  comments?: FeedComment[];
}

interface FeedComment {
  id: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  content: string;
  createdAt: Date;
  likes: number;
  userLiked: boolean;
  replies?: FeedComment[];
}

// Mock data
const MOCK_POSTS: FeedPost[] = [
  {
    id: "1",
    author: {
      id: "user1",
      name: "Ana Silva",
      avatar: "/avatars/ana.jpg",
      role: "Advogada Sênior",
      department: "Direito Empresarial",
    },
    content: {
      text: "Acabamos de finalizar um caso importante de fusão empresarial! 🎉 Parabéns a toda equipe pelo excelente trabalho. #VitóriaJurídica #TrabalhoEmEquipe",
      tags: ["vitoria", "equipe", "empresarial"],
    },
    metadata: {
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      tags: ["vitoria", "equipe", "empresarial"],
      mentions: ["@joao", "@maria"],
      visibility: "public",
      pinned: false,
      important: true,
    },
    engagement: {
      likes: 15,
      comments: 3,
      shares: 2,
      views: 45,
      userLiked: true,
      userBookmarked: false,
    },
  },
  {
    id: "2",
    author: {
      id: "user2",
      name: "João Santos",
      avatar: "/avatars/joao.jpg",
      role: "Coordenador",
      department: "Direito Trabalhista",
    },
    content: {
      text: "Pessoal, vamos fazer uma enquete sobre o próximo treinamento:",
      poll: {
        question:
          "Qual tema vocês gostariam de abordar no próximo treinamento?",
        options: [
          "Nova Lei de Proteção de Dados",
          "Mediação e Arbitragem",
          "Direito Digital",
          "Compliance Empresarial",
        ],
        votes: {
          "Nova Lei de Proteção de Dados": 12,
          "Mediação e Arbitragem": 8,
          "Direito Digital": 15,
          "Compliance Empresarial": 6,
        },
        allowMultiple: false,
      },
    },
    metadata: {
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      tags: ["treinamento", "enquete"],
      mentions: [],
      visibility: "public",
      pinned: true,
      important: false,
    },
    engagement: {
      likes: 8,
      comments: 5,
      shares: 1,
      views: 67,
      userLiked: false,
      userBookmarked: true,
    },
  },
  {
    id: "3",
    author: {
      id: "user3",
      name: "Maria Oliveira",
      avatar: "/avatars/maria.jpg",
      role: "Assistente Jurídica",
      department: "Direito Civil",
    },
    content: {
      text: "Compartilhando um artigo interessante sobre as mudanças no código civil:",
      media: [
        {
          type: "document",
          url: "/documents/artigo-codigo-civil.pdf",
          filename: "Mudanças no Código Civil 2024.pdf",
        },
      ],
    },
    metadata: {
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      tags: ["artigo", "codigo-civil", "estudo"],
      mentions: [],
      visibility: "public",
      pinned: false,
      important: false,
    },
    engagement: {
      likes: 12,
      comments: 7,
      shares: 4,
      views: 89,
      userLiked: false,
      userBookmarked: false,
    },
  },
];

// ===== MAIN FEED COMPONENT =====
const FeedModule: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recent");

  // Get active tab from URL params
  const activeTab = searchParams.get("tab") || "timeline";

  // Filter and sort posts
  const filteredPosts = useMemo(() => {
    let filtered = MOCK_POSTS;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.content.text?.toLowerCase().includes(query) ||
          post.author.name.toLowerCase().includes(query) ||
          post.metadata.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    // Apply content filter
    if (filterBy !== "all") {
      filtered = filtered.filter((post) => {
        switch (filterBy) {
          case "posts":
            return (
              post.content.text && !post.content.poll && !post.content.event
            );
          case "polls":
            return post.content.poll;
          case "events":
            return post.content.event;
          case "media":
            return post.content.media && post.content.media.length > 0;
          case "pinned":
            return post.metadata.pinned;
          case "important":
            return post.metadata.important;
          default:
            return true;
        }
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            b.metadata.createdAt.getTime() - a.metadata.createdAt.getTime()
          );
        case "popular":
          return (
            b.engagement.likes +
            b.engagement.comments +
            b.engagement.shares -
            (a.engagement.likes + a.engagement.comments + a.engagement.shares)
          );
        case "most-commented":
          return b.engagement.comments - a.engagement.comments;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, filterBy, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <FeedHeader />

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <FeedSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post Composer */}
            <FeedPostComposer />

            {/* Filters and Search */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                    <Input
                      placeholder="Buscar posts, pessoas, tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>

                  {/* Filter */}
                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className="w-full sm:w-48">
                      <Filter size={16} className="mr-2" />
                      <SelectValue placeholder="Filtrar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="posts">Posts</SelectItem>
                      <SelectItem value="polls">Enquetes</SelectItem>
                      <SelectItem value="events">Eventos</SelectItem>
                      <SelectItem value="media">Com mídia</SelectItem>
                      <SelectItem value="pinned">Fixados</SelectItem>
                      <SelectItem value="important">Importantes</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Mais recentes</SelectItem>
                      <SelectItem value="popular">Mais populares</SelectItem>
                      <SelectItem value="most-commented">
                        Mais comentados
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Posts Feed */}
            <div className="space-y-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <FeedPost key={post.id} post={post} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquare
                      size={48}
                      className="mx-auto mb-4 text-gray-400"
                    />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Nenhum post encontrado
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Tente ajustar os filtros ou criar um novo post.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Load More */}
            {filteredPosts.length > 0 && (
              <div className="text-center py-6">
                <Button variant="outline" size="lg">
                  Carregar mais posts
                </Button>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Trending Topics */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center">
                    <Trending size={20} className="mr-2 text-blue-600" />
                    Tópicos em Alta
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { tag: "nova-lei", posts: 12 },
                    { tag: "compliance", posts: 8 },
                    { tag: "direito-digital", posts: 15 },
                    { tag: "mediacao", posts: 6 },
                  ].map((topic) => (
                    <div
                      key={topic.tag}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <Hash size={16} className="mr-2 text-gray-400" />
                        <span className="font-medium">#{topic.tag}</span>
                      </div>
                      <Badge variant="secondary">{topic.posts}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold flex items-center">
                    <Bell size={20} className="mr-2 text-orange-600" />
                    Atividade Recente
                  </h3>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      user: "Carlos Lima",
                      action: "comentou em seu post",
                      time: "2 min",
                    },
                    {
                      user: "Patricia Costa",
                      action: "curtiu sua publicação",
                      time: "5 min",
                    },
                    {
                      user: "Roberto Dias",
                      action: "compartilhou seu artigo",
                      time: "10 min",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs">
                          {activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user}</span>{" "}
                          <span className="text-gray-600 dark:text-gray-300">
                            {activity.action}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Ações Rápidas</h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar size={16} className="mr-2" />
                    Criar Evento
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 size={16} className="mr-2" />
                    Nova Enquete
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Users size={16} className="mr-2" />
                    Convidar Colegas
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedModule;
