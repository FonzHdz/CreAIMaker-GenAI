export function DisclaimerBox() {
  return (
    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-5 mt-6">
      <h4 className="text-sm mb-2 text-yellow-900 flex items-center gap-2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path 
            d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round"
          />
        </svg>
        Aviso Importante - Uso Responsable de IA
      </h4>
      <p className="text-xs text-gray-700 leading-relaxed">
        <strong>CreAI Maker</strong> está diseñado como herramienta educativa y no para recolección de información personal sensible (PII). 
        Al usar IA Generativa, recuerda: (1) No ingreses datos confidenciales de estudiantes, (2) Verifica siempre la información generada, 
        (3) Cumple con las políticas institucionales de protección de datos (Ley 1581 de 2012), y (4) Fomenta el uso crítico y ético de la tecnología. 
        La UAO promueve la innovación responsable alineada con el PEI 2024 y los principios de sostenibilidad.
      </p>
    </div>
  );
}
