
export interface User {
  id: string;
  email: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  register: (email: string, pass: string) => boolean;
  logout: () => void;
}

export interface OnboardingData {
    goal: string;
    name: string;
    age: number;
    sex: string;
    height: number;
    currentWeight: number;
    targetWeight: number;
    healthConditions: string[];
    otherCondition: string;
    experience: string;
    frequency: string;
    workoutLocation: string;
    workoutStyle: string;
    availability: { days: number; time: number };
    mealsPerDay: number;
    dietaryRestrictions: string[];
    dislikedFoods: string;
    sleepQuality: string;
    stressLevel: string;
    foodBudget: string;
}

export interface WeightEntry {
    date: string; // ISO string
    weight: number;
}

export type HabitState = Record<string, boolean[]>; // e.g. { 'Drink 2L water': [true, false, true, ...] }

export interface UserData {
    hasOnboarded: boolean;
    onboarding: OnboardingData;
    progress: {
        weightHistory: WeightEntry[];
    };
    plans: {
        workoutPlan: any | null; // Replace with specific type
        dietPlan: any | null; // Replace with specific type
    };
    tools: {
        habits: HabitState;
    };
}

export interface UserDbContextType {
    userData: UserData;
    updateOnboardingData: (data: OnboardingData) => void;
    addWeightEntry: (entry: WeightEntry) => void;
    updateHabits: (habits: HabitState) => void;
}
