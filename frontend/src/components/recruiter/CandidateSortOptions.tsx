
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutGrid, List, ArrowUpDown } from 'lucide-react';

interface SortOption {
  value: string;
  label: string;
  description: string;
}

interface CandidateSortOptionsProps {
  sortBy: string;
  onSortChange: (value: string) => void;
  viewMode: 'list' | 'grid';
  onViewModeChange: (mode: 'list' | 'grid') => void;
  candidateCount: number;
}

const CandidateSortOptions: React.FC<CandidateSortOptionsProps> = ({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  candidateCount
}) => {
  const sortOptions: SortOption[] = [
    // Primary Relevance-Based Sorts
    {
      value: 'matchScore',
      label: 'Match Score (Highest First)',
      description: 'Most qualified candidates based on comprehensive AI assessment'
    },
    
    // Time-Based Sorts
    {
      value: 'lastUpdated',
      label: 'Last Updated (Newest First)',
      description: 'Recently updated profiles showing active candidates'
    },
    {
      value: 'dateAdded',
      label: 'Date Added (Newest First)',
      description: 'Most recently added candidates to the database'
    },
    {
      value: 'lastContactedDesc',
      label: 'Last Contacted (Most Recent First)',
      description: 'Recently contacted candidates for follow-ups'
    },
    {
      value: 'lastContactedAsc',
      label: 'Last Contacted (Least Recent First)',
      description: 'Candidates who haven\'t been contacted recently'
    },
    
    // Experience & Background Sorts
    {
      value: 'experienceYears',
      label: 'Years of Experience (Most First)',
      description: 'Candidates with the most professional experience'
    },
    {
      value: 'seniorityLevel',
      label: 'Seniority Level (Highest First)',
      description: 'Principal, Senior, Mid-Level ordering'
    },
    {
      value: 'educationLevel',
      label: 'Education Level (Highest First)',
      description: 'PhD, Masters, Bachelors ordering'
    },
    
    // Practical & Engagement Sorts
    {
      value: 'locationProximity',
      label: 'Location (Proximity to Job)',
      description: 'Geographical distance from job location'
    },
    {
      value: 'availability',
      label: 'Availability (Soonest First)',
      description: 'Candidates available to start work soonest'
    },
    {
      value: 'responseStatus',
      label: 'Response Status (Most Engaged)',
      description: 'Replied > Opened > Not Yet Contacted'
    },
    {
      value: 'nameAsc',
      label: 'Name (A-Z)',
      description: 'Alphabetical order by last name'
    },
    {
      value: 'nameDesc',
      label: 'Name (Z-A)',
      description: 'Reverse alphabetical order'
    }
  ];

  const currentSort = sortOptions.find(option => option.value === sortBy);

  return (
    <div className="flex items-center justify-between bg-white border rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="flex items-center space-x-1">
            <span>{candidateCount} candidates</span>
          </Badge>
          <span className="text-sm text-gray-600">found</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <ArrowUpDown className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium">Sort by:</span>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-72">
              <SelectValue placeholder="Select sorting option" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <div className="p-2">
                <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                  Relevance-Based
                </div>
                <SelectItem value="matchScore" className="mb-1">
                  <div>
                    <div className="font-medium">Match Score (Highest First)</div>
                    <div className="text-xs text-gray-500">Most qualified candidates - Default</div>
                  </div>
                </SelectItem>
              </div>
              
              <div className="p-2 border-t">
                <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                  Time-Based
                </div>
                {sortOptions.slice(1, 5).map((option) => (
                  <SelectItem key={option.value} value={option.value} className="mb-1">
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </div>
              
              <div className="p-2 border-t">
                <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                  Experience & Background
                </div>
                {sortOptions.slice(5, 8).map((option) => (
                  <SelectItem key={option.value} value={option.value} className="mb-1">
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </div>
              
              <div className="p-2 border-t">
                <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                  Practical & Engagement
                </div>
                {sortOptions.slice(8).map((option) => (
                  <SelectItem key={option.value} value={option.value} className="mb-1">
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </div>
            </SelectContent>
          </Select>
        </div>
        
        {currentSort && (
          <div className="text-xs text-gray-500 max-w-xs">
            {currentSort.description}
          </div>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-600">View:</span>
        <div className="flex rounded-lg border">
          <Button
            size="sm"
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            onClick={() => onViewModeChange('list')}
            className="rounded-r-none"
          >
            <List className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            onClick={() => onViewModeChange('grid')}
            className="rounded-l-none border-l"
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CandidateSortOptions;
