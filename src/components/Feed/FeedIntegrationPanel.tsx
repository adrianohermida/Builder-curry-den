import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Rss,
  Plus,
  MessageSquare,
  Users,
  Scale,
  Target,
  Calendar,
  FileText,
  Send,
  AtSign,
  Hash,
  Paperclip,
  TrendingUp,
  Clock,
  Heart,
  Share2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import useFeedIntegration from "@/hooks/useFeedIntegration";
import { usePermissions } from "@/hooks/usePermissions";
import { cn } from "@/lib/utils";

interface FeedIntegrationPanelProps {
  context: {
    type: "client" | "process" | "task" | "contract" | "meeting";
    id: string;
    title: string;
  };
  className?: string;
  variant?: "sidebar" | "inline" | "popup";
}

const FeedIntegrationPanel: React.FC<FeedIntegrationPanelProps> = ({
  context,
  className,
  variant = "sidebar",
}) => {
  const { createFeedPost, recentActivities } = useFeedIntegration();
  const { user } = usePermissions();

  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Filter activities related to this context
  const relatedActivities = recentActivities.filter(
    (activity) =>
      activity.relatedTo?.id === context.id ||
      activity.relatedTo?.type === context.type,
  );

  // Quick post templates based on context
  const getQuickTemplates = () => {
    switch (context.type) {
      case "client":
        return [
          "Reunião realizada com sucesso com {title}",
          "Novo documento enviado para {title}",
          "Proposta comercial aprovada por {title}",
          "Follow-up necessário com {title}",
        ];
      case "process":
        return [
          "Atualização no processo {title}",
          "Prazo do processo {title} se aproxima",
          "Documentos complementares necessários para {title}",
          "Audiência agendada para {title}",
        ];
      case "task":
        return [
          "Tarefa {title} foi concluída",
          "Tarefa {title} requer revisão",
          "Prazo da tarefa {title} foi estendido",
          "Tarefa {title} foi atribuída a novo responsável",
        ];
      default:
        return [
          "Atualização em {title}",
          "Ação necessária em {title}",
          "Status de {title} alterado",
        ];
    }
  };

  const handleQuickPost = (template: string) => {
    const content = template.replace("{title}", context.title);
    setPostContent(content);
    setIsCreatingPost(true);
  };

  const handleCreatePost = () => {
    if (!postContent.trim()) return;

    createFeedPost({
      type: context.type,
      title: `Atualização: ${context.title}`,
      description: postContent,
      relatedEntity: {
        id: context.id,
        type: context.type,
        title: context.title,
      },
    });

    setPostContent("");
    setIsCreatingPost(false);
  };

  const getContextIcon = () => {
    switch (context.type) {
      case "client":
        return <Users className="w-4 h-4" />;
      case "process":
        return <Scale className="w-4 h-4" />;
      case "task":
        return <Target className="w-4 h-4" />;
      case "contract":
        return <FileText className="w-4 h-4" />;
      case "meeting":
        return <Calendar className="w-4 h-4" />;
      default:
        return <Rss className="w-4 h-4" />;
    }
  };

  const quickTemplates = getQuickTemplates();

  // Sidebar variant - compact panel
  if (variant === "sidebar") {
    return (
      <Card className={cn("border-gray-200", className)}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Rss className="w-4 h-4" />
            Feed Colaborativo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Quick Actions */}
          <div className="space-y-2">
            <Dialog open={isCreatingPost} onOpenChange={setIsCreatingPost}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Compartilhar Atualização
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {getContextIcon()}
                    Compartilhar sobre {context.title}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Textarea
                    placeholder="O que você gostaria de compartilhar sobre este item?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    className="min-h-24"
                  />

                  {/* Quick Templates */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600">Templates rápidos:</p>
                    <div className="space-y-1">
                      {quickTemplates.slice(0, 3).map((template, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start text-left h-auto p-2"
                          onClick={() => handleQuickPost(template)}
                        >
                          <span className="text-xs">
                            {template.replace("{title}", context.title)}
                          </span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <AtSign className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsCreatingPost(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleCreatePost}
                        disabled={!postContent.trim()}
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

          {/* Recent Activity */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-700">
              Atividade Recente
            </p>
            {relatedActivities.length === 0 ? (
              <p className="text-xs text-gray-500">
                Nenhuma atividade recente encontrada
              </p>
            ) : (
              <div className="space-y-2">
                {relatedActivities.slice(0, 3).map((activity) => (
                  <div
                    key={activity.id}
                    className="p-2 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-2">
                      {getContextIcon()}
                      <p className="text-xs font-medium text-gray-900 line-clamp-1">
                        {activity.title}
                      </p>
                    </div>
                    {activity.description && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {activity.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* View Feed Link */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={() => (window.location.href = "/feed")}
          >
            <Rss className="w-4 h-4 mr-2" />
            Ver Feed Completo
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Inline variant - embedded in page
  if (variant === "inline") {
    return (
      <Card className={cn("border-gray-200", className)}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Rss className="w-5 h-5 text-gray-600" />
              <h3 className="font-medium text-gray-900">
                Compartilhar no Feed
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Minimizar" : "Expandir"}
            </Button>
          </div>

          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              className="space-y-4"
            >
              <Textarea
                placeholder={`Compartilhe uma atualização sobre ${context.title}...`}
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                className="min-h-20"
              />

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
                </div>
                <Button
                  onClick={handleCreatePost}
                  disabled={!postContent.trim()}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Publicar
                </Button>
              </div>

              {/* Quick Templates */}
              <div className="grid grid-cols-2 gap-2">
                {quickTemplates.map((template, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="h-auto p-2 text-left justify-start"
                    onClick={() => handleQuickPost(template)}
                  >
                    <span className="text-xs line-clamp-2">
                      {template.replace("{title}", context.title)}
                    </span>
                  </Button>
                ))}
              </div>
            </motion.div>
          )}

          {!isExpanded && (
            <div className="flex gap-2">
              {quickTemplates.slice(0, 2).map((template, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickPost(template)}
                >
                  {template.split(" ").slice(0, 3).join(" ")}...
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Popup variant - floating widget
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("fixed bottom-4 right-4 shadow-lg", className)}
        >
          <Rss className="w-4 h-4 mr-2" />
          Feed
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rss className="w-5 h-5" />
            Feed Colaborativo
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            {getContextIcon()}
            <div>
              <p className="font-medium text-sm">{context.title}</p>
              <p className="text-xs text-gray-600 capitalize">{context.type}</p>
            </div>
          </div>

          <Textarea
            placeholder="Compartilhe uma atualização..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="min-h-24"
          />

          <div className="grid grid-cols-1 gap-2">
            {quickTemplates.map((template, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="justify-start h-auto p-2"
                onClick={() => handleQuickPost(template)}
              >
                <span className="text-sm">
                  {template.replace("{title}", context.title)}
                </span>
              </Button>
            ))}
          </div>

          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <AtSign className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={handleCreatePost} disabled={!postContent.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Publicar
            </Button>
          </div>

          {relatedActivities.length > 0 && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Atividade Relacionada
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {relatedActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="p-2 border border-gray-200 rounded"
                  >
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-600">
                      {activity.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedIntegrationPanel;
