import React, { Component } from 'react';
import { Text, View,StatusBar, StyleSheet,ToastAndroid, Dimensions, ActivityIndicator } from 'react-native';
import { withNavigation, StackActions, NavigationActions } from 'react-navigation';
import {  Container} from 'native-base';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import AsyncStorage from '@react-native-community/async-storage';
import Headers from '../component/Headers'




const mockData = [
    { id: 1, name: 'React Native Developer' }, // set default checked for render option item
    { id: 2, name: 'Android Developer' },
    { id: 3, name: 'iOS Developer' },
    { id: 4, name: 'React Native Developer' }, // set default checked for render option item
    { id: 5, name: 'Android Developer' },
    { id: 6, name: 'iOS Developer' },
    { id: 12, name: 'React Native Developer' }, // set default checked for render option item
    { id: 22, name: 'Android Developer' },
    { id: 32, name: 'iOS Developer' },
    { id: 142, name: 'React Native Developer' }, // set default checked for render option item
    { id: 23, name: 'Android Developer' },
    { id: 34, name: 'iOS Developer' }
];

class Profile extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            phoneNum: '',
            email: '',
            data: '',
            locationName: '',
            expanded:true
        }
    }

    async componentDidMount() {
        await AsyncStorage.getItem('SelectedLocation').then((value) => {
            console.log('v', typeof (value));
            var location = JSON.parse(value);
            console.log('location id and name', location);
            this.setState({
                loading: true,
                locationName: location.itemName ? location.itemName : location.label
            }, () => console.log('values', this.state.locationName))
        });

        var token = await AsyncStorage.getItem('loginData');
        if (token) {
            token = JSON.parse(token);
        }
        var jwtDecode = require('jwt-decode');
        this.decoded = jwtDecode(token.token);
        const url = "https://logi-smart-backend-test.herokuapp.com/v1/users/userdetails";
        fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + (token.token),
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                return response.json()
            })
            .then((responseJson) => {
                console.log('response:', responseJson.data[0])
                if (responseJson.data[0].mobile) {
                    this.formatmobile(responseJson.data[0].mobile);
                }
                this.setState({
                    data: responseJson.data[0],
                    loading: false,
                    focus: false
                })
            })
            .catch(error => {
                ToastAndroid.show(error, ToastAndroid.LONG, 25, 50);
                this.setState({ loading: false, focus: false });
            })

    }

    async formatmobile(mobile) {
        var cleaned = ('' + mobile).replace(/\D/g, '')
        var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
        if (match) {
            var intlCode = (match[1] ? '+1 ' : ''),
                number = [intlCode, match[2], '-', match[3], '-', match[4]].join('');

            console.log('number:', number)

            this.setState({
                phoneNum: number
            });

            return;
        }

        this.setState({
            phoneNum: text
        });
    }

    logout = async () => {
        this.setState({ loading: true });
        await AsyncStorage.multiRemove(['AllLocation'])
        await AsyncStorage.multiRemove(['SelectedLocation'])
        console.log("in logout");
        try {
            var auth_token = await AsyncStorage.getItem('loginData');
            console.log("before remove:", auth_token);
            await AsyncStorage.removeItem('loginData');
            var auth_tokens = await AsyncStorage.getItem('loginData');
            console.log("after remove:", auth_tokens);
            if (auth_tokens == null) {
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

    renderModalContent = () => {
        if (this.state.loading) {
            return (
                <View style={styles.overlay}>
                    <ActivityIndicator color="#1D3567" size="large" />
                    {/* <Text style={{ marginTop: 20, fontSize: 14, fontWeight: 'bold', color: '#fff' }}>{this.state.progressText}</Text> */}
                </View>
            );
        }
        else {
            return null;
        }
    }

    render() {
        return (
            <Container>
                <Headers  label={"Profile"} onBack={() => { this.props.navigation.goBack()}}  expanded={this.state.expanded} logout={()=>{ this.logout()}} />
                
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ height: widthPercentageToDP('23%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', margin: widthPercentageToDP('8%'), marginLeft: widthPercentageToDP('5%') }}>
                            <SvgUri width="90" height="90" svgXmlData={svgImages.user} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%'), marginLeft: widthPercentageToDP('1%') }} />
                            <View style={{ flexDirection: 'column', height: widthPercentageToDP('23%'), justifyContent: 'center', alignItems: 'flex-start', margin: widthPercentageToDP('2%'), marginLeft: widthPercentageToDP('4%') }}>
                                <Text style={{ justifyContent: 'flex-start', alignItems: 'center', fontFamily: 'Montserrat-Bold', fontSize: 18 }}>{this.state.data.first_name ? this.state.data.first_name + ' ' + this.state.data.last_name : " "}</Text>
                                {/* <Text style={{justifyContent: 'flex-start', alignItems: 'center', fontFamily:'Montserrat-Regular'}}>ABC. Enterprises LTD,Pune</Text> */}
                            </View>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', margin: widthPercentageToDP('8%'), marginLeft: widthPercentageToDP('7%') }}>
                            <Text style={{ justifyContent: 'flex-start', alignItems: 'flex-start', fontFamily: 'Montserrat-Regular', fontSize: 18 }}>Profile Details</Text>
                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('8%') }}>
                                <Text style={styles.products}>{'phone number'.toUpperCase()}</Text>
                            </View>
                            <View style={{
                                width: widthPercentageToDP('85%'),
                                height: widthPercentageToDP('11%'),
                                marginRight: widthPercentageToDP('10%'),
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column'
                            }}>
                                <Text style={{ justifyContent: 'flex-start', alignItems: 'flex-start', fontFamily: 'Montserrat-Regular', fontSize: 15 }}>{this.state.data.phone_code!=null? this.state.data.phone_code +  this.state.phoneNum :  this.state.data.mobile_no_code +  this.state.phoneNum}</Text>
                                {/* <View style={{width: widthPercentageToDP('85%'),
                                height: widthPercentageToDP('1%'),marginTop: widthPercentageToDP('2%'),borderBottomWidth: 1,}} /> */}
                            </View>

                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('5%') }}>
                                <Text style={styles.products}>{'email id'.toUpperCase()}</Text>
                            </View>
                            <View style={{
                                width: widthPercentageToDP('85%'),
                                height: widthPercentageToDP('11%'),
                                marginRight: widthPercentageToDP('10%'),
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('1%'),
                            }}>
                                <Text style={{ justifyContent: 'flex-start', alignItems: 'flex-start', fontFamily: 'Montserrat-Regular', fontSize: 15 }}>{this.state.data.email || " "}</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('5%') }}>
                                <Text style={styles.products}>{'Location'.toUpperCase()}</Text>
                            </View>
                            <View style={{
                                width: widthPercentageToDP('85%'),
                                height: widthPercentageToDP('11%'),
                                marginRight: widthPercentageToDP('10%'),
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('1%'),
                            }}>
                                <Text style={styles.products}>{this.state.locationName}</Text>
                                {/* <FlatList
                                data={this.state.data.location_name}
                                renderItem={({ item }) => (
                                <Text style={{justifyContent: 'flex-start', alignItems: 'flex-start', fontFamily:'Montserrat-Regular', fontSize:15}}>{this.state.data.location_name.length<1?item+', ':item || " "}</Text>
                                )}
                                /> */}
                            </View>
                        </View>
                    </ScrollView>
                </View>
                {this.renderModalContent()}
            </Container>
        )
    }
}

export default withNavigation(Profile);

var styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    overlay: {
        height: Platform.OS === "android" ? Dimensions.get("window").height : null,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
    },
    products: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        fontSize: 10,
    },
    batchstyle: {
        paddingLeft: 6,
        flexDirection: 'row',
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: widthPercentageToDP('75%'),
        height: widthPercentageToDP('11%'),
        color: '#000000',
        fontSize: 14,
    },
});