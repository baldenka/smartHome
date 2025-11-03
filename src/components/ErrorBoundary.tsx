import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, Title } from 'react-native-paper';
import { AppError } from '../types/errors';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: AppError;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error: {
        code: 'COMPONENT_ERROR',
        message: error.message,
        timestamp: new Date(),
      },
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReport = () => {
    // Логика отправки отчета об ошибке
    console.log('Reporting error:', this.state.error);
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>Произошла ошибка</Title>
              <Text style={styles.message}>
                {this.state.error?.message || 'Неизвестная ошибка'}
              </Text>
              <Text style={styles.code}>
                Код ошибки: {this.state.error?.code}
              </Text>
              
              <View style={styles.buttons}>
                <Button
                  mode="contained"
                  onPress={this.handleRetry}
                  style={styles.button}
                >
                  Попробовать снова
                </Button>
                <Button
                  mode="outlined"
                  onPress={this.handleReport}
                  style={styles.button}
                >
                  Сообщить об ошибке
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FAEBD7',
  },
  card: {
    width: '100%',
    maxWidth: 400,
    elevation: 4,
  },
  title: {
    textAlign: 'center',
    color: '#d32f2f',
    marginBottom: 16,
  },
  message: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 16,
  },
  code: {
    textAlign: 'center',
    fontSize: 12,
    color: '#666',
    marginBottom: 24,
  },
  buttons: {
    marginTop: 16,
  },
  button: {
    marginBottom: 8,
  },
});

export default ErrorBoundary;