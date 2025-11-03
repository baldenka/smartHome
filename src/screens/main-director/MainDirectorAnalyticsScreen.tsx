import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Button, DataTable, Chip } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { demoWorkData, demoCounterReadings, demoUsers, demoRequests } from '../../utils/demoData';

const MainDirectorAnalyticsScreen = () => {
  const workData = demoWorkData;
  const counterReadings = demoCounterReadings;
  const users = Object.values(demoUsers);
  const requests = useSelector((state: RootState) => state.requests.requests);

  const analytics = useMemo(() => {
    // Общая статистика по работам
    const totalWorkCost = workData.reduce((sum, work) => sum + work.cost, 0);
    const completedWorks = workData.length;
    
    // Статистика по пользователям
    const usersByRole = users.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Статистика по заявкам
    const requestsByStatus = requests.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    // Статистика по показаниям счетчиков
    const verifiedReadings = counterReadings.filter(r => r.status === 'verified').length;
    const totalReadings = counterReadings.length;

    return {
      totalWorkCost,
      completedWorks,
      usersByRole,
      totalUsers: users.length,
      requestsByStatus,
      totalRequests: requests.length,
      verifiedReadings,
      totalReadings,
      readingVerificationRate: totalReadings > 0 ? (verifiedReadings / totalReadings) * 100 : 0
    };
  }, [workData, users, requests, counterReadings]);

  const getRoleName = (role: string) => {
    const roleNames: { [key: string]: string } = {
      resident: 'Жильцы',
      dispatcher: 'Диспетчеры',
      technical_director: 'Тех. директора',
      quality_inspector: 'Инспекторы',
      technician: 'Техники',
      accountant: 'Бухгалтеры',
      financial_director: 'Фин. директора',
      main_director: 'Глав. директора',
      security_guard: 'Охрана'
    };
    return roleNames[role] || role;
  };

  const getStatusName = (status: string) => {
    const statusNames: { [key: string]: string } = {
      created: 'Создана',
      processing: 'В обработке',
      in_progress: 'В работе',
      completed: 'Завершена',
      rejected: 'Отклонена'
    };
    return statusNames[status] || status;
  };

  const handleExportAnalytics = () => {
    console.log('Экспорт общей аналитики:', analytics);
    alert('Общая аналитика экспортирована в Excel!');
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Общая аналитика компании</Title>
          <Text style={styles.subtitle}>
            Сводные показатели по всем направлениям деятельности
          </Text>
        </Card.Content>
      </Card>

      {/* Ключевые метрики */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Ключевые показатели</Title>
          <View style={styles.metricsContainer}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{analytics.totalWorkCost.toLocaleString()} ₽</Text>
              <Text style={styles.metricLabel}>Затраты на работы</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{analytics.completedWorks}</Text>
              <Text style={styles.metricLabel}>Выполнено работ</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{analytics.totalRequests}</Text>
              <Text style={styles.metricLabel}>Всего заявок</Text>
            </View>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{analytics.totalUsers}</Text>
              <Text style={styles.metricLabel}>Пользователей</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Распределение пользователей по ролям */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title>Пользователи по ролям</Title>
            <Text style={styles.totalCount}>Всего: {analytics.totalUsers}</Text>
          </View>
          
          <View style={styles.rolesContainer}>
            {Object.entries(analytics.usersByRole)
              .sort(([,a], [,b]) => b - a)
              .map(([role, count]) => (
                <View key={role} style={styles.roleItem}>
                  <View style={styles.roleHeader}>
                    <Text style={styles.roleName}>{getRoleName(role)}</Text>
                    <Text style={styles.roleCount}>{count}</Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill,
                        { width: `${(count / analytics.totalUsers) * 100}%` }
                      ]} 
                    />
                  </View>
                </View>
              ))}
          </View>
        </Card.Content>
      </Card>

      {/* Статистика заявок */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title>Статусы заявок</Title>
            <Button mode="outlined" icon="file-export" onPress={handleExportAnalytics}>
              Экспорт
            </Button>
          </View>
          
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Статус</DataTable.Title>
              <DataTable.Title numeric>Количество</DataTable.Title>
              <DataTable.Title numeric>Процент</DataTable.Title>
            </DataTable.Header>

            {Object.entries(analytics.requestsByStatus)
              .sort(([,a], [,b]) => b - a)
              .map(([status, count]) => (
                <DataTable.Row key={status}>
                  <DataTable.Cell>
                    <Chip mode="outlined" style={styles.statusChip}>
                      {getStatusName(status)}
                    </Chip>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={styles.countText}>{count}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell numeric>
                    <Text style={styles.percentText}>
                      {Math.round((count / analytics.totalRequests) * 100)}%
                    </Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
          </DataTable>
        </Card.Content>
      </Card>

      {/* Показания счетчиков */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Показания счетчиков</Title>
          <View style={styles.readingsStats}>
            <View style={styles.readingItem}>
              <Text style={styles.readingValue}>{analytics.verifiedReadings}</Text>
              <Text style={styles.readingLabel}>Проверено показаний</Text>
            </View>
            <View style={styles.readingItem}>
              <Text style={styles.readingValue}>{analytics.totalReadings}</Text>
              <Text style={styles.readingLabel}>Всего передано</Text>
            </View>
            <View style={styles.readingItem}>
              <Text style={styles.readingValue}>{Math.round(analytics.readingVerificationRate)}%</Text>
              <Text style={styles.readingLabel}>Процент проверки</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Аналитические выводы */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Аналитические выводы</Title>
          <Text style={styles.analysisText}>
            • Общие затраты на работы: {analytics.totalWorkCost.toLocaleString()} ₽
          </Text>
          <Text style={styles.analysisText}>
            • Эффективность обработки заявок: {
              analytics.requestsByStatus.completed ? 
              `${Math.round((analytics.requestsByStatus.completed / analytics.totalRequests) * 100)}% завершено` :
              'требует анализа'
            }
          </Text>
          <Text style={styles.analysisText}>
            • Активность пользователей: {analytics.totalUsers} зарегистрированных
          </Text>
          <Text style={styles.analysisText}>
            • Качество данных: {Math.round(analytics.readingVerificationRate)}% проверенных показаний
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalCount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B4513',
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: '45%',
    marginBottom: 16,
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
    textAlign: 'center',
  },
  rolesContainer: {
    marginTop: 8,
  },
  roleItem: {
    marginBottom: 12,
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  roleName: {
    fontSize: 12,
    fontWeight: '500',
  },
  roleCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#8B4513',
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
  statusChip: {
    backgroundColor: '#DEB887',
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  percentText: {
    fontSize: 12,
    color: '#666',
  },
  readingsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  readingItem: {
    alignItems: 'center',
    flex: 1,
  },
  readingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8B4513',
    marginBottom: 4,
  },
  readingLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  analysisText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
  },
});

export default MainDirectorAnalyticsScreen;