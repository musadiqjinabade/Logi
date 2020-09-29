import React, { Component } from 'react';
import { Text, View, StatusBar, StyleSheet, Platform, Image, TouchableOpacity, ToastAndroid, Dimensions, ActivityIndicator, BackHandler } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import { Container } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import Headers from '../component/Headers';
import APIService from '../component/APIServices';
import Modal from 'react-native-modalbox';
import ToggleSwitch from 'toggle-switch-react-native'
import LinearGradient from 'react-native-linear-gradient';
import color from '../component/color';
import SearchableDropdown from './All/searchablebleDropdown';
import AsyncStorage from '@react-native-community/async-storage';


const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
});

class Assign extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            expanded: true,
            locationId: '',
            locationName: '',
            loading: true,
            isOnRMToggleSwitch: false,
            isOnFGToggleSwitch: true,
            selected_location: '',
            Sub_location: [],
            isModalVisible: false
        }
    }


    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', async () => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
            await AsyncStorage.getItem('SelectedLocation').then((value) => {
                // console.log('v', typeof (value));
                var location = JSON.parse(value);
                // console.log('location id and name', location);
                this.setState({
                    selected_location: '',
                    locationId: location.id ? location.id : location.value,
                    locationName: location.itemName ? location.itemName : location.label
                })
            });
            this.setState({loading:true},()=>{
                this.getlocation()
            })

            
        })

    }

    async getlocation(){
            var response = await APIService.execute('GET', APIService.URLBACKEND + APIService.getSubLocationList + '?parent_location_id=' + this.state.locationId, null)
            console.log("reponse location:", response)
            if (response.data.status_code == 200) {
                this.setState({ Sub_location: response.data.data, loading:false }, () => {
                    console.log('Sub_location', this.state.Sub_location)
                    if (this.state.Sub_location.length == 0) {
                        this.setState({ isModalVisible: false })
                        ToastAndroid.show('No Sub-location found. Please contact the administrator', ToastAndroid.LONG, 25, 50)
                    }
                })
            }
            else {
                this.setState({ isModalVisible: false, loading:false })
                ToastAndroid.show('No Sub-location found. Please contact the administrator', ToastAndroid.LONG, 25, 50)
            }
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

    checkAssignment() {
        this.refs.modal6.open()
    }

    async StartJob() {
        this.setState({ loading: true })
        var data = {}
        data.location_id = this.state.locationId
        var start = await APIService.execute('POST', APIService.URLBACKEND + 'assignment/startassignandmapjob', data)
        // var start = await APIService.execute('POST', APIService.URLBACKEND+'assignment/assignall', data)
        if (start.data.status_code == 200) {
            ToastAndroid.show(start.data.message, ToastAndroid.LONG, 25, 50);
            this.props.navigation.navigate('Scanassign', { item: start.data.data.data.job_id })
            this.setState({ loading: false })

        }
        else if (start.data.status_code == 400) {
            ToastAndroid.show(start.data.message, ToastAndroid.LONG, 25, 50);
            this.setState({ loading: false })

        }
        this.setState({ loading: false })

    }

    renderModalContent = () => {
        if (this.state.loading || this.state.isModalVisible) {
            return (
                <View style={styles.overlay}>
                    <ActivityIndicator color="#1D3567" size="large" />
                    <Text style={{ marginTop: 20, fontSize: 14, fontWeight: 'bold', color: '#1D3567' }}>{this.state.progressText}</Text>
                </View>
            );
        }
        else {
            return null;
        }
    }

    onToggle(isOn) {
        console.log("Changed to " + this.state.isOnRMToggleSwitch);
        console.log("Changed to FG" + this.state.isOnFGToggleSwitch);

    }

    async CheckFirstLastJob() {
        if (this.state.selected_location) {
            this.refs.modal7.close()
            this.props.navigation.navigate('FirstandLast')
        }
        else {
            ToastAndroid.show('Please Select Sublocation', ToastAndroid.LONG, 25, 50)
        }
    }

    async CheckJob() {
        if (this.state.selected_location || this.state.isOnRMToggleSwitch) {
            await AsyncStorage.setItem('Sublocation', JSON.stringify(this.state.selected_location))
            console.log("Changed to " + this.state.isOnRMToggleSwitch);
            console.log("Changed to FG" + this.state.isOnFGToggleSwitch);
            if (this.state.isOnFGToggleSwitch) {
                this.props.navigation.navigate('All')
                this.refs.modal6.close()
            }
            else {
                this.props.navigation.navigate('RMAssign')
                this.refs.modal6.close()
            }
        }
        else {
            ToastAndroid.show('Please Select Sublocation', ToastAndroid.LONG, 25, 50)

        }
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible }, async () => {
            if(this.state.Sub_location){
                this.setState({isModalVisible:true})
            }
            else{
                var response = await APIService.execute('GET', APIService.URLBACKEND + APIService.getSubLocationList + '?parent_location_id=' + this.state.locationId, null)
                console.log("reponse location:", response)
                if (response.data.status_code == 200) {
                    this.setState({ Sub_location: response.data.data }, () => {
                        console.log('Sub_location', this.state.Sub_location)
                        if (this.state.Sub_location.length == 0) {
                            this.setState({ isModalVisible: false })
                            ToastAndroid.show('No Sub-location found. Please contact the administrator', ToastAndroid.LONG, 25, 50)
                        }
                    })
                }
                else {
                    this.setState({ isModalVisible: false })
                    ToastAndroid.show('No Sub-location found. Please contact the administrator', ToastAndroid.LONG, 25, 50)
                }
            }
        });
    };

    render() {

        return (
            <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                <Headers isHome={true} onBackHome={() => {this.props.navigation.goBack() || this.props.navigation.dispatch(resetAction) }} label={'Assign'} onBack={() => { this.props.navigation.goBack() || this.props.navigation.dispatch(resetAction) }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1, width: wp('100%'), flexDirection: 'column', paddingLeft: 10, paddingRight: 10, paddingBottom: 10, paddingTop: 5, marginBottom: 50, marginTop: wp('2%') }}>
                            <View style={styles.cardRow}>
                                <TouchableOpacity style={styles.cardStyle}
                                    onPress={() => this.checkAssignment()} >
                                    <View style={styles.cardtext}>
                                        <SvgUri width="80" height="50" svgXmlData={svgImages.All} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: wp('2%'), marginLeft: wp('3%') }} />
                                        <SvgUri width="20" height="20" fill="#545A5F" svgXmlData={svgImages.right_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', paddingTop: wp('3%'), paddingRight: wp('4%') }} />
                                    </View>
                                    <Text style={styles.textStyle}>Scan Each Item</Text>
                                    <Text style={styles.fulltextStyle}>Assign information to IDs by scanning each item</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardRow}>
                                <TouchableOpacity style={styles.cardStyle} onPress={() => this.refs.modal7.open()}>
                                    <View style={styles.cardtext}>
                                        <Image source={require('../Images/firstlast.png')} style={{ height: 100, width: 70, resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: wp('2%'), marginLeft: wp('8%') }} />
                                        <SvgUri width="20" height="20" fill="#545A5F" svgXmlData={svgImages.right_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', paddingTop: wp('3%'), paddingRight: wp('4%') }} />
                                    </View>
                                    <Text style={{
                                        fontFamily: 'Montserrat-Bold',
                                        fontSize: 14,
                                        color: '#141312',
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        marginTop: wp('5%'),
                                        marginRight: wp('2%'),
                                        marginLeft: wp('8%')
                                    }}>Scan First and Last Item</Text>
                                    <Text style={styles.fulltextStyle}>Assign information to a range of IDs by scanning first and last item</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </View>
                <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"modal6"} swipeArea={20}
                    backdropPressToClose={true}  >
                    <ScrollView>
                        <View style={{ /*height: wp('65%'),*/ width: wp('90%'), justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10 }} >
                            <View style={{ flexDirection: 'row', marginHorizontal: wp('8%'), marginVertical: wp('2%') }} >
                                <ToggleSwitch
                                    isOn={this.state.isOnFGToggleSwitch}
                                    onColor="#1D3567"
                                    offColor="red"
                                    labelStyle={{ color: "black", fontWeight: "900", fontFamily: 'Montserrat-Regular', }}
                                    size="medium"
                                    onToggle={isOnFGToggleSwitch => {
                                        this.setState({ isOnFGToggleSwitch, isOnRMToggleSwitch: !this.state.isOnRMToggleSwitch });
                                        this.onToggle(isOnFGToggleSwitch);
                                    }}
                                // label="Example label"
                                />
                                <Text style={{ justifyContent: 'center', alignSelf: 'center', marginLeft: wp('2%'), fontFamily: 'Montserrat-Regular', }}>Finished Good</Text>
                            </View>
                            <View style={{ flexDirection: 'row', marginHorizontal: wp('8%'), marginVertical: wp('2%') }} >
                                <ToggleSwitch
                                    isOn={this.state.isOnRMToggleSwitch}
                                    onColor="#1D3567"
                                    offColor="red"
                                    labelStyle={{ color: "black", fontWeight: "900", fontFamily: 'Montserrat-Regular', }}
                                    size="medium"
                                    onToggle={isOnRMToggleSwitch => {
                                        this.setState({ isOnRMToggleSwitch, isOnFGToggleSwitch: !this.state.isOnFGToggleSwitch });
                                        this.onToggle(isOnRMToggleSwitch);
                                    }}
                                />
                                <Text style={{ justifyContent: 'center', alignSelf: 'center', marginLeft: wp('2%'), fontFamily: 'Montserrat-Regular', }}>Raw Material</Text>
                            </View>
                            {this.state.isOnFGToggleSwitch ?
                                <View>
                                    <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginTop: wp('2%') }}>
                                        <Text style={styles.products}>Sub Location</Text>
                                        <Text style={{ color: 'red' }}>*</Text>
                                    </View>
                                    <TouchableOpacity style={{
                                        width: wp('84%'),
                                        height: wp('10%'),
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        shadowRadius: 3,
                                        marginTop: hp('2%'),
                                        elevation: 4,
                                        backgroundColor: '#FFFFFF',
                                        flexDirection: 'row',
                                        borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('5%'),
                                    }} onPress={this.toggleModal}>
                                        <Text style={styles.Sublocation}>{this.state.selected_location ? this.state.selected_location.itemName : "Select a Sub Location"}</Text>
                                        <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                                    </TouchableOpacity>
                                </View> : null}
                            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.CheckJob()} >
                                <LinearGradient
                                    colors={[color.gradientStartColor, color.gradientEndColor]}
                                    start={{ x: 0.0, y: 0.25 }} end={{ x: 1.2, y: 1.0 }}
                                    style={[styles.center, {
                                        marginTop: hp('1%'),
                                        width: wp('80%'),
                                        height: hp('8%'),
                                        borderWidth: 0.2,
                                        borderRadius: wp('2.5%'),
                                        justifyContent: 'center', alignSelf: 'center'
                                    }]}>
                                    <Text style={{ justifyContent: 'center', alignSelf: 'center', color: '#fff', fontFamily: 'Montserrat-Bold', }}>Start</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Modal>
                <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"modal7"} swipeArea={20}
                    backdropPressToClose={true}  >
                    <ScrollView>
                        <View style={{ /*height: wp('65%'),*/ width: wp('90%'), justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10 }} >
                            <View>
                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginTop: wp('2%') }}>
                                    <Text style={styles.products}>Sub Location</Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                                <TouchableOpacity style={{
                                    width: wp('84%'),
                                    height: wp('10%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    marginTop: hp('2%'),
                                    elevation: 4,
                                    backgroundColor: '#FFFFFF',
                                    flexDirection: 'row',
                                    borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('5%'),
                                }} onPress={this.toggleModal}>
                                    <Text style={styles.Sublocation}>{this.state.selected_location ? this.state.selected_location.itemName : "Select a Sub Location"}</Text>
                                    <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={{ flex: 1 }} onPress={() => this.CheckFirstLastJob()} >
                                <LinearGradient
                                    colors={[color.gradientStartColor, color.gradientEndColor]}
                                    start={{ x: 0.0, y: 0.25 }} end={{ x: 1.2, y: 1.0 }}
                                    style={[styles.center, {
                                        marginTop: hp('1%'),
                                        width: wp('80%'),
                                        height: hp('8%'),
                                        borderWidth: 0.2,
                                        borderRadius: wp('2.5%'),
                                        justifyContent: 'center', alignSelf: 'center'
                                    }]}>
                                    <Text style={{ justifyContent: 'center', alignSelf: 'center', color: '#fff', fontFamily: 'Montserrat-Bold', }}>Start</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Modal>
                {this.state.Sub_location.length > 0 ?
                    <SearchableDropdown
                        title={'Select a Sub Location'}
                        data={this.state.Sub_location}
                        onSelect={(selectedItem) => {
                            this.setState({ selected_location: selectedItem, isModalVisible: false }, async () => {
                                console.log("in assign : ", selectedItem.id)
                                await AsyncStorage.setItem("Sublocation", selectedItem.id.toString())
                            })
                        }}
                        onCancel={() => { this.setState({ isModalVisible: false }) }}
                        isVisible={this.state.isModalVisible === true} /> : null}
                {this.renderModalContent()}
            </Container>

        )

    }
}

export default withNavigation(Assign);

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
        marginBottom: wp('5%'),
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
        // flex: 1,
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
    },
    overlay: {
        height: Platform.OS === "android" ? Dimensions.get("window").height : null,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    modal4: {
        maxHeight: 300,
        minHeight: 80
    },
    modal1: {
        maxHeight: 280,
        minHeight: 80
    },
    Sublocation: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: wp('2%'),
        color: '#636363'
    },
    products: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
    }
});