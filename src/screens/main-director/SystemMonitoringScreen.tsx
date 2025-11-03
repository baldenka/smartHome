import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button, Chip, DataTable } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { demoDevices, demoRequests, demoWorkData } from '../../utils/demoData';

const SystemMonitoringScreen = () => {
  const devices = demoDevices;
  const requests = useSelector((state: RootState) => state.requests.requests);
  const workData = demoWorkData;

  const systemStats = {
    totalDevices: devices.length,
    onlineDevices: devices.filter(d => d.status === 'online').length,
    offlineDevices: devices.filter(d => d.status === 'offline').length,
    activeRequests: requests.filter(r => r.status === 'in_progress').length,
    pendingRequests: requests.filter(r => r.status === 'created').length,
    completedWorks: workData.length,
    deviceTypes: Array.from(new Set(devices.map(d => d.type))).length
  };

  const getDeviceTypeName = (type: string) => {
    const typeNames: { [key: string]: string } = {
      lock: 'Замки',
      radiator: 'Радиаторы',
      water_meter: 'Счетчики воды',
      electricity_meter: 'Счетчики электричества',
      camera: 'Камеры',
      motion_sensor: 'Датчики движения',
      light: 'Лампы',
      light_sensor: 'Датчики освещения',
      temperature_sensor: 'Датчики температуры'
    };
    return typeNames[type] || type;
  };

  const getStatusColor = (status: string) => {
    return status === 'online' ? '#4caf50' : '#f44336';
  };

  const getStatusText = (status: string) => {
    return status === 'online' ? 'Работает' : 'Не работает';
  };

  const handleRefresh = () => {
    alert('Система обновлена!');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Мониторинг системы</Title>
          <Text style={styles.subtitle}>
            Контроль состояния всех систем умного дома
          </Text>
        </Card.Content>
      </Card>

      {/* Общая статистика системы */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Общее состояние системы</Title>
          <View style={styles.systemStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{systemStats.totalDevices}</Text>
              <Text style={styles.statLabel}>Всего устройств</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#4caf50' }]}>
                {systemStats.onlineDevices}
              </Text>
              <Text style={styles.statLabel}>Работает</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#f44336' }]}>
                {systemStats.offlineDevices}
              </Text>
              <Text style={styles.statLabel}>Не работает</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{systemStats.deviceTypes}</Text>
              <Text style={styles.statLabel}>Типов устройств</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Активность системы */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title>Активность системы</Title>
            <Button mode="outlined" icon="refresh" onPress={handleRefresh}>
              Обновить
            </Button>
          </View>
          
          <View style={styles.activityStats}>
            <View style={styles.activityItem}>
              <Chip mode="outlined" style={styles.activityChip}>
                {systemStats.activeRequests} активных заявок
              </Chip>
            </View>
            <View style={styles.activityItem}>
              <Chip mode="outlined" style={styles.activityChip}>
                {systemStats.pendingRequests} ожидающих заявок
              </Chip>
            </View>
            <View style={styles.activityItem}>
              <Chip mode="outlined" style={styles.activityChip}>
                {systemStats.completedWorks} выполненных работ
              </Chip>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Устройства по типам */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Устройства по типам</Title>
          
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Тип устройства</DataTable.Title>
              <DataTable.Title numeric>Всего</DataTable.Title>
              <DataTable.Title numeric>Работает</DataTable.Title>
              <DataTable.Title numeric>Процент</DataTable.Title>
            </DataTable.Header>

            {Array.from(new Set(devices.map(d => d.type)))
              .map(type => {
                const typeDevices = devices.filter(d => d.type === type);
                const onlineCount = typeDevices.filter(d => d.status === 'online').length;
                const onlinePercent = (onlineCount / typeDevices.length) * 100;
                
                return (
                  <DataTable.Row key={type}>
                    <DataTable.Cell>
                      <Text style={styles.deviceType}>{getDeviceTypeName(type)}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      <Text style={styles.countText}>{typeDevices.length}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      <Text style={[
                        styles.countText,
                        { color: onlinePercent > 80 ? '#4caf50' : onlinePercent > 50 ? '#ff9800' : '#f44336' }
                      ]}>
                        {onlineCount}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      <Text style={styles.percentText}>
                        {Math.round(onlinePercent)}%
                      </Text>
                    </DataTable.Cell>
                  </DataTable.Row>
                );
              })}
          </DataTable>
        </Card.Content>
      </Card>

      {/* Критические устройства */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Критические устройства</Title>
          <Text style={styles.sectionDescription}>
            Устройства требующие внимания
          </Text>

          {devices
            .filter(device => device.status === 'offline' || (device.batteryLevel && device.batteryLevel < 20))
            .slice(0, 5)
            .map(device => (
              <View key={device.id} style={styles.criticalDevice}>
                <View style={styles.deviceInfo}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceLocation}>{device.location}</Text>
                  {device.batteryLevel && device.batteryLevel < 20 && (
                    <Text style={styles.lowBattery}>Низкий заряд: {device.batteryLevel}%</Text>
                  )}
                </View>
                <Chip 
                  mode="outlined"
                  textStyle={{ color: getStatusColor(device.status) }}
                  style={{ borderColor: getStatusColor(device.status) }}
                >
                  {getStatusText(device.status)}
                </Chip>
              </View>
            ))}

          {devices.filter(d => d.status === 'offline').length === 0 && (
            <Text style={styles.noCriticalText}>Критических устройств нет</Text>
          )}
        </Card.Content>
      </Card>

      {/* Рекомендации */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Рекомендации по системе</Title>
          {systemStats.offlineDevices > 0 ? (
            <>
              <Text style={styles.recommendationText}>
                ⚠️ Обнаружено {systemStats.offlineDevices} неработающих устройств
              </Text>
              <Text style={styles.recommendationText}>
                • Рекомендуется провести диагностику оборудования
              </Text>
              <Text style={styles.recommendationText}>
                • Проверить соединение с проблемными устройствами
              </Text>
            </>
          ) : (
            <Text style={styles.recommendationText}>
              ✅ Все системы работают стабильно
            </Text>
          )}
          
          {systemStats.pendingRequests > 0 && (
            <Text style={styles.recommendationText}>
              • Обработать {systemStats.pendingRequests} ожидающих заявок
            </Text>
          )}
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
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  systemStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  activityStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  activityItem: {
    flex: 1,
    minWidth: '30%',
  },
  activityChip: {
    backgroundColor: '#DEB887',
  },
  deviceType: {
    fontSize: 12,
    fontWeight: '500',
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  percentText: {
    fontSize: 12,
    color: '#666',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  criticalDevice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 12,
    fontWeight: '500',
  },
  deviceLocation: {
    fontSize: 11,
    color: '#666',
  },
  lowBattery: {
    fontSize: 10,
    color: '#f44336',
    fontStyle: 'italic',
  },
  noCriticalText: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
    marginVertical: 8,
  },
  recommendationText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
});

export default SystemMonitoringScreen;