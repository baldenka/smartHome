import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/authSlice';
import { RootState } from '../../store';

const TechnicianHomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const deviceTypes = [
    { key: 'lock', title: 'Замки', icon: 'lock' },
    { key: 'radiator', title: 'Радиаторы', icon: 'radiator' },
    { key: 'water_meter', title: 'Счетчики воды', icon: 'water' },
    { key: 'electricity_meter', title: 'Счетчики электричества', icon: 'flash' },
    { key: 'camera', title: 'Камеры', icon: 'camera' },
    { key: 'motion_sensor', title: 'Датчики движения', icon: 'motion-sensor' },
    { key: 'light', title: 'Лампочки', icon: 'lightbulb' },
    { key: 'light_sensor', title: 'Датчики освещения', icon: 'white-balance-sunny' },
    { key: 'temperature_sensor', title: 'Датчики температуры', icon: 'thermometer' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Личный кабинет техника по эксплуатации</Title>
          <Text style={styles.userName}>{user?.name}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Мониторинг устройств</Title>
          <Text style={styles.sectionDescription}>
            Просмотр состояния компонентов системы
          </Text>
          
          <View style={styles.devicesGrid}>
            {deviceTypes.map((device) => (
              <Button
                key={device.key}
                mode="outlined"
                icon={device.icon}
                // @ts-ignore
                onPress={() => navigation.navigate('DeviceStatusScreen', { deviceType: device.key })}
                style={styles.deviceButton}
                contentStyle={styles.deviceButtonContent}
              >
                {device.title}
              </Button>
            ))}
          </View>

          <Button
            mode="contained"
            icon="chart-line"
            // @ts-ignore
            onPress={() => navigation.navigate('TechnicalDataScreen')}
            style={styles.technicalDataButton}
            contentStyle={styles.technicalDataButtonContent}
          >
            Общий мониторинг системы
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Рабочие функции</Title>
          
          <Button
            mode="contained"
            icon="toolbox"
            // @ts-ignore
            onPress={() => navigation.navigate('CreateRequestScreenT')}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
          >
            Создать заявку для диспетчера
          </Button>
          
          <Button
            mode="outlined"
            icon="bell"
            // @ts-ignore
            onPress={() => navigation.navigate('NotificationsScreen')}
            style={styles.menuButton}
            contentStyle={styles.menuButtonContent}
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
            onPress={() => {dispatch(logout())}}
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
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  devicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  deviceButton: {
    width: '48%',
    marginBottom: 12,
  },
  deviceButtonContent: {
    paddingVertical: 8,
  },
  technicalDataButton: {
    marginTop: 8,
  },
  technicalDataButtonContent: {
    paddingVertical: 8,
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

export default TechnicianHomeScreen;