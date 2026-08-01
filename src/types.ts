export interface Evidencia {
  id: string;
  nombre: string;
  descripcion: string;
  detalleFisico: string;
  icono?: string;
}

export interface Sospechoso {
  nombre: string;
  personalidad: 'arrogante' | 'nervioso' | 'frío' | 'encantador' | 'olvidadizo' | string;
  ocupacion: string;
  avatarUrl?: string;
  descripcion: string;
}

export interface Expediente {
  quePaso: string;
  donde: string;
  cuando: string;
  detalle: string;
}

export interface SecretTruth {
  esCulpable: boolean;
  culpableReal: string;
  secretoOculto: string;
  comoConectanPistas: string;
  contradiccionClave: string;
}

export interface Caso {
  id: string;
  titulo: string;
  expediente: Expediente;
  evidencias: Evidencia[];
  sospechoso: Sospechoso;
  declaracionInicial: string;
  secretTruth: SecretTruth;
}

export interface Message {
  id: string;
  sender: 'detective' | 'sospechoso' | 'sistema';
  text: string;
  mensajeNumero: number; // 1 to 10
  nervousnessLevel?: 'tranquilo' | 'prevenido' | 'nervioso' | 'acorralado' | 'desmoronado';
  contradictionDetected?: boolean;
  timestamp: string;
}

export type GameStatus = 'iniciar' | 'interrogando' | 'acusacion_pendiente' | 'resuelto';

export interface FinalSolution {
  esCulpable: boolean;
  secretoOculto: string;
  explicacionPistas: string;
  evaluacionDetective: string;
  calificacion: 'A+' | 'A' | 'B' | 'C' | 'F';
  mensajeVeredicto: string;
}
