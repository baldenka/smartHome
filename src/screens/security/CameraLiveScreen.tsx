import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, Title, Text, Button, TextInput, Chip } from 'react-native-paper';

const { width } = Dimensions.get('window');

const CameraLiveScreen = () => {
  const [selectedCamera, setSelectedCamera] = useState('');
  const [cameras] = useState([
    { id: 'CAM-001', name: 'Главный вход', location: 'Подъезд 1', status: 'online' },
    { id: 'CAM-002', name: 'Парковка', location: 'Парковка', status: 'online' },
    { id: 'CAM-003', name: 'Детская площадка', location: 'Двор', status: 'offline' },
    { id: 'CAM-004', name: 'Черный ход', location: 'Подъезд 2', status: 'online' },
  ]);

  const openCamera = (cameraId: string) => {
    setSelectedCamera(cameraId);
    // В реальном приложении здесь будет открытие видеопотока
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Трансляции с камер</Title>
          <Text style={styles.subtitle}>
            Просмотр видео в реальном времени
          </Text>
        </Card.Content>
      </Card>

      {selectedCamera ? (
        <Card style={styles.card}>
          <Card.Content>
            <Title>Трансляция: {selectedCamera}</Title>
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoText}>Видеопоток камеры</Text>
              <Text style={styles.cameraInfo}>{selectedCamera}</Text>
            </View>
            <Button 
              mode="outlined" 
              onPress={() => setSelectedCamera('')}
              style={styles.backButton}
            >
              Назад к списку
            </Button>
          </Card.Content>
        </Card>
      ) : (
        <ScrollView>
          <Card style={styles.card}>
            <Card.Content>
              <Title>Доступные камеры</Title>
              {cameras.map((camera) => (
                <Card 
                  key={camera.id} 
                  style={styles.cameraCard}
                  onPress={() => openCamera(camera.id)}
                >
                  <Card.Content>
                    <View style={styles.cameraHeader}>
                      <Text style={styles.cameraName}>{camera.name}</Text>
                      <Chip 
                        mode="outlined"
                        textStyle={{ 
                          color: camera.status === 'online' ? '#4caf50' : '#f44336',
                          fontSize: 10 
                        }}
                      >
                        {camera.status === 'online' ? 'ОНЛАЙН' : 'ОФФЛАЙН'}
                      </Chip>
                    </View>
                    <Text style={styles.cameraLocation}>{camera.location}</Text>
                    <Text style={styles.cameraId}>ID: {camera.id}</Text>
                    <Button 
                      mode="contained" 
                      disabled={camera.status !== 'online'}
                      style={styles.viewButton}
                    >
                      Смотреть трансляцию
                    </Button>
                  </Card.Content>
                </Card>
              ))}
            </Card.Content>
          </Card>
        </ScrollView>
      )}
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
  },
  cameraCard: {
    marginBottom: 8,
    elevation: 2,
  },
  cameraHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cameraName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  cameraLocation: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  cameraId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  viewButton: {
    marginTop: 4,
  },
  videoPlaceholder: {
    height: 200,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 16,
  },
  videoText: {
    color: 'white',
    fontSize: 16,
  },
  cameraInfo: {
    color: 'white',
    fontSize: 12,
    marginTop: 8,
  },
  backButton: {
    marginTop: 8,
  },
});

export default CameraLiveScreen;