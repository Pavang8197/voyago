import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-expo';

const AuthContext = createContext();

// Configure your API URL here:
// - For Vercel deployment, use your Vercel URL
// - For local development, comment out the production URL and uncomment the local one
const getApiUrl = () => {
    // Production (Vercel deployment):
    return 'https://ecoshare-eight.vercel.app/api';

    // Local development (uncomment below, comment out the production line above):
    // if (Platform.OS === 'android') {
    //     return 'http://10.0.2.2:5000/api';
    // }
    // return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

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
            console.log(`Syncing with ${API_URL}/auth/google...`);
            const res = await fetch(`${API_URL}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clerkId: cUser.id,
                    name: cUser.fullName || cUser.username || cUser.primaryEmailAddress?.emailAddress?.split('@')[0] || 'User',
                    email: cUser.primaryEmailAddress?.emailAddress,
                    photoUrl: cUser.imageUrl,
                }),
            });

            console.log(`Backend response: ${res.status}`);
            
            if (res.ok) {
                const text = await res.text();
                if (text) {
                    const data = JSON.parse(text);
                    setUser(data);
                }
            } else {
                const errorText = await res.text();
                console.error(`Backend error (${res.status}):`, errorText);
            }
        } catch (e) {
            console.error('Error syncing with backend:', e.message);
            // Don't block the user from using the app if backend is down
            // Set a minimal user object from Clerk data
            setUser({
                name: cUser.fullName || cUser.username || 'User',
                email: cUser.primaryEmailAddress?.emailAddress,
                photoUrl: cUser.imageUrl,
                ecoPoints: 0,
                donatedPoints: 0,
            });
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
        if (!user?._id && !user?.id) return;
        try {
            const userId = user._id || user.id;
            const res = await fetch(`${API_URL}/users/${userId}`);
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
