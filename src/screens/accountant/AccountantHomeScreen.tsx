import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { RootState } from '../../store';

const AccountantHomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Личный кабинет бухгалтера</Title>
          <Text style={styles.welcomeText}>{user?.name}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Основные функции</Title>
          
          <Button
            mode="contained"
            icon="clipboard-check"
            // @ts-ignore
            onPress={() => navigation.navigate('WorkDataScreen')}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Данные о проделанных работах
          </Button>
          
          <Button
            mode="contained"
            icon="water"
            // @ts-ignore
            onPress={() => navigation.navigate('CounterDataScreen')}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Данные со счетчиков
          </Button>
          
          <Button
            mode="contained"
            icon="file-document"
            // @ts-ignore
            onPress={() => navigation.navigate('CreateWorkReportScreen')}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Создать отчет о работах
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
    borderColor: '#8B4513',
  },
});

export default AccountantHomeScreen;