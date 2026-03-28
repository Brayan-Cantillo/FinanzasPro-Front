import { useEffect, useState, type FormEvent } from 'react';
import {
  creditService,
  type CreditSimulation,
  type SimulatePayload,
} from '../services/creditService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';

export default function CreditSimulator() {
  const [simulations, setSimulations] = useState<CreditSimulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CreditSimulation | null>(null);
  const [form, setForm] = useState<SimulatePayload>({
    amount: 0,
    interestRate: 0,
    termMonths: 0,
  });

  const fetchSimulations = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await creditService.getAll();
      setSimulations(res.data);
    } catch {
      setError('Error al cargar las simulaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSimulations();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.interestRate || !form.termMonths) {
      setFormError('Todos los campos son obligatorios');
      return;
    }
    if (form.amount <= 0 || form.interestRate <= 0 || form.termMonths <= 0) {
      setFormError('Todos los valores deben ser mayores a 0');
      return;
    }
    setFormError('');
    setSubmitting(true);
    try {
      const res = await creditService.simulate(form);
      setResult(res.data);
      setSimulations((prev) => [res.data, ...prev]);
    } catch {
      setFormError('Error al simular el crédito');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTake = async (id: number) => {
    if (!confirm('¿Deseas tomar este crédito?')) return;
    try {
      const res = await creditService.take(id);
      setSimulations((prev) => prev.map((s) => (s.id === id ? res.data : s)));
    } catch {
      setError('Error al tomar el crédito');
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Simulador de Crédito</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Simular crédito</h2>
          {formError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
              {formError}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
              <input
                type="number"
                value={form.amount || ''}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Ej: 10000000"
                min="0"
                step="any"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tasa de interés anual (%)</label>
              <input
                type="number"
                value={form.interestRate || ''}
                onChange={(e) => setForm({ ...form, interestRate: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Ej: 12"
                min="0"
                step="any"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plazo (meses)</label>
              <input
                type="number"
                value={form.termMonths || ''}
                onChange={(e) => setForm({ ...form, termMonths: Number(e.target.value) })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                placeholder="Ej: 24"
                min="1"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Simulando...' : 'Simular'}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Resultado</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Monto:</span>
                <span className="font-semibold">{formatCurrency(result.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tasa de interés:</span>
                <span className="font-semibold">{result.interestRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Plazo:</span>
                <span className="font-semibold">{result.termMonths} meses</span>
              </div>
              <hr />
              <div className="flex justify-between">
                <span className="text-gray-700 font-medium">Cuota mensual:</span>
                <span className="text-xl font-bold text-indigo-600">
                  {formatCurrency(result.monthlyPayment)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <h2 className="text-lg font-semibold text-gray-800 mb-4">Historial de simulaciones</h2>

      {error && <ErrorAlert message={error} onRetry={fetchSimulations} />}

      {loading ? (
        <LoadingSpinner />
      ) : simulations.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No hay simulaciones aún</p>
          <p className="text-sm">Usa el formulario para simular tu primer crédito</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Monto</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Interés</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Plazo</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Cuota mensual</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {simulations.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">{formatCurrency(s.amount)}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{s.interestRate}%</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{s.termMonths} meses</td>
                  <td className="px-6 py-4 text-sm font-semibold text-indigo-600">
                    {formatCurrency(s.monthlyPayment)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                        s.taken ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {s.taken ? 'Tomado' : 'Simulado'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {!s.taken && (
                      <button
                        onClick={() => handleTake(s.id)}
                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition cursor-pointer"
                      >
                        Tomar crédito
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
