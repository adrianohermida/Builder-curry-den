/**
 * 📁 GED ORGANIZACIONAL - GESTÃO ELETRÔNICA DE DOCUMENTOS
 *
 * Sistema completo de GED organizacional:
 * - Estrutura hierárquica de pastas
 * - Documentos corporativos
 * - Controle de versões
 * - Zero amarelo
 */

import React, { useState } from "react";
import {
  FolderOpen,
  File,
  Search,
  Upload,
  Download,
  Filter,
  Grid,
  List,
  MoreVertical,
  Star,
  Clock,
  Users,
  Shield,
  Tag,
  Archive,
  Eye,
  Edit,
  Trash2,
  Share,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Document {
  id: string;
  name: string;
  type: "file" | "folder";
  size?: string;
  modifiedDate: Date;
  modifiedBy: string;
  category: string;
  tags: string[];
  isStarred: boolean;
  permissions: "read" | "write" | "admin";
  version?: string;
  extension?: string;
}

interface Folder {
  id: string;
  name: string;
  parentId?: string;
  documentsCount: number;
  subFoldersCount: number;
}

export default function GEDOrganizacional() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // Mock data
  const folders: Folder[] = [
    {
      id: "1",
      name: "Contratos",
      documentsCount: 45,
      subFoldersCount: 3,
    },
    {
      id: "2",
      name: "Recursos Humanos",
      documentsCount: 28,
      subFoldersCount: 5,
    },
    {
      id: "3",
      name: "Financeiro",
      documentsCount: 67,
      subFoldersCount: 4,
    },
    {
      id: "4",
      name: "Jurídico",
      documentsCount: 89,
      subFoldersCount: 8,
    },
  ];

  const documents: Document[] = [
    {
      id: "1",
      name: "Manual de Procedimentos 2024.pdf",
      type: "file",
      size: "2.4 MB",
      modifiedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      modifiedBy: "Ana Silva",
      category: "Procedimentos",
      tags: ["manual", "2024", "procedimentos"],
      isStarred: true,
      permissions: "read",
      version: "v2.1",
      extension: "pdf",
    },
    {
      id: "2",
      name: "Política de Segurança.docx",
      type: "file",
      size: "856 KB",
      modifiedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      modifiedBy: "Carlos Santos",
      category: "Segurança",
      tags: ["política", "segurança", "compliance"],
      isStarred: false,
      permissions: "write",
      version: "v1.3",
      extension: "docx",
    },
    {
      id: "3",
      name: "Organograma Empresa.xlsx",
      type: "file",
      size: "142 KB",
      modifiedDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      modifiedBy: "Marina Costa",
      category: "RH",
      tags: ["organograma", "estrutura", "rh"],
      isStarred: true,
      permissions: "admin",
      version: "v3.0",
      extension: "xlsx",
    },
  ];

  const stats = [
    {
      title: "Total de Documentos",
      value: "1,247",
      change: "+156 este mês",
      icon: <File className="w-5 h-5" />,
      color: "blue",
    },
    {
      title: "Pastas Organizadas",
      value: "89",
      change: "+12 este mês",
      icon: <FolderOpen className="w-5 h-5" />,
      color: "green",
    },
    {
      title: "Documentos Recentes",
      value: "34",
      change: "Última semana",
      icon: <Clock className="w-5 h-5" />,
      color: "orange",
    },
    {
      title: "Espaço Utilizado",
      value: "47.2 GB",
      change: "de 100 GB",
      icon: <Archive className="w-5 h-5" />,
      color: "purple",
    },
  ];

  const getFileIcon = (extension: string) => {
    switch (extension) {
      case "pdf":
        return "📄";
      case "docx":
      case "doc":
        return "📝";
      case "xlsx":
      case "xls":
        return "📊";
      case "pptx":
      case "ppt":
        return "📈";
      case "jpg":
      case "jpeg":
      case "png":
        return "🖼️";
      default:
        return "📄";
    }
  };

  const getPermissionColor = (permission: string) => {
    switch (permission) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "write":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR");
  };

  const breadcrumbs = ["Documentos", "Organizacional"];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span>/</span>}
                  <span
                    className={
                      index === breadcrumbs.length - 1
                        ? "text-gray-900 font-medium"
                        : "hover:text-gray-900 cursor-pointer"
                    }
                  >
                    {item}
                  </span>
                </React.Fragment>
              ))}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FolderOpen className="w-6 h-6 text-blue-600" />
              GED Organizacional
            </h1>
            <p className="text-gray-600 mt-1">
              Gestão eletrônica de documentos corporativos
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload
            </Button>
            <Button className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Nova Pasta
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    stat.color === "blue" && "bg-blue-100 text-blue-600",
                    stat.color === "green" && "bg-green-100 text-green-600",
                    stat.color === "orange" && "bg-orange-100 text-orange-600",
                    stat.color === "purple" && "bg-purple-100 text-purple-600",
                  )}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-xs text-gray-500">{stat.change}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* View Mode Toggle */}
          <div className="flex rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2",
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <Grid className="w-4 h-4" />
              Grade
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex items-center gap-2",
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <List className="w-4 h-4" />
              Lista
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Todas as Categorias</option>
            <option value="procedimentos">Procedimentos</option>
            <option value="seguranca">Segurança</option>
            <option value="rh">Recursos Humanos</option>
            <option value="financeiro">Financeiro</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Folders */}
          {!currentFolder && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Pastas
              </h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {folders.map((folder) => (
                  <Card
                    key={folder.id}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setCurrentFolder(folder.id)}
                  >
                    <div className="flex items-center gap-3">
                      <FolderOpen className="w-8 h-8 text-blue-600" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">
                          {folder.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {folder.documentsCount} documentos
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <File className="w-5 h-5" />
              Documentos Recentes
            </h2>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {documents.map((doc) => (
                  <Card
                    key={doc.id}
                    className="p-4 hover:shadow-md transition-shadow group"
                  >
                    <div className="flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div className="text-3xl">
                          {getFileIcon(doc.extension || "")}
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Star
                              className={cn(
                                "w-4 h-4",
                                doc.isStarred
                                  ? "text-orange-500 fill-current"
                                  : "text-gray-400",
                              )}
                            />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                        {doc.name}
                      </h3>
                      <div className="space-y-2">
                        <Badge className={getPermissionColor(doc.permissions)}>
                          {doc.permissions === "admin"
                            ? "Admin"
                            : doc.permissions === "write"
                              ? "Edição"
                              : "Leitura"}
                        </Badge>
                        <p className="text-xs text-gray-500">
                          {doc.size} • {formatDate(doc.modifiedDate)}
                        </p>
                        <p className="text-xs text-gray-500">
                          por {doc.modifiedBy}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <Card
                    key={doc.id}
                    className="p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {getFileIcon(doc.extension || "")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {doc.name}
                          </h3>
                          {doc.isStarred && (
                            <Star className="w-4 h-4 text-orange-500 fill-current" />
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{doc.size}</span>
                          <span>
                            Modificado em {formatDate(doc.modifiedDate)}
                          </span>
                          <span>por {doc.modifiedBy}</span>
                          <Badge
                            className={getPermissionColor(doc.permissions)}
                          >
                            {doc.permissions === "admin"
                              ? "Admin"
                              : doc.permissions === "write"
                                ? "Edição"
                                : "Leitura"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
