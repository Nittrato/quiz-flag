import { Text, TextProps } from 'react-native';
import React from 'react';

export default function Texto({ className = '', ...props }: TextProps & { className?: string }) {
	// Solo añadimos font-sans si no hay ninguna clase que empiece por font- (como font-doto)
	const hasCustomFont = className.split(' ').some(cls => cls.startsWith('font-'));
	const finalClassName = hasCustomFont ? className : `font-sans ${className} `;

	return <Text className={finalClassName} {...props} />;
}