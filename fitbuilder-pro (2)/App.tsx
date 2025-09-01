
import React, { useState, createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import type { User, AuthContextType, UserDbContextType, OnboardingData, WeightEntry, HabitState } from './types';
import { getInitialUser, loginUser, registerUser, logoutUser } from './services/localDbService';
import { getUserData, updateUserData, initialUserData } from './services/localDbService';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import OnboardingPage from './components/OnboardingPage';
import Dashboard from './components/Dashboard';

// --- CONTEXTS ---
const AuthContext = createContext<AuthContextType | null>(null);
const UserDbContext = createContext<UserDbContextType | null>(null);

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

export const useUserDb = (): UserDbContextType => {
    const context = useContext(UserDbContext);
    if (!context) throw new Error('useUserDb must be used within a UserDbProvider');
    return context;
};

// --- AUTH PROVIDER ---
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(getInitialUser());

    const login = useCallback((email: string, pass: string) => {
        const loggedInUser = loginUser(email, pass);
        if (loggedInUser) {
            setUser(loggedInUser);
            return true;
        }
        return false;
    }, []);

    const register = useCallback((email: string, pass: string) => {
        const newUser = registerUser(email, pass);
        if (newUser) {
            setUser(newUser);
            return true;
        }
        return false;
    }, []);

    const logout = useCallback(() => {
        logoutUser();
        setUser(null);
    }, []);

    const value = useMemo(() => ({ user, isAuthenticated: !!user, login, register, logout }), [user, login, register, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// --- USER DB PROVIDER ---
const UserDbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [userData, setUserData] = useState(() => user ? getUserData(user.id) : initialUserData);

    useEffect(() => {
        if (user) {
            setUserData(getUserData(user.id));
        } else {
            setUserData(initialUserData);
        }
    }, [user]);

    const updateOnboardingData = useCallback((data: OnboardingData) => {
        if (user) {
            const newData = { ...userData, onboarding: data, hasOnboarded: true };
            updateUserData(user.id, newData);
            setUserData(newData);
        }
    }, [user, userData]);

    const addWeightEntry = useCallback((entry: WeightEntry) => {
        if (user) {
            const newHistory = [...userData.progress.weightHistory, entry];
            const newData = { ...userData, progress: { ...userData.progress, weightHistory: newHistory } };
            updateUserData(user.id, newData);
            setUserData(newData);
        }
    }, [user, userData]);

    const updateHabits = useCallback((habits: HabitState) => {
        if (user) {
            const newData = { ...userData, tools: { ...userData.tools, habits } };
            updateUserData(user.id, newData);
            setUserData(newData);
        }
    }, [user, userData]);
    
    const value = useMemo(() => ({
        userData,
        updateOnboardingData,
        addWeightEntry,
        updateHabits,
    }), [userData, updateOnboardingData, addWeightEntry, updateHabits]);

    return <UserDbContext.Provider value={value}>{children}</UserDbContext.Provider>;
};

// --- APP ROUTER ---
const AppRouter = () => {
    const { isAuthenticated } = useAuth();
    const { userData } = useUserDb();

    if (!isAuthenticated) {
        return (
            <Routes>
                <Route path="/login" element={<AuthPage initialView="login" />} />
                <Route path="/register" element={<AuthPage initialView="register" />} />
                <Route path="/" element={<LandingPage />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        );
    }
    
    if (!userData.hasOnboarded) {
         return (
            <Routes>
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="*" element={<Navigate to="/onboarding" />} />
            </Routes>
         );
    }

    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

// --- MAIN APP ---
export default function App() {
    return (
        <HashRouter>
            <AuthProvider>
                <UserDbProvider>
                    <AppRouter />
                </UserDbProvider>
            </AuthProvider>
        </HashRouter>
    );
}
