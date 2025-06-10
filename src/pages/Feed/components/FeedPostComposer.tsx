/**
 * 🎯 FEED POST COMPOSER - CRIADOR DE POSTS
 *
 * Componente para criar novos posts no Feed:
 * - Editor de texto rico
 * - Anexos de mídia
 * - Criação de enquetes
 * - Agendamento de eventos
 * - Configurações de visibilidade
 */

import React, { useState, useRef } from "react";
import {
  MessageSquare,
  Image,
  Video,
  FileText,
  Calendar,
  BarChart3,
  MapPin,
  Users,
  Lock,
  Globe,
  Building,
  Send,
  X,
  Smile,
  AtSign,
  Hash,
  Paperclip,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ===== TYPES =====
interface PostDraft {
  content: string;
  visibility: "public" | "department" | "private";
  attachments: File[];
  poll?: {
    question: string;
    options: string[];
    allowMultiple: boolean;
    endDate?: Date;
  };
  event?: {
    title: string;
    date: Date;
    time: string;
    location: string;
    description: string;
  };
  tags: string[];
  mentions: string[];
}

// ===== FEED POST COMPOSER COMPONENT =====
const FeedPostComposer: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [showEventCreator, setShowEventCreator] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Post draft state
  const [draft, setDraft] = useState<PostDraft>({
    content: "",
    visibility: "public",
    attachments: [],
    tags: [],
    mentions: [],
  });

  // Current user (mock)
  const currentUser = {
    id: "current-user",
    name: "Usuário Atual",
    avatar: "/avatars/current-user.jpg",
    role: "Advogado",
    department: "Direito Civil",
  };

  // Handle content change
  const handleContentChange = (content: string) => {
    setDraft((prev) => ({ ...prev, content }));

    // Auto-detect mentions and hashtags
    const mentions = content.match(/@[\w]+/g) || [];
    const tags = content.match(/#[\w]+/g) || [];

    setDraft((prev) => ({
      ...prev,
      mentions: mentions.map((m) => m.replace("@", "")),
      tags: tags.map((t) => t.replace("#", "")),
    }));
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setDraft((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setDraft((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  // Submit post
  const handleSubmit = async () => {
    if (!draft.content.trim() && draft.attachments.length === 0) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Submitting post:", draft);

      // Reset form
      setDraft({
        content: "",
        visibility: "public",
        attachments: [],
        tags: [],
        mentions: [],
      });
      setIsExpanded(false);
      setShowPollCreator(false);
      setShowEventCreator(false);
    } catch (error) {
      console.error("Error submitting post:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Visibility options
  const visibilityOptions = [
    {
      value: "public",
      label: "Público",
      icon: Globe,
      description: "Visível para toda a empresa",
    },
    {
      value: "department",
      label: "Departamento",
      icon: Building,
      description: "Visível apenas para seu departamento",
    },
    {
      value: "private",
      label: "Privado",
      icon: Lock,
      description: "Visível apenas para você",
    },
  ];

  return (
    <Card>
      <CardContent className="p-4">
        {/* User Info and Basic Input */}
        <div className="flex space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>
              {currentUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="mb-2">
              <span className="font-medium text-gray-900 dark:text-white">
                {currentUser.name}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                {currentUser.role} • {currentUser.department}
              </span>
            </div>

            <Textarea
              placeholder="Compartilhe algo com sua equipe..."
              value={draft.content}
              onChange={(e) => handleContentChange(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="min-h-20 resize-none border-0 shadow-none focus-visible:ring-0 p-0 text-base"
              style={{ boxShadow: "none" }}
            />
          </div>
        </div>

        {/* Attachments Preview */}
        {draft.attachments.length > 0 && (
          <div className="mt-4 space-y-2">
            {draft.attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
              >
                <div className="flex items-center space-x-2">
                  <FileText size={16} className="text-gray-500" />
                  <span className="text-sm font-medium">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(index)}
                  className="h-6 w-6 p-0"
                >
                  <X size={14} />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Tags and Mentions Preview */}
        {(draft.tags.length > 0 || draft.mentions.length > 0) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {draft.tags.map((tag, index) => (
              <Badge key={`tag-${index}`} variant="outline" className="text-xs">
                <Hash size={12} className="mr-1" />
                {tag}
              </Badge>
            ))}
            {draft.mentions.map((mention, index) => (
              <Badge
                key={`mention-${index}`}
                variant="outline"
                className="text-xs"
              >
                <AtSign size={12} className="mr-1" />
                {mention}
              </Badge>
            ))}
          </div>
        )}

        {/* Expanded Options */}
        {isExpanded && (
          <div className="mt-4 space-y-4">
            {/* Visibility Settings */}
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Visibilidade:</Label>
              <Select
                value={draft.visibility}
                onValueChange={(value: any) =>
                  setDraft((prev) => ({ ...prev, visibility: value }))
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {visibilityOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center space-x-2">
                          <Icon size={16} />
                          <div>
                            <div>{option.label}</div>
                            <div className="text-xs text-gray-500">
                              {option.description}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  {/* File Upload */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-8 w-8 p-0"
                      >
                        <Paperclip size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Anexar arquivo</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Image Upload */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Image size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Adicionar imagem</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Video Upload */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Video size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Adicionar vídeo</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Create Poll */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPollCreator(true)}
                        className="h-8 w-8 p-0"
                      >
                        <BarChart3 size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Criar enquete</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Create Event */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowEventCreator(true)}
                        className="h-8 w-8 p-0"
                      >
                        <Calendar size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Criar evento</p>
                    </TooltipContent>
                  </Tooltip>

                  {/* Emoji */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Smile size={16} />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Adicionar emoji</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              {/* Submit and Cancel */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setIsExpanded(false);
                    setDraft({
                      content: "",
                      visibility: "public",
                      attachments: [],
                      tags: [],
                      mentions: [],
                    });
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    (!draft.content.trim() && draft.attachments.length === 0)
                  }
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                  ) : (
                    <Send size={16} className="mr-2" />
                  )}
                  Publicar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileUpload}
          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        />
      </CardContent>
    </Card>
  );
};

export default FeedPostComposer;
