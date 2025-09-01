
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserDb } from '../App';
import type { OnboardingData } from '../types';
import { Button } from './UI';

const initialOnboardingData: OnboardingData = {
    goal: '', name: '', age: 0, sex: '', height: 0, currentWeight: 0, targetWeight: 0,
    healthConditions: [], otherCondition: '', experience: '', frequency: '', workoutLocation: '',
    workoutStyle: '', availability: { days: 3, time: 60 }, mealsPerDay: 3, dietaryRestrictions: [],
    dislikedFoods: '', sleepQuality: '', stressLevel: '', foodBudget: ''
};

const OnboardingPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<OnboardingData>(initialOnboardingData);
    const { updateOnboardingData } = useUserDb();
    const navigate = useNavigate();

    const totalSteps = 7;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSelect = (name: keyof OnboardingData, value: any) => {
        setData({ ...data, [name]: value });
    };

    const handleMultiSelect = (name: keyof OnboardingData, value: string) => {
        const current = (data[name] as string[]) || [];
        const updated = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
        setData({ ...data, [name]: updated });
    };

    const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = () => {
        updateOnboardingData(data);
        // Here you would typically show a loading screen while AI generates the plan
        navigate('/');
    };

    const renderStep = () => {
        switch (step) {
            case 1: return <Step title="Qual seu objetivo principal?">
                {['Emagrecimento', 'Ganho de massa muscular', 'Manutenção de peso', 'Melhora de condicionamento'].map(g => 
                    <ChoiceButton key={g} selected={data.goal === g} onClick={() => handleSelect('goal', g)}>{g}</ChoiceButton>)}
                </Step>;
            case 2: return <Step title="Nos conte um pouco sobre você">
                <input name="name" placeholder="Nome" value={data.name} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                <input name="age" type="number" placeholder="Idade" value={data.age || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                <div className="flex gap-4">{['Masculino', 'Feminino', 'Outro'].map(g => <ChoiceButton key={g} selected={data.sex === g} onClick={() => handleSelect('sex', g)}>{g}</ChoiceButton>)}</div>
                <input name="height" type="number" placeholder="Altura (cm)" value={data.height || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                <input name="currentWeight" type="number" placeholder="Peso Atual (kg)" value={data.currentWeight || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                <input name="targetWeight" type="number" placeholder="Peso Alvo (kg)" value={data.targetWeight || ''} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                </Step>;
            case 3: return <Step title="Saúde e Condições Médicas">
                {['Diabetes', 'Hipertensão', 'Lesões'].map(c => 
                    <ChoiceButton key={c} selected={data.healthConditions.includes(c)} onClick={() => handleMultiSelect('healthConditions', c)}>{c}</ChoiceButton>)}
                    <input name="otherCondition" placeholder="Outros" value={data.otherCondition} onChange={handleChange} className="w-full p-3 border rounded-lg" />
                </Step>;
            case 4: return <Step title="Experiência Física">
                <p className="text-text-secondary">Nível de Experiência</p>
                {['Iniciante', 'Intermediário', 'Avançado'].map(l => <ChoiceButton key={l} selected={data.experience === l} onClick={() => handleSelect('experience', l)}>{l}</ChoiceButton>)}
                <p className="text-text-secondary mt-4">Frequência Atual de Exercícios</p>
                {['0-1x/semana', '2-3x/semana', '4-5x/semana', '6-7x/semana'].map(f => <ChoiceButton key={f} selected={data.frequency === f} onClick={() => handleSelect('frequency', f)}>{f}</ChoiceButton>)}
                </Step>;
            case 5: return <Step title="Preferências de Treino">
                 <p className="text-text-secondary">Local</p>
                {['Casa', 'Academia'].map(l => <ChoiceButton key={l} selected={data.workoutLocation === l} onClick={() => handleSelect('workoutLocation', l)}>{l}</ChoiceButton>)}
                 <p className="text-text-secondary mt-4">Estilo</p>
                {['Força', 'Cardio', 'Misto'].map(s => <ChoiceButton key={s} selected={data.workoutStyle === s} onClick={() => handleSelect('workoutStyle', s)}>{s}</ChoiceButton>)}
            </Step>;
            case 6: return <Step title="Nutrição e Hábitos">
                <p className="text-text-secondary">Restrições Alimentares</p>
                {['Vegetariano', 'Vegano', 'Sem Glúten', 'Sem Lactose'].map(r => <ChoiceButton key={r} selected={data.dietaryRestrictions.includes(r)} onClick={() => handleMultiSelect('dietaryRestrictions', r)}>{r}</ChoiceButton>)}
                <input name="dislikedFoods" placeholder="Alimentos que não gosta" value={data.dislikedFoods} onChange={handleChange} className="w-full p-3 border rounded-lg mt-4" />
            </Step>;
            case 7: return <Step title="Estilo de Vida">
                <p className="text-text-secondary">Qualidade do Sono</p>
                {['Ruim', 'Média', 'Boa'].map(s => <ChoiceButton key={s} selected={data.sleepQuality === s} onClick={() => handleSelect('sleepQuality', s)}>{s}</ChoiceButton>)}
                <p className="text-text-secondary mt-4">Nível de Estresse</p>
                {['Baixo', 'Médio', 'Alto'].map(s => <ChoiceButton key={s} selected={data.stressLevel === s} onClick={() => handleSelect('stressLevel', s)}>{s}</ChoiceButton>)}
            </Step>;
            default: return null;
        }
    };
    
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-surface p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center text-text-primary mb-2">Configure seu Perfil</h1>
                <p className="text-center text-text-secondary mb-6">Passo {step} de {totalSteps}</p>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(step / totalSteps) * 100}%`, transition: 'width 0.3s' }}></div>
                </div>

                {renderStep()}

                <div className="flex justify-between mt-8">
                    <Button variant="secondary" onClick={prevStep} disabled={step === 1}>Anterior</Button>
                    {step < totalSteps ? (
                        <Button onClick={nextStep}>Próximo</Button>
                    ) : (
                        <Button onClick={handleSubmit}>Finalizar e Criar Plano</Button>
                    )}
                </div>
            </div>
        </div>
    );
};

const Step: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h2 className="text-2xl font-semibold text-text-primary mb-6 text-center">{title}</h2>
        <div className="space-y-4 flex flex-col items-center">{children}</div>
    </div>
);

const ChoiceButton: React.FC<{ selected: boolean; onClick: () => void; children: React.ReactNode }> = ({ selected, onClick, children }) => (
    <button
        onClick={onClick}
        className={`w-full max-w-sm text-left p-4 border rounded-lg transition-all duration-200 ${
            selected ? 'bg-primary text-white border-primary-focus ring-2 ring-primary' : 'bg-white hover:bg-gray-50'
        }`}
    >
        {children}
    </button>
);


export default OnboardingPage;
