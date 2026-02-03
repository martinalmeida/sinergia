export interface ConfigState {
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

export interface HomeState {
  home: Home;
  setHome: (home: Home) => void;
}

export interface Home {
	//Administrador
	usuarios?: number;
	activos?: number;
	//Instrumentista
	todas?: number;
	pendientes?: number;
	proceso?: number;
	asignadas?: number;
	completas?: number;
	completadas?: number;
	cumplimiento?: number;
	mesActual?: string;
	//Coordinador
	cooHoy?: number;
	cooPendientes?: number;
	cooCompletadas?: number;
	arrPendientes?: Pendientes[];
	totalPendientes?: number;
	arrCompletadas?: Completadas[];
	totalCompletadas?: number;
}

export interface Pendientes {
  AMQ_CODA: string;
  USU_NOMB: string;
  CANT: number;
}

export interface Completadas {
  AMQ_CODA: string;
  USU_NOMB: string;
  CANT: number;
}