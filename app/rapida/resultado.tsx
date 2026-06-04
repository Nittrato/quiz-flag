import { useEffect, useRef } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Texto from '../../template/Texto';
import { ScaleButton } from '../../template/AnimatedElements';
import { Add, Star1, CloseCircle } from 'iconsax-react-nativejs';

export default function RapidaResultadoPage() {
	const params = useLocalSearchParams<{
		correctas: string;
		porTiempo: string;
	}>();

	const correctas = parseInt(params.correctas ?? '0', 10);
	const porTiempo = params.porTiempo === '1';

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
					PARTIDA RÁPIDA
				</Texto>
				<View className="w-ancho" />
			</View>

			<View className="flex-1 justify-evenly mx-screen">
				{/* Motivo de fin */}
				<View
					className={`rounded-rounded2 p-screen flex-row items-center gap-4 ${porTiempo ? 'bg-border' : 'bg-red-500/15'}`}
				>
					{porTiempo ? (
						<Star1 size={26} color="#a1ec3c" variant="Bold" />
					) : (
						<CloseCircle size={26} color="#ef4444" variant="Bold" />
					)}
					<View>
						<Texto
							className={`text-h3 font-pixel ${porTiempo ? 'text-color' : 'text-red-500'}`}
						>
							{porTiempo
								? '¡TIEMPO AGOTADO!'
								: '¡RESPUESTA INCORRECTA!'}
						</Texto>
						<Texto className="text-segundario text-base">
							{porTiempo
								? 'Se acabaron los 60 segundos'
								: 'La racha se cortó'}
						</Texto>
					</View>
				</View>

				{/* Score principal */}
				<Animated.View
					style={{ transform: [{ scale: scoreScale }] }}
					className="items-center gap-3"
				>
					<Texto className="text-segundario text-h4">
						Puntaje final
					</Texto>
					<Texto
						className="text-color font-pixel"
						style={{ fontSize: 96, lineHeight: 100 }}
					>
						{correctas}
					</Texto>
					<Texto className="text-segundario text-h4">
						{correctas === 1
							? 'bandera acertada'
							: 'banderas acertadas'}
					</Texto>
				</Animated.View>

				{/* Mensaje según puntaje */}
				<View className="bg-card rounded-rounded2 p-screen items-center gap-2">
					<Texto className="text-primario text-h3 text-center">
						{correctas === 0 && '¡Sigue practicando!'}
						{correctas >= 1 && correctas < 5 && '¡Buen intento!'}
						{correctas >= 5 && correctas < 10 && '¡Muy bien!'}
						{correctas >= 10 && correctas < 20 && '¡Excelente!'}
						{correctas >= 20 && '🏆 ¡Eres un experto!'}
					</Texto>
					<Texto className="text-segundario text-base text-center">
						{correctas > 0
							? `Conseguiste ${correctas} ${correctas === 1 ? 'punto' : 'puntos'} en esta partida`
							: 'Intenta llegar al menos a 5 puntos'}
					</Texto>
				</View>

				{/* Botones */}
			</View>

			{/* Botones */}
			<View className="gap-4 m-5">
				<ScaleButton
					className="bg-color rounded-rounded2 py-5 items-center justify-center"
					onPress={() => router.replace('/rapida/1')}
				>
					<Texto className="text-fondo text-h2 font-pixel">
						JUGAR DE NUEVO
					</Texto>
				</ScaleButton>

				<ScaleButton
					className="bg-card border border-border rounded-rounded2 py-5 items-center justify-center"
					onPress={() => router.replace('/')}
				>
					<Texto className="text-primario text-h2 font-pixel">
						VOLVER AL INICIO
					</Texto>
				</ScaleButton>
			</View>
		</Animated.View>
	);
}
