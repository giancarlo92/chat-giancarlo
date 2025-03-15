// Interfaz para las preguntas y respuestas
export interface ChatQA {
  question: string;
  answer?: string;
}

// Array de preguntas y respuestas
export const chatData: ChatQA[] = [
  {
    question: '¿Cuál es tu nombre?',
    answer: 'Giancarlo Zevallos Lecca'
  },
  {
    question: '¿A qué te dedicas?',
    answer: 'Soy un AI Engineer y especialista en automatización con más de 8 años de experiencia en desarrollo de software. Me especializo en soluciones de IA, chatbots y optimización de procesos. Actualmente busco oportunidades 100% remotas donde pueda aplicar mis conocimientos.'
  },
  {
    question: '¿En qué te especializas?',
    answer: `Me especializo en diseño y optimización de procesos mediante herramientas Low-Code, integración de IA con aplicaciones propias o de terceros, creación de chatbots conversacionales, y desarrollo de software a medida.

## Áreas de Especialización

* **Diseño y optimización** de procesos mediante herramientas Low-Code
* **Integración de IA** con aplicaciones propias o de terceros
* **Creación de chatbots** conversacionales
* **Desarrollo de software** a medida
  `
  },
  {
    question: '¿Cuántos años de experiencia tienes?',
    answer: `Tengo más de 8 años de experiencia en desarrollo de software y 1 año especializado en soluciones de inteligencia artificial y automatización. He trabajado en Digital Preventor como Software Developer desde julio de 2023, y también como freelance especialista en automatización con IA desde enero de 2024.

## Mi Experiencia Profesional

* **+8 años** en desarrollo de software
* **1 año** especializado en soluciones de IA y automatización
* **Actual:** Software Developer en Digital Preventor (desde julio 2023)
* **Freelance:** Especialista en automatización con IA (desde enero 2024)
  `
  },
  {
    question: '¿Dónde estudiaste?',
    answer: `Estudié Ingeniería de Software en la Universidad Tecnológica del Perú (2010-2014) y realicé un MBA en la Universidad Rey Juan Carlos (2015-2016). También tengo diplomaturas en Desarrollo Visual Studio C# y Transact-SQL Server de Cibertec.

## Formación Académica

* **Ingeniería de Software** - Universidad Tecnológica del Perú (2010-2014)
* **MBA** - Universidad Rey Juan Carlos (2015-2016)
* **Diplomaturas:**
  * Desarrollo Visual Studio C#
  * Transact-SQL Server (Cibertec)
  `
  },
  {
    question: '¿En qué proyectos has trabajado?',
    answer: `He trabajado en diversos proyectos destacados como la automatización de procesos con IA para el sector educativo, desarrollo de plataformas integradas para análisis de datos en tiempo real, y actualmente mantengo un canal educativo en YouTube enfocado en herramientas de inteligencia artificial.
## Proyectos Destacados

1. **Automatización con IA para sector educativo**
   * Optimización de procesos administrativos
   * Reducción de tiempo en tareas repetitivas

2. **Plataforma integrada para análisis de datos**
   * Visualización en tiempo real
   * Integración con múltiples fuentes

3. **Canal educativo en YouTube**
   * Contenido sobre herramientas de IA
   * Tutoriales y casos prácticos
  `
  },
  {
    question: '¿Cuáles son tus habilidades técnicas?',
    answer: `Tengo experiencia en tecnologías de Microsoft como .NET C#, SQL Server y TypeScript. También manejo Azure para cómputo en la nube, implementación de microservicios, y desarrollo avanzado en HTML, CSS y JavaScript. Además, tengo conocimientos básicos de Python para automatización.
## Habilidades Técnicas

### Microsoft Stack
* .NET C#
* SQL Server
* TypeScript

### Cloud & Arquitectura
* Azure (cómputo en la nube)
* Microservicios
* Desarrollo web avanzado (HTML, CSS, JavaScript)

### Otros
* Python (automatización)
  `
  },
  {
    question: '¿Qué idiomas hablas?',
    answer: `Hablo español nativo, portugués avanzado e inglés intermedio, lo que me permite colaborar en equipos internacionales.
## Idiomas

| Idioma | Nivel |
|--------|-------|
| Español | Nativo |
| Portugués | Avanzado |
| Inglés | Intermedio |
  `
  },
  {
    question: '¿Cómo puedo contactarte?',
    answer: `
## Información de Contacto

* **Email:** [giancarlo.zevallos.lecca@gmail.com](mailto:giancarlo.zevallos.lecca@gmail.com)
* **Teléfono:** +351 913 691 603
* **LinkedIn:** [Perfil de LinkedIn](https://linkedin.com)
* **YouTube:** [Canal sobre IA](https://youtube.com)
  `
  },
  {
    question: `## ¡Gracias por la charla!

Si quieres saber más, puedes preguntarme sobre:

* Mi experiencia profesional
* Proyectos en los que he trabajado
* Cómo podría contribuir a tu equipo

Estoy buscando oportunidades **100% remotas** donde pueda aplicar mis conocimientos en IA y automatización.`
  }
];

// Variable global para el delay de tipeo
export const TYPING_DELAY = 2000;