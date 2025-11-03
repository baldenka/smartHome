import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Button, Text, Badge } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

const DispatcherHomeScreen = () => {
  const navigation = useNavigation();
  const { requests } = useSelector((state: RootState) => state.requests);
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);


  // Исправляем фильтрацию согласно новым статусам
  const newRequestsCount = requests.filter(r => r.status === 'created').length;
  const inProgressCount = requests.filter(r => r.status === 'in_progress').length;

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Личный кабинет диспетчера</Title>
          <Text style={styles.userName}>{user?.name}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Управление заявками</Title>
          
          <Button
            mode="contained"
            icon="clipboard-list"
            // @ts-ignore
            onPress={() => navigation.navigate('UnprocessedRequestsScreen')}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            <View style={styles.buttonWithBadge}>
              <Text>Просмотр необработанных заявок</Text>
              {newRequestsCount > 0 && (
                <Badge style={styles.badge}>{newRequestsCount}</Badge>
              )}
            </View>
          </Button>
          
          <Button
            mode="contained"
            icon="progress-wrench"
            // @ts-ignore
            onPress={() => navigation.navigate('InProgressRequestsScreen')}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            <View style={styles.buttonWithBadge}>
              <Text>Просмотр заявок в исполнении</Text>
              {inProgressCount > 0 && (
                <Badge style={styles.badge}>{inProgressCount}</Badge>
              )}
            </View>
          </Button>
          
          <Button
            mode="contained"
            icon="archive"
            // @ts-ignore
            onPress={() => navigation.navigate('RequestArchiveScreen')}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Просмотр архива заявок
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
  badge: {
    marginLeft: 8,
  },
  quickButton: {
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 16,
    borderColor: '#8B4513',
  },
});

export default DispatcherHomeScreen;