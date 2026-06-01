/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./App.{js,jsx,ts,tsx}',
		'./components/**/*.{js,jsx,ts,tsx}',
		'./app/**/*.{js,jsx,ts,tsx}',
		'./template/**/*.{js,jsx,ts,tsx}',
	],
	presets: [require('nativewind/preset')],
	theme: {
		extend: {
			colors: {
				/* Colores de fondo */
				fondo: '#100e14',
				card: '#19151f',
				border: '#27222e',
				/* Colores de botones y textos */
				color: '#a1ec3c',
				primario: '#FFFFFF',
				segundario: '#c6d0b6',
				/* Colores transparentes */
				trans: '#ffffff10',
				trans2: '#ffffff30',
			},
			borderRadius: {
				rounded: '2rem',
				rounded2: '2.2rem',
			},
			height: {
				alto: '4rem',
				alto2: '5rem',
			},
			width: {
				ancho: '4rem',
				ancho2: '5rem',
			},
			// espacios de pantalla
			margin: {
				screen: '1.25rem',
			},
			padding: {
				screen: '1.25rem',
			},
			fontFamily: {
				sans: ['Ios'],
				pixel: ['Bus'],
			},
			fontSize: {
				// es un titulo grande
				h1: '2.5rem',
				// es un titulo mediano
				h2: '1.8rem',
				// es un subtitulo
				h3: '1.4rem',
				// es un texto normal
				h4: '1.2rem',
				// es un texto pequeño
				base: '0.9rem',
			},
		},
	},
	plugins: [],
};
