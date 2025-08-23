import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Target, Award, Crown } from 'lucide-react';

interface AchievementStats {
  total: number;
  common: number;
  rare: number;
  legendary: number;
  habitats: Set<string>;
}

interface AchievementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  collectionStats: AchievementStats;
  totalBirds: number;
}

const achievements = [
  {
    id: 'bird-collector',
    title: 'Bird Collector',
    description: 'Collect all bird species in the game',
    icon: Trophy,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/30',
    current: (stats: AchievementStats) => stats.total,
    target: 15,
    reward: '🏆 Master Ornithologist Title'
  },
  {
    id: 'habitat-explorer',
    title: 'Habitat Explorer',
    description: 'Discover birds from every habitat type',
    icon: Target,
    color: 'text-accent-foreground',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/30',
    current: (stats: AchievementStats) => stats.habitats.size,
    target: 8,
    reward: '🌍 World Explorer Badge'
  },
  {
    id: 'legendary-hunter',
    title: 'Legendary Hunter',
    description: 'Find and collect all legendary birds',
    icon: Crown,
    color: 'text-legendary',
    bgColor: 'bg-legendary/10',
    borderColor: 'border-legendary/30',
    current: (stats: AchievementStats) => stats.legendary,
    target: 3,
    reward: '👑 Legendary Status'
  },
  {
    id: 'rare-seeker',
    title: 'Rare Seeker',
    description: 'Collect all rare bird species',
    icon: Award,
    color: 'text-rare',
    bgColor: 'bg-rare/10',
    borderColor: 'border-rare/30',
    current: (stats: AchievementStats) => stats.rare,
    target: 6,
    reward: '⭐ Rare Bird Expert'
  }
];

export function AchievementModal({ open, onOpenChange, collectionStats, totalBirds }: AchievementModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Achievement Progress
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement) => {
            const current = achievement.current(collectionStats);
            const target = achievement.target;
            const progress = Math.min((current / target) * 100, 100);
            const isCompleted = current >= target;
            const Icon = achievement.icon;

            return (
              <Card 
                key={achievement.id}
                className={`${achievement.bgColor} ${achievement.borderColor} border-2 ${
                  isCompleted ? 'ring-2 ring-yellow-400 ring-offset-2' : ''
                }`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`h-5 w-5 ${achievement.color}`} />
                      <span className="text-lg">{achievement.title}</span>
                    </div>
                    {isCompleted && (
                      <Badge className="bg-yellow-500 text-yellow-50">
                        Completed!
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Progress</span>
                      <Badge variant="secondary">
                        {current}/{target}
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          isCompleted 
                            ? 'bg-yellow-500' 
                            : achievement.color.replace('text-', 'bg-')
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Reward:
                    </p>
                    <p className="text-sm font-medium">
                      {achievement.reward}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Overall Progress Summary */}
        <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20 mt-6">
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-lg">Overall Progress</h3>
              <div className="flex justify-center gap-4 flex-wrap">
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/40">
                  {collectionStats.total}/{totalBirds} Birds Collected
                </Badge>
                <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/40">
                  {achievements.filter(a => a.current(collectionStats) >= a.target).length}/{achievements.length} Achievements
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
