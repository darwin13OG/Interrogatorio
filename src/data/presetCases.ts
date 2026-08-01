import { Caso } from '../types';

export const PRESET_CASES: Caso[] = [
  {
    id: 'caso-reloj-roto',
    titulo: 'El Misterio de la Mansión Blackwood',
    expediente: {
      quePaso: 'Asesinato del magnate financiero Arthur Blackwood en su estudio privado por impacto en la cabeza.',
      donde: 'Estudio principal de la Mansión Blackwood (ala norte, 2° piso).',
      cuando: 'Viernes 14 de noviembre, entre las 22:00 y las 23:00 hs.',
      detalle: 'La puerta estaba cerrada por dentro pero la ventana del balcón quedó entreabierta. La víctima fue encontrada tendida junto a su escritorio.'
    },
    evidencias: [
      {
        id: 'ev-1',
        nombre: 'Reloj de Bolsillo Roto',
        descripcion: 'Reloj de oro de la víctima detenido a las 22:15 hs con grietas en el cristal.',
        detalleFisico: 'Marcado con el horario exacto de las 22:15 hs. Muestra rastros de polvo de mármol del jarrón roto de la chimenea.',
        icono: 'Watch'
      },
      {
        id: 'ev-2',
        nombre: 'Pañuelo de Seda Manchado',
        descripcion: 'Pañuelo bordado con las iniciales "V.M." empapado en perfume de lavanda y restos de copa de vino.',
        detalleFisico: 'Hallado debajo del escritorio de Arthur. Tiene rastros de maquillaje costoso y vino tinto Pinot Noir.',
        icono: 'FileText'
      },
      {
        id: 'ev-3',
        nombre: 'Registro de Seguridad del Garaje',
        descripcion: 'Informe automático de cámaras del portón trasero de la propiedad.',
        detalleFisico: 'Muestra que el vehículo de Víctor Mendoza ingresó a las 21:45 hs y no registró salida hasta las 22:40 hs.',
        icono: 'Camera'
      }
    ],
    sospechoso: {
      nombre: 'Víctor Mendoza',
      personalidad: 'arrogante',
      ocupacion: 'Socio Comercial y Heredero Minoritario',
      descripcion: 'Hombre elegante de 42 años, viste traje a medida. Muestra una actitud altanera y despectiva hacia la policía.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
    },
    declaracionInicial: 'Miren, detective, pierden su tiempo. Yo estuve en mi club privado jugando póquer toda la noche hasta pasadas las 23:00. No piso la mansión de Arthur desde la semana pasada. Arthur tenía muchos enemigos comerciales; busquen por otro lado.',
    secretTruth: {
      esCulpable: true,
      culpableReal: 'Víctor Mendoza',
      secretoOculto: 'Víctor estaba en bancarrota por deudas de juego y Arthur iba a desheredarlo esa misma noche tras descubrir un desfalco de $2 millones.',
      comoConectanPistas: 'El registro del garaje (Evidencia #3) demuestra que su auto estuvo en la mansión de 21:45 a 22:40, destruyendo su coartada del club. El pañuelo con sus iniciales V.M. (Evidencia #2) cayó durante el forcejeo, y el reloj roto a las 22:15 (Evidencia #1) fija la hora exacta de la pelea fatal.',
      contradiccionClave: 'Víctor afirma haber estado en el club privado a las 22:00 hs, pero el registro de cámaras del garaje prueba que entró a la mansión a las 21:45 hs y se fue a las 22:40 hs.'
    }
  },
  {
    id: 'caso-galeria-arte',
    titulo: 'El Robo del Diamante Azul de Valdivia',
    expediente: {
      quePaso: 'Sustitución y robo del célebre Diamante Azul de 50 quilates por una réplica de cristal de bajo valor.',
      donde: 'Galería de Arte Moderno del Centro Cultural.',
      cuando: 'Sábado 3 de mayo durante el apagón de mantenimiento de las 03:00 a las 03:30 AM.',
      detalle: 'El sistema láser fue burlado con una tarjeta maestra. No hubo violencia física ni cristales rotos.'
    },
    evidencias: [
      {
        id: 'ev-101',
        nombre: 'Tarjeta Accesos del Sistema',
        descripcion: 'Tarjeta magnética usada a las 03:12 AM en la bóveda principal.',
        detalleFisico: 'Código asignado a la Jefa de Seguridad Sofía Ruiz. Presenta restos de lubricante sintético de cerrojo.',
        icono: 'Key'
      },
      {
        id: 'ev-102',
        nombre: 'Guante de Látex Rasgado',
        descripcion: 'Hallado en el conducto de ventilación posterior de la sala de vitrinas.',
        detalleFisico: 'Contiene restos de polvos cosméticos de talco perfumado y una quemadura ácida menor.',
        icono: 'Shield'
      },
      {
        id: 'ev-103',
        nombre: 'Fotografía de la Cámara Auxiliar',
        descripcion: 'Captura infrarroja de la entrada de servicio a las 03:25 AM.',
        detalleFisico: 'Muestra a una persona de baja estatura saliendo con un estuche negro con cojera notable en la pierna izquierda.',
        icono: 'Image'
      }
    ],
    sospechoso: {
      nombre: 'Sofía Ruiz',
      personalidad: 'nervioso',
      ocupacion: 'Jefa de Seguridad de la Galería',
      descripcion: 'Mujer de 35 años, aspecto exhausto y con tendencia a morderse las uñas al responder.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
    },
    declaracionInicial: '¡Se lo juro por mi vida, inspector! Estaba en la sala de control comiendo un sándwich cuando ocurrió el apagón. Perdí mi tarjeta de acceso hace dos días y lo reporté por escrito al director... ¡alguien me está tendiendo una trampa!',
    secretTruth: {
      esCulpable: false,
      culpableReal: 'El Director de la Galería, Julián Castro',
      secretoOculto: 'Sofía vendió su tarjeta de acceso a Julián Castro por dinero para pagar el tratamiento médico de su hijo, pero ella no realizó el robo físico directamente.',
      comoConectanPistas: 'La tarjeta usada a las 03:12 AM era efectivamente de Sofía (Evidencia #101), lo que la incrimina. Sin embargo, la foto infrarroja (Evidencia #103) muestra al ladrón cojeando de la pierna izquierda (Julián Castro cojea por una lesión antigua, mientras Sofía camina normal). Sofía mintió sobre haber reportado la tarjeta perdida para encubrir la venta ilegal.',
      contradiccionClave: 'Sofía afirma que perdió la tarjeta hace 2 días y que estuvo en la sala de control todo el tiempo, pero nunca existió reporte formal en el libro diario de extravíos.'
    }
  },
  {
    id: 'caso-teatro-veneno',
    titulo: 'Envenenamiento en el Camerino Real',
    expediente: {
      quePaso: 'La primera actriz Elena Rostova colapsó convulsionando tras consumir su copa de champán tras el estreno.',
      donde: 'Camerino principal del Teatro Imperial.',
      cuando: 'Jueves 20 de agosto a las 22:30 hs.',
      detalle: 'El análisis toxicológico preliminar detectó cianuro disuelto en la botella vintage reservada exclusivamente para el elenco principal.'
    },
    evidencias: [
      {
        id: 'ev-201',
        nombre: 'Frasco de Alquimia de Vidrio Ámbar',
        descripcion: 'Frasco pequeño hallado en el basurero del callejón del teatro.',
        detalleFisico: 'Contiene trazas de cianuro de potasio y huellas dactilares parciales de tiza de utilería.',
        icono: 'FlaskConical'
      },
      {
        id: 'ev-202',
        nombre: 'Carta de Amenaza Anónima',
        descripcion: 'Nota mecanografiada encontrada en el tocador de Elena.',
        detalleFisico: 'Dice: "Esta noche tu voz se apagará para siempre". Falta la tecla "E" alineada correctamente.',
        icono: 'Mail'
      },
      {
        id: 'ev-203',
        nombre: 'Entrada de Utilería y Vestuario',
        descripcion: 'Bitácora de llaves de acceso tras bambalinas entre las 21:30 y las 22:15 hs.',
        detalleFisico: 'Firma de entrada de Damián Vance a las 22:05 hs para "entrega de flores".',
        icono: 'BookOpen'
      }
    ],
    sospechoso: {
      nombre: 'Damián Vance',
      personalidad: 'frío',
      ocupacion: 'Actor de Reparto y Coprotagonista',
      descripcion: 'Hombre de 40 años, mirada distante y voz calmada. Responde sin inmutarse ni mostrar emoción.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'
    },
    declaracionInicial: 'Elena era una diva caprichosa, pero una profesional admirable. Yo estaba en mi camerino ensayando el Acto II durante todo el intermedio. Jamás me acerqué a su botella de champán.',
    secretTruth: {
      esCulpable: true,
      culpableReal: 'Damián Vance',
      secretoOculto: 'Damián estaba furioso porque Elena amenazó con sacarlo de la obra revelando que él robaba fondos de la producción.',
      comoConectanPistas: 'Damián sostiene que estuvo en su camerino todo el intermedio, pero la bitácora de utilería (Evidencia #203) demuestra que firmó el acceso tras bambalinas a las 22:05 hs con la excusa de entregar flores. El frasco de cianuro (Evidencia #201) tenía trazas de tiza blanca de caracterización que él usa en su maquillaje.',
      contradiccionClave: 'Damián declara que no se acercó al área de Elena en todo el intermedio, pero la bitácora oficial demuestra su ingreso firmado a las 22:05 hs.'
    }
  }
];
