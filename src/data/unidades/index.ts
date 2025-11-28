import bioingenieriaData from './bioingenieria-salud-digital';
import cienciasBasicasData from './ciencias-basicas-diseno-ingenieria';
// import energiaMecanicaData from './energia-mecanica-ambiente'; // Temporalmente desactivado
// import sistemasIndustrialesData from './sistemas-industriales-procesos-productivos'; // Temporalmente desactivado
import softwareDatosData from './software-datos-experiencias-digitales';
import tecnologiasEmergentesData from './tecnologias-emergentes';

export interface Conocimientos {
  proposicionales: string[];
  funcionales: string[];
  axiologicos: string[];
}

export interface ResultadoAprendizaje {
  resultado_aprendizaje: string;
  criterios_de_evaluacion: string[];
  conocimientos_proposicionales: string[];
  conocimientos_funcionales: string[];
  conocimientos_axiologicos: string[];
}

export interface NivelDesempeno {
  nivel_desempeño: string;
  descripcion_desempeño: string;
  resultados: ResultadoAprendizaje[];
}

export interface Competencia {
  competencia: string;
  niveles: NivelDesempeno[];
}

export interface ComponenteCurricular {
  titulo_componente: string;
  competencias: Competencia[];
}

export interface UnidadAcademicaData {
  unidad_academica: string;
  componentes: ComponenteCurricular[];
}

// Mapeo de todas las unidades académicas
export const unidadesCompletas: Record<string, UnidadAcademicaData> = {
  "Bioingeniería y Salud Digital": bioingenieriaData,
  "Ciencias Básicas y Diseño en Ingeniería": cienciasBasicasData,
  // "Energía, Mecánica y Ambiente": energiaMecanicaData, // Temporalmente desactivado
  // "Sistemas Industriales y Procesos Productivos": sistemasIndustrialesData, // Temporalmente desactivado
  "Software, Datos y Experiencias Digitales Interactivas": softwareDatosData,
  "Tecnologías Emergentes": tecnologiasEmergentesData,
};

// Lista de unidades académicas disponibles
export const unidadesAcademicasDisponibles = [
  "Bioingeniería y Salud Digital",
  "Ciencias Básicas y Diseño en Ingeniería",
  // "Energía, Mecánica y Ambiente", // Temporalmente desactivado
  // "Sistemas Industriales y Procesos Productivos", // Temporalmente desactivado
  "Software, Datos y Experiencias Digitales Interactivas",
  "Tecnologías Emergentes",
];

// Función helper para obtener los componentes de una unidad académica
export function getComponentesByUnidad(unidadAcademica: string): ComponenteCurricular[] {
  return unidadesCompletas[unidadAcademica]?.componentes || [];
}

// Función helper para obtener competencias de un componente específico
export function getCompetenciasByComponente(
  unidadAcademica: string,
  tituloComponente: string
): Competencia[] {
  const componentes = getComponentesByUnidad(unidadAcademica);
  const componente = componentes.find(c => c.titulo_componente === tituloComponente);
  return componente?.competencias || [];
}

// Función helper para obtener niveles de una competencia
export function getNivelesByCompetencia(
  unidadAcademica: string,
  tituloComponente: string,
  competenciaTexto: string
): NivelDesempeno[] {
  const competencias = getCompetenciasByComponente(unidadAcademica, tituloComponente);
  const competencia = competencias.find(c => c.competencia === competenciaTexto);
  return competencia?.niveles || [];
}