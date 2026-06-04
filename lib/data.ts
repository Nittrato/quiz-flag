export const continentes = [
	{ id: '1', name: 'Europa', region: 'Europe' },
	{ id: '2', name: 'America', region: 'Americas' },
	{ id: '3', name: 'Asia', region: 'Asia' },
	{ id: '4', name: 'Africa', region: 'Africa' },
	{ id: '5', name: 'Oceania', region: 'Oceania' },
];

export const niveles = [
	{ id: '1', dificultad: 1, progreso: 0, estado: true },
	{ id: '2', dificultad: 2, progreso: 0, estado: false },
	{ id: '3', dificultad: 3, progreso: 0, estado: false },
	{ id: '4', dificultad: 4, progreso: 0, estado: false },
	{ id: '5', dificultad: 5, progreso: 0, estado: false },
];

export interface Pais {
	nombre: string;
	bandera: string;
	region: string;
	subregion: string;
	independent: boolean;
	population: number;
}

interface ApiCountry {
	name: { common: string };
	region: string;
	subregion: string;
	flags: { png: string };
	translations: { spa?: { common: string } };
	independent: boolean;
	population: number;
}

// Subregiones consideradas "islas"
const SUBREGIONES_ISLAS = new Set([
	'Caribbean',
	'Micronesia',
	'Melanesia',
	'Polynesia',
	'Atlantic Ocean',
	'Indian Ocean',
]);

export function esIsla(c: {
	independent: boolean;
	subregion: string;
}): boolean {
	if (!c.independent) return true;
	if (SUBREGIONES_ISLAS.has(c.subregion)) return true;
	return false;
}

// Umbral de población por dificultad (de más conocido a más oscuro)
const UMBRAL_POBLACION: Record<number, [number, number]> = {
	1: [50_000_000, Infinity], // > 50M  — muy conocidos
	2: [10_000_000, 50_000_000], // 10M–50M
	3: [1_000_000, 10_000_000], // 1M–10M
	4: [100_000, 1_000_000], // 100K–1M
	5: [0, 100_000], // < 100K — micro-estados e islas
};

export function getPaisPorDificultad(
	paises: Pais[],
	dificultad: number
): Pais[] {
	const [min, max] = UMBRAL_POBLACION[dificultad] ?? [0, Infinity];
	const filtrados = paises.filter(
		p => p.population >= min && p.population < max
	);
	// Si el nivel tiene muy pocos países (p.ej. dificultad 5 con islas desactivadas)
	// amplía el pool con el nivel anterior para garantizar al menos 20 opciones
	if (filtrados.length < 20) {
		const [minAnterior] = UMBRAL_POBLACION[Math.max(1, dificultad - 1)] ?? [
			0,
			Infinity,
		];
		return paises.filter(
			p => p.population >= minAnterior && p.population < max
		);
	}
	return filtrados;
}

async function fetchPaises(): Promise<ApiCountry[]> {
	const res = await fetch(
		'https://restcountries.com/v3.1/all?fields=name,flags,region,subregion,translations,independent,population'
	);
	if (!res.ok) throw new Error('Error al obtener los países');
	return res.json();
}

function mapPais(c: ApiCountry): Pais {
	return {
		nombre: c.translations?.spa?.common ?? c.name.common,
		bandera: c.flags.png,
		region: c.region,
		subregion: c.subregion,
		independent: c.independent,
		population: c.population ?? 0,
	};
}

export async function getPaisesPorContinente(
	region: string,
	sinIslas = false
): Promise<Pais[]> {
	const data = await fetchPaises();
	return data
		.filter(
			c => c.region === region && c.flags.png && (!sinIslas || !esIsla(c))
		)
		.map(mapPais);
}

export async function getTodosLosPaises(sinIslas = false): Promise<Pais[]> {
	const regiones = continentes.map(c => c.region);
	const data = await fetchPaises();
	return data
		.filter(
			c =>
				regiones.includes(c.region) &&
				c.flags.png &&
				(!sinIslas || !esIsla(c))
		)
		.map(mapPais);
}
