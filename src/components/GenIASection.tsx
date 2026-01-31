import { useState, useEffect } from "react";
import { LinaAvatar } from "./LinaAvatar";
import { LinaContextForm } from "./LinaContextForm";
import {
  AgentChatInterface,
  ChatMessage,
} from "./AgentChatInterface";
import {
  DocumentPanel,
  DocumentSection,
} from "./DocumentPanel";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Lightbulb,
  Zap,
} from "lucide-react";
import {
  type ComponenteCurricular,
  type Competencia,
  type NivelDesempeno,
} from "../data/unidades";
import { Button } from "./ui/button";
import { DisclaimerBox } from "./DisclaimerBox";

interface GenIASectionProps {
  onComplete: (data: { theme?: string; numStudents?: string; unidadAcademica?: string }) => void;
  onBack: () => void;
}

type Screen = "context" | "introduction" | "chat";

type LinaDocUpdate = {
  sectionId: 'tema' | 'objetivos' | 'metodologia' | 'criterios' | 'recursos' | 'context' | 'reset';
  title: string;
  content: string;
};

type LinaResponse = {
  reply?: string;
  output?: string;
  doc_update?: LinaDocUpdate;
  next_step?: 'tema' | 'objetivos' | 'metodologia' | 'criterios' | 'recursos' | 'completo';
};

interface CurricularContext {
  unidadAcademica: string;
  componenteCurricular: string;
  competenciasPrincipales: string[];
  nivelDesempeno: string;
  nivelesFormacion: string[];
  resultadosAprendizaje: string[];
  criteriosEvaluacion: string[];
  conocimientosProposicionales: string;
  conocimientosFuncionales: string;
  conocimientosAxiologicos: string;
  dedicacionHoraria: string;
  numEstudiantes: string;
  duracionActividad: string;
  semestreAcademico: string;
  condicionesEspeciales: string;
  vinculacionSocial: string;
  datosAdicionales: string;

  // 🔹 NUEVO: descripción del nivel, tomada del JSON (descripcion_desempeño)
  descripcionDesempeno: string;
}

export function GenIASection({
  onComplete,
  onBack,
}: GenIASectionProps) {
  const [currentScreen, setCurrentScreen] =
    useState<Screen>("introduction");
  const [curricularContext, setCurricularContext] =
    useState<CurricularContext | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(
    [],
  );
  const [isTyping, setIsTyping] = useState(false);
  const [documentSections, setDocumentSections] = useState<
    DocumentSection[]
  >([]);
  const [hasPendingChanges, setHasPendingChanges] =
    useState(false);
  const [activityTheme, setActivityTheme] = useState("");
  const [currentStep, setCurrentStep] = useState<'tema' | 'objetivos' | 'metodologia' | 'criterios' | 'recursos' | 'completo'>('tema');
  const [sessionId, setSessionId] = useState<string>(() => crypto.randomUUID());

  useEffect(() => {
    if (currentScreen === "introduction") {
      setSessionId(crypto.randomUUID());
    }
  }, [currentScreen]);

  const handleContextComplete = (context: CurricularContext) => {
    setCurricularContext(context);
    setCurrentScreen("chat");
  
    // Helpers para formatear listas
    const formatList = (label: string, items?: string[]) => {
      if (!items || items.length === 0) return "";
      return `${label}:\n${items.map((item, i) => `  - ${item}`).join("\n")}\n\n`;
    };
  
    const formatStringList = (label: string, value?: string) => {
      if (!value || !value.trim()) return "";
      const items = value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      if (items.length === 0) return "";
      return formatList(label, items);
    };
  
    const contextSection: DocumentSection = {
      id: "context",
      title: "Contexto Curricular",
      content: `Unidad Académica: ${context.unidadAcademica}
  Componente Curricular: ${context.componenteCurricular}
  Semestre de los estudiantes: ${context.nivelesFormacion.join(", ")}
  
  Competencia seleccionada: ${context.competenciasPrincipales}

  Nivel de desempeño: ${context.nivelDesempeno}
  Descripción del nivel: ${context.descripcionDesempeno}
  
  ${formatList("Resultados de aprendizaje", context.resultadosAprendizaje)}${formatList("Criterios de evaluación", context.criteriosEvaluacion)}${formatStringList("Conocimientos proposicionales", context.conocimientosProposicionales)}${formatStringList("Conocimientos funcionales", context.conocimientosFuncionales)}${formatStringList("Conocimientos axiológicos", context.conocimientosAxiologicos)}
  Dedicación horaria estimada: ${context.dedicacionHoraria || "No registrada"}
  Número de estudiantes: ${context.numEstudiantes || "No registrado"}
  Duración de la actividad: ${context.duracionActividad || "No registrada"}
  Condiciones especiales: ${context.condicionesEspeciales || "No registradas"}
  Vinculación social: ${context.vinculacionSocial || "No registrada"}
  Datos adicionales: ${context.datosAdicionales || "No registrados"}
  `,
      status: "confirmed",
      lastUpdated: new Date().toLocaleString(),
    };
  
    setDocumentSections([contextSection]);
  
    // Mensaje inicial de Lina
    const linaGreeting: ChatMessage = {
      id: "lina-greeting",
      from: "agent",
      message: `¡Hola! Soy Lina. Ya tengo tu contexto curricular para ${context.unidadAcademica}. Ahora cuéntame: ¿sobre qué tema quieres que diseñemos una actividad con IA Generativa?`,
      timestamp: new Date().toLocaleTimeString("es-CO", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  
    setChatHistory([linaGreeting]);
  };  

  const handleContinueToContext = () => {
    setCurrentScreen("context");
  };

  const handleSendMessage = async (message: string): Promise<string> => {
    const timestamp = new Date().toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  
    const userMessage: ChatMessage = {
      id: `${Date.now()}-${Math.random()}`,
      from: "user",
      message,
      timestamp,
    };
    setChatHistory((prev) => [...prev, userMessage]);
    setIsTyping(true);
  
    try {
      const payload = {
        message,
        sessionId,
        curricularContext,
        currentStep
      };
  
      const res = await fetch("http://localhost:5678/webhook/lina-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
  
      console.log("Respuesta n8n status:", res.status);
      const rawText = await res.text();
      console.log("Respuesta n8n raw:", rawText);
  
      if (!res.ok) {
        throw new Error(`Error HTTP ${res.status}: ${rawText}`);
      }
  
      let replyText: string;
  
      if (!rawText.trim()) {
        replyText =
          "Lina no pudo interpretar la respuesta del agente en n8n (respuesta vacía).";
      } else {
        try {
          const data = JSON.parse(rawText) as LinaResponse;
          replyText =
            data.reply ??
            data.output ??
            "Lina no pudo interpretar la respuesta del agente en n8n.";
          
          // Aplicar actualización del documento si existe
          if (data.doc_update?.sectionId) {
            if (data.doc_update.sectionId === "reset") {
              setDocumentSections((prev) => {
                const contextSection = prev.find((s) => s.id === "context");
                return contextSection ? [contextSection] : [];
              });
              setHasPendingChanges(false);
            } else if (data.doc_update.title && data.doc_update.content) {
            const newSection: DocumentSection = {
              id: data.doc_update.sectionId,
              title: data.doc_update.title,
              content: data.doc_update.content,
              status: "draft",
              lastUpdated: new Date().toLocaleString(),
            };

            setDocumentSections((prev) => {
              // Mantener el contexto al inicio si existe
              const contextSection = prev.find((s) => s.id === "context");
              const rest = prev.filter((s) => s.id !== "context");

              // Buscar si ya existe una sección con este ID
              const idx = rest.findIndex((s) => s.id === newSection.id);
              const updatedRest =
                idx >= 0
                  ? rest.map((s, i) => (i === idx ? newSection : s))
                  : [...rest, newSection];

              return contextSection ? [contextSection, ...updatedRest] : updatedRest;
            });

            setHasPendingChanges(true);
            }
          }

          // Actualizar el paso actual si se especifica
          if (data.next_step) {
            setCurrentStep(data.next_step);
          }
        } catch (e) {
          console.warn("Respuesta no es JSON, usando texto plano:", e);
          replyText = rawText;
        }
      }
  
      const agentMessage: ChatMessage = {
        id: `${Date.now()}-${Math.random()}`,
        from: "agent",
        message: replyText,
        timestamp: new Date().toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
  
      setChatHistory((prev) => [...prev, agentMessage]);
      return replyText;
    } catch (error) {
      console.error("Error llamando al webhook de n8n:", error);
      const errorMsg =
        "Hubo un problema al conectarme con el agente en n8n desde CreAI Maker.";
  
      const agentMessage: ChatMessage = {
        id: `${Date.now()}-${Math.random()}`,
        from: "agent",
        message: errorMsg,
        timestamp: new Date().toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
  
      setChatHistory((prev) => [...prev, agentMessage]);
      return errorMsg;
    } finally {
      setIsTyping(false);
    }
  };
  
  
  const handleConfirmChanges = () => {
    setDocumentSections((prev) =>
      prev.map((section) => ({
        ...section,
        status: "confirmed" as const,
        lastUpdated: new Date().toLocaleString(),
      })),
    );
    setHasPendingChanges(false);
  };

  // DEV MODE: Auto-fill all questions
  const handleDevAutoFill = async () => {
    const devTheme =
      "Inteligencia Artificial en la Educación Superior";
    setActivityTheme(devTheme);

    const devMessages: ChatMessage[] = [
      {
        id: "1",
        from: "user",
        message: `Quiero diseñar una actividad sobre ${devTheme}`,
        timestamp: new Date().toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      {
        id: "2",
        from: "agent",
        message: `Excelente elección trabajar con "${devTheme}". Basándome en tu contexto curricular para ${curricularContext?.unidadAcademica}, te propongo una actividad que integra IA Generativa de manera efectiva.\n\n¿Te gustaría que detalle los objetivos de aprendizaje específicos o prefieres que profundice en las herramientas de IA que podrían utilizarse?`,
        timestamp: new Date().toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      {
        id: "3",
        from: "user",
        message:
          "Detalla los objetivos de aprendizaje por favor",
        timestamp: new Date().toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      {
        id: "4",
        from: "agent",
        message: `Perfecto. Para la actividad sobre "${devTheme}", propongo estos objetivos de aprendizaje:\n\n1. **Objetivo Conceptual**: Los estudiantes comprenderán los fundamentos de ${devTheme} mediante el análisis crítico de contenido generado por IA.\n\n2. **Objetivo Procedimental**: Los estudiantes aplicarán herramientas de IA generativa (como ChatGPT, Claude, o DALL-E) para crear materiales educativos relacionados con ${devTheme}.\n\n3. **Objetivo Actitudinal**: Los estudiantes desarrollarán una postura crítica sobre el uso ético y responsable de la IA en su campo de estudio.\n\n¿Deseas ajustar alguno de estos objetivos o continuamos con la metodología?`,
        timestamp: new Date().toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      {
        id: "5",
        from: "user",
        message: "Continuemos con la metodología",
        timestamp: new Date().toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      {
        id: "6",
        from: "agent",
        message: `Para implementar esta actividad sobre "${devTheme}", sugiero la siguiente metodología:\n\n**Fase 1 - Exploración (30 min)**\nLos estudiantes usarán ChatGPT o Claude para:\n- Generar preguntas de investigación sobre ${devTheme}\n- Crear mapas conceptuales\n- Explorar diferentes perspectivas del tema\n\n**Fase 2 - Creación (45 min)**\nTrabajo en equipos usando herramientas de IA para:\n- Generar contenido educativo (infografías, resúmenes)\n- Crear casos de estudio o ejemplos prácticos\n- Diseñar actividades de evaluación\n\n**Fase 3 - Evaluación Crítica (30 min)**\nAnálisis reflexivo donde los estudiantes:\n- Verifican la precisión del contenido generado\n- Identifican sesgos o limitaciones de la IA\n- Proponen mejoras basadas en su conocimiento\n\n¿Te parece bien esta estructura o prefieres modificar alguna fase?`,
        timestamp: new Date().toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      {
        id: "7",
        from: "user",
        message:
          "Me parece bien, ahora explica los criterios de evaluación",
        timestamp: new Date().toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      {
        id: "8",
        from: "agent",
        message: `Excelente pregunta. Para evaluar esta actividad con IA Generativa, propongo los siguientes criterios:\n\n**Criterios de Evaluación:**\n\n1. **Uso efectivo de IA (30%)**\n   - Calidad de los prompts utilizados\n   - Diversidad de herramientas empleadas\n   - Aprovechamiento de las capacidades de la IA\n\n2. **Pensamiento crítico (40%)**\n   - Análisis de las respuestas de la IA\n   - Identificación de fortalezas y limitaciones\n   - Mejoras propuestas al contenido generado\n\n3. **Producto final (30%)**\n   - Calidad y utilidad del material creado\n   - Alineación con ${curricularContext?.competenciaPrincipal}\n   - Presentación y comunicación de resultados\n\n¿Necesitas que ajustemos algún criterio o porcentaje?`,
        timestamp: new Date().toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];

    setChatHistory(devMessages);

    const devSections: DocumentSection[] = [
      {
        id: "activity-theme",
        title: "Tema de la Actividad",
        content: `Tema seleccionado: ${devTheme}\n\nLa actividad se enfocará en aplicar IA Generativa para explorar y profundizar en este tema, alineado con la competencia "${curricularContext?.competenciaPrincipal}".`,
        status: "confirmed",
        lastUpdated: new Date().toLocaleString(),
      },
      {
        id: "learning-objectives",
        title: "Objetivos de Aprendizaje",
        content: `1. Objetivo Conceptual: Comprender los fundamentos de ${devTheme} mediante análisis crítico de contenido generado por IA.\n\n2. Objetivo Procedimental: Aplicar herramientas de IA generativa para crear materiales educativos relacionados con ${devTheme}.\n\n3. Objetivo Actitudinal: Desarrollar postura crítica sobre el uso ético y responsable de la IA en el campo de estudio.`,
        status: "confirmed",
        lastUpdated: new Date().toLocaleString(),
      },
      {
        id: "methodology",
        title: "Metodología",
        content: `Fase 1 - Exploración (30 min):\n- Generación de preguntas de investigación con ChatGPT/Claude\n- Creación de mapas conceptuales\n- Exploración de perspectivas sobre ${devTheme}\n\nFase 2 - Creación (45 min):\n- Generación de contenido educativo (infografías, resúmenes)\n- Creación de casos de estudio\n- Diseño de actividades de evaluación\n\nFase 3 - Evaluación Crítica (30 min):\n- Verificación de precisión del contenido\n- Identificación de sesgos y limitaciones\n- Propuestas de mejora`,
        status: "confirmed",
        lastUpdated: new Date().toLocaleString(),
      },
      {
        id: "evaluation",
        title: "Criterios de Evaluación",
        content: `1. Uso efectivo de IA (30%):\n   - Calidad de los prompts utilizados\n   - Diversidad de herramientas empleadas\n   - Aprovechamiento de capacidades de la IA\n\n2. Pensamiento crítico (40%):\n   - Análisis de respuestas de la IA\n   - Identificación de fortalezas y limitaciones\n   - Mejoras propuestas al contenido\n\n3. Producto final (30%):\n   - Calidad y utilidad del material creado\n   - Alineación con competencias\n   - Presentación y comunicación`,
        status: "confirmed",
        lastUpdated: new Date().toLocaleString(),
      },
    ];

    setDocumentSections((prev) => {
      const contextSection = prev.find(
        (s) => s.id === "context",
      );
      return contextSection
        ? [contextSection, ...devSections]
        : devSections;
    });

    setHasPendingChanges(false);
  };

  // Screen 2: Context Form
  if (currentScreen === "context") {
    return (
      <LinaContextForm
        onComplete={handleContextComplete}
        onBack={() => setCurrentScreen("introduction")}
      />
    );
  }

  // Screen 1: Introduction to GenIA (FIRST SCREEN)
  if (currentScreen === "introduction") {
    return (
      <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
        {/* Left Panel - Lina Avatar */}
        <div className="w-80 bg-gray-900 flex flex-col items-center justify-center p-8 shadow-2xl">
          <LinaAvatar emotion="welcoming" className="w-64" />
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
              <Sparkles size={16} />
              Lina - Asistente GenIA
            </div>
          </div>
        </div>

        {/* Right Panel - Content */}
        <div className="flex-1 overflow-auto h-full">
          <div className="max-w-4xl mx-auto p-12 h-full">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8"
            >
              <ArrowLeft size={20} />
              <span>Volver al mapa</span>
            </button>

            <div className="animate-fadeIn">
              <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-lg mb-8">
                <p className="text-lg leading-relaxed text-gray-800">
                  ¡Bienvenido a la ruta de <strong>IA Generativa</strong>! 
                  Antes de comenzar, exploraremos juntos qué significa la IA Generativa 
                  y cómo puede aplicarse de forma responsable en tus clases.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
                <h3 className="text-2xl mb-6 text-purple-900">
                  ¿Qué es la IA Generativa?
                </h3>

                <div className="prose max-w-none space-y-6">
                  <div className="flex items-start gap-4 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sparkles
                        className="text-white"
                        size={24}
                      />
                    </div>
                    <div>
                      <h4 className="text-lg mb-2">
                        Definición
                      </h4>
                      <p className="text-gray-700">
                        La IA Generativa es una rama de la
                        inteligencia artificial que puede crear
                        contenido nuevo y original como texto,
                        imágenes, audio, código y más, basándose
                        en patrones aprendidos de grandes
                        volúmenes de datos.
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-6 border-2 border-blue-200 rounded-lg">
                      <h4 className="text-lg mb-3 flex items-center gap-2">
                        <span className="text-2xl">💡</span>
                        Aplicaciones educativas
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>
                          • Creación de contenido didáctico
                          personalizado
                        </li>
                        <li>
                          • Generación de ejercicios y
                          evaluaciones
                        </li>
                        <li>
                          • Asistencia en investigación y
                          síntesis
                        </li>
                        <li>• Tutorías personalizadas</li>
                      </ul>
                    </div>

                    <div className="p-6 border-2 border-orange-200 rounded-lg">
                      <h4 className="text-lg mb-3 flex items-center gap-2">
                        <span className="text-2xl">⚠️</span>
                        Consideraciones importantes
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>
                          • Verificar la precisión de la
                          información
                        </li>
                        <li>
                          • Fomentar el pensamiento crítico
                        </li>
                        <li>• Respetar derechos de autor</li>
                        <li>• Mantener la ética académica</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg">
                    <h4 className="text-lg mb-3">
                      🎯 Potencial en la UAO
                    </h4>
                    <p className="text-gray-700">
                      La IA Generativa te permitirá diseñar experiencias de aprendizaje 
                      personalizadas y dinámicas alineadas con el PEI UAO 2024 y los ODS 4, 9 y 17. 
                      En los siguientes pasos, te ayudaré a crear actividades que se ajusten 
                      perfectamente a tu contexto curricular, competencias y resultados de aprendizaje.
                    </p>
                  </div>

                  <DisclaimerBox />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleContinueToContext}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg flex items-center gap-2 mb-8"
                >
                  Continuar al Contexto Curricular
                  <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Screen 3: Chat Interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1800px] mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Volver al mapa</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm">
                <Sparkles size={16} />
                Trabajando con Lina - IA Generativa
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content - 3 columns */}
      <div className="max-w-[1800px] mx-auto p-8">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-180px)]">
          {/* Left column - Avatar and bubble */}
          <div className="col-span-3 flex flex-col h-full min-h-0">
            <div className="bg-gray-900 rounded-xl p-4 md:p-8 lg:p-12 shadow-lg flex flex-col items-center flex-1 mb-4 min-h-0 overflow-hidden">
              <div className="flex-1 flex flex-col items-center justify-center min-h-0 w-full max-h-full">
                <div className="w-40 sm:w-56 md:w-64 lg:w-72 max-h-full flex items-center justify-center">
                  <LinaAvatar
                    emotion="welcoming"
                    className="w-full h-full max-h-full object-contain"
                  />
                </div>
              </div>
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
                  <Sparkles size={16} />
                  Lina
                </div>
              </div>
            </div>

            <div className="space-y-2 md:space-y-3 flex-shrink-0">
              <Button
                onClick={() =>
                  alert("Actividad guardada exitosamente")
                }
                variant="outline"
                className="w-full border-blue-300 hover:bg-blue-50 flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M17 3L8 12L4 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Guardar actividad
              </Button>
              
              {/* Mensaje de progreso */}
              {(currentStep !== 'completo' || hasPendingChanges) && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs">
                  <p className="text-amber-800 mb-1">
                    <strong>Para continuar a Maker:</strong>
                  </p>
                  <ul className="text-amber-700 space-y-0.5 ml-4 list-disc">
                    <li className={currentStep === 'completo' ? 'line-through text-amber-500' : ''}>
                      Responde todas las preguntas del chat
                    </li>
                    <li className={!hasPendingChanges ? 'line-through text-amber-500' : ''}>
                      Confirma el documento actualizado
                    </li>
                  </ul>
                </div>
              )}
              
              <Button
                onClick={() => onComplete({ 
                  theme: activityTheme, 
                  numStudents: curricularContext?.numEstudiantes,
                  unidadAcademica: curricularContext?.unidadAcademica
                })}
                disabled={currentStep !== 'completo' || hasPendingChanges}
                className="bg-orange-600 hover:bg-orange-700 text-white w-full text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continuar a Maker →
              </Button>
            </div>
          </div>

          {/* Center column - Chat */}
          <div className="col-span-5 h-full min-h-0">
            <AgentChatInterface
              agentName="Lina"
              agentType="lina"
              agentColor="bg-blue-600"
              agentGradient="bg-gradient-to-r from-blue-600 to-purple-600"
              welcomeMessage={`¡Hola! Soy Lina. Ya tengo tu contexto curricular para ${curricularContext?.unidadAcademica}. Ahora cuéntame: ¿sobre qué tema quieres que diseñemos una actividad con IA Generativa?`}
              onSendMessage={handleSendMessage}
              chatHistory={chatHistory}
              isTyping={isTyping}
            />
          </div>

          {/* Right column - Document */}
          <div className="col-span-4 h-full min-h-0">
            <DocumentPanel
              title="Diseño de Actividad con IA Generativa"
              subtitle="Este documento se construye automáticamente basado en nuestra conversación"
              sections={documentSections}
              onConfirmChanges={handleConfirmChanges}
              hasPendingChanges={hasPendingChanges}
              agentColor="bg-blue-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}