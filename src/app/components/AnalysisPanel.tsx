'use client'
import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { BusinessSuggestion } from "@/lib/suggestionRules";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AnalysisPanelProps {
  businessData: Record<string, number>;
  suggestions: BusinessSuggestion[];
  isLoading: boolean;
}

export default function AnalysisPanel({
  businessData,
  suggestions,
  isLoading,
}: AnalysisPanelProps) {
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[];
  }>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (Object.keys(businessData).length > 0) {
      const sortedData = Object.entries(businessData)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 10); 
      
      setChartData({
        labels: sortedData.map(([type]) => type),
        datasets: [
          {
            label: 'Number of Businesses',
            data: sortedData.map(([, count]) => count),
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      });
    }
  }, [businessData]);

  const totalBusinesses = Object.values(businessData).reduce((sum, count) => sum + count, 0);
  const totalCategories = Object.keys(businessData).length;

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Business Analysis</CardTitle>
          <CardDescription>Loading data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (Object.keys(businessData).length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Business Analysis</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Select a location on the map to analyze nearby businesses</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Business Analysis</CardTitle>
        <CardDescription>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary">{totalBusinesses} businesses</Badge>
            <Badge variant="outline">{totalCategories} categories</Badge>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Business Types in Area</h3>
            <div className="h-72">
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: true,
                      text: 'Top Business Types in Selected Area',
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}