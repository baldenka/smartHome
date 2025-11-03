import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, Button, DataTable, TextInput, ActivityIndicator } from 'react-native-paper';

const TechnicalReportsScreen = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [devices] = useState([
    {
      id: 'LOCK-001',
      name: 'Замок подъезда 1',
      startDate: '2022-05-15',
      malfunctions: false,
      residualResource: 85,
    },
    {
      id: 'CAM-003', 
      name: 'Камера парковка',
      startDate: '2023-01-20',
      malfunctions: true,
      malfunctionDetails: 'Размытое изображение',
      residualResource: 45,
    },
    {
      id: 'RAD-001',
      name: 'Радиатор подъезд 2',
      startDate: '2021-10-10', 
      malfunctions: false,
      residualResource: 60,
    },
  ]);

  const generateTechnicalReport = async () => {
    if (!startDate || !endDate) {
      Alert.alert('Ошибка', 'Заполните даты начала и окончания периода');
      return;
    }
  
    setIsGenerating(true);
    
    // Простая имитация
    setTimeout(() => {
      Alert.alert(
        'Отчет готов!', 
        `Технический отчет за период ${startDate} - ${endDate} сгенерирован.`,
        [{ text: 'OK' }]
      );
      setIsGenerating(false);
    }, 1500);
  };

  const getStatusColor = (status: boolean) => {
    return status ? '#f44336' : '#4caf50';
  };

  const getStatusText = (status: boolean) => {
    return status ? 'Неисправно' : 'Работает';
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Отчеты по техническому состоянию</Title>
          <Text style={styles.subtitle}>
            Генерация отчетов о состоянии устройств умного дома
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Параметры отчета</Title>
          
          <View style={styles.dateInputs}>
            <TextInput
              label="Начало периода (ДД.ММ.ГГГГ)"
              value={startDate}
              onChangeText={setStartDate}
              mode="outlined"
              style={styles.dateInput}
              placeholder="01.11.2024"
            />
            <TextInput
              label="Конец периода (ДД.ММ.ГГГГ)"
              value={endDate}
              onChangeText={setEndDate}
              mode="outlined"
              style={styles.dateInput}
              placeholder="30.11.2024"
            />
          </View>

          <Button 
            mode="contained" 
            onPress={generateTechnicalReport}
            style={styles.generateButton}
            icon="file-chart"
            disabled={!startDate || !endDate || isGenerating}
            loading={isGenerating}
          >
            {isGenerating ? 'Генерация...' : 'Сгенерировать отчет'}
          </Button>

          {isGenerating && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#8B4513" />
              <Text style={styles.loadingText}>Создание PDF отчета...</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Текущее состояние устройств</Title>
          <Text style={styles.stats}>
            Всего устройств: {devices.length} | Работающих: {devices.filter(d => !d.malfunctions).length} | Неисправных: {devices.filter(d => d.malfunctions).length}
          </Text>
          
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Устройство</DataTable.Title>
              <DataTable.Title numeric>Ресурс</DataTable.Title>
              <DataTable.Title>Статус</DataTable.Title>
              <DataTable.Title>Дата ввода</DataTable.Title>
            </DataTable.Header>

            {devices.map((device) => (
              <DataTable.Row key={device.id}>
                <DataTable.Cell>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceId}>ID: {device.id}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={[
                    styles.resourceText,
                    { color: device.residualResource > 70 ? '#4caf50' : device.residualResource > 30 ? '#ff9800' : '#f44336' }
                  ]}>
                    {device.residualResource}%
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={[
                    styles.statusText,
                    { color: getStatusColor(device.malfunctions) }
                  ]}>
                    {getStatusText(device.malfunctions)}
                  </Text>
                  {device.malfunctions && (
                    <Text style={styles.malfunctionDetails}>
                      {device.malfunctionDetails}
                    </Text>
                  )}
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.dateText}>
                    {new Date(device.startDate).toLocaleDateString('ru-RU')}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>
    </ScrollView>
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
  },
  dateInputs: {
    marginBottom: 16,
  },
  dateInput: {
    marginBottom: 12,
  },
  generateButton: {
    marginTop: 8,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  loadingText: {
    marginLeft: 8,
    color: '#666',
  },
  stats: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  deviceName: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  deviceId: {
    fontSize: 10,
    color: '#666',
  },
  resourceText: {
    fontWeight: 'bold',
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  malfunctionDetails: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  dateText: {
    fontSize: 11,
    color: '#666',
  },
});

export default TechnicalReportsScreen;