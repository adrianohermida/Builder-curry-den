/**
 * 🎯 FEED POST - COMPONENTE DE POST INDIVIDUAL
 *
 * Componente para exibir posts individuais no Feed:
 * - Renderização de diferentes tipos de conteúdo
 * - Interações (like, comment, share)
 * - Exibição de mídia e anexos
 * - Enquetes interativas
 * - Sistema de comentários
 */

import React, { useState } from "react";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Pin,
  Bookmark,
  Flag,
  Edit,
  Trash2,
  Clock,
  Eye,
  Hash,
  AtSign,
  FileText,
  Download,
  Play,
  Calendar,
  MapPin,
  Users,
  BarChart3,
  Check,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ===== TYPES =====
interface FeedPostProps {
  post: {
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
  };
}

// ===== FEED POST COMPONENT =====
const FeedPost: React.FC<FeedPostProps> = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [localEngagement, setLocalEngagement] = useState(post.engagement);
  const [selectedPollOptions, setSelectedPollOptions] = useState<string[]>([]);

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) {
      return `${diffMins}m`;
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      return `${Math.floor(diffHours / 24)}d`;
    }
  };

  // Handle like toggle
  const handleLike = () => {
    setLocalEngagement((prev) => ({
      ...prev,
      likes: prev.userLiked ? prev.likes - 1 : prev.likes + 1,
      userLiked: !prev.userLiked,
    }));
  };

  // Handle bookmark toggle
  const handleBookmark = () => {
    setLocalEngagement((prev) => ({
      ...prev,
      userBookmarked: !prev.userBookmarked,
    }));
  };

  // Handle share
  const handleShare = () => {
    setLocalEngagement((prev) => ({
      ...prev,
      shares: prev.shares + 1,
    }));
    // Add share logic here
  };

  // Handle poll vote
  const handlePollVote = (option: string) => {
    if (!post.content.poll) return;

    if (post.content.poll.allowMultiple) {
      setSelectedPollOptions((prev) =>
        prev.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option],
      );
    } else {
      setSelectedPollOptions([option]);
    }
  };

  // Submit poll vote
  const submitPollVote = () => {
    console.log("Voting for:", selectedPollOptions);
    // Add voting logic here
  };

  // Calculate poll percentages
  const getPollPercentage = (option: string) => {
    if (!post.content.poll) return 0;
    const totalVotes = Object.values(post.content.poll.votes).reduce(
      (sum, votes) => sum + votes,
      0,
    );
    return totalVotes > 0
      ? Math.round((post.content.poll.votes[option] / totalVotes) * 100)
      : 0;
  };

  // Render media attachments
  const renderMedia = () => {
    if (!post.content.media) return null;

    return (
      <div className="mt-3 space-y-3">
        {post.content.media.map((media, index) => (
          <div key={index} className="rounded-lg overflow-hidden">
            {media.type === "image" && (
              <img
                src={media.url}
                alt="Post attachment"
                className="w-full max-h-96 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                onClick={() => {
                  /* Open lightbox */
                }}
              />
            )}

            {media.type === "video" && (
              <div className="relative bg-gray-900 rounded-lg">
                <video
                  src={media.url}
                  poster={media.thumbnail}
                  controls
                  className="w-full max-h-96"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Play
                    size={48}
                    className="text-white opacity-80"
                    fill="currentColor"
                  />
                </div>
              </div>
            )}

            {media.type === "document" && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText size={24} className="text-blue-600" />
                    <div>
                      <p className="font-medium">{media.filename}</p>
                      <p className="text-sm text-gray-500">Documento PDF</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download size={16} className="mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render poll
  const renderPoll = () => {
    if (!post.content.poll) return null;

    return (
      <div className="mt-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h4 className="font-medium mb-3 flex items-center">
          <BarChart3 size={16} className="mr-2 text-blue-600" />
          {post.content.poll.question}
        </h4>

        <div className="space-y-3">
          {post.content.poll.options.map((option, index) => {
            const percentage = getPollPercentage(option);
            const votes = post.content.poll!.votes[option] || 0;
            const isSelected = selectedPollOptions.includes(option);

            return (
              <div key={index} className="space-y-2">
                <div
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      : "bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => handlePollVote(option)}
                >
                  <div
                    className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                      isSelected
                        ? "border-blue-600 bg-blue-600"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                  >
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>
                  <span className="flex-1">{option}</span>
                  <span className="text-sm text-gray-500">
                    {votes} votos ({percentage}%)
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>

        {selectedPollOptions.length > 0 && (
          <Button onClick={submitPollVote} className="mt-3 w-full">
            Votar ({selectedPollOptions.length} opção
            {selectedPollOptions.length > 1 ? "ões" : ""})
          </Button>
        )}
      </div>
    );
  };

  // Render event
  const renderEvent = () => {
    if (!post.content.event) return null;

    return (
      <div className="mt-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-blue-50 dark:bg-blue-900/20">
        <div className="flex items-start space-x-3">
          <Calendar size={20} className="text-blue-600 mt-1" />
          <div className="flex-1">
            <h4 className="font-medium">{post.content.event.title}</h4>
            <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center">
                <Clock size={14} className="mr-2" />
                {post.content.event.date.toLocaleDateString("pt-BR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              {post.content.event.location && (
                <div className="flex items-center">
                  <MapPin size={14} className="mr-2" />
                  {post.content.event.location}
                </div>
              )}
              <div className="flex items-center">
                <Users size={14} className="mr-2" />
                {post.content.event.attendees.length} confirmados
              </div>
            </div>
            <div className="mt-3 flex space-x-2">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Participar
              </Button>
              <Button variant="outline" size="sm">
                Mais detalhes
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardContent className="p-6">
        {/* Post Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>
                {post.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {post.author.name}
                </span>
                {post.metadata.pinned && (
                  <Pin size={14} className="text-orange-500" />
                )}
                {post.metadata.important && (
                  <Badge variant="destructive" className="text-xs">
                    Importante
                  </Badge>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <span>
                  {post.author.role} • {post.author.department}
                </span>
                <span>•</span>
                <span>{formatTimeAgo(post.metadata.createdAt)}</span>
                <span>•</span>
                <div className="flex items-center">
                  <Eye size={12} className="mr-1" />
                  {localEngagement.views}
                </div>
              </div>
            </div>
          </div>

          {/* Post Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Bookmark size={16} className="mr-2" />
                {localEngagement.userBookmarked ? "Remover" : "Salvar"}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 size={16} className="mr-2" />
                Compartilhar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Flag size={16} className="mr-2" />
                Reportar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit size={16} className="mr-2" />
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <Trash2 size={16} className="mr-2" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Post Content */}
        <div className="mb-4">
          {post.content.text && (
            <div className="text-gray-900 dark:text-white whitespace-pre-wrap">
              {post.content.text.split(" ").map((word, index) => {
                if (word.startsWith("#")) {
                  return (
                    <span key={index} className="text-blue-600 font-medium">
                      {word}{" "}
                    </span>
                  );
                }
                if (word.startsWith("@")) {
                  return (
                    <span key={index} className="text-blue-600 font-medium">
                      {word}{" "}
                    </span>
                  );
                }
                return word + " ";
              })}
            </div>
          )}

          {/* Render different content types */}
          {renderMedia()}
          {renderPoll()}
          {renderEvent()}
        </div>

        {/* Tags and Mentions */}
        {(post.metadata.tags.length > 0 ||
          post.metadata.mentions.length > 0) && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.metadata.tags.map((tag, index) => (
              <Badge
                key={`tag-${index}`}
                variant="outline"
                className="text-xs cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <Hash size={10} className="mr-1" />
                {tag}
              </Badge>
            ))}
            {post.metadata.mentions.map((mention, index) => (
              <Badge
                key={`mention-${index}`}
                variant="outline"
                className="text-xs cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20"
              >
                <AtSign size={10} className="mr-1" />
                {mention}
              </Badge>
            ))}
          </div>
        )}

        {/* Engagement Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`space-x-2 ${
                      localEngagement.userLiked
                        ? "text-red-600 hover:text-red-700"
                        : "text-gray-600 hover:text-red-600"
                    }`}
                  >
                    <Heart
                      size={16}
                      fill={localEngagement.userLiked ? "currentColor" : "none"}
                    />
                    <span>{localEngagement.likes}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {localEngagement.userLiked ? "Remover curtida" : "Curtir"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="space-x-2 text-gray-600 hover:text-blue-600"
            >
              <MessageCircle size={16} />
              <span>{localEngagement.comments}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="space-x-2 text-gray-600 hover:text-green-600"
            >
              <Share2 size={16} />
              <span>{localEngagement.shares}</span>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleBookmark}
            className={
              localEngagement.userBookmarked
                ? "text-yellow-600 hover:text-yellow-700"
                : "text-gray-600 hover:text-yellow-600"
            }
          >
            <Bookmark
              size={16}
              fill={localEngagement.userBookmarked ? "currentColor" : "none"}
            />
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-3 mb-4">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs">EU</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea
                  placeholder="Escreva um comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-20 resize-none"
                />
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    disabled={!newComment.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Comentar
                  </Button>
                </div>
              </div>
            </div>

            {/* Mock Comments */}
            <div className="space-y-4">
              <div className="flex space-x-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="text-xs">CL</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm">Carlos Lima</span>
                      <span className="text-xs text-gray-500">5 min</span>
                    </div>
                    <p className="text-sm">
                      Excelente trabalho! Parabéns pela conquista.
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 ml-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-gray-500 hover:text-blue-600"
                    >
                      Curtir
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-gray-500 hover:text-blue-600"
                    >
                      Responder
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedPost;
