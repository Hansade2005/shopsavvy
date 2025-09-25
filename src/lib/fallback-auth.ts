import { v4 as uuidv4 } from 'uuid';

interface User {
 id: string;
 email: string;
 name?: string;
 avatarUrl?: string;
}

// In-memory storage for test users
const testUsers: User[] = [
 {
 id: 'test-user-1',
 email: 'user1@example.com',
 name: 'Test User1',
 avatarUrl: 'https://i.pravatar.cc/150?img=1'
 },
 {
 id: 'test-user-2',
 email: 'user2@example.com',
 name: 'Test User2',
 avatarUrl: 'https://i.pravatar.cc/150?img=2'
 }
];

// Mock authentication functions
const fallbackAuth = {
 // Simulate sign in with test user
 async signInWithEmail(email: string): Promise<{ user: User | null; error: Error | null }> {
 // Find test user by email
 const user = testUsers.find(u => u.email === email);

 if (!user) {
 return {
 user: null,
 error: new Error('Invalid email or password')
 };
 }

 // Simulate successful login
 return {
 user,
 error: null
 };
 },

 // Simulate sign up with new test user
 async signUp(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
 // Check if email already exists
 const existingUser = testUsers.find(u => u.email === email);

 if (existingUser) {
 return {
 user: null,
 error: new Error('Email already in use')
 };
 }

 // Create new test user
 const newUser: User = {
 id: uuidv4(),
 email,
 name: email.split('@')[0],
 avatarUrl: `https://i.pravatar.cc/150?u=${email}`
 };

 testUsers.push(newUser);

 return {
 user: newUser,
 error: null
 };
 },

 // Simulate sign out
 async signOut(): Promise<{ error: Error | null }> {
 // In a real app, you would clear session here
 return { error: null };
 },

 // Get current session
 async getSession(): Promise<{ data: { session: { user: User } | null } }> {
 // For test purposes, always return the first test user
 return {
 data: {
 session: {
 user: testUsers[0]
 }
 }
 };
 }
};

export default fallbackAuth;