import React from 'react';
import { UserProfile } from '@/components/UserProfile';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';

interface ProfilePageProps {
 // Add any props if needed
}

export function ProfilePage({}: ProfilePageProps) {
 const { user } = useAuth();

 if (!user) {
 return (
 <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
 <h2 className="text-xl font-bold mb-4">Please sign in</h2>
 <p className="text-gray-600 mb-6">You need to be signed in to view your profile.</p>
 <Link
 to="/auth/login"
 className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
 >
 Sign In
 </Link>
 </div>
 );
 }

 return (
 <div className="container mx-auto px-4 py-8">
 <UserProfile />
 </div>
 );
}