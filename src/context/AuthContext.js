import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const API_URL = 'https://eco-share-tbyu.vercel.app/api';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStoredUser();
    }, []);

    const loadStoredUser = async () => {
        try {
            const stored = await AsyncStorage.getItem('ecoshare_user');
            if (stored) {
                setUser(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load user:', e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
                await AsyncStorage.setItem('ecoshare_user', JSON.stringify(data));
                return { success: true };
            }
            return { success: false, error: data.error || 'Login failed' };
        } catch (e) {
            console.error(e);
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
                await AsyncStorage.setItem('ecoshare_user', JSON.stringify(data));
                return { success: true };
            }
            return { success: false, error: data.error || 'Signup failed' };
        } catch (e) {
            console.error(e);
            return { success: false, error: 'Network error. Please try again.' };
        }
    };

    const logout = async () => {
        setUser(null);
        await AsyncStorage.removeItem('ecoshare_user');
    };

    const refreshUser = async () => {
        if (!user?.id) return;
        try {
            const res = await fetch(`${API_URL}/users/${user.id}`);
            if (res.ok) {
                const updatedUser = await res.json();
                setUser(updatedUser);
                await AsyncStorage.setItem('ecoshare_user', JSON.stringify(updatedUser));
            }
        } catch (e) {
            console.error('Failed to refresh user:', e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, refreshUser, loading, API_URL }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export { API_URL };
