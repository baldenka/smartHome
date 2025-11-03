import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Text, List, Chip } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const RequestArchiveScreen = () => {
  const { requests } = useSelector((state: RootState) => state.requests);

  const archivedRequests = requests.filter(
    request => request.status === 'completed' || request.status === 'rejected'
  );

  const getStatusColor = (status: string) => {
    return status === 'completed' ? '#4caf50' : '#f44336';
  };

  const getStatusText = (status: string) => {
    return status === 'completed' ? 'Выполнена' : 'Отклонена';
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Архив заявок</Title>
          <Text style={styles.subtitle}>
            Завершенные и отклоненные заявки: {archivedRequests.length}
          </Text>
        </Card.Content>
      </Card>

      <FlatList
        data={archivedRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.requestCard}>
            <Card.Content>
              <View style={styles.requestHeader}>
                <Text style={styles.requestId}>#{item.id}</Text>
                <Chip 
                  mode="outlined" 
                  textStyle={{ color: getStatusColor(item.status), fontSize: 12 }}
                >
                  {getStatusText(item.status)}
                </Chip>
              </View>
              <Text style={styles.requestTheme}>{item.theme}</Text>
              <Text style={styles.requestDescription}>{item.description}</Text>
              
              {item.status === 'completed' && item.assignedSpecialist && (
                <Text style={styles.completedInfo}>
                  Выполнено: {item.assignedSpecialist}
                </Text>
              )}
              
              {item.rejectedReason && (
                <Text style={styles.rejectionReason}>
                  Причина отклонения: {item.rejectedReason}
                </Text>
              )}
              
              <Text style={styles.requestDate}>
                Создана: {new Date(item.createdAt).toLocaleDateString('ru-RU')}
              </Text>
              <Text style={styles.requestDate}>
                Обновлена: {new Date(item.updatedAt).toLocaleDateString('ru-RU')}
              </Text>
            </Card.Content>
          </Card>
        )}
        contentContainerStyle={styles.listContent}
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
    alignItems: 'center',
    marginBottom: 8,
  },
  requestId: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  requestTheme: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  requestDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  completedInfo: {
    fontSize: 12,
    color: '#2E7D32',
    marginBottom: 4,
  },
  rejectionReason: {
    fontSize: 12,
    color: '#d32f2f',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  requestDate: {
    fontSize: 12,
    color: '#666',
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default RequestArchiveScreen;