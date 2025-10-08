export default function QuizPage() {
  return (
    <main className="p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Quiz Vernier</h1>
      <p>Quelle est la valeur lue sur le vernier ci-dessous ?</p>
      {/* Ici on intégrerait VernierSim en mode "quiz" avec une valeur cible */}
      <form className="flex items-center gap-2">
        <input type="number" step="0.01" placeholder="Réponse (mm)" className="input input-bordered px-3 py-2 rounded border w-40" />
        <button type="button" className="px-3 py-2 bg-brand text-white rounded">Vérifier</button>
      </form>
      <div className="text-sm text-neutral-600">Astuce: utilisez le zoom/loupe pour plus de précision.</div>
    </main>
  )
}
