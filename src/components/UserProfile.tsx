import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { User, Edit2, Camera, Save, X } from 'lucide-react';

interface UserProfile {
 id: string;
 email: string;
 name: string;
 avatar_url: string;
 bio: string;
 created_at: string;
}

export function UserProfile() {
 const { user } = useAuth();
 const [profile, setProfile] = useState<UserProfile | null>(null);
 const [loading, setLoading] = useState(true);
 const [editing, setEditing] = useState(false);
 const [formData, setFormData] = useState({
 name: '',
 bio: '',
 avatar_url: ''
 });
 const [avatarFile, setAvatarFile] = useState<File | null>(null);

 useEffect(() => {
 if (user) {
 fetchProfile();
 }
 }, [user]);

 const fetchProfile = async () => {
 setLoading(true);
 const { data, error } = await supabase
 .from('profiles')
 .select('*')
 .eq('id', user?.id)
 .single();

 if (error) {
 console.error('Error fetching profile:', error);
 } else {
 setProfile(data);
 setFormData({
 name: data?.name || '',
 bio: data?.bio || '',
 avatar_url: data?.avatar_url || ''
 });
 }
 setLoading(false);
 };

 const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
 const { name, value } = e.target;
 setFormData(prev => ({ ...prev, [name]: value }));
 };

 const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 if (e.target.files && e.target.files[0]) {
 setAvatarFile(e.target.files[0]);
 const reader = new FileReader();
 reader.onload = (e) => {
 setFormData(prev => ({ ...prev, avatar_url: e.target?.result as string }));
 };
 reader.readAsDataURL(e.target.files[0]);
 }
 };

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 setLoading(true);

 try {
 let avatarUrl = formData.avatar_url;

 if (avatarFile) {
 const fileExt = avatarFile.name.split('.').pop();
 const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
 const filePath = `avatars/${fileName}`;

 const { error: uploadError } = await supabase.storage
 .from('avatars')
 .upload(filePath, avatarFile);

 if (uploadError) throw uploadError;

 const { data: { publicUrl } } = supabase.storage
 .from('avatars')
 .getPublicUrl(filePath);

 avatarUrl = publicUrl;
 }

 const { data, error } = await supabase
 .from('profiles')
 .upsert({
 id: user?.id,
 name: formData.name,
 bio: formData.bio,
 avatar_url: avatarUrl
 })
 .select()
 .single();

 if (error) throw error;

 setProfile(data);
 setEditing(false);
 } catch (err) {
 console.error('Error updating profile:', err);
 } finally {
 setLoading(false);
 }
 };

 if (loading) {
 return (
 <div className="flex justify-center items-center py-12">
 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
 </div>
 );
 }

 if (!profile) {
 return (
 <div className="text-center py-12">
 <p className="text-gray-500">No profile found</p>
 </div>
 );
 }

 return (
 <motion.div
 initial={{ opacity:0, y:20 }}
 animate={{ opacity:1, y:0 }}
 transition={{ duration:0.5 }}
 className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg"
 >
 <div className="flex items-center mb-6">
 <div className="relative">
 {editing ? (
 <div className="relative">
 <img
 src={formData.avatar_url || 'https://via.placeholder.com/150'}
 alt="Profile"
 className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100"
 />
 <label
 htmlFor="avatar-upload"
 className="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 cursor-pointer hover:bg-indigo-700 transition-colors"
 >
 <Camera className="h-5 w-5 text-white" />
 <input
 id="avatar-upload"
 type="file"
 accept="image/*"
 onChange={handleAvatarChange}
 className="hidden"
 />
 </label>
 </div>
 ) : (
 <img
 src={profile.avatar_url || 'https://via.placeholder.com/150'}
 alt="Profile"
 className="w-24 h-24 rounded-full object-cover border-4 border-indigo-100"
 />
 )}
 </div>
 <div className="ml-6">
 {editing ? (
 <input
 type="text"
 name="name"
 value={formData.name}
 onChange={handleInputChange}
 className="text-2xl font-bold mb-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
 />
 ) : (
 <h2 className="text-2xl font-bold">{profile.name || 'Your Name'}</h2>
 )}
 <p className="text-gray-600">Member since {new Date(profile.created_at).toLocaleDateString()}</p>
 </div>
 <div className="ml-auto">
 {editing ? (
 <div className="flex space-x-2">
 <button
 onClick={handleSubmit}
 disabled={loading}
 className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
 >
 <Save className="h-4 w-4 mr-2" />
 Save
 </button>
 <button
 onClick={() => setEditing(false)}
 className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
 >
 <X className="h-4 w-4 mr-2" />
 Cancel
 </button>
 </div>
 ) : (
 <button
 onClick={() => setEditing(true)}
 className="flex items-center px-4 py-2 bg-indigo-100 text-indigo-800 rounded-md hover:bg-indigo-200 transition-colors"
 >
 <Edit2 className="h-4 w-4 mr-2" />
 Edit Profile
 </button>
 )}
 </div>
 </div>

 {editing ? (
 <div className="mb-6">
 <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
 Bio
 </label>
 <textarea
 id="bio"
 name="bio"
 value={formData.bio}
 onChange={handleInputChange}
 rows={4}
 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
 />
 </div>
 ) : (
 <div className="mb-6">
 <h3 className="text-lg font-medium mb-2">About Me</h3>
 <p className="text-gray-700 whitespace-pre-line">
 {profile.bio || 'Tell us about yourself...'}
 </p>
 </div>
 )}

 <div className="border-t border-gray-200 pt-6">
 <h3 className="text-lg font-medium mb-4">Account Information</h3>
 <div className="space-y-4">
 <div className="flex items-center">
 <User className="h-5 w-5 text-gray-400 mr-3" />
 <div>
 <p className="text-sm text-gray-500">Email</p>
 <p className="font-medium">{profile.email}</p>
 </div>
 </div>
 </div>
 </div>
 </motion.div>
 );
}