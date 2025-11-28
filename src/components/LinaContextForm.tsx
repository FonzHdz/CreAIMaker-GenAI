import { useState, useEffect } from "react";
import { LinaAvatar } from "./LinaAvatar";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  BookOpen,
  Target,
  Users,
  Clock,
  Heart,
  Sparkles,
  Zap,
  Search,
  Plus,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import {
  unidadesCompletas,
  unidadesAcademicasDisponibles,
  type ComponenteCurricular,
  type Competencia,
  type NivelDesempeno,
  type ResultadoAprendizaje,
  getComponentesByUnidad,
} from "../data/unidades/index";

interface CurricularContext {
  unidadAcademica: string;
  componenteSeleccionado: string; // Título del componente
  competenciaSeleccionada: string; // Texto de la competencia
  nivelDesempeno: string;
  semestreEstudiantes: string;
  resultadosAprendizaje: string[];
  criteriosEvaluacion: string[];
  conocimientosProposicionales: string[];
  conocimientosFuncionales: string[];
  conocimientosAxiologicos: string[];
  dedicacionHoraria: string;
  numEstudiantes: string;
  duracionActividad: string;
  semestreAcademico: string;
  condicionesEspeciales: string;
  vinculacionSocial: string;
  datosAdicionales: string;
}

interface LinaContextFormProps {
  onComplete: (context: CurricularContext) => void;
  onBack: () => void;
}

type Step = number;

const semestresOptions = [
  "1° semestre",
  "2° semestre",
  "3° semestre",
  "4° semestre",
  "5° semestre",
  "6° semestre",
  "7° semestre",
  "8° semestre",
  "9° semestre",
  "10° semestre",
];

export function LinaContextForm({
  onComplete,
  onBack,
}: LinaContextFormProps) {
  const [currentStep, setCurrentStep] = useState<Step>(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Datos dinámicos según la selección del usuario
  const [availableCompetencias, setAvailableCompetencias] = useState<
    Array<{ componente: string; competencia: string }>
  >([]);
  const [availableNiveles, setAvailableNiveles] = useState<string[]>([]);
  const [currentNivelData, setCurrentNivelData] = useState<NivelDesempeno | null>(null);
  
  // Estado para rastrear si los campos originalmente tenían datos
  const [fieldsWithOriginalData, setFieldsWithOriginalData] = useState({
    resultadosAprendizaje: false,
    criteriosEvaluacion: false,
    conocimientosProposicionales: false,
    conocimientosFuncionales: false,
    conocimientosAxiologicos: false,
  });

  // Estado para rastrear la cantidad de elementos originales (del JSON)
  const [originalItemsCount, setOriginalItemsCount] = useState({
    resultadosAprendizaje: 0,
    criteriosEvaluacion: 0,
    conocimientosProposicionales: 0,
    conocimientosFuncionales: 0,
    conocimientosAxiologicos: 0,
  });

  // Estado para datos agrupados por resultado de aprendizaje
  const [groupedByResults, setGroupedByResults] = useState<{
    isGrouped: boolean;
    data: Array<{
      resultado: string;
      criterios: string[];
      proposicionales: string[];
      funcionales: string[];
      axiologicos: string[];
    }>;
  }>({
    isGrouped: false,
    data: [],
  });

  const [context, setContext] = useState<CurricularContext>({
    unidadAcademica: "",
    componenteSeleccionado: "",
    competenciaSeleccionada: "",
    nivelDesempeno: "",
    semestreEstudiantes: "",
    resultadosAprendizaje: [],
    criteriosEvaluacion: [],
    conocimientosProposicionales: [],
    conocimientosFuncionales: [],
    conocimientosAxiologicos: [],
    dedicacionHoraria: "",
    numEstudiantes: "",
    duracionActividad: "",
    semestreAcademico: "",
    condicionesEspeciales: "",
    vinculacionSocial: "",
    datosAdicionales: "",
  });

  // Actualizar competencias disponibles cuando cambia la unidad académica
  useEffect(() => {
    if (context.unidadAcademica) {
      const componentes = getComponentesByUnidad(context.unidadAcademica);
      const competenciasFlat: Array<{ componente: string; competencia: string }> = [];

      componentes.forEach((componente) => {
        componente.competencias.forEach((comp) => {
          competenciasFlat.push({
            componente: componente.titulo_componente,
            competencia: comp.competencia,
          });
        });
      });

      setAvailableCompetencias(competenciasFlat);
      // Reset selección
      setContext((prev) => ({
        ...prev,
        componenteSeleccionado: "",
        competenciaSeleccionada: "",
        nivelDesempeno: "",
        resultadosAprendizaje: [],
        criteriosEvaluacion: [],
        conocimientosProposicionales: [],
        conocimientosFuncionales: [],
        conocimientosAxiologicos: [],
      }));
      setAvailableNiveles([]);
      setCurrentNivelData(null);
      setOriginalItemsCount({
        resultadosAprendizaje: 0,
        criteriosEvaluacion: 0,
        conocimientosProposicionales: 0,
        conocimientosFuncionales: 0,
        conocimientosAxiologicos: 0,
      });
    }
  }, [context.unidadAcademica]);

  // Actualizar niveles disponibles cuando cambia la competencia seleccionada
  useEffect(() => {
    if (
      context.unidadAcademica &&
      context.componenteSeleccionado &&
      context.competenciaSeleccionada
    ) {
      const componentes = getComponentesByUnidad(context.unidadAcademica);
      const componente = componentes.find(
        (c) => c.titulo_componente === context.componenteSeleccionado
      );
      const competencia = componente?.competencias.find(
        (c) => c.competencia === context.competenciaSeleccionada
      );

      if (competencia && competencia.niveles) {
        const nivelesDisponibles = competencia.niveles.map((n) => n.nivel_desempeño);
        setAvailableNiveles(nivelesDisponibles);
        // Reset nivel
        setContext((prev) => ({
          ...prev,
          nivelDesempeno: "",
          resultadosAprendizaje: [],
          criteriosEvaluacion: [],
          conocimientosProposicionales: [],
          conocimientosFuncionales: [],
          conocimientosAxiologicos: [],
        }));
        setCurrentNivelData(null);
        setOriginalItemsCount({
          resultadosAprendizaje: 0,
          criteriosEvaluacion: 0,
          conocimientosProposicionales: 0,
          conocimientosFuncionales: 0,
          conocimientosAxiologicos: 0,
        });
      }
    }
  }, [
    context.unidadAcademica,
    context.componenteSeleccionado,
    context.competenciaSeleccionada,
  ]);

  // Cargar datos del nivel seleccionado
  useEffect(() => {
    if (
      context.unidadAcademica &&
      context.componenteSeleccionado &&
      context.competenciaSeleccionada &&
      context.nivelDesempeno
    ) {
      const componentes = getComponentesByUnidad(context.unidadAcademica);
      const componente = componentes.find(
        (c) => c.titulo_componente === context.componenteSeleccionado
      );
      const competencia = componente?.competencias.find(
        (c) => c.competencia === context.competenciaSeleccionada
      );
      const nivel = competencia?.niveles.find(
        (n) => n.nivel_desempeño === context.nivelDesempeno
      );

      if (nivel) {
        setCurrentNivelData(nivel);
        
        // Extraer y combinar datos de todos los resultados de aprendizaje
        const resultadosAprendizaje: string[] = [];
        const criteriosEvaluacion: string[] = [];
        const conocimientosProposicionales: string[] = [];
        const conocimientosFuncionales: string[] = [];
        const conocimientosAxiologicos: string[] = [];

        // Arrays para detectar si hay diferencias entre resultados
        const groupedData: Array<{
          resultado: string;
          criterios: string[];
          proposicionales: string[];
          funcionales: string[];
          axiologicos: string[];
        }> = [];

        if (nivel.resultados && nivel.resultados.length > 0) {
          nivel.resultados.forEach((resultado: ResultadoAprendizaje) => {
            // Agregar resultado de aprendizaje
            if (resultado.resultado_aprendizaje) {
              resultadosAprendizaje.push(resultado.resultado_aprendizaje);
            }
            
            // Agregar criterios de evaluación
            if (resultado.criterios_de_evaluacion) {
              criteriosEvaluacion.push(...resultado.criterios_de_evaluacion);
            }
            
            // Agregar conocimientos proposicionales
            if (resultado.conocimientos_proposicionales) {
              conocimientosProposicionales.push(...resultado.conocimientos_proposicionales);
            }
            
            // Agregar conocimientos funcionales
            if (resultado.conocimientos_funcionales) {
              conocimientosFuncionales.push(...resultado.conocimientos_funcionales);
            }
            
            // Agregar conocimientos axiológicos
            if (resultado.conocimientos_axiologicos) {
              conocimientosAxiologicos.push(...resultado.conocimientos_axiologicos);
            }

            // Guardar datos agrupados por resultado
            groupedData.push({
              resultado: resultado.resultado_aprendizaje || "",
              criterios: resultado.criterios_de_evaluacion || [],
              proposicionales: resultado.conocimientos_proposicionales || [],
              funcionales: resultado.conocimientos_funcionales || [],
              axiologicos: resultado.conocimientos_axiologicos || [],
            });
          });
        }

        // Función helper para comparar si dos arrays son diferentes
        const arraysAreDifferent = (arr1: string[], arr2: string[]): boolean => {
          if (arr1.length !== arr2.length) return true;
          const sorted1 = [...arr1].sort();
          const sorted2 = [...arr2].sort();
          return sorted1.some((val, idx) => val !== sorted2[idx]);
        };

        // Detectar si hay diferencias significativas entre los resultados
        let hasDifferentCriterios = false;
        let hasDifferentProposicionales = false;
        let hasDifferentFuncionales = false;
        let hasDifferentAxiologicos = false;

        if (groupedData.length > 1) {
          // Comparar cada resultado con el primero
          for (let i = 1; i < groupedData.length; i++) {
            if (arraysAreDifferent(groupedData[0].criterios, groupedData[i].criterios)) {
              hasDifferentCriterios = true;
            }
            if (arraysAreDifferent(groupedData[0].proposicionales, groupedData[i].proposicionales)) {
              hasDifferentProposicionales = true;
            }
            if (arraysAreDifferent(groupedData[0].funcionales, groupedData[i].funcionales)) {
              hasDifferentFuncionales = true;
            }
            if (arraysAreDifferent(groupedData[0].axiologicos, groupedData[i].axiologicos)) {
              hasDifferentAxiologicos = true;
            }
          }
        }

        // Determinar si debemos agrupar los datos
        const shouldGroup = hasDifferentCriterios || hasDifferentProposicionales || 
                           hasDifferentFuncionales || hasDifferentAxiologicos;

        setGroupedByResults({
          isGrouped: shouldGroup,
          data: shouldGroup ? groupedData : [],
        });
        
        // Rastrear qué campos tienen datos originales (no vacíos)
        setFieldsWithOriginalData({
          resultadosAprendizaje: resultadosAprendizaje.length > 0,
          criteriosEvaluacion: criteriosEvaluacion.length > 0,
          conocimientosProposicionales: conocimientosProposicionales.length > 0,
          conocimientosFuncionales: conocimientosFuncionales.length > 0,
          conocimientosAxiologicos: conocimientosAxiologicos.length > 0,
        });

        // Rastrear la cantidad de elementos originales
        setOriginalItemsCount({
          resultadosAprendizaje: resultadosAprendizaje.length,
          criteriosEvaluacion: criteriosEvaluacion.length,
          conocimientosProposicionales: conocimientosProposicionales.length,
          conocimientosFuncionales: conocimientosFuncionales.length,
          conocimientosAxiologicos: conocimientosAxiologicos.length,
        });
        
        // Cargar datos del nivel
        setContext((prev) => ({
          ...prev,
          resultadosAprendizaje,
          criteriosEvaluacion,
          conocimientosProposicionales,
          conocimientosFuncionales,
          conocimientosAxiologicos,
        }));
      }
    }
  }, [
    context.unidadAcademica,
    context.componenteSeleccionado,
    context.competenciaSeleccionada,
    context.nivelDesempeno,
  ]);

  const steps = [
    {
      field: "unidadAcademica",
      question: "¿A qué unidad académica pertenece la asignatura?",
      icon: BookOpen,
      type: "select",
      options: unidadesAcademicasDisponibles,
    },
    {
      field: "competenciaSeleccionada",
      question: "¿Cuál competencia deseas fortalecer con esta actividad?",
      subtitle: "Selecciona una competencia",
      icon: Target,
      type: "competencia-unica-selector",
    },
    {
      field: "nivelDesempeno",
      question: "¿Qué nivel de desempeño esperas alcanzar?",
      subtitle: "Selecciona el nivel disponible para esta competencia",
      icon: Target,
      type: "nivel-selector",
    },
    {
      field: "resultadosAprendizaje",
      question: "Resultados de aprendizaje",
      subtitle: "",
      icon: Check,
      type: "array-list-editable",
    },
    {
      field: "criteriosEvaluacion",
      question: "Criterios de evaluación",
      subtitle: "",
      icon: Check,
      type: "array-list-editable",
    },
    {
      field: "conocimientosProposicionales",
      question: "Conocimientos proposicionales (teóricos/conceptuales)",
      subtitle: "",
      icon: BookOpen,
      type: "array-list-editable",
    },
    {
      field: "conocimientosFuncionales",
      question: "Conocimientos funcionales (prácticos/procedimentales)",
      subtitle: "",
      icon: Target,
      type: "array-list-editable",
    },
    {
      field: "conocimientosAxiologicos",
      question: "Conocimientos axiológicos (valores/actitudes)",
      subtitle: "",
      icon: Heart,
      type: "array-list-editable",
    },
    {
      field: "semestreEstudiantes",
      question: "¿En qué semestre están tus estudiantes de pregrado?",
      icon: Users,
      type: "select",
      options: semestresOptions,
    },
    {
      field: "dedicacionHoraria",
      question:
        "¿Cuántas horas se recomiendan para lograr este nivel de desempeño?",
      icon: Clock,
      type: "number",
      placeholder: "Ej: 12 (horas totales)",
    },
    {
      field: "numEstudiantes",
      question: "¿Cuántos estudiantes participarán?",
      icon: Users,
      type: "number",
      placeholder: "Ej: 25 (estudiantes)",
    },
    {
      field: "duracionActividad",
      question: "¿Cuánto tiempo durará la experiencia?",
      subtitle: "En semanas o sesiones",
      icon: Clock,
      type: "text",
      placeholder: "Ej: 6 semanas o 12 sesiones de 2 horas",
    },
    {
      field: "condicionesEspeciales",
      question: "¿Existe alguna condición especial en uno o más estudiantes?",
      subtitle: "Opcional",
      icon: Users,
      type: "textarea",
      placeholder:
        "Ej: 2 estudiantes con discapacidad visual, 1 estudiante con hipoacusia",
    },
    {
      field: "vinculacionSocial",
      question:
        "¿Hay alguna entidad o comunidad de Cali con la que desees alinear la actividad?",
      subtitle:
        "Opcional - Ej: barrio de Cali, fundación local, colegio, comunidad específica",
      icon: Heart,
      type: "text",
      placeholder:
        "Ej: Comuna 13 Aguablanca, Fundación Carvajal, Colegio Pío XII",
    },
    {
      field: "datosAdicionales",
      question: "¿Deseas agregar algún dato de contexto adicional?",
      subtitle: "Opcional",
      icon: BookOpen,
      type: "textarea",
      placeholder:
        "Ej: Los estudiantes tienen conocimiento previo de JavaScript, el proyecto se vincula con la materia de Diseño",
    },
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    const step = steps[currentStep];
    const value = context[step.field as keyof CurricularContext];

    // Validar que los campos requeridos no estén vacíos
    if (step.type === "array-list-editable") {
      // Para las listas editables, permitimos continuar incluso sin elementos
      // ya que pueden venir vacías del JSON
    } else if (!step.subtitle?.includes("Opcional")) {
      if (!value || (typeof value === "string" && value.trim() === ""))
        return;
    }

    if (isLastStep) {
      setShowConfirmation(true);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onBack();
    }
  };

  const handleSkip = () => {
    if (currentStepData.subtitle?.includes("Opcional") || currentStepData.type === "array-list-editable") {
      if (isLastStep) {
        setShowConfirmation(true);
      } else {
        setCurrentStep((prev) => prev + 1);
      }
    }
  };

  const addArrayItem = (field: string) => {
    const current = context[field as keyof CurricularContext] as string[];
    setContext({
      ...context,
      [field]: [...current, ""],
    });
  };

  const updateArrayItem = (field: string, index: number, value: string) => {
    const current = [
      ...(context[field as keyof CurricularContext] as string[]),
    ];
    current[index] = value;
    setContext({
      ...context,
      [field]: current,
    });
  };

  const removeArrayItem = (field: string, index: number) => {
    const fieldName = field as keyof typeof originalItemsCount;
    const originalCount = originalItemsCount[fieldName];
    
    // Solo permitir eliminar elementos agregados por el usuario (índice >= originalCount)
    if (index < originalCount) {
      return; // No permitir eliminar elementos originales
    }
    
    const current = context[field as keyof CurricularContext] as string[];
    setContext({
      ...context,
      [field]: current.filter((_, i) => i !== index),
    });
  };

  const handleConfirmAndContinue = () => {
    // Transform context to match GenIASection's expected format
    const transformedContext = {
      unidadAcademica: context.unidadAcademica,
      componenteCurricular: context.componenteSeleccionado,
      competenciasPrincipales: [context.competenciaSeleccionada],
      nivelDesempeno: context.nivelDesempeno,
      nivelesFormacion: [context.semestreEstudiantes],
      resultadosAprendizaje: context.resultadosAprendizaje,
      criteriosEvaluacion: context.criteriosEvaluacion,
      conocimientosProposicionales: context.conocimientosProposicionales.join(", "),
      conocimientosFuncionales: context.conocimientosFuncionales.join(", "),
      conocimientosAxiologicos: context.conocimientosAxiologicos.join(", "),
      dedicacionHoraria: context.dedicacionHoraria,
      numEstudiantes: context.numEstudiantes,
      duracionActividad: context.duracionActividad,
      semestreAcademico: context.semestreAcademico,
      condicionesEspeciales: context.condicionesEspeciales,
      vinculacionSocial: context.vinculacionSocial,
      datosAdicionales: context.datosAdicionales,
    };
    onComplete(transformedContext as any);
  };

  const handleEditConfirmation = () => {
    setShowConfirmation(false);
  };

  // DEV MODE: Auto-fill all form fields
  const handleDevAutoFill = () => {
    const devContext: CurricularContext = {
      unidadAcademica:
        "Software, Datos y Experiencias Digitales Interactivas",
      componenteSeleccionado: "Profesional Específico",
      competenciaSeleccionada:
        "Desarrollar soluciones basadas en Inteligencia Artificial para resolver problemas específicos con responsabilidad ética y social.",
      nivelDesempeno: "Avanzado",
      semestreEstudiantes: "7° semestre",
      resultadosAprendizaje: [
        "Diseñar e implementar sistemas inteligentes que integren IA generativa para resolver problemas reales",
        "Evaluar críticamente el impacto ético y social de soluciones basadas en IA",
      ],
      criteriosEvaluacion: [
        "Funcionalidad y robustez de la solución técnica implementada",
        "Creatividad e innovación en el uso de herramientas de IA",
        "Análisis crítico del impacto social y ético",
        "Calidad de la documentación y presentación",
      ],
      conocimientosProposicionales: [
        "Fundamentos de inteligencia artificial",
        "Aprendizaje automático",
        "Procesamiento de lenguaje natural",
        "Principios de ética en IA",
      ],
      conocimientosFuncionales: [
        "Uso de APIs de IA generativa (ChatGPT, Claude, DALL-E)",
        "Desarrollo de aplicaciones web",
        "Integración de servicios de IA",
        "Prompt engineering",
      ],
      conocimientosAxiologicos: [
        "Responsabilidad social",
        "Ética profesional",
        "Pensamiento crítico",
        "Trabajo colaborativo",
      ],
      dedicacionHoraria: "48",
      numEstudiantes: "25",
      duracionActividad: "6 semanas",
      semestreAcademico: "2025-1",
      condicionesEspeciales:
        "Un estudiante con discapacidad visual parcial que requiere herramientas de accesibilidad.",
      vinculacionSocial:
        "Fundación Carvajal - Programa de alfabetización digital en el barrio El Calvario, Cali",
      datosAdicionales:
        "Los estudiantes tienen experiencia previa con Python y JavaScript. Se cuenta con laboratorio equipado con computadores de alto rendimiento.",
    };

    setContext(devContext);
    setShowConfirmation(true);
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
        {/* Left Panel - Lina Avatar */}
        <div className="w-80 bg-gray-900 flex flex-col items-center justify-center p-8 shadow-2xl sticky top-0 h-screen">
          <LinaAvatar emotion="excited" className="w-64" />
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm">
              <Sparkles size={16} />
              Lina - Asistente GenIA
            </div>
          </div>
        </div>

        {/* Right Panel - Confirmation */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-5xl mx-auto p-12">
            <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-lg mb-8 animate-fadeIn">
              <p className="text-lg leading-relaxed text-gray-800">
                <strong>Excelente, profe.</strong> Con esta información ya
                tengo un panorama completo de tu curso en la UAO y de los
                resultados que quieres lograr. Ahora puedo construir la
                semilla pedagógica personalizada, alineada con el PEI UAO
                2024, tus competencias y el contexto de tus estudiantes
                universitarios.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200">
              <h3 className="text-2xl mb-6 text-gray-900 flex items-center gap-2">
                <Check className="text-green-600" />
                Resumen de tu contexto curricular UAO
              </h3>

              <div className="grid md:grid-cols-2 gap-4 mb-8 max-h-[600px] overflow-y-auto pr-2">
                {/* Unidad Académica */}
                {context.unidadAcademica && (
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <BookOpen
                      className="text-blue-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">
                        Unidad Académica
                      </p>
                      <p className="text-gray-900 break-words">
                        {context.unidadAcademica}
                      </p>
                    </div>
                  </div>
                )}

                {/* Competencia Seleccionada */}
                {context.competenciaSeleccionada && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200 md:col-span-2">
                    <Target
                      className="text-green-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">
                        Competencia Seleccionada
                      </p>
                      <p className="text-gray-900 break-words">
                        {context.competenciaSeleccionada}
                      </p>
                    </div>
                  </div>
                )}

                {/* Nivel de Desempeño */}
                {context.nivelDesempeno && (
                  <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <Target
                      className="text-orange-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">
                        Nivel de Desempeño
                      </p>
                      <p className="text-gray-900 break-words">
                        {context.nivelDesempeno}
                      </p>
                    </div>
                  </div>
                )}

                {/* Semestre Estudiantes */}
                {context.semestreEstudiantes && (
                  <div className="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <Users
                      className="text-indigo-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">
                        Semestre de los Estudiantes
                      </p>
                      <p className="text-gray-900 break-words">
                        {context.semestreEstudiantes}
                      </p>
                    </div>
                  </div>
                )}

                {/* Resultados de Aprendizaje */}
                {context.resultadosAprendizaje.length > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-teal-50 rounded-lg border border-teal-200 md:col-span-2">
                    <Check
                      className="text-teal-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">
                        Resultados de Aprendizaje
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {context.resultadosAprendizaje.map(
                          (resultado, idx) => (
                            <li
                              key={idx}
                              className="text-gray-900 break-words"
                            >
                              {resultado}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Criterios de Evaluación */}
                {context.criteriosEvaluacion.length > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200 md:col-span-2">
                    <Check
                      className="text-purple-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">
                        Criterios de Evaluación
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {context.criteriosEvaluacion.map((criterio, idx) => (
                          <li
                            key={idx}
                            className="text-gray-900 break-words"
                          >
                            {criterio}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Conocimientos Proposicionales */}
                {context.conocimientosProposicionales.length > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200 md:col-span-2">
                    <BookOpen
                      className="text-blue-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">
                        Conocimientos Proposicionales
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {context.conocimientosProposicionales.map(
                          (conocimiento, idx) => (
                            <li
                              key={idx}
                              className="text-gray-900 break-words"
                            >
                              {conocimiento}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Conocimientos Funcionales */}
                {context.conocimientosFuncionales.length > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200 md:col-span-2">
                    <Target
                      className="text-green-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">
                        Conocimientos Funcionales
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {context.conocimientosFuncionales.map(
                          (conocimiento, idx) => (
                            <li
                              key={idx}
                              className="text-gray-900 break-words"
                            >
                              {conocimiento}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Conocimientos Axiológicos */}
                {context.conocimientosAxiologicos.length > 0 && (
                  <div className="flex items-start gap-3 p-4 bg-pink-50 rounded-lg border border-pink-200 md:col-span-2">
                    <Heart
                      className="text-pink-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">
                        Conocimientos Axiológicos
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {context.conocimientosAxiologicos.map(
                          (conocimiento, idx) => (
                            <li
                              key={idx}
                              className="text-gray-900 break-words"
                            >
                              {conocimiento}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Dedicación Horaria */}
                {context.dedicacionHoraria && (
                  <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Clock
                      className="text-yellow-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">
                        Dedicación Horaria
                      </p>
                      <p className="text-gray-900 break-words">
                        {context.dedicacionHoraria} horas
                      </p>
                    </div>
                  </div>
                )}

                {/* Número de Estudiantes */}
                {context.numEstudiantes && (
                  <div className="flex items-start gap-3 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                    <Users
                      className="text-cyan-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">
                        Número de Estudiantes
                      </p>
                      <p className="text-gray-900 break-words">
                        {context.numEstudiantes} estudiantes
                      </p>
                    </div>
                  </div>
                )}

                {/* Duración Actividad */}
                {context.duracionActividad && (
                  <div className="flex items-start gap-3 p-4 bg-lime-50 rounded-lg border border-lime-200">
                    <Clock
                      className="text-lime-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">
                        Duración de la Actividad
                      </p>
                      <p className="text-gray-900 break-words">
                        {context.duracionActividad}
                      </p>
                    </div>
                  </div>
                )}

                {/* Semestre Académico */}
                {context.semestreAcademico && (
                  <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <BookOpen
                      className="text-amber-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">
                        Semestre Académico
                      </p>
                      <p className="text-gray-900 break-words">
                        {context.semestreAcademico}
                      </p>
                    </div>
                  </div>
                )}

                {/* Condiciones Especiales */}
                {context.condicionesEspeciales && (
                  <div className="flex items-start gap-3 p-4 bg-rose-50 rounded-lg border border-rose-200 md:col-span-2">
                    <Users
                      className="text-rose-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">
                        Condiciones Especiales
                      </p>
                      <p className="text-gray-900 break-words">
                        {context.condicionesEspeciales}
                      </p>
                    </div>
                  </div>
                )}

                {/* Vinculación Social */}
                {context.vinculacionSocial && (
                  <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200 md:col-span-2">
                    <Heart
                      className="text-emerald-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">
                        Vinculación Social
                      </p>
                      <p className="text-gray-900 break-words">
                        {context.vinculacionSocial}
                      </p>
                    </div>
                  </div>
                )}

                {/* Datos Adicionales */}
                {context.datosAdicionales && (
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-200 md:col-span-2">
                    <BookOpen
                      className="text-slate-600 mt-1 flex-shrink-0"
                      size={20}
                    />
                    <div className="min-w-0">
                      <p className="text-sm text-gray-600">
                        Datos Adicionales
                      </p>
                      <p className="text-gray-900 break-words">
                        {context.datosAdicionales}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 justify-end">
                <Button
                  onClick={handleEditConfirmation}
                  variant="outline"
                  size="lg"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Editar
                </Button>
                <Button
                  onClick={handleConfirmAndContinue}
                  className="bg-gradient-to-r from-blue-600 to-purple-600"
                  size="lg"
                >
                  Confirmar y Continuar
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const StepIcon = currentStepData.icon;

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
      {/* Left Panel - Lina Avatar */}
      <div className="w-80 bg-gray-900 flex flex-col items-center justify-center p-8 shadow-2xl">
        <LinaAvatar emotion="thinking" className="w-64 mb-6" />
        
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm mb-4">
            <Sparkles size={16} />
            Lina - Asistente GenIA
          </div>
          <p className="text-white text-sm mb-2">
            Paso {currentStep + 1} de {steps.length}
          </p>
          {/* Progress Bar */}
          <div className="w-full max-w-[200px] mx-auto h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* DEV MODE: Auto-fill button */}
        {process.env.NODE_ENV === "development" && (
          <Button
            onClick={handleDevAutoFill}
            size="sm"
            className="bg-yellow-500 text-gray-900 hover:bg-yellow-600 font-medium mt-8"
          >
            <Zap size={16} className="mr-2" />
            DEV: Auto-rellenar
          </Button>
        )}
      </div>

      {/* Right Panel - Questions */}
      <div className="flex-1 overflow-auto h-full relative">
        {/* Botón Volver - Posicionado arriba a la izquierda */}
        <button
          onClick={handleBack}
          className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors z-10"
        >
          <ArrowLeft size={20} />
          <span>Volver</span>
        </button>

        <div className="max-w-4xl mx-auto p-12 h-full pt-20">
          {/* Lina's Introduction Message (only on first step) */}
          {currentStep === 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600 p-6 rounded-lg mb-8 animate-fadeIn">
              <p className="text-lg leading-relaxed text-gray-800">
                ¡Perfecto, profe! Antes de ayudarte a construir la actividad,
                necesito conocer un poco más sobre el contexto académico de tu
                curso en la UAO. Así puedo generar un diseño coherente con el
                PEI UAO 2024, tus objetivos de aprendizaje y el nivel de tus
                estudiantes universitarios.
              </p>
            </div>
          )}

          {/* Question Card */}
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 animate-fadeIn">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg flex-shrink-0">
                <StepIcon className="text-white" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl text-gray-900 mb-2">
                  {currentStepData.question}
                </h2>
                {/* Subtitle dinámico para array-list-editable */}
                {currentStepData.type === "array-list-editable" ? (
                  (() => {
                    const fieldName = currentStepData.field as keyof typeof fieldsWithOriginalData;
                    const hasOriginalData = fieldsWithOriginalData[fieldName];
                    const originalCount = originalItemsCount[fieldName];
                    
                    if (hasOriginalData) {
                      return (
                        <p className="text-gray-500 text-sm">
                          Revisa los {originalCount} elementos del PEI UAO. Puedes agregar elementos personalizados adicionales.
                        </p>
                      );
                    } else {
                      return (
                        <p className="text-gray-500 text-sm">
                          Agrega los elementos que consideres necesarios
                        </p>
                      );
                    }
                  })()
                ) : (
                  currentStepData.subtitle && (
                    <p className="text-gray-500 text-sm">
                      {currentStepData.subtitle}
                    </p>
                  )
                )}
              </div>
            </div>

            {/* Answer Input */}
            <div className="space-y-4 mb-8">
              {/* Select field */}
              {currentStepData.type === "select" && (
                <Select
                  value={
                    context[
                      currentStepData.field as keyof CurricularContext
                    ] as string
                  }
                  onValueChange={(value) =>
                    setContext({ ...context, [currentStepData.field]: value })
                  }
                >
                  <SelectTrigger className="w-full py-6 text-base bg-gray-50 border-gray-300">
                    <SelectValue placeholder="Selecciona una opción..." />
                  </SelectTrigger>
                  <SelectContent>
                    {currentStepData.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {/* Competencia Única Selector */}
              {currentStepData.type === "competencia-unica-selector" && (
                <div className="space-y-4">
                  {availableCompetencias.length === 0 ? (
                    <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                      <p className="text-gray-700">
                        Primero debes seleccionar una unidad académica
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Search box */}
                      <div className="relative">
                        <Search
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <Input
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Buscar competencias por palabras clave..."
                          className="pl-10 py-6 text-lg"
                        />
                      </div>

                      {/* Competencias list */}
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                        {availableCompetencias
                          .filter(
                            (item) =>
                              searchTerm === "" ||
                              item.competencia
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()) ||
                              item.componente
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                          )
                          .map((item, index) => (
                            <div
                              key={index}
                              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                context.competenciaSeleccionada ===
                                  item.competencia &&
                                context.componenteSeleccionado ===
                                  item.componente
                                  ? "border-purple-600 bg-purple-50"
                                  : "border-gray-200 bg-white hover:border-purple-300"
                              }`}
                              onClick={() => {
                                setContext({
                                  ...context,
                                  competenciaSeleccionada: item.competencia,
                                  componenteSeleccionado: item.componente,
                                });
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div className="flex-1">
                                  <p className="text-xs text-purple-600 mb-1">
                                    {item.componente}
                                  </p>
                                  <p className="text-gray-800 leading-relaxed">
                                    {item.competencia}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        {availableCompetencias.filter(
                          (item) =>
                            searchTerm === "" ||
                            item.competencia
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase()) ||
                            item.componente
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                        ).length === 0 && (
                          <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
                            <p className="text-gray-600">
                              No se encontraron competencias con "{searchTerm}"
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Nivel Selector */}
              {currentStepData.type === "nivel-selector" && (() => {
                const componentes = getComponentesByUnidad(context.unidadAcademica);
                const componente = componentes.find(
                  (c) => c.titulo_componente === context.componenteSeleccionado
                );
                const competencia = componente?.competencias.find(
                  (c) => c.competencia === context.competenciaSeleccionada
                );
                
                return (
                  <div className="space-y-3">
                    {availableNiveles.length === 0 ? (
                      <div className="p-6 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                        <p className="text-gray-700">
                          Primero debes seleccionar una competencia
                        </p>
                      </div>
                    ) : (
                      <>
                        {availableNiveles.map((nivel) => {
                          const nivelData = competencia?.niveles.find((n) => n.nivel_desempeño === nivel);
                          const isSelected = context.nivelDesempeno === nivel;
                          
                          return (
                            <div
                              key={nivel}
                              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                isSelected
                                  ? "border-orange-600 bg-orange-50"
                                  : "border-gray-200 bg-white hover:border-orange-300"
                              }`}
                              onClick={() =>
                                setContext({ ...context, nivelDesempeno: nivel })
                              }
                            >
                              <p className="text-gray-900 font-medium mb-2">{nivel}</p>
                              {nivelData?.descripcion_desempeño && (
                                <p className="text-sm text-gray-600">
                                  {nivelData.descripcion_desempeño}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Array List Editable (para resultados, criterios, conocimientos) */}
              {currentStepData.type === "array-list-editable" && (() => {
                const fieldName = currentStepData.field as keyof typeof fieldsWithOriginalData;
                const hasOriginalData = fieldsWithOriginalData[fieldName];
                const currentArray = context[fieldName] as string[];
                
                // Determinar si este campo debe mostrarse agrupado
                const shouldShowGrouped = groupedByResults.isGrouped && 
                  (fieldName === 'criteriosEvaluacion' || 
                   fieldName === 'conocimientosProposicionales' || 
                   fieldName === 'conocimientosFuncionales' || 
                   fieldName === 'conocimientosAxiologicos');

                // Si debe mostrarse agrupado, extraer el array correspondiente
                let groupedArrayKey: 'criterios' | 'proposicionales' | 'funcionales' | 'axiologicos' | null = null;
                if (shouldShowGrouped) {
                  if (fieldName === 'criteriosEvaluacion') groupedArrayKey = 'criterios';
                  else if (fieldName === 'conocimientosProposicionales') groupedArrayKey = 'proposicionales';
                  else if (fieldName === 'conocimientosFuncionales') groupedArrayKey = 'funcionales';
                  else if (fieldName === 'conocimientosAxiologicos') groupedArrayKey = 'axiologicos';
                }
                
                return (
                  <div className="space-y-3">
                    {/* Si no hay datos, mostrar mensaje cuando el array está vacío */}
                    {currentArray.length === 0 && !hasOriginalData && (
                      <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg text-center">
                        <p className="text-gray-600">
                          No hay datos definidos para este campo. Puedes agregar elementos personalizados.
                        </p>
                      </div>
                    )}
                    
                    {/* Renderizar agrupado por resultado de aprendizaje */}
                    {shouldShowGrouped && groupedArrayKey && groupedByResults.data.length > 0 ? (
                      <>
                        {groupedByResults.data.map((group, groupIndex) => (
                          <div key={groupIndex} className="border-2 border-indigo-200 rounded-lg p-4 bg-indigo-50">
                            {/* Título del resultado de aprendizaje */}
                            <div className="mb-3 pb-2 border-b border-indigo-300">
                              <p className="text-sm font-medium text-indigo-900">
                                Resultado de aprendizaje {groupIndex + 1}:
                              </p>
                              <p className="text-sm text-indigo-700 mt-1">
                                {group.resultado}
                              </p>
                            </div>
                            
                            {/* Items del grupo */}
                            <div className="space-y-2">
                              {group[groupedArrayKey].map((item, itemIndex) => (
                                <div
                                  key={itemIndex}
                                  className="flex items-start gap-2 p-3 rounded-lg border bg-white border-gray-200"
                                >
                                  <Textarea
                                    value={item}
                                    placeholder="Escribe aquí..."
                                    className="flex-1 min-h-[60px] bg-gray-50"
                                    readOnly={true}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                        
                        {/* Elementos personalizados agregados por el profesor */}
                        {(() => {
                          const originalCount = originalItemsCount[fieldName];
                          const customItems = currentArray.slice(originalCount);
                          
                          return customItems.length > 0 && (
                            <div className="border-2 border-green-200 rounded-lg p-4 bg-green-50">
                              <div className="mb-3 pb-2 border-b border-green-300">
                                <p className="text-sm font-medium text-green-900">
                                  Elementos personalizados agregados por ti:
                                </p>
                              </div>
                              <div className="space-y-2">
                                {customItems.map((item, customIndex) => {
                                  const actualIndex = originalCount + customIndex;
                                  return (
                                    <div
                                      key={actualIndex}
                                      className="flex items-start gap-2 p-3 rounded-lg border bg-white border-gray-200"
                                    >
                                      <Textarea
                                        value={item}
                                        onChange={(e) =>
                                          updateArrayItem(
                                            currentStepData.field,
                                            actualIndex,
                                            e.target.value
                                          )
                                        }
                                        placeholder="Escribe aquí..."
                                        className="flex-1 min-h-[60px] bg-white"
                                      />
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          removeArrayItem(currentStepData.field, actualIndex)
                                        }
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                      >
                                        <X size={18} />
                                      </Button>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })()}
                        
                        {/* Botón para agregar elementos personalizados */}
                        <Button
                          onClick={() => addArrayItem(currentStepData.field)}
                          variant="outline"
                          className="w-full border-dashed border-2 border-green-400 text-green-700 hover:bg-green-50"
                        >
                          <Plus size={18} className="mr-2" />
                          Agregar elemento personalizado
                        </Button>
                      </>
                    ) : (
                      /* Renderizar normalmente (sin agrupar) */
                      <>
                        {currentArray.map((item, index) => {
                          const originalCount = originalItemsCount[fieldName];
                          const isOriginal = index < originalCount;
                          
                          return (
                            <div
                              key={index}
                              className="flex items-start gap-2 p-3 rounded-lg border bg-white border-gray-200"
                            >
                              <Textarea
                                value={item}
                                onChange={(e) =>
                                  !isOriginal && updateArrayItem(
                                    currentStepData.field,
                                    index,
                                    e.target.value
                                  )
                                }
                                placeholder="Escribe aquí..."
                                className={`flex-1 min-h-[60px] ${isOriginal ? 'bg-gray-50' : 'bg-white'}`}
                                readOnly={isOriginal}
                              />
                              {!isOriginal && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    removeArrayItem(currentStepData.field, index)
                                  }
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                >
                                  <X size={18} />
                                </Button>
                              )}
                            </div>
                          );
                        })}

                        {/* Botón agregar - siempre visible */}
                        <Button
                          onClick={() => addArrayItem(currentStepData.field)}
                          variant="outline"
                          className={`w-full border-dashed border-2 ${
                            hasOriginalData 
                              ? 'border-green-400 text-green-700 hover:bg-green-50' 
                              : 'border-gray-300'
                          }`}
                        >
                          <Plus size={18} className="mr-2" />
                          {hasOriginalData ? 'Agregar elemento personalizado' : 'Agregar más'}
                        </Button>
                      </>
                    )}
                  </div>
                );
              })()}

              {/* Text field */}
              {currentStepData.type === "text" && (
                <Input
                  value={
                    context[
                      currentStepData.field as keyof CurricularContext
                    ] as string
                  }
                  onChange={(e) =>
                    setContext({
                      ...context,
                      [currentStepData.field]: e.target.value,
                    })
                  }
                  placeholder={currentStepData.placeholder || "Escribe aquí..."}
                  className="py-6 text-lg"
                />
              )}

              {/* Number field */}
              {currentStepData.type === "number" && (
                <Input
                  type="number"
                  value={
                    context[
                      currentStepData.field as keyof CurricularContext
                    ] as string
                  }
                  onChange={(e) =>
                    setContext({
                      ...context,
                      [currentStepData.field]: e.target.value,
                    })
                  }
                  placeholder={currentStepData.placeholder || "Escribe aquí..."}
                  className="py-6 text-lg"
                />
              )}

              {/* Textarea field */}
              {currentStepData.type === "textarea" && (
                <Textarea
                  value={
                    context[
                      currentStepData.field as keyof CurricularContext
                    ] as string
                  }
                  onChange={(e) =>
                    setContext({
                      ...context,
                      [currentStepData.field]: e.target.value,
                    })
                  }
                  placeholder={currentStepData.placeholder || "Escribe aquí..."}
                  rows={4}
                  className="text-lg"
                />
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-3 mt-8">
              <Button onClick={handleBack} variant="outline" size="lg">
                <ArrowLeft size={20} className="mr-2" />
                Atrás
              </Button>

              <div className="flex-1" />

              {(currentStepData.subtitle?.includes("Opcional") ||
                currentStepData.type === "array-list-editable") && (
                <Button
                  onClick={handleSkip}
                  variant="ghost"
                  size="lg"
                  className="text-gray-600"
                >
                  Omitir
                </Button>
              )}

              <Button
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isLastStep ? "Finalizar" : "Siguiente pregunta"}
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}