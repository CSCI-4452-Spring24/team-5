import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HourlyForecast = ({ hourlyForecasts }) => {
    
    const Divider = () => {
        return (
            <View style={styles.divider} />
        );
    };

    const renderItem = ({ item, index }) => {

        const date = new Date(item.time);
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true
        });

        const isLastItem = index === hourlyForecasts.length - 1;
        
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={styles.itemContainer}>
                    <Text style={styles.text}>{formattedTime}</Text>
                    <Image
                        style={styles.iconStyle}
                        source={{ uri: `https:${item.icon_url}` }}
                    />
                    <Text style={styles.text}>{`${Math.round(item.temperature_c)}°`}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="water-sharp" size={24} style={{color: 'rgba(0, 0, 0, 0.5)'}}/>
                        <Text style={styles.text}>{`${item.chance_of_rain}%`}</Text>
                    </View>
                </View>
                {!isLastItem && <Divider />}
            </View>
        );
    };

    return (
        <FlatList
            data={hourlyForecasts}
            renderItem={renderItem}
            keyExtractor={item => item.time}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingVertical: '3%',
    },
    itemContainer: {
        alignItems: 'center',
        justifyContent: 'space-around', // Adjusted justifyContent
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        width: 60,
        marginHorizontal: 11.8,
        elevation: 1,
        
    },
    text: {
        fontSize: 18,
    },
    iconStyle: {
        width: '100%',
        height: '30%',
    },
    divider: {
        height: '100%', // Ensures the divider stretches the full height of the item container
        width: 1,
        backgroundColor: '#999', // or any color that suits the design
    },
});


export default HourlyForecast;
