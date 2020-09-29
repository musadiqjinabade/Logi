import React, { Component } from 'react';
import { Text, View, StatusBar, StyleSheet, TouchableOpacity, ActivityIndicator, AsyncStorage, ToastAndroid, Alert } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import Headers from '../component/Headers';
import color from '../component/color'
import NetInfo from "@react-native-community/netinfo";
import APIService from '../component/APIServices';
import Modal from 'react-native-modalbox';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
});
class StockCount extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            expanded: true,
            locationId: '',
            locationName: '',
            message: ''
        }

    }

    async componentDidMount() {
        if (await this.checkInternet()) {
            await AsyncStorage.getItem('SelectedLocation').then((value) => {
                var location = JSON.parse(value);
                this.setState({
                    locationId: location.id ? location.id : location.value,
                    locationName: location.itemName ? location.itemName : location.label
                })
            });
        }
        else {
            ToastAndroid.show('No Internet Connectivity!', ToastAndroid.LONG, 25, 50);
            this.props.navigation.goback();
        }
    }

    checkInternet = () => {
        return new Promise((resolve, reject) => {
            NetInfo.fetch().then(state => {
                //console.log("Connection type", state.type);
                if (state.isConnected) {
                    resolve(true);
                }
                else {
                    resolve(false);
                }
            });
        })

    }

    async checkJobStatus() {
        // this.props.navigation.navigate('StockCountScanningScreen')
        this.setState({ startJobLoading: true })
        var body = {}
        body.location_id = this.state.locationId

        var response = await APIService.execute('POST', APIService.URLBACKEND + APIService.stockCountAvailability, body)
        console.log("response : ", response.data)
        if (response.data.status_code === 200) {
            this.setState({ startJobLoading: false })
            this.startJob();
        }
        else {
            this.setState({ startJobLoading: false, message: response.data.message })
            this.refs.modal6.open()
        }
    }

    async startJob() {
        this.setState({ startJobLoading: true })
        var body = {}
        body.location_id = this.state.locationId

        var response = await APIService.execute('POST', APIService.URLBACKEND + APIService.startStockCountJob, body)
        console.log("response : ", response.data)
        if (response.data.status_code === 200) {
            this.setState({ startJobLoading: false })
            ToastAndroid.show(response.data.message, ToastAndroid.LONG, 25, 50);
            var item = {}
            item.jobid = response.data.stock_count_job_id
            this.props.navigation.navigate('StockCountScanningScreen', { item: item })
        }
        else {
            ToastAndroid.show(response.data.message, ToastAndroid.LONG, 25, 50);
        }
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <Headers isHome={false} label={'Stock Count'} onBack={() => {this.props.navigation.goBack() ||  this.props.navigation.dispatch(resetAction) }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <ScrollView>
                    <View style={{ flex: 1, flexDirection: 'column', padding: wp('2%') }}>
                        <Text style={{ marginTop: hp('10%'), fontFamily: 'Montserrat-Bold', justifyContent: 'center', textAlign: 'center', fontSize: hp('2.7%'), color: color.gradientStartColor }}>{this.state.locationName}</Text>
                        <View style={{ justifyContent: 'center', }}>
                            <TouchableOpacity onPress={() => { 
                                Alert.alert(
                                    'Alert !',
                                    'Please first select sub location and start scanning your items.',
                                    [
                                        { text: 'Ok', onPress: () => this.checkJobStatus() },
                                        { text: 'No', onPress: () => console.log('No button clicked'), style: 'cancel' },
                                    ],
                                    {
                                        cancelable: true
                                    }
                                );
                                 }} style={styles.cardStyle}>
                                <SvgUri width="80" height="80" svgXmlData={svgImages.linkboxes} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', margin: wp('2%') }} />
                                <Text style={{ marginTop: hp('1%'), fontFamily: 'Montserrat-Regular', justifyContent: 'center', textAlign: 'center', fontSize: hp('2.3%'), color: '#8A8A8A' }}>Scan each item for the stock count</Text>
                            </TouchableOpacity>
                        </View>
                        {
                            this.state.startJobLoading ?

                                <View style={styles.overlay}>
                                    <ActivityIndicator color="#1D3567" size="large" />
                                    <Text style={{ marginTop: 20, fontSize: 14, fontWeight: 'bold', color: '#1D3567' }}>{this.state.progressText}</Text>
                                </View>
                                : null
                        }


                    </View>
                </ScrollView>

                <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"modal6"} swipeArea={20}
                    backdropPressToClose={true}  >
                    <ScrollView>
                        <View style={{ /*height: wp('65%'),*/ width: wp('65%'), justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10 }} >
                            <SvgUri width="55" height="55" svgXmlData={svgImages.checkmark} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', marginTop: wp('4%') }} />
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', padding: 5 }}>
                                <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 16, color: '#1D3567' }}>Confirmation</Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignSelf: 'center', flex: 1 }}>
                                <Text style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567', textAlign: 'center' }}>{this.state.message}</Text>
                            </View>
                            <View style={{ justifyContent: 'space-between', alignSelf: 'center', flex: 1, flexDirection: 'row', marginBottom: wp('2%') }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.startJob()
                                        this.refs.modal6.close()
                                    }}
                                    style={{
                                        width: wp('26%'), height: wp('12%'), shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        margin: wp('2%'),
                                        shadowRadius: 3, justifyContent: 'center', alignSelf: 'center',
                                        borderRadius: 5,
                                        flexDirection: 'column',
                                        elevation: 4,
                                        backgroundColor: '#6AC259',
                                    }}>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#FFFFFF', textAlign: 'center' }}>Yes</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.refs.modal6.close()}
                                    style={{
                                        width: wp('26%'), height: wp('12%'), shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        margin: wp('2%'),
                                        shadowRadius: 3, justifyContent: 'center', alignSelf: 'center',
                                        borderRadius: 5,
                                        flexDirection: 'column',
                                        elevation: 4,
                                        backgroundColor: '#FFFFFF',
                                    }}
                                >
                                    <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#1D3567', textAlign: 'center' }}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
            </View>

        )

    }
}

export default withNavigation(StockCount);

var styles = StyleSheet.create({
    cardStyle: {
        marginTop: hp('10%'),
        marginBottom: hp('2%'),
        flexDirection: 'column',
        width: wp('94%'),
        height: wp('40%'),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowColor: '#CECECE',
        shadowRadius: 1,
        elevation: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    buttonStart: {
        fontSize: hp('2.5%'),
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    modal1: {
        maxHeight: 260,
        minHeight: 80
    },
});