import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Mail, Book, MessageSquare, Copy } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const HelpSupportSettings = ({ toast }: { toast: any }) => {
  const supportEmail = 'clarusapp.contact@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(supportEmail);
    toast.showSuccess("Copied to clipboard", "Support email address has been copied.");
  };

  return (
    <div className="space-y-8">
      {/* Documentation */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book size={20} />
            Documentation
          </CardTitle>
          <CardDescription className="settings-card-description-bold">Access guides and documentation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full justify-start hover:scale-[1.02] transition-all duration-200 hover:shadow-md"
            onClick={() => window.open('https://google.com', '_blank')}
          >
            <ExternalLink size={16} className="mr-2" />
            View Documentation
          </Button>

          <p className="text-sm text-muted-foreground font-normal">
            Find comprehensive guides and resources to help you get the most out of the platform.
          </p>
        </CardContent>
      </Card>

      {/* Support */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare size={20} />
            Contact Support
          </CardTitle>
          <CardDescription className="settings-card-description-bold">Get help from our support team</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="support-email">Support Email</Label>
            <div className="flex items-center gap-2">
              <Input id="support-email" value={supportEmail} readOnly />
              <Button variant="outline" size="icon" onClick={handleCopyEmail} className="hover:scale-110 transition-transform duration-200">
                <Copy size={16} />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground font-normal">
            Need help? Our support team is here to assist you with any questions or issues you may have.
          </p>
        </CardContent>
      </Card>

      {/* App Information */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
        <CardHeader>
          <CardTitle>App Information</CardTitle>
          <CardDescription className="settings-card-description-bold">Version and system details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label>Version</Label>
              <p className="text-muted-foreground font-normal">1.0.0</p>
            </div>
            <div>
              <Label>Build</Label>
              <p className="text-muted-foreground font-normal">Latest</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSupportSettings;