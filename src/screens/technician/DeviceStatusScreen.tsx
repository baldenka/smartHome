import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Card, Title, Button, Text, TextInput, List, Chip } from 'react-native-paper';
import { demoDevices, getDevicesByType } from '../../utils/demoData';

const DeviceStatusScreen = ({ route, navigation }) => {
  const { deviceType } = route.params;
  const [searchId, setSearchId] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Используем реальные данные из demoData
  const devices = getDevicesByType(deviceType);

  const handleSearch = () => {
    const foundDevice = devices.find(device => 
      device.id === searchId || 
      device.id.includes(searchId) ||
      getShortId(device.id).includes(searchId)
    );
    setSelectedDevice(foundDevice || null);
    if (!foundDevice) {
      alert('Устройство с таким номером не найдено');
    }
  };

  const getShortId = (deviceId: string) => {
    return deviceId.split('-').slice(1).join('-');
  };

  const handleCreateRequestForDevice = (device) => {
    // Переходим на экран создания заявки с предзаполненными данными
    navigation.navigate('CreateRequestScreenT', {
      deviceInfo: {
        id: device.id,
        shortId: getShortId(device.id),
        name: device.name,
        location: device.location,
        status: device.status,
        type: device.type
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return '#4caf50';
      case 'offline': return '#f44336';
      case 'maintenance': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Работает';
      case 'offline': return 'Неисправен';
      case 'maintenance': return 'На обслуживании';
      default: return 'Неизвестно';
    }
  };

  const getDeviceTypeName = (type) => {
    const names = {
      'lock': 'Замков',
      'radiator': 'Радиаторов',
      'water_meter': 'Счетчиков воды',
      'electricity_meter': 'Электросчетчиков',
      'camera': 'Камер',
      'temperature_sensor': 'Датчиков температуры',
      'motion_sensor': 'Датчиков движения',
      'light_sensor': 'Датчиков освещения',
      'light': 'Лампочек'
    };
    return names[type] || 'Устройств';
  };

  const getDeviceIcon = (type) => {
    const icons = {
      'lock': 'lock',
      'radiator': 'radiator',
      'water_meter': 'water',
      'electricity_meter': 'flash',
      'camera': 'camera',
      'temperature_sensor': 'thermometer',
      'motion_sensor': 'motion-sensor',
      'light_sensor': 'white-balance-sunny',
      'light': 'lightbulb'
    };
    return icons[type] || 'cog';
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Состояние {getDeviceTypeName(deviceType)}</Title>
          
          <View style={styles.searchSection}>
            <TextInput
              label={`Номер ${getDeviceTypeName(deviceType).toLowerCase()}`}
              value={searchId}
              onChangeText={setSearchId}
              mode="outlined"
              style={styles.searchInput}
              placeholder="Введите ID устройства..."
            />
            <Button
              mode="contained"
              onPress={handleSearch}
              style={styles.searchButton}
            >
              Поиск
            </Button>
          </View>
        </Card.Content>
      </Card>

      {selectedDevice && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Информация об устройстве</Title>
            <List.Item
              title={selectedDevice.name}
              description={`ID: ${getShortId(selectedDevice.id)}`}
              left={props => (
                <Chip 
                  mode="outlined" 
                  textStyle={{ color: getStatusColor(selectedDevice.status) }}
                  style={{ borderColor: getStatusColor(selectedDevice.status) }}
                >
                  {getStatusText(selectedDevice.status)}
                </Chip>
              )}
            />
            <Text style={styles.deviceInfo}>Местоположение: {selectedDevice.location}</Text>
            <Text style={styles.deviceInfo}>Дата установки: {selectedDevice.installationDate}</Text>
            <Text style={styles.deviceInfo}>Последнее обслуживание: {selectedDevice.lastMaintenance || 'Не указано'}</Text>
            <Text style={styles.deviceInfo}>Уровень батареи: {selectedDevice.batteryLevel ? `${selectedDevice.batteryLevel}%` : 'Не применимо'}</Text>
            <Text style={styles.deviceInfo}>Подключение: {selectedDevice.specifications.connection}</Text>
            
            <Button
              mode="outlined"
              onPress={() => handleCreateRequestForDevice(selectedDevice)}
              style={styles.createRequestButton}
              icon="toolbox"
            >
              Создать заявку по этому устройству
            </Button>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Title>Все устройства ({devices.length})</Title>
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <List.Item
                title={item.name}
                description={`${item.location} | Батарея: ${item.batteryLevel || 'N/A'}%`}
                left={props => <List.Icon {...props} icon={getDeviceIcon(deviceType)} />}
                right={props => (
                  <Chip 
                    mode="outlined" 
                    textStyle={{ 
                      color: getStatusColor(item.status), 
                      fontSize: 12 
                    }}
                    style={{ 
                      borderColor: getStatusColor(item.status),
                      backgroundColor: getStatusColor(item.status) + '20'
                    }}
                  >
                    {getStatusText(item.status)}
                  </Chip>
                )}
                style={styles.deviceItem}
                onPress={() => {
                  setSearchId(item.id);
                  setSelectedDevice(item);
                }}
              />
            )}
            scrollEnabled={false}
          />
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        Назад
      </Button>
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
    elevation: 2,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
  },
  searchButton: {
    height: 56,
    justifyContent: 'center',
  },
  deviceInfo: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
  },
  deviceItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  createRequestButton: {
    marginTop: 16,
  },
  backButton: {
    marginTop: 16,
  },
});

export default DeviceStatusScreen;