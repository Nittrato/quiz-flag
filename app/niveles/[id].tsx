import { useState, useEffect, useCallback, useRef } from 'react';
import {
	View,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	Animated,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getTodosLosPaises, Pais } from '../../lib/data';
import { useSettings } from '../../lib/settings';
import Texto from '../../template/Texto';
import { Add, ArrowRight, Clock } from 'iconsax-react-nativejs';

// Segundos por pregunta según dificultad
const TIEMPO_POR_DIFICULTAD: Record<number, number> = {
	1: 0, // sin límite
	2: 0, // sin límite
	3: 30,
	4: 20,
	5: 12,
};

const TOTAL_PREGUNTAS = 10;

function shuffle<T>(arr: T[]): T[] {
	return [...arr].sort(() => Math.random() - 0.5);
}

// En dificultades altas, las opciones incorrectas son del mismo continente
function getOpciones(pool: Pais[], correcto: Pais, dificultad: number): Pais[] {
	const mismoRegion = pool.filter(
		p => p.nombre !== correcto.nombre && p.region === correcto.region
	);
	const otros = pool.filter(
		p => p.nombre !== correcto.nombre && p.region !== correcto.region
	);

	// dificultad 1-2: opciones random; 3-5: más del mismo continente
	const cuantasMismaRegion =
		dificultad >= 3
			? Math.min(3, mismoRegion.length)
			: Math.min(dificultad - 1, mismoRegion.length);
	const relleno = 3 - cuantasMismaRegion;

	const seleccionadas = [
		...shuffle(mismoRegion).slice(0, cuantasMismaRegion),
		...shuffle(otros).slice(0, relleno),
	];
	return shuffle([...seleccionadas, correcto]);
}

function formatTime(seg: number) {
	return `${String(Math.floor(seg / 60)).padStart(2, '0')}:${String(seg % 60).padStart(2, '0')}`;
}

export default function NivelPage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const dificultad = parseInt(id ?? '1', 10);
	const { completarNivel } = useSettings();

	const tiempoPorPregunta = TIEMPO_POR_DIFICULTAD[dificultad] ?? 0;
	const conTimer = tiempoPorPregunta > 0;

	const [pool, setPool] = useState<Pais[]>([]);
	const [paises, setPaises] = useState<Pais[]>([]);
	const [cargando, setCargando] = useState(true);
	const [indice, setIndice] = useState(0);
	const [opciones, setOpciones] = useState<Pais[]>([]);
	const [seleccionado, setSeleccionado] = useState<string | null>(null);
	const [correctas, setCorrectas] = useState(0);
	const [errores, setErrores] = useState(0);
	const [tiempoRestante, setTiempoRestante] = useState(tiempoPorPregunta);

	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const contadorScale = useRef(new Animated.Value(1)).current;

	useEffect(() => {
		getTodosLosPaises()
			.then(data => {
				const mezclados = shuffle(data).slice(0, TOTAL_PREGUNTAS);
				setPool(data);
				setPaises(mezclados);
				setOpciones(getOpciones(data, mezclados[0], dificultad));
				setCargando(false);
			})
			.catch(() => setCargando(false));
	}, []);

	// Timer por pregunta (solo dificultad ≥ 3)
	useEffect(() => {
		if (!conTimer || cargando || seleccionado) return;
		setTiempoRestante(tiempoPorPregunta);
		timerRef.current = setInterval(() => {
			setTiempoRestante(t => {
				if (t <= 1) {
					clearInterval(timerRef.current!);
					// Tiempo agotado = respuesta incorrecta automática
					setSeleccionado('__timeout__');
					setErrores(e => e + 1);
					return 0;
				}
				return t - 1;
			});
		}, 1000);
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [indice, cargando]);

	const paisActual = paises[indice];

	const animarContador = () => {
		contadorScale.setValue(1.2);
		Animated.spring(contadorScale, {
			toValue: 1,
			friction: 4,
			useNativeDriver: true,
		}).start();
	};

	const handleSeleccionar = (nombre: string) => {
		if (seleccionado) return;
		if (timerRef.current) clearInterval(timerRef.current);
		setSeleccionado(nombre);
		if (nombre === paisActual?.nombre) {
			setCorrectas(c => c + 1);
		} else {
			setErrores(e => e + 1);
		}
		animarContador();
	};

	const handleSiguiente = useCallback(() => {
		const correctasFinales =
			correctas + (seleccionado === paisActual?.nombre ? 1 : 0);
		if (indice + 1 >= TOTAL_PREGUNTAS) {
			completarNivel(dificultad, correctasFinales, TOTAL_PREGUNTAS);
			router.replace({
				pathname: '/niveles/resultado',
				params: {
					correctas: correctasFinales,
					total: TOTAL_PREGUNTAS,
					dificultad,
				},
			});
			return;
		}
		const nuevoIndice = indice + 1;
		setIndice(nuevoIndice);
		setSeleccionado(null);
		setOpciones(getOpciones(pool, paises[nuevoIndice], dificultad));
	}, [indice, paises, pool, correctas, seleccionado, dificultad]);

	const progreso = (indice / TOTAL_PREGUNTAS) * 100;

	const getOpcionClases = (opcion: Pais) => {
		const esCorrecta = opcion.nombre === paisActual?.nombre;
		const esSeleccionada = opcion.nombre === seleccionado;
		if (seleccionado && esCorrecta)
			return 'bg-green-500/20 border-green-500';
		if (seleccionado && esSeleccionada)
			return 'bg-red-500/20 border-red-500';
		return 'bg-card border-border';
	};

	// Color del timer según tiempo restante
	const timerColor = !conTimer
		? '#a1ec3c'
		: tiempoRestante <= 5
			? '#ef4444'
			: tiempoRestante <= 10
				? '#f97316'
				: '#a1ec3c';

	const dificultadLabel: Record<number, string> = {
		1: 'Novato',
		2: 'Intermedio',
		3: 'Avanzado',
		4: 'Experto',
		5: 'Leyenda',
	};

	return (
		<View className="flex-1">
			{/* Header */}
			<View className="flex-row justify-between items-center p-5">
				<TouchableOpacity
					className="bg-card w-ancho h-alto justify-center items-center rounded-rounded2"
					onPress={() => {
						if (timerRef.current) clearInterval(timerRef.current);
						router.back();
					}}
				>
					<Add
						color="white"
						size={28}
						style={{ transform: [{ rotate: '45deg' }] }}
					/>
				</TouchableOpacity>

				{/* Barra de progreso */}
				<View className="flex-1 mx-4 h-2 bg-border rounded-full overflow-hidden">
					<View
						style={{ width: `${progreso}%` }}
						className="h-full bg-color rounded-full"
					/>
				</View>

				{/* Timer */}
				<View className="flex-row gap-1 bg-card border border-border px-4 py-3 rounded-full items-center">
					<Clock size={18} color={timerColor} />
					<Texto className="text-h4" style={{ color: timerColor }}>
						{conTimer
							? `${tiempoRestante}s`
							: `${indice + 1}/${TOTAL_PREGUNTAS}`}
					</Texto>
				</View>
			</View>

			<View className="flex-1 justify-evenly mx-screen">
				{/* Pregunta */}
				<View>
					<Texto className="text-color text-h4">
						{dificultadLabel[dificultad]} — Pregunta{' '}
						{String(indice + 1).padStart(2, '0')}/{TOTAL_PREGUNTAS}
					</Texto>
					<Texto className="text-primario text-h1 font-pixel uppercase">
						¿De qué país es esta bandera?
					</Texto>
				</View>

				{/* Bandera */}
				<View className="card items-center justify-center p-4 h-72">
					{cargando || !paisActual ? (
						<ActivityIndicator size="large" color="#a1ec3c" />
					) : (
						<Image
							source={{ uri: paisActual.bandera }}
							className="w-full h-full rounded-rounded"
							resizeMode="cover"
						/>
					)}
				</View>

				{/* Opciones */}
				<View className="flex-row flex-wrap gap-3 justify-between">
					{opciones.map(opcion => {
						const esCorrecta = opcion.nombre === paisActual?.nombre;
						const esSeleccionada = opcion.nombre === seleccionado;
						return (
							<TouchableOpacity
								key={opcion.nombre}
								className={`border rounded-rounded2 w-[48%] h-28 items-center justify-center
									${getOpcionClases(opcion)}
									${seleccionado && !esCorrecta && !esSeleccionada ? 'opacity-40' : ''}`}
								onPress={() => handleSeleccionar(opcion.nombre)}
								disabled={!!seleccionado}
							>
								<Texto className="text-primario text-h3 text-center px-2">
									{opcion.nombre}
								</Texto>
							</TouchableOpacity>
						);
					})}
				</View>

				{/* Contador correctas / errores */}
				<Animated.View
					style={{ transform: [{ scale: contadorScale }] }}
					className="self-center"
				>
					<View className="bg-card border border-border px-7 py-3 rounded-rounded2 flex-row items-center gap-5">
						<Texto className="text-color text-h3 font-pixel">
							x{correctas}
						</Texto>
						<View className="w-px h-6 bg-border" />
						<Texto className="text-red-500 text-h3 font-pixel">
							x{errores}
						</Texto>
					</View>
				</Animated.View>

				{/* Botón siguiente */}
				<TouchableOpacity
					className={`rounded-rounded2 flex-row gap-4 py-5 justify-center items-center ${seleccionado ? 'bg-color' : 'bg-card opacity-40'}`}
					onPress={seleccionado ? handleSiguiente : undefined}
					disabled={!seleccionado}
				>
					<Texto
						className={`text-h2 font-pixel ${seleccionado ? 'text-fondo' : 'text-primario'}`}
					>
						SIGUIENTE
					</Texto>
					<ArrowRight
						size={28}
						color={seleccionado ? '#100e14' : 'white'}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
}
