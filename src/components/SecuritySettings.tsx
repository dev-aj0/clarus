import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Mail, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

const SecuritySettings = ({ toast }: { toast: any }) => {
  const { user } = useAuth();
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleUpdateEmail = async () => {
    if (!newEmail.trim()) {
      toast.showError("Email Required", "Please enter a new email address.");
      return;
    }

    setIsUpdatingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      
      toast.showSuccess("Email Update Requested", "Check your new email for confirmation.");
      setNewEmail('');
    } catch (error: any) {
      toast.showError("Update Failed", error.message || "Failed to update email.");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.showError("All Fields Required", "Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.showError("Passwords Don't Match", "New password and confirmation must match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.showError("Password Too Short", "Password must be at least 6 characters long.");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      
      toast.showSuccess("Password Updated", "Your password has been successfully updated.");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      toast.showError("Update Failed", error.message || "Failed to update password.");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Email Settings */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail size={20} />
            Email Address
          </CardTitle>
          <CardDescription className="settings-card-description-bold">Update your email address</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Current Email</Label>
            <Input 
              value={user?.email || ''} 
              disabled 
              className="mt-1" 
            />
          </div>
          
          <div>
            <Label>New Email Address</Label>
            <Input 
              type="email"
              placeholder="Enter new email address" 
              className="mt-1 hover:border-primary/50 focus:border-primary transition-colors duration-200"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleUpdateEmail} 
            disabled={isUpdatingEmail || !newEmail.trim()}
            className="w-full hover:scale-[1.02] transition-all duration-200 hover:shadow-md"
          >
            {isUpdatingEmail ? 'Updating...' : 'Update Email'}
          </Button>
          
          <p className="text-sm text-muted-foreground font-normal">
            You'll receive a confirmation email at your new address.
          </p>
        </CardContent>
      </Card>

      {/* Password Settings */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock size={20} />
            Password
          </CardTitle>
          <CardDescription className="settings-card-description-bold">Change your account password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Current Password</Label>
            <Input 
              type="password"
              placeholder="Enter current password" 
              className="mt-1 hover:border-primary/50 focus:border-primary transition-colors duration-200"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          
          <div>
            <Label>New Password</Label>
            <Input 
              type="password"
              placeholder="Enter new password" 
              className="mt-1 hover:border-primary/50 focus:border-primary transition-colors duration-200"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          
          <div>
            <Label>Confirm New Password</Label>
            <Input 
              type="password"
              placeholder="Confirm new password" 
              className="mt-1 hover:border-primary/50 focus:border-primary transition-colors duration-200"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleUpdatePassword} 
            disabled={isUpdatingPassword || !currentPassword || !newPassword || !confirmPassword}
            className="w-full hover:scale-[1.02] transition-all duration-200 hover:shadow-md"
          >
            {isUpdatingPassword ? 'Updating...' : 'Update Password'}
          </Button>
          
          <p className="text-sm text-muted-foreground font-normal">
            Password must be at least 6 characters long.
          </p>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield size={20} />
            Account Security
          </CardTitle>
          <CardDescription className="settings-card-description-bold">Additional security information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <Label>Account Created</Label>
              <p className="text-muted-foreground font-normal">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
            <div>
              <Label>Last Sign In</Label>
              <p className="text-muted-foreground font-normal">
                {user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          </div>
          
          <div>
            <Label>Email Verified</Label>
            <p className="text-muted-foreground font-normal">
              {user?.email_confirmed_at ? 'Yes' : 'No'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;