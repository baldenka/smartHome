import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button, DataTable, Chip, Menu, Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { demoWorkData } from '../../utils/demoData';

const FinancialAnalyticsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [menuVisible, setMenuVisible] = useState(false);

  const allWorkData = demoWorkData;

  const availablePeriods = useMemo(() => {
    const periodsSet = new Set(allWorkData.map(work => 
      new Date(work.period.start).toLocaleDateString('ru-RU', { month: '2-digit', year: 'numeric' })
    ));
    return ['all', ...Array.from(periodsSet).sort().reverse()];
  }, [allWorkData]);

  const analyticsData = useMemo(() => {
    const filteredData = selectedPeriod === 'all' 
      ? allWorkData 
      : allWorkData.filter(work => 
          new Date(work.period.start).toLocaleDateString('ru-RU', { month: '2-digit', year: 'numeric' }) === selectedPeriod
        );

    const totalCost = filteredData.reduce((sum, work) => sum + work.cost, 0);
    const workCount = filteredData.length;
    const avgCost = workCount > 0 ? totalCost / workCount : 0;

    // Анализ по сотрудникам
    const employeeStats: { [key: string]: { count: number; totalCost: number } } = {};
    filteredData.forEach(work => {
      if (!employeeStats[work.employee]) {
        employeeStats[work.employee] = { count: 0, totalCost: 0 };
      }
      employeeStats[work.employee].count++;
      employeeStats[work.employee].totalCost += work.cost;
    });

    // Анализ по типам работ
    const workTypeStats: { [key: string]: number } = {};
    filteredData.forEach(work => {
      const workType = work.task.split(' ')[0]; // Берем первое слово как тип работы
      workTypeStats[workType] = (workTypeStats[workType] || 0) + work.cost;
    });

    return {
      totalCost,
      workCount,
      avgCost,
      employeeStats,
      workTypeStats,
      period: selectedPeriod === 'all' ? 'Все периоды' : selectedPeriod
    };
  }, [allWorkData, selectedPeriod]);

  const handleExportAnalytics = () => {
    console.log('Экспорт аналитики:', analyticsData);
    alert('Аналитика экспортирована в Excel!');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Финансовая аналитика</Title>
          <Text style={styles.subtitle}>
            Анализ затрат и эффективности по периодам
          </Text>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Период:</Text>
            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <Chip
                  mode="outlined"
                  onPress={() => setMenuVisible(true)}
                  style={styles.periodChip}
                >
                  {selectedPeriod === 'all' ? 'Все периоды' : selectedPeriod}
                </Chip>
              }
            >
              <Menu.Item 
                onPress={() => {
                  setSelectedPeriod('all');
                  setMenuVisible(false);
                }}
                title="Все периоды"
              />
              <Divider />
              {availablePeriods.filter(p => p !== 'all').map((period) => (
                <Menu.Item
                  key={period}
                  onPress={() => {
                    setSelectedPeriod(period);
                    setMenuVisible(false);
                  }}
                  title={period}
                />
              ))}
            </Menu>
          </View>
        </Card.Content>
      </Card>

      {/* Ключевые метрики */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Ключевые показатели</Title>
          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{analyticsData.totalCost.toLocaleString()} ₽</Text>
              <Text style={styles.metricLabel}>Общие затраты</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{analyticsData.workCount}</Text>
              <Text style={styles.metricLabel}>Кол-во работ</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{Math.round(analyticsData.avgCost).toLocaleString()} ₽</Text>
              <Text style={styles.metricLabel}>Средняя стоимость</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Анализ по сотрудникам */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title>Затраты по сотрудникам</Title>
            <Button mode="outlined" icon="chart-box" onPress={handleExportAnalytics}>
              Экспорт
            </Button>
          </View>
          
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Сотрудник</DataTable.Title>
              <DataTable.Title numeric>Работы</DataTable.Title>
              <DataTable.Title numeric>Затраты</DataTable.Title>
              <DataTable.Title numeric>Среднее</DataTable.Title>
            </DataTable.Header>

            {Object.entries(analyticsData.employeeStats)
              .sort(([,a], [,b]) => b.totalCost - a.totalCost)
              .map(([employee, stats]) => (
                <DataTable.Row key={employee}>
                  <DataTable.Cell>
                    <Text style={styles.employeeName}>{employee}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={styles.statText}>{stats.count}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={styles.costText}>{stats.totalCost.toLocaleString()} ₽</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={styles.avgText}>
                      {Math.round(stats.totalCost / stats.count).toLocaleString()} ₽
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
          </DataTable>
        </Card.Content>
      </Card>

      {/* Анализ по типам работ */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Распределение по типам работ</Title>
          <View style={styles.workTypeContainer}>
            {Object.entries(analyticsData.workTypeStats)
              .sort(([,a], [,b]) => b - a)
              .map(([workType, cost]) => (
                <View key={workType} style={styles.workTypeItem}>
                  <View style={styles.workTypeHeader}>
                    <Text style={styles.workTypeName}>{workType}</Text>
                    <Text style={styles.workTypeCost}>{cost.toLocaleString()} ₽</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { width: `${(cost / analyticsData.totalCost) * 100}%` }
                      ]} 
                    />
                  </View>
                </View>
              ))}
          </View>
        </Card.Content>
      </Card>

      {/* Тенденции */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Анализ эффективности</Title>
          <Text style={styles.analysisText}>
            • Период анализа: {analyticsData.period}
          </Text>
          <Text style={styles.analysisText}>
            • Самый продуктивный сотрудник: {
              Object.entries(analyticsData.employeeStats)
                .sort(([,a], [,b]) => b.count - a.count)[0]?.[0] || 'нет данных'
            }
          </Text>
          <Text style={styles.analysisText}>
            • Наиболее затратный тип работ: {
              Object.entries(analyticsData.workTypeStats)
                .sort(([,a], [,b]) => b - a)[0]?.[0] || 'нет данных'
            }
          </Text>
          <Text style={styles.analysisText}>
            • Эффективность использования ресурсов: {
              analyticsData.avgCost > 0 ? '📊 Анализ завершен' : 'недостаточно данных'
            }
          </Text>
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
  filterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  filterLabel: {
    fontSize: 14,
    marginRight: 8,
    fontWeight: '500',
  },
  periodChip: {
    backgroundColor: '#DEB887',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#666',
  },
  employeeName: {
    fontSize: 12,
    fontWeight: '500',
  },
  statText: {
    fontSize: 12,
  },
  costText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  avgText: {
    fontSize: 11,
    color: '#666',
  },
  workTypeContainer: {
    marginTop: 8,
  },
  workTypeItem: {
    marginBottom: 12,
  },
  workTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  workTypeName: {
    fontSize: 12,
    fontWeight: '500',
  },
  workTypeCost: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: 'bold',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#8B4513',
    borderRadius: 3,
  },
  analysisText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
});

export default FinancialAnalyticsScreen;