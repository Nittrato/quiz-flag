import { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated, Easing } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Texto from '../template/Texto';
import { ScaleButton } from '../template/AnimatedElements';
import { Add, Star1, Clock, Chart } from 'iconsax-react-nativejs';
import CirculoProgreso from '../components/CirculoProgreso';

function formatTime(seg: number) {
	const m = Math.floor(seg / 60)
		.toString()
		.padStart(2, '0');
	const s = (seg % 60).toString().padStart(2, '0');
	return `${m}:${s}`;
}

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
					RESULTADOS
				</Texto>
				<View className="w-ancho" />
			</View>

			<View className="flex-1 justify-evenly mx-screen">
				{/* Círculo */}
				<View className="items-center">
					<CirculoProgreso porcentaje={porcentaje} />
				</View>

				{/* Racha + Tiempo */}
				<View className="flex-row gap-3">
					<View className="flex-1 bg-card rounded-rounded2 p-screen gap-2">
						<View className="w-14 h-14 rounded-rounded items-center justify-center bg-color/10">
							<Star1 size={20} color="#a1ec3c" variant="Bold" />
						</View>
						<Texto className="text-segundario text-h4">
							Racha maxima
						</Texto>
						<View className="flex-row items-baseline gap-1">
							<Texto className="text-color text-h1 font-pixel">
								{maxRacha}
							</Texto>
							<Texto className="text-segundario text-h4">
								Max
							</Texto>
						</View>
					</View>

					<View className="flex-1 bg-card rounded-rounded2 p-screen gap-2">
						<View className="w-14 h-14 rounded-rounded bg-trans items-center justify-center">
							<Clock size={20} color="white" />
						</View>
						<Texto className="text-segundario text-h4">
							Cronometro
						</Texto>
						<Texto className="text-primario text-h1 font-pixel">
							{formatTime(tiempo)}
						</Texto>
					</View>
				</View>

				{/* Analíticas */}
				<View className="bg-card rounded-rounded2 p-6 gap-5">
					<View className="flex-row justify-between items-center">
						<Texto className="text-segundario text-h4">
							Analíticas
						</Texto>
						<Chart size={18} color="#c6d0b6" variant="Bold" />
					</View>

					<View className="gap-2">
						<View className="flex-row justify-between">
							<View className="flex-row items-center gap-2">
								<View className="w-2 h-2 rounded-full bg-color" />
								<Texto className="text-primario text-base">
									Respuestas correctas
								</Texto>
							</View>
							<Texto className="text-color text-base font-pixel">
								{correctas}
							</Texto>
						</View>
						<BarraProgreso
							valor={correctas / total}
							color="#a1ec3c"
						/>
					</View>

					<View className="gap-2">
						<View className="flex-row justify-between">
							<View className="flex-row items-center gap-2">
								<View className="w-2 h-2 rounded-full bg-red-500" />
								<Texto className="text-primario text-base">
									Respuestas incorrectas
								</Texto>
							</View>
							<Texto className="text-red-500 text-base font-pixel">
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
					className="bg-color rounded-rounded py-5 items-center justify-center"
					onPress={() => router.replace('/')}
				>
					<Texto className="text-fondo text-h2 font-pixel">
						TERMINAR
					</Texto>
				</ScaleButton>
			</View>
		</Animated.View>
	);
}
