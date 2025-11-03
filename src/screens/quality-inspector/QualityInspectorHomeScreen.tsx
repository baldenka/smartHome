import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Button, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../../store/authSlice';
import { RootState } from '../../store';


const QualityInspectorHomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Личный кабинет инспектора по качеству</Title>
          <Text style={styles.userName}>{user?.name}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Основные функции</Title>
          
          <Button
            mode="contained"
            icon="chart-line"
            // @ts-ignore
            onPress={() => navigation.navigate('TechnicalDataScreen')}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Просмотр тех. данных объектов
          </Button>
          
          <Button
            mode="contained"
            icon="file-chart"
            // @ts-ignore
            onPress={() => navigation.navigate('CreateQualityReportScreen')}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Создать отчет по качеству
          </Button>

          <Button
            mode="contained"
            icon="message-alert"
            onPress={() => navigation.navigate('SendMessageScreen' as never)}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Отправить уведомление технику
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Быстрый доступ</Title>
          
          <Button
            mode="outlined"
            icon="bell"
            // @ts-ignore
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
  quickButton: {
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 16,
    borderColor: '#8B4513',
  },
});

export default QualityInspectorHomeScreen;