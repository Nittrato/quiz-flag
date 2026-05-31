import React, { useState, useEffect, useRef } from 'react';
import {
	View,
	TouchableOpacity,
	LayoutChangeEvent,
	Animated,
	Platform,
	StyleSheet,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
	Home2,
	LocationDiscover,
	Archive,
	ProfileCircle,
} from 'iconsax-react-nativejs';

const NavBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
	const [containerWidth, setContainerWidth] = useState(0);
	const translateX = useRef(new Animated.Value(0)).current;

	const onLayout = (event: LayoutChangeEvent) => {
		const { width } = event.nativeEvent.layout;
		setContainerWidth(width);
	};

	// Calculamos el ancho de cada pestaña restando el padding interno (12px = 6 izq + 6 der)
	const tabWidth = containerWidth
		? (containerWidth - 12) / state.routes.length
		: 0;

	useEffect(() => {
		if (tabWidth > 0) {
			Animated.spring(translateX, {
				toValue: state.index * tabWidth,
				useNativeDriver: Platform.OS !== 'web',
				damping: 25,
				stiffness: 300,
				mass: 1,
			}).start();
		}
	}, [state.index, tabWidth]);

	return (
		<View className="absolute bottom-5 w-full items-center px-screen">
			<View
				onLayout={onLayout}
				className="flex-row bg-card border border-border h-alto2 rounded-rounded2 items-center px-1.5"
				style={[styles.shadow, { width: '100%', maxWidth: 500 }]}
			>
				{/* Indicador Animado (Pill) */}
				{containerWidth > 0 && (
					<Animated.View
						style={[
							{
								position: 'absolute',
								width: tabWidth,
								left: 6,
								zIndex: 0,
							},
							{ transform: [{ translateX }] },
						]}
					>
						<View className="bg-primario h-[4.2rem] rounded-rounded" />
					</Animated.View>
				)}

				{state.routes.map((route, index) => {
					const isFocused = state.index === index;

					const onPress = () => {
						const event = navigation.emit({
							type: 'tabPress',
							target: route.key,
							canPreventDefault: true,
						});

						if (!isFocused && !event.defaultPrevented) {
							navigation.navigate(route.name);
						}
					};

					return (
						<TouchableOpacity
							key={route.key}
							onPress={onPress}
							className="flex-1 items-center justify-center z-10 h-full"
							activeOpacity={0.6}
						>
							<NavIcon name={route.name} isFocused={isFocused} />
						</TouchableOpacity>
					);
				})}
			</View>
		</View>
	);
};

const NavIcon = ({ name, isFocused }: { name: string; isFocused: boolean }) => {
	const color = isFocused ? '#222222' : '#777777';
	const variant = isFocused ? 'Bold' : 'Outline';
	const size = 20;

	switch (name) {
		case 'index':
			return <Home2 size={size} color={color} variant={variant} />;
		case 'explorer':
			return (
				<LocationDiscover size={size} color={color} variant={variant} />
			);
		case 'save':
			return <Archive size={size} color={color} variant={variant} />;
		case 'perfil':
			return (
				<ProfileCircle size={size} color={color} variant={variant} />
			);
		default:
			return null;
	}
};

const styles = StyleSheet.create({
	shadow: {
		...Platform.select({
			android: {
				// En Android, la elevación es la única forma de hacer sombras nativas
				elevation: 20,
			},
		}),
	},
});

export default NavBar;
