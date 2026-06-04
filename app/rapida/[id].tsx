import { useState, useEffect, useRef } from 'react';
import {
	View,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	Animated,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getTodosLosPaises, Pais } from '../../lib/data';
import Texto from '../../template/Texto';
import { Add, Clock } from 'iconsax-react-nativejs';

const TIEMPO_INICIAL = 60;

function shuffle<T>(arr: T[]): T[] {
	return [...arr].sort(() => Math.random() - 0.5);
}

function getOpciones(pool: Pais[], correcto: Pais): Pais[] {
	const otros = pool.filter(p => p.nombre !== correcto.nombre);
	return shuffle([...shuffle(otros).slice(0, 3), correcto]);
}

export default function RapidaPage() {
	const [pool, setPool] = useState<Pais[]>([]);
	const [pregunta, setPregunta] = useState<Pais | null>(null);
	const [opciones, setOpciones] = useState<Pais[]>([]);
	const [cargando, setCargando] = useState(true);
	const [seleccionado, setSeleccionado] = useState<string | null>(null);
	const [correctas, setCorrectas] = useState(0);
	const [tiempoRestante, setTiempoRestante] = useState(TIEMPO_INICIAL);
	const [terminado, setTerminado] = useState(false);

	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const contadorScale = useRef(new Animated.Value(1)).current;

	// Carga todos los países
	useEffect(() => {
		getTodosLosPaises()
			.then(data => {
				setPool(data);
				const primera = shuffle(data)[0];
				setPregunta(primera);
				setOpciones(getOpciones(data, primera));
				setCargando(false);
			})
			.catch(() => setCargando(false));
	}, []);

	// Timer regresivo — arranca cuando carga
	useEffect(() => {
		if (cargando) return;
		timerRef.current = setInterval(() => {
			setTiempoRestante(t => {
				if (t <= 1) {
					clearInterval(timerRef.current!);
					setTerminado(true);
					return 0;
				}
				return t - 1;
			});
		}, 1000);
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [cargando]);

	// Cuando termina el tiempo navega a resultado
	useEffect(() => {
		if (terminado) {
			router.replace({
				pathname: '/rapida/resultado',
				params: { correctas, porTiempo: '1' },
			});
		}
	}, [terminado]);

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
		setOpciones(getOpciones(poolActual, nueva));
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
			setTimeout(() => siguientePregunta(pool, pregunta), 600);
		} else {
			// Falla → muestra el rojo 1 seg y termina
			if (timerRef.current) clearInterval(timerRef.current);
			setTimeout(() => {
				router.replace({
					pathname: '/rapida/resultado',
					params: { correctas, porTiempo: '0' },
				});
			}, 1000);
		}
	};

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

	const porcentajeTimer = (tiempoRestante / TIEMPO_INICIAL) * 100;
	const timerColor =
		tiempoRestante <= 10
			? '#ef4444'
			: tiempoRestante <= 20
				? '#f97316'
				: '#a1ec3c';

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

				{/* Barra de tiempo regresiva */}
				<View className="flex-1 mx-4 h-2 bg-border rounded-full overflow-hidden">
					<View
						style={{
							width: `${porcentajeTimer}%`,
							backgroundColor: timerColor,
						}}
						className="h-full rounded-full"
					/>
				</View>

				{/* Contador de tiempo */}
				<View className="flex-row gap-1 bg-card border border-border px-4 py-3 rounded-full items-center">
					<Clock size={18} color={timerColor} />
					<Texto className="text-h4" style={{ color: timerColor }}>
						{String(tiempoRestante).padStart(2, '0')}s
					</Texto>
				</View>
			</View>

			<View className="flex-1 justify-evenly mx-screen">
				{/* Pregunta */}
				<View>
					<Texto className="text-color text-h4">Partida Rápida</Texto>
					<Texto className="text-primario text-h1 font-pixel uppercase">
						¿De qué país es esta bandera?
					</Texto>
				</View>

				{/* Bandera */}
				<View className="card items-center justify-center p-4 h-72">
					{cargando || !pregunta ? (
						<ActivityIndicator size="large" color="#a1ec3c" />
					) : (
						<Image
							source={{ uri: pregunta.bandera }}
							className="w-full h-full rounded-rounded"
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
								<Texto className="text-primario text-h4 text-center px-2">
									{opcion.nombre}
								</Texto>
							</TouchableOpacity>
						);
					})}
				</View>

				{/* Score */}
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
