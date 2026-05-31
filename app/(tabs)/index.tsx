import { useState } from 'react';
import { View, Image, ScrollView, Text, TouchableOpacity } from 'react-native';
import Texto from '../../template/Texto';
import { perfil } from '../../lib/data';
import Buscador from '../../components/Buscador';
import Peliculas from '../../components/Peliculas';
import { router } from 'expo-router';
import { ScaleButton } from '../../template/AnimatedElements';
import { FadeSlideView } from '../../template/AnimatedElements';

export default function Home() {
	// menu desplegable vacio
	const [isMenuOpen, setIsMenuOpen] = useState(false);

	// datos de data.ts
	const { nombre, image } = perfil;

	return (
		<ScrollView
			className="flex-1"
			contentContainerStyle={{ paddingBottom: 100 }}
			showsVerticalScrollIndicator={false}
		>
			<View className="flex flex-row pt-16 mx-screen items-center justify-between">
				<View>
					<Texto className="text-segundario text-h3">
						Bienvenido {nombre} 👏
					</Texto>
					<Texto className="text-primario text-h2">
						Listo para ver algo ?
					</Texto>
				</View>
				<TouchableOpacity onPress={() => setIsMenuOpen(!isMenuOpen)}>
					<Image
						source={{ uri: image }}
						className="w-ancho h-alto rounded-full"
					/>
				</TouchableOpacity>
			</View>

			{/* Menu desplegable de iconos */}
			{isMenuOpen && (
				<FadeSlideView>
					<View className="flex m-screen p-5 rounded-rounded2 bg-card border border-border">
						<Texto className="text-primario text-h3">Menu</Texto>
					</View>
				</FadeSlideView>
			)}

			<Buscador />

			<Peliculas />
		</ScrollView>
	);
}
