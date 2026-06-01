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
import { niveles } from '../lib/data';

// convierte los numeros en estados para poder usarlos
type ProgresoEstado = 'incompleto' | 'en_proceso' | 'completo';

function getEstadoProgreso(progreso: number): ProgresoEstado {
	if (progreso === 0) return 'incompleto';
	if (progreso === 100) return 'completo';
	return 'en_proceso';
}

// convierte los numeros en iconos
function IconoEstado({ estado }: { estado: ProgresoEstado }) {
	if (estado === 'completo') {
		return <TickCircle size={20} color="#19151f" variant="Bold" />;
	}
	if (estado === 'en_proceso') {
		return <Clock size={20} color="#19151f" variant="Bold" />;
	}
	// incompleto
	return <Record size={20} color="#19151f" variant="Bold" />;
}

// convierte los numeros en barra de progreso
function BarraProgreso({
	progreso,
	estado,
}: {
	progreso: number;
	estado: ProgresoEstado;
}) {
	const colorBarra =
		estado === 'completo'
			? 'bg-[#a1ec3c]'
			: estado === 'en_proceso'
				? 'bg-[#a1ec3c]'
				: 'bg-[#4a4a4a]';

	return (
		<View className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
			<View
				className={`h-full rounded-full ${colorBarra}`}
				style={{ width: `${progreso}%` }}
			/>
		</View>
	);
}

export default function Niveles() {
	// convertir niveles en texto
	const dificultadLabel: Record<number, string> = {
		1: 'Novato',
		2: 'Intermedio',
		3: 'Avanzado',
		4: 'Experto',
		5: 'Leyenda',
	};

	// convertir niveles en iconos (recibe color para soportar estado bloqueado)
	const dificultadIcono: Record<
		number,
		(color: string) => React.ReactElement
	> = {
		1: color => <Smileys size={22} color={color} variant="Bold" />,
		2: color => <Book1 size={22} color={color} variant="Bold" />,
		3: color => <Flash size={22} color={color} variant="Bold" />,
		4: color => <Crown size={22} color={color} variant="Bold" />,
		5: color => <Medal size={22} color={color} variant="Bold" />,
	};

	// convierte los numeros en estados y luego a textos
	const estadoLabel: Record<ProgresoEstado, string> = {
		incompleto: 'Sin comenzar',
		en_proceso: 'En proceso',
		completo: 'Completado',
	};

	return (
		<View className="flex flex-col gap-5">
			{niveles.map(nivel => {
				const bloqueado = !nivel.estado;
				const estado = getEstadoProgreso(nivel.progreso);
				return (
					<ScaleButton
						key={nivel.id}
						className={`card p-6 flex flex-row gap-4 items-center ${bloqueado ? 'opacity-50' : ''}`}
					>
						{/* Icono de dificultad estado/candado */}
						<View
							className={`border rounded-full p-4 ${
								bloqueado
									? 'bg-white/5 border-white/10'
									: 'bg-color/20 border-color'
							}`}
						>
							{dificultadIcono[nivel.dificultad](
								bloqueado ? '#6b7280' : '#a1ec3c'
							)}
						</View>

						{/* Texto y barra */}
						<View className="flex flex-col gap-2 flex-1">
							<View className="flex flex-row items-center justify-between">
								<Texto
									className={`text-h4 font-medium ${bloqueado ? 'text-white/30' : 'text-primario'}`}
								>
									{dificultadLabel[nivel.dificultad]}
								</Texto>
								{bloqueado ? (
									<Texto className="text-white/30 text-sm">
										Bloqueado
									</Texto>
								) : (
									<Texto className="text-segundario text-sm">
										{estadoLabel[estado]}
									</Texto>
								)}
							</View>
							{bloqueado ? (
								<View className="w-full h-1.5 bg-white/10 rounded-full" />
							) : (
								<BarraProgreso
									progreso={nivel.progreso}
									estado={estado}
								/>
							)}
						</View>

						{/* Icono de estado / candado */}
						<View
							className={`py-2 px-4 rounded-rounded ${bloqueado ? 'bg-white/10' : 'bg-color'}`}
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
