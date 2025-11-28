import { useState } from 'react';
import { Sparkles, Wrench, Heart } from 'lucide-react';
import { AgentAvatar } from './AgentAvatar';

interface ProjectCreationMapProps {
  onStartSection: (section: 'genia' | 'maker' | 'aps') => void;
  onBack: () => void;
  completedSections: {
    genia: boolean;
    maker: boolean;
    aps: boolean;
  };
}

export function ProjectCreationMap({ onStartSection, onBack, completedSections }: ProjectCreationMapProps) {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  
  // Determinar qué secciones están desbloqueadas
  const isGeniaUnlocked = true; // Siempre desbloqueado
  const isMakerUnlocked = completedSections.genia;
  const isApsUnlocked = completedSections.maker;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 5L7 10L12 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Volver al dashboard</span>
        </button>
      </div>

      {/* Map Container */}
      <div className="flex-1 flex items-center justify-center px-8 py-12">
        <div className="max-w-6xl w-full">
          {/* Title */}
          <div className="text-center mb-16">
            <h1 className="text-3xl mb-4">Bienvenido a tu nuevo proyecto</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {!completedSections.genia && (
                <>
                  Explora el mapa de tu guía interactiva. Comienza tu recorrido con <strong>Lina</strong>, 
                  tu asistente de IA Generativa, quien te ayudará a definir la base pedagógica de tu proyecto.
                </>
              )}
              {completedSections.genia && !completedSections.maker && (
                <>
                  ¡Excelente! Has completado la sección de <strong>IA Generativa</strong>. 
                  Ahora continúa con <strong>Juan</strong> para desarrollar prototipos y experiencias Maker.
                </>
              )}
              {completedSections.genia && completedSections.maker && !completedSections.aps && (
                <>
                  ¡Vas muy bien! Has completado GenIA y Maker. 
                  Ahora continúa con <strong>Doña Rosa</strong> para conectar tu proyecto con la comunidad.
                </>
              )}
              {completedSections.genia && completedSections.maker && completedSections.aps && (
                <>
                  ¡Felicitaciones! Has completado todo el recorrido. 
                  Puedes revisar cualquier sección o crear un nuevo proyecto.
                </>
              )}
            </p>
          </div>

          {/* SVG Map */}
          <div className="relative w-full h-96">
            <svg 
              viewBox="0 0 1000 400" 
              className="w-full h-full"
              style={{ filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05))' }}
            >
              {/* Path connecting the three sections */}
              <path
                d="M 150 200 Q 350 100, 500 200 T 850 200"
                stroke="#e2e8f0"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
              />
              
              {/* Path GenIA completed */}
              {completedSections.genia && (
                <>
                  <path
                    d="M 150 200 Q 350 100, 500 200"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 150 200 Q 350 100, 500 200"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="12 8"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="20"
                      to="0"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </path>
                </>
              )}
              
              {/* Animated path to next unlocked section */}
              {!completedSections.genia && (
                <path
                  d="M 150 200 Q 350 100, 500 200"
                  stroke="#3b82f6"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="12 8"
                  opacity="0.6"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="20"
                    to="0"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </path>
              )}
              
              {/* Path GenIA to Maker - animated when Maker is next */}
              {completedSections.genia && !completedSections.maker && (
                <path
                  d="M 500 200 Q 675 300, 850 200"
                  stroke="#f97316"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray="12 8"
                  opacity="0.6"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="20"
                    to="0"
                    dur="1s"
                    repeatCount="indefinite"
                  />
                </path>
              )}
              
              {/* Path Maker completed */}
              {completedSections.maker && (
                <>
                  <path
                    d="M 500 200 Q 675 300, 850 200"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 500 200 Q 675 300, 850 200"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="12 8"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="20"
                      to="0"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </path>
                </>
              )}

              {/* Section 1: GenIA (Lina) */}
              <g 
                className={isGeniaUnlocked ? "cursor-pointer transition-transform" : ""}
                style={{ 
                  transformOrigin: '150px 200px',
                  transform: hoveredSection === 'genia' ? 'scale(1.1)' : 'scale(1)'
                }}
                onMouseEnter={() => isGeniaUnlocked && setHoveredSection('genia')}
                onMouseLeave={() => setHoveredSection(null)}
                onClick={() => isGeniaUnlocked && onStartSection('genia')}
              >
                <circle 
                  cx="150" 
                  cy="200" 
                  r="60" 
                  fill={completedSections.genia ? "#d1fae5" : "#dbeafe"} 
                  stroke={completedSections.genia ? "#10b981" : "#3b82f6"}
                  strokeWidth="4"
                  className="transition-all"
                  style={{
                    filter: hoveredSection === 'genia' ? 'drop-shadow(0 8px 16px rgba(59, 130, 246, 0.3))' : 'none'
                  }}
                />
                {completedSections.genia && (
                  <g transform="translate(175, 175)">
                    <circle cx="0" cy="0" r="18" fill="#10b981" />
                    <path d="M -6 0 L -2 4 L 6 -4" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                )}
                <text 
                  x="150" 
                  y="295" 
                  textAnchor="middle" 
                  className="fill-blue-600 font-semibold"
                  fontSize="18"
                >
                  IA Generativa
                </text>
                <text 
                  x="150" 
                  y="315" 
                  textAnchor="middle" 
                  className="fill-gray-600"
                  fontSize="14"
                >
                  con Lina
                </text>
              </g>

              {/* Section 2: Maker (Juan) */}
              <g 
                opacity={isMakerUnlocked ? "1" : "0.4"}
                className={isMakerUnlocked ? "cursor-pointer transition-transform" : ""}
                style={{ 
                  transformOrigin: '500px 200px',
                  transform: hoveredSection === 'maker' ? 'scale(1.1)' : 'scale(1)'
                }}
                onMouseEnter={() => isMakerUnlocked && setHoveredSection('maker')}
                onMouseLeave={() => setHoveredSection(null)}
                onClick={() => isMakerUnlocked && onStartSection('maker')}
              >
                <circle 
                  cx="500" 
                  cy="200" 
                  r="60" 
                  fill={completedSections.maker ? "#d1fae5" : "#fed7aa"} 
                  stroke={completedSections.maker ? "#10b981" : "#f97316"}
                  strokeWidth="4"
                  className="transition-all"
                  style={{
                    filter: hoveredSection === 'maker' ? 'drop-shadow(0 8px 16px rgba(249, 115, 22, 0.3))' : 'none'
                  }}
                />
                {completedSections.maker && (
                  <g transform="translate(525, 175)">
                    <circle cx="0" cy="0" r="18" fill="#10b981" />
                    <path d="M -6 0 L -2 4 L 6 -4" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                )}
                <text 
                  x="500" 
                  y="295" 
                  textAnchor="middle" 
                  className="fill-orange-600 font-semibold"
                  fontSize="18"
                >
                  Cultura Maker
                </text>
                <text 
                  x="500" 
                  y="315" 
                  textAnchor="middle" 
                  className="fill-gray-600"
                  fontSize="14"
                >
                  con Juan
                </text>
                {/* Lock icon - solo si está bloqueado */}
                {!isMakerUnlocked && (
                  <g transform="translate(485, 185)">
                    <rect x="8" y="14" width="14" height="12" rx="2" fill="#94a3b8" />
                    <path d="M 10 14 L 10 10 Q 10 6, 15 6 Q 20 6, 20 10 L 20 14" stroke="#94a3b8" strokeWidth="2" fill="none"/>
                  </g>
                )}
              </g>

              {/* Section 3: ApS (Doña Rosa) */}
              <g 
                opacity={isApsUnlocked ? "1" : "0.4"}
                className={isApsUnlocked ? "cursor-pointer transition-transform" : ""}
                style={{ 
                  transformOrigin: '850px 200px',
                  transform: hoveredSection === 'aps' ? 'scale(1.1)' : 'scale(1)'
                }}
                onMouseEnter={() => isApsUnlocked && setHoveredSection('aps')}
                onMouseLeave={() => setHoveredSection(null)}
                onClick={() => isApsUnlocked && onStartSection('aps')}
              >
                <circle 
                  cx="850" 
                  cy="200" 
                  r="60" 
                  fill={completedSections.aps ? "#d1fae5" : "#ccfbf1"} 
                  stroke={completedSections.aps ? "#10b981" : "#14b8a6"}
                  strokeWidth="4"
                  className="transition-all"
                  style={{
                    filter: hoveredSection === 'aps' ? 'drop-shadow(0 8px 16px rgba(20, 184, 166, 0.3))' : 'none'
                  }}
                />
                {completedSections.aps && (
                  <g transform="translate(875, 175)">
                    <circle cx="0" cy="0" r="18" fill="#10b981" />
                    <path d="M -6 0 L -2 4 L 6 -4" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                )}
                <text 
                  x="850" 
                  y="295" 
                  textAnchor="middle" 
                  className="fill-teal-600 font-semibold"
                  fontSize="18"
                >
                  Aprendizaje en Servicio
                </text>
                <text 
                  x="850" 
                  y="315" 
                  textAnchor="middle" 
                  className="fill-gray-600"
                  fontSize="14"
                >
                  con Doña Rosa
                </text>
                {/* Lock icon - solo si está bloqueado */}
                {!isApsUnlocked && (
                  <g transform="translate(835, 185)">
                    <rect x="8" y="14" width="14" height="12" rx="2" fill="#94a3b8" />
                    <path d="M 10 14 L 10 10 Q 10 6, 15 6 Q 20 6, 20 10 L 20 14" stroke="#94a3b8" strokeWidth="2" fill="none"/>
                  </g>
                )}
              </g>

              {/* Avatar icons */}
              {/* Lina - Sparkles Icon */}
              <g transform="translate(135, 185)">
                <circle cx="15" cy="15" r="12" fill={completedSections.genia ? "#10b981" : "#3b82f6"} />
                <foreignObject x="7" y="7" width="16" height="16">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px' }}>
                    <Sparkles size={14} color="white" strokeWidth={2} />
                  </div>
                </foreignObject>
              </g>

              {/* Juan - Wrench Icon */}
              <g transform="translate(485, 185)">
                <circle cx="15" cy="15" r="12" fill={completedSections.maker ? "#10b981" : "#f97316"} opacity={isMakerUnlocked ? "1" : "0.5"} />
                <foreignObject x="7" y="7" width="16" height="16">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px' }}>
                    <Wrench size={14} color="white" strokeWidth={2} />
                  </div>
                </foreignObject>
              </g>

              {/* Doña Rosa - Heart Icon */}
              <g transform="translate(835, 185)">
                <circle cx="15" cy="15" r="12" fill={completedSections.aps ? "#10b981" : "#14b8a6"} opacity={isApsUnlocked ? "1" : "0.5"} />
                <foreignObject x="7" y="7" width="16" height="16">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '16px', height: '16px' }}>
                    <Heart size={14} color="white" strokeWidth={2} />
                  </div>
                </foreignObject>
              </g>
            </svg>
          </div>

          {/* Information Cards */}
          <div className="grid grid-cols-3 gap-6 mt-16">
            {/* Card 1: GenIA */}
            <div className={`bg-white border-2 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${
              completedSections.genia ? 'border-green-200' : 'border-blue-200'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  completedSections.genia ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {completedSections.genia ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10 L8 14 L16 6" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <Sparkles className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <h3 className={completedSections.genia ? "text-green-900" : "text-blue-900"}>IA Generativa</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Define los objetivos de aprendizaje y el contexto pedagógico de tu proyecto con ayuda de Lina.
              </p>
              <button
                onClick={() => onStartSection('genia')}
                className={`w-full px-4 py-2 rounded-lg transition-colors ${
                  completedSections.genia
                    ? 'bg-green-100 hover:bg-green-200 text-green-800'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {completedSections.genia ? 'Revisar sección' : 'Comenzar aquí'}
              </button>
            </div>

            {/* Card 2: Maker */}
            <div className={`bg-white border-2 rounded-xl p-6 shadow-sm transition-shadow ${
              !isMakerUnlocked ? 'opacity-60 border-gray-200' :
              completedSections.maker ? 'border-green-200 hover:shadow-md' : 'border-orange-200 hover:shadow-md'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  completedSections.maker ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  {completedSections.maker ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10 L8 14 L16 6" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <Wrench className="w-5 h-5 text-orange-600" />
                  )}
                </div>
                <h3 className={completedSections.maker ? "text-green-900" : "text-orange-900"}>Cultura Maker</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Diseña actividades prácticas y experiencias de aprendizaje activo con Juan.
              </p>
              <button
                onClick={() => isMakerUnlocked && onStartSection('maker')}
                disabled={!isMakerUnlocked}
                className={`w-full px-4 py-2 rounded-lg transition-colors ${
                  !isMakerUnlocked
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : completedSections.maker
                    ? 'bg-green-100 hover:bg-green-200 text-green-800'
                    : 'bg-orange-600 hover:bg-orange-700 text-white'
                }`}
              >
                {!isMakerUnlocked ? 'Bloqueado' : completedSections.maker ? 'Revisar sección' : 'Continuar aquí'}
              </button>
            </div>

            {/* Card 3: ApS */}
            <div className={`bg-white border-2 rounded-xl p-6 shadow-sm transition-shadow ${
              !isApsUnlocked ? 'opacity-60 border-gray-200' :
              completedSections.aps ? 'border-green-200 hover:shadow-md' : 'border-teal-200 hover:shadow-md'
            }`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  completedSections.aps ? 'bg-green-100' : 'bg-teal-100'
                }`}>
                  {completedSections.aps ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M4 10 L8 14 L16 6" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <Heart className="w-5 h-5 text-teal-600" />
                  )}
                </div>
                <h3 className={completedSections.aps ? "text-green-900" : "text-teal-900"}>Aprendizaje en Servicio</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Conecta tu proyecto con necesidades reales de la comunidad junto a Doña Rosa.
              </p>
              <button
                onClick={() => isApsUnlocked && onStartSection('aps')}
                disabled={!isApsUnlocked}
                className={`w-full px-4 py-2 rounded-lg transition-colors ${
                  !isApsUnlocked
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : completedSections.aps
                    ? 'bg-green-100 hover:bg-green-200 text-green-800'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                {!isApsUnlocked ? 'Bloqueado' : completedSections.aps ? 'Revisar sección' : 'Continuar aquí'}
              </button>
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            {!completedSections.genia && !completedSections.maker && !completedSections.aps && (
              <p className="text-sm text-gray-500">
                💡 Completa cada sección en orden para desbloquear la siguiente y construir un proyecto completo
              </p>
            )}
            {completedSections.genia && !completedSections.maker && (
              <p className="text-sm text-green-600">
                ✅ ¡Genial! Has completado IA Generativa. Ahora puedes continuar con Cultura Maker
              </p>
            )}
            {completedSections.genia && completedSections.maker && !completedSections.aps && (
              <p className="text-sm text-green-600">
                ✅ ¡Excelente progreso! Has completado 2 de 3 secciones. Continúa con Aprendizaje en Servicio
              </p>
            )}
            {completedSections.genia && completedSections.maker && completedSections.aps && (
              <p className="text-sm text-green-600">
                🎉 ¡Felicitaciones! Has completado todo el recorrido CreAI Maker
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
