import { View, ScrollView } from 'react-native';
import Texto from '../../template/Texto';
import HeroBar from '../../template/HeroBar';
import { router } from 'expo-router';
import { TickCircle } from 'iconsax-react-nativejs';

export default function Perfil() {
	return (
		<View className="flex-1 bg-fondo">
			{/* Hero Section */}
			<HeroBar
				title="Perfil"
				rightIcon={<TickCircle color="white" size={20} />}
				onRightPress={router.back}
			/>

			<ScrollView
				className="flex-1"
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 20 }}
			>
				<View className="flex-1 items-center h-screen justify-center">
					<Texto className="text-primario text-h2">Perfil</Texto>
				</View>
			</ScrollView>
		</View>
	);
}
