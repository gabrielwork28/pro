
import { GoogleGenAI, Type } from "@google/genai";
import type { OnboardingData } from '../types';

// This is a MOCK implementation. In a real app, you would use the Gemini API.
// We are returning structured JSON after a delay to simulate the API call.

// Note: Do not use this in a real app, as it exposes the API key on the client side.
// This is for demonstration purposes within this specific environment.
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const mockApiCall = <T,>(data: T, delay: number = 1500): Promise<T> => {
    return new Promise(resolve => setTimeout(() => resolve(data), delay));
};

export const generateWorkoutPlan = async (userData: OnboardingData): Promise<string> => {
    const mockResponse = {
        weeklyPlan: [
            { day: "Segunda-feira: Peito e Tríceps", exercises: [
                { name: "Supino Reto", sets: "4", reps: "8-12" },
                { name: "Crucifixo com Halteres", sets: "3", reps: "10-15" },
                { name: "Tríceps Pulley", sets: "4", reps: "10-12" },
            ]},
            { day: "Terça-feira: Costas e Bíceps", exercises: [
                 { name: "Barra Fixa", sets: "3", reps: "falha" },
                 { name: "Remada Curvada", sets: "4", reps: "8-10" },
                 { name: "Rosca Direta", sets: "3", reps: "10-12" },
            ]},
            { day: "Quarta-feira: Descanso", exercises: [] },
            { day: "Quinta-feira: Pernas", exercises: [
                { name: "Agachamento Livre", sets: "4", reps: "8-10" },
                { name: "Leg Press", sets: "3", reps: "10-15" },
                { name: "Cadeira Extensora", sets: "3", reps: "12-15" },
            ]},
            { day: "Sexta-feira: Ombros e Abdômen", exercises: [
                { name: "Desenvolvimento Militar", sets: "4", reps: "8-12" },
                { name: "Elevação Lateral", sets: "3", reps: "12-15" },
                { name: "Prancha", sets: "3", reps: "60s" },
            ]},
        ]
    };
    const result = await mockApiCall(mockResponse);
    return JSON.stringify(result, null, 2);
};

export const generateDietPlan = async (userData: OnboardingData): Promise<string> => {
     const mockResponse = {
        dailyCalories: 2200,
        macros: { protein: 180, carbs: 250, fat: 60 },
        weeklyPlan: [
            { day: "Todos os dias", meals: [
                { name: "Café da Manhã", description: "Ovos mexidos com aveia e uma porção de frutas vermelhas." },
                { name: "Almoço", description: "Frango grelhado, arroz integral, brócolis e salada." },
                { name: "Lanche da Tarde", description: "Iogurte grego com nozes e mel." },
                { name: "Jantar", description: "Salmão assado com batata doce e aspargos." },
            ]}
        ]
    };
    const result = await mockApiCall(mockResponse);
    return JSON.stringify(result, null, 2);
};

export const analyzeFoodImage = async (base64Image: string, mimeType: string): Promise<string> => {
    // In a real scenario, you'd send the base64Image to Gemini Vision model
    // const response = await ai.models.generateContent({ ... });
    const mockResponse = {
        identifiedFoods: ["Frango Grelhado", "Brócolis", "Arroz Integral"],
        calories: 550,
        macros: {
            protein: 45,
            carbs: 50,
            fat: 15
        },
        recommendation: "Recomendada" // Could be "Aceitável" or "Não Recomendada"
    };

    const result = await mockApiCall(mockResponse, 2000);
    return JSON.stringify(result, null, 2);
};
