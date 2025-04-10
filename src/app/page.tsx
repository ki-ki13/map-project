'use client'
import { useState } from 'react';
import dynamic from 'next/dynamic';
import AnalysisPanel from '@/app/components/AnalysisPanel';
import SuggestionList from '@/app/components/SuggestionList';
import { groupBusinessesByType } from '../lib/overpassQuery';
import { generateSuggestions, BusinessSuggestion } from '../lib/suggestionRules';
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner"
import { 
  PageHeader, 
  PageHeaderDescription, 
  PageHeaderHeading 
} from "@/components/ui/page-header";
import { Separator } from "@/components/ui/separator";


const MapComponent = dynamic(
  () => import('@/app/components/MapComponent'),
  { ssr: false }
);

export default function Home() {
  const [businessData, setBusinessData] = useState<Record<string, number>>({});
  const [suggestions, setSuggestions] = useState<BusinessSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const { toast } = useToast();

  const handleLocationSelect = async (lat: number, lng: number, radius: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/overpass?lat=${lat}&lon=${lng}&radius=${radius}`);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      const groupedBusinesses = groupBusinessesByType(data);
      setBusinessData(groupedBusinesses);
      
      const businessSuggestions = generateSuggestions(groupedBusinesses);
      setSuggestions(businessSuggestions);
      
      toast("Analysis Complete",{
        description: `Found ${Object.values(groupedBusinesses).reduce((sum, count) => sum + count, 0)} businesses in ${radius}m radius`,
      });
    } catch (error) {
      console.error('Error fetching business data:', error);
      toast.error("Error",{
        description: "Failed to fetch business data. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <PageHeader className="pb-8">
          <PageHeaderHeading>Local Business Opportunity Analyzer</PageHeaderHeading>
          <PageHeaderDescription>
            Analyze market gaps and business opportunities in any neighborhood
          </PageHeaderDescription>
        </PageHeader>
        
        <Separator className="my-6" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MapComponent onLocationSelect={handleLocationSelect} />
            
            <AnalysisPanel 
              businessData={businessData} 
              suggestions={suggestions}
              isLoading={isLoading}
            />
          </div>
          
          <div>
            <SuggestionList suggestions={suggestions} isLoading={isLoading} />
          </div>
        </div>
      </div>

      <footer className="py-8 mt-12 border-t">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          Local Business Opportunity Analyzer | Data from OpenStreetMap
        </div>
      </footer>
      
      <Toaster />
    </div>
  );
}