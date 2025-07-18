import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    SafeAreaView,
    ImageBackground,
} from 'react-native';

const WelcomeScreen = ({ navigation }) => {
    const [selectedButton, setSelectedButton] = useState('UserApp');
    const handlePress = (button) => {
        setSelectedButton(button);
        navigation.navigate(button);
    };

    return (
            
            <View style={styles.header}>
                <LinearGradient colors={['#51BBF5', '#559BFA', 'rgb(22, 36, 87)']} locations={[0.0, 0.44, 1.0]} style={styles.header}>
                    <View style={styles.container}>
                        <Text style={styles.title}>
                            Bienvenido a <Text style={styles.titleHighlight}>Resiliente</Text>
                        </Text>

                        <Image
                            source={require('../assets/logo.png')}
                            style={styles.image}
                            resizeMode="contain"
                        />

                        <View style={styles.buttonsSection}>
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    selectedButton === 'UserApp' && styles.buttonSelected,
                                ]}
                                onPress={() => handlePress('UserApp')}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        selectedButton === 'UserApp' && styles.buttonTextSelected,
                                    ]}
                                >
                                    ¡Ordena ya!
                                </Text>
                            </TouchableOpacity>

                            <Text style={styles.orText}>o</Text>

                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    selectedButton === 'Login' && styles.buttonSelected,
                                ]}
                                onPress={() => handlePress('Login')}
                            >
                                <Text
                                    style={[
                                        styles.buttonText,
                                        selectedButton === 'Login' && styles.buttonTextSelected,
                                    ]}
                                >
                                    Inicia sesión
                                </Text>
                            </TouchableOpacity>

                            <Text style={styles.note}>Solo para personal</Text>
                        </View>
                    </View>
                </LinearGradient>
            </View>

    );
};

const styles = StyleSheet.create({
    header: {
        flex: 1,
        //backgroundColor: '#f3f3f3',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#f3f3f3',
    },
    container: {
        flex: 1,
        paddingHorizontal: 30,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 100,
    },
    title: {
        fontSize: 28,
        //color: '#51BBF5',
        color: '#fff',
        fontWeight: 'medium',
        textAlign: 'left',
        marginBottom: 40,
        marginLeft: 30,
        marginTop: 10,
    },
    titleHighlight: {
        fontSize: 36,
        //color: '#BACA16',
        color: '#fff',
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        color: '#f3f3f3',
        marginTop: 10,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    image: {
        width: 230,
        height: 210,
        marginBottom: 60,
    },
    buttonsSection: {
        alignItems: 'center',
        width: 250,

    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        backgroundColor: '#fff',
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#BACA16',
        marginVertical: 10,
        width: '100%',
    },
    buttonSelected: {
        backgroundColor: '#BACA16',
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#BACA16',
        textAlign: 'center',
    },
    buttonTextSelected: {
        color: '#fff',
    },
    orText: {
        fontSize: 16,
        color: '#BACA16',
        marginVertical: 10,
    },
    note: {
        color: '#BACA16',
        fontStyle: 'italic',
    },
});

export default WelcomeScreen;
