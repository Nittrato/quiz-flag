import { peliculas } from '../lib/data';
import { router, useLocalSearchParams } from 'expo-router';
import {
	View,
	Image,
	ScrollView,
	TouchableOpacity,
	Platform,
} from 'react-native';
import Texto from '../template/Texto';
import { ArrowLeft2 } from 'iconsax-react-nativejs';
import { LinearGradient } from 'expo-linear-gradient';
import { FadeSlideView, ScaleButton } from '../template/AnimatedElements';

export default function PeliculaPage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const pelicula = peliculas.find(pelicula => pelicula.id === id);

	if (!pelicula) {
		return (
			<View className="flex-1 bg-black items-center justify-center">
				<Texto className="text-white">Película no encontrada</Texto>
			</View>
		);
	}

	const { name, image, year, rating, description } = pelicula;

	return (
		<View className="flex-1 justify-between">
			{/* Hero Section */}
			<View className="relative h-[680px]">
				<Image
					source={{ uri: image }}
					className="w-full h-full"
					resizeMode="cover"
				/>

				<LinearGradient
					colors={['transparent', 'rgba(17, 17, 17, 0.7)', '#111111']}
					className="absolute inset-0"
				/>

				{/* Header Controls */}

				<TouchableOpacity
					className="absolute web:backdrop-blur-md bg-fondo/50 top-6 left-6 w-ancho h-alto rounded-rounded2 items-center justify-center z-10"
					onPress={() => router.back()}
				>
					<ArrowLeft2 color="white" size={20} />
				</TouchableOpacity>

				{/* Title & Description Overlay */}
				<View className="absolute bottom-0 left-6 right-6">
					<FadeSlideView>
						<View className="bg-color/10 self-start px-2 py-1 rounded-xl mb-3">
							<Texto className="text-color text-base">
								{year} • ⭐{rating}
							</Texto>
						</View>
						<Texto className="text-primario font-bold text-h1 mb-4">
							{name}
						</Texto>
						<Texto className="text-segundario text-h4 leading-7">
							{description}
						</Texto>
					</FadeSlideView>
				</View>
			</View>

			<ScaleButton
				className="m-6 bg-color h-alto2 rounded-rounded2 items-center justify-center"
				onPress={() => router.push('/')}
			>
				<Texto className="text-fondo font-bold text-h3">
					Ver Pelicula
				</Texto>
			</ScaleButton>
		</View>
	);
}
