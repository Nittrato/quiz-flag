import { useState, useEffect, useCallback, useRef } from 'react';
import {
	View,
	TouchableOpacity,
	Image,
	ActivityIndicator,
	Animated,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { continentes, getPaisesPorContinente, Pais } from '../../lib/data';
import Texto from '../../template/Texto';
import { Add, ArrowRight, Clock } from 'iconsax-react-nativejs';
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

export default function ContinentePage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const continente = continentes.find(c => c.id === id);
	const { sinIslas } = useSettings();

	const [paises, setPaises] = useState<Pais[]>([]);
	const [pool, setPool] = useState<Pais[]>([]);
	const [cargando, setCargando] = useState(true);
	const [indice, setIndice] = useState(0);
	const [opciones, setOpciones] = useState<Pais[]>([]);
	const [seleccionado, setSeleccionado] = useState<string | null>(null);
	const [correctas, setCorrectas] = useState(0);
	const [errores, setErrores] = useState(0);
	const [racha, setRacha] = useState(0);
	const [maxRacha, setMaxRacha] = useState(0);
	const [timer, setTimer] = useState(0);

	const contadorScale = useRef(new Animated.Value(1)).current;
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const totalPreguntas = 10;

	useEffect(() => {
		if (!cargando) {
			timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
		}
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [cargando]);

	useEffect(() => {
		if (!continente) return;
		setCargando(true);
		getPaisesPorContinente(continente.region, sinIslas)
			.then(data => {
				const mezclados = shuffle(data).slice(0, totalPreguntas);
				setPool(data);
				setPaises(mezclados);
				setOpciones(getOpciones(data, mezclados[0]));
				setCargando(false);
			})
			.catch(() => setCargando(false));
	}, []);

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
		setSeleccionado(nombre);
		const esCorrecta = nombre === paisActual?.nombre;
		if (esCorrecta) {
			const nuevaRacha = racha + 1;
			setCorrectas(c => c + 1);
			setRacha(nuevaRacha);
			setMaxRacha(m => Math.max(m, nuevaRacha));
		} else {
			setErrores(e => e + 1);
			setRacha(0);
		}
		animarContador();
	};

	const handleSiguiente = useCallback(() => {
		const correctasFinales =
			correctas + (seleccionado === paisActual?.nombre ? 1 : 0);
		if (indice + 1 >= totalPreguntas) {
			if (timerRef.current) clearInterval(timerRef.current);
			router.replace({
				pathname: '/continente/resultado',
				params: {
					correctas: correctasFinales,
					total: totalPreguntas,
					maxRacha,
					continente: continente?.name ?? '',
					tiempo: timer,
				},
			});
			return;
		}
		const nuevoIndice = indice + 1;
		setIndice(nuevoIndice);
		setSeleccionado(null);
		setOpciones(getOpciones(pool, paises[nuevoIndice]));
	}, [indice, paises, pool, correctas, maxRacha, seleccionado, timer]);

	const progreso = (indice / totalPreguntas) * 100;
	const enRacha = racha >= 3;

	const getOpcionClasses = (opcion: Pais) => {
		const esCorrecta = opcion.nombre === paisActual?.nombre;
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
					onPress={() => router.back()}
				>
					<Add
						color="white"
						size={28}
						style={{ transform: [{ rotate: '45deg' }] }}
					/>
				</TouchableOpacity>

				{/* Barra de progreso */}
				<View className="flex-1 mx-5 h-2 bg-border rounded-full overflow-hidden">
					<View
						style={{ width: `${progreso}%` }}
						className="h-full bg-color rounded-full"
					/>
				</View>

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
					<Texto className="text-color text-h4">
						Pregunta {String(indice + 1).padStart(2, '0')}/
						{totalPreguntas}
					</Texto>
					<Texto className="text-primario text-h1 font-pixel uppercase">
						¿De qué país de {continente?.name} es esta bandera?
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
								className={`border rounded-rounded2 w-[48%] h-28 p-4 items-center justify-center
									${getOpcionClasses(opcion)}
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

				{/* Contador / Racha */}
				<Animated.View
					style={{ transform: [{ scale: contadorScale }] }}
					className="self-center"
				>
					{enRacha ? (
						<View className="px-7 py-3 rounded-rounded2 flex-row items-center border border-color bg-color/15">
							<Texto className="text-color text-h3 font-pixel">
								🔥 RACHA x{racha}
							</Texto>
						</View>
					) : (
						<View className="bg-card border border-border px-7 py-3 rounded-rounded2 flex-row items-center gap-5">
							<Texto className="text-color text-h3 font-pixel">
								x{correctas}
							</Texto>
							<View className="w-px h-6 bg-border" />
							<Texto className="text-red-500 text-h3 font-pixel">
								x{errores}
							</Texto>
						</View>
					)}
				</Animated.View>
			</View>
			{/* Botón siguiente */}
			<TouchableOpacity
				className={`rounded-rounded2 flex-row gap-4 py-5 m-screen justify-center items-center ${seleccionado ? 'bg-color' : 'bg-card opacity-40'}`}
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
	);
}
