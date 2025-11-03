import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { RootState } from '../../store';

const MainDirectorHomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.auth.user);
  const unreadNotifications = useSelector((state: RootState) => 
    state.notifications.notifications.filter(n => !n.read).length
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Личный кабинет главного директора</Title>
          <Text style={styles.userName}>{user?.name}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Основные функции</Title>
          
          <Button
            mode="contained"
            icon="account-multiple"
            onPress={() => navigation.navigate('UserEditorScreen' as never)}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Редактор пользователей
          </Button>
          
          <Button
            mode="contained"
            icon="send"
            onPress={() => navigation.navigate('SendMessageScreen' as never)}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Отправить сообщение
          </Button>
          
          <Button
            mode="contained"
            icon="clipboard-check"
            onPress={() => navigation.navigate('WorkReportsScreen' as never)}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Отчеты о работах
          </Button>
          
          <Button
            mode="contained"
            icon="chart-box"
            onPress={() => navigation.navigate('TechnicalReportsScreen' as never)}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Технические отчеты
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Аналитика и мониторинг</Title>
          
          <Button
            mode="outlined"
            icon="chart-bar"
            onPress={() => navigation.navigate('MainDirectorAnalyticsScreen' as never)}
            style={styles.analyticsButton}
            contentStyle={styles.menuButtonContent}
          >
            Общая аналитика
          </Button>
          
          <Button
            mode="outlined"
            icon="monitor-dashboard"
            onPress={() => navigation.navigate('SystemMonitoringScreen' as never)}
            style={styles.analyticsButton}
            contentStyle={styles.menuButtonContent}
          >
            Мониторинг системы
          </Button>

          <Button
            mode="outlined"
            icon="bell"
            onPress={() => navigation.navigate('NotificationsScreen' as never)}
            compact
            style={styles.menuButtonContent}
          >
            Уведомления
          </Button>
          
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
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
  analyticsButton: {
    marginBottom: 8,
    borderColor: '#8B4513',
  },
  logoutButton: {
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

export default MainDirectorHomeScreen;