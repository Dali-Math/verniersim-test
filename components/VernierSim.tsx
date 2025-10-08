'use client';

import { useState, useRef, useEffect } from 'react';

export default function VernierSim() {
  const [vernierPosition, setVernierPosition] = useState(0);
  const [mode, setMode] = useState<'1/10' | '1/20' | '1/50'>('1/10');
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [targetValue, setTargetValue] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [quizOn, setQuizOn] = useState(false);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const vernierRef = useRef<SVGGElement>(null);

  // Configuration selon le mode
  const config = {
    '1/10': { divisions: 10, precision: 0.1 },
    '1/20': { divisions: 20, precision: 0.05 },
    '1/50': { divisions: 50, precision: 0.02 }
  }[mode];

  // Gestion du drag - souris
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX - vernierPosition);
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const newPosition = e.clientX - dragStart;
    setVernierPosition(Math.max(0, Math.min(newPosition, 700)));
  };
  const handleMouseUp = () => setIsDragging(false);

  // Gestion du drag - tactile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientX - vernierPosition);
  };
  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    const newPosition = e.touches[0].clientX - dragStart;
    setVernierPosition(Math.max(0, Math.min(newPosition, 700)));
  };
  const handleTouchEnd = () => setIsDragging(false);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, dragStart]);

  // Calculer la mesure en mm approximative (démo)
  const measurement = Number((vernierPosition / 5).toFixed(2));

  // Correction pédagogique
  const checkAnswer = () => {
    if (targetValue === null) return;
    const error = Math.abs(measurement - targetValue);
    const ok = error <= config.precision + 0.01; // tolérance légère
    setFeedback(
      ok
        ? `Bravo ! Erreur ${error.toFixed(2)} mm (≤ précision ${config.precision} mm).`
        : `Pas encore. Écart ${error.toFixed(2)} mm. Astuce: aligne la graduation du vernier qui coïncide.`
    );
    if (quizOn) {
      setQuizScore(s => ({ correct: s.correct + (ok ? 1 : 0), total: s.total + 1 }));
      // poser une nouvelle cible automatiquement
      setTargetValue(Number((Math.random() * 70 + 5).toFixed(2)));
    }
  };

  const newTarget = () => {
    setTargetValue(Number((Math.random() * 70 + 5).toFixed(2)));
    setFeedback('');
  };

  const toggleQuiz = () => {
    setQuizOn(v => !v);
    setQuizScore({ correct: 0, total: 0 });
    setFeedback('');
    setTargetValue(Number((Math.random() * 70 + 5).toFixed(2)));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-gray-800">
          Simulateur de Vernier
        </h1>

        {/* Boutons de mode */}
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {(['1/10','1/20','1/50'] as const).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`px-3 md:px-4 py-2 rounded-lg font-semibold transition-colors ${
                mode === m ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Mode {m}
            </button>
          ))}
        </div>

        {/* Contrôles de zoom */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button onClick={() => setZoom(Math.max(0.5, +(zoom - 0.1).toFixed(2)))} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold">🔍-</button>
          <span className="font-semibold text-gray-700">Zoom: {(zoom * 100).toFixed(0)}%</span>
          <button onClick={() => setZoom(Math.min(2, +(zoom + 0.1).toFixed(2)))} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold">🔍+</button>
        </div>

        {/* Objectif / Quiz */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <button onClick={newTarget} className="px-3 py-2 bg-emerald-600 text-white rounded-lg">Nouvelle cible</button>
            <button onClick={checkAnswer} className="px-3 py-2 bg-indigo-600 text-white rounded-lg">Vérifier</button>
            <button onClick={toggleQuiz} className={`px-3 py-2 rounded-lg ${quizOn ? 'bg-rose-600 text-white' : 'bg-gray-200'}`}>{quizOn ? 'Quitter le Quiz' : 'Quiz auto'}</button>
          </div>
          <div className="text-sm text-gray-700">
            {targetValue !== null ? `Cible: ${targetValue.toFixed(2)} mm` : 'Pas de cible'}
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="mb-4 p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-900">
            {feedback}
          </div>
        )}

        {/* Conteneur SVG pour le vernier */}
        <div className="border-2 border-gray-300 rounded-lg p-2 md:p-4 bg-gray-50 overflow-x-auto">
          <svg viewBox="0 0 800 200" className="w-full h-auto" style={{ transform: `scale(${zoom})`, transformOrigin: 'center', minWidth: '800px' }}>
            {/* Règle principale (échelle fixe) */}
            <g id="main-ruler">
              <line x1="50" y1="80" x2="750" y2="80" stroke="#000" strokeWidth="2" />
              {Array.from({ length: 15 }, (_, i) => (
                <g key={`main-${i}`}>
                  <line x1={50 + i * 50} y1="80" x2={50 + i * 50} y2="50" stroke="#000" strokeWidth="2" />
                  <text x={50 + i * 50} y="45" textAnchor="middle" fontSize="14" fontWeight="bold">{i}</text>
                </g>
              ))}
              {Array.from({ length: 140 }, (_, i) => i % 10 !== 0 ? (
                <line key={`sub-${i}`} x1={50 + i * 5} y1="80" x2={50 + i * 5} y2={i % 5 === 0 ? 60 : 70} stroke="#000" strokeWidth="1" />
              ) : null)}
            </g>

            {/* Vernier mobile (curseur) */}
            <g
              ref={vernierRef}
              id="vernier"
              transform={`translate(${50 + vernierPosition}, 0)`}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              <rect x="0" y="85" width="100" height="50" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="2" rx="4" />
              <line x1="0" y1="85" x2="0" y2="135" stroke="#ef4444" strokeWidth="3" />
              {Array.from({ length: config.divisions + 1 }, (_, i) => (
                <line key={`vernier-${i}`} x1={i * (100 / config.divisions)} y1="110" x2={i * (100 / config.divisions)} y2="120" stroke="#1e40af" strokeWidth="1" />
              ))}
              <circle cx="50" cy="110" r="15" fill="#3b82f6" opacity="0.7" />
              <text x="50" y="115" textAnchor="middle" fontSize="12" fill="white" fontWeight="bold">↔</text>
            </g>
          </svg>
        </div>

        {/* Info de mesure */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-base md:text-lg font-semibold text-gray-800">Mode actuel : <span className="text-blue-600">{mode}</span></p>
          <p className="text-sm text-gray-600 mt-1">Précision : {config.precision} mm</p>
          <p className="text-lg md:text-xl font-bold text-gray-900 mt-2">Mesure : <span className="text-green-600">{measurement.toFixed(2)} mm</span></p>
          {quizOn && (
            <p className="text-sm text-gray-600 mt-1">Score Quiz: {quizScore.correct}/{quizScore.total}</p>
          )}
        </div>
      </div>
    </div>
  );
}
