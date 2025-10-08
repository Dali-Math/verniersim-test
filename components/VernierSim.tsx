'use client';

import { useState } from 'react';

export default function VernierSim() {
  const [vernierPosition, setVernierPosition] = useState(0);
  const [mode, setMode] = useState<'1/10' | '1/20' | '1/50'>('1/10');
  const [zoom, setZoom] = useState(1);

  // Configuration selon le mode
  const config = {
    '1/10': { divisions: 10, precision: 0.1 },
    '1/20': { divisions: 20, precision: 0.05 },
    '1/50': { divisions: 50, precision: 0.02 }
  }[mode];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Simulateur de Vernier
        </h1>
        
        {/* Conteneur SVG pour le vernier */}
        <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50">
          <svg
            viewBox="0 0 800 200"
            className="w-full h-auto"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
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
        </div>
      </div>
    </div>
  );
}
