import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Text, Chip, Button, DataTable, Searchbar, Menu, Divider } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const StatisticsScreen = () => {
    const [selectedPeriods, setSelectedPeriods] = useState<string[]>(['all']);
    const [selectedTypes, setSelectedTypes] = useState<string[]>(['all']);
    const [periodMenuVisible, setPeriodMenuVisible] = useState(false);
    const [typeMenuVisible, setTypeMenuVisible] = useState(false);

    const allReadings = useSelector((state: RootState) => state.counterReadings.readings);

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

    // Функции для работы с множественным выбором (аналогичные CounterDataScreen)
    const togglePeriod = (period: string) => {
        if (period === 'all') setSelectedPeriods(['all']);
        else {
            setSelectedPeriods(prev => {
                const newPeriods = prev.filter(p => p !== 'all');
                return newPeriods.includes(period) 
                    ? newPeriods.filter(p => p !== period)
                    : [...newPeriods, period];
            });
        }
    };

    const toggleType = (type: string) => {
        if (type === 'all') setSelectedTypes(['all']);
        else {
            setSelectedTypes(prev => {
                const newTypes = prev.filter(t => t !== 'all');
                return newTypes.includes(type) 
                    ? newTypes.filter(t => t !== type)
                    : [...newTypes, type];
            });
        }
    };

    const selectAllPeriods = () => setSelectedPeriods(['all']);
    const selectAllTypes = () => setSelectedTypes(['all']);

    const isPeriodSelected = (period: string) => selectedPeriods.includes(period);
    const isTypeSelected = (type: string) => selectedTypes.includes(type);

    // Статистика по периодам
    const statisticsByPeriod = useMemo(() => {
        const filteredReadings = allReadings.filter(reading => {
            const matchesPeriod = selectedPeriods.includes('all') || selectedPeriods.includes(reading.period);
            const matchesType = selectedTypes.includes('all') || selectedTypes.includes(reading.counterType);
            return matchesPeriod && matchesType;
        });

        const periodStats: { [period: string]: { [type: string]: number } } = {};

        filteredReadings.forEach(reading => {
            if (!periodStats[reading.period]) {
                periodStats[reading.period] = {};
            }
            if (!periodStats[reading.period][reading.counterType]) {
                periodStats[reading.period][reading.counterType] = 0;
            }
            periodStats[reading.period][reading.counterType] += reading.readings;
        });

        return periodStats;
    }, [allReadings, selectedPeriods, selectedTypes]);

    // Общая статистика
    const totalStatistics = useMemo(() => {
        const stats: { [type: string]: number } = {};
        
        Object.values(statisticsByPeriod).forEach(periodData => {
            Object.entries(periodData).forEach(([type, value]) => {
                if (!stats[type]) stats[type] = 0;
                stats[type] += value;
            });
        });

        return stats;
    }, [statisticsByPeriod]);

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

    const formatValue = (type: string, value: number) => {
        return type.includes('electricity') ? `${value} кВт·ч` : `${value.toFixed(2)} м³`;
    };

    const handleExportStatistics = () => {
        // Заглушка для экспорта статистики
        console.log('Экспорт статистики:', { statisticsByPeriod, totalStatistics });
        alert('Статистика экспортирована в Excel!');
    };

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Title>Статистика потребления</Title>
                    <Text style={styles.subtitle}>
                        Анализ потребления ресурсов по периодам
                    </Text>

                    {/* Фильтры (аналогичные CounterDataScreen) */}
                    <View style={styles.filterSection}>
                        <Text style={styles.filterLabel}>Типы счетчиков: </Text>
                        <Menu
                            visible={typeMenuVisible}
                            onDismiss={() => setTypeMenuVisible(false)}
                            anchor={
                                <Chip mode="outlined" onPress={() => setTypeMenuVisible(true)} style={styles.filterChip}>
                                    {selectedTypes.includes('all') ? 'Все типы' : `Типы: ${selectedTypes.length}`}
                                </Chip>
                            }
                        >
                            <Menu.Item onPress={selectAllTypes} title="Все типы" leadingIcon={selectedTypes.includes('all') ? "check" : undefined} />
                            <Divider />
                            {counterTypes.filter(t => t.key !== 'all').map((type) => (
                                <Menu.Item
                                    key={type.key}
                                    onPress={() => toggleType(type.key)}
                                    title={type.title}
                                    leadingIcon={isTypeSelected(type.key) ? "check" : undefined}
                                />
                            ))}
                        </Menu>
                    </View>

                    <View style={styles.filterSection}>
                        <Text style={styles.filterLabel}>Периоды: </Text>
                        <Menu
                            visible={periodMenuVisible}
                            onDismiss={() => setPeriodMenuVisible(false)}
                            anchor={
                                <Chip mode="outlined" onPress={() => setPeriodMenuVisible(true)} style={styles.filterChip}>
                                    {selectedPeriods.includes('all') ? 'Все периоды' : `Периоды: ${selectedPeriods.length}`}
                                </Chip>
                            }
                        >
                            <Menu.Item onPress={selectAllPeriods} title="Все периоды" leadingIcon={selectedPeriods.includes('all') ? "check" : undefined} />
                            <Divider />
                            {availablePeriods.filter(p => p !== 'all').map((period) => (
                                <Menu.Item
                                    key={period}
                                    onPress={() => togglePeriod(period)}
                                    title={period}
                                    leadingIcon={isPeriodSelected(period) ? "check" : undefined}
                                />
                            ))}
                        </Menu>
                    </View>
                </Card.Content>
            </Card>

            {/* Общая статистика */}
            <Card style={styles.card}>
                <Card.Content>
                    <Title>Общее потребление</Title>
                    <View style={styles.totalsContainer}>
                        {Object.entries(totalStatistics).map(([type, value]) => (
                            <View key={type} style={styles.totalItem}>
                                <Text style={styles.totalLabel}>{getCounterTypeName(type)}</Text>
                                <Text style={styles.totalValue}>{formatValue(type, value)}</Text>
                            </View>
                        ))}
                    </View>
                </Card.Content>
            </Card>

            {/* Детальная статистика по периодам */}
            <Card style={styles.card}>
                <Card.Content>
                    <View style={styles.header}>
                        <Title>Потребление по периодам</Title>
                        <Button mode="outlined" icon="file-export" onPress={handleExportStatistics}>
                            Экспорт
                        </Button>
                    </View>

                    <ScrollView horizontal>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title>Период</DataTable.Title>
                                {counterTypes.filter(t => t.key !== 'all').map(type => (
                                    <DataTable.Title key={type.key} numeric>
                                        {type.title}
                                    </DataTable.Title>
                                ))}
                                <DataTable.Title numeric>Всего</DataTable.Title>
                            </DataTable.Header>

                            {Object.entries(statisticsByPeriod)
                                .sort(([periodA], [periodB]) => {
                                    const [monthA, yearA] = periodA.split('.').map(Number);
                                    const [monthB, yearB] = periodB.split('.').map(Number);
                                    return new Date(yearB, monthB - 1) - new Date(yearA, monthA - 1);
                                })
                                .map(([period, periodData]) => {
                                    const periodTotal = Object.values(periodData).reduce((sum, value) => sum + value, 0);
                                    
                                    return (
                                        <DataTable.Row key={period}>
                                            <DataTable.Cell>{period}</DataTable.Cell>
                                            {counterTypes.filter(t => t.key !== 'all').map(type => (
                                                <DataTable.Cell key={type.key} numeric>
                                                    <Text style={styles.statValue}>
                                                        {formatValue(type.key, periodData[type.key] || 0)}
                                                    </Text>
                                                </DataTable.Cell>
                                            ))}
                                            <DataTable.Cell numeric>
                                                <Text style={styles.totalValue}>
                                                    {formatValue('total', periodTotal)}
                                                </Text>
                                            </DataTable.Cell>
                                        </DataTable.Row>
                                    );
                                })}
                        </DataTable>
                    </ScrollView>

                    {Object.keys(statisticsByPeriod).length === 0 && (
                        <Text style={styles.noDataText}>Данные не найдены</Text>
                    )}
                </Card.Content>
            </Card>

            <Card style={styles.card}>
                <Card.Content>
                    <Title>Аналитика</Title>
                    <Text style={styles.analysisText}>
                        • Всего периодов: {Object.keys(statisticsByPeriod).length}
                    </Text>
                    <Text style={styles.analysisText}>
                        • Всего показаний: {Object.values(statisticsByPeriod).reduce((sum, period) => sum + Object.keys(period).length, 0)}
                    </Text>
                    <Text style={styles.analysisText}>
                        • Наибольшее потребление: {(() => {
                            let maxType = '';
                            let maxValue = 0;
                            Object.entries(totalStatistics).forEach(([type, value]) => {
                                if (value > maxValue) {
                                    maxValue = value;
                                    maxType = type;
                                }
                            });
                            return maxType ? `${getCounterTypeName(maxType)} - ${formatValue(maxType, maxValue)}` : 'нет данных';
                        })()}
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
        marginVertical: 8,
    },
    filterLabel: {
        fontSize: 14,
        marginRight: 8,
        fontWeight: '500',
        minWidth: 120,
    },
    filterChip: {
        backgroundColor: '#DEB887',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    totalsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    totalItem: {
        alignItems: 'center',
        flex: 1,
        minWidth: '30%',
        marginBottom: 12,
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
    statValue: {
        fontSize: 12,
        fontWeight: '500',
    },
    noDataText: {
        textAlign: 'center',
        marginVertical: 16,
        color: '#666',
        fontStyle: 'italic',
    },
    analysisText: {
        fontSize: 14,
        marginBottom: 8,
        color: '#333',
    },
});

export default StatisticsScreen;