import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Card,
  Title,
  HelperText,
  ActivityIndicator,
} from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { addError } from '../store/errorSlice';
import { RootState } from '../store';
import { AppError } from '../types/errors';

const LoginScreen = () => {
  const [loginText, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (error) {
      dispatch(addError(error));
    }
  }, [error, dispatch]);

  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};

    if (!loginText.trim()) {
      errors.login = 'Введите логин';
    } else if (loginText.length < 3) {
      errors.login = 'Логин должен содержать минимум 3 символа';
    }

    if (!password) {
      errors.password = 'Введите пароль';
    } else if (password.length < 6) {
      errors.password = 'Пароль должен содержать минимум 6 символов';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(login({ login: loginText, password }));
    } catch (err) {
      const appError: AppError = {
        code: 'LOGIN_ERROR',
        message: 'Ошибка при входе в систему',
        timestamp: new Date(),
        details: err,
      };
      dispatch(addError(appError));
    }
  };

  const clearError = (field: string) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Title style={styles.title}>УК Дубровка</Title>
          <Text style={styles.subtitle}>Умный дом</Text>
          
          <TextInput
            label="Логин"
            value={loginText}
            onChangeText={(text) => {
              setLogin(text);
              clearError('login');
            }}
            style={styles.input}
            mode="outlined"
            error={!!validationErrors.login}
            disabled={loading}
            left={<TextInput.Icon name="account" />}
          />
          <HelperText type="error" visible={!!validationErrors.login}>
            {validationErrors.login}
          </HelperText>
          
          <TextInput
            label="Пароль"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearError('password');
            }}
            secureTextEntry={!showPassword}
            style={styles.input}
            mode="outlined"
            error={!!validationErrors.password}
            disabled={loading}
            left={<TextInput.Icon name="lock" />}
            right={
              <TextInput.Icon
                name={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          <HelperText type="error" visible={!!validationErrors.password}>
            {validationErrors.password}
          </HelperText>
          
          {loading ? (
            <ActivityIndicator size="large" style={styles.loader} />
          ) : (
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              contentStyle={styles.buttonContent}
              disabled={loading}
            >
              Войти в систему
            </Button>
          )}

          <HelperText type="info" style={styles.helperText}>
            Для демонстрации используйте любые данные
          </HelperText>
        </Card.Content>
      </Card>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FAEBD7',
  },
  card: {
    padding: 8,
    elevation: 4,
  },
  logo: {
    width: 150,
    height: 50,
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    marginBottom: 4,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 24,
    color: '#666',
  },
  input: {
    marginBottom: 4,
  },
  button: {
    marginTop: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  loader: {
    marginVertical: 16,
  },
  helperText: {
    textAlign: 'center',
    marginTop: 8,
  },
});

export default LoginScreen;