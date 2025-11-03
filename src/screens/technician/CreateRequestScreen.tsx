import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Button, TextInput, Text } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { createRequest } from '../../store/requestsSlice';
import { RootState } from '../../store';

const CreateRequestScreen = () => {
  const [theme, setTheme] = useState('');
  const [description, setDescription] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useSelector((state: RootState) => state.auth);

  // Получаем данные устройства из параметров навигации
  const deviceInfo = route.params?.deviceInfo;

  useEffect(() => {
    // Если перешли с информацией об устройстве, предзаполняем поля
    if (deviceInfo) {
      setTheme(`Неисправность: ${deviceInfo.name}`);
      setDescription(`Устройство: ${deviceInfo.name}\nID: ${deviceInfo.shortId}\nМестоположение: ${deviceInfo.location}\nСтатус: ${deviceInfo.status}\n\nОписание проблемы: `);
    }
  }, [deviceInfo]);

  const handleSubmit = () => {
    if (!theme || !description) {
      alert('Заполните все поля');
      return;
    }

    if (user) {
      dispatch(createRequest({
        userId: user.id,
        userFio: user.name,
        userApartment: 'Технический персонал',
        theme: `[ТЕХНИК] ${theme}`,
        description: description,
      }) as any);
      
      alert('Заявка успешно создана и отправлена диспетчеру!');
      setTheme('');
      setDescription('');
      navigation.goBack();
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>
            {deviceInfo ? 'Создание заявки по устройству' : 'Создание заявки для диспетчера'}
          </Title>
          
          <Text style={styles.subtitle}>
            {deviceInfo 
              ? `Создание заявки для устройства: ${deviceInfo.name}`
              : 'Сообщите о неисправности оборудования или необходимости технического обслуживания'
            }
          </Text>

          {deviceInfo && (
            <Card style={styles.deviceInfoCard}>
              <Card.Content>
                <Text style={styles.deviceInfoTitle}>Информация об устройстве:</Text>
                <Text style={styles.deviceInfoText}>Название: {deviceInfo.name}</Text>
                <Text style={styles.deviceInfoText}>ID: {deviceInfo.shortId}</Text>
                <Text style={styles.deviceInfoText}>Местоположение: {deviceInfo.location}</Text>
                <Text style={styles.deviceInfoText}>Тип: {deviceInfo.type}</Text>
                <Text style={styles.deviceInfoText}>Статус: {deviceInfo.status}</Text>
              </Card.Content>
            </Card>
          )}

          <TextInput
            label="Тема заявки"
            value={theme}
            onChangeText={setTheme}
            mode="outlined"
            style={styles.input}
            maxLength={100}
            placeholder="Например: Неисправность системы отопления"
          />

          <TextInput
            label="Описание проблемы"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={6}
            style={styles.input}
            maxLength={500}
            placeholder="Подробно опишите обнаруженную проблему, местоположение оборудования и возможные причины..."
          />

          <Text style={styles.charCount}>
            {description.length}/500 символов
          </Text>

          <Text style={styles.infoText}>
            Заявка будет направлена диспетчеру для дальнейшего распределения
          </Text>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
            disabled={!theme || !description}
            icon="send"
          >
            Отправить заявку диспетчеру
          </Button>

          <Button
            mode="outlined"
            onPress={handleBack}
            style={styles.backButton}
          >
            Отмена
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
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  deviceInfoCard: {
    backgroundColor: '#FFF8E1',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA000',
  },
  deviceInfoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#8B4513',
  },
  deviceInfoText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 2,
  },
  input: {
    marginBottom: 16,
  },
  charCount: {
    textAlign: 'right',
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#8B4513',
    fontStyle: 'italic',
    marginBottom: 16,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: 8,
  },
  submitButtonContent: {
    paddingVertical: 8,
  },
  backButton: {
    marginTop: 8,
  },
});

export default CreateRequestScreen;