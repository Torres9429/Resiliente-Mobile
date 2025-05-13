import React, { useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const carouselData = [
  { id: 1, image: require("../assets/Rectangle 9.png") },
  { id: 2, image: require("../assets/waiter1.jpg") },
  { id: 3, image: require('../assets/Rectangle 8.png') },
];

const UserHomeScreen = () => {
  const { logout } = useContext(AuthContext);
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: "center", marginTop: 10, marginBottom: 0, width: "100%" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", }}>¡Bienvenido a Resiliente!</Text>
        <Carousel
          loop
          width={400}
          height={250}
          style={{ marginTop: 0, marginBottom: 0, padding: 0 }}
          pagingEnabled={true}
          mode="parallax"
          modeConfig={{
            parallaxScrollingScale: 0.8,
            parallaxScrollingOffset: 100,

          }}
          autoPlay={true}
          autoPlayInterval={3000}
          data={carouselData}
          scrollAnimationDuration={5000}
          renderItem={({ item }) => (
            <Image source={item.image} style={styles.carouselImage} />
          )}
        />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>¿Listo para ordenar?</Text>
          <Text style={styles.cardText}>
            Sigue estos sencillos pasos.
            {"\n"}1. Selecciona el mesero que te atiende.{"\n"}
            2. Revisa sus características para tener una mejor comunicación con quien te atiende.{"\n"}
            3. Selecciona el platillo que deseas ordenar.{"\n"}
            4. Sigue las instrucciones para pedir tu platillo.{"\n"}
            5. ¡Listo! Tu orden ha sido enviada y el mesero se pondrá en contacto contigo para confirmar tu orden.
          </Text>
        </View>

        <TouchableOpacity style={styles.orderButton} onPress={() => navigation.navigate("Ordenar")}>
          <Text style={styles.orderButtonText}>¡Ordena ahora!</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  carouselImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover", //o contain, 4:3
    borderRadius: 30,
  },
  card: {
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: "90%",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    color: "#555",
    writingDirection: "ltr",
  },
  orderButton: {
    backgroundColor: "#BACA16",
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    marginTop: 20,
    alignItems: "center",
  },
  logoutText: {
    color: "red",
    fontSize: 16,
  },
});

export default UserHomeScreen;
