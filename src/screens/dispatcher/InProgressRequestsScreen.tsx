import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Title, Text, List } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const InProgressRequestsScreen = () => {
  const { requests } = useSelector((state: RootState) => state.requests);

  // Исправляем фильтрацию согласно новым статусам
  const inProgressRequests = requests.filter(
    request => request.status === 'in_progress' || request.status === 'processing'
  );

  const getPriorityText = (priority: number) => {
    if (priority === 0) return 'Приоритет не назначен';
    return `Приоритет ${priority}`;
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Заявки в исполнении</Title>
          <Text style={styles.subtitle}>
            Всего в работе: {inProgressRequests.length}
          </Text>
        </Card.Content>
      </Card>

      <FlatList
        data={inProgressRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.theme}
            description={item.description}
            left={props => <List.Icon {...props} icon="progress-wrench" />}
            right={props => (
              <View style={styles.rightContent}>
                <Text style={styles.priority}>{getPriorityText(item.priority)}</Text>
                {item.assignedSpecialist && (
                  <Text style={styles.specialist}>Исп.: {item.assignedSpecialist}</Text>
                )}
              </View>
            )}
            style={styles.requestItem}
          />
        )}
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
  requestItem: {
    backgroundColor: 'white',
    marginBottom: 4,
    elevation: 1,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  priority: {
    fontSize: 12,
    color: '#666',
  },
  specialist: {
    fontSize: 11,
    color: '#8B4513',
    marginTop: 4,
  },
});

export default InProgressRequestsScreen;