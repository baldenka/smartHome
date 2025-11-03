// Замените полностью LocksStatusScreen.tsx на этот код:

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, TextInput, Button, DataTable, Chip } from 'react-native-paper';
import { demoDevices } from '../../utils/demoData';

const LocksStatusScreen = () => {
  const [searchId, setSearchId] = useState('');
  const [filteredLocks, setFilteredLocks] = useState([]);

  // Фильтруем замки из демо-данных
  const locks = demoDevices
    .filter(device => device.type === 'lock')
    .map(lock => ({
      id: lock.id,
      number: lock.id.replace('lock-', ''),
      status: lock.specifications?.status === 'blocked' ? 'blocked' : 'unblocked',
      batteryLevel: lock.batteryLevel || 0,
      lastUnlock: lock.specifications?.lastUnlock || 'неизвестно',
      unauthorizedAttempts: lock.specifications?.unauthorizedAttempts || 'отсут.',
      connection: lock.specifications?.connection || 'отсут.'
    }));

  const searchLock = () => {
    if (!searchId.trim()) {
      setFilteredLocks([]);
      return;
    }
    
    const found = locks.filter(lock => 
      lock.number.toLowerCase().includes(searchId.toLowerCase()) ||
      lock.id.toLowerCase().includes(searchId.toLowerCase())
    );
    setFilteredLocks(found);
    
    if (found.length === 0) {
      alert('Замок с таким номером не найден');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'blocked': return '#4caf50';
      case 'unblocked': return '#ff9800';
      default: return '#9e9e9e';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'blocked': return 'блок.';
      case 'unblocked': return 'разблок.';
      default: return 'неизвестно';
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 70) return '#4caf50';
    if (level > 30) return '#ff9800';
    return '#f44336';
  };

  const displayLocks = filteredLocks.length > 0 ? filteredLocks : locks;

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Просмотр состояния замков</Title>
          <Text style={styles.subtitle}>
            Мониторинг системы контроля доступа
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Поиск по номеру</Title>
          <View style={styles.searchSection}>
            <TextInput
              label="Номер замка"
              value={searchId}
              onChangeText={setSearchId}
              mode="outlined"
              style={styles.searchInput}
              placeholder="45654"
            />
            <Button 
              mode="contained" 
              onPress={searchLock}
              style={styles.searchButton}
            >
              Поиск
            </Button>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title>Результат поиска:</Title>
            {filteredLocks.length > 0 && (
              <Text style={styles.resultCount}>
                Найдено: {filteredLocks.length}
              </Text>
            )}
          </View>
          
          <ScrollView horizontal>
            <DataTable style={styles.table}>
              <DataTable.Header>
                <DataTable.Title style={styles.cell}>№ замка</DataTable.Title>
                <DataTable.Title style={styles.cell}>статус</DataTable.Title>
                <DataTable.Title style={styles.cell}>состояние батареи</DataTable.Title>
                <DataTable.Title style={styles.cell}>время последней разблокировки</DataTable.Title>
                <DataTable.Title style={styles.cell}>попытки несанкц. доступа</DataTable.Title>
                <DataTable.Title style={styles.cell}>состояние подключения</DataTable.Title>
              </DataTable.Header>

              {displayLocks.map((lock) => (
                <DataTable.Row key={lock.id}>
                  <DataTable.Cell style={styles.cell}>{lock.number}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>
                    <Chip 
                      mode="outlined" 
                      textStyle={{ 
                        color: getStatusColor(lock.status), 
                        fontSize: 10,
                        fontWeight: 'bold'
                      }}
                    >
                      {getStatusText(lock.status)}
                    </Chip>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>
                    <Text style={{ color: getBatteryColor(lock.batteryLevel) }}>
                      {lock.batteryLevel}%
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{lock.lastUnlock}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{lock.unauthorizedAttempts}</DataTable.Cell>
                  <DataTable.Cell style={styles.cell}>{lock.connection}</DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </ScrollView>

          {displayLocks.length === 0 && (
            <Text style={styles.noResults}>Замки не найдены</Text>
          )}
        </Card.Content>
      </Card>
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
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginRight: 8,
  },
  searchButton: {
    height: 56,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
  },
  table: {
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  cell: {
    justifyContent: 'center',
    minWidth: 120,
    paddingHorizontal: 8,
  },
  noResults: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginVertical: 20,
  },
});

export default LocksStatusScreen;