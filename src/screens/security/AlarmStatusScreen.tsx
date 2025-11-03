import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Switch, List, Chip, Button } from 'react-native-paper';

const AlarmStatusScreen = () => {
  // Инициализируем состояние сигнализаций
  const [alarmSystems, setAlarmSystems] = useState([
    {
      id: 'ALARM-001',
      name: 'Основная сигнализация',
      location: 'Весь комплекс',
      status: 'armed', // armed - включена, disarmed - выключена, triggered - сработала
      lastActivity: '2024-11-01T10:30:00.000Z',
    },
    {
      id: 'ALARM-002',
      name: 'Периметральная',
      location: 'Внешний периметр',
      status: 'armed',
      lastActivity: '2024-11-01T09:15:00.000Z',
    },
    {
      id: 'ALARM-003',
      name: 'Пожарная сигнализация',
      location: 'Все здания',
      status: 'disarmed',
      lastActivity: '2024-10-31T16:45:00.000Z',
    },
    {
      id: 'ALARM-004',
      name: 'Сигнализация доступа',
      location: 'Центральный вход',
      status: 'armed',
      lastActivity: '2024-11-01T14:20:00.000Z',
    },
  ]);

  const [isEmergency, setIsEmergency] = useState(false);

  // Функция переключения состояния сигнализации
  const toggleSystem = (systemId: string) => {
    setAlarmSystems(prevSystems => 
      prevSystems.map(system => {
        if (system.id === systemId) {
          const newStatus = system.status === 'armed' ? 'disarmed' : 'armed';
          const newLastActivity = new Date().toISOString();
          
          // Показываем уведомление о изменении состояния
          alert(`Сигнализация "${system.name}" ${newStatus === 'armed' ? 'включена' : 'выключена'}`);
          
          return {
            ...system,
            status: newStatus,
            lastActivity: newLastActivity
          };
        }
        return system;
      })
    );
  };

  // Функция сброса тревоги
  const resetAlarm = (systemId: string) => {
    setAlarmSystems(prevSystems => 
      prevSystems.map(system => {
        if (system.id === systemId && system.status === 'triggered') {
          alert(`Тревога системы "${system.name}" сброшена`);
          return {
            ...system,
            status: 'armed', // После сброса включаем сигнализацию
            lastActivity: new Date().toISOString()
          };
        }
        return system;
      })
    );
  };

  // Функция тестирования тревоги (для демонстрации)
  const testAlarm = (systemId: string) => {
    setAlarmSystems(prevSystems => 
      prevSystems.map(system => {
        if (system.id === systemId) {
          alert(`ТЕСТ: Сигнализация "${system.name}" сработала!`);
          return {
            ...system,
            status: 'triggered',
            lastActivity: new Date().toISOString()
          };
        }
        return system;
      })
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'armed': return '#4caf50';
      case 'disarmed': return '#ff9800';
      case 'triggered': return '#f44336';
      default: return '#9e9e9e';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'armed': return 'ВКЛЮЧЕНА';
      case 'disarmed': return 'ВЫКЛЮЧЕНА';
      case 'triggered': return 'СРАБОТАЛА!';
      default: return 'НЕИЗВЕСТНО';
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'armed': return 'Система активна и отслеживает события';
      case 'disarmed': return 'Система отключена и не отслеживает события';
      case 'triggered': return 'Обнаружена угроза! Требуется немедленная реакция';
      default: return 'Статус системы неизвестен';
    }
  };

  const handleEmergency = () => {
    setIsEmergency(true);
    
    // Включаем все сигнализации при экстренном вызове
    setAlarmSystems(prevSystems => 
      prevSystems.map(system => ({
        ...system,
        status: 'armed',
        lastActivity: new Date().toISOString()
      }))
    );
    
    alert('🚨 ЭКСТРЕННАЯ СИТУАЦИЯ! Все системы сигнализации активированы. Службы оповещены!');
  };

  const cancelEmergency = () => {
    setIsEmergency(false);
    alert('Экстренная ситуация отменена');
  };

  // Статистика для отображения в заголовке
  const activeAlarms = alarmSystems.filter(system => system.status === 'armed').length;
  const totalAlarms = alarmSystems.length;
  const triggeredAlarms = alarmSystems.filter(system => system.status === 'triggered').length;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Системы сигнализации</Title>
          <Text style={styles.subtitle}>
            Управление и мониторинг систем безопасности
          </Text>
          
          {/* Статистика */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{activeAlarms}</Text>
              <Text style={styles.statLabel}>Активны</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalAlarms}</Text>
              <Text style={styles.statLabel}>Всего</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, triggeredAlarms > 0 && styles.triggeredStat]}>
                {triggeredAlarms}
              </Text>
              <Text style={styles.statLabel}>Тревога</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <ScrollView>
        {alarmSystems.map((system) => (
          <Card key={system.id} style={[
            styles.systemCard,
            system.status === 'triggered' && styles.triggeredCard
          ]}>
            <Card.Content>
              <View style={styles.systemHeader}>
                <View style={styles.systemInfo}>
                  <Text style={styles.systemName}>{system.name}</Text>
                  <Text style={styles.systemLocation}>{system.location}</Text>
                </View>
                <Chip 
                  mode="outlined" 
                  style={[
                    styles.statusChip,
                    { borderColor: getStatusColor(system.status) }
                  ]}
                  textStyle={{ 
                    color: getStatusColor(system.status), 
                    fontSize: 10,
                    fontWeight: 'bold'
                  }}
                >
                  {getStatusText(system.status)}
                </Chip>
              </View>

              <Text style={styles.statusDescription}>
                {getStatusDescription(system.status)}
              </Text>

              <Text style={styles.lastActivity}>
                Последняя активность: {new Date(system.lastActivity).toLocaleString('ru-RU')}
              </Text>

              <View style={styles.actions}>
                {/* Основная кнопка управления */}
                <Button 
                  mode={system.status === 'armed' ? "outlined" : "contained"}
                  onPress={() => toggleSystem(system.id)}
                  style={styles.toggleButton}
                  buttonColor={system.status === 'armed' ? undefined : '#4caf50'}
                  textColor={system.status === 'armed' ? '#4caf50' : undefined}
                >
                  {system.status === 'armed' ? 'Отключить' : 'Включить'}
                </Button>
                
                {/* Кнопка сброса тревоги */}
                {system.status === 'triggered' && (
                  <Button 
                    mode="contained"
                    buttonColor="#f44336"
                    onPress={() => resetAlarm(system.id)}
                    style={styles.resetButton}
                  >
                    Сброс тревоги
                  </Button>
                )}
                
                {/* Кнопка тестирования (только для включенных систем) */}
                {system.status === 'armed' && (
                  <Button 
                    mode="outlined"
                    onPress={() => testAlarm(system.id)}
                    style={styles.testButton}
                    textColor="#ff9800"
                  >
                    Тест
                  </Button>
                )}
              </View>
            </Card.Content>
          </Card>
        ))}

        {/* Экстренная кнопка */}
        <Card style={[styles.card, isEmergency && styles.emergencyCard]}>
          <Card.Content>
            <Title style={isEmergency ? styles.emergencyTitle : undefined}>
              {isEmergency ? '🚨 ЭКСТРЕННАЯ СИТУАЦИЯ 🚨' : 'Экстренные действия'}
            </Title>
            <Text style={styles.emergencyText}>
              {isEmergency 
                ? 'Все системы активированы. Службы оповещены. Ожидайте прибытия.' 
                : 'Используйте только в случае реальной угрозы. Активирует все системы сигнализации.'
              }
            </Text>
            <Button 
              mode="contained"
              buttonColor={isEmergency ? "#ff5722" : "#d32f2f"}
              onPress={isEmergency ? cancelEmergency : handleEmergency}
              style={styles.emergencyButton}
              icon={isEmergency ? "shield-check" : "alert"}
            >
              {isEmergency ? 'Отмена тревоги' : 'Экстренный вызов'}
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEBD7',
    padding: 8,
  },
  card: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  triggeredStat: {
    color: '#f44336',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  systemCard: {
    marginBottom: 8,
    elevation: 2,
  },
  triggeredCard: {
    borderColor: '#f44336',
    borderWidth: 2,
    backgroundColor: '#ffebee',
  },
  systemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  systemInfo: {
    flex: 1,
    marginRight: 8,
  },
  systemName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  systemLocation: {
    fontSize: 14,
    color: '#333',
  },
  statusChip: {
    backgroundColor: 'transparent',
  },
  statusDescription: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  lastActivity: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  toggleButton: {
    flex: 1,
    marginRight: 8,
    minWidth: 100,
  },
  resetButton: {
    flex: 1,
    marginLeft: 8,
    minWidth: 100,
  },
  testButton: {
    flex: 1,
    marginLeft: 8,
    minWidth: 80,
  },
  emergencyCard: {
    borderColor: '#f44336',
    borderWidth: 2,
    backgroundColor: '#ffebee',
  },
  emergencyTitle: {
    color: '#f44336',
    textAlign: 'center',
  },
  emergencyText: {
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
    lineHeight: 20,
  },
  emergencyButton: {
    marginBottom: 8,
  },
});

export default AlarmStatusScreen;