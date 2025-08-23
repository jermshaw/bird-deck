import { Bird } from '@shared/birds';
import { useCollection } from '@/hooks/use-collection';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface BirdCardProps {
  bird: Bird;
  className?: string;
  onClick?: () => void;
}

const rarityStyles = {
  common: 'border-common bg-common/5 hover:bg-common/15',
  rare: 'border-rare bg-rare/5 hover:bg-rare/15', 
  legendary: 'border-legendary bg-legendary/5 hover:bg-legendary/15'
};

const rarityBadgeStyles = {
  common: 'bg-common text-white',
  rare: 'bg-rare text-white',
  legendary: 'bg-legendary text-white'
};

export function BirdCard({ bird, className, onClick }: BirdCardProps) {
  const { isInCollection } = useCollection();
  const isCollected = isInCollection(bird.id);
  
  const rarityStyle = rarityStyles[bird.rarity];
  const rarityBadgeStyle = rarityBadgeStyles[bird.rarity];

  return (
    <Card 
      className={cn(
        'group cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl border-2 overflow-hidden',
        rarityStyle,
        isCollected && 'ring-2 ring-green-500 ring-offset-2',
        className
      )}
      onClick={onClick}
    >
      {/* Collection Status Badge */}
      {isCollected && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-green-500 text-white border-green-600 shadow-lg">
            <Check className="h-3 w-3 mr-1" />
            Collected
          </Badge>
        </div>
      )}

      {/* Bird Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={bird.imageUrl} 
          alt={bird.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Rarity Badge Overlay */}
        <div className="absolute bottom-2 right-2">
          <Badge className={cn('uppercase text-xs font-bold', rarityBadgeStyle)}>
            {bird.rarity}
          </Badge>
        </div>
      </div>

      {/* Bird Info */}
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-1">
            {bird.name}
          </h3>
          <p className="text-sm font-medium text-muted-foreground italic line-clamp-1">
            {bird.ability}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
