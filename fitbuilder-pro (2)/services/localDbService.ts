
import type { User, UserData } from '../types';

const USERS_KEY = 'fitbuilder-users';
const LOGGED_IN_USER_KEY = 'fitbuilder-currentUser';
const USER_DATA_PREFIX = 'fitbuilder-userdata-';

// --- USER DATA ---
export const initialUserData: UserData = {
    hasOnboarded: false,
    onboarding: {
        goal: '', name: '', age: 0, sex: '', height: 0, currentWeight: 0, targetWeight: 0,
        healthConditions: [], otherCondition: '', experience: '', frequency: '', workoutLocation: '',
        workoutStyle: '', availability: { days: 3, time: 60 }, mealsPerDay: 3, dietaryRestrictions: [],
        dislikedFoods: '', sleepQuality: '', stressLevel: '', foodBudget: ''
    },
    progress: { weightHistory: [] },
    plans: { workoutPlan: null, dietPlan: null },
    tools: { habits: {} },
};

export const getUserData = (userId: string): UserData => {
    const data = localStorage.getItem(`${USER_DATA_PREFIX}${userId}`);
    return data ? JSON.parse(data) : initialUserData;
};

export const updateUserData = (userId: string, data: UserData) => {
    localStorage.setItem(`${USER_DATA_PREFIX}${userId}`, JSON.stringify(data));
};


// --- AUTH ---
const getUsers = (): Record<string, string> => {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : {};
};

const saveUsers = (users: Record<string, string>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getInitialUser = (): User | null => {
    const userJson = localStorage.getItem(LOGGED_IN_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
};

export const registerUser = (email: string, pass: string): User | null => {
    const users = getUsers();
    if (users[email]) {
        return null; // User already exists
    }
    users[email] = pass; // In a real app, hash the password!
    saveUsers(users);

    const newUser: User = { id: email, email }; // Using email as ID for simplicity
    localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(newUser));
    // Initialize user data
    updateUserData(newUser.id, initialUserData);
    
    return newUser;
};

export const loginUser = (email: string, pass: string): User | null => {
    const users = getUsers();
    if (users[email] === pass) {
        const user: User = { id: email, email };
        localStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user));
        return user;
    }
    return null;
};

export const logoutUser = () => {
    localStorage.removeItem(LOGGED_IN_USER_KEY);
};
