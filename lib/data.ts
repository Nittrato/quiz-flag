export const continentes = [
	{
		id: '1',
		name: 'Europa',
		region: 'Europe',
	},
	{
		id: '2',
		name: 'America',
		region: 'Americas',
	},
	{
		id: '3',
		name: 'Asia',
		region: 'Asia',
	},
	{
		id: '4',
		name: 'Africa',
		region: 'Africa',
	},
	{
		id: '5',
		name: 'Oceania',
		region: 'Oceania',
	},
];

export const niveles = [
	{
		id: '1',
		dificultad: 1,
		progreso: 0,
		estado: true,
	},
	{
		id: '2',
		dificultad: 2,
		progreso: 0,
		estado: false,
	},
	{
		id: '3',
		dificultad: 3,
		progreso: 0,
		estado: false,
	},
	{
		id: '4',
		dificultad: 4,
		progreso: 0,
		estado: false,
	},
	{
		id: '5',
		dificultad: 5,
		progreso: 0,
		estado: false,
	},
];

export interface Pais {
	nombre: string;
	bandera: string;
	region: string;
}

interface ApiCountry {
	name: string;
	region: string;
	flags: { png: string; svg: string };
	translations: { es?: string };
}

export async function getPaisesPorContinente(region: string): Promise<Pais[]> {
	const res = await fetch('https://apicountries.com/countries');
	if (!res.ok) throw new Error('Error al obtener los países');

	const data: ApiCountry[] = await res.json();

	return data
		.filter(c => c.region === region)
		.map(c => ({
			nombre: c.translations?.es ?? c.name,
			bandera: c.flags.png,
			region: c.region,
		}));
}

export async function getTodosLosPaises(): Promise<Pais[]> {
	const regiones = continentes.map(c => c.region);

	const res = await fetch('https://apicountries.com/countries');
	if (!res.ok) throw new Error('Error al obtener los países');

	const data: ApiCountry[] = await res.json();

	return data
		.filter(c => regiones.includes(c.region))
		.map(c => ({
			nombre: c.translations?.es ?? c.name,
			bandera: c.flags.png,
			region: c.region,
		}));
}
