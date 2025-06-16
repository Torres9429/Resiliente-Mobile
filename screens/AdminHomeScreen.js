import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { obtenerTodosLosProductos } from '../api/menu';
import { obtenerTodosLosMeseros } from '../api/waiters';
import { obtenerTodasLasSenas } from '../api/sign';

const AdminHomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalWaiters: 0,
    totalSigns: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, waitersRes, signsRes] = await Promise.all([
        obtenerTodosLosProductos(),
        obtenerTodosLosMeseros(),
        obtenerTodasLasSenas()
      ]);

      setStats({
        totalProducts: productsRes.data.datos.length,
        totalWaiters: waitersRes.data.datos.length,
        totalSigns: signsRes.data.datos.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const menuItems = [
    {
      title: 'Productos',
      icon: 'food',
      screen: 'Menú',
      color: '#7B8FA1',
    },
    {
      title: 'Meseros',
      icon: 'account-group',
      screen: 'Empleados',
      color: '#567189',
    },
    {
      title: 'Señas',
      icon: 'hand-clap',
      screen: 'Señas',
      color: '#607EAA',
    },
    {
      title: 'Reportes',
      icon: 'chart-bar',
      screen: 'Reports',
      color: '#4A6FA5',
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.userInfo}>
            <MaterialCommunityIcons name="account-circle" size={40} color="#fff" />
            <View style={styles.userText}>
              <Text style={styles.welcomeText}>Bienvenido,</Text>
              <Text style={styles.userName}>{user?.nombre || 'Administrador'}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <MaterialCommunityIcons name="logout" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bodyContainer}>

      {/* Stats Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#7B8FA1' }]}>
          <MaterialCommunityIcons name="food" size={24} color="#fff" />
          <Text style={styles.statNumber}>{stats.totalProducts}</Text>
          <Text style={styles.statLabel}>Productos</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#567189' }]}>
          <MaterialCommunityIcons name="account-group" size={24} color="#fff" />
          <Text style={styles.statNumber}>{stats.totalWaiters}</Text>
          <Text style={styles.statLabel}>Meseros</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#607EAA' }]}>
          <MaterialCommunityIcons name="hand-clap" size={24} color="#fff" />
          <Text style={styles.statNumber}>{stats.totalSigns}</Text>
          <Text style={styles.statLabel}>Señas</Text>
        </View>
      </ScrollView>

      {/* Menu Grid */}
      <View style={styles.menuGrid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { backgroundColor: item.color }]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <MaterialCommunityIcons name={item.icon} size={32} color="#fff" />
            <Text style={styles.menuItemText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: "column",
    width: "100%",
    justifyContent: 'flex-end',
    height: '20%',
    paddingBottom: 50,
    paddingHorizontal: 10,
    experimental_backgroundImage: "linear-gradient(180deg, #51BBF5 0%, #559BFA 70%,rgb(67, 128, 213) 100%)",
    //experimental_backgroundImage: "linear-gradient(180deg, #f6c80d 0%, #baca16 40%,rgb(117, 128, 4) 100%)",
},
bodyContainer: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    backgroundColor: "#fcfcfc",
    width: "100%",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -35,
},
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userText: {
    marginLeft: 10,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 14,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  statCard: {
    padding: 20,
    borderRadius: 15,
    marginRight: 15,
    width: 150,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statNumber: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  statLabel: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
  },
  menuItem: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  menuItemText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default AdminHomeScreen;