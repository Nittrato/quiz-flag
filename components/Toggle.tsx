import { TouchableOpacity, Animated } from 'react-native';
import { useRef, useEffect } from 'react';

interface ToggleProps {
	value: boolean;
	onChange: (v: boolean) => void;
}

export default function Toggle({ value, onChange }: ToggleProps) {
	const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

	useEffect(() => {
		Animated.spring(anim, {
			toValue: value ? 1 : 0,
			friction: 6,
			tension: 80,
			useNativeDriver: true,
		}).start();
	}, [value]);

	const translateX = anim.interpolate({
		inputRange: [0, 1],
		outputRange: [2, 26],
	});

	return (
		<TouchableOpacity
			onPress={() => onChange(!value)}
			activeOpacity={0.8}
			style={{
				width: 52,
				height: 30,
				borderRadius: 99,
				backgroundColor: value ? '#a1ec3c' : '#27222e',
				justifyContent: 'center',
			}}
		>
			<Animated.View
				style={{
					width: 24,
					height: 24,
					borderRadius: 99,
					backgroundColor: value ? '#100e14' : '#c6d0b6',
					transform: [{ translateX }],
				}}
			/>
		</TouchableOpacity>
	);
}
