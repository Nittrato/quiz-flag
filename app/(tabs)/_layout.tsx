import { Tabs } from 'expo-router';
import NavBar from '../../template/NavBar';

export default function TabsLayout() {
	return (
		<Tabs
			tabBar={props => <NavBar {...props} />}
			screenOptions={{
				headerShown: false,
				animation: 'shift',
				sceneStyle: { backgroundColor: '#111111' },
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
