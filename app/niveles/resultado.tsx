import { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Texto from '../../template/Texto';
import { ScaleButton } from '../../template/AnimatedElements';
import {
	Add,
	TickCircle,
	CloseCircle,
	Lock,
	Clock,
} from 'iconsax-react-nativejs';
import { useSettings } from '../../lib/settings';

const dificultadLabel: Record<number, string> = {
	1: 'Novato',
	2: 'Intermedio',
	3: 'Avanzado',
	4: 'Experto',
	5: 'Leyenda',
};

function formatTime(seg: number) {
	const m = Math.floor(seg / 60)
		.toString()
		.padStart(2, '0');
	const s = (seg % 60).toString().padStart(2, '0');
	return `${m}:${s}`;
}

export default function NivelResultadoPage() {
	const params = useLocalSearchParams<{
		correctas: string;
		total: string;
		dificultad: string;
		tiempo: string;
	}>();

	const correctas = parseInt(params.correctas ?? '0', 10);
	const total = parseInt(params.total ?? '10', 10);
	const dificultad = parseInt(params.dificultad ?? '1', 10);
	const tiempo = parseInt(params.tiempo ?? '0', 10);
	const aprobado = correctas >= total; // llegar a la meta = nivel superado
	const siguienteDesbloqueado = aprobado && dificultad < 5;

	const { nivelesEstado } = useSettings();
	const siguienteNivel = nivelesEstado.find(
		n => n.dificultad === dificultad + 1
	);

	const fadeAnim = useRef(new Animated.Value(0)).current;
	const scoreScale = useRef(new Animated.Value(0.5)).current;

	useEffect(() => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 400,
				useNativeDriver: true,
			}),
			Animated.spring(scoreScale, {
				toValue: 1,
				friction: 5,
				tension: 80,
				useNativeDriver: true,
			}),
		]).start();
	}, []);

	return (
		<Animated.View style={{ flex: 1, opacity: fadeAnim }}>
			{/* Header */}
			<View className="flex-row justify-between items-center p-5">
				<TouchableOpacity
					className="w-ancho h-alto justify-center items-center card"
					onPress={() => router.replace('/')}
				>
					<Add
						color="white"
						size={28}
						style={{ transform: [{ rotate: '45deg' }] }}
					/>
				</TouchableOpacity>
				<Texto className="text-primario text-h2 font-pixel">
					{dificultadLabel[dificultad].toUpperCase()}
				</Texto>
				<View className="w-ancho" />
			</View>

			<View className="flex-1 justify-evenly mx-screen">
				{/* Score principal */}
				<Animated.View
					style={{ transform: [{ scale: scoreScale }] }}
					className="items-center justify-center gap-5  mx-auto w-80 h-80"
				>
					<Texto
						className="text-color font-pixel"
						style={{ fontSize: 120, lineHeight: 100 }}
					>
						{correctas}
					</Texto>
					<Texto className="text-segundario text-h3 font-pixel uppercase">
						{correctas === 1
							? 'bandera acertada'
							: 'banderas acertadas'}
					</Texto>
				</Animated.View>

				{/* Badge aprobado/reprobado */}
				<View className="items-center">
					<View
						className={`flex-row items-center gap-2 px-5 py-2 rounded-full ${aprobado ? 'bg-color/20 border border-color' : 'bg-red-500/20 border border-red-500'}`}
					>
						{aprobado ? (
							<TickCircle
								size={18}
								color="#a1ec3c"
								variant="Bold"
							/>
						) : (
							<CloseCircle
								size={18}
								color="#ef4444"
								variant="Bold"
							/>
						)}
						<Texto
							className={`text-h4 font-pixel ${aprobado ? 'text-color' : 'text-red-500'}`}
						>
							{aprobado ? 'NIVEL SUPERADO' : 'INTENTA DE NUEVO'}
						</Texto>
					</View>
				</View>

				{/* Stats */}
				<View className="flex-row gap-3">
					<View className="flex-1 bg-card rounded-rounded2 p-screen gap-2 items-center">
						<Texto className="text-segundario text-base">
							Puntaje
						</Texto>
						<Texto className="text-color text-h1 font-pixel">
							{correctas}
						</Texto>
					</View>
					<View className="flex-1 bg-card rounded-rounded2 p-screen gap-2 items-center">
						<Texto className="text-segundario text-base">
							Objetivo
						</Texto>
						<Texto className="text-primario text-h1 font-pixel">
							{total}
						</Texto>
					</View>
					<View className="flex-1 bg-card rounded-rounded2 p-screen gap-2 items-center">
						<Clock size={18} color="#a1ec3c" />
						<Texto className="text-segundario text-base">
							Tiempo
						</Texto>
						<Texto className="text-primario text-h2 font-pixel">
							{formatTime(tiempo)}
						</Texto>
					</View>
				</View>

				{/* Siguiente nivel desbloqueado */}
				{siguienteDesbloqueado && siguienteNivel && (
					<View className="bg-color/10 border border-color rounded-rounded2 p-screen flex-row items-center gap-4">
						<TickCircle size={26} color="#a1ec3c" variant="Bold" />
						<View className="flex-1">
							<Texto className="text-color text-h4 font-pixel">
								¡NIVEL DESBLOQUEADO!
							</Texto>
							<Texto className="text-segundario text-base">
								{dificultadLabel[dificultad + 1]} ya está
								disponible
							</Texto>
						</View>
					</View>
				)}

				{/* Si no superó, muestra qué necesita */}
				{!aprobado && (
					<View className="bg-red-500/10 border border-red-500/40 rounded-rounded2 p-screen flex-row items-center gap-4">
						<Lock size={24} color="#ef4444" variant="Bold" />
						<View className="flex-1">
							<Texto className="text-red-500 text-h4">
								Necesitas {total} aciertos para avanzar
							</Texto>
							<Texto className="text-segundario text-base">
								Obtuviste {correctas} aciertos
							</Texto>
						</View>
					</View>
				)}
			</View>

			{/* Botones */}
			<View className="gap-5 m-screen">
				{aprobado && dificultad < 5 && (
					<ScaleButton
						className="bg-color rounded-rounded py-5 items-center justify-center"
						onPress={() =>
							router.replace(`/niveles/${dificultad + 1}`)
						}
					>
						<Texto className="text-fondo text-h2 font-pixel">
							NIVEL {dificultad + 1} →
						</Texto>
					</ScaleButton>
				)}

				<ScaleButton
					className={`rounded-rounded py-5 items-center justify-center ${
						aprobado && dificultad < 5
							? 'bg-card border border-border'
							: 'bg-color'
					}`}
					onPress={() => router.replace(`/niveles/${dificultad}`)}
				>
					<Texto
						className={`text-h2 font-pixel ${
							aprobado && dificultad < 5
								? 'text-primario'
								: 'text-fondo'
						}`}
					>
						{aprobado ? 'REPETIR' : 'INTENTAR DE NUEVO'}
					</Texto>
				</ScaleButton>
			</View>
		</Animated.View>
	);
}
