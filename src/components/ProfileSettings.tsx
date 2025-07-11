import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Camera, Upload, Trash2, User as UserIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ProfileSettings = ({ toast }: { toast: any }) => {
  const [profileImage, setProfileImage] = useState('');
  const [displayName, setDisplayName] = useState('User');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('user@example.com');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      
      // Create a preview URL for the image
      const previewUrl = URL.createObjectURL(file);
      setProfileImage(previewUrl);
      
      // Simulate upload delay
      setTimeout(() => {
        setIsUploading(false);
        toast.showSuccess("Profile Picture Updated", "Your profile picture has been successfully updated.");
      }, 1500);
    }
  };

  const removeProfilePicture = () => {
    setProfileImage('');
    toast.showSuccess("Profile Picture Removed", "Your profile picture has been removed.");
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      // Simulate save delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage for persistence
      localStorage.setItem('userProfile', JSON.stringify({
        displayName,
        bio,
        profileImage
      }));

      toast.showSuccess("Profile Updated", "Your profile has been successfully saved.");
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.showError("Update Failed", "Failed to update profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Load profile from localStorage on component mount
  React.useEffect(() => {
    try {
      const savedProfile = localStorage.getItem('userProfile');
      if (savedProfile) {
        const profile = JSON.parse(savedProfile);
        setDisplayName(profile.displayName || 'User');
        setBio(profile.bio || '');
        setProfileImage(profile.profileImage || '');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Profile Picture and Basic Info */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera size={20} />
            Profile Picture & Basic Info
          </CardTitle>
          <CardDescription className="settings-card-description-bold">Manage your profile picture, display name, and bio.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 hover:scale-110 transition-transform duration-300">
              <AvatarImage src={profileImage} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="relative hover:scale-105 transition-all duration-200 hover:shadow-md"
                  disabled={isUploading}
                >
                  <Upload size={16} className="mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </Button>
                
                {profileImage && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={removeProfilePicture}
                    className="hover:scale-105 transition-all duration-200 hover:shadow-md"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Remove
                  </Button>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground font-normal">
                JPG, PNG or GIF. Max file size 5MB.
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <Label>Display Name</Label>
              <Input 
                placeholder="Enter your display name" 
                className="mt-1 hover:border-primary/50 focus:border-primary transition-colors duration-200"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            
            <div>
              <Label>Bio</Label>
              <Input 
                placeholder="Tell us about yourself" 
                className="mt-1 hover:border-primary/50 focus:border-primary transition-colors duration-200"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>

            <Button 
              onClick={saveProfile} 
              disabled={isSaving}
              className="w-full hover:scale-[1.02] transition-all duration-200 hover:shadow-md"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon size={20} />
            Account Information
          </CardTitle>
          <CardDescription className="settings-card-description-bold">Your basic account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Email Address</Label>
            <Input 
              value={email} 
              disabled 
              className="mt-1" 
            />
            <p className="text-sm text-muted-foreground font-normal mt-1">
              Email management is currently disabled
            </p>
          </div>
          
          <div>
            <Label>Account Created</Label>
            <Input 
              value={new Date().toLocaleDateString()} 
              disabled 
              className="mt-1" 
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;