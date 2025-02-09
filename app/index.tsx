
import { Text, View, StyleSheet, Button } from "react-native";

import { TouchableOpacity, Pressable } from "react-native"; 

import { Image } from 'expo-image'

import React from 'react'
import Spotify from './spotify'

import { Stack, Tabs, Link } from 'expo-router';



export default function TestIndex() {



  const pizza_icon = require('@/assets/images/pizza_icon.png');

    return (

      <View style={screen_styles.pageBackground}>
        <View style={screen_styles.container}>
        <Image source={pizza_icon} style={img_styles.image}/>
          <Text style={text_styles.text}>Pizza Time! :3</Text>
        </View>

      <View>
        <Spotify>

        </Spotify>
      </View>
      </View>


    );

  }

  function returnImage() {
    //return <Image source={pizza_icon} style={img_styles.image_gallery}>

    //</Image>
  }

  const text_styles = StyleSheet.create({

    text: {

      color: "#FFF",

      fontSize: 75,

      fontFamily: "Helvetica",

      fontWeight: "bold",

      

    },

    section: {

      flex: 1,

      flexDirection: "row",
      flexWrap: "wrap",
      paddingBlock: 10,
    }

  });

  

  const img_styles = StyleSheet.create({

    image: {
      width: 100,
      height: 100,
    },

    image_gallery: {
      width: 200,
      height: 200,
    }
  });

  

  const screen_styles = StyleSheet.create({

    container: {

      flexDirection: "row",

      display: "flex",

      backgroundColor: "#31363F",

      alignItems: "center",

      justifyContent: "center",

      paddingBlock: 20,

    },

    pageBackground:  {

      flex: 1,

      backgroundColor: "#222831"

    },

    alarmContainer: {

      flex: 1,

      justifyContent: "center",

      alignItems: "center",

      backgroundColor: "#693668",

      margin: 100,

      

    }

  });

  

  const icon_styles = StyleSheet.create({

    createButton: {

      flex: 1,

      justifyContent: "center",

      alignItems: "center",

      backgroundColor: "#FFF",

      margin: 50,

    },

    button: {

      backgroundColor: 'gray',

      borderWidth: 2,

      borderColor: 'gray',

      padding: 20,

      borderRadius: 15,  // Adjust for the rounded corners

      position: 'relative',

      overflow: 'hidden',

    },

    buttonText: {

      color: 'white',

      textAlign: 'center',

      fontSize: 16,

    },

    doubleBorder: {

      position: 'absolute',

      top: -4,

      left: -4,

      right: -4,

      bottom: -4,

      borderWidth: 2,

      borderColor: 'white',  // The second border color

      borderRadius: 15,  // Same as the button to keep it round

    },

  });