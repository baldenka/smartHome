import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

const TechnicalDirectorHomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { requests } = useSelector((state: RootState) => state.requests);
  const user = useSelector((state: RootState) => state.auth.user);

  const pendingRequestsCount = requests.filter(r => r.status === 'processing').length;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Личный кабинет технического директора</Title>
          <Text style={styles.userName}>{user?.name}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Распределение заявок</Title>
          
          <Button
            mode="contained"
            icon="clipboard-arrow-right"
            // @ts-ignore
            onPress={() => navigation.navigate('DistributionRequestsScreen')}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            <View style={styles.buttonWithBadge}>
              <Text>Просмотр заявок на распределение</Text>
              {pendingRequestsCount > 0 && (
                <Text style={styles.badgeText}>({pendingRequestsCount})</Text>
              )}
            </View>
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Отчетность</Title>
          
          <Button
            mode="contained"
            icon="file-chart"
            // @ts-ignore
            onPress={() => navigation.navigate('TechnicalReportsScreen')}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Отчеты по тех. состоянию объектов
          </Button>
          
          <Button
            mode="contained"
            icon="file-document"
            // @ts-ignore
            onPress={() => navigation.navigate('WorkReportsScreen')}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Отчеты о проделанных работах
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
  buttonWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  quickButton: {
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 16,
    borderColor: '#8B4513',
  },
});

export default TechnicalDirectorHomeScreen;