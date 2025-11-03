import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { RootState } from '../../store';

const SecurityHomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleEmergencyCall = () => {
    // Логика вызова аварийной службы
    alert('Вызов аварийной службы...');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Личный кабинет сотрудника охраны</Title>
          <Text style={styles.userName}>{user?.name}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Видеонаблюдение</Title>
          
          <Button
            mode="contained"
            icon="camera"
            onPress={() => navigation.navigate('CameraLiveScreen')}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Просмотр трансляций с камер
          </Button>
          
          <Button
            mode="contained"
            icon="video"
            onPress={() => navigation.navigate('CameraArchiveScreen')}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Просмотр записей с камер наблюдения
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Состояние систем</Title>
          
          <Button
            mode="contained"
            icon="lock"
            onPress={() => navigation.navigate('LocksStatusScreen')}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Просмотр состояния замков
          </Button>
          
          <Button
            mode="contained"
            icon="alarm"
            onPress={() => navigation.navigate('AlarmStatusScreen')}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Просмотр состояния сигн. систем
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Экстренные действия</Title>
          
          <Button
            mode="contained"
            icon="phone"
            buttonColor="#d32f2f"
            onPress={handleEmergencyCall}
            style={styles.emergencyButton}
            contentStyle={styles.menuButtonContent}
          >
            Вызов аварийной службы
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Быстрый доступ</Title>
          
          <Button
            mode="outlined"
            icon="bell"
            onPress={() => navigation.navigate('NotificationsScreen')}
            style={styles.quickButton}
          >
            Уведомления
          </Button>
          
          <Button
            mode="outlined"
            icon="logout"
            onPress={() => dispatch(logout())}
            style={styles.logoutButton}
          >
            Выход
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEBD7',
  },
  card: {
    margin: 8,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 16,
    marginTop: 8,
    color: '#666',
  },
  userName: {
    fontSize: 16,
    marginTop: 4,
    color: '#8B4513',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  menuButton: {
    marginBottom: 12,
  },
  menuButtonContent: {
    paddingVertical: 8,
  },
  emergencyButton: {
    marginBottom: 12,
  },
  quickButton: {
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 16,
    borderColor: '#8B4513',
  },
});

export default SecurityHomeScreen;