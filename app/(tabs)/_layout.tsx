import { Tabs } from 'expo-router';

export default function TabsLayout() {
	return (
		<Tabs
			screenOptions={{
				headerShown: false,
				tabBarStyle: { display: 'none' },
				animation: 'shift',
				sceneStyle: { backgroundColor: '#14101A' },
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Home',
				}}
			/>
		</Tabs>
	);
}
