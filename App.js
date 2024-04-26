import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, ScrollView, Keyboard } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';


const API_KEY = '8158ea1b56e2497492b163654241204'; 

const firebaseConfig = {

  apiKey: "AIzaSyAVUe6aEZbDCHEtK3GKQ8z2krPtGCRn-pY",
  authDomain: "weather-app-a89c7.firebaseapp.com",
  projectId: "weather-app-a89c7",
  storageBucket: "weather-app-a89c7.appspot.com",
  messagingSenderId: "1032223150313",
  appId: "1:1032223150313:web:8d660be8d32a1d8b18e078",
  measurementId: "G-ZDJ2Z2D1ZR"

};


const app = initializeApp(firebaseConfig);

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
       <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>

       <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} color="#3498db" />
      </View>

      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
        </Text>
      </View>
    </View>
  );
}


const AuthenticatedScreen = ({ user, handleAuthentication }) => {

  const [weatherData, setWeatherData] = useState(null);
  const [zipCode, setZipCode] = useState(''); 

const [clothingSuggestions, setClothingSuggestions] = useState([]);

  const fetchClothingSuggestions = (weatherCondition) => {
    // Add logic here to fetch clothing suggestions based on the weather condition
    // For example, you can use an if-else ladder to check the weather condition and suggest appropriate clothing items
  
    let suggestions = [];
  
    if (weatherCondition.includes('Sunny')) {
      suggestions.push('Shorts', 'T-shirt', 'Sunglasses');
    } else if (weatherCondition.includes('cloudy')) {
      suggestions.push('Jeans', 'T-shirt', 'Jacket');
    } else if (weatherCondition.includes('rainy')) {
      suggestions.push('Raincoat', 'Umbrella', 'Boots');
    } else if (weatherCondition.includes('snowy')) {
      suggestions.push('Ski pants', 'Jacket', 'Snow boots');
    }
  
    setClothingSuggestions(suggestions);
  };
  
  const fetchWeatherData = () => {
   

    fetch(`http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${zipCode}&days=7`)
   

      .then(response => response.json())
      .then(data => {
        console.log('Weather Data:', data);
        setWeatherData(data);
        fetchClothingSuggestions(data.current.condition.text);

      })
      .catch(error => {
        console.log('Error fetching weather data:', error);
      });
  };

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const handlePress = () => {
    fetchWeatherData();
    Keyboard.dismiss();
};

  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.emailText}>{user.email}</Text>
        <SafeAreaView style={styles.container}>
          <Text>Enter Zip Code:</Text>
          <TextInput
            style={styles.input}
            value={zipCode}
            onChangeText={(text)=> setZipCode(text)}
            placeholder="Enter zip code"
            keyboardType="numeric"
          />
          <Button
            title="Get Weather"
            onPress={handlePress}
          />
          <StatusBar style="auto" />
        
          {weatherData && weatherData.current && (
            <View style={styles.weatherContainer}>
              <Text>Current Weather:</Text>
              <Text>Temperature: {weatherData.current.temp_f}</Text>
              <Text>Condition: {weatherData.current.condition.text}</Text>
              <Text>time: {weatherData.location.localtime}</Text>
               {clothingSuggestions.length > 0 && (
    <View style={styles.clothingSuggestionsContainer}>
      <Text>Clothing Suggestions:</Text>
      {clothingSuggestions.map((suggestion, index) => (
        <Text key={index}>{suggestion}</Text>
      ))}
            </View>
          )}
        </SafeAreaView>
      <Button title="Logout" onPress={handleAuthentication} color="#e74c3c" />
    </View>
  );
};

export default App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); // Track user authentication state
  const [isLogin, setIsLogin] = useState(true);

  const auth = getAuth(app);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  
  const handleAuthentication = async () => {
    try {
      if (user) {
        // If user is already authenticated, log out
        console.log('User logged out successfully!');
        await signOut(auth);
      } else {
        // Sign in or sign up
        if (isLogin) {
          // Sign in
          await signInWithEmailAndPassword(auth, email, password);
          console.log('User signed in successfully!');
        } else {
          // Sign up
          await createUserWithEmailAndPassword(auth, email, password);
          console.log('User created successfully!');
        }
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        // Show user's email if user is authenticated
        <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
      ) : (
        // Show sign-in or sign-up form if user is not authenticated
        <AuthScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          handleAuthentication={handleAuthentication}
        />
      )}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  weatherContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  clothingSuggestionsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
