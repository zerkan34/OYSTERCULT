import { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { userServices } from '@/lib/services';
import type { User } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      try {
        setLoading(true);
        if (firebaseUser) {
          // Récupérer ou créer le profil utilisateur dans Firestore
          const userProfile = await userServices.getUserById(firebaseUser.uid);
          
          if (userProfile) {
            setUser(userProfile);
          } else {
            // Créer un nouveau profil si l'utilisateur n'existe pas
            const newUser: Omit<User, 'id'> = {
              name: firebaseUser.displayName || 'Utilisateur',
              email: firebaseUser.email || '',
              role: 'user',
              department: '',
              position: '',
              status: 'active',
              createdAt: Date.now()
            };
            
            await userServices.createUser(firebaseUser.uid, newUser);
            setUser({ id: firebaseUser.uid, ...newUser });
          }
        } else {
          setUser(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Une erreur est survenue'));
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
