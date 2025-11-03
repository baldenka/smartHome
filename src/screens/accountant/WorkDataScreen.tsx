import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { Card, Title, Text, Chip, DataTable, Searchbar, Button } from 'react-native-paper';
import { demoWorkData } from '../../utils/demoData';

const WorkDataScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const periods = ['all', '11.2024', '10.2024', '09.2024'];

  const filteredWorkData = demoWorkData.filter(work => {
    const matchesSearch = work.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         work.task.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         work.taskNumber.includes(searchQuery);
    const matchesPeriod = selectedPeriod === 'all' || 
                         work.period.start.includes(selectedPeriod.replace('.', '-'));
    
    return matchesSearch && matchesPeriod;
  });

  const calculateTotals = () => {
    const totalCost = filteredWorkData.reduce((sum, work) => sum + work.cost, 0);
    const totalWorks = filteredWorkData.length;
    const avgCost = totalWorks > 0 ? totalCost / totalWorks : 0;

    return { totalCost, totalWorks, avgCost };
  };

  const totals = calculateTotals();

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Данные о проделанных работах</Title>
          <Text style={styles.subtitle}>
            Информация о выполненных работах и затратах
          </Text>

          <Searchbar
            placeholder="Поиск по сотруднику, задаче или номеру..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filters}>
              {periods.map((period) => (
                <Chip
                  key={period}
                  selected={selectedPeriod === period}
                  onPress={() => setSelectedPeriod(period)}
                  style={styles.filterChip}
                >
                  {period === 'all' ? 'Все периоды' : period}
                </Chip>
              ))}
            </View>
          </ScrollView>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Финансовая сводка</Title>
          <View style={styles.totalsContainer}>
            <View style={styles.totalItem}>
              <Text style={styles.totalLabel}>Всего работ</Text>
              <Text style={styles.totalValue}>{totals.totalWorks}</Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={styles.totalLabel}>Общая стоимость</Text>
              <Text style={styles.totalValue}>{totals.totalCost} ₽</Text>
            </View>
            <View style={styles.totalItem}>
              <Text style={styles.totalLabel}>Средняя стоимость</Text>
              <Text style={styles.totalValue}>{Math.round(totals.avgCost)} ₽</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title>Выполненные работы</Title>
            <Text style={styles.countText}>
              Найдено: {filteredWorkData.length}
            </Text>
          </View>

          <ScrollView horizontal>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>№ задания</DataTable.Title>
                <DataTable.Title>Сотрудник</DataTable.Title>
                <DataTable.Title>Задача</DataTable.Title>
                <DataTable.Title>Результат</DataTable.Title>
                <DataTable.Title>Время</DataTable.Title>
                <DataTable.Title numeric>Стоимость</DataTable.Title>
                <DataTable.Title>Период</DataTable.Title>
              </DataTable.Header>

              {filteredWorkData.map((work) => (
                <DataTable.Row key={work.id}>
                  <DataTable.Cell>
                    <Text style={styles.taskNumber}>{work.taskNumber}</Text>
                    {work.requestId && (
                      <Text style={styles.requestId}>Заявка: {work.requestId}</Text>
                    )}
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={styles.employee}>{work.employee}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={styles.task} numberOfLines={2}>
                      {work.task}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={styles.result} numberOfLines={2}>
                      {work.result}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={styles.time}>{work.executionTime}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={styles.cost}>{work.cost} ₽</Text>
                  </DataTable.Cell>
                  <DataTable.Cell>
                    <Text style={styles.period}>
                      {new Date(work.period.start).toLocaleDateString('ru-RU')}
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </ScrollView>

          {filteredWorkData.length === 0 && (
            <Text style={styles.noDataText}>Данные не найдены</Text>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Действия</Title>
          <Button
            mode="outlined"
            icon="file-export"
            onPress={() => {/* Экспорт данных */}}
            style={styles.actionButton}
          >
            Экспорт в Excel
          </Button>
          <Button
            mode="contained"
            icon="plus"
            onPress={() => {/* Добавить работу */}}
            style={styles.actionButton}
          >
            Добавить работу вручную
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
    marginTop: 4,
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 12,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  filterChip: {
    marginRight: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  countText: {
    fontSize: 14,
    color: '#666',
  },
  totalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalItem: {
    alignItems: 'center',
    flex: 1,
  },
  totalLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  taskNumber: {
    fontSize: 12,
    fontWeight: '500',
  },
  requestId: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  employee: {
    fontSize: 12,
    fontWeight: '500',
  },
  task: {
    fontSize: 11,
    maxWidth: 150,
  },
  result: {
    fontSize: 11,
    maxWidth: 150,
    color: '#666',
  },
  time: {
    fontSize: 11,
  },
  cost: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  period: {
    fontSize: 11,
    color: '#666',
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#666',
    fontStyle: 'italic',
  },
  actionButton: {
    marginBottom: 8,
  },
});

export default WorkDataScreen;