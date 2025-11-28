# Sistema de Unidades Académicas CreAI MAKER

Este directorio contiene la estructura de competencias por unidad académica de la Universidad Autónoma de Occidente (UAO).

## Estructura de Archivos

Cada unidad académica tiene su propio archivo TypeScript:

- `bioingenieria-salud-digital.ts` - Bioingeniería y Salud Digital
- `ciencias-basicas-diseno-ingenieria.ts` - Ciencias Básicas y Diseño en Ingeniería
- `energia-mecanica-ambiente.ts` - Energía, Mecánica y Ambiente
- `sistemas-industriales-procesos-productivos.ts` - Sistemas Industriales y Procesos Productivos
- `software-datos-experiencias-digitales.ts` - Software, Datos y Experiencias Digitales Interactivas
- `tecnologias-emergentes.ts` - Tecnologías Emergentes

## Estructura del Archivo

Cada archivo TypeScript debe seguir esta estructura usando `export default`:

```typescript
export default {
  "unidad_academica": "Nombre de la Unidad Académica",
  "componentes": [
    {
      "titulo_componente": "Nombre del Componente Curricular",
      "competencias": [
        {
          "competencia": "Descripción de la competencia...",
          "niveles": [
            {
              "nivel_desempeño": "Básico",
              "descripcion_desempeño": "Descripción del desempeño esperado en el nivel básico",
              "resultados_de_aprendizaje": [
                "Resultado de aprendizaje 1",
                "Resultado de aprendizaje 2"
              ],
              "criterios_de_evaluacion": [
                "Criterio de evaluación 1",
                "Criterio de evaluación 2"
              ],
              "conocimientos_proposicionales": [
                "Conocimiento teórico 1",
                "Conocimiento teórico 2"
              ],
              "conocimientos_funcionales": [
                "Conocimiento práctico 1",
                "Conocimiento práctico 2"
              ],
              "conocimientos_axiologicos": [
                "Valor o actitud 1",
                "Valor o actitud 2"
              ]
            },
            {
              "nivel_desempeño": "Intermedio",
              "descripcion_desempeño": "Descripción del desempeño esperado en el nivel intermedio",
              "resultados_de_aprendizaje": [...],
              "criterios_de_evaluacion": [...],
              "conocimientos_proposicionales": [...],
              "conocimientos_funcionales": [...],
              "conocimientos_axiologicos": [...]
            },
            {
              "nivel_desempeño": "Avanzado",
              "descripcion_desempeño": "Descripción del desempeño esperado en el nivel avanzado",
              "resultados_de_aprendizaje": [...],
              "criterios_de_evaluacion": [...],
              "conocimientos_proposicionales": [...],
              "conocimientos_funcionales": [...],
              "conocimientos_axiologicos": [...]
            },
            {
              "nivel_desempeño": "Experto",
              "descripcion_desempeño": "Descripción del desempeño esperado en el nivel experto",
              "resultados_de_aprendizaje": [...],
              "criterios_de_evaluacion": [...],
              "conocimientos_proposicionales": [...],
              "conocimientos_funcionales": [...],
              "conocimientos_axiologicos": [...]
            }
          ]
        }
      ]
    }
  ]
}
```

## Niveles de Desempeño

Los niveles de desempeño disponibles son:

- **Básico**: Conocimiento inicial y fundamental
- **Intermedio**: Aplicación con autonomía
- **Avanzado**: Dominio complejo y transferencia
- **Experto**: Dominio excepcional y liderazgo

## Campos Requeridos

### nivel_desempeño
Nombre del nivel de desempeño (Básico, Intermedio, Avanzado, Experto).

### descripcion_desempeño
**CAMPO OBLIGATORIO**: Descripción textual del desempeño esperado del estudiante en este nivel. Este campo proporciona contexto sobre qué se espera que el estudiante pueda hacer al alcanzar este nivel.

**Ejemplo:**
```
"El estudiante diseña y evalúa soluciones tecnológicas que integran principios biológicos e ingenieriles avanzados para resolver problemáticas complejas en salud, bienestar y calidad de vida con criterios de mejora continua, factores sociales, económicos y ambientales desde un enfoque interdisciplinario."
```

### resultados_de_aprendizaje
Lista de resultados de aprendizaje esperados en este nivel.

### criterios_de_evaluacion
Criterios para evaluar si el estudiante ha alcanzado el nivel.

## Tipos de Conocimientos

### Proposicionales (Teóricos/Conceptuales)
Conocimientos sobre teorías, conceptos, fundamentos, principios y marcos teóricos.

**Ejemplo:**
- Fundamentos de inteligencia artificial
- Teoría de circuitos eléctricos
- Principios de sostenibilidad ambiental

### Funcionales (Prácticos/Procedimentales)
Habilidades prácticas, técnicas, procedimientos y aplicaciones concretas.

**Ejemplo:**
- Programación en Python
- Diseño de prototipos con Arduino
- Aplicación de metodología Design Thinking

### Axiológicos (Valores/Actitudes)
Valores, actitudes, disposiciones y principios éticos relacionados con el aprendizaje.

**Ejemplo:**
- Responsabilidad social
- Ética profesional
- Trabajo colaborativo
- Pensamiento crítico

## Flujo de Usuario

Cuando un profesor utiliza el sistema:

1. **Selecciona la Unidad Académica** → Se cargan todos los componentes y competencias
2. **Selecciona UNA competencia** → Se muestran los niveles disponibles para esa competencia
3. **Selecciona el Nivel de Desempeño** → Se muestra la descripción del desempeño y se cargan automáticamente:
   - Resultados de aprendizaje
   - Criterios de evaluación
   - Conocimientos (proposicionales, funcionales, axiológicos)
4. **Puede agregar más conocimientos** o continuar con la información precargada
5. **Completa el resto del contexto curricular** (semestre, dedicación horaria, etc.)

## Importación en Código

Para usar estos datos en la aplicación:

```typescript
import {
  unidadesCompletas,
  unidadesAcademicasDisponibles,
  getComponentesByUnidad,
  getCompetenciasByComponente,
  getNivelesByCompetencia
} from './data/unidades/index';

// Obtener todos los componentes de una unidad
const componentes = getComponentesByUnidad("Software, Datos y Experiencias Digitales Interactivas");

// Obtener todas las competencias de un componente
const competencias = getCompetenciasByComponente(
  "Software, Datos y Experiencias Digitales Interactivas",
  "Profesional Específico"
);

// Obtener los niveles de una competencia específica
const niveles = getNivelesByCompetencia(
  "Software, Datos y Experiencias Digitales Interactivas",
  "Profesional Específico",
  "Desarrollar soluciones basadas en Inteligencia Artificial..."
);
```

## Mantenimiento

Para agregar o modificar competencias:

1. Edita el archivo TypeScript correspondiente a la unidad académica
2. Asegúrate de mantener la estructura definida
3. Verifica que todos los campos requeridos estén completos
4. **IMPORTANTE**: No olvides incluir el campo `descripcion_desempeño` para cada nivel
5. Los arrays pueden estar vacíos `[]` si no hay datos disponibles

## Alineación con el PEI UAO 2024

Todas las competencias deben estar alineadas con:
- El Proyecto Educativo Institucional (PEI) de la UAO 2024
- Los Objetivos de Desarrollo Sostenible (ODS) 4, 9 y 17
- Los enfoques de IA Generativa, Cultura Maker y Aprendizaje en Servicio
