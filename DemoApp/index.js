/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component, useState, useEffect, useCallback} from 'react';
import {
    AppRegistry,
    Button,
    Platform,
    StyleSheet,
    View,
    NativeModules,
    NativeEventEmitter, 
    TextInput,
    ActivityIndicator,
} from 'react-native';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['new NativeEventEmitter']);

const {JumioMobileSDK} = NativeModules;

const DATACENTER = 'SG'

export const DemoApp = () => {
    const [loading, setLoading] = useState(false);
    const [authorizationToken, setAuthorizationToken] = useState("");

    const startJumio = useCallback((authorizationToken) => {
      setLoading(true);
      
      JumioMobileSDK.initialize(authorizationToken, DATACENTER);
      JumioMobileSDK.start();
    }, []);

    useEffect(() => {
      const emitterJumio = new NativeEventEmitter(JumioMobileSDK);
      const successListener = emitterJumio.addListener(
          'EventResult',
          (EventResult) => { 
            console.warn("EventResult: " + JSON.stringify(EventResult));
            setLoading(false);
          }
      );
      const errorListener = emitterJumio.addListener(
          'EventError',
          (EventError) => {
            console.warn("EventError: " + JSON.stringify(EventError))
            setLoading(false);
          }
      );

      return () => {
        successListener.remove();
        errorListener.remove();
      }
    }, []);

    return (
      <View style={styles.container}>
        {
          loading 
          ? (<ActivityIndicator size="large" />) 
          : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Authorization token"
                placeholderTextColor="#000"
                returnKeyType="done"
                onChangeText={text => setAuthorizationToken(text)}
                value={authorizationToken}
              />
              <Button
                title="Start"
                onPress={() => startJumio(authorizationToken)}
              /> 
            </>
          )
        }
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    input: {
        width: 240,
        height: 40,
        marginBottom: 20,
        borderWidth: 1,
        color: 'black'
    },
});

AppRegistry.registerComponent('DemoApp', () => DemoApp);