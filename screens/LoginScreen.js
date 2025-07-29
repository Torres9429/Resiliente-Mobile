import { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const LoginScreen = () => {
  const { login, isLoading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState(null);

  // Limpiar errores cuando el usuario empiece a escribir
  const handleEmailChange = (text) => {
    setEmail(text);
    setErrorMessage(null);
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setErrorMessage(null);
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      setErrorMessage("Por favor, ingrese un correo y contraseña");
      return;
    }
    setErrorMessage(null);
    try {
      console.log("email: ", email);
      console.log("password: ", password);
      await login(email, password);
    } catch (error) {
      console.error("Error al iniciar sesión (login):", error);
      
      // Manejar diferentes tipos de errores
      if (error.response?.status === 401) {
        const errorMessage = error.response?.data?.mensaje || '';
        if (errorMessage.includes('Credenciales inválidas')) {
          setErrorMessage("Correo o contraseña incorrectos");
        } else {
          setErrorMessage("Error de autenticación. Por favor, inicie sesión nuevamente.");
        }
      } else if (error.response?.status === 500) {
        setErrorMessage("Error del servidor. Intente más tarde.");
      } else if (error.code === 'NETWORK_ERROR') {
        setErrorMessage("Error de conexión. Verifique su internet.");
      } else if (error.message) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Error inesperado. Intente nuevamente.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerLogo}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="chevron-left" size={40} color="#BACA16" />
        </TouchableOpacity>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
      </View>
      <View style={styles.bodyContainer}> 
      <Text style={styles.title}>Bienvenido</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="email" size={24} color="#BACA16" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          autoCapitalize="none"
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={24} color="#BACA16" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={handlePasswordChange}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="#aaa" style={styles.icon} />
        </TouchableOpacity>
      </View>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.buttonDisabled]} 
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#fcfcfc", 
    width: "100%" 
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20 
  },
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
  },
  icon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: "#BACA16",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.8,
    backgroundColor: "#9BA812",
  },
  buttonText: { 
    color: "white", 
    fontSize: 18, 
    fontWeight: "bold" 
  },
  headerLogo: {
    width: "115%",
    height: '30%',
    experimental_backgroundImage: "linear-gradient(180deg, #51BBF5 0%, #559BFA 70%,rgb(67, 128, 213) 100%)",
    justifyContent: "center",
    alignItems: "center",
    //borderBottomEndRadius: '50%',
    //borderBottomStartRadius: '50%',
    marginBottom: 20,
    position: "absolute",
    top: 0,
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 20,
  },
  /*backButton: {
    marginRight: 10,
    position: "absolute",
    top: 50,
    left: 50,
    bottom: 5,
  },*/
  backButton: {
    position: "absolute",
    top: 45,
    left: 50,
    zIndex: 1,
    borderRadius: 50,
    padding: 5,
    //backgroundColor: "rgba(187, 202, 22, 0.35)", // semi-transparente
    backgroundColor: "rgba(255, 255, 255, 0.6)",
},
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  infoText: {
    color: "#BACA16",
    fontSize: 18,
    fontWeight: "bold",
  },
  bodyContainer: {
    flex: 1,
    paddingVertical: 50,
    paddingHorizontal: 5,
    backgroundColor: "#fcfcfc",
    width: "100%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: "60%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default LoginScreen;