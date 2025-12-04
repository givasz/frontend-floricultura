import { useState } from 'react';
import { Lock, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (username: string, password: string) => Promise<void>;
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin(username, password);
    } catch (err) {
      setError('Usuário ou senha incorretos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="mb-6">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[rgb(254,0,0)] transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para a página inicial
          </a>
        </div>

        <div className="flex items-center justify-center mb-8">
          <div className="w-16 h-16 bg-[rgb(254,0,0)] rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Painel Administrativo
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Flor de Maio
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(254,0,0)] focus:border-transparent"
              placeholder="Digite seu usuário"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[rgb(254,0,0)] focus:border-transparent"
              placeholder="Digite sua senha"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[rgb(254,0,0)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[rgb(220,0,0)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
