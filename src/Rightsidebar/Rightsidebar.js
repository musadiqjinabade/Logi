import React, { Component } from 'react';
import { View, Text, SafeAreaView, Alert } from "react-native";
import {  List, ListItem} from 'native-base';
import svgImages from '../Images/images';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';



class Rightsidebar extends Component {
    constructor(props){
        super(props)
        this.state={
            username:'',
            last_name:'',
            email:''
        }
    }

    async componentDidMount(){
        var token = await AsyncStorage.getItem('loginData');
        if (token) {
            token = JSON.parse(token);
        }
        var jwtDecode = require('jwt-decode');
        var decoded = jwtDecode(token.token);
        console.log('DRawer user',decoded)
        this.setState({username:decoded.first_name, last_name:decoded.last_name, email: decoded.email})
    }

    logoutAlert(){
        Alert.alert(
            'Log out',
            'You will be returned to the login screen.',
            [
              {text: 'YES', onPress: () => this.logout()},
              {text: 'NO', onPress: () => console.warn('NO Pressed'), style: 'cancel'}
            ]
          );    
    }

    logout = async () => {
        console.log("logout working")
        this.setState({ loading: true });
        await AsyncStorage.setItem('AllLocation','')
        await AsyncStorage.setItem('SelectedLocation','')
        console.log("in logout");
        try {
            var auth_tokens = await AsyncStorage.getItem('loginData');
            console.log("before remove:", auth_tokens);
            await AsyncStorage.removeItem('loginData');
            var token = await AsyncStorage.getItem('loginData');
            console.log("before remove:", auth_tokens);
            if (token == null) {
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Login' })],
                });
                this.props.navigation.dispatch(resetAction);
            }
            this.setState({ loading: false });
            return true;
        }
        catch (exception) {
            this.setState({ loading: false });
            return false;
        }
    }

    render(){
        return(
            <SafeAreaView style={{flex:1}}>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#1D3567', '#1C6DAE']} >
                <View style={{height:150, alignItems:'center', justifyContent:'center', marginTop:hp('5%'), margin:hp('5%')}}>
                <SvgUri width="120" height="120" fill={'#fff'} svgXmlData={svgImages.user} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: wp('2%') }} />
                <Text style={{justifyContent: 'center', alignItems: 'center',color: '#ffff',
                                fontFamily: 'Montserrat-Regular'}}>{this.state.username?this.state.username +" "+this.state.last_name:this.state.email}</Text>
                </View>
                </LinearGradient>
                <ScrollView>
                    <List>
                        {/* <ListItem onPress={()=>this.props.navigation.navigate('Dashboard')} >
                            <Text style={{
                                color: '#000000',
                                fontFamily: 'Montserrat-Regular',
                            }}>Home</Text>
                        </ListItem> */}
                        <ListItem onPress={()=>this.props.navigation.navigate('Profile')} style={{flexDirection:'row'}}>
                            <SvgUri width="20" height="20" fill={'#1D3567'} svgXmlData={svgImages.user} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: wp('2%') }} />
                            <Text style={{
                                color: '#000000',
                                fontFamily: 'Montserrat-Regular',
                            }}>Profile</Text>
                        </ListItem>
                    </List>
                    <List>
                        <ListItem onPress={()=> { this.logoutAlert()}} style={{flexDirection:'row'}}>
                        <SvgUri width="20" height="20" fill={'#1D3567'} svgXmlData={svgImages.logout} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: wp('2%') }} />
                            <Text style={{
                                color: '#000000',
                                fontFamily: 'Montserrat-Regular',
                            }}>Logout</Text>
                        </ListItem>
                    </List>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

export default Rightsidebar;