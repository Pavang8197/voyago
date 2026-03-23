import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-expo';

const AuthContext = createContext();
const API_URL = 'https://eco-share-tbyu.vercel.app/api';

export const AuthProvider = ({ children }) => {
    const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
    const { signOut } = useClerkAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (clerkLoaded) {
            if (clerkUser) {
                // Sync with your backend
                syncUserWithBackend(clerkUser);
            } else {
                setUser(null);
                setLoading(false);
            }
        }
    }, [clerkUser, clerkLoaded]);

    const syncUserWithBackend = async (cUser) => {
        try {
            const res = await fetch(`${API_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: cUser.fullName || cUser.username || cUser.primaryEmailAddress.emailAddress.split('@')[0],
                    email: cUser.primaryEmailAddress.emailAddress,
                    photoUrl: cUser.imageUrl,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setUser(data);
            }
        } catch (e) {
            console.error('Error syncing with backend:', e);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await signOut();
            setUser(null);
        } catch (e) {
            console.error('Logout failed:', e);
        }
    };

    const refreshUser = async () => {
        if (!user?.id) return;
        try {
            const res = await fetch(`${API_URL}/users/${user.id}`);
            if (res.ok) {
                const updatedUser = await res.json();
                setUser(updatedUser);
            }
        } catch (e) {
            console.error('Failed to refresh user:', e);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            logout,
            refreshUser,
            loading: !clerkLoaded || loading,
            API_URL,
            clerkUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export { API_URL };
