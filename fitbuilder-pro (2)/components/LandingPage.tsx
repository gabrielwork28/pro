
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './UI';
import { LogoIcon, DumbbellIcon, PlateIcon, ScanIcon, WrenchIcon } from './Icons';

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm shadow-sm">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <LogoIcon className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-text-primary">FitBuilder Pro</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="font-semibold text-text-secondary hover:text-primary transition">
            Login
          </button>
          <Button onClick={() => navigate('/register')}>Criar Conta</Button>
        </div>
      </nav>
    </header>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
    <div className="bg-surface p-6 rounded-xl border border-border text-center flex flex-col items-center shadow-sm transform hover:-translate-y-2 transition-transform duration-300">
        <div className="bg-secondary p-4 rounded-full mb-4 text-primary">{icon}</div>
        <h3 className="text-xl font-bold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary">{description}</p>
    </div>
);

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="bg-background min-h-screen text-text-primary">
            <Header />

            <main>
                {/* Hero Section */}
                <section className="pt-32 pb-20 text-center bg-white">
                    <div className="container mx-auto px-6">
                        <h1 className="text-5xl md:text-6xl font-extrabold text-text-primary leading-tight mb-4">
                            Alcance seus objetivos com um plano <span className="text-primary">criado por IA</span> para você
                        </h1>
                        <p className="text-lg text-text-secondary max-w-3xl mx-auto mb-8">
                            FitBuilder Pro usa inteligência artificial para criar planos de treino e dieta totalmente personalizados, ajudando você a alcançar seus objetivos de forma mais rápida e eficiente.
                        </p>
                        <Button onClick={() => navigate('/register')} className="px-10 py-4 text-lg">
                            Criar Minha Conta e Começar
                        </Button>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20">
                    <div className="container mx-auto px-6">
                        <h2 className="text-4xl font-bold text-center text-text-primary mb-12">Funcionalidades Inteligentes</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <FeatureCard 
                                icon={<DumbbellIcon />}
                                title="Planos com IA"
                                description="Receba planos de treino e dieta personalizados que se adaptam ao seu progresso e feedback."
                            />
                            <FeatureCard 
                                icon={<ScanIcon />}
                                title="Scanner de Alimentos"
                                description="Tire uma foto da sua refeição e obtenha uma análise nutricional instantânea e recomendações."
                            />
                            <FeatureCard 
                                icon={<PlateIcon />}
                                title="Acompanhamento de Progresso"
                                description="Visualize sua evolução com gráficos detalhados de peso, medidas e consistência de hábitos."
                            />
                            <FeatureCard 
                                icon={<WrenchIcon />}
                                title="Ferramentas Úteis"
                                description="Acesse calculadoras, cronômetros e planners para otimizar ainda mais sua jornada fitness."
                            />
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-8 bg-surface border-t border-border">
                <div className="container mx-auto px-6 text-center text-text-secondary">
                    <p>&copy; {new Date().getFullYear()} FitBuilder Pro. Todos os direitos reservados.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
