import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button, TextInput, DataTable, Chip, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { demoDevices, getDevicesByType, Device } from '../../utils/demoData';

const TechnicalDataScreen = () => {
  const navigation = useNavigation();
  const [selectedComponent, setSelectedComponent] = useState<Device['type'] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const componentTypes = [
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

  // Функция для получения короткого ID (убираем префикс типа)
  const getShortId = (deviceId: string) => {
    return deviceId.split('-').slice(1).join('-');
  };

  const getComponentData = (type: Device['type']) => {
    const devices = getDevicesByType(type);
    const filteredDevices = searchQuery 
      ? devices.filter(device => 
          device.id.includes(searchQuery) || 
          getShortId(device.id).includes(searchQuery) ||
          device.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : devices;
    
    return filteredDevices;
  };

  const renderComponentTable = (devices: Device[]) => {
    if (!selectedComponent) return null;

    return (
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>ID</DataTable.Title>
          <DataTable.Title>Название</DataTable.Title>
          <DataTable.Title>Статус</DataTable.Title>
          <DataTable.Title>Местоположение</DataTable.Title>
          <DataTable.Title>Батарея</DataTable.Title>
          <DataTable.Title>Подключение</DataTable.Title>
        </DataTable.Header>

        {devices.map((device) => (
          <DataTable.Row key={device.id}>
            <DataTable.Cell>
              <Text style={styles.deviceId}>{getShortId(device.id)}</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styles.deviceName}>{device.name}</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              <Chip 
                mode="outlined" 
                textStyle={{ fontSize: 12 }}
                style={{
                  backgroundColor: device.status === 'online' ? '#4caf50' : 
                                 device.status === 'offline' ? '#f44336' : '#ff9800'
                }}
              >
                {device.status === 'online' ? 'вкл.' : 
                 device.status === 'offline' ? 'выкл.' : 'обслуж.'}
              </Chip>
            </DataTable.Cell>
            <DataTable.Cell>
              <Text style={styles.locationText}>{device.location}</Text>
            </DataTable.Cell>
            <DataTable.Cell>
              {device.batteryLevel ? `${device.batteryLevel}%` : '-'}
            </DataTable.Cell>
            <DataTable.Cell>
              <Chip 
                mode="outlined" 
                textStyle={{ fontSize: 12 }}
                style={{
                  backgroundColor: device.specifications.connection === 'Wi-Fi' ? '#2196f3' : '#ff9800'
                }}
              >
                {device.specifications.connection}
              </Chip>
            </DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    );
  };

  const renderComponentData = () => {
    if (!selectedComponent) return null;

    const devices = getComponentData(selectedComponent);
    const componentTitle = componentTypes.find(c => c.key === selectedComponent)?.title;

    return (
      <Card style={styles.dataCard}>
        <Card.Content>
          <View style={styles.dataHeader}>
            <Title>Состояние {componentTitle}</Title>
            <Searchbar
              placeholder="Поиск по ID или названию"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
            />
          </View>

          <ScrollView horizontal>
            {renderComponentTable(devices)}
          </ScrollView>

          {devices.length === 0 && (
            <Text style={styles.noDataText}>Устройства не найдены</Text>
          )}

          <Text style={styles.devicesCount}>
            Найдено устройств: {devices.length}
          </Text>

          <Button 
            mode="outlined" 
            onPress={() => {
              setSelectedComponent(null);
              setSearchQuery('');
            }}
            style={styles.backButton}
          >
            Назад к списку
          </Button>
        </Card.Content>
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <Title>Технические данные объектов</Title>
          <Text style={styles.subtitle}>
            Мониторинг состояния компонентов системы умного дома
          </Text>
          <Text style={styles.totalDevices}>
            Всего устройств в системе: {demoDevices.length}
          </Text>
        </Card.Content>
      </Card>

      {!selectedComponent ? (
        <Card style={styles.componentsCard}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Компоненты системы</Title>
            <View style={styles.componentsGrid}>
              {componentTypes.map((component) => {
                const deviceCount = getDevicesByType(component.key as Device['type']).length;
                return (
                  <Button
                    key={component.key}
                    mode="outlined"
                    icon={component.icon}
                    onPress={() => setSelectedComponent(component.key as Device['type'])}
                    style={styles.componentButton}
                    contentStyle={styles.componentButtonContent}
                  >
                    {component.title} ({deviceCount})
                  </Button>
                );
              })}
            </View>
          </Card.Content>
        </Card>
      ) : (
        renderComponentData()
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAEBD7',
  },
  headerCard: {
    margin: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  totalDevices: {
    fontSize: 12,
    color: '#8B4513',
    marginTop: 8,
    fontWeight: '500',
  },
  componentsCard: {
    margin: 8,
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  componentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  componentButton: {
    width: '48%',
    marginBottom: 12,
  },
  componentButtonContent: {
    paddingVertical: 8,
  },
  dataCard: {
    margin: 8,
  },
  dataHeader: {
    marginBottom: 16,
  },
  searchBar: {
    marginTop: 8,
  },
  deviceId: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  deviceName: {
    fontSize: 12,
    fontWeight: '500',
    maxWidth: 120,
  },
  locationText: {
    fontSize: 11,
    color: '#666',
    maxWidth: 100,
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  devicesCount: {
    textAlign: 'center',
    marginVertical: 8,
    color: '#8B4513',
    fontWeight: '500',
  },
  backButton: {
    marginTop: 16,
  },
});

export default TechnicalDataScreen;