import { createContext, useContext, useState, ReactNode } from 'react';

interface Settings {
	sinIslas: boolean;
	setSinIslas: (v: boolean) => void;
}

const SettingsContext = createContext<Settings>({
	sinIslas: false,
	setSinIslas: () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
	const [sinIslas, setSinIslas] = useState(false);
	return (
		<SettingsContext.Provider value={{ sinIslas, setSinIslas }}>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettings() {
	return useContext(SettingsContext);
}
