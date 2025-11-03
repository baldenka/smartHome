import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, Button, DataTable, TextInput, ActivityIndicator } from 'react-native-paper';

const WorkReportsScreen = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [workData] = useState([
    {
      id: '1',
      taskNumber: 'TASK-001',
      requestNumber: 'REQ-004',
      employee: 'Петров В.Г.',
      task: 'Замена лампочки в подъезде 3',
      result: 'Лампочка заменена',
      executionTime: '30 минут',
    },
    {
      id: '2',
      taskNumber: 'TASK-002', 
      requestNumber: 'REQ-003',
      employee: 'Иванов А.Б.',
      task: 'Ремонт радиатора в квартире 45',
      result: 'Радиатор отремонтирован',
      executionTime: '2 часа',
    },
    {
      id: '3',
      taskNumber: 'TASK-003',
      requestNumber: 'REQ-001',
      employee: 'Сидоров Д.Е.',
      task: 'Устранение протечки в ванной комнате',
      result: 'Протечка устранена',
      executionTime: '3 часа',
    },
  ]);

  const generateWorkReport = async () => {
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

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Отчеты о проделанных работах</Title>
          <Text style={styles.subtitle}>
            Учет выполненных задач и работ по шаблону
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
            onPress={generateWorkReport}
            style={styles.generateButton}
            icon="file-document"
            disabled={!startDate || !endDate || isGenerating}
            loading={isGenerating}
          >
            {isGenerating ? 'Генерация...' : 'Сгенерировать отчет о работах'}
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
          <Title>Последние выполненные работы</Title>
          <Text style={styles.periodLabel}>Период выполнения:</Text>
          <Text style={styles.periodValue}>01.11.2024 - 30.11.2024</Text>
          
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Задача</DataTable.Title>
              <DataTable.Title>Сотрудник</DataTable.Title>
              <DataTable.Title numeric>Время</DataTable.Title>
              <DataTable.Title>Статус</DataTable.Title>
            </DataTable.Header>

            {workData.map((work) => (
              <DataTable.Row key={work.id}>
                <DataTable.Cell>
                  <Text style={styles.taskText}>{work.task}</Text>
                  <Text style={styles.taskNumber}>{work.taskNumber}</Text>
                  {work.requestNumber && (
                    <Text style={styles.requestNumber}>Заявка: {work.requestNumber}</Text>
                  )}
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.employeeText}>{work.employee}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={styles.timeText}>{work.executionTime}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.completedStatus}>Выполнено</Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

// Стили остаются без изменений
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
  periodLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  periodValue: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
  },
  taskText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskNumber: {
    fontSize: 10,
    color: '#666',
  },
  requestNumber: {
    fontSize: 9,
    color: '#8B4513',
    fontStyle: 'italic',
  },
  employeeText: {
    fontSize: 12,
  },
  timeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  completedStatus: {
    fontSize: 10,
    color: '#4caf50',
    fontWeight: 'bold',
  },
});

export default WorkReportsScreen;