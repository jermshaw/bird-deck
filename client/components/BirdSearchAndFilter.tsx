import { useState } from 'react';
import { Bird, BirdRarity, BirdHabitat, BirdSize } from '@shared/birds';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Filter, X } from 'lucide-react';

export interface FilterState {
  search: string;
  rarity: BirdRarity | 'all';
  habitat: BirdHabitat | 'all';
  size: BirdSize | 'all';
}

interface BirdSearchAndFilterProps {
  onFiltersChange: (filters: FilterState) => void;
  filteredCount: number;
  totalCount: number;
}

export function BirdSearchAndFilter({ onFiltersChange, filteredCount, totalCount }: BirdSearchAndFilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    rarity: 'all',
    habitat: 'all',
    size: 'all'
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      search: '',
      rarity: 'all',
      habitat: 'all',
      size: 'all'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = filters.search || filters.rarity !== 'all' || filters.habitat !== 'all' || filters.size !== 'all';
  const hasFilterFilters = filters.rarity !== 'all' || filters.habitat !== 'all' || filters.size !== 'all';

  return (
    <div className="space-y-4 bg-card p-6 rounded-lg border shadow-sm">
      {/* Search Bar and Filter Button */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search birds by name, ability, or description..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            className="pl-10 text-base"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`flex items-center gap-2 ${hasFilterFilters ? 'border-primary bg-primary/5' : ''}`}
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasFilterFilters && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {[filters.rarity !== 'all' ? 1 : 0, filters.habitat !== 'all' ? 1 : 0, filters.size !== 'all' ? 1 : 0].reduce((a, b) => a + b, 0)}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Filter Birds</h4>
                {hasFilterFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateFilters({ rarity: 'all', habitat: 'all', size: 'all' })}
                    className="text-xs"
                  >
                    Clear All
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                {/* Rarity Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Rarity</label>
                  <Select
                    value={filters.rarity}
                    onValueChange={(value) => updateFilters({ rarity: value as BirdRarity | 'all' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Rarities" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Rarities</SelectItem>
                      <SelectItem value="common">Common</SelectItem>
                      <SelectItem value="rare">Rare</SelectItem>
                      <SelectItem value="legendary">Legendary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Habitat Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Habitat</label>
                  <Select
                    value={filters.habitat}
                    onValueChange={(value) => updateFilters({ habitat: value as BirdHabitat | 'all' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Habitats" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Habitats</SelectItem>
                      <SelectItem value="forest">🌲 Forest</SelectItem>
                      <SelectItem value="wetland">🦆 Wetland</SelectItem>
                      <SelectItem value="grassland">🌾 Grassland</SelectItem>
                      <SelectItem value="mountain">⛰️ Mountain</SelectItem>
                      <SelectItem value="desert">🌵 Desert</SelectItem>
                      <SelectItem value="arctic">❄️ Arctic</SelectItem>
                      <SelectItem value="ocean">🌊 Ocean</SelectItem>
                      <SelectItem value="urban">🏙️ Urban</SelectItem>
                      <SelectItem value="oak woodland">🌳 Oak Woodland</SelectItem>
                      <SelectItem value="gardens">🌺 Gardens</SelectItem>
                      <SelectItem value="coast">🏖️ Coast</SelectItem>
                      <SelectItem value="shrubland">🌿 Shrubland</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Size Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Size</label>
                  <Select
                    value={filters.size}
                    onValueChange={(value) => updateFilters({ size: value as BirdSize | 'all' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Sizes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sizes</SelectItem>
                      <SelectItem value="tiny">🐣 Tiny</SelectItem>
                      <SelectItem value="small">🐦 Small</SelectItem>
                      <SelectItem value="medium">🦅 Medium</SelectItem>
                      <SelectItem value="large">🦆 Large</SelectItem>
                      <SelectItem value="enormous">🦢 Enormous</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Search: "{filters.search}"
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => updateFilters({ search: '' })}
              />
            </Badge>
          )}
          {filters.rarity !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.rarity}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => updateFilters({ rarity: 'all' })}
              />
            </Badge>
          )}
          {filters.habitat !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.habitat}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => updateFilters({ habitat: 'all' })}
              />
            </Badge>
          )}
          {filters.size !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {filters.size}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => updateFilters({ size: 'all' })}
              />
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredCount} of {totalCount} birds
      </div>
    </div>
  );
}

// Utility function to filter birds based on filters
export function filterBirds(birds: Bird[], filters: FilterState): Bird[] {
  return birds.filter((bird) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        bird.name.toLowerCase().includes(searchLower) ||
        bird.ability.toLowerCase().includes(searchLower) ||
        bird.description.toLowerCase().includes(searchLower) ||
        bird.funFact.toLowerCase().includes(searchLower) ||
        bird.habitat.toLowerCase().includes(searchLower) ||
        bird.size.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Rarity filter
    if (filters.rarity !== 'all' && bird.rarity !== filters.rarity) {
      return false;
    }

    // Habitat filter  
    if (filters.habitat !== 'all' && bird.habitat !== filters.habitat) {
      return false;
    }

    // Size filter
    if (filters.size !== 'all' && bird.size !== filters.size) {
      return false;
    }

    return true;
  });
}
