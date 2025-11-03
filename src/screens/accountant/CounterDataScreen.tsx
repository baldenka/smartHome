import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Chip, DataTable, Searchbar, Button, Menu, Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useNavigation } from '@react-navigation/native';

const CounterDataScreen = () => {
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPeriods, setSelectedPeriods] = useState<string[]>(['all']);
    const [selectedTypes, setSelectedTypes] = useState<string[]>(['all']);
    const [periodMenuVisible, setPeriodMenuVisible] = useState(false);
    const [typeMenuVisible, setTypeMenuVisible] = useState(false);

    const allReadings = useSelector((state: RootState) => state.counterReadings.readings);
    console.log('👀 COUNTER DATA SCREEN: All readings from store:', allReadings);

    const handleExportToExcel = () => {
        // Заглушка для экспорта в Excel
        console.log('Экспорт данных в Excel:', filteredReadings);
        alert('Данные экспортированы в Excel!');
    };

    const handleShowStatistics = () => {
        // Переход на экран статистики
        navigation.navigate('StatisticsScreen');
    };

    const availablePeriods = useMemo(() => {
        const periodsSet = new Set(allReadings.map(reading => reading.period));
        const periodsArray = Array.from(periodsSet).sort((a, b) => {
            const [monthA, yearA] = a.split('.').map(Number);
            const [monthB, yearB] = b.split('.').map(Number);
            return new Date(yearB, monthB - 1) - new Date(yearA, monthA - 1);
        });
        return ['all', ...periodsArray];
    }, [allReadings]);

    const counterTypes = [
        { key: 'all', title: 'Все типы' },
        { key: 'electricity', title: 'Электричество' },
        { key: 'electricity_day', title: 'Электричество (день)' },
        { key: 'electricity_night', title: 'Электричество (ночь)' },
        { key: 'hot_water', title: 'Горячая вода' },
        { key: 'cold_water', title: 'Холодная вода' }
    ];

    // Функции для работы с множественным выбором периодов
    const togglePeriod = (period: string) => {
        if (period === 'all') {
            setSelectedPeriods(['all']);
        } else {
            setSelectedPeriods(prev => {
                const newPeriods = prev.filter(p => p !== 'all');
                if (newPeriods.includes(period)) {
                    return newPeriods.filter(p => p !== period);
                } else {
                    return [...newPeriods, period];
                }
            });
        }
    };

    const selectAllPeriods = () => {
        setSelectedPeriods(['all']);
    };

    const clearAllPeriods = () => {
        setSelectedPeriods([]);
    };

    const isPeriodSelected = (period: string) => {
        return selectedPeriods.includes(period);
    };

    const getSelectedPeriodsText = () => {
        if (selectedPeriods.includes('all') || selectedPeriods.length === 0) {
            return 'Все периоды';
        }
        if (selectedPeriods.length === 1) {
            return selectedPeriods[0];
        }
        return `Периоды: ${selectedPeriods.length}`;
    };

    // Функции для работы с множественным выбором типов
    const toggleType = (type: string) => {
        if (type === 'all') {
            setSelectedTypes(['all']);
        } else {
            setSelectedTypes(prev => {
                const newTypes = prev.filter(t => t !== 'all');
                if (newTypes.includes(type)) {
                    return newTypes.filter(t => t !== type);
                } else {
                    return [...newTypes, type];
                }
            });
        }
    };

    const selectAllTypes = () => {
        setSelectedTypes(['all']);
    };

    const clearAllTypes = () => {
        setSelectedTypes([]);
    };

    const isTypeSelected = (type: string) => {
        return selectedTypes.includes(type);
    };

    const getSelectedTypesText = () => {
        if (selectedTypes.includes('all') || selectedTypes.length === 0) {
            return 'Все типы';
        }
        if (selectedTypes.length === 1) {
            return counterTypes.find(t => t.key === selectedTypes[0])?.title || selectedTypes[0];
        }
        return `Типы: ${selectedTypes.length}`;
    };

    const filteredReadings = allReadings.filter(reading => {
        const matchesSearch = reading.userFio.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            reading.userApartment.includes(searchQuery);
        
        // Проверяем совпадение с выбранными периодами
        const matchesPeriod = selectedPeriods.includes('all') || 
                             selectedPeriods.length === 0 ||
                             selectedPeriods.includes(reading.period);
        
        // Проверяем совпадение с выбранными типами
        const matchesType = selectedTypes.includes('all') || 
                           selectedTypes.length === 0 ||
                           selectedTypes.includes(reading.counterType);
        
        return matchesSearch && matchesPeriod && matchesType;
    });

    console.log('🔍 COUNTER DATA SCREEN: Filtered readings:', filteredReadings);

    const getCounterTypeName = (type: string) => {
        const names = {
            'electricity': 'Электричество',
            'electricity_day': 'Электричество (день)',
            'electricity_night': 'Электричество (ночь)',
            'hot_water': 'Горячая вода', 
            'cold_water': 'Холодная вода'
        };
        return names[type] || type;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'verified': return '#4caf50';
            case 'submitted': return '#ff9800';
            case 'rejected': return '#f44336';
            default: return '#9e9e9e';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'verified': return 'Проверено';
            case 'submitted': return 'Ожидает проверки';
            case 'rejected': return 'Отклонено';
            default: return status;
        }
    };

    const calculateTotals = () => {
        const electricity = filteredReadings
            .filter(r => r.counterType === 'electricity' && r.status === 'verified')
            .reduce((sum, r) => sum + r.readings, 0);
        
        const electricityDay = filteredReadings
            .filter(r => r.counterType === 'electricity_day' && r.status === 'verified')
            .reduce((sum, r) => sum + r.readings, 0);
        
        const electricityNight = filteredReadings
            .filter(r => r.counterType === 'electricity_night' && r.status === 'verified')
            .reduce((sum, r) => sum + r.readings, 0);
        
        const hotWater = filteredReadings
            .filter(r => r.counterType === 'hot_water' && r.status === 'verified')
            .reduce((sum, r) => sum + r.readings, 0);
        
        const coldWater = filteredReadings
            .filter(r => r.counterType === 'cold_water' && r.status === 'verified')
            .reduce((sum, r) => sum + r.readings, 0);

        return { 
            electricity: electricity + electricityDay + electricityNight,
            hotWater, 
            coldWater 
        };
    };

    const totals = calculateTotals();

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Title>Данные со счетчиков</Title>
                    <Text style={styles.subtitle}>
                        Показания счетчиков от жильцов
                    </Text>

                    <Searchbar
                        placeholder="Поиск по ФИО или номеру квартиры..."
                        onChangeText={setSearchQuery}
                        value={searchQuery}
                        style={styles.searchBar}
                    />

                    {/* Секция выбора типов счетчиков */}
                    <View style={styles.filterSection}>
                        <Text style={styles.filterLabel}>Типы счетчиков: </Text>
                        <Menu
                            visible={typeMenuVisible}
                            onDismiss={() => setTypeMenuVisible(false)}
                            anchor={
                                <Chip
                                    mode="outlined"
                                    onPress={() => setTypeMenuVisible(true)}
                                    style={styles.filterChip}
                                    icon={selectedTypes.length > 1 ? "check-circle" : "meter-electric"}
                                >
                                    {getSelectedTypesText()}
                                </Chip>
                            }
                        >
                            <View style={styles.menuHeader}>
                                <Text style={styles.menuTitle}>Выбор типов счетчиков</Text>
                            </View>
                            <Menu.Item 
                                onPress={() => {
                                    selectAllTypes();
                                    setTypeMenuVisible(false);
                                }}
                                title="Все типы"
                                leadingIcon={selectedTypes.includes('all') ? "check" : undefined}
                            />
                            <Menu.Item 
                                onPress={() => {
                                    clearAllTypes();
                                    setTypeMenuVisible(false);
                                }}
                                title="Очистить все"
                                leadingIcon="close"
                            />
                            <Divider />
                            {counterTypes.filter(t => t.key !== 'all').map((type) => (
                                <Menu.Item
                                    key={type.key}
                                    onPress={() => toggleType(type.key)}
                                    title={type.title}
                                    leadingIcon={isTypeSelected(type.key) ? "check" : undefined}
                                />
                            ))}
                            <Divider />
                            <Menu.Item 
                                onPress={() => setTypeMenuVisible(false)}
                                title="Готово"
                                leadingIcon="check"
                            />
                        </Menu>
                        
                        {selectedTypes.length > 0 && !selectedTypes.includes('all') && (
                            <Chip
                                mode="outlined"
                                onPress={selectAllTypes}
                                style={styles.clearChip}
                                icon="close"
                            >
                                Сбросить
                            </Chip>
                        )}
                    </View>

                    {/* Отображение выбранных типов */}
                    {selectedTypes.length > 0 && !selectedTypes.includes('all') && (
                        <View style={styles.selectedItemsContainer}>
                            <Text style={styles.selectedItemsLabel}>Выбраны типы:</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.selectedItemsList}>
                                    {selectedTypes.map((type) => (
                                        <Chip
                                            key={type}
                                            mode="outlined"
                                            onPress={() => toggleType(type)}
                                            onClose={() => toggleType(type)}
                                            style={styles.selectedItemChip}
                                        >
                                            {counterTypes.find(t => t.key === type)?.title || type}
                                        </Chip>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    )}

                    {/* Быстрый выбор типов */}
                    <View style={styles.quickFiltersSection}>
                        <Text style={styles.quickFiltersLabel}>Быстрый выбор типов:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.filtersRow}>
                                {counterTypes.map((type) => (
                                    <Chip
                                        key={type.key}
                                        selected={isTypeSelected(type.key)}
                                        onPress={() => toggleType(type.key)}
                                        style={styles.quickFilterChip}
                                        showSelectedOverlay
                                    >
                                        {type.title}
                                    </Chip>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Секция выбора периодов */}
                    <View style={styles.filterSection}>
                        <Text style={styles.filterLabel}>Периоды: </Text>
                        <Menu
                            visible={periodMenuVisible}
                            onDismiss={() => setPeriodMenuVisible(false)}
                            anchor={
                                <Chip
                                    mode="outlined"
                                    onPress={() => setPeriodMenuVisible(true)}
                                    style={styles.filterChip}
                                    icon={selectedPeriods.length > 1 ? "check-circle" : "calendar"}
                                >
                                    {getSelectedPeriodsText()}
                                </Chip>
                            }
                        >
                            <View style={styles.menuHeader}>
                                <Text style={styles.menuTitle}>Выбор периодов</Text>
                            </View>
                            <Menu.Item 
                                onPress={() => {
                                    selectAllPeriods();
                                    setPeriodMenuVisible(false);
                                }}
                                title="Все периоды"
                                leadingIcon={selectedPeriods.includes('all') ? "check" : undefined}
                            />
                            <Menu.Item 
                                onPress={() => {
                                    clearAllPeriods();
                                    setPeriodMenuVisible(false);
                                }}
                                title="Очистить все"
                                leadingIcon="close"
                            />
                            <Divider />
                            {availablePeriods.filter(p => p !== 'all').map((period) => (
                                <Menu.Item
                                    key={period}
                                    onPress={() => togglePeriod(period)}
                                    title={period}
                                    leadingIcon={isPeriodSelected(period) ? "check" : undefined}
                                />
                            ))}
                            <Divider />
                            <Menu.Item 
                                onPress={() => setPeriodMenuVisible(false)}
                                title="Готово"
                                leadingIcon="check"
                            />
                        </Menu>
                        
                        {selectedPeriods.length > 0 && !selectedPeriods.includes('all') && (
                            <Chip
                                mode="outlined"
                                onPress={selectAllPeriods}
                                style={styles.clearChip}
                                icon="close"
                            >
                                Сбросить
                            </Chip>
                        )}
                    </View>

                    {/* Отображение выбранных периодов */}
                    {selectedPeriods.length > 0 && !selectedPeriods.includes('all') && (
                        <View style={styles.selectedItemsContainer}>
                            <Text style={styles.selectedItemsLabel}>Выбраны периоды:</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.selectedItemsList}>
                                    {selectedPeriods.map((period) => (
                                        <Chip
                                            key={period}
                                            mode="outlined"
                                            onPress={() => togglePeriod(period)}
                                            onClose={() => togglePeriod(period)}
                                            style={styles.selectedItemChip}
                                        >
                                            {period}
                                        </Chip>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    )}

                    {/* Быстрый выбор периодов */}
                    {availablePeriods.length <= 8 && (
                        <View style={styles.quickFiltersSection}>
                            <Text style={styles.quickFiltersLabel}>Быстрый выбор периодов:</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.filtersRow}>
                                    {availablePeriods.map((period) => (
                                        <Chip
                                            key={period}
                                            selected={isPeriodSelected(period)}
                                            onPress={() => togglePeriod(period)}
                                            style={styles.quickFilterChip}
                                            showSelectedOverlay
                                        >
                                            {period === 'all' ? 'Все периоды' : period}
                                        </Chip>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    )}
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Title>Сводка по проверенным показаниям</Title>
                    <View style={styles.totalsContainer}>
                        <View style={styles.totalItem}>
                            <Text style={styles.totalLabel}>Электричество</Text>
                            <Text style={styles.totalValue}>{totals.electricity} кВт·ч</Text>
                        </View>
                        <View style={styles.totalItem}>
                            <Text style={styles.totalLabel}>Горячая вода</Text>
                            <Text style={styles.totalValue}>{totals.hotWater.toFixed(2)} м³</Text>
                        </View>
                        <View style={styles.totalItem}>
                            <Text style={styles.totalLabel}>Холодная вода</Text>
                            <Text style={styles.totalValue}>{totals.coldWater.toFixed(2)} м³</Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.header}>
                        <Title>Показания счетчиков</Title>
                        <Text style={styles.countText}>
                            Найдено: {filteredReadings.length}
                        </Text>
                    </View>

                    <ScrollView horizontal>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>Жилец</DataTable.Title>
                                <DataTable.Title>Квартира</DataTable.Title>
                                <DataTable.Title>Тип счетчика</DataTable.Title>
                                <DataTable.Title numeric>Показания</DataTable.Title>
                                <DataTable.Title>Период</DataTable.Title>
                                <DataTable.Title>Статус</DataTable.Title>
                            </DataTable.Header>

                            {filteredReadings.map((reading) => (
                                <DataTable.Row key={reading.id}>
                                    <DataTable.Cell>
                                        <Text style={styles.userName}>{reading.userFio}</Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell>{reading.userApartment}</DataTable.Cell>
                                    <DataTable.Cell>
                                        <Text style={styles.counterType}>
                                            {getCounterTypeName(reading.counterType)}
                                        </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell numeric>
                                        <Text style={styles.readings}>
                                            {reading.counterType.includes('electricity') 
                                                ? `${reading.readings} кВт·ч`
                                                : `${reading.readings.toFixed(2)} м³`
                                            }
                                        </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell>{reading.period}</DataTable.Cell>
                                    <DataTable.Cell>
                                        <Chip 
                                            mode="outlined"
                                            textStyle={{ 
                                                fontSize: 10,
                                                color: getStatusColor(reading.status)
                                            }}
                                            style={{ 
                                                borderColor: getStatusColor(reading.status),
                                                backgroundColor: getStatusColor(reading.status) + '20'
                                            }}
                                        >
                                            {getStatusText(reading.status)}
                                        </Chip>
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        </DataTable>
                    </ScrollView>

                    {filteredReadings.length === 0 && (
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
                        onPress={handleExportToExcel}
                        style={styles.actionButton}
                    >
                        Экспорт в Excel
                    </Button>
                    <Button
                        mode="outlined"
                        icon="chart-bar"
                        onPress={handleShowStatistics}
                        style={styles.actionButton}
                    >
                        Статистика потребления
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
        marginBottom: 16,
    },
    filterSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        flexWrap: 'wrap',
    },
    filterLabel: {
        fontSize: 14,
        marginRight: 8,
        fontWeight: '500',
        minWidth: 120,
    },
    filterChip: {
        backgroundColor: '#DEB887',
        marginRight: 8,
    },
    clearChip: {
        backgroundColor: '#FFE4E1',
        borderColor: '#FF6B6B',
    },
    selectedItemsContainer: {
        marginTop: 8,
        marginBottom: 8,
    },
    selectedItemsLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    selectedItemsList: {
        flexDirection: 'row',
        gap: 4,
    },
    selectedItemChip: {
        backgroundColor: '#E8F5E8',
        borderColor: '#4CAF50',
    },
    quickFiltersSection: {
        marginTop: 12,
        marginBottom: 8,
    },
    quickFiltersLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
    },
    filtersRow: {
        flexDirection: 'row',
        gap: 8,
        paddingVertical: 4,
    },
    quickFilterChip: {
        marginRight: 8,
    },
    menuHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: 'bold',
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
    userName: {
        fontSize: 12,
        fontWeight: '500',
    },
    counterType: {
        fontSize: 11,
        color: '#666',
    },
    readings: {
        fontSize: 12,
        fontWeight: '500',
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

export default CounterDataScreen;