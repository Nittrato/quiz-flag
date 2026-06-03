import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Texto from '../template/Texto';

interface CirculoProgresoProps {
	/** Valor de 0 a 100 */
	porcentaje: number;
	/** Tamaño del círculo en px (default 220) */
	size?: number;
	/** Grosor del trazo en px (default 16) */
	grosor?: number;
	/** Color del arco activo (default color del proyecto) */
	color?: string;
	/** Color de la pista de fondo (default border del proyecto) */
	colorFondo?: string;
	/** Etiqueta debajo del número (default "Precisión") */
	etiqueta?: string;
}

// Círculo SVG con arco animado que muestra un porcentaje.
// Usa react-native-svg para un trazo limpio y matemáticamente correcto.
export default function CirculoProgreso({
	porcentaje,
	size = 220,
	grosor = 16,
	color = '#a1ec3c',
	colorFondo = '#27222e',
	etiqueta = 'Precisión',
}: CirculoProgresoProps) {
	const radio = (size - grosor) / 2;
	const circunferencia = 2 * Math.PI * radio;
	const centro = size / 2;

	// Animamos el valor de 0 a porcentaje
	const anim = useRef(new Animated.Value(0)).current;
	const [num, setNum] = useState(0);
	const [offset, setOffset] = useState(circunferencia);

	useEffect(() => {
		Animated.timing(anim, {
			toValue: porcentaje,
			duration: 1200,
			delay: 300,
			easing: Easing.out(Easing.cubic),
			useNativeDriver: false,
		}).start();

		const id = anim.addListener(({ value }) => {
			setNum(Math.round(value));
			// strokeDashoffset: circunferencia completa = 0%, 0 = 100%
			setOffset(circunferencia * (1 - value / 100));
		});

		return () => anim.removeListener(id);
	}, [porcentaje]);

	return (
		<View
			style={{
				width: size,
				height: size,
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<Svg width={size} height={size} style={{ position: 'absolute' }}>
				{/* Pista de fondo */}
				<Circle
					cx={centro}
					cy={centro}
					r={radio}
					stroke={colorFondo}
					strokeWidth={grosor}
					fill="none"
				/>
				{/* Arco de progreso — empieza desde arriba (-90°) */}
				<Circle
					cx={centro}
					cy={centro}
					r={radio}
					stroke={color}
					strokeWidth={grosor}
					fill="none"
					strokeDasharray={`${circunferencia} ${circunferencia}`}
					strokeDashoffset={offset}
					strokeLinecap="round"
					// Rota -90° para que el arco empiece en el top
					transform={`rotate(-90, ${centro}, ${centro})`}
				/>
			</Svg>

			{/* Contenido central */}
			<Texto className="text-color text-[4rem] font-pixel">{num}%</Texto>
			<Texto className="text-segundario text-h4">{etiqueta}</Texto>
		</View>
	);
}
