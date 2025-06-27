import { StyleSheet } from "react-native";

const COLORS = {
    primary: "#597cff", //azul
    secondary: "#BACA16", //verde
    tertiary: "#F6C80D", //amarillo
    background: "#fcfcfc",
    text: "#000",
    buttonText: "#fff",
  };
const SIZES = {
    small: 12,
    medium: 16,
    large: 20,
    xlarge: 24,
    xxlarge: 28,
    borderRadius: 10,
};
  
export const globalStyles = StyleSheet.create({
  // Colores principales
  primaryColor: '#BACA16',
  secondaryColor: '#9BA812',
  backgroundColor: COLORS.background,
  textColor: '#000000',
  errorColor: '#FF0000',

  // Estilos de contenedores
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },

  // Estilos de texto
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 10,
  },

  // Estilos de botones
  button: {
    backgroundColor: '#BACA16',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginTop: 20,
    minWidth: 250,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.8,
    backgroundColor: '#9BA812',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  buttonTextLoading: {
    opacity: 0.9,
  },

  // Estilos de inputs
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BACA16',
    borderRadius: 25,
    padding: 15,
    marginBottom: 15,
    width: '100%',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF0000',
  },

  // Estilos de tarjetas
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Estilos de listas
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },

  // Estilos de mensajes de error
  errorText: {
    color: '#FF0000',
    fontSize: 14,
    marginTop: 5,
  },

  // Estilos de espaciado
  spacing: {
    small: 5,
    medium: 10,
    large: 20,
  },

  // Estilos de sombras
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Estilos de header
  header: {
    width: "115%",
    height: '30%',
    backgroundColor: "#51BBF5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    position: "absolute",
    top: 0,
  },

  // Estilos de contenedores
  btns: {
    height: 40,
    width: '90%',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    marginTop: 90,
    position: 'absolute',
    zIndex: 1,
    alignSelf: 'center',
},
btnText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#fff',
    marginHorizontal: 5
},
searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flex: 1,
    minHeight: 40,
    maxHeight: 45,
    marginRight: 10,
    marginBottom: 35,

},
searchIcon: {
    marginRight: 10,
},
searchBar: {
    flex: 1,
    fontSize: 16,
    color: '#333',
},
// --- Filtros ---
filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginVertical: 10,
    paddingHorizontal: 5,
    zIndex: 1,
    top: 130,
    left: 10,
    right: 0,
},
filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#fcedb1', // Color de fondo amarillo claro
    //backgroundColor: 'rgba(246, 199, 13, 0.2)', //amarillo transparente F6C80D
    borderColor: 'rgba(187, 202, 22, 0.48)',//'#BACA16' transparente,
    borderWidth: 1,
    borderRadius: 20,
    marginHorizontal: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
},
filterButtonActive: {
    backgroundColor: '#BACA16',
},
filterButtonText: {
    color: '#333',
    fontWeight: 'bold',
},

  // Estilos de botones
  button2: {
    backgroundColor: "#51BBF5",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  button3: {
    backgroundColor: "#559BFA",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 10,
    minWidth: 200,
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: "#BACA16",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    right: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Estilos de búsqueda
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
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
  },
  searchBar: {
    flex: 1,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  searchIcon: {
    marginRight: 10,
  },
});

export default globalStyles;