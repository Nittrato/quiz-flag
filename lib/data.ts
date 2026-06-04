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
	name: { common: string };
	region: string;
	flags: { png: string };
	translations: { spa?: { common: string } };
}

async function fetchPaises(): Promise<ApiCountry[]> {
	const res = await fetch(
		'https://restcountries.com/v3.1/all?fields=name,flags,region,translations'
	);
	if (!res.ok) throw new Error('Error al obtener los países');
	return res.json();
}

function mapPais(c: ApiCountry): Pais {
	return {
		nombre: c.translations?.spa?.common ?? c.name.common,
		bandera: c.flags.png,
		region: c.region,
	};
}

export async function getPaisesPorContinente(region: string): Promise<Pais[]> {
	const data = await fetchPaises();
	return data.filter(c => c.region === region && c.flags.png).map(mapPais);
}

export async function getTodosLosPaises(): Promise<Pais[]> {
	const regiones = continentes.map(c => c.region);
	const data = await fetchPaises();
	return data
		.filter(c => regiones.includes(c.region) && c.flags.png)
		.map(mapPais);
}
