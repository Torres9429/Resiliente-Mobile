import { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"; // Importación corregida


const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      <View style={styles.headerLogo} >
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={40} color="white" />
        </TouchableOpacity>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <Text style={styles.title}>Bienvenido</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="email" size={24} color="#BACA16" style={styles.icon} />
        {/*<Ionicons name="person-circle-outline" size={24} color="#BACA16" style={{ marginBottom: 20 }} />*/}
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          autoCapitalize="none"
          onChangeText={(text) => setUsername(text.trim().toLowerCase())}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={24} color="#BACA16" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="#aaa" style={styles.icon} />
              </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => login(username, password)}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    </View>

  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f5f5f5", width: "100%", },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffff',
    borderRadius: 10,
    paddingHorizontal: 10,
    minWidth: '85%',
    maxWidth: '90%',
    height: 50,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 20,
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#333',
    /* width: "80%", 
    height: 40, 
    borderWidth: 1, 
    borderColor: "#ccc",
    marginVertical: 10, 
    padding: 12, 
    backgroundColor: "#fff", 
    borderRadius: 20  */
  },
  icon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: "#BACA16",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 10
  },
  buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
  headerLogo: {
    width: "115%",
    height: '25%',
    //backgroundColor: "#51BBF5",
    experimental_backgroundImage: "linear-gradient(180deg, #51BBF5 0%, #559BFA 70%,rgb(67, 128, 213) 100%)",
    justifyContent: "center",
    alignItems: "center",
    borderBottomEndRadius: '50%',
    borderBottomStartRadius: '50%',
    //borderRadius: '50%',
    marginBottom: 20,
    position: "absolute",
    top: 0,

  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 20,

  },
  backButton: {
    marginRight: 10,
    position: "absolute",
    top: 50,
    left: 50,
    bottom: 5,
  },
});

export default LoginScreen;