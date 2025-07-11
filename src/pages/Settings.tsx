import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Palette, HelpCircle, Shield } from 'lucide-react';
import ProfileSettings from '@/components/ProfileSettings';
import AppearanceSettings from '@/components/AppearanceSettings';
import HelpSupportSettings from '@/components/HelpSupportSettings';
import SecuritySettings from '@/components/SecuritySettings';
import { useCenterBottomToast } from '@/hooks/useCenterBottomToast';
import CenterBottomToast from '@/components/CenterBottomToast';

const Settings = () => {
  const toast = useCenterBottomToast();

  return (
    <div className="flex-1 overflow-y-auto min-h-0">
      <div className="container-consistent max-w-4xl h-full flex flex-col">
        <div className="mb-8 text-left flex-shrink-0">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground font-bold">
            Manage your account settings and preferences.
          </p>
        </div>

        <div className="flex-1 min-h-0">
          <Tabs defaultValue="profile" className="w-full h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4 flex-shrink-0">
              <TabsTrigger value="profile" className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                <User size={16} />
                Profile
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                <Palette size={16} />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                <Shield size={16} />
                Security
              </TabsTrigger>
              <TabsTrigger value="help" className="flex items-center gap-2 hover:scale-105 transition-transform duration-200">
                <HelpCircle size={16} />
                Help & Support
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto mt-8">
              <TabsContent value="profile" className="mt-0">
                <div className="mb-6 text-left">
                  <h2 className="text-2xl font-semibold mb-2">Profile</h2>
                  <p className="text-muted-foreground font-bold">Edit your public profile and personal information.</p>
                </div>
                <ProfileSettings toast={toast} />
              </TabsContent>

              <TabsContent value="appearance" className="mt-0">
                <div className="mb-6 text-left">
                  <h2 className="text-2xl font-semibold mb-2">Appearance</h2>
                  <p className="text-muted-foreground font-bold">Customize the look and feel of the app.</p>
                </div>
                <AppearanceSettings />
              </TabsContent>

              <TabsContent value="security" className="mt-0">
                <div className="mb-6 text-left">
                  <h2 className="text-2xl font-semibold mb-2">Security</h2>
                  <p className="text-muted-foreground font-bold">Manage your password and email address.</p>
                </div>
                <SecuritySettings toast={toast} />
              </TabsContent>

              <TabsContent value="help" className="mt-0">
                <div className="mb-6 text-left">
                  <h2 className="text-2xl font-semibold mb-2">Help & Support</h2>
                  <p className="text-muted-foreground font-bold">Find guides and contact our support team.</p>
                </div>
                <HelpSupportSettings toast={toast} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
      <CenterBottomToast toasts={toast.toasts} removeToast={toast.removeToast} />
    </div>
  );
};

export default Settings;