// Interfaz para las preguntas y respuestas
export interface ChatQA {
  question: string;
  answer?: string;
  icon?: string;
  color?: string;
}

// Tiempo de espera para simular el typing
export const TYPING_DELAY = 1500;

// Array de preguntas y respuestas
export const chatData: ChatQA[] = [
  {
    question: '¿Cuál es tu nombre?',
    answer: 'Giancarlo Zevallos Lecca',
    icon: 'user',
    color: '#3245ff'
  },
  {
    question: '¿A qué te dedicas?',
    answer: 'Soy un AI Engineer y especialista en automatización con más de 8 años de experiencia en desarrollo de software. Me especializo en soluciones de IA, chatbots y optimización de procesos. Actualmente busco oportunidades 100% remotas donde pueda aplicar mis conocimientos.',
    icon: 'briefcase',
    color: '#bc52ee'
  },
  {
    question: '¿En qué te especializas?',
    answer: `Me especializo en diseño y optimización de procesos mediante herramientas Low-Code, integración de IA con aplicaciones propias o de terceros, creación de chatbots conversacionales, y desarrollo de software a medida.

## Áreas de Especialización

* **Diseño y optimización** de procesos mediante herramientas Low-Code
* **Integración de IA** con aplicaciones propias o de terceros
* **Creación de chatbots** conversacionales
* **Desarrollo de software** a medida
  `,
    icon: 'code',
    color: '#3245ff'
  },
  {
    question: '¿Cuántos años de experiencia tienes?',
    answer: `Tengo más de 8 años de experiencia en desarrollo de software y 1 año especializado en soluciones de inteligencia artificial y automatización. He trabajado en Digital Preventor como Software Developer desde julio de 2023, y también como freelance especialista en automatización con IA desde enero de 2024.

## Mi Experiencia Profesional

* **+8 años** en desarrollo de software
* **1 año** especializado en soluciones de IA y automatización
* **Actual:** Software Developer en Digital Preventor (desde julio 2023)
* **Freelance:** Especialista en automatización con IA (desde enero 2024)
  `,
    icon: 'clock',
    color: '#bc52ee'
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
  `,
    icon: 'academic-cap',
    color: '#3245ff'
  },
  {
    question: '¿En qué proyectos has trabajado?',
    answer: `He trabajado en diversos proyectos a lo largo de mi carrera, desde el desarrollo de aplicaciones web hasta la implementación de soluciones de automatización con IA.

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
  `,
  icon: 'folder',
  color: '#bc52ee'
  },
  {
    question: '¿Cuáles son tus habilidades técnicas?',
    answer: `Cuento con un amplio conjunto de habilidades técnicas que me permiten desarrollar soluciones completas y eficientes.

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
  `,
  icon: 'chip',
  color: '#3245ff'
  },
  {
    question: '¿Qué idiomas hablas?',
    answer: `Domino varios idiomas que me permiten comunicarme eficazmente en entornos internacionales.

## Idiomas

| Idioma | Nivel |
|--------|-------|
| Español | Nativo |
| Portugués | Avanzado |
| Inglés | Intermedio |
  `,
    icon: 'globe',
    color: '#bc52ee'
  },
  {
    question: '¿Cómo puedo contactarte?',
    answer: `Puedes contactarme a través de varios canales:

## Información de Contacto

* **Email:** giancarlo.zevallos.lecca@gmail.com
* **LinkedIn:** [linkedin.com/in/giancarlo-zevallos](https://www.linkedin.com/in/giancarlo-zevallos)
* **YouTube:** [youtube.com/@giancarlozevallos](https://www.youtube.com/@giancarlozevallos)
  `,
    icon: 'envelope',
    color: '#3245ff'
  },
  {
    question: '¿Algo más que quieras compartir?',
    answer: `## ¡Gracias por la charla!

Si quieres saber más, puedes preguntarme sobre:

* Mi experiencia profesional
* Proyectos en los que he trabajado
* Cómo podría contribuir a tu equipo

¡Espero tener noticias tuyas pronto!
  `,
    icon: 'chat',
    color: '#bc52ee'
  }
];