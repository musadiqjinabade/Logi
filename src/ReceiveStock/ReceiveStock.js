import React, { Component } from 'react';
import { Text, View, StatusBar, StyleSheet, TouchableOpacity, AsyncStorage, ToastAndroid, ActivityIndicator, BackHandler, Alert } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import { Container } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import APIService from '../component/APIServices';
import Headers from '../component/Headers';
import color from '../component/color';



const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
});

class ReceiveStock extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            locationId: null,
            locationName: '',
            expanded: true
        }

    }

    async componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', async () => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
            await AsyncStorage.getItem('SelectedLocation').then((value) => {
                console.log('v', typeof (value));
                var location = JSON.parse(value);
                console.log('location id and name', location);
                this.setState({
                    locationId: location.id ? location.id : location.value,
                    locationName: location.itemName ? location.itemName : location.label
                }, () => console.log('values', this.state.locationId, this.state.locationName))
            });
        })
    }

    handleBackPress() {
        this.navigateBack();
        return true;
    }

    async navigateBack() {
        this.props.navigation.dispatch(resetAction)
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    async startstock() {
        this.setState({ loading: true })
        var logintoken = await AsyncStorage.getItem('loginData');
        if (logintoken) {
            logintoken = JSON.parse(logintoken);
            var jwtDecode = require('jwt-decode');
            var decoded = jwtDecode(logintoken.token);
            console.log("decoded data:", decoded)
        }
        var data = {}
        data.location_id = this.state.locationId
        data.location_name = this.state.locationName
        var startrecive = await APIService.execute('POST', APIService.URLBACKEND + 'stockTransfer/startrecievejob', data)
        console.log("startrecive", startrecive)
        if (startrecive.data.status_code == "200") {
            this.props.navigation.navigate('ReceiveScanStock', { item: startrecive.data.data })
            this.setState({ loading: false })
        } else {
            this.setState({ loading: false })
            ToastAndroid.show(startrecive.data.data.message, ToastAndroid.LONG, 25, 50);
        }
    }

    render() {

        return (
            <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                <Headers isHome={true} onBackHome={() => {this.props.navigation.goBack() || this.props.navigation.dispatch(resetAction) }} label={"Receive Stock"} onBack={() => { this.props.navigation.goBack() || this.props.navigation.dispatch(resetAction) }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1, width: wp('100%'), flexDirection: 'column', paddingLeft: 10, paddingRight: 10, paddingBottom: 10, paddingTop: 5, marginBottom: 50, marginTop: wp('2%'), justifyContent: 'flex-start', alignItems: 'center' }}>
                            <View
                                style={{
                                    flex: 1,
                                    marginBottom: wp('4%'),
                                    paddingTop: wp('2%'),
                                    paddingBottom: wp('2%'),
                                    flexDirection: 'column',
                                    justifyContent: 'flex-start', alignItems: 'center'
                                }} >
                                <SvgUri width="120" height="120" svgXmlData={svgImages.delivery_man} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', margin: wp('2%') }} />
                                <View style={{ flex: 1, marginTop: wp('5%'), margin: wp('2%') }}>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 16 }}>Start receiving the consignment</Text>
                                </View>
                                <View style={{ flex: 1, marginTop: wp('5%'), margin: wp('2%') }}>
                                    <Text style={{ fontFamily: 'Montserrat-Regular', }}>Click the button to receive the stock</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    {/* <View style={{ justifyContent: 'flex-end', alignSelf: 'center', flexDirection: 'row', marginTop: wp('5%')}}>
                        <TouchableOpacity
                            onPress={() => this.startstock()}
                            style={{
                                width: wp('100%'), height: wp('14%'), shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                // margin: wp('2%'),
                                shadowRadius: 3, justifyContent: 'center', alignSelf: 'center',
                                borderTopLeftRadius: wp('2.5%'),
                                borderTopRightRadius: wp('2.5%'),
                                flexDirection: 'column',
                                elevation: 4,
                            }} >
                            <LinearGradient
                                colors={[color.gradientStartColor, color.gradientEndColor]}
                                start={{ x: 0.0, y: 0.25 }} end={{ x: 1.2, y: 1.0 }}
                                style={[styles.center, {
                                    marginTop: hp('1%'),
                                    width: wp('100%'),                                    
                                    height: hp('8%'),
                                    borderWidth: 0.2,
                                    borderTopLeftRadius: wp('2.5%'),
                                    borderTopRightRadius: wp('2.5%'),
                                }]}>
                                {
                                    this.state.loading === true ? (
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <View style={{ paddingRight: 10 }}>
                                                <ActivityIndicator size={'small'} color='#FFFFFF' />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#FFFFFF' }}>Please Wait...</Text>
                                            </View>
                                        </View>
                                    ) : <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#FFFFFF' }}>{'Start'}</Text>
                                        </View>
                                }
                            </LinearGradient>
                        </TouchableOpacity>
                    </View> */}
                    <View style={{
                        flex: 1, position: 'absolute',
                        bottom: 0,
                    }}>
                        <TouchableOpacity onPress={async () => {
                            Alert.alert(
                                'Alert !',
                                'Please first select sub location and start scanning your items.',
                                [
                                    { text: 'Ok', onPress: () => this.startstock() },
                                    { text: 'No', onPress: () => console.log('No button clicked'), style: 'cancel' },
                                ],
                                {
                                    cancelable: true
                                }
                            );
                        }}>
                            <LinearGradient
                                colors={[color.gradientStartColor, color.gradientEndColor]}
                                start={{ x: 0.0, y: 0.25 }} end={{ x: 1.2, y: 1.0 }}
                                style={[styles.center, {
                                    marginTop: hp('1%'),
                                    width: wp('100.1%'),
                                    height: hp('8%'),
                                    borderTopLeftRadius: wp('2.5%'),
                                    borderTopRightRadius: wp('2.5%'),
                                }]}>

                                {
                                    this.state.loading === true ? (
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <View style={{ paddingRight: 10 }}>
                                                <ActivityIndicator size={'small'} color='#FFFFFF' />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#FFFFFF' }}>Please Wait...</Text>
                                            </View>
                                        </View>
                                    ) : <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#FFFFFF' }}>{'Start'}</Text>
                                        </View>
                                }

                            </LinearGradient>
                        </TouchableOpacity>

                    </View>
                </View>
            </Container>

        )

    }
}

export default withNavigation(ReceiveStock);

var styles = StyleSheet.create({

    linearGradient: {
        flex: 1,
        justifyContent: 'center',
        resizeMode: 'contain',
        alignItems: 'center',
        backgroundColor: '#F1F3FD',
        paddingTop: wp('20%')
    },
    cardRow: {
        flex: 1,
        height: wp('48%'),
        marginBottom: wp('4%'),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    cardStyle: {
        flexDirection: 'column',
        width: wp('94%'),
        height: wp('47%'),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowColor: '#CECECE',
        shadowRadius: 1,
        elevation: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        marginRight: 8,
        marginLeft: 8,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingTop: 20,
        paddingBottom: 20
    },
    fulltextStyle: {
        flex: 1,
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#141312',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginRight: wp('2%'),
        marginBottom: wp('2%'),
        marginLeft: wp('8%')
    },
    textStyle: {
        flex: 1,
        fontFamily: 'Montserrat-Bold',
        fontSize: 14,
        color: '#141312',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: wp('5%'),
        marginRight: wp('2%'),
        marginLeft: wp('8%')
    },
    cardtext: {
        flex: 1,
        flexDirection: 'row',
        width: wp('93%'),
        justifyContent: 'space-between',
        alignItems: 'center'
    }
});