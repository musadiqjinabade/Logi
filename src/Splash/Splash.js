import React, { Component } from 'react';
import { View,StatusBar, StyleSheet, Image,Dimensions, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import Login from "../Login/Login";
import Dashboard from '../Dashboard/Dashboard';
import AsyncStorage from '@react-native-community/async-storage';
// import Internet from '../component/Internet'
import NetInfo from "@react-native-community/netinfo";
import * as Animatable from 'react-native-animatable';



class Splash extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = { isLoading: true, auth_token:null,
            isConnected: true,
            connection_Status: true,
            retryload: false,
            refreshing: false, }

    }

    async componentDidMount() {
        console.disableYellowBox = true;

        NetInfo.isConnected.addEventListener('connectionChange', (isConnected) => {
            if (isConnected) {
              this.setState({ isConnected: isConnected }, async () => {
                try {
                  let req = await fetch('https://www.google.com');
                  let hasConnection = req.status === 200;
                  if (hasConnection) {
                    this.setState({ connection_Status: hasConnection, retryload: false })
                  } else {
                    this.setState({ connection_Status: false, retryload: false, loading: false })
                  }
                }
                catch (error) { this.setState({ connection_Status: false, retryload: false, loading: false }) }
              });
            } else { this.setState({ connection_Status: false, retryload: false, loading: false }) }
        });

        this.setState({ loginloading: true },async()=>{
            var logintoken = await AsyncStorage.getItem('loginData');
            if (logintoken) {
                logintoken = JSON.parse(logintoken);
                this.setState({ auth_token: logintoken.token, loading: false , loginloading: false })
            } else {
                this.setState({ loading: false , loginloading: false });
            }      
        });
        const data = await this.performTimeConsumingTask();

        if (data !== null) {
            this.setState({ isLoading: false });
        }
    }

    performTimeConsumingTask = async () => {
        return new Promise((resolve) =>
            setTimeout(
                () => { resolve('result') },
                2500
            )
        );
    }

    renderloader = () => {
        if (this.state.loginloading ) {
            return (
                <View style={styles.overlay}>
                    <ActivityIndicator color="#FFFFFF" size="large" />
                    {/* <Text style={{ marginTop: 20, fontSize: 14, fontWeight: 'bold', color: '#1D3567' }}>{this.state.progressText}</Text> */}
                </View>
            );
        }
        else {
            return null;
        }
    }


    render() {
        // if(this.st)
        if (this.state.isLoading) {
            return (
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#1D3567', '#1C6DAE']} style={styles.linearGradient}>
                    <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent"  translucent={true} />
                    <Animatable.View  animation="bounceIn"
                        duration={4100} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../Images/logo.png')} style={{ height: 160, width: 160, resizeMode: 'contain' }} />
                    </Animatable.View>
                    {/* {this.renderloader()} */}
                </LinearGradient>
            )

        } else if(this.state.auth_token){
            return (
                <Dashboard />
            )
        } else if(this.state.auth_token == null) {
            return (
                <Login />
            )
        }

    }
}

export default withNavigation(Splash);

var styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Gill Sans',
        textAlign: 'center',
        margin: 10,
        color: '#ffffff',
        backgroundColor: 'transparent',
    },
    overlay: {
        height: Platform.OS === "android" ? Dimensions.get("window").height : null,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
        }
});
