import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Video } from 'expo-video';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { obtenerTodaoLosJuegos } from '../api/learn';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = 200;

const LearnScreen = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState({});
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await obtenerTodaoLosJuegos();
      if (response.data && response.data.datos) {
        setGames(response.data.datos);
      }
    } catch (error) {
      console.error('Error fetching games:', error);
      if (error.response && error.response.status === 401) {
        Alert.alert(
          'Error de autenticación',
          'Por favor inicia sesión para ver los juegos',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login')
            }
          ]
        );
      } else {
        Alert.alert(
          'Error',
          'No se pudieron cargar los juegos. Por favor intenta de nuevo.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleCard = (id) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BACA16" />
      </View>
    );
  }

  if (games.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={40} color="#BACA16" />
          </TouchableOpacity>
          <Text style={styles.title}>Aprende Señas</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay juegos disponibles</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={40} color="#BACA16" />
        </TouchableOpacity>
        <Text style={styles.title}>Aprende Señas</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {games.map((game) => (
          <TouchableOpacity
            key={`game-${game.idJuego}`}
            style={styles.cardContainer}
            onPress={() => toggleCard(game.idJuego)}
            activeOpacity={0.9}
          >
            <View style={[
              styles.card,
              flippedCards[game.idJuego] && styles.cardFlipped
            ]}>
              {/* Front of card */}
              <View style={[styles.cardFace, styles.cardFront]}>
                <Image
                  source={require('../assets/logo.png')}
                  style={styles.cardImage}
                  resizeMode="contain"
                />
                <Text style={styles.cardTitle}>{game.nombre}</Text>
                <Text style={styles.tapText}>Toca para ver el video</Text>
              </View>

              {/* Back of card */}
              <View style={[styles.cardFace, styles.cardBack]}>
                <Video
                  key={`video-${game.idJuego}`}
                  source={{ uri: game.foto }}
                  style={styles.video}
                  useNativeControls
                  resizeMode="contain"
                  isLooping
                  shouldPlay={flippedCards[game.idJuego]}
                />
                <Text style={styles.cardTitle}>{game.nombre}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  cardContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardFlipped: {
    transform: [{ rotateY: '180deg' }],
  },
  cardFace: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    position: 'absolute',
    backfaceVisibility: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cardFront: {
    backgroundColor: '#fff',
  },
  cardBack: {
    backgroundColor: '#fff',
    transform: [{ rotateY: '180deg' }],
  },
  cardImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 10,
  },
  tapText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  video: {
    width: '100%',
    height: '80%',
    backgroundColor: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
});

export default LearnScreen; 