import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Funzione per ottenere l'utente corrente
export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions);
    return session?.user || null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

// Funzione per verificare se l'utente è autenticato
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

// Funzione per verificare se l'utente è admin
export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.role === 'admin';
} 