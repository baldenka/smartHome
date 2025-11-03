import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, FlatList, TouchableOpacity } from 'react-native';
import { Card, Title, Text, Button, TextInput, Chip, Divider, Checkbox, Searchbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { demoDevices, Device } from '../../utils/demoData';

const CreateQualityReportScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedDevices, setSelectedDevices] = useState<Device[]>([]);
  const [reportTitle, setReportTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<Device['type'] | 'all'>('all');

  // Функция для получения короткого ID (вынесена на верхний уровень)
  const getShortId = (deviceId: string) => {
    return deviceId.split('-').slice(1).join('-');
  };

  // Фильтрация устройств
  const filteredDevices = demoDevices.filter(device => {
    const shortId = getShortId(device.id);
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         device.id.includes(searchQuery) ||
                         shortId.includes(searchQuery);
    const matchesType = selectedType === 'all' || device.type === selectedType;
    return matchesSearch && matchesType;
  });

  const deviceTypes = [
    { key: 'all', title: 'Все устройства' },
    { key: 'lock', title: 'Замки' },
    { key: 'radiator', title: 'Радиаторы' },
    { key: 'water_meter', title: 'Счетчики воды' },
    { key: 'electricity_meter', title: 'Счетчики электричества' },
    { key: 'camera', title: 'Камеры' },
    { key: 'motion_sensor', title: 'Датчики движения' },
    { key: 'light', title: 'Лампочки' },
    { key: 'light_sensor', title: 'Датчики освещения' },
    { key: 'temperature_sensor', title: 'Датчики температуры' },
  ];

  const toggleDeviceSelection = (device: Device) => {
    const isSelected = selectedDevices.some(selected => selected.id === device.id);
    if (isSelected) {
      setSelectedDevices(selectedDevices.filter(selected => selected.id !== device.id));
    } else {
      setSelectedDevices([...selectedDevices, device]);
    }
  };

  const handleGenerateReport = () => {
    if (!reportTitle.trim()) {
      Alert.alert('Ошибка', 'Введите название отчета');
      return;
    }

    if (selectedDevices.length === 0) {
      Alert.alert('Ошибка', 'Выберите хотя бы одно устройство для отчета');
      return;
    }

    const reportData = {
      id: `QR-${Date.now()}`,
      title: reportTitle,
      devices: selectedDevices.map(device => ({
        deviceId: device.id,
        deviceName: device.name,
        deviceType: device.type,
        location: device.location,
        installationDate: device.installationDate,
        status: device.status,
        batteryLevel: device.batteryLevel,
        specifications: device.specifications,
        malfunctions: device.status !== 'online',
        malfunctionDetails: device.status !== 'online' ? `Устройство в статусе: ${device.status}` : '',
        residualResource: device.batteryLevel || 100
      })),
      generatedBy: user?.name || 'Инспектор по качеству',
      generatedAt: new Date().toISOString(),
    };

    Alert.alert(
      'Отчет готов',
      `Отчет "${reportTitle}" успешно сгенерирован. Содержит данные по ${selectedDevices.length} устройствам.`,
      [
        {
          text: 'Закрыть',
          style: 'cancel'
        }
      ]
    );
  };

  const renderDeviceItem = ({ item }: { item: Device }) => {
    const isSelected = selectedDevices.some(selected => selected.id === item.id);
    
    return (
      <TouchableOpacity
        onPress={() => toggleDeviceSelection(item)}
        activeOpacity={0.7}
      >
        <Card 
          style={[
            styles.deviceCard,
            isSelected && styles.selectedDeviceCard
          ]}
        >
          <Card.Content>
            <View style={styles.deviceHeader}>
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{item.name}</Text>
                <Text style={styles.deviceId}>ID: {getShortId(item.id)}</Text>
                <Text style={styles.deviceLocation}>{item.location}</Text>
              </View>
              <Checkbox.Android
                status={isSelected ? 'checked' : 'unchecked'}
                onPress={() => {}} // Пустая функция, так как обработчик уже в TouchableOpacity
              />
            </View>
            
            <View style={styles.deviceDetails}>
              <Chip 
                mode="outlined" 
                textStyle={{ fontSize: 12 }}
                style={{
                  backgroundColor: item.status === 'online' ? '#4caf50' : 
                                 item.status === 'offline' ? '#f44336' : '#ff9800'
                }}
              >
                {item.status === 'online' ? 'вкл.' : 
                 item.status === 'offline' ? 'выкл.' : 'обслуж.'}
              </Chip>
              
              {item.batteryLevel && (
                <Chip mode="outlined" textStyle={{ fontSize: 12 }}>
                  Батарея: {item.batteryLevel}%
                </Chip>
              )}
              
              <Chip mode="outlined" textStyle={{ fontSize: 12 }}>
                {deviceTypes.find(t => t.key === item.type)?.title}
              </Chip>
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Создание отчета по качеству</Title>
          <Text style={styles.subtitle}>
            Отчет о техническом состоянии устройств умного дома
          </Text>

          <TextInput
            label="Название отчета"
            value={reportTitle}
            onChangeText={setReportTitle}
            mode="outlined"
            style={styles.input}
            placeholder="Например: Ежеквартальный отчет за Q1 2024"
          />

          <Divider style={styles.divider} />

          <View style={styles.selectionInfo}>
            <Text style={styles.selectedCount}>
              Выбрано устройств: {selectedDevices.length}
            </Text>
            {selectedDevices.length > 0 && (
              <Button 
                mode="text" 
                compact 
                textColor="#f44336"
                onPress={() => setSelectedDevices([])}
              >
                Очистить выбор
              </Button>
            )}
          </View>

          <View style={styles.filters}>
            <Text style={styles.sectionTitle}>Фильтры</Text>
            
            <Searchbar
              placeholder="Поиск устройств..."
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
            />

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.typeFilters}>
                {deviceTypes.map((type) => (
                  <Chip
                    key={type.key}
                    selected={selectedType === type.key}
                    onPress={() => setSelectedType(type.key as any)}
                    style={styles.typeChip}
                  >
                    {type.title}
                  </Chip>
                ))}
              </View>
            </ScrollView>
          </View>

          <Divider style={styles.divider} />

          <Title style={styles.sectionTitle}>Доступные устройства</Title>
          
          <FlatList
            data={filteredDevices}
            renderItem={renderDeviceItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ListEmptyComponent={
              <Card style={styles.emptyCard}>
                <Card.Content>
                  <Text style={styles.emptyText}>Устройства не найдены</Text>
                  <Text style={styles.emptySubtext}>
                    Попробуйте изменить параметры поиска
                  </Text>
                </Card.Content>
              </Card>
            }
          />

          <View style={styles.actions}>
            <Button 
              mode="contained" 
              onPress={handleGenerateReport}
              style={styles.generateButton}
              icon="file-chart"
              disabled={selectedDevices.length === 0}
            >
              Сгенерировать отчет ({selectedDevices.length})
            </Button>
            
            <Button 
              mode="outlined" 
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
            >
              Отмена
            </Button>
          </View>
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
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  selectionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  filters: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  searchBar: {
    marginBottom: 12,
  },
  typeFilters: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  typeChip: {
    marginRight: 8,
  },
  deviceCard: {
    marginBottom: 8,
    backgroundColor: '#FFF',
  },
  selectedDeviceCard: {
    borderColor: '#8B4513',
    borderWidth: 2,
    backgroundColor: '#FFF8E1',
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  deviceLocation: {
    fontSize: 12,
    color: '#8B4513',
    fontStyle: 'italic',
  },
  deviceDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  emptyCard: {
    marginTop: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  actions: {
    gap: 8,
    marginTop: 16,
  },
  generateButton: {
    marginTop: 8,
  },
  cancelButton: {
    borderColor: '#8B4513',
  },
});

export default CreateQualityReportScreen;