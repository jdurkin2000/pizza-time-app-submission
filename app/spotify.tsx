import React, { useState, useEffect } from "react";
import { Image } from "expo-image";
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { Button, StyleSheet } from 'react-native';
import { View, Text } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

var access_token: string | null;
const client_id = "cde97afacbc7489c84dff34ca6046c04";
//const client_id = "283e3f041e8e4276af5658973609920b";
const client_secret = "9d3c3ef7c4744addb0a0e2c23a94ef07";
//const client_secret = "7d2bd25dc23a499ebb4c1b1d35216151";
const REDIRECT_URI = "http://localhost:8081";
const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user-read-private%20user-read-email`;

const pizza_icon = require('@/assets/images/pizza_icon.png');

export default function Spotify() {
  const [views, setViews] = useState(new Array(9).fill(pizza_icon));
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: client_id,
      scopes: ["user-read-email", "user-read-private", "user-top-read", "streaming"],
      usePKCE: false,
      redirectUri: REDIRECT_URI,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      console.log("Auth Code" + code);

      getToken(code).then((token) => {
        console.log("Token: " + token);
        access_token = token;
        getTopTracksStr().then(pics => {
          if (pics && pics.length > 0) {
            const newViews = [...views];
            for (let k = 0; k < 9; k++) {
              console.log(pics[k]);
              newViews[k] = { uri: pics[k].url };
              console.log(newViews[k]);
            }
            setViews(newViews);
          }
        });
      });
    }
  }, [response]);

  let gallery = createGallery(views);

  return (
    <View>
      <Button
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync();
        }}
      />
      <View style={img_styles.gallery}>
        {gallery}
      </View>
    </View>
  );
}

const img_styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
  image_gallery: {
    width: 200,
    height: 200,
  },
  gallery: {
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexWrap: "wrap",
  },
});

function createGallery(views) {
  return views.map((view, index) => (
    <Image key={index} source={view} style={img_styles.image_gallery} />
  ));
}

async function fetchWebApi(endpoint: string, method: string, body?: any) {
  if (!access_token) {
    throw new Error("No token provided");
  }
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    method,
    body: JSON.stringify(body),
  });
  return await res.json();
}

async function getTopTracks() {
  if (!access_token) {
    throw new Error("No token provided");
  }
  return (await fetchWebApi("v1/me/top/tracks?time_range=long_term&limit=9", "GET")).items;
}

async function getTopTracksStr() {
  const topTracks = await getTopTracks();
  console.log(
    topTracks?.map(
      ({ name, artists }: { name: string; artists: { name: string }[] }) =>
        `${name} by ${artists.map((artist) => artist.name).join(", ")}`
    )
  );
  console.log(getTrackImg(topTracks[0].id));

  return topTracks.map(track => track.album.images[0]);
}

async function getToken(code: string): Promise<string> {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Authorization": "Basic " + btoa(client_id + ":" + client_secret),
        "Content-type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=authorization_code&code=" + code + "&redirect_uri=" + REDIRECT_URI,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    const token = data.access_token;
    return token;
  } catch (error) {
    console.log(error);
    return "";
  }
}

async function getTrackImg(trackId: string) {
  return fetchWebApi(`v1/tracks/${trackId}`, "GET").then((track) => track.album.images[0].url);
}

function getWebPlayer(url: string) {
  let isMounted = true;
  const script = document.createElement('script');
  script.src = url;
  script.async = true;
  document.body.appendChild(script);

  script.onload = () => {
    if (isMounted && window.Spotify) {
      const player = new window.Spotify.Player({
        name: 'Web Playback SDK Quick Start Player',
        getOAuthToken: (cb: (arg0: string) => void) => { if (access_token) cb(access_token); }, // Replace with your access token
        volume: 0.5,
      });

      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Ready with Device ID', device_id);
      });

      player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.connect();
    }
  };
  return () => {
    isMounted = false;
    //document.body.removeChild(script);
  };
}
