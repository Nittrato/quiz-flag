import { View, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { continentes } from '../../lib/data';
import Texto from '../../template/Texto';
import { ScaleButton } from '../../template/AnimatedElements';
import { Add, ArrowRight, Clock, Star1 } from 'iconsax-react-nativejs';
export default function ContinentePage() {
	const { id } = useLocalSearchParams<{ id: string }>();
	const continente = continentes.find(continente => continente.id === id);

	return (
		<View className="flex h-screen">
			{/* heroBar */}
			<View className="flex flex-row p-5 justify-between items-center z-50">
				<TouchableOpacity
					className="bg-card boton"
					onPress={() => router.back()}
				>
					<Add
						color="white"
						size={28}
						style={{ transform: [{ rotate: '45deg' }] }}
					/>
				</TouchableOpacity>
				<Texto className="text-white text-h4">Barra de progreso</Texto>
				<View className="flex flex-row gap-2 bg-card border border-border px-4 py-3 rounded-full items-center justify-center">
					<Clock size={18} color="white" />
					<Texto className="text-white text-h4">01:00</Texto>
				</View>
			</View>

			{/* presentacion */}
			<View className="m-screen">
				<Texto className="text-color text-h4">Pregunta 02/10</Texto>
				<Texto className="text-primario text-h1">
					De que pais de {continente.name} es esta bandera?
				</Texto>
			</View>

			{/* seleccion de pais */}
			<View className="flex flex-col mx-screen gap-6">
				<View className="card">
					{/* <Image /> */}
					<View className="w-full h-64"></View>
				</View>
				<View className="flex flex-row flex-wrap justify-between gap-y-5">
					<TouchableOpacity className="bg-card border rounded-rounded2 border-border flex h-32 items-center justify-center w-[48%]">
						<Texto className="text-primario text-h3">
							Argentina
						</Texto>
					</TouchableOpacity>
					<TouchableOpacity className="bg-card border rounded-rounded2 border-border flex h-32 items-center justify-center w-[48%]">
						<Texto className="text-primario text-h3">
							Argentina
						</Texto>
					</TouchableOpacity>
					<TouchableOpacity className="bg-card border rounded-rounded2 border-border flex h-32 items-center justify-center w-[48%]">
						<Texto className="text-primario text-h3">
							Argentina
						</Texto>
					</TouchableOpacity>
					<TouchableOpacity className="bg-card border rounded-rounded2 border-border flex h-32 items-center justify-center w-[48%]">
						<Texto className="text-primario text-h3">
							Argentina
						</Texto>
					</TouchableOpacity>
				</View>
			</View>

			{/* racha y boton de siguiente */}
			<View className="flex flex-col mx-screen mt-auto py-screen gap-5">
				<View className="bg-card border border-border p-screen rounded-rounded2 flex flex-row gap-2 justify-center items-center mx-auto">
					<Star1 size="20" color="white" variant="Bold" />
					<Texto className="text-primario text-base">
						x6 de Racha
					</Texto>
				</View>
				{/* <ScaleButton></ScaleButton> */}
				<TouchableOpacity className="bg-color rounded-rounded2 flex-row gap-4 p-screen justify-center items-center flex">
					<Texto className="text-fondo text-h2 font-pixel">
						SIGUIENTE
					</Texto>
					<ArrowRight size={28} color="black" />
				</TouchableOpacity>
			</View>
		</View>
	);
}
