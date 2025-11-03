import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { clearLastError } from '../store/errorSlice';
import { selectLastError } from '../store/selectors';
import { AppError } from '../types/errors';

const ErrorNotification: React.FC = () => {
  const dispatch = useDispatch();
  const lastError = useSelector(selectLastError);
  useEffect(() => {
    if (lastError) {
      // Показываем уведомление
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Автоматически скрываем через 5 секунд
      const timer = setTimeout(() => {
        hideNotification();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [lastError, fadeAnim]);

  const hideNotification = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      dispatch(clearLastError());
    });
  };

  const getErrorColor = (code: string) => {
    switch (code) {
      case 'NETWORK_ERROR':
        return '#ff9800'; // Orange
      case 'UNAUTHORIZED':
      case 'FORBIDDEN':
        return '#f44336'; // Red
      case 'VALIDATION_ERROR':
        return '#ffeb3b'; // Yellow
      default:
        return '#9c27b0'; // Purple
    }
  };

  if (!lastError) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Card 
        style={[
          styles.card, 
          { borderLeftColor: getErrorColor(lastError.code) }
        ]}
      >
        <Card.Content style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>Ошибка</Text>
            <Text style={styles.message}>{lastError.message}</Text>
            <Text style={styles.code}>{lastError.code}</Text>
          </View>
          <Button 
            mode="text" 
            onPress={hideNotification}
            style={styles.closeButton}
          >
            ×
          </Button>
        </Card.Content>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 1000,
  },
  card: {
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    marginBottom: 2,
  },
  code: {
    fontSize: 12,
    color: '#666',
  },
  closeButton: {
    minWidth: 40,
    margin: -8,
  },
});

export default ErrorNotification;