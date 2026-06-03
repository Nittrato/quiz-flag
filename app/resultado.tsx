import { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, Easing } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Texto from '../template/Texto';
import { ScaleButton } from '../template/AnimatedElements';
import { Add, Star1, Clock, Chart } from 'iconsax-react-nativejs';

// ── Utilidades ─────────────────────────────────────────────────
function formatTime(seg: number) {
	const m = Math.floor(seg / 60)
		.toString()
		.padStart(2, '0');
	const s = (seg % 60).toString().padStart(2, '0');
	return `${m}:${s}`;
}

// ── Círculo de progreso ─────────────────────────────────────────
const SIZE = 200;
const THICKNESS = 14;
const HALF = SIZE / 2;

function CirculoProgreso({ porcentaje }: { porcentaje: number }) {
	const [angulo, setAngulo] = useState(0);
	const anim = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.timing(anim, {
			toValue: porcentaje,
			duration: 1200,
			delay: 300,
			easing: Easing.out(Easing.cubic),
			useNativeDriver: false,
		}).start();
		const id = anim.addListener(({ value }) => setAngulo(value * 3.6));
		return () => anim.removeListener(id);
	}, []);

	const mostrarDerecha = angulo > 180;
	const rot1 = Math.min(angulo, 180) - 180;
	const rot2 = mostrarDerecha ? angulo - 360 : -180;

	return (
		<View
			style={{
				width: SIZE,
				height: SIZE,
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			{/* Pista gris */}
			<View
				style={{
					position: 'absolute',
					width: SIZE,
					height: SIZE,
					borderRadius: HALF,
					borderWidth: THICKNESS,
					borderColor: '#27222e',
				}}
			/>
			{/* Semicírculo izquierdo */}
			{angulo > 0 && (
				<View
					style={{
						position: 'absolute',
						width: HALF,
						height: SIZE,
						left: 0,
						overflow: 'hidden',
					}}
				>
					<View
						style={{
							position: 'absolute',
							width: SIZE,
							height: SIZE,
							borderRadius: HALF,
							borderWidth: THICKNESS,
							borderColor: '#a1ec3c',
							transform: [{ rotate: `${rot1}deg` }],
						}}
					/>
				</View>
			)}
			{/* Semicírculo derecho */}
			{mostrarDerecha && (
				<View
					style={{
						position: 'absolute',
						width: HALF,
						height: SIZE,
						right: 0,
						overflow: 'hidden',
					}}
				>
					<View
						style={{
							position: 'absolute',
							right: 0,
							width: SIZE,
							height: SIZE,
							borderRadius: HALF,
							borderWidth: THICKNESS,
							borderColor: '#a1ec3c',
							transform: [{ rotate: `${rot2}deg` }],
						}}
					/>
				</View>
			)}
			{/* Número central */}
			<NumeroAnimado anim={anim} />
		</View>
	);
}

function NumeroAnimado({ anim }: { anim: Animated.Value }) {
	const [num, setNum] = useState(0);
	useEffect(() => {
		const id = anim.addListener(({ value }) => setNum(Math.round(value)));
		return () => anim.removeListener(id);
	}, []);
	return (
		<Texto
			style={{
				color: '#a1ec3c',
				fontSize: 52,
				fontFamily: 'Bus',
				letterSpacing: 2,
			}}
		>
			{num}%
		</Texto>
	);
}

// ── Barra animada ───────────────────────────────────────────────
function BarraProgreso({ valor, color }: { valor: number; color: string }) {
	const anim = useRef(new Animated.Value(0)).current;
	useEffect(() => {
		Animated.timing(anim, {
			toValue: valor,
			duration: 1000,
			delay: 600,
			easing: Easing.out(Easing.cubic),
			useNativeDriver: false,
		}).start();
	}, []);
	const width = anim.interpolate({
		inputRange: [0, 1],
		outputRange: ['0%', '100%'],
	});
	return (
		<View className="h-2 bg-border rounded-full overflow-hidden">
			<Animated.View
				style={{
					height: '100%',
					width,
					backgroundColor: color,
					borderRadius: 99,
				}}
			/>
		</View>
	);
}

// ── Pantalla ────────────────────────────────────────────────────
export default function ResultadoPage() {
	const params = useLocalSearchParams<{
		correctas: string;
		total: string;
		maxRacha: string;
		continente: string;
		tiempo: string;
	}>();

	const correctas = parseInt(params.correctas ?? '0', 10);
	const total = parseInt(params.total ?? '10', 10);
	const maxRacha = parseInt(params.maxRacha ?? '0', 10);
	const continente = params.continente ?? '';
	const tiempo = parseInt(params.tiempo ?? '0', 10);
	const porcentaje = Math.round((correctas / total) * 100);

	const fadeAnim = useRef(new Animated.Value(0)).current;
	useEffect(() => {
		Animated.timing(fadeAnim, {
			toValue: 1,
			duration: 500,
			useNativeDriver: true,
		}).start();
	}, []);

	return (
		<Animated.View style={{ flex: 1, opacity: fadeAnim }}>
			{/* Header */}
			<View className="flex-row justify-between items-center p-5">
				<TouchableOpacity
					className="bg-card p-3 rounded-full"
					onPress={() => router.replace('/')}
				>
					<Add
						color="white"
						size={28}
						style={{ transform: [{ rotate: '45deg' }] }}
					/>
				</TouchableOpacity>
				<Texto
					style={{
						color: '#a1ec3c',
						fontSize: 16,
						fontFamily: 'Bus',
					}}
				>
					RESULTADOS
				</Texto>
				<View className="w-12" />
			</View>

			<View className="flex-1 justify-evenly px-5">
				{/* Círculo */}
				<View className="items-center">
					<CirculoProgreso porcentaje={porcentaje} />
					<Texto className="text-segundario text-h4 mt-4">
						{continente}
					</Texto>
				</View>

				{/* Racha + Tiempo */}
				<View className="flex-row gap-3">
					<View className="flex-1 bg-card rounded-3xl p-5 gap-2">
						<View
							className="w-11 h-11 rounded-2xl items-center justify-center"
							style={{ backgroundColor: 'rgba(161,236,60,0.12)' }}
						>
							<Star1 size={22} color="#a1ec3c" variant="Bold" />
						</View>
						<Texto
							style={{
								color: '#c6d0b6',
								fontSize: 11,
								letterSpacing: 2,
							}}
						>
							RACHA MAXIMA
						</Texto>
						<View className="flex-row items-baseline gap-1.5">
							<Texto
								style={{
									color: '#a1ec3c',
									fontSize: 36,
									fontFamily: 'Bus',
								}}
							>
								{maxRacha}
							</Texto>
							<Texto className="text-segundario text-base">
								MAX
							</Texto>
						</View>
					</View>

					<View className="flex-1 bg-card rounded-3xl p-5 gap-2">
						<View className="w-11 h-11 rounded-2xl bg-trans items-center justify-center">
							<Clock size={22} color="white" />
						</View>
						<Texto
							style={{
								color: '#c6d0b6',
								fontSize: 11,
								letterSpacing: 2,
							}}
						>
							CRONOMETRO
						</Texto>
						<Texto
							style={{
								color: 'white',
								fontSize: 30,
								fontFamily: 'Bus',
								letterSpacing: 2,
							}}
						>
							{formatTime(tiempo)}
						</Texto>
					</View>
				</View>

				{/* Answer analysis */}
				<View className="bg-card rounded-3xl p-5 gap-4">
					<View className="flex-row justify-between items-center">
						<Texto
							style={{
								color: '#c6d0b6',
								fontSize: 11,
								letterSpacing: 2,
							}}
						>
							Analiticas:
						</Texto>
						<Chart size={18} color="#c6d0b6" />
					</View>

					<View className="gap-1.5">
						<View className="flex-row justify-between">
							<View className="flex-row items-center gap-2">
								<View className="w-2 h-2 rounded-full bg-color" />
								<Texto className="text-primario text-base">
									Respuestas correctas
								</Texto>
							</View>
							<Texto
								style={{
									color: '#a1ec3c',
									fontSize: 14,
									fontFamily: 'Bus',
								}}
							>
								{correctas}
							</Texto>
						</View>
						<BarraProgreso
							valor={correctas / total}
							color="#a1ec3c"
						/>
					</View>

					<View className="gap-1.5">
						<View className="flex-row justify-between">
							<View className="flex-row items-center gap-2">
								<View className="w-2 h-2 rounded-full bg-red-500" />
								<Texto className="text-primario text-base">
									Respuestas incorrectas
								</Texto>
							</View>
							<Texto
								style={{
									color: '#ef4444',
									fontSize: 14,
									fontFamily: 'Bus',
								}}
							>
								{total - correctas}
							</Texto>
						</View>
						<BarraProgreso
							valor={(total - correctas) / total}
							color="#ef4444"
						/>
					</View>
				</View>

				{/* CTA */}
				<ScaleButton
					className="bg-color rounded-full py-5 items-center justify-center"
					onPress={() => router.replace('/')}
				>
					<Texto
						style={{
							color: '#100e14',
							fontSize: 20,
							fontFamily: 'Bus',
							letterSpacing: 3,
						}}
					>
						TERMINAR
					</Texto>
				</ScaleButton>
			</View>
		</Animated.View>
	);
}
