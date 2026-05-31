import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import '../global.css';

// Prevenir que la splash screen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		Bus: require("../assets/fonts/Bus700.ttf"),
		Ios: require("../assets/fonts/SF-Pro.ttf")
	});

	useEffect(() => {
		if (loaded || error) {
			SplashScreen.hideAsync();
		}
	}, [loaded, error]);

	if (!loaded && !error) {
		return null;
	}

	return (
		<SafeAreaProvider
			style={{ flex: 1, backgroundColor: '#111111', paddingTop: Constants.statusBarHeight }}
		>
			<StatusBar />
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: '#111111' },
					animation: 'fade_from_bottom',
				}}
			/>
		</SafeAreaProvider>
	);
}

