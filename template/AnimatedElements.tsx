import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, TouchableOpacityProps, ViewProps } from 'react-native';

interface FadeSlideViewProps extends ViewProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  distance?: number;
}

export const FadeSlideView: React.FC<FadeSlideViewProps> = ({ 
  children, 
  duration = 500, 
  delay = 0, 
  distance = 20,
  style,
  ...props 
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

interface ScaleButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  scaleTo?: number;
}

export const ScaleButton: React.FC<ScaleButtonProps> = ({ 
  children, 
  scaleTo = 0.95,
  style,
  onPressIn,
  onPressOut,
  ...props 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = (event: any) => {
    Animated.spring(scaleAnim, {
      toValue: scaleTo,
      useNativeDriver: true,
    }).start();
    onPressIn?.(event);
  };

  const handlePressOut = (event: any) => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
    onPressOut?.(event);
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
        {...props}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};
