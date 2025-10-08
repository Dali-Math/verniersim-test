'use client';

import { useState, useRef, useEffect } from 'react';

export default function VernierSim() {
  const [vernierPosition, setVernierPosition] = useState(0);
  const [mode, setMode] = useState<'1/10' | '1/20' | '1/50'>('1/10');
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Event listeners
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

  // Calculer la mesure
  const measurement = (vernierPosition / 50 * 10).toFixed(1);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Simulateur de Vernier
        </h1>
        
        {/* Conteneur SVG pour le vernier */}
        <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 overflow-x-auto">
          <svg
            viewBox="0 0 800 200"
            className="w-full h-auto"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center', minWidth: '800px' }}
          >
            {/* Règle principale (échelle fixe) */}
            <g id="main-ruler">
              {/* Ligne de base */}
              <line x1="50" y1="80" x2="750" y2="80" stroke="#000" strokeWidth="2" />
              
              {/* Graduations principales (cm) */}
              {Array.from({ length: 15 }, (_, i) => (
                <g key={`main-${i}`}>
                  <line
                    x1={50 + i * 50}
                    y1="80"
                    x2={50 + i * 50}
                    y2="50"
                    stroke="#000"
                    strokeWidth="2"
                  />
                  <text
                    x={50 + i * 50}
                    y="45"
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    {i}
                  </text>
                </g>
              ))}
              
              {/* Graduations intermédiaires (mm) */}
              {Array.from({ length: 140 }, (_, i) => {
                if (i % 10 !== 0) {
                  return (
                    <line
                      key={`sub-${i}`}
                      x1={50 + i * 5}
                      y1="80"
                      x2={50 + i * 5}
                      y2={i % 5 === 0 ? 60 : 70}
                      stroke="#000"
                      strokeWidth="1"
                    />
                  );
                }
                return null;
              })}
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
              {/* Rectangle du vernier */}
              <rect
                x="0"
                y="85"
                width="100"
                height="50"
                fill="rgba(59, 130, 246, 0.3)"
                stroke="#3b82f6"
                strokeWidth="2"
                rx="4"
              />
              
              {/* Ligne de référence du vernier */}
              <line
                x1="0"
                y1="85"
                x2="0"
                y2="135"
                stroke="#ef4444"
                strokeWidth="3"
              />
              
              {/* Graduations du vernier */}
              {Array.from({ length: config.divisions + 1 }, (_, i) => (
                <line
                  key={`vernier-${i}`}
                  x1={i * (100 / config.divisions)}
                  y1="110"
                  x2={i * (100 / config.divisions)}
                  y2="120"
                  stroke="#1e40af"
                  strokeWidth="1"
                />
              ))}
              
              {/* Poignée de déplacement */}
              <circle
                cx="50"
                cy="110"
                r="15"
                fill="#3b82f6"
                opacity="0.7"
              />
              <text
                x="50"
                y="115"
                textAnchor="middle"
                fontSize="12"
                fill="white"
                fontWeight="bold"
              >
                ↔
              </text>
            </g>
          </svg>
        </div>

        {/* Info de mesure */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-lg font-semibold text-gray-800">
            Mode actuel : <span className="text-blue-600">{mode}</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Précision : {config.precision} mm
          </p>
          <p className="text-xl font-bold text-gray-900 mt-2">
            Mesure : <span className="text-green-600">{measurement} mm</span>
          </p>
        </div>
      </div>
    </div>
  );
}
