/**
 * Integration Dashboard
 *
 * Admin dashboard for managing all integrations including
 * configuration, monitoring, testing, and analytics.
 */

import React, { useState, useEffect } from "react";
import {
  Plus,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from "lucide-react";

// Shared components
import { Button } from "@/shared/components/atoms/Button";
import { Input } from "@/shared/components/atoms/Input";
import { Badge } from "@/shared/components/atoms/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Integration components
import { IntegrationCard } from "../IntegrationCard";
import { IntegrationForm } from "../IntegrationForm";
import { IntegrationTestConsole } from "../IntegrationTestConsole";
import { IntegrationMetrics } from "../IntegrationMetrics";
import { IntegrationLogs } from "../IntegrationLogs";

// Hooks and services
import { useIntegrations } from "../../hooks/useIntegrations";
import { useIntegrationMetrics } from "../../hooks/useIntegrationMetrics";

// Types
import type { Integration, IntegrationProvider } from "../../types";

export const IntegrationDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIntegration, setSelectedIntegration] =
    useState<Integration | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTestConsole, setShowTestConsole] = useState(false);

  // Hooks
  const {
    integrations,
    isLoading,
    error,
    createIntegration,
    updateIntegration,
    deleteIntegration,
    testConnection,
    syncIntegration,
    refetch,
  } = useIntegrations();

  const { metrics, isLoadingMetrics } = useIntegrationMetrics();

  // Filter integrations based on search
  const filteredIntegrations =
    integrations?.data?.filter(
      (integration) =>
        integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        integration.provider.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  // Status counts for overview
  const statusCounts = {
    active: filteredIntegrations.filter((i) => i.status === "active").length,
    error: filteredIntegrations.filter((i) => i.status === "error").length,
    inactive: filteredIntegrations.filter((i) => i.status === "inactive")
      .length,
    syncing: filteredIntegrations.filter((i) => i.status === "syncing").length,
  };

  const handleCreateIntegration = async (data: any) => {
    try {
      await createIntegration.mutateAsync(data);
      setShowCreateDialog(false);
      refetch();
    } catch (error) {
      console.error("Failed to create integration:", error);
    }
  };

  const handleDeleteIntegration = async (id: string) => {
    if (confirm("Are you sure you want to delete this integration?")) {
      try {
        await deleteIntegration.mutateAsync(id);
        refetch();
      } catch (error) {
        console.error("Failed to delete integration:", error);
      }
    }
  };

  const handleTestIntegration = async (integration: Integration) => {
    setSelectedIntegration(integration);
    setShowTestConsole(true);
  };

  const handleSyncIntegration = async (integrationId: string) => {
    try {
      await syncIntegration.mutateAsync({
        integrationId,
        options: {
          direction: "bidirectional",
          entities: ["all"],
        },
      });
      refetch();
    } catch (error) {
      console.error("Failed to sync integration:", error);
    }
  };

  const getStatusIcon = (status: Integration["status"]) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "syncing":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadgeVariant = (status: Integration["status"]) => {
    switch (status) {
      case "active":
        return "success";
      case "error":
        return "destructive";
      case "syncing":
        return "default";
      default:
        return "secondary";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading integrations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <XCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Failed to load integrations</p>
          <Button onClick={() => refetch()} variant="outline" className="mt-4">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Integrations</h1>
          <p className="text-muted-foreground">
            Manage external service integrations and monitor their status
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Integration</DialogTitle>
              <DialogDescription>
                Configure a new external service integration
              </DialogDescription>
            </DialogHeader>
            <IntegrationForm
              onSubmit={handleCreateIntegration}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Integrations
            </CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredIntegrations.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statusCounts.active}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statusCounts.error}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Syncing</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {statusCounts.syncing}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <Input
          placeholder="Search integrations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="list">Integrations</TabsTrigger>
          <TabsTrigger value="metrics">Analytics</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredIntegrations.map((integration) => (
              <IntegrationCard
                key={integration.id}
                integration={integration}
                onTest={() => handleTestIntegration(integration)}
                onSync={() => handleSyncIntegration(integration.id)}
                onEdit={(id) => console.log("Edit integration:", id)}
                onDelete={(id) => handleDeleteIntegration(id)}
              />
            ))}
          </div>

          {filteredIntegrations.length === 0 && (
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No integrations found
              </h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first integration
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Integration
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>All Integrations</CardTitle>
              <CardDescription>
                Detailed view of all configured integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredIntegrations.map((integration) => (
                    <TableRow key={integration.id}>
                      <TableCell className="font-medium">
                        {integration.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{integration.provider}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(integration.status)}
                          <Badge
                            variant={getStatusBadgeVariant(integration.status)}
                          >
                            {integration.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {integration.lastSyncAt
                          ? new Date(
                              integration.lastSyncAt,
                            ).toLocaleDateString()
                          : "Never"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestIntegration(integration)}
                          >
                            Test
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleSyncIntegration(integration.id)
                            }
                            disabled={integration.status === "syncing"}
                          >
                            Sync
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics">
          <IntegrationMetrics />
        </TabsContent>

        <TabsContent value="logs">
          <IntegrationLogs />
        </TabsContent>
      </Tabs>

      {/* Test Console Dialog */}
      <Dialog open={showTestConsole} onOpenChange={setShowTestConsole}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              Test Console - {selectedIntegration?.name}
            </DialogTitle>
            <DialogDescription>
              Test connection, sync data, and monitor integration health
            </DialogDescription>
          </DialogHeader>
          {selectedIntegration && (
            <IntegrationTestConsole
              integration={selectedIntegration}
              onClose={() => setShowTestConsole(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntegrationDashboard;
