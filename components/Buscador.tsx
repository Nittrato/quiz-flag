import { View, TextInput } from 'react-native';
import { SearchNormal1 } from 'iconsax-react-nativejs';
import { ScaleButton, FadeSlideView } from '../template/AnimatedElements';

export default function Buscador() {
	return (
		<FadeSlideView>
			<ScaleButton className="bg-card my-10 border border-border pl-6 rounded-rounded2 h-alto2 flex gap-4 items-center flex-row mx-screen">
				<SearchNormal1 color="#9ca3af" size={20} />
				<TextInput
					placeholder="Buscar"
					placeholderTextColor="#9ca3af"
					className="text-primario text-h3 flex-1 outline-none font-sans"
				/>
			</ScaleButton>
		</FadeSlideView>
	);
}
