import React, { useState, useRef, useEffect } from 'react';
import {
    View, Text, StyleSheet, TextInput, TouchableOpacity,
    KeyboardAvoidingView, Platform, Animated, Alert, ActivityIndicator, ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen({ navigation }) {
    const { login, signup } = useAuth();
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
        ]).start();
    }, []);

    const handleSubmit = async () => {
        setError('');
        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }
        if (isSignup && !name) {
            setError('Please enter your name');
            return;
        }

        setLoading(true);
        try {
            let result;
            if (isSignup) {
                result = await signup(name, email, password);
            } else {
                result = await login(email, password);
            }

            if (!result.success) {
                setError(result.error || 'Something went wrong');
            }
        } catch (e) {
            setError('Network error. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignup(!isSignup);
        setError('');
        setName('');
        setEmail('');
        setPassword('');
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#0F172A', '#1a2942', '#0F172A']} style={styles.gradient}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardView}
                    >
                        {/* Back Button */}
                        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                            <Ionicons name="arrow-back" size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>

                        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
                            {/* Logo */}
                            <View style={styles.logoSection}>
                                <View style={styles.logoCircle}>
                                    <Text style={{ fontSize: 36 }}>🌿</Text>
                                </View>
                                <Text style={styles.logoText}>Voyago</Text>
                            </View>

                            {/* Title */}
                            <Text style={styles.title}>
                                {isSignup ? 'Create Account' : 'Welcome Back'}
                            </Text>
                            <Text style={styles.subtitle}>
                                {isSignup ? 'Join the eco-travel revolution' : 'Login to access your trips'}
                            </Text>

                            {/* Error */}
                            {error ? (
                                <View style={styles.errorBox}>
                                    <Ionicons name="alert-circle" size={16} color={COLORS.error} />
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            ) : null}

                            {/* Form */}
                            <View style={styles.form}>
                                {isSignup && (
                                    <View style={styles.inputGroup}>
                                        <View style={styles.inputIcon}>
                                            <Ionicons name="person-outline" size={20} color={COLORS.textMuted} />
                                        </View>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Full Name"
                                            placeholderTextColor={COLORS.textMuted}
                                            value={name}
                                            onChangeText={setName}
                                            autoCapitalize="words"
                                        />
                                    </View>
                                )}

                                <View style={styles.inputGroup}>
                                    <View style={styles.inputIcon}>
                                        <Ionicons name="mail-outline" size={20} color={COLORS.textMuted} />
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Email Address"
                                        placeholderTextColor={COLORS.textMuted}
                                        value={email}
                                        onChangeText={setEmail}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>

                                <View style={styles.inputGroup}>
                                    <View style={styles.inputIcon}>
                                        <Ionicons name="lock-closed-outline" size={20} color={COLORS.textMuted} />
                                    </View>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Password"
                                        placeholderTextColor={COLORS.textMuted}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeBtn}
                                        onPress={() => setShowPassword(!showPassword)}
                                    >
                                        <Ionicons
                                            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                            size={20}
                                            color={COLORS.textMuted}
                                        />
                                    </TouchableOpacity>
                                </View>

                                {/* Submit Button */}
                                <TouchableOpacity
                                    style={styles.submitBtn}
                                    onPress={handleSubmit}
                                    disabled={loading}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={['#10B981', '#059669']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={styles.submitBtnGradient}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="#fff" />
                                        ) : (
                                            <>
                                                <Text style={styles.submitBtnText}>
                                                    {isSignup ? 'Create Account' : 'Sign In'}
                                                </Text>
                                                <Ionicons name="arrow-forward" size={18} color="#fff" />
                                            </>
                                        )}
                                    </LinearGradient>
                                </TouchableOpacity>

                                {/* Toggle */}
                                <TouchableOpacity onPress={toggleMode} style={styles.toggleBtn}>
                                    <Text style={styles.toggleText}>
                                        {isSignup
                                            ? 'Already have an account? '
                                            : "Don't have an account? "}
                                        <Text style={styles.toggleTextAccent}>
                                            {isSignup ? 'Login' : 'Sign Up'}
                                        </Text>
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    gradient: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    keyboardView: {
        flex: 1,
    },
    backBtn: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 28,
        paddingTop: 80,
        paddingBottom: 40,
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(16,185,129,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(16,185,129,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    logoText: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.primary,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.text,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: SIZES.fontMd,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 28,
    },
    errorBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(239,68,68,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(239,68,68,0.2)',
        borderRadius: SIZES.radiusMd,
        padding: 12,
        marginBottom: 16,
        gap: 8,
    },
    errorText: {
        color: COLORS.error,
        fontSize: SIZES.fontSm,
        flex: 1,
    },
    form: {
        gap: 14,
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: SIZES.radiusMd,
        overflow: 'hidden',
    },
    inputIcon: {
        paddingHorizontal: 14,
    },
    input: {
        flex: 1,
        height: 52,
        color: COLORS.text,
        fontSize: SIZES.fontMd,
    },
    eyeBtn: {
        paddingHorizontal: 14,
        height: 52,
        justifyContent: 'center',
    },
    submitBtn: {
        marginTop: 8,
        borderRadius: SIZES.radiusMd,
        ...SHADOWS.glow,
    },
    submitBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 16,
        borderRadius: SIZES.radiusMd,
    },
    submitBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: SIZES.fontLg,
    },
    toggleBtn: {
        alignItems: 'center',
        paddingVertical: 16,
    },
    toggleText: {
        fontSize: SIZES.fontMd,
        color: COLORS.textSecondary,
    },
    toggleTextAccent: {
        color: COLORS.primary,
        fontWeight: '600',
    },
});
