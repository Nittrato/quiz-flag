import { createContext, useContext, useState, ReactNode } from 'react';

export interface NivelEstado {
	id: string;
	dificultad: number;
	progreso: number; // 0-100
	estado: boolean; // desbloqueado
}

interface Settings {
	sinIslas: boolean;
	setSinIslas: (v: boolean) => void;
	nivelesEstado: NivelEstado[];
	completarNivel: (
		dificultad: number,
		correctas: number,
		total: number
	) => void;
}

const nivelesInicial: NivelEstado[] = [
	{ id: '1', dificultad: 1, progreso: 0, estado: true },
	{ id: '2', dificultad: 2, progreso: 0, estado: false },
	{ id: '3', dificultad: 3, progreso: 0, estado: false },
	{ id: '4', dificultad: 4, progreso: 0, estado: false },
	{ id: '5', dificultad: 5, progreso: 0, estado: false },
];

const SettingsContext = createContext<Settings>({
	sinIslas: false,
	setSinIslas: () => {},
	nivelesEstado: nivelesInicial,
	completarNivel: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
	const [sinIslas, setSinIslas] = useState(false);
	const [nivelesEstado, setNivelesEstado] =
		useState<NivelEstado[]>(nivelesInicial);

	const completarNivel = (
		dificultad: number,
		correctas: number,
		total: number
	) => {
		const progreso = Math.round((correctas / total) * 100);
		setNivelesEstado(prev =>
			prev.map(n => {
				if (n.dificultad === dificultad) {
					return { ...n, progreso: Math.max(n.progreso, progreso) };
				}
				// Solo desbloquea el siguiente si este nivel se completó al 100%
				if (n.dificultad === dificultad + 1 && progreso === 100) {
					return { ...n, estado: true };
				}
				return n;
			})
		);
	};

	return (
		<SettingsContext.Provider
			value={{ sinIslas, setSinIslas, nivelesEstado, completarNivel }}
		>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettings() {
	return useContext(SettingsContext);
}
