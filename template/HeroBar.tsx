import { View, TouchableOpacity } from 'react-native';
import Texto from './Texto';
import { ScaleButton } from './AnimatedElements';
import { router } from 'expo-router';
import { ArrowLeft2 } from 'iconsax-react-nativejs';
import React from 'react';

interface HeroBarProps {
	title: string;
	leftIcon?: React.ReactNode;
	onLeftPress?: () => void;
	rightIcon?: React.ReactNode;
	onRightPress?: () => void;
	containerClassName?: string;
}

export default function HeroBar({
	title,
	leftIcon,
	onLeftPress, // No se usa leftIcon en el className
	rightIcon,
	onRightPress,
	containerClassName = 'flex flex-row p-5 justify-between items-center z-50',
}: HeroBarProps) {
	return (
		<View className={containerClassName}>
			<TouchableOpacity
				className="bg-card boton z-10"
				onPress={onLeftPress ? onLeftPress : () => router.back()}
			>
				{leftIcon ? leftIcon : <ArrowLeft2 color="white" size={20} />}
			</TouchableOpacity>

			<Texto className="text-primario  absolute left-0 right-0 text-center text-h3 justify-center">
				{title}
			</Texto>

			{rightIcon && (
				<TouchableOpacity
					className="bg-color w-[6.5rem] h-alto rounded-rounded items-center justify-center z-10"
					onPress={onRightPress}
					activeOpacity={0.6}
				>
					{rightIcon}
				</TouchableOpacity>
			)}
		</View>
	);
}
