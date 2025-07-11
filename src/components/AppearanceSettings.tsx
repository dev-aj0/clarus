import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Monitor, Palette, Type, Eye } from 'lucide-react';

const AppearanceSettings = () => {
  const { theme, fontSize, highContrast, reducedMotion, setTheme, setFontSize, setHighContrast, setReducedMotion } = useTheme();
  const [tempFontSize, setTempFontSize] = useState(fontSize);

  const fontSizeMap = {
    small: 0,
    medium: 1,
    large: 2,
    'extra-large': 3
  };

  const fontSizeLabels = ['small', 'medium', 'large', 'extra-large'];

  const handleFontSizeChange = (value: number[]) => {
    const newSize = fontSizeLabels[value[0]];
    setTempFontSize(newSize);
    
    // Apply change immediately for smooth preview
    setFontSize(newSize);
  };

  return (
    <div className="space-y-8">
      {/* Theme Selection */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette size={20} />
            Theme
          </CardTitle>
          <CardDescription className="settings-card-description-bold">Choose your preferred color scheme</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => setTheme('light')}
              className="flex items-center gap-2 justify-center h-auto p-4 hover:scale-105 transition-all duration-200 hover:shadow-md"
            >
              <Sun size={20} />
              <div>Light</div>
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => setTheme('dark')}
              className="flex items-center gap-2 justify-center h-auto p-4 hover:scale-105 transition-all duration-200 hover:shadow-md"
            >
              <Moon size={20} />
              <div>Dark</div>
            </Button>
            <Button
              variant={theme === 'system' ? 'default' : 'outline'}
              onClick={() => setTheme('system')}
              className="flex items-center gap-2 justify-center h-auto p-4 hover:scale-105 transition-all duration-200 hover:shadow-md"
            >
              <Monitor size={20} />
              <div>System</div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Typography */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type size={20} />
            Typography
          </CardTitle>
          <CardDescription className="settings-card-description-bold">Adjust text size and readability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Font Size</Label>
              <div className="space-y-3">
                <Slider
                  value={[fontSizeMap[tempFontSize as keyof typeof fontSizeMap]]}
                  onValueChange={handleFontSizeChange}
                  max={3}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground font-normal">
                  <span>Small</span>
                  <span>Medium</span>
                  <span>Large</span>
                  <span>Extra Large</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye size={20} />
            Accessibility
          </CardTitle>
          <CardDescription className="settings-card-description-bold">Options to improve accessibility</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>High Contrast</Label>
                <p className="text-sm text-muted-foreground font-normal">
                  Increase contrast for better visibility
                </p>
              </div>
              <Switch
                checked={highContrast}
                onCheckedChange={setHighContrast}
                className="hover:scale-110 transition-transform duration-200"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Reduce Motion</Label>
                <p className="text-sm text-muted-foreground font-normal">
                  Minimize animations and transitions
                </p>
              </div>
              <Switch
                checked={reducedMotion}
                onCheckedChange={setReducedMotion}
                className="hover:scale-110 transition-transform duration-200"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceSettings;