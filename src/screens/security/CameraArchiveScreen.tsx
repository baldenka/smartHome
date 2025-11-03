// В CameraArchiveScreen.tsx замените текущий код на этот:

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Card, Title, Text, Button, TextInput, List } from 'react-native-paper';

const CameraArchiveScreen = () => {
  const [searchDate, setSearchDate] = useState('');
  const [filteredRecordings, setFilteredRecordings] = useState([]);
  const [recordings] = useState([
    {
      id: '1',
      cameraId: 'CAM-001',
      cameraName: 'Главный вход',
      date: '2024-11-01',
      startTime: '10:00',
      endTime: '11:00',
      duration: '1 час',
    },
    {
      id: '2',
      cameraId: 'CAM-002',
      cameraName: 'Парковка', 
      date: '2024-11-01',
      startTime: '14:30',
      endTime: '15:45',
      duration: '1 час 15 мин',
    },
    {
      id: '3',
      cameraId: 'CAM-004',
      cameraName: 'Черный ход',
      date: '2024-10-31',
      startTime: '20:15',
      endTime: '21:30',
      duration: '1 час 15 мин',
    },
  ]);

  const searchRecordings = () => {
    if (!searchDate) {
      alert('Введите дату для поиска');
      return;
    }
    
    // Простая валидация даты
    const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
    if (!dateRegex.test(searchDate)) {
      alert('Введите дату в формате ДД.ММ.ГГГГ');
      return;
    }
    
    // Конвертируем дату из ДД.ММ.ГГГГ в ГГГГ-ММ-ДД
    const [day, month, year] = searchDate.split('.');
    const searchDateFormatted = `${year}-${month}-${day}`;
    
    const filtered = recordings.filter(rec => rec.date === searchDateFormatted);
    setFilteredRecordings(filtered);
    
    if (filtered.length === 0) {
      alert('Записей за указанную дату не найдено');
    }
  };

  const downloadRecording = (recordingId: string) => {
    alert(`Скачивание записи ${recordingId}`);
  };

  const displayRecordings = filteredRecordings.length > 0 ? filteredRecordings : recordings;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Архив видеозаписей</Title>
          <Text style={styles.subtitle}>
            Просмотр и скачивание записей с камер
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Поиск записей</Title>
          <TextInput
            label="Дата записи (ДД.ММ.ГГГГ)"
            value={searchDate}
            onChangeText={setSearchDate}
            mode="outlined"
            style={styles.searchInput}
            placeholder="01.11.2024"
          />
          <Button 
            mode="contained" 
            onPress={searchRecordings}
            style={styles.searchButton}
          >
            Найти записи
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Доступные записи</Title>
          <FlatList
            data={displayRecordings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <List.Item
                title={item.cameraName}
                description={`${item.date} ${item.startTime}-${item.endTime}`}
                left={props => <List.Icon {...props} icon="cctv" />}
                right={props => (
                  <View style={styles.recordingActions}>
                    <Text style={styles.duration}>{item.duration}</Text>
                    <Button 
                      mode="outlined" 
                      compact
                      onPress={() => downloadRecording(item.id)}
                      style={styles.downloadButton}
                    >
                      Скачать
                    </Button>
                  </View>
                )}
                style={styles.recordingItem}
              />
            )}
          />
        </Card.Content>
      </Card>
    </View>
  );
};

// Стили остаются теми же...
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
  searchInput: {
    marginBottom: 12,
  },
  searchButton: {
    marginTop: 8,
  },
  recordingItem: {
    backgroundColor: 'white',
    marginBottom: 4,
    elevation: 1,
  },
  recordingActions: {
    alignItems: 'flex-end',
  },
  duration: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  downloadButton: {
    marginTop: 4,
  },
});

export default CameraArchiveScreen;