import { useState, useEffect, useRef, useCallback } from 'react';
import {
	View,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	Animated,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getTodosLosPaises, getPaisPorDificultad, Pais } from '../../lib/data';
import { useSettings } from '../../lib/settings';
import Texto from '../../template/Texto';
import { Add, Clock } from 'iconsax-react-nativejs';

// Segundos por pregunta según dificultad
const TIEMPO_POR_DIFICULTAD: Record<number, number> = {
	1: 0, // sin límite
	2: 0, // sin límite
	3: 30,
	4: 20,
	5: 12,
};

// Aciertos consecutivos para superar el nivel
const META_NIVEL = 10;

const dificultadLabel: Record<number, string> = {
	1: 'Novato',
	2: 'Intermedio',
	3: 'Avanzado',
	4: 'Experto',
	5: 'Leyenda',
};

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
	const [pregunta, setPregunta] = useState<Pais | null>(null);
	const [opciones, setOpciones] = useState<Pais[]>([]);
	const [cargando, setCargando] = useState(true);
	const [seleccionado, setSeleccionado] = useState<string | null>(null);
	const [correctas, setCorrectas] = useState(0);
	const [tiempoRestante, setTiempoRestante] = useState(tiempoPorPregunta);
	const [tiempoAgotado, setTiempoAgotado] = useState(false);
	const [timer, setTimer] = useState(0);

	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const contadorScale = useRef(new Animated.Value(1)).current;
	const finalizadoRef = useRef(false);

	// Carga todos los países
	useEffect(() => {
		getTodosLosPaises()
			.then(data => {
				const poolDificultad = getPaisPorDificultad(data, dificultad);
				setPool(poolDificultad);
				const primera = shuffle(poolDificultad)[0];
				setPregunta(primera);
				setOpciones(getOpciones(poolDificultad, primera, dificultad));
				setCargando(false);
			})
			.catch(() => setCargando(false));
	}, [dificultad]);

	// Cronómetro general (mismo estilo que la partida rápida)
	useEffect(() => {
		if (!cargando) {
			timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
		}
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [cargando]);

	// Timer por pregunta (solo dificultad >= 3)
	useEffect(() => {
		if (
			!conTimer ||
			cargando ||
			!pregunta ||
			seleccionado ||
			tiempoAgotado ||
			finalizadoRef.current
		)
			return;
		setTiempoRestante(tiempoPorPregunta);
		const ref = setInterval(() => {
			setTiempoRestante(t => {
				if (t <= 1) {
					clearInterval(ref);
					setTiempoAgotado(true);
					return 0;
				}
				return t - 1;
			});
		}, 1000);
		return () => clearInterval(ref);
	}, [
		pregunta,
		cargando,
		seleccionado,
		tiempoAgotado,
		conTimer,
		tiempoPorPregunta,
	]);

	// Falla → detiene cronómetros, muestra el rojo 1 seg y termina
	const finalizarPartida = useCallback(
		(respuesta: string) => {
			if (finalizadoRef.current) return;
			finalizadoRef.current = true;
			if (timerRef.current) clearInterval(timerRef.current);
			setSeleccionado(respuesta || '__timeout__');
			completarNivel(dificultad, correctas, META_NIVEL);
			setTimeout(() => {
				router.replace({
					pathname: '/niveles/resultado',
					params: {
						correctas,
						total: META_NIVEL,
						dificultad,
						tiempo: timer,
					},
				});
			}, 1000);
		},
		[correctas, timer, dificultad, completarNivel]
	);

	// Tiempo agotado = respuesta incorrecta automática
	useEffect(() => {
		if (tiempoAgotado && !finalizadoRef.current) {
			finalizarPartida('__timeout__');
		}
	}, [tiempoAgotado, finalizarPartida]);

	// Alcanzó la meta: nivel superado
	const superarNivel = () => {
		if (finalizadoRef.current) return;
		finalizadoRef.current = true;
		if (timerRef.current) clearInterval(timerRef.current);
		completarNivel(dificultad, META_NIVEL, META_NIVEL);
		router.replace({
			pathname: '/niveles/resultado',
			params: {
				correctas: META_NIVEL,
				total: META_NIVEL,
				dificultad,
				tiempo: timer,
			},
		});
	};

	const animarBoton = () => {
		contadorScale.setValue(1.15);
		Animated.spring(contadorScale, {
			toValue: 1,
			friction: 4,
			useNativeDriver: true,
		}).start();
	};

	const siguientePregunta = (poolActual: Pais[], actual: Pais) => {
		const nueva = shuffle(
			poolActual.filter(p => p.nombre !== actual.nombre)
		)[0];
		setPregunta(nueva);
		setOpciones(getOpciones(poolActual, nueva, dificultad));
		setSeleccionado(null);
	};

	const handleSeleccionar = (nombre: string) => {
		if (seleccionado || !pregunta) return;
		setSeleccionado(nombre);
		const esCorrecta = nombre === pregunta.nombre;

		if (esCorrecta) {
			const nuevasCorrectas = correctas + 1;
			setCorrectas(nuevasCorrectas);
			animarBoton();
			// Pausa breve para ver el verde y pasa a la siguiente
			setTimeout(() => {
				if (nuevasCorrectas >= META_NIVEL) {
					superarNivel();
					return;
				}
				siguientePregunta(pool, pregunta);
			}, 600);
		} else {
			// Falla → la partida termina
			finalizarPartida(nombre);
		}
	};

	// Color del timer según tiempo restante
	const timerColor = !conTimer
		? '#a1ec3c'
		: tiempoRestante <= 5
			? '#ef4444'
			: tiempoRestante <= 10
				? '#f97316'
				: '#a1ec3c';

	// Colores dinámicos de opciones
	const getOpcionClases = (opcion: Pais) => {
		const esCorrecta = opcion.nombre === pregunta?.nombre;
		const esSeleccionada = opcion.nombre === seleccionado;
		if (seleccionado && esCorrecta)
			return 'bg-green-500/20 border-green-500';
		if (seleccionado && esSeleccionada)
			return 'bg-red-500/20 border-red-500';
		return 'bg-card border-border';
	};

	return (
		<View className="flex-1">
			{/* Header */}
			<View className="flex-row justify-between items-center p-5">
				<TouchableOpacity
					className="card w-ancho h-alto justify-center items-center"
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

				{/* Timer */}
				<View className="flex-row gap-1 bg-card border border-border px-4 py-3 rounded-full items-center">
					<Clock size={18} color={conTimer ? timerColor : 'white'} />
					<Texto
						className={
							conTimer ? 'text-h4' : 'text-primario text-h4'
						}
						style={conTimer ? { color: timerColor } : undefined}
					>
						{conTimer ? `${tiempoRestante}s` : formatTime(timer)}
					</Texto>
				</View>
			</View>

			<View className="flex-1 justify-evenly mx-screen">
				{/* Pregunta */}
				<View>
					<Texto className="text-color text-h4">
						{dificultadLabel[dificultad]}
					</Texto>
					<Texto className="text-primario text-h1 font-pixel uppercase">
						¿De qué país es esta bandera?
					</Texto>
				</View>

				{/* Bandera */}
				<View className="card items-center justify-center p-4">
					{cargando || !pregunta ? (
						<ActivityIndicator size="large" color="#a1ec3c" />
					) : (
						<Image
							source={pregunta.bandera}
							className="w-full rounded-rounded"
							resizeMode="cover"
						/>
					)}
				</View>

				{/* Opciones */}
				<View className="flex-row flex-wrap gap-3 justify-between">
					{opciones.map(opcion => {
						const esCorrecta = opcion.nombre === pregunta?.nombre;
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

				{/* Puntaje */}
				<Animated.View
					style={{ transform: [{ scale: contadorScale }] }}
					className="self-center"
				>
					<View className="bg-card border border-border px-8 py-3 rounded-rounded2 flex-row items-center gap-3">
						<Texto className="text-segundario text-h4">
							Puntaje
						</Texto>
						<Texto className="text-color text-h2 font-pixel">
							{correctas}
						</Texto>
					</View>
				</Animated.View>
			</View>
		</View>
	);
}
