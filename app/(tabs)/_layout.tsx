import { Tabs } from 'expo-router';

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: { display: 'none' },
				animation: 'shift',
				sceneStyle: { backgroundColor: '#100e14' },
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
				}}
			/>
			<Tabs.Screen
				name="explorer"
				options={{
					title: 'Explorer',
				}}
			/>
			<Tabs.Screen
				name="save"
				options={{
					title: 'Guardar',
				}}
			/>
			<Tabs.Screen
				name="perfil"
				options={{
					title: 'Perfil',
				}}
			/>
		</Tabs>
	);
}
