import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { RootState } from '../../store';


const ResidentHomeScreen = () => {
  const dispatch = useDispatch();
const navigation = useNavigation();
const user = useSelector((state: RootState) => state.auth.user);
const handleEmergencyCall = () => {
  alert('Вызов аварийной службы...\nСоединяем с диспетчером');
  // В реальном приложении здесь будет вызов телефона
};

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Личный кабинет проживающего</Title>
          <Text style={styles.userName}>{user?.name}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Основные функции</Title>
          
          <Button
            mode="contained"
            icon="water-pump"
            // @ts-ignore
            onPress={() => navigation.navigate('CounterReadingsScreen')}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Передать показания счетчиков
          </Button>
          
          <Button
            mode="contained"
            icon="message-alert"
            // @ts-ignore
            onPress={() => navigation.navigate('CreateRequestScreen')}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Обратная связь
          </Button>
          
          <Button
            mode="contained"
            icon="eye"
            // @ts-ignore
            onPress={() => navigation.navigate('MyRequestsScreen')}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Мои заявки
          </Button>
          
          <Button
            mode="outlined"
            icon="logout"
            onPress={() => dispatch(logout())}
            style={styles.logoutButton}
            contentStyle={styles.menuButtonContent}
          >
            Выход
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Быстрый доступ</Title>
          <View style={styles.quickActions}>
            <Button
              mode="outlined"
              icon="phone"
              onPress={() => handleEmergencyCall()}
              compact
              style={styles.quickButton}
            >
              Аварийная служба
            </Button>
            <Button
              mode="outlined"
              icon="bell"
              // @ts-ignore
              onPress={() => navigation.navigate('NotificationsScreen')}
              compact
              style={styles.quickButton}
            >
              Уведомления
            </Button>
          </View>
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
  logoutButton: {
    marginTop: 16,
    borderColor: '#8B4513',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickButton: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default ResidentHomeScreen;