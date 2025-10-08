import VernierSim from '../components/VernierSim';

export default function Page() {
  return (
    <main className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-semibold text-center mb-6">VernierSim - Simulateur de Pied à Coulisse</h1>
      <VernierSim />
    </main>
  );
}
