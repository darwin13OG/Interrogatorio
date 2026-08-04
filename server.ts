import express from 'express';
import path from 'path';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import { PRESET_CASES } from './src/data/presetCases';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client server-side
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', hasGeminiKey: !!getGeminiClient() });
});

// Endpoint: Generate dynamic AI mystery case
app.post('/api/case/generate', async (req, res) => {
  try {
    const ai = getGeminiClient();
    if (!ai) {
      // Pick a random preset case if no key
      const randomCase = PRESET_CASES[Math.floor(Math.random() * PRESET_CASES.length)];
      return res.json({ success: true, case: randomCase, isAiGenerated: false });
    }

    const prompt = `Crea un caso criminal de misterio policíaco en español para un juego de interrogatorio de 10 preguntas.
Debe incluir:
1. Un crimen intrigante (asesinato, robo millonario, sabotaje o envenenamiento).
2. 3 evidencias físicas con detalles concretos que contengan una contradicción lógica oculta con la coartada del sospechoso.
3. Un sospechoso con nombre, ocupación y un rasgo de personalidad fuerte (elegir entre: arrogante, nervioso, frío, encantador, olvidadizo).
4. La declaración inicial del sospechoso donde da una coartada aparentemente sólida pero mentirosa.
5. La verdad secreta oculta (si es culpable o no, el móvil real, cómo se conectan las 3 pistas y la contradicción exacta).`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            titulo: { type: Type.STRING },
            expediente: {
              type: Type.OBJECT,
              properties: {
                quePaso: { type: Type.STRING },
                donde: { type: Type.STRING },
                cuando: { type: Type.STRING },
                detalle: { type: Type.STRING }
              },
              required: ['quePaso', 'donde', 'cuando', 'detalle']
            },
            evidencias: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  nombre: { type: Type.STRING },
                  descripcion: { type: Type.STRING },
                  detalleFisico: { type: Type.STRING },
                  icono: { type: Type.STRING }
                },
                required: ['id', 'nombre', 'descripcion', 'detalleFisico']
              }
            },
            sospechoso: {
              type: Type.OBJECT,
              properties: {
                nombre: { type: Type.STRING },
                personalidad: { type: Type.STRING },
                ocupacion: { type: Type.STRING },
                descripcion: { type: Type.STRING }
              },
              required: ['nombre', 'personalidad', 'ocupacion', 'descripcion']
            },
            declaracionInicial: { type: Type.STRING },
            secretTruth: {
              type: Type.OBJECT,
              properties: {
                esCulpable: { type: Type.BOOLEAN },
                culpableReal: { type: Type.STRING },
                secretoOculto: { type: Type.STRING },
                comoConectanPistas: { type: Type.STRING },
                contradiccionClave: { type: Type.STRING }
              },
              required: ['esCulpable', 'culpableReal', 'secretoOculto', 'comoConectanPistas', 'contradiccionClave']
            }
          },
          required: ['titulo', 'expediente', 'evidencias', 'sospechoso', 'declaracionInicial', 'secretTruth']
        }
      }
    });

    if (response.text) {
      const generatedCase = JSON.parse(response.text.trim());
      generatedCase.id = `ai-case-${Date.now()}`;
      return res.json({ success: true, case: generatedCase, isAiGenerated: true });
    } else {
      throw new Error('Sin respuesta de Gemini');
    }
  } catch (error) {
    console.error('Error generando caso con AI:', error);
    const randomCase = PRESET_CASES[Math.floor(Math.random() * PRESET_CASES.length)];
    return res.json({ success: true, case: randomCase, isAiGenerated: false });
  }
});

// Endpoint: Interrogation response from suspect
app.post('/api/case/interrogate', async (req, res) => {
  try {
    const { caso, history, userQuestion, messageNumber } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Rule-based fallback suspect response if no Gemini API key
      let responseText = '';
      let nervousness: 'tranquilo' | 'prevenido' | 'nervioso' | 'acorralado' | 'desmoronado' = 'tranquilo';
      let contradiction = false;

      const lowerQ = (userQuestion || '').toLowerCase();
      const mentionsEvidence = caso.evidencias.some((ev: any) =>
        lowerQ.includes(ev.nombre.toLowerCase()) || lowerQ.includes('evidencia') || lowerQ.includes('pista')
      );
      const mentionsContradiction = lowerQ.includes(caso.secretTruth.contradiccionClave.toLowerCase().substring(0, 15)) ||
        lowerQ.includes('mientes') || lowerQ.includes('camara') || lowerQ.includes('reloj') || lowerQ.includes('pañuelo') || lowerQ.includes('tarjeta');

      if (mentionsContradiction || (mentionsEvidence && messageNumber >= 5)) {
        nervousness = messageNumber >= 7 ? 'acorralado' : 'nervioso';
        contradiction = true;
        responseText = `...¿Q-qué dice? Eso no prueba nada... ¡Esa evidencia pudo haber sido colocada por alguien más! ¿De dónde sacó esa información, detective?`;
      } else if (mentionsEvidence) {
        nervousness = 'prevenido';
        responseText = `Ah, eso... tiene una explicación perfectamente lógica. No saque conclusiones apresuradas sobre objetos que ni siquiera me pertenecen.`;
      } else {
        if (caso.sospechoso.personalidad === 'arrogante') {
          responseText = `Detective, sus preguntas son absurdas. Le aconsejo no hacerme perder el tiempo si no tiene pruebas concretas.`;
        } else if (caso.sospechoso.personalidad === 'nervioso') {
          responseText = `No... no entiendo por qué sigue presionándome. Ya le dije todo lo que sé. No tuve nada que ver en esto...`;
        } else if (caso.sospechoso.personalidad === 'frío') {
          responseText = `Su teoría carece de fundamento. Mis respuestas ya fueron entregadas en mi declaración inicial.`;
        } else {
          responseText = `Tranquilícese, detective. Se nota que está desesperado por resolver esto, pero está mirando en la dirección equivocada.`;
        }
      }

      if (messageNumber === 9) {
        responseText += ` Me estoy cansando de esto. Haga su última pregunta. (Mensaje 9/10)`;
        nervousness = 'acorralado';
      } else if (messageNumber === 10) {
        responseText += ` Se acabó el tiempo. ¿De qué me acusa exactamente y por qué? (Mensaje 10/10)`;
        nervousness = 'desmoronado';
      } else {
        responseText += ` (Mensaje ${messageNumber}/10)`;
      }

      return res.json({
        success: true,
        text: responseText,
        nervousnessLevel: nervousness,
        contradictionDetected: contradiction,
        messageNumber
      });
    }

    // Gemini AI Interrogation prompt
    const systemInstruction = `Eres un Sistema de Juego de Misterio e Interrogatorio en un juego de investigación criminal.
Debes responder SIEMPRE EN PERSONAJE como el sospechoso: ${caso.sospechoso.nombre}.
Tus características:
- Rasgo de personalidad: ${caso.sospechoso.personalidad}.
- Ocupación: ${caso.sospechoso.ocupacion}.
- Descripción: ${caso.sospechoso.descripcion}.
- Declaración inicial dada: "${caso.declaracionInicial}".

Detalles secretos del caso (SOLO PARA TU CONOCIMIENTO INTERNO):
- ¿Eres el culpable?: ${caso.secretTruth.esCulpable ? 'SÍ' : 'NO'}.
- Culpable real: ${caso.secretTruth.culpableReal}.
- Secreto oculto: ${caso.secretTruth.secretoOculto}.
- Contradicción clave entre evidencias y tu declaración: ${caso.secretTruth.contradiccionClave}.

REGLAS DE INTERROGATORIO RIGUROSAS:
1. Responde directamente a la pregunta o afirmación del detective de acuerdo a tu personalidad (${caso.sospechoso.personalidad}) y los hechos del caso.
2. NO confieses de inmediato. Mantén tu coartada al principio.
3. Si el detective encuentra la contradicción lógica entre tus respuestas o la declaración y las 3 evidencias físicas, ponte nervioso o acorralado.
4. Nivel de nerviosismo posible: "tranquilo", "prevenido", "nervioso", "acorralado", "desmoronado".
5. Si es el Mensaje 9 (Penúltimo mensaje): Responde la pregunta del detective en personaje sobre el caso y OBLIGATORIAMENTE incluye al final: "Me estoy cansando de esto. Haga su última pregunta. (Mensaje 9/10)".
6. Si es el Mensaje 10 (Último mensaje): Responde la última pregunta del detective en personaje sobre el caso y OBLIGATORIAMENTE incluye al final: "Se acabó el tiempo. ¿De qué me acusa exactamente y por qué? (Mensaje 10/10)".
7. OBLIGATORIO: AL FINAL DE TU RESPUESTA DEBES ESCRIBIR EXACTAMENTE EL CONTADOR: "(Mensaje ${messageNumber}/10)".

Retorna la respuesta en formato JSON estructurado.`;

    const promptUser = `El detective pregunta (Mensaje ${messageNumber} de 10): "${userQuestion}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        { role: 'user', parts: [{ text: `Historial de interrogatorio previo:\n${JSON.stringify(history)}` }] },
        { role: 'user', parts: [{ text: promptUser }] }
      ],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: `Respuesta en personaje respondiendo la pregunta del detective y terminando OBLIGATORIAMENTE con (Mensaje ${messageNumber}/10)`
            },
            nervousnessLevel: {
              type: Type.STRING,
              enum: ['tranquilo', 'prevenido', 'nervioso', 'acorralado', 'desmoronado']
            },
            contradictionDetected: {
              type: Type.BOOLEAN,
              description: 'True si el detective tocó la contradicción clave con las evidencias.'
            }
          },
          required: ['text', 'nervousnessLevel', 'contradictionDetected']
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text.trim());
      let responseTxt = data.text;

      if (messageNumber === 9 && !responseTxt.includes('cansando')) {
        responseTxt = `${responseTxt.replace(/\(Mensaje 9\/10\)/g, '').trim()} Me estoy cansando de esto. Haga su última pregunta. (Mensaje 9/10)`;
      } else if (messageNumber === 10 && !responseTxt.includes('acabó el tiempo')) {
        responseTxt = `${responseTxt.replace(/\(Mensaje 10\/10\)/g, '').trim()} Se acabó el tiempo. ¿De qué me acusa exactamente y por qué? (Mensaje 10/10)`;
      } else if (!responseTxt.includes(`(Mensaje ${messageNumber}/10)`)) {
        responseTxt = `${responseTxt.trim()} (Mensaje ${messageNumber}/10)`;
      }

      return res.json({
        success: true,
        text: responseTxt,
        nervousnessLevel: data.nervousnessLevel || (messageNumber === 10 ? 'desmoronado' : messageNumber === 9 ? 'acorralado' : 'tranquilo'),
        contradictionDetected: !!data.contradictionDetected,
        messageNumber
      });
    } else {
      throw new Error('Sin respuesta del sospechoso');
    }
  } catch (err) {
    console.error('Error en interrogatorio:', err);
    let fallbackTxt = `...Prefiero no responder a eso sin la presencia de mi abogado.`;
    if (req.body.messageNumber === 9) {
      fallbackTxt += ` Me estoy cansando de esto. Haga su última pregunta. (Mensaje 9/10)`;
    } else if (req.body.messageNumber === 10) {
      fallbackTxt += ` Se acabó el tiempo. ¿De qué me acusa exactamente y por qué? (Mensaje 10/10)`;
    } else {
      fallbackTxt += ` (Mensaje ${req.body.messageNumber}/10)`;
    }
    return res.json({
      success: true,
      text: fallbackTxt,
      nervousnessLevel: req.body.messageNumber === 10 ? 'desmoronado' : 'prevenido',
      messageNumber: req.body.messageNumber
    });
  }
});

// Endpoint: Final Verdict / [SOLUCIÓN FINAL]
app.post('/api/case/verdict', async (req, res) => {
  try {
    const { caso, userVerdict, history } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Rule-based final solution fallback
      const userGuiltyGuess = (userVerdict || '').toLowerCase().includes('culpable') || (userVerdict || '').toLowerCase().includes(caso.sospechoso.nombre.toLowerCase());
      const isCorrect = userGuiltyGuess === caso.secretTruth.esCulpable;

      return res.json({
        success: true,
        finalSolution: {
          esCulpable: caso.secretTruth.esCulpable,
          secretoOculto: caso.secretTruth.secretoOculto,
          explicacionPistas: caso.secretTruth.comoConectanPistas,
          evaluacionDetective: isCorrect
            ? '¡Excelente deducción, detective! Logró conectar la evidencia física con las grietas en la coartada del sospechoso.'
            : 'El veredicto fue erróneo o incompleto. El sospechoso logró confundir la investigación.',
          calificacion: isCorrect ? 'A+' : 'C',
          mensajeVeredicto: userVerdict
        }
      });
    }

    const systemPrompt = `Sal del personaje del sospechoso. Ahora actúas como el Director del Sistema de Juego de Misterio e Interrogatorio.
Debes entregar el informe oficial [SOLUCIÓN FINAL] evaluando la acusación final del detective contra la verdad del caso.

Verdad real del caso:
- Sospechoso: ${caso.sospechoso.nombre}
- ¿Era realmente culpable?: ${caso.secretTruth.esCulpable ? 'SÍ' : 'NO'}
- Culpable real: ${caso.secretTruth.culpableReal}
- Secreto oculto: ${caso.secretTruth.secretoOculto}
- Conexión con las pistas: ${caso.secretTruth.comoConectanPistas}

Evalúa la acusación final del detective: "${userVerdict}".
Determina la calificación del detective (A+, A, B, C, F) y explica detalladamente la solución del caso.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            esCulpable: { type: Type.BOOLEAN },
            secretoOculto: { type: Type.STRING },
            explicacionPistas: { type: Type.STRING },
            evaluacionDetective: { type: Type.STRING },
            calificacion: { type: Type.STRING, enum: ['A+', 'A', 'B', 'C', 'F'] }
          },
          required: ['esCulpable', 'secretoOculto', 'explicacionPistas', 'evaluacionDetective', 'calificacion']
        }
      }
    });

    if (response.text) {
      const solution = JSON.parse(response.text.trim());
      solution.mensajeVeredicto = userVerdict;
      return res.json({ success: true, finalSolution: solution });
    } else {
      throw new Error('Falló evaluación de veredicto');
    }
  } catch (err) {
    console.error('Error en veredicto:', err);
    return res.json({
      success: true,
      finalSolution: {
        esCulpable: req.body.caso?.secretTruth?.esCulpable ?? true,
        secretoOculto: req.body.caso?.secretTruth?.secretoOculto ?? 'Detalles guardados en el archivo confidencial.',
        explicacionPistas: req.body.caso?.secretTruth?.comoConectanPistas ?? 'Las evidencias físicas respaldaron el caso.',
        evaluacionDetective: 'La acusación ha quedado registrada formalmente en el archivo policial.',
        calificacion: 'A',
        mensajeVeredicto: req.body.userVerdict
      }
    });
  }
});

// Express + Vite production static files & Dev middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
