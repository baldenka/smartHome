import React, { useState } from 'react';
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
  ActivityIndicator,
} from 'react-native-paper';
import { useDispatch } from 'react-redux'; 
import { login } from '../store/authSlice';



const LoginScreen = ({ navigation }: any) => {
  const [loginText, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  
  const handleLogin = async () => {
    if (!loginText.trim() || !password) {
      setValidationErrors({
        login: !loginText.trim() ? 'Введите логин' : '',
        password: !password ? 'Введите пароль' : ''
      });
      return;
    }

    setLoading(true);
    
    // ДИСПАТЧИМ LOGIN ACTION В REDUX
    dispatch(login({ login: loginText, password }))
    .unwrap()
    .then(() => {
      setLoading(false);
      // Навигация произойдет автоматически когда isAuthenticated станет true
    })
    .catch((error) => {
      setLoading(false);
      setValidationErrors({
        login: error.message || 'Ошибка входа'
      });
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
          onChangeText={setLogin}
          style={styles.input}
          mode="outlined"
        />
        
        <TextInput
          label="Пароль"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          style={styles.input}
          mode="outlined"
          right={
            <TextInput.Icon
              name={showPassword ? 'eye-off' : 'eye'}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
        />
        
        {validationErrors.login && (
          <Text style={styles.errorText}>{validationErrors.login}</Text>
        )}
        
        {loading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : (
          <Button
            mode="contained"
            onPress={handleLogin}
            style={styles.button}
          >
            Войти в систему
          </Button>
        )}

        <Text style={styles.demoText}>
          Для демо используйте:{'\n'}
          resident/123 - Жилец{'\n'}
          dispatcher/123 - Диспетчер{'\n'}
          director/123 - Тех. директор{'\n'}
          inspector/123 - Инспектор{'\n'}
          technician/123 - Тех. специалист{'\n'}
          accountant/123 - Бухгалтер{'\n'}
          financial/123 - Фин. директор{'\n'}
          main/123 - Гл. директор{'\n'}
          security/123 - Охрана
        </Text>
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
    marginBottom: 8,
  },
  button: {
    marginTop: 8,
  },
  loader: {
    marginVertical: 16,
  },
  demoText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#666',
    fontSize: 10,
    lineHeight: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 8,
  },
});

export default LoginScreen;