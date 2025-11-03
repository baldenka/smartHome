import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Button, TextInput, Text, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const CreateWorkReportScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state: RootState) => state.auth);
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [reportTitle, setReportTitle] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleGenerateReport = () => {
    if (!periodStart || !periodEnd || !reportTitle) {
      Alert.alert('Ошибка', 'Заполните обязательные поля: период и название отчета');
      return;
    }

    const reportData = {
      id: `WR-${Date.now()}`,
      title: reportTitle,
      period: {
        start: periodStart,
        end: periodEnd
      },
      additionalInfo: additionalInfo,
      generatedBy: user?.name || 'Бухгалтер',
      generatedAt: new Date().toISOString(),
    };

    Alert.alert(
      'Отчет готов',
      `Отчет "${reportTitle}" успешно сгенерирован за период с ${periodStart} по ${periodEnd}`,
      [
        {
          text: 'Скачать PDF',
          onPress: () => {
            console.log('Генерация PDF отчета:', reportData);
            navigation.goBack();
          }
        },
        {
          text: 'Просмотреть',
          onPress: () => {
            console.log('Просмотр отчета:', reportData);
          }
        },
        {
          text: 'Закрыть',
          style: 'cancel'
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Создание отчета о работах</Title>
          <Text style={styles.subtitle}>
            Генерация финансового отчета по выполненным работам
          </Text>

          <TextInput
            label="Название отчета *"
            value={reportTitle}
            onChangeText={setReportTitle}
            mode="outlined"
            style={styles.input}
            placeholder="Например: Финансовый отчет за ноябрь 2024"
          />

          <View style={styles.periodSection}>
            <TextInput
              label="Начало периода *"
              value={periodStart}
              onChangeText={setPeriodStart}
              mode="outlined"
              style={styles.periodInput}
              placeholder="ДД.ММ.ГГГГ"
            />
            <TextInput
              label="Конец периода *"
              value={periodEnd}
              onChangeText={setPeriodEnd}
              mode="outlined"
              style={styles.periodInput}
              placeholder="ДД.ММ.ГГГГ"
            />
          </View>

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Дополнительная информация</Text>
          
          <TextInput
            label="Комментарии к отчету"
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
            placeholder="Дополнительные заметки, комментарии или пояснения к отчету..."
          />

          <Card style={styles.infoCard}>
            <Card.Content>
              <Text style={styles.infoTitle}>Что будет включено в отчет:</Text>
              <Text style={styles.infoItem}>• Все выполненные работы за указанный период</Text>
              <Text style={styles.infoItem}>• Финансовая сводка по затратам</Text>
              <Text style={styles.infoItem}>• Статистика по сотрудникам</Text>
              <Text style={styles.infoItem}>• Анализ эффективности работ</Text>
            </Card.Content>
          </Card>

          <View style={styles.actions}>
            <Button
              mode="contained"
              onPress={handleGenerateReport}
              style={styles.generateButton}
              icon="file-chart"
              disabled={!periodStart || !periodEnd || !reportTitle}
            >
              Сгенерировать отчет
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
    elevation: 2,
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
  periodSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  periodInput: {
    flex: 1,
    marginRight: 8,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#FFF8E1',
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA000',
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#8B4513',
  },
  infoItem: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
  actions: {
    gap: 8,
  },
  generateButton: {
    marginTop: 8,
  },
  cancelButton: {
    borderColor: '#8B4513',
  },
});

export default CreateWorkReportScreen;