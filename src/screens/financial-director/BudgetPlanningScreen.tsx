import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button, TextInput, DataTable, Chip } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { demoWorkData } from '../../utils/demoData';

const BudgetPlanningScreen = () => {
  const [budgets, setBudgets] = useState([
    { id: '1', category: 'Ремонтные работы', planned: 50000, actual: 0, month: '11.2024' },
    { id: '2', category: 'Техобслуживание', planned: 30000, actual: 0, month: '11.2024' },
    { id: '3', category: 'Коммунальные услуги', planned: 20000, actual: 0, month: '11.2024' },
    { id: '4', category: 'Эксплуатационные', planned: 15000, actual: 0, month: '11.2024' },
  ]);

  const allWorkData = demoWorkData;

  // Расчет фактических затрат по категориям
  const calculatedBudgets = budgets.map(budget => {
    let actual = 0;
    
    switch (budget.category) {
      case 'Ремонтные работы':
        actual = allWorkData
          .filter(work => work.task.includes('ремонт') || work.task.includes('замена'))
          .reduce((sum, work) => sum + work.cost, 0);
        break;
      case 'Техобслуживание':
        actual = allWorkData
          .filter(work => work.task.includes('обслуживание') || work.task.includes('проверка'))
          .reduce((sum, work) => sum + work.cost, 0);
        break;
      case 'Коммунальные услуги':
        actual = allWorkData
          .filter(work => work.task.includes('электр') || work.task.includes('вод'))
          .reduce((sum, work) => sum + work.cost, 0);
        break;
      case 'Эксплуатационные':
        actual = allWorkData
          .filter(work => !work.task.includes('ремонт') && !work.task.includes('обслуживание'))
          .reduce((sum, work) => sum + work.cost, 0);
        break;
    }

    return {
      ...budget,
      actual,
      deviation: actual - budget.planned,
      status: actual <= budget.planned ? 'on_track' : 'exceeded'
    };
  });

  const totalPlanned = calculatedBudgets.reduce((sum, b) => sum + b.planned, 0);
  const totalActual = calculatedBudgets.reduce((sum, b) => sum + b.actual, 0);
  const totalDeviation = totalActual - totalPlanned;

  const handleSaveBudgets = () => {
    console.log('Сохранение бюджетов:', calculatedBudgets);
    alert('Бюджеты успешно сохранены!');
  };

  const getStatusColor = (status: string) => {
    return status === 'on_track' ? '#4caf50' : '#f44336';
  };

  const getStatusText = (status: string) => {
    return status === 'on_track' ? 'В норме' : 'Превышен';
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Планирование бюджета</Title>
          <Text style={styles.subtitle}>
            Управление бюджетом и контроль затрат
          </Text>
        </Card.Content>
      </Card>

      {/* Сводка по бюджету */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Общая сводка бюджета</Title>
          <View style={styles.budgetSummary}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Плановый бюджет</Text>
              <Text style={styles.summaryValue}>{totalPlanned.toLocaleString()} ₽</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Фактические затраты</Text>
              <Text style={styles.summaryValue}>{totalActual.toLocaleString()} ₽</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Отклонение</Text>
              <Text style={[
                styles.summaryValue,
                { color: totalDeviation <= 0 ? '#4caf50' : '#f44336' }
              ]}>
                {totalDeviation.toLocaleString()} ₽
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Детализация бюджетов */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title>Детализация по категориям</Title>
            <Button mode="outlined" icon="content-save" onPress={handleSaveBudgets}>
              Сохранить
            </Button>
          </View>

          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Категория</DataTable.Title>
              <DataTable.Title numeric>План</DataTable.Title>
              <DataTable.Title numeric>Факт</DataTable.Title>
              <DataTable.Title numeric>Отклонение</DataTable.Title>
              <DataTable.Title>Статус</DataTable.Title>
            </DataTable.Header>

            {calculatedBudgets.map((budget) => (
              <DataTable.Row key={budget.id}>
                <DataTable.Cell>
                  <Text style={styles.categoryText}>{budget.category}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={styles.budgetText}>{budget.planned.toLocaleString()} ₽</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={styles.budgetText}>{budget.actual.toLocaleString()} ₽</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <Text style={[
                    styles.deviationText,
                    { color: budget.deviation <= 0 ? '#4caf50' : '#f44336' }
                  ]}>
                    {budget.deviation.toLocaleString()} ₽
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Chip 
                    mode="outlined"
                    textStyle={{ 
                      fontSize: 10,
                      color: getStatusColor(budget.status)
                    }}
                    style={{ 
                      borderColor: getStatusColor(budget.status),
                      backgroundColor: getStatusColor(budget.status) + '20'
                    }}
                  >
                    {getStatusText(budget.status)}
                  </Chip>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
      </Card>

      {/* Установка новых бюджетов */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Установка бюджетов на следующий месяц</Title>
          <Text style={styles.sectionDescription}>
            Запланируйте бюджеты на предстоящий период
          </Text>

          {budgets.map((budget, index) => (
            <View key={budget.id} style={styles.budgetInputContainer}>
              <Text style={styles.budgetLabel}>{budget.category}</Text>
              <TextInput
                mode="outlined"
                value={budget.planned.toString()}
                onChangeText={(text) => {
                  const newBudgets = [...budgets];
                  newBudgets[index].planned = parseInt(text) || 0;
                  setBudgets(newBudgets);
                }}
                keyboardType="numeric"
                style={styles.budgetInput}
                dense
              />
            </View>
          ))}

          <Button 
            mode="contained" 
            onPress={handleSaveBudgets}
            style={styles.saveButton}
          >
            Сохранить бюджеты
          </Button>
        </Card.Content>
      </Card>

      {/* Рекомендации */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Рекомендации по бюджету</Title>
          {totalDeviation > 0 ? (
            <>
              <Text style={styles.recommendationText}>
                ⚠️ Внимание: превышение бюджета на {totalDeviation.toLocaleString()} ₽
              </Text>
              <Text style={styles.recommendationText}>
                • Рекомендуется пересмотреть затраты на ремонтные работы
              </Text>
              <Text style={styles.recommendationText}>
                • Рассмотрите оптимизацию эксплуатационных расходов
              </Text>
            </>
          ) : (
            <Text style={styles.recommendationText}>
              ✅ Бюджет в пределах плана. Отличная работа!
            </Text>
          )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: '30%',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  budgetText: {
    fontSize: 12,
  },
  deviationText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  budgetInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  budgetLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
  budgetInput: {
    flex: 1,
    backgroundColor: 'white',
  },
  saveButton: {
    marginTop: 16,
  },
  recommendationText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
});

export default BudgetPlanningScreen;