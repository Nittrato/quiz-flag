import { useState } from 'react';
import { View, Image, ScrollView, Text, TouchableOpacity } from 'react-native';
import Texto from '../../template/Texto';
import { Play, Map1, Star1, Clock } from 'iconsax-react-nativejs';
import { router } from 'expo-router';
import { ScaleButton } from '../../template/AnimatedElements';
import { FadeSlideView } from '../../template/AnimatedElements';

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
					<Texto className="text-card text-h4">60 sec</Texto>
				</View>
				<View className="flex flex-row justify-between items-end w-full">
					<View className="flex flex-col w-3/4">
						<Texto className="text-h1 text-color font-pixel">
							PARTIDA RAPIDA
						</Texto>
						<Texto className="text-segundario text-h3">
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
				<Texto className="text-segundario text-h3">Continentes</Texto>
				<View className="flex flex-row flex-wrap justify-between gap-y-5">
					<TouchableOpacity className="card flex p-6 flex-col gap-3 w-[48%] items-start">
						<View className="bg-blue-600/20 rounded-3xl p-4">
							<Map1 size={22} color="#5b9dee" />
						</View>
						<Texto className="text-primario text-h2">Europa</Texto>
					</TouchableOpacity>
					<TouchableOpacity className="card flex p-6 flex-col gap-3 w-[48%] items-start">
						<View className="bg-green-700/20 rounded-3xl p-4">
							<Map1 size={22} color="#42c673" />
						</View>
						<Texto className="text-primario text-h2">America</Texto>
					</TouchableOpacity>
					<TouchableOpacity className="card flex p-6 flex-col gap-3 w-[48%] items-start">
						<View className="bg-red-500/20  rounded-3xl p-4">
							<Map1 size={22} color="#e56b6c" />
						</View>
						<Texto className="text-primario text-h2">Asia</Texto>
					</TouchableOpacity>
					<TouchableOpacity className="card flex p-6 flex-col gap-3 w-[48%] items-start">
						<View className="bg-orange-600/20  rounded-3xl p-4">
							<Map1 size={22} color="#eb8938" />
						</View>
						<Texto className="text-primario text-h2">Africa</Texto>
					</TouchableOpacity>
					<TouchableOpacity className="card flex p-6 flex-row gap-4 w-full items-center">
						<View className="bg-indigo-500/20  rounded-3xl p-4">
							<Map1 size={22} color="#968ddc" />
						</View>
						<Texto className="text-primario text-h2">Oceania</Texto>
					</TouchableOpacity>
				</View>
			</View>

			{/* Niveles */}
			<View className="mx-screen gap-5 mt-8">
				<Texto className="text-segundario text-h3">
					Progresion de niveles
				</Texto>
				<View className="flex gap-4 flex-col">
					<TouchableOpacity className="card p-6 flex flex-row gap-5 items-center">
						<View className="bg-color/20 border border-color rounded-full p-4">
							<Star1 size={22} color="#a1ec3c" />
						</View>
						<View className="flex flex-col gap-1">
							<Text className="text-h2 text-primario font-medium">
								Novato
							</Text>
							<Text className="text-segundario text-h4">
								12/12 completado
							</Text>
						</View>
						<View className="ml-auto bg-color py-2 px-4 rounded-rounded ">
							<Clock size={20} color="#19151f" variant="Bold" />
						</View>
					</TouchableOpacity>
					<TouchableOpacity className="card p-6 flex flex-row gap-5 items-center">
						<View className="bg-color/20 border border-color rounded-full p-4">
							<Star1 size={22} color="#a1ec3c" />
						</View>
						<View className="flex flex-col gap-1">
							<Text className="text-h2 text-primario font-medium">
								Novato
							</Text>
							<Text className="text-segundario text-h4">
								12/12 completado
							</Text>
						</View>
						<View className="ml-auto bg-color py-2 px-4 rounded-rounded ">
							<Clock size={20} color="#19151f" variant="Bold" />
						</View>
					</TouchableOpacity>
					<TouchableOpacity className="card p-6 flex flex-row gap-5 items-center">
						<View className="bg-color/20 border border-color rounded-full p-4">
							<Star1 size={22} color="#a1ec3c" />
						</View>
						<View className="flex flex-col gap-1">
							<Text className="text-h2 text-primario font-medium">
								Novato
							</Text>
							<Text className="text-segundario text-h4">
								12/12 completado
							</Text>
						</View>
						<View className="ml-auto bg-color py-2 px-4 rounded-rounded ">
							<Clock size={20} color="#19151f" variant="Bold" />
						</View>
					</TouchableOpacity>
					<TouchableOpacity className="card p-6 flex flex-row gap-5 items-center">
						<View className="bg-color/20 border border-color rounded-full p-4">
							<Star1 size={22} color="#a1ec3c" />
						</View>
						<View className="flex flex-col gap-1">
							<Text className="text-h2 text-primario font-medium">
								Novato
							</Text>
							<Text className="text-segundario text-h4">
								12/12 completado
							</Text>
						</View>
						<View className="ml-auto bg-color py-2 px-4 rounded-rounded ">
							<Clock size={20} color="#19151f" variant="Bold" />
						</View>
					</TouchableOpacity>
				</View>
			</View>
		</ScrollView>
	);
}
