import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Title, Button, Text, TextInput } from 'react-native-paper';

interface ReportGeneratorProps {
  reportType: 'work' | 'technical';
  onGenerate: (data: any) => void;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ reportType, onGenerate }) => {
  const [periodStart, setPeriodStart] = useState('');
  const [periodEnd, setPeriodEnd] = useState('');
  const [tasks, setTasks] = useState([{ taskNumber: '', employee: '', task: '', result: '', executionTime: '' }]);

  const addTask = () => {
    setTasks([...tasks, { taskNumber: '', employee: '', task: '', result: '', executionTime: '' }]);
  };

  const updateTask = (index: number, field: string, value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setTasks(newTasks);
  };

  const handleGenerate = () => {
    if (!periodStart || !periodEnd) {
      alert('Заполните период отчета');
      return;
    }

    const reportData = {
      period: { start: periodStart, end: periodEnd },
      tasks: tasks.filter(task => task.taskNumber && task.employee),
      generatedAt: new Date(),
    };

    onGenerate(reportData);
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Title>Генерация отчета</Title>
        
        <View style={styles.periodSection}>
          <TextInput
            label="Начало периода"
            value={periodStart}
            onChangeText={setPeriodStart}
            placeholder="ДД.ММ.ГГГГ"
            mode="outlined"
            style={styles.periodInput}
          />
          <TextInput
            label="Конец периода"
            value={periodEnd}
            onChangeText={setPeriodEnd}
            placeholder="ДД.ММ.ГГГГ"
            mode="outlined"
            style={styles.periodInput}
          />
        </View>

        {reportType === 'work' && (
          <View style={styles.tasksSection}>
            <Text style={styles.sectionTitle}>Информация о работах</Text>
            {tasks.map((task, index) => (
              <View key={index} style={styles.taskForm}>
                <TextInput
                  label="Номер задания"
                  value={task.taskNumber}
                  onChangeText={(value) => updateTask(index, 'taskNumber', value)}
                  mode="outlined"
                  style={styles.taskInput}
                />
                <TextInput
                  label="Сотрудник"
                  value={task.employee}
                  onChangeText={(value) => updateTask(index, 'employee', value)}
                  mode="outlined"
                  style={styles.taskInput}
                />
                <TextInput
                  label="Задание"
                  value={task.task}
                  onChangeText={(value) => updateTask(index, 'task', value)}
                  mode="outlined"
                  multiline
                  style={styles.taskInput}
                />
                <TextInput
                  label="Результат"
                  value={task.result}
                  onChangeText={(value) => updateTask(index, 'result', value)}
                  mode="outlined"
                  multiline
                  style={styles.taskInput}
                />
                <TextInput
                  label="Время выполнения"
                  value={task.executionTime}
                  onChangeText={(value) => updateTask(index, 'executionTime', value)}
                  mode="outlined"
                  style={styles.taskInput}
                />
              </View>
            ))}
            <Button mode="outlined" onPress={addTask} style={styles.addButton}>
              + Добавить работу
            </Button>
          </View>
        )}

        <Button mode="contained" onPress={handleGenerate} style={styles.generateButton}>
          Сгенерировать отчет
        </Button>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 8,
    elevation: 2,
  },
  periodSection: {
    marginBottom: 16,
  },
  periodInput: {
    marginBottom: 8,
  },
  tasksSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  taskForm: {
    marginBottom: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  taskInput: {
    marginBottom: 8,
  },
  addButton: {
    marginBottom: 8,
  },
  generateButton: {
    marginTop: 16,
  },
});

export default ReportGenerator;