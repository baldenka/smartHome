import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Card, Title, Text, Button, DataTable, TextInput, Menu, Divider, Chip } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { demoUsers } from '../../utils/demoData';

const UserEditorScreen = () => {
  const [users, setUsers] = useState(Object.values(demoUsers));
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const userRoles = [
    'resident',
    'dispatcher', 
    'technical_director',
    'quality_inspector',
    'technician',
    'accountant',
    'financial_director',
    'main_director',
    'security_guard'
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    setIsAdding(true);
    setEditingUser({
      id: `user-${Date.now()}`,
      name: '',
      role: 'resident',
      email: '',
      phone: '',
      passport: '',
      login: '',
      password: '123'
    });
  };

  const handleEditUser = (user: any) => {
    setEditingUser({ ...user });
    setIsAdding(false);
  };

  const handleSaveUser = () => {
    if (!editingUser.name || !editingUser.email || !editingUser.role) {
      Alert.alert('Ошибка', 'Заполните все обязательные поля');
      return;
    }

    if (isAdding) {
      setUsers(prev => [...prev, editingUser]);
      Alert.alert('Успех', 'Пользователь добавлен');
    } else {
      setUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
      Alert.alert('Успех', 'Данные пользователя обновлены');
    }

    setEditingUser(null);
    setIsAdding(false);
  };

  const handleDeleteUser = (userId: string) => {
    Alert.alert(
      'Удаление пользователя',
      'Вы уверены, что хотите удалить этого пользователя?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: () => {
            setUsers(prev => prev.filter(u => u.id !== userId));
            Alert.alert('Успех', 'Пользователь удален');
          }
        }
      ]
    );
  };

  const getRoleName = (role: string) => {
    const roleNames: { [key: string]: string } = {
      resident: 'Жилец',
      dispatcher: 'Диспетчер',
      technical_director: 'Технический директор',
      quality_inspector: 'Инспектор по качеству',
      technician: 'Техник',
      accountant: 'Бухгалтер',
      financial_director: 'Финансовый директор',
      main_director: 'Главный директор',
      security_guard: 'Охрана'
    };
    return roleNames[role] || role;
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Редактор пользователей</Title>
          <Text style={styles.subtitle}>
            Управление учетными записями сотрудников и жильцов
          </Text>

          <View style={styles.actions}>
            <Button
              mode="contained"
              icon="account-plus"
              onPress={handleAddUser}
              style={styles.addButton}
            >
              Добавить пользователя
            </Button>
          </View>

          <TextInput
            placeholder="Поиск по имени, роли или email..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            mode="outlined"
            style={styles.searchInput}
            left={<TextInput.Icon icon="magnify" />}
          />
        </Card.Content>
      </Card>

      {/* Форма редактирования/добавления */}
      {editingUser && (
        <Card style={styles.card}>
          <Card.Content>
            <Title>{isAdding ? 'Добавление пользователя' : 'Редактирование пользователя'}</Title>
            
            <TextInput
              label="ФИО"
              value={editingUser.name}
              onChangeText={(text) => setEditingUser({ ...editingUser, name: text })}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Email"
              value={editingUser.email}
              onChangeText={(text) => setEditingUser({ ...editingUser, email: text })}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
            />

            <TextInput
              label="Телефон"
              value={editingUser.phone}
              onChangeText={(text) => setEditingUser({ ...editingUser, phone: text })}
              mode="outlined"
              style={styles.input}
              keyboardType="phone-pad"
            />

            <TextInput
              label="Паспорт"
              value={editingUser.passport}
              onChangeText={(text) => setEditingUser({ ...editingUser, passport: text })}
              mode="outlined"
              style={styles.input}
            />

            <View style={styles.roleSection}>
              <Text style={styles.roleLabel}>Роль:</Text>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <Button 
                    mode="outlined" 
                    onPress={() => setMenuVisible(true)}
                    style={styles.roleButton}
                  >
                    {getRoleName(editingUser.role)}
                  </Button>
                }
              >
                {userRoles.map((role) => (
                  <Menu.Item
                    key={role}
                    onPress={() => {
                      setEditingUser({ ...editingUser, role, login: role });
                      setMenuVisible(false);
                    }}
                    title={getRoleName(role)}
                  />
                ))}
              </Menu>
            </View>

            <View style={styles.formActions}>
              <Button 
                mode="contained" 
                onPress={handleSaveUser}
                style={styles.saveButton}
              >
                {isAdding ? 'Добавить' : 'Сохранить'}
              </Button>
              <Button 
                mode="outlined" 
                onPress={() => setEditingUser(null)}
                style={styles.cancelButton}
              >
                Отмена
              </Button>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Таблица пользователей */}
      <Card style={styles.card}>
        <Card.Content>
          <Title>Список пользователей ({filteredUsers.length})</Title>
          
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>ФИО</DataTable.Title>
              <DataTable.Title>Роль</DataTable.Title>
              <DataTable.Title>Контакты</DataTable.Title>
              <DataTable.Title>Действия</DataTable.Title>
            </DataTable.Header>

            {filteredUsers.map((user) => (
              <DataTable.Row key={user.id}>
                <DataTable.Cell>
                  <Text style={styles.userName}>{user.name}</Text>
                  <Text style={styles.userLogin}>Логин: {user.login}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Chip mode="outlined" style={styles.roleChip}>
                    {getRoleName(user.role)}
                  </Chip>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.contactText}>{user.email}</Text>
                  <Text style={styles.contactText}>{user.phone}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <View style={styles.actionButtons}>
                    <Button 
                      mode="text" 
                      icon="pencil" 
                      onPress={() => handleEditUser(user)}
                      compact
                    />
                    <Button 
                      mode="text" 
                      icon="delete" 
                      onPress={() => handleDeleteUser(user.id)}
                      compact
                      textColor="#f44336"
                    />
                  </View>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>

          {filteredUsers.length === 0 && (
            <Text style={styles.noDataText}>Пользователи не найдены</Text>
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
  actions: {
    marginBottom: 16,
  },
  addButton: {
    marginBottom: 8,
  },
  searchInput: {
    marginBottom: 8,
  },
  input: {
    marginBottom: 12,
  },
  roleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  roleLabel: {
    fontSize: 14,
    marginRight: 8,
    fontWeight: '500',
  },
  roleButton: {
    flex: 1,
  },
  formActions: {
    flexDirection: 'row',
    gap: 8,
  },
  saveButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
    borderColor: '#8B4513',
  },
  userName: {
    fontSize: 12,
    fontWeight: '500',
  },
  userLogin: {
    fontSize: 10,
    color: '#666',
  },
  roleChip: {
    backgroundColor: '#DEB887',
  },
  contactText: {
    fontSize: 10,
    color: '#666',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  noDataText: {
    textAlign: 'center',
    marginVertical: 16,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default UserEditorScreen;