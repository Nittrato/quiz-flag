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
import { useSettings } from '../../lib/settings';

function shuffle<T>(arr: T[]): T[] {
	return [...arr].sort(() => Math.random() - 0.5);
}

function getOpciones(pool: Pais[], correcto: Pais): Pais[] {
	const otros = pool.filter(p => p.nombre !== correcto.nombre);
	return shuffle([...shuffle(otros).slice(0, 3), correcto]);
}

function formatTime(seg: number) {
	const m = Math.floor(seg / 60)
		.toString()
		.padStart(2, '0');
	const s = (seg % 60).toString().padStart(2, '0');
	return `${m}:${s}`;
}

export default function RapidaPage() {
	const { sinIslas } = useSettings();
	const [pool, setPool] = useState<Pais[]>([]);
	const [pregunta, setPregunta] = useState<Pais | null>(null);
	const [opciones, setOpciones] = useState<Pais[]>([]);
	const [cargando, setCargando] = useState(true);
	const [seleccionado, setSeleccionado] = useState<string | null>(null);
	const [correctas, setCorrectas] = useState(0);
	const [timer, setTimer] = useState(0);

	const contadorScale = useRef(new Animated.Value(1)).current;
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	// Carga todos los países
	useEffect(() => {
		getTodosLosPaises(sinIslas)
			.then(data => {
				setPool(data);
				const primera = shuffle(data)[0];
				setPregunta(primera);
				setOpciones(getOpciones(data, primera));
				setCargando(false);
			})
			.catch(() => setCargando(false));
	}, []);

	useEffect(() => {
		if (!cargando) {
			timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
		}
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [cargando]);

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
			// Falla → detiene el cronómetro, muestra el rojo 1 seg y termina
			if (timerRef.current) clearInterval(timerRef.current);
			setTimeout(() => {
				router.replace({
					pathname: '/rapida/resultado',
					params: { correctas, tiempo: timer },
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
					<Clock size={18} color="white" />
					<Texto className="text-primario text-h4">
						{formatTime(timer)}
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
