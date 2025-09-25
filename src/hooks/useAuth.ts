import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import fallbackAuth from '@/lib/fallback-auth';

interface User {
 id: string;
 email: string;
 name?: string;
 avatarUrl?: string;
}

interface AuthResponse {
 user: User | null;
 error: Error | null;
}

export function useAuth() {
 const [user, setUser] = useState<User | null>(null);
 const [loading, setLoading] = useState(true);
 const [isSupabaseConfigured, setIsSupabaseConfigured] = useState(true);

 useEffect(() => {
 const checkSupabaseConfig = () => {
 // Check if Supabase is properly configured
 const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
 const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

 setIsSupabaseConfigured(!!supabaseUrl && !!supabaseKey);
 };

 checkSupabaseConfig();
 }, []);

 useEffect(() => {
 const getSession = async () => {
 try {
 if (isSupabaseConfigured) {
 // Use Supabase authentication
 const { data: { session } } = await supabase.auth.getSession();
 setUser(session?.user ? {
 id: session.user.id,
 email: session.user.email || '',
 name: session.user.user_metadata?.name,
 avatarUrl: session.user.user_metadata?.avatar_url
 } : null);
 } else {
 // Use fallback authentication
 const { data: { session } } = await fallbackAuth.getSession();
 setUser(session?.user ?? null);
 }
 } catch (error) {
 console.error('Error getting session:', error);
 setUser(null);
 } finally {
 setLoading(false);
 }
 };

 getSession();

 // Set up auth state listener
 let subscription;
 if (isSupabaseConfigured) {
 subscription = supabase.auth.onAuthStateChange((_event, session) => {
 setUser(session?.user ? {
 id: session.user.id,
 email: session.user.email || '',
 name: session.user.user_metadata?.name,
 avatarUrl: session.user.user_metadata?.avatar_url
 } : null);
 });
 }

 return () => {
 if (subscription) {
 subscription.data.subscription.unsubscribe();
 }
 };
 }, [isSupabaseConfigured]);

 const signIn = async (email: string, password: string): Promise<AuthResponse> => {
 try {
 if (isSupabaseConfigured) {
 // Use Supabase authentication
 const { data, error } = await supabase.auth.signInWithPassword({
 email,
 password
 });

 if (error) throw error;
 setUser(data.user ? {
 id: data.user.id,
 email: data.user.email || '',
 name: data.user.user_metadata?.name,
 avatarUrl: data.user.user_metadata?.avatar_url
 } : null);
 return { user: data.user ? {
 id: data.user.id,
 email: data.user.email || '',
 name: data.user.user_metadata?.name,
 avatarUrl: data.user.user_metadata?.avatar_url
 } : null, error: null };
 } else {
 // Use fallback authentication
 const { user, error } = await fallbackAuth.signInWithEmail(email);

 if (error) throw error;
 setUser(user);
 return { user, error: null };
 }
 } catch (error) {
 return { user: null, error: error instanceof Error ? error : new Error('An error occurred') };
 }
 };

 const signUp = async (email: string, password: string): Promise<AuthResponse> => {
 try {
 if (isSupabaseConfigured) {
 // Use Supabase authentication
 const { data, error } = await supabase.auth.signUp({
 email,
 password,
 options: {
 emailRedirectTo: `${window.location.origin}/auth/callback`
 }
 });

 if (error) throw error;
 setUser(data.user ? {
 id: data.user.id,
 email: data.user.email || '',
 name: data.user.user_metadata?.name,
 avatarUrl: data.user.user_metadata?.avatar_url
 } : null);
 return { user: data.user ? {
 id: data.user.id,
 email: data.user.email || '',
 name: data.user.user_metadata?.name,
 avatarUrl: data.user.user_metadata?.avatar_url
 } : null, error: null };
 } else {
 // Use fallback authentication
 const { user, error } = await fallbackAuth.signUp(email, password);

 if (error) throw error;
 setUser(user);
 return { user, error: null };
 }
 } catch (error) {
 return { user: null, error: error instanceof Error ? error : new Error('An error occurred') };
 }
 };

 const signOut = async (): Promise<{ error: Error | null }> => {
 try {
 if (isSupabaseConfigured) {
 // Use Supabase authentication
 const { error } = await supabase.auth.signOut();

 if (error) throw error;
 setUser(null);
 return { error: null };
 } else {
 // Use fallback authentication
 const { error } = await fallbackAuth.signOut();

 if (error) throw error;
 setUser(null);
 return { error: null };
 }
 } catch (error) {
 return { error: error instanceof Error ? error : new Error('An error occurred') };
 }
 };

 return { user, loading, signIn, signUp, signOut, isSupabaseConfigured };
}