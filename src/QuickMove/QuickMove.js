import React, { Component } from 'react';
import { Text, View, ToastAndroid, StatusBar, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, AsyncStorage } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import { Container } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import Headers from '../component/Headers';
import color from '../component/color';
import APIService from '../component/APIServices';
import SearchableDropdown from '../Assign/All/searchablebleDropdown';
import NetInfo from "@react-native-community/netinfo";

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
});
class QuickMove extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            expanded: true,
            locationId: '',
            loading: true,
            locationData: '',
            fromLocationID: '',
            fromLocationName: '',
            toLocationID: '',
            toLocationName: '',
            isModalVisible: false,
            clickedLocation: '',
            startJobLoading: false
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

    async componentDidMount() {
        if (await this.checkInternet()) {
            var getlocation = await AsyncStorage.getItem('SelectedLocation').then((value) => {
                var location = JSON.parse(value);

                console.log("location : ", location)
                this.setState({
                    locationId: location.value ? location.value : location.id
                }, () => { this.getLocation() })
            });
        }
        else {
            ToastAndroid.show('No Internet Connectivity!', ToastAndroid.LONG, 25, 50);
            this.props.navigation.goback();
        }
    }

    async getLocation() {
        var response = await APIService.execute('GET', APIService.URLBACKEND + APIService.getSubLocationList + '?parent_location_id=' + this.state.locationId, null)
        console.log("response : ", response)
        // this.setState({ loading: false, locationData: response.data.data })
        if (this.state.clickedLocation === "To" &&  response.data.data.length > 0) {
            var data = []
            for (let i = 0; i < response.data.data.length; i++) {
                if (response.data.data[i].id !== this.state.fromLocationID) {
                    data.push(response.data.data[i])
                }
            }
            this.setState({ loading: false,locationData: data })
        }
        else {
            this.setState({ loading: false, locationData: response.data.data })
        }
    }

    toggleModal = (location) => {
        this.setState({ locationData:'',clickedLocation: location, isModalVisible: !this.state.isModalVisible },()=>{
            this.getLocation()
        });
    };


    componentWillUnmount() {

    }

    startMoving = async () => {
        console.log("from id : ", this.state.fromLocationID, "to id : ", this.state.toLocationID)
        if (this.state.fromLocationID === '') {
            ToastAndroid.show('Please Select From Location', ToastAndroid.LONG, 25, 50);
        }
        else if (this.state.toLocationID === '') {
            ToastAndroid.show('Please Select To Location', ToastAndroid.LONG, 25, 50);
        }
        else if (this.state.toLocationID === this.state.fromLocationID) {
            ToastAndroid.show('From and To Locations Cannot be same', ToastAndroid.LONG, 25, 50);
        }
        else {
            this.setState({ startJobLoading: true })
            var body = {}
            body.parent_location_id = this.state.locationId
            body.location_id = this.state.fromLocationID
            body.location_to = this.state.toLocationID
            body.document_type = 0
            body.stock_details = ""

            var response = await APIService.execute('POST', APIService.URLBACKEND + APIService.startQuickMoveJob, body)
            if (response.data.status_code === 200) {
                this.setState({ startJobLoading: false })
                ToastAndroid.show(response.data.message, ToastAndroid.LONG, 25, 50);
                var item = {}
                item.fromLocationID = this.state.fromLocationID
                item.toLocationID = this.state.toLocationID
                item.jobid = response.data.data.quickmove_id
                this.props.navigation.navigate('QuickMoveScanningScreen', { item: item })
            }
            else {
                this.setState({ startJobLoading: false })
                ToastAndroid.show(response.data.message, ToastAndroid.LONG, 25, 50);
            }

        }
    }

    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Headers isHome={false} label={'Quick Move'} onBack={() => { this.props.navigation.goBack() || this.props.navigation.dispatch(resetAction) }} expanded={this.state.expanded} />
                    <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                    <View style={styles.overlay}>
                        <ActivityIndicator size={'large'} color='#1D3567' />
                    </View>
                </View>
            )
        }
        else {
            return (
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Headers isHome={false} label={'Quick Move'} onBack={() => { this.props.navigation.goBack() ||  this.props.navigation.dispatch(resetAction) }} expanded={this.state.expanded} />
                    <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                    <ScrollView>
                        <View style={{ flex: 1, flexDirection: 'column', padding: wp('2%') }}>
                            <View style={{ marginTop: hp('2%'), height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                <Text style={styles.productsdisable}>From Location</Text>
                            </View>
                            <TouchableOpacity style={styles.selectBackgroundStyle} onPress={() => { this.state.locationData.length > 0 ? this.toggleModal("From") : ToastAndroid.show("No Sublocation Data Found", ToastAndroid.LONG, 25, 50); }}>
                                <Text style={styles.selectproducts}>{this.state.fromLocationName || "Select from location"}</Text>
                                <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />

                            </TouchableOpacity>

                            <View style={{ marginTop: hp('1%'), height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                <Text style={styles.productsdisable}>To Location</Text>
                            </View>
                            <TouchableOpacity style={styles.selectBackgroundStyle} onPress={() => { this.state.locationData.length > 0 ? this.toggleModal("To") : ToastAndroid.show("No Sublocation Data Found", ToastAndroid.LONG, 25, 50); }}>
                                <Text style={styles.selectproducts}>{this.state.toLocationName || "Select to location"}</Text>
                                <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />

                            </TouchableOpacity>


                        </View>
                    </ScrollView>
                    <View style={{
                        flex: 1, position: 'absolute',
                        bottom: 0,
                    }}>
                        <TouchableOpacity onPress={async () => { this.startMoving() }}>
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
                                    this.state.startJobLoading === true ? (
                                        <View style={{ height: hp('8%'), justifyContent: 'center', alignItems: 'center', flexDirection: 'row', flex: 1 }}>
                                            <View style={{ paddingRight: wp('5%'), backgroundColor: 'transparent' }}>
                                                <ActivityIndicator size={'small'} color='#FFFFFF' />
                                            </View>
                                            <View style={{ backgroundColor: 'transparent' }}>
                                                <Text style={styles.buttonStart}>Starting Job...</Text>
                                            </View>
                                        </View>
                                    ) :
                                        <View style={{ height: hp('8%'), justifyContent: 'center', alignSelf: 'center' }}>
                                            <Text style={styles.buttonStart}>Start</Text>
                                        </View>
                                }

                            </LinearGradient>
                        </TouchableOpacity>

                    </View>
                    {this.state.locationData && this.state.locationData.length > 0 ? (
                        <SearchableDropdown
                            title={'Select Products'}
                            data={this.state.locationData}
                            onSelect={(selectedItem) => {
                                this.state.clickedLocation === "From" ?
                                    this.setState({ fromLocationID: selectedItem.id, fromLocationName: selectedItem.itemName, isModalVisible: false }) :
                                    this.setState({ toLocationID: selectedItem.id, toLocationName: selectedItem.itemName, isModalVisible: false })
                            }}
                            onCancel={() => { this.setState({ isModalVisible: false }) }}
                            isVisible={this.state.isModalVisible === true} />) : null}
                </View>

            )
        }


    }
}

export default withNavigation(QuickMove);

var styles = StyleSheet.create({
    line: {
        marginTop: hp('1%'),
        marginBottom: hp('1%'),
        borderBottomColor: '#828EA5',
        borderBottomWidth: 0.7,
    },
    linearGradient: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F3FD',
    },
    selectproducts: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: wp('2%'),
        color: '#636363'
    },
    buttonStart: {
        fontSize: wp('5%'),
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    productsdisable: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    selectBackgroundStyle: {
        width: wp('94%'),
        height: wp('11%'),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowColor: '#CECECE',
        shadowRadius: 3,
        elevation: 4,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('5%'),
    },
    overlay: {
        // height: hp('100%'),
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
    },
});
