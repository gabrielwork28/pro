
import React, { useState, useEffect } from 'react';
import { useAuth, useUserDb } from '../App';
import { LogoIcon, HomeIcon, DumbbellIcon, PlateIcon, ScanIcon, WrenchIcon, LogoutIcon, MenuIcon, XIcon } from './Icons';
import { Card, Spinner, Button, Input } from './UI';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { generateWorkoutPlan, generateDietPlan, analyzeFoodImage } from '../services/geminiService';
import type { WeightEntry } from '../types';

type Page = 'Início' | 'Plano de Treino' | 'Plano de Dieta' | 'Scanner de Alimentos' | 'Ferramentas';

// --- SIDEBAR ---
const Sidebar: React.FC<{ currentPage: Page; setPage: (page: Page) => void; isOpen: boolean; }> = ({ currentPage, setPage, isOpen }) => {
    const { user, logout } = useAuth();
    const navItems = [
        { name: 'Início', icon: <HomeIcon /> },
        { name: 'Plano de Treino', icon: <DumbbellIcon /> },
        { name: 'Plano de Dieta', icon: <PlateIcon /> },
        { name: 'Scanner de Alimentos', icon: <ScanIcon /> },
        { name: 'Ferramentas', icon: <WrenchIcon /> },
    ];

    return (
        <aside className={`bg-surface text-text-primary flex flex-col h-full border-r border-border transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} `}>
            <div className={`p-4 border-b border-border flex items-center gap-3 ${isOpen ? 'justify-start' : 'justify-center'}`}>
                <LogoIcon className="h-8 w-8 text-primary flex-shrink-0" />
                {isOpen && <span className="text-xl font-bold">FitBuilder Pro</span>}
            </div>
            <nav className="flex-grow p-4 space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.name}
                        onClick={() => setPage(item.name as Page)}
                        className={`w-full flex items-center gap-4 p-3 rounded-lg text-left transition-colors ${
                            currentPage === item.name ? 'bg-secondary text-primary font-semibold' : 'hover:bg-background'
                        } ${!isOpen && 'justify-center'}`}
                    >
                        <div className="flex-shrink-0">{item.icon}</div>
                        {isOpen && <span>{item.name}</span>}
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-border">
                <div className={`flex items-center gap-3 mb-4 ${!isOpen && 'justify-center'}`}>
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center font-bold text-primary flex-shrink-0">
                       {user?.email[0].toUpperCase()}
                    </div>
                    {isOpen && <span className="text-sm font-medium truncate">{user?.email}</span>}
                </div>
                <button
                    onClick={logout}
                    className={`w-full flex items-center gap-4 p-3 rounded-lg text-left transition-colors text-red-500 hover:bg-red-50 ${!isOpen && 'justify-center'}`}
                >
                    <LogoutIcon />
                    {isOpen && <span>Sair</span>}
                </button>
            </div>
        </aside>
    );
};

// --- HOME CONTENT ---
const HomeContent: React.FC = () => {
    const { userData } = useUserDb();
    const { name, currentWeight, targetWeight } = userData.onboarding;
    const { weightHistory } = userData.progress;
    
    const progress = targetWeight > currentWeight 
        ? ((weightHistory[weightHistory.length - 1]?.weight ?? currentWeight) - currentWeight) / (targetWeight - currentWeight) * 100
        : ((currentWeight - (weightHistory[weightHistory.length - 1]?.weight ?? currentWeight)) / (currentWeight - targetWeight)) * 100;

    const macroData = [{ name: 'Proteínas', value: 40 }, { name: 'Carboidratos', value: 40 }, { name: 'Gorduras', value: 20 }];
    const COLORS = ['#6d28d9', '#a78bfa', '#c4b5fd'];

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-text-primary">Bom dia, {name}!</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                    <h3 className="font-semibold mb-4">Meta de Peso</h3>
                    <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                        <div className="bg-primary h-4 rounded-full" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }}></div>
                    </div>
                    <div className="flex justify-between text-sm text-text-secondary">
                        <span>{currentWeight} kg</span>
                        <span>{weightHistory[weightHistory.length - 1]?.weight ?? currentWeight} kg (Atual)</span>
                        <span>{targetWeight} kg</span>
                    </div>
                </Card>
                <Card>
                    <h3 className="font-semibold mb-2">Foco do Dia</h3>
                    <p className="text-lg font-bold text-primary">Peito & Tríceps</p>
                    <p className="text-text-secondary">2,200 kcal / 180g Proteína</p>
                </Card>
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <Card className="lg:col-span-3">
                    <h3 className="font-semibold mb-4">Evolução do Peso</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={weightHistory}>
                            <XAxis dataKey="date" tickFormatter={(str) => new Date(str).toLocaleDateString()}/>
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="weight" stroke="#6d28d9" strokeWidth={2} name="Peso (kg)" />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>
                <Card className="lg:col-span-2">
                    <h3 className="font-semibold mb-4">Distribuição de Macros</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={macroData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name">
                                {macroData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </div>
    );
}

// --- PLAN CONTENT ---
const PlanContent: React.FC<{ type: 'workout' | 'diet' }> = ({ type }) => {
    const [plan, setPlan] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { userData } = useUserDb();

    useEffect(() => {
        const fetchPlan = async () => {
            setLoading(true);
            try {
                const generatedPlan = type === 'workout' 
                    ? await generateWorkoutPlan(userData.onboarding)
                    : await generateDietPlan(userData.onboarding);
                setPlan(JSON.parse(generatedPlan));
            } catch (error) {
                console.error("Failed to generate plan:", error);
                setPlan({ error: "Não foi possível gerar o plano. Tente novamente." });
            } finally {
                setLoading(false);
            }
        };
        fetchPlan();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    if (plan.error) return <div className="text-red-500">{plan.error}</div>;
    if (!plan) return <div>Nenhum plano disponível.</div>;

    const title = type === 'workout' ? 'Plano de Treino' : 'Plano de Dieta';
    const planData = plan.weeklyPlan || [];

    return (
        <div>
            <h2 className="text-3xl font-bold text-text-primary mb-6">{title}</h2>
            <div className="space-y-4">
                {planData.map((dayPlan: any, index: number) => (
                    <details key={index} className="bg-surface rounded-lg border border-border overflow-hidden">
                        <summary className="p-4 font-semibold cursor-pointer">{dayPlan.day}</summary>
                        <div className="p-4 border-t border-border">
                            {type === 'workout' ? (
                                <ul className="space-y-2">
                                    {(dayPlan.exercises || []).map((ex: any, i: number) => <li key={i}>{ex.name}: {ex.sets}x{ex.reps}</li>)}
                                </ul>
                            ) : (
                                <ul className="space-y-4">
                                    {(dayPlan.meals || []).map((meal: any, i: number) => <li key={i}><b>{meal.name}:</b> {meal.description}</li>)}
                                </ul>
                            )}
                        </div>
                    </details>
                ))}
            </div>
        </div>
    );
};

// --- SCANNER CONTENT ---
const FoodScannerContent: React.FC = () => {
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setResult(null);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const fileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve((reader.result as string).split(',')[1]);
            reader.onerror = error => reject(error);
        });
    };

    const handleScan = async () => {
        if (!image) return;
        setLoading(true);
        setResult(null);
        try {
            const base64Image = await fileToBase64(image);
            const analysis = await analyzeFoodImage(base64Image, image.type);
            setResult(JSON.parse(analysis));
        } catch (error) {
            console.error("Failed to analyze image:", error);
            setResult({ error: "Falha ao analisar a imagem." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-3xl font-bold text-text-primary mb-6">Scanner de Alimentos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <Card>
                    <h3 className="font-semibold mb-4">1. Envie uma foto da sua refeição</h3>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="mb-4 block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-primary hover:file:bg-indigo-200"/>
                    {preview && <img src={preview} alt="Pré-visualização da refeição" className="rounded-lg max-h-64 mx-auto" />}
                    <Button onClick={handleScan} disabled={!image || loading} className="w-full mt-4">
                        {loading ? 'Analisando...' : 'Analisar Refeição'}
                    </Button>
                </Card>
                <Card>
                    <h3 className="font-semibold mb-4">2. Análise Nutricional</h3>
                    {loading && <div className="flex justify-center items-center h-48"><Spinner /></div>}
                    {result && !result.error && (
                         <div className="space-y-3">
                            <p><strong>Alimentos Identificados:</strong> {result.identifiedFoods.join(', ')}</p>
                            <p><strong>Calorias Estimadas:</strong> {result.calories} kcal</p>
                            <p><strong>Macros:</strong> P: {result.macros.protein}g, C: {result.macros.carbs}g, G: {result.macros.fat}g</p>
                            <div className={`p-3 rounded-lg text-center font-bold ${
                                result.recommendation === 'Recomendada' ? 'bg-green-100 text-green-800' :
                                result.recommendation === 'Aceitável' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                                {result.recommendation}
                            </div>
                        </div>
                    )}
                     {result?.error && <p className="text-red-500">{result.error}</p>}
                     {!loading && !result && <p className="text-text-secondary">Os resultados aparecerão aqui.</p>}
                </Card>
            </div>
        </div>
    );
};

// --- TOOLS CONTENT ---
const ToolsContent: React.FC = () => {
    const { userData, addWeightEntry } = useUserDb();
    const [weight, setWeight] = useState('');

    const handleAddWeight = () => {
        const newWeight = parseFloat(weight);
        if (newWeight > 0) {
            const newEntry: WeightEntry = { date: new Date().toISOString(), weight: newWeight };
            addWeightEntry(newEntry);
            setWeight('');
        }
    };
    
    return (
        <div>
            <h2 className="text-3xl font-bold text-text-primary mb-6">Ferramentas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <h3 className="font-semibold mb-4">Controle de Peso e Medidas</h3>
                    <div className="flex gap-2">
                        <Input type="number" placeholder="Peso atual (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} />
                        <Button onClick={handleAddWeight}>Registrar</Button>
                    </div>
                    <div className="mt-4 max-h-48 overflow-y-auto">
                        <h4 className="font-medium text-sm text-text-secondary mb-2">Histórico</h4>
                        <ul className="text-sm">
                        {[...userData.progress.weightHistory].reverse().map(entry => (
                            <li key={entry.date} className="flex justify-between p-1 border-b">
                                <span>{new Date(entry.date).toLocaleDateString()}</span>
                                <span>{entry.weight} kg</span>
                            </li>
                        ))}
                        </ul>
                    </div>
                </Card>
                <Card>
                    <h3 className="font-semibold mb-4">Calculadora de Calorias (TDEE)</h3>
                    <p className="text-text-secondary">Em breve...</p>
                </Card>
                 <Card>
                    <h3 className="font-semibold mb-4">Cronômetro de Exercícios</h3>
                    <p className="text-text-secondary">Em breve...</p>
                </Card>
                 <Card>
                    <h3 className="font-semibold mb-4">Lista de Compras</h3>
                    <p className="text-text-secondary">Em breve...</p>
                </Card>
            </div>
        </div>
    )
}


// --- MAIN DASHBOARD ---
const Dashboard: React.FC = () => {
    const [page, setPage] = useState<Page>('Início');
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const renderContent = () => {
        switch (page) {
            case 'Início': return <HomeContent />;
            case 'Plano de Treino': return <PlanContent type="workout" />;
            case 'Plano de Dieta': return <PlanContent type="diet" />;
            case 'Scanner de Alimentos': return <FoodScannerContent />;
            case 'Ferramentas': return <ToolsContent />;
            default: return <HomeContent />;
        }
    };

    return (
        <div className="flex h-screen bg-background">
            <div className="lg:block hidden">
                <Sidebar currentPage={page} setPage={setPage} isOpen={isSidebarOpen} />
            </div>

             {/* Mobile Sidebar */}
            {isSidebarOpen && (
                 <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)}>
                    <div className="fixed inset-y-0 left-0 z-50">
                        <Sidebar currentPage={page} setPage={setPage} isOpen={true} />
                    </div>
                 </div>
            )}
           
            <main className="flex-1 overflow-y-auto p-6 lg:p-10">
                 <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 rounded-md bg-surface text-text-primary mb-4">
                    {isSidebarOpen ? <XIcon /> : <MenuIcon />}
                </button>
                {renderContent()}
            </main>
        </div>
    );
};

export default Dashboard;
