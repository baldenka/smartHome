import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Text, List, Chip } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const MyRequestsScreen = () => {
  const { requests } = useSelector((state: RootState) => state.requests);
  const { user } = useSelector((state: RootState) => state.auth);

  // Фильтруем заявки по userId вместо createdBy
  const myRequests = requests.filter(request => request.userId === user?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created': return '#ffa000';        // Новая - оранжевый
      case 'processing': return '#2196f3';     // В обработке - синий
      case 'in_progress': return '#4caf50';    // В работе - зеленый
      case 'completed': return '#757575';      // Выполнена - серый
      case 'rejected': return '#f44336';       // Отклонена - красный
      default: return '#9e9e9e';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'created': return 'Новая';
      case 'processing': return 'На рассмотрении';
      case 'in_progress': return 'В работе';
      case 'completed': return 'Выполнена';
      case 'rejected': return 'Отклонена';
      default: return status;
    }
  };

  const getPriorityText = (priority: number) => {
    if (priority === 0) return 'Приоритет не назначен';
  
    const priorityMap: { [key: number]: string } = {
      1: 'Срочно (немедленно)',
      2: 'Высокий (3 часа)',
      3: 'Выше среднего (8 часов)',
      4: 'Средний (24 часа)',
      5: 'Ниже среднего (2 дня)',
      6: 'Низкий (5 дней)',
      7: 'Минимальный (7 дней)'
    };
    return priorityMap[priority] || `Приоритет ${priority}`;
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Мои заявки</Title>
          <Text style={styles.subtitle}>
            Всего заявок: {myRequests.length}
          </Text>
        </Card.Content>
      </Card>

      <FlatList
        data={myRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.requestCard}>
            <Card.Content>
              <View style={styles.requestHeader}>
                <Text style={styles.requestTheme}>{item.theme}</Text>
                <Chip 
                  mode="outlined" 
                  textStyle={{ 
                    color: getStatusColor(item.status), 
                    fontSize: 12,
                    fontWeight: 'bold'
                  }}
                  style={{ borderColor: getStatusColor(item.status) }}
                >
                  {getStatusText(item.status)}
                </Chip>
              </View>
              
              <Text style={styles.requestDescription}>{item.description}</Text>
              
              <View style={styles.requestDetails}>
                <Text style={styles.requestDate}>
                  Создана: {new Date(item.createdAt).toLocaleDateString('ru-RU')}
                </Text>
                
                {item.priority > 0 && (
                  <Text style={styles.requestPriority}>
                    {getPriorityText(item.priority)}
                  </Text>
                )}
              </View>

              {item.assignedSpecialist && (
                <Text style={styles.requestAssignee}>
                  Исполнитель: {item.assignedSpecialist}
                </Text>
              )}

              {item.rejectedReason && (
                <Text style={styles.rejectedReason}>
                  Причина отклонения: {item.rejectedReason}
                </Text>
              )}

              {/* Показываем дату обновления если она отличается от даты создания */}
              {item.updatedAt !== item.createdAt && (
                <Text style={styles.requestDate}>
                  Обновлена: {new Date(item.updatedAt).toLocaleDateString('ru-RU')}
                </Text>
              )}
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>У вас пока нет заявок</Text>
              <Text style={styles.emptySubtext}>
                Создайте первую заявку через меню "Обратная связь"
              </Text>
            </Card.Content>
          </Card>
        }
      />
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
  requestCard: {
    marginBottom: 8,
    elevation: 2,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  requestTheme: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  requestDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    lineHeight: 20,
  },
  requestDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 12,
    color: '#666',
  },
  requestPriority: {
    fontSize: 12,
    color: '#8B4513',
    fontWeight: '500',
  },
  requestAssignee: {
    fontSize: 12,
    color: '#2E7D32',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  rejectedReason: {
    fontSize: 12,
    color: '#D32F2F',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyCard: {
    marginTop: 16,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});

export default MyRequestsScreen;