import { useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import Texto from '../../template/Texto';
import { Play, Map1, Star1, Clock } from 'iconsax-react-nativejs';
import { useRouter } from 'expo-router';
import { ScaleButton } from '../../template/AnimatedElements';
import Niveles from '../../components/Niveles';
import { continentes } from '../../lib/data';

export default function Home() {
	const router = useRouter();

	return (
		<ScrollView
			className="flex-1"
			contentContainerStyle={{ paddingBottom: 20 }}
			showsVerticalScrollIndicator={false}
		>
			{/* partida rapida */}
			<ScaleButton className="flex flex-col mt-10 h-60 bg-card border p-7 justify-between items-end border-border rounded-rounded2 mx-screen">
				<View className="bg-color rounded-rounded px-4 py-3">
					<Texto className="text-card text-base font-bold">
						60 sec
					</Texto>
				</View>
				<View className="flex flex-row justify-between items-end w-full">
					<View className="flex flex-col w-3/4 gap-1">
						<Texto className="text-h1 text-color font-pixel">
							PARTIDA RAPIDA
						</Texto>
						<Texto className="text-segundario text-h4">
							Desafio aleatorio de 10 banderas de distindos
							continentes con cronometro
						</Texto>
					</View>
					<View className="bg-color rounded-full h-alto w-ancho justify-center items-center">
						<Play size={24} color="#19151f" variant="Bold" />
					</View>
				</View>
			</ScaleButton>

			{/* continetes */}
			<View className="mx-screen gap-5 mt-8">
				<Texto className="text-segundario text-h4">Continentes</Texto>
				<View className="flex flex-row flex-wrap justify-between gap-y-5">
					{continentes.map((continente, index) => {
						const colors = [
							{ bg: 'bg-blue-600/20', icon: '#5b9dee' },
							{ bg: 'bg-green-700/20', icon: '#42c673' },
							{ bg: 'bg-red-500/20', icon: '#e56b6c' },
							{ bg: 'bg-orange-600/20', icon: '#eb8938' },
							{ bg: 'bg-indigo-500/20', icon: '#968ddc' },
						];
						const isLast = index === continentes.length - 1;
						const { bg, icon } = colors[index] ?? colors[0];

						return (
							<TouchableOpacity
								key={continente.id}
								className={`card flex p-6 gap-3 items-start ${isLast ? 'flex-row w-full gap-4 items-center' : 'flex-col w-[48%]'}`}
								onPress={() =>
									router.push(`/continente/${continente.id}`)
								}
							>
								<View className={`${bg} rounded-3xl p-4`}>
									<Map1 size={22} color={icon} />
								</View>
								<Texto className="text-primario text-h3">
									{continente.name}
								</Texto>
							</TouchableOpacity>
						);
					})}
				</View>
			</View>

			{/* Niveles */}
			<View className="mx-screen gap-5 mt-8">
				<Texto className="text-segundario text-h4">
					Progresion de niveles
				</Texto>
				<View className="flex gap-4 flex-col">
					<Niveles />
				</View>
			</View>
		</ScrollView>
	);
}
