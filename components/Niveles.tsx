import React from 'react';
import { View } from 'react-native';
import Texto from '../template/Texto';
import {
	Clock,
	TickCircle,
	Lock,
	Smileys,
	Book1,
	Flash,
	Crown,
	Medal,
	Record,
} from 'iconsax-react-nativejs';
import { ScaleButton } from '../template/AnimatedElements';
import { useSettings } from '../lib/settings';
import { useRouter } from 'expo-router';

type ProgresoEstado = 'incompleto' | 'en_proceso' | 'completo';

function getEstadoProgreso(progreso: number): ProgresoEstado {
	if (progreso === 0) return 'incompleto';
	if (progreso === 100) return 'completo';
	return 'en_proceso';
}

function IconoEstado({ estado }: { estado: ProgresoEstado }) {
	if (estado === 'completo')
		return <TickCircle size={20} color="#19151f" variant="Bold" />;
	if (estado === 'en_proceso')
		return <Clock size={20} color="#19151f" variant="Bold" />;
	return <Record size={20} color="#19151f" variant="Bold" />;
}

function BarraProgreso({
	progreso,
	estado,
}: {
	progreso: number;
	estado: ProgresoEstado;
}) {
	const colorBarra = estado !== 'incompleto' ? 'bg-color' : 'bg-trans2';
	return (
		<View className="w-full h-1.5 bg-trans rounded-full overflow-hidden">
			<View
				className={`h-full rounded-full ${colorBarra}`}
				style={{ width: `${progreso}%` }}
			/>
		</View>
	);
}

const dificultadLabel: Record<number, string> = {
	1: 'Novato',
	2: 'Intermedio',
	3: 'Avanzado',
	4: 'Experto',
	5: 'Leyenda',
};

const dificultadIcono: Record<number, (color: string) => React.ReactElement> = {
	1: c => <Smileys size={22} color={c} variant="Bold" />,
	2: c => <Book1 size={22} color={c} variant="Bold" />,
	3: c => <Flash size={22} color={c} variant="Bold" />,
	4: c => <Crown size={22} color={c} variant="Bold" />,
	5: c => <Medal size={22} color={c} variant="Bold" />,
};

const estadoLabel: Record<ProgresoEstado, string> = {
	incompleto: 'Sin comenzar',
	en_proceso: 'En proceso',
	completo: 'Completado',
};

export default function Niveles() {
	const { nivelesEstado } = useSettings();
	const router = useRouter();

	return (
		<View className="flex flex-col gap-5">
			{nivelesEstado.map(nivel => {
				const bloqueado = !nivel.estado;
				const estado = getEstadoProgreso(nivel.progreso);
				return (
					<ScaleButton
						key={nivel.id}
						className={`card p-6 flex flex-row gap-4 items-center ${bloqueado ? 'opacity-50' : ''}`}
						onPress={
							bloqueado
								? undefined
								: () =>
										router.push(
											`/niveles/${nivel.dificultad}`
										)
						}
						disabled={bloqueado}
					>
						{/* Icono de dificultad */}
						<View
							className={`border rounded-full p-4 ${bloqueado ? 'bg-trans border-trans2' : 'bg-color/20 border-color'}`}
						>
							{dificultadIcono[nivel.dificultad](
								bloqueado ? '#6b7280' : '#a1ec3c'
							)}
						</View>

						{/* Texto y barra */}
						<View className="flex flex-col gap-2 flex-1">
							<View className="flex flex-row items-center justify-between">
								<Texto
									className={`text-h4 ${bloqueado ? 'text-primario/30' : 'text-primario'}`}
								>
									{dificultadLabel[nivel.dificultad]}
								</Texto>
								<Texto
									className={`text-base ${bloqueado ? 'text-primario/30' : 'text-segundario'}`}
								>
									{bloqueado
										? 'Bloqueado'
										: estadoLabel[estado]}
								</Texto>
							</View>
							{bloqueado ? (
								<View className="w-full h-1.5 bg-trans rounded-full" />
							) : (
								<BarraProgreso
									progreso={nivel.progreso}
									estado={estado}
								/>
							)}
						</View>

						{/* Badge estado / candado */}
						<View
							className={`py-2 px-4 rounded-rounded ${bloqueado ? 'bg-trans' : 'bg-color'}`}
						>
							{bloqueado ? (
								<Lock
									size={20}
									color="#6b7280"
									variant="Bold"
								/>
							) : (
								<IconoEstado estado={estado} />
							)}
						</View>
					</ScaleButton>
				);
			})}
		</View>
	);
}
