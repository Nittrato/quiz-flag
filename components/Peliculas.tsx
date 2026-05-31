import { Image, Platform, TouchableOpacity, View } from 'react-native';
import Texto from '../template/Texto';
import { peliculas } from '../lib/data';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { FadeSlideView } from '../template/AnimatedElements';

export default function Peliculas() {
	const router = useRouter();

	return (
		<FadeSlideView className="flex flex-col mx-screen gap-4">
			<Texto className="text-h3 text-segundario mb-4">Peliculas</Texto>
			<View className="flex justify-between flex-row w-full flex-wrap">
				{peliculas.map(pelicula => (
					<TouchableOpacity
						key={pelicula.id}
						onPress={() => router.push(`/${pelicula.id}`)}
						style={{
							width: '48%',
							marginBottom: 16,
							height: 320,
						}}
						activeOpacity={0.6}
					>
						<View className="relative rounded-rounded overflow-hidden w-full h-full">
							<Image
								className="w-full h-full"
								source={{ uri: pelicula.image }}
								resizeMode="cover"
							/>
							<LinearGradient
								colors={['transparent', '#111111']}
								className="absolute inset-0 justify-end p-5"
							>
								<Texto
									className="text-primario text-h3 mb-1"
									numberOfLines={1}
								>
									{pelicula.name}
								</Texto>
								<View className="flex-row items-center">
									<Texto className="text-segundario text-base">
										{pelicula.year}
									</Texto>
									<Texto className="text-segundario mx-1 text-base">
										•
									</Texto>
									<Texto className="text-segundario text-base">
										{pelicula.duration}
									</Texto>
								</View>
							</LinearGradient>
						</View>
					</TouchableOpacity>
				))}
			</View>
		</FadeSlideView>
	);
}
