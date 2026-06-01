import { useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity } from 'react-native';
import Texto from '../../template/Texto';
import { Play, Map1, Star1, Clock } from 'iconsax-react-nativejs';
import { router } from 'expo-router';
import { ScaleButton } from '../../template/AnimatedElements';
import Niveles from '../../components/Niveles';

export default function Home() {
	return (
		<ScrollView
			className="flex-1"
			contentContainerStyle={{ paddingBottom: 20 }}
			showsVerticalScrollIndicator={false}
		>
			{/* partida rapida */}
			<ScaleButton className="flex flex-col mt-10 h-60 bg-card border p-7 justify-between items-end border-border rounded-rounded2 mx-screen">
				<View className="bg-color rounded-rounded px-4 py-1">
					<Texto className="text-card text-base">60 sec</Texto>
				</View>
				<View className="flex flex-row justify-between items-end w-full">
					<View className="flex flex-col w-3/4">
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
					<TouchableOpacity className="card flex p-6 flex-col gap-3 w-[48%] items-start">
						<View className="bg-blue-600/20 rounded-3xl p-4">
							<Map1 size={22} color="#5b9dee" />
						</View>
						<Texto className="text-primario text-h3">Europa</Texto>
					</TouchableOpacity>
					<TouchableOpacity className="card flex p-6 flex-col gap-3 w-[48%] items-start">
						<View className="bg-green-700/20 rounded-3xl p-4">
							<Map1 size={22} color="#42c673" />
						</View>
						<Texto className="text-primario text-h3">America</Texto>
					</TouchableOpacity>
					<TouchableOpacity className="card flex p-6 flex-col gap-3 w-[48%] items-start">
						<View className="bg-red-500/20  rounded-3xl p-4">
							<Map1 size={22} color="#e56b6c" />
						</View>
						<Texto className="text-primario text-h3">Asia</Texto>
					</TouchableOpacity>
					<TouchableOpacity className="card flex p-6 flex-col gap-3 w-[48%] items-start">
						<View className="bg-orange-600/20  rounded-3xl p-4">
							<Map1 size={22} color="#eb8938" />
						</View>
						<Texto className="text-primario text-h3">Africa</Texto>
					</TouchableOpacity>
					<TouchableOpacity className="card flex p-6 flex-row gap-4 w-full items-center">
						<View className="bg-indigo-500/20  rounded-3xl p-4">
							<Map1 size={22} color="#968ddc" />
						</View>
						<Texto className="text-primario text-h3">Oceania</Texto>
					</TouchableOpacity>
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
