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

	// Arranca el timer cuando carga
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
		getPaisesPorContinente(continente.region)
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
				pathname: '/resultado',
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

	return (
		<View className="flex-1">
			{/* Header */}
			<View className="flex-row justify-between items-center p-5">
				<TouchableOpacity
					className="bg-card p-3 rounded-full"
					onPress={() => router.back()}
				>
					<Add
						color="white"
						size={28}
						style={{ transform: [{ rotate: '45deg' }] }}
					/>
				</TouchableOpacity>

				{/* Barra de progreso */}
				<View className="h-2 bg-border rounded-full overflow-hidden flex-1 mx-5">
					<View
						style={{ width: `${progreso}%` }}
						className="h-full bg-color rounded-full"
					/>
				</View>

				{/* Timer */}
				<View className="flex-row gap-1.5 bg-card border border-border px-4 py-3 rounded-full items-center">
					<Clock size={18} color="white" />
					<Texto className="text-white text-h4">
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
					<Texto className="text-primario text-h1">
						¿De qué país de {continente?.name} es esta bandera?
					</Texto>
				</View>

				{/* Bandera */}
				<View
					className="card items-center justify-center p-4"
					style={{ height: 230 }}
				>
					{cargando || !paisActual ? (
						<ActivityIndicator size="large" color="#a1ec3c" />
					) : (
						<Image
							source={{ uri: paisActual.bandera }}
							style={{
								width: '100%',
								height: '100%',
							}}
							resizeMode="cover"
							className="rounded-3xl border-4 border-border"
						/>
					)}
				</View>

				{/* Opciones */}
				<View className="flex-row flex-wrap gap-4 justify-between">
					{opciones.map(opcion => {
						const esCorrecta = opcion.nombre === paisActual?.nombre;
						const esSeleccionada = opcion.nombre === seleccionado;

						let bg = '#19151f';
						let borderColor = '#27222e';
						if (seleccionado) {
							if (esCorrecta) {
								bg = 'rgba(34,197,94,0.2)';
								borderColor = '#22c55e';
							} else if (esSeleccionada) {
								bg = 'rgba(239,68,68,0.2)';
								borderColor = '#ef4444';
							}
						}

						return (
							<TouchableOpacity
								key={opcion.nombre}
								style={{
									backgroundColor: bg,
									borderWidth: 1,
									borderColor,
									borderRadius: 22,
									height: 100,
									width: '48%',
									opacity:
										seleccionado &&
										!esCorrecta &&
										!esSeleccionada
											? 0.4
											: 1,
								}}
								className=" items-center justify-center"
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

				{/* Contador / Racha */}
				<Animated.View
					style={{ transform: [{ scale: contadorScale }] }}
					className="self-center"
				>
					{enRacha ? (
						<View
							className="px-7 py-3.5 rounded-2xl flex-row items-center gap-5"
							style={{
								backgroundColor: 'rgba(161,236,60,0.15)',
								borderWidth: 1,
								borderColor: '#a1ec3c',
							}}
						>
							<Texto
								style={{
									color: '#a1ec3c',
									fontSize: 18,
									fontFamily: 'Bus',
								}}
							>
								🔥 RACHA x{racha}
							</Texto>
						</View>
					) : (
						<View className="bg-card border border-border px-7 py-3.5 rounded-2xl flex-row items-center gap-5">
							<Texto
								style={{
									color: '#a1ec3c',
									fontSize: 18,
									fontFamily: 'Bus',
								}}
							>
								x{correctas}
							</Texto>
							<View className="w-px h-6 bg-border" />
							<Texto
								style={{
									color: '#ef4444',
									fontSize: 18,
									fontFamily: 'Bus',
								}}
							>
								x{errores}
							</Texto>
						</View>
					)}
				</Animated.View>

				{/* Botón siguiente */}
				<TouchableOpacity
					className={`rounded-rounded2 flex-row gap-4 py-5 justify-center items-center ${seleccionado ? 'bg-color' : 'bg-card opacity-40'}`}
					onPress={seleccionado ? handleSiguiente : undefined}
					disabled={!seleccionado}
				>
					<Texto
						style={{
							color: seleccionado ? '#100e14' : 'white',
							fontSize: 24,
							fontFamily: 'Bus',
						}}
					>
						SIGUIENTE
					</Texto>
					<ArrowRight
						size={28}
						color={seleccionado ? '#100e14' : 'gray'}
					/>
				</TouchableOpacity>
			</View>
		</View>
	);
}
