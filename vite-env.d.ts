/// <reference types="vite/client" />

interface ImportMetaEnv {
 readonly VITE_SUPABASE_URL: string;
 readonly VITE_SUPABASE_ANON_KEY: string;
 readonly VITE_STRIPE_PUBLIC_KEY: string;
 readonly VITE_API_URL: string;
 // Add other environment variables here
}

declare module '*.svg' {
 const content: string;
 export default content;
}