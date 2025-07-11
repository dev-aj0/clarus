
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

interface LibraryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  buttonText?: string;
}

const LibraryCard: React.FC<LibraryCardProps> = ({ 
  title, 
  description, 
  icon: Icon, 
  onClick, 
  buttonText = "Open" 
}) => {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onClick}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Icon size={20} />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{description}</p>
        <Button 
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="w-full"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LibraryCard;
