
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Button, Input } from './UI';
import { LogoIcon } from './Icons';

type AuthView = 'login' | 'register';

const AuthPage: React.FC<{ initialView: AuthView }> = ({ initialView }) => {
    const [view, setView] = useState<AuthView>(initialView);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (view === 'register') {
            if (password !== confirmPassword) {
                setError('As senhas não coincidem.');
                return;
            }
            if (!register(email, password)) {
                setError('Usuário com este e-mail já existe.');
            } else {
                navigate('/onboarding');
            }
        } else {
            if (!login(email, password)) {
                setError('E-mail ou senha inválidos.');
            } else {
                navigate('/');
            }
        }
    };

    return (
        <div className="min-h-screen flex bg-background">
            {/* Form Column */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-text-primary">
                            {view === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta'}
                        </h2>
                        <p className="text-text-secondary mt-2">
                            {view === 'login' ? 'Faça login para continuar sua jornada.' : 'Comece sua jornada para uma vida mais saudável.'}
                        </p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input 
                            type="email" 
                            placeholder="seu@email.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input 
                            type="password" 
                            placeholder="Sua senha" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {view === 'register' && (
                            <Input 
                                type="password" 
                                placeholder="Confirme sua senha" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        )}
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <Button type="submit" className="w-full">
                            {view === 'login' ? 'Entrar' : 'Criar Conta'}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-text-secondary mt-6">
                        {view === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}
                        <button 
                            onClick={() => setView(view === 'login' ? 'register' : 'login')}
                            className="font-semibold text-primary hover:underline ml-1"
                        >
                            {view === 'login' ? 'Cadastre-se' : 'Faça login'}
                        </button>
                    </p>
                </div>
            </div>

            {/* Branding Column */}
            <div className="hidden lg:flex w-1/2 bg-primary text-white items-center justify-center p-12">
                <div className="text-center">
                    <LogoIcon className="h-16 w-16 mx-auto mb-6" />
                    <h1 className="text-4xl font-bold mb-4">FitBuilder Pro</h1>
                    <p className="text-xl text-indigo-200">
                        Sua jornada para uma vida mais saudável começa com um plano inteligente.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
