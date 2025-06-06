import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface SLAMetric {
  department: string;
  percentage: number;
  status: "excellent" | "good" | "warning" | "critical";
  target: number;
}

const slaData: SLAMetric[] = [
  {
    department: "Direito Civil",
    percentage: 95,
    status: "excellent",
    target: 90,
  },
  {
    department: "Direito Trabalhista",
    percentage: 88,
    status: "good",
    target: 85,
  },
  {
    department: "Direito Penal",
    percentage: 78,
    status: "warning",
    target: 85,
  },
  {
    department: "Direito Empresarial",
    percentage: 65,
    status: "critical",
    target: 80,
  },
];

const getStatusColor = (status: SLAMetric["status"]) => {
  switch (status) {
    case "excellent":
      return "bg-green-500";
    case "good":
      return "bg-blue-500";
    case "warning":
      return "bg-yellow-500";
    case "critical":
      return "bg-red-500";
  }
};

const getStatusVariant = (status: SLAMetric["status"]) => {
  switch (status) {
    case "excellent":
      return "default";
    case "good":
      return "secondary";
    case "warning":
      return "outline";
    case "critical":
      return "destructive";
  }
};

const getStatusLabel = (status: SLAMetric["status"]) => {
  switch (status) {
    case "excellent":
      return "Excelente";
    case "good":
      return "Bom";
    case "warning":
      return "Atenção";
    case "critical":
      return "Crítico";
  }
};

export function SLAMetrics() {
  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Métricas de SLA por Departamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {slaData.map((metric) => (
          <div key={metric.department} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{metric.department}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {metric.percentage}% / {metric.target}%
                </span>
                <Badge
                  variant={getStatusVariant(metric.status)}
                  className="text-xs"
                >
                  {getStatusLabel(metric.status)}
                </Badge>
              </div>
            </div>
            <Progress
              value={metric.percentage}
              className="h-2"
              style={
                {
                  "--progress-background": "hsl(var(--muted))",
                } as React.CSSProperties
              }
            />
          </div>
        ))}

        <div className="pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>SLA Médio Geral:</span>
              <span className="font-medium text-foreground">
                {Math.round(
                  slaData.reduce((acc, curr) => acc + curr.percentage, 0) /
                    slaData.length,
                )}
                %
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
