export interface CompetenciasData {
  [unidadAcademica: string]: {
    [componente: string]: string[];
  };
}

export const competenciasData: CompetenciasData = {
  "Bioingeniería y Salud Digital": {
    "Profesional Específico": [
      "Diseñar soluciones tecnológicas contextualizadas que integren principios biológicos y de ingeniería, orientadas a mejorar la salud, el bienestar y la calidad de vida, con fundamento ético, científico y social.",
      "Gestionar sistemas tecnológicos, informáticos y operativos en entornos hospitalarios, mediante la aplicación de estándares y regulaciones nacionales e internacionales, con el propósito de la mejora de la calidad y la efectividad en organizaciones del sector salud.",
      "Integrar soluciones tecnológicas en salud que aseguren la interoperabilidad y la gestión de datos y recursos, con un enfoque ético centrado en el paciente y la población.",
      "Modelar sistemas biológicos mediante el uso de herramientas matemáticas, computacionales o experimentales, con el propósito de la comprensión de su comportamiento y la formulación de estrategias de control o intervención."
    ]
  },

  "Ciencias Básicas y Diseño en Ingeniería": {
    "Genérico o Básico Transversal": [
      "Desarrollar soluciones a problemas complejos de ingeniería que respondan a necesidades específicas del contexto, mediante la integración de conocimientos científicos, técnicos, trabajo colaborativo, creatividad y principios éticos, considerando aspectos sociales, ambientales, económicos y de seguridad.",
      "Integrar conocimientos cuantitativos y habilidades de pensamiento lógico-matemático en el análisis de situaciones complejas, con el fin de aportar soluciones pertinentes, fundamentadas y transferibles en escenarios reales o simulados."
    ]
  },

  "Energía, Mecánica y Ambiente": {
    "Profesional Específico": [
      "Analizar el comportamiento de circuitos eléctricos y electrónicos en estado estacionario y transitorio, aplicando teoría de circuitos y herramientas computacionales y experimentales para modelar, simular y validar resultados.",
      "Desarrollar sistemas de máquinas eléctricas y accionamientos eléctricos, considerando los requerimientos funcionales y su desempeño energético; utilizando fundamentos electromecánicos, electromagnéticos y de electrónica de potencia asegurando el cumplimiento de la normatividad vigente.",
      "Desarrollar sistemas de redes eléctricas inteligentes, integrando estándares de interoperabilidad, arquitecturas de ciberseguridad, tecnologías de operación y de la información, para modernizar la infraestructura eléctrica.",
      "Diseñar elementos funcionales de sistemas orientados a la prevención, mitigación o remediación de la contaminación, integrando criterios de sostenibilidad y tecnologías innovadoras.",
      "Diseñar estrategias de participación en los mercados eléctricos y de gobernanza energética, en concordancia con el marco regulatorio y normativo aplicable, con el fin de contribuir a sistemas energéticos más inclusivos, resilientes y sostenibles.",
      "Diseñar estrategias integradas de gestión de mantenimiento, operación y adaptación tecnológica, apoyadas en el análisis de datos y en modelos de mejora continua, con el fin de incrementar la eficiencia operativa, confiabilidad de los procesos y la calidad del servicio.",
      "Diseñar estrategias integrales de gestión de la energía, apoyadas en el análisis de datos y en modelos de mejora continua, con el fin de incrementar el desempeño energético y reducir los costos operativos en procesos productivos o de servicios.",
      "Diseñar redes eléctricas residenciales, industriales, de distribución y de transmisión, integrando conocimientos de física, matemática, circuitos, electrónica, sistemas dinámicos, máquinas eléctricas, automatización y herramientas computacionales para garantizar un suministro de energía confiable, seguro y eficiente.",
      "Diseñar sistemas de generación de energía eléctrica a partir de fuentes convencionales y/o renovables, para responder a las necesidades energéticas del contexto actual, cumpliendo con la normatividad vigente.",
      "Diseñar sistemas de generación, transmisión, almacenamiento y uso final de energía, incorporando tecnologías modernas para garantizar la operatividad, el mejor desempeño energético y menor impacto ambiental posible.",
      "Diseñar sistemas mecánicos o de transformación de la energía considerando aspectos como la salud pública, seguridad, bienestar, y factores globales, culturales, sociales, ambientales y económicos.",
      "Evaluar problemas de contaminación de los recursos naturales, analizando relaciones causa-efecto con herramientas teóricas, prácticas y computacionales, para proponer soluciones que mejoren las condiciones ambientales.",
      "Evaluar soluciones de ingeniería Mecánica integrando la normativa técnica pertinente para garantizar la seguridad y confiabilidad de los diseños y procesos.",
      "Formular estrategias de conservación y manejo de la biodiversidad y agrobiodiversidad a partir del análisis de los servicios ecosistémicos.",
      "Formular estrategias de economía circular basadas en flujos de materiales, eficiencia de recursos y valorización de residuos, para fortalecer sistemas sostenibles de producción y consumo.",
      "Formular estrategias para la gestión ambiental integrando dimensiones técnicas, económicas y sociales, con enfoques de sostenibilidad, economía circular y adaptación al cambio climático.",
      "Implementar estrategias de educación y cultura ambiental mediante pedagogías comunitarias, investigación social participativa y diálogo de saberes.",
      "Modelar de forma analítica, numérica o experimental el comportamiento de sistemas mecánicos y procesos de transformación de la materia y energía, para comprender su comportamiento y proponer recomendaciones de mejora.",
      "Seleccionar materiales y procesos de manufactura adecuados para diversas aplicaciones en ingeniería mecánica, aplicando criterios técnicos y normativos."
    ]
  },

  "Sistemas Industriales y Procesos Productivos": {
    "Profesional Específico": [
      "Aplicar sistemas integrados de gestión y control estadístico de calidad garantizando mejora continua y decisiones basadas en datos.",
      "Desarrollar planes de gerencia de proyectos con enfoques predictivos y ágiles mediante métodos, artefactos y herramientas tecnológicas.",
      "Diseñar modelos matemáticos para tomar decisiones aplicando optimización determinística y estocástica.",
      "Diseñar sistemas de producción aplicando gestión de operaciones para asegurar disponibilidad de recursos y continuidad operativa.",
      "Diseñar sistemas y tareas aplicando ergonomía para lograr mayor eficacia, seguridad y satisfacción en organizaciones.",
      "Diseñar soluciones de ingeniería para sistemas de transformación de bienes y servicios considerando factores contextuales.",
      "Evaluar proyectos con estudios de viabilidad mediante procesos colaborativos para decisiones de inversión, financiación y operación.",
      "Formular problemas complejos de ingeniería aplicando principios de ingeniería, ciencias y matemáticas.",
      "Formular soluciones innovadoras integrando tecnologías digitales emergentes con criterios de viabilidad, eficiencia y ética.",
      "Gestionar procesos de operaciones y logística articulando técnicas y tecnologías digitales para optimizar recursos.",
      "Gestionar procesos logísticos aplicando herramientas técnicas y estratégicas según estándares nacionales e internacionales.",
      "Integrar conocimientos gerenciales para analizar entornos empresariales y tomar decisiones orientadas a la mejora organizacional.",
      "Integrar principios y normas de gestión de la calidad y sistemas integrados para evaluar y mejorar desempeño organizacional.",
      "Mejorar condiciones de trabajo mediante conocimientos de seguridad e higiene para proteger a las personas y activos.",
      "Mejorar procesos usando herramientas estadísticas de control de calidad para toma de decisiones basada en datos."
    ]
  },

  "Software, Datos y Experiencias Digitales Interactivas": {
    "Profesional Específico": [
      "Crear soluciones interactivas centradas en las personas, integrando usabilidad, accesibilidad y experiencia de usuario.",
      "Desarrollar soluciones basadas en Inteligencia Artificial para resolver problemas específicos con responsabilidad ética y social.",
      "Desarrollar soluciones de ciencia de datos usando técnicas estadísticas, herramientas computacionales y visualización.",
      "Desarrollar software eficiente, seguro y escalable en entornos distribuidos y nube, aplicando principios de ingeniería de software.",
      "Implementar políticas y mecanismos de ciberseguridad para proteger la confidencialidad, integridad y disponibilidad de información.",
      "Integrar la gestión estratégica de TI en procesos de transformación digital, incorporando tecnologías emergentes con enfoque ético y sostenible."
    ]
  },

  "Tecnologías Emergentes": {
    "Básico Profesional": [
      "Desarrollar soluciones innovadoras integrando tecnologías emergentes para adquisición, procesamiento y visualización de información, generando prototipos para análisis y validación."
    ],
    "Profesional Específico": [
      "Desarrollar sistemas automáticos y robóticos para solucionar problemas en diversos contextos atendiendo requerimientos técnicos y estándares de calidad.",
      "Desarrollar sistemas de fabricación digital para la materialización de modelos digitales según requerimientos formales y funcionales.",
      "Desarrollar soluciones tecnológicas en computación y telecomunicaciones considerando criterios funcionales, desempeño y calidad."
    ]
  }
};
