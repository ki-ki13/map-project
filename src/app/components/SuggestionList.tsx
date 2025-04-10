import { BusinessSuggestion } from "@/lib/suggestionRules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SuggestionListProps {
  suggestions: BusinessSuggestion[];
  isLoading: boolean;
}

export default function SuggestionList({
  suggestions,
  isLoading,
}: SuggestionListProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Opportunities</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Select a location on the map to see business opportunities
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Opportunities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {suggestions.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <div className={`h-1 ${getIndicatorColor(item.suggestion)}`}></div>
              <CardContent className="pt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold capitalize">{item.type}</h3>
                  <Badge variant={getBadgeVariant(item.suggestion)}>
                    {item.count} found
                  </Badge>
                </div>
                <p className={`${getSuggestionTextColor(item.suggestion)}`}>
                  {item.suggestion}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function getSuggestionTextColor(suggestion: string): string {
  if (suggestion.includes("excellent")) return "text-green-600 font-medium";
  if (suggestion.includes("good")) return "text-green-500";
  if (suggestion.includes("consider")) return "text-yellow-600";
  if (suggestion.includes("saturated")) return "text-red-500";
  return "";
}

function getIndicatorColor(suggestion: string): string {
  if (suggestion.includes("excellent")) return "bg-green-600";
  if (suggestion.includes("good")) return "bg-green-500";
  if (suggestion.includes("consider")) return "bg-yellow-600";
  if (suggestion.includes("saturated")) return "bg-red-500";
  return "bg-gray-300";
}

function getBadgeVariant(suggestion: string): "default" | "secondary" | "destructive" | "outline" {
  if (suggestion.includes("excellent")) return "default";
  if (suggestion.includes("good")) return "secondary";
  if (suggestion.includes("consider")) return "outline";
  if (suggestion.includes("saturated")) return "destructive";
  return "outline";
}