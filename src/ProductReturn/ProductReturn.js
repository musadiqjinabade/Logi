import React, { Component } from 'react';
import { Text, View, TextInput, StatusBar, ToastAndroid, StyleSheet, TouchableOpacity, BackHandler, AsyncStorage, ActivityIndicator, Alert } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import { Container } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import Headers from '../component/Headers';
import color from '../component/color'
import APIService from '../component/APIServices';
import SearchableDropdown from '../Assign/All/searchablebleDropdown';
import Searchable from '../Movestock/searchablebleDropdown';
import NetInfo from "@react-native-community/netinfo";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
});


var decoded = {}

var jwtDecode = require('jwt-decode');
class ProductReturn extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            expanded: true,
            documentTypeList: '',
            documentNumber: '',
            recipientList: '',
            loading: true,
            userLocationId: '',
            isModalVisible: false,
            isRecipientModalVisible: false,
            selectedDocumentTypeId: '',
            selectedDocumentTypeName: '',
            selectedRecipientId: '',
            selectedRecipientName: '',
            batchDetails: '',
            isModalVisibleDocnum:false,
            selectedDocumentNoId:'',
            selectedDocumentNumber:'',
            Documentnum:''
        }
    }

    bachDetailsHandle(value){
        this.setState({
            batchDetails: value.replace(/\s/g, '')
        })
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
        this.focusListener = this.props.navigation.addListener('didFocus', async() => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
            var loginData = await AsyncStorage.getItem('loginData');

            if (loginData) {
                loginData = JSON.parse(loginData);
            }
            console.log('loginData ', loginData.token);
            decoded = jwtDecode(loginData.token);
            console.log('decoded:', decoded)
            this.getRecipient()
        })
        if (await this.checkInternet()) {
            await AsyncStorage.getItem('SelectedLocation').then((value) => {
                var location = JSON.parse(value);

                console.log("location : ", location)
                this.setState({
                    userLocationId: location.value ? location.value : location.id
                }, () => { this.getDocumentTypeList() })
            });
        }
        else {
            ToastAndroid.show('No Internet Connectivity!', ToastAndroid.LONG, 25, 50);
            this.props.navigation.goBack()
        }
    }

    async getDocumentTypeList() {
        var response = await APIService.execute('GET', APIService.URLBACKEND + APIService.settinggetdocumenttypelist+'job_type=Product Return', null)
        console.log("response : ", response)
        if (response.data.status_code === 200) {
            var temp = {}
            temp.id = 0
            temp.itemName = "Add Manually"
            var tempArr = response.data.data
            tempArr.push(temp)
            this.setState({ loading: false, documentTypeList: response.data.data })
        }
    }

    async getRecipient() {
        var response = await APIService.execute('GET', APIService.URLBACKEND + APIService.getRecipients, null)
        console.log("response : ", response)
        if (response.data.status_code === 200) {
            this.setState({ recipientList: response.data.data })
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

    startProductReturn = async () => {
        console.log('selectedDocumentNumber', this.state.selectedDocumentNumber)
        if (this.state.selectedDocumentTypeName) {
            if (this.state.documentNumber === "" || this.state.selectedDocumentNumber?this.state.selectedDocumentNumber.toString()=="":false) {
                ToastAndroid.show("Enter/Select a Document Number", ToastAndroid.LONG, 25, 50);
            }
            else {
                if (this.state.selectedDocumentTypeId === 0) {
                    if (this.state.selectedRecipientId === "") {
                        ToastAndroid.show("Select Recipient", ToastAndroid.LONG, 25, 50);
                    }
                    else if (this.state.batchDetails === "") {
                        ToastAndroid.show("Enter Batch Details", ToastAndroid.LONG, 25, 50);
                    }
                    else {
                        if (await this.checkInternet()) {
                            this.setState({ startJobLoading: true })
                            var tempArray = this.state.batchDetails.split(',');
                            var body = {}
                            body.location_from = this.state.userLocationId
                            body.document_type = this.state.selectedDocumentTypeId
                            body.document_number = this.state.documentNumber || this.state.selectedDocumentNumber
                            body.recipient_id = this.state.selectedRecipientId
                            body.batch_details = tempArray

                            var response = await APIService.execute('POST', APIService.URLBACKEND + APIService.startProductReturnJob, body)
                            if (response.data.status_code === 200) {
                                this.setState({ startJobLoading: false })
                                ToastAndroid.show(response.data.message, ToastAndroid.LONG, 25, 50);
                                var item = {}
                                item.recipient_id = this.state.selectedRecipientId
                                item.jobid = response.data.data.return_id
                                this.props.navigation.navigate('ProductReturnScanningScreen', { item: item })
                            }
                            else {
                                this.setState({ startJobLoading: false })
                                ToastAndroid.show(response.data.message, ToastAndroid.LONG, 25, 50);
                            }
                        }
                        else {
                            ToastAndroid.show('No Internet Connectivity!', ToastAndroid.LONG, 25, 50);
                        }
                    }
                }
                else {
                    if (await this.checkInternet()) {
                        this.setState({ startJobLoading: true })
                        console.log("final value : ", this.state.documentNumber)
                        body = {}
                        body.location_from = this.state.userLocationId
                        body.document_type = this.state.selectedDocumentTypeId
                        body.document_number = this.state.documentNumber || this.state.selectedDocumentNumber
                        body.recipient_id = null
                        body.batch_details = null

                        var response1 = await APIService.execute('POST', APIService.URLBACKEND + APIService.startProductReturnJob, body)
                        if (response1.data.status_code === 200) {
                            this.setState({ startJobLoading: false })
                            ToastAndroid.show(response1.data.message, ToastAndroid.LONG, 25, 50);
                            // var item = {}
                            // item.fromLocationID = this.state.fromLocationID
                            // item.toLocationID = this.state.toLocationID
                            this.props.navigation.navigate('ProductReturnScanningScreen', { item: '' })

                        }
                        else {
                            this.setState({ startJobLoading: false })
                            ToastAndroid.show(response1.data.message, ToastAndroid.LONG, 25, 50);
                        }
                    }
                    else {
                        ToastAndroid.show('No Internet Connectivity!', ToastAndroid.LONG, 25, 50);
                    }
                }

            }
        }
        else {
            ToastAndroid.show("Select Document Type", ToastAndroid.LONG, 25, 50);
        }


    }

    toggleModalDocnum = () => {
        console.log('working')
        this.setState({ isModalVisibleDocnum: !this.state.isModalVisibleDocnum },async()=>{
            const body={}
            body.document_type = this.state.selectedDocumentTypeName?this.state.selectedDocumentTypeName:null
            body.company_id = decoded.company_id || null
            // body.document_type = 'invoice'
            // body.company_id = 120

            var response = await APIService.execute('POST', APIService.URL_ERP + APIService.documentgetdocumentbytype, body)
            console.log('response:', response)
            if (response.success) {
                if(response.data.data.length > 0){
                    this.setState({ Documentnum: response.data.data , },()=>{
                        console.log('this.Document', this.state.Documentnum)
                    })
                }
                else{
                        ToastAndroid.show("No Document Number list available", ToastAndroid.LONG, 25, 50);
                }
                
            }
        });
    };

    render() {
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Headers isHome={false} label={'Product Return'} onBack={() => { this.props.navigation.goBack() || this.props.navigation.navigate('Dashboard') }} expanded={this.state.expanded} />
                    <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                    <View style={{ marginTop: hp('3%') }}>
                        <ActivityIndicator size={'large'} color='#1D3567' />
                    </View>
                </View>
            )
        }
        else {
            return (
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <Headers isHome={true} onBackHome={() => {this.props.navigation.goBack() || this.props.navigation.navigate('Dashboard') }} label={'Product Return'} onBack={() => {this.props.navigation.goBack() ||  this.props.navigation.dispatch(resetAction) }} expanded={this.state.expanded} />
                    <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                    <ScrollView style={{marginBottom: hp('8%')}}>
                        <View style={{ flex: 1, flexDirection: 'column', padding: wp('2%') }}>
                            <View style={{ marginTop: hp('2%'), height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                <Text style={styles.productsdisable}>Document Type </Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </View>
                            <TouchableOpacity style={styles.selectBackgroundStyle} onPress={() => { this.state.documentTypeList.length > 0 ? this.setState({ isModalVisible: !this.state.isModalVisible }) : ToastAndroid.show("No Document type list available", ToastAndroid.LONG, 25, 50); }}>
                                <Text style={styles.selectproducts}>{this.state.selectedDocumentTypeName || "Select Document type"}</Text>
                                <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                            </TouchableOpacity>
                            {
                                this.state.selectedDocumentTypeId && this.state.selectedDocumentTypeId !== 0 ?
                                    <View>
                                        <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                            <Text style={styles.productsdisable}>Document Number</Text>
                                            <Text style={{ color: 'red' }}>*</Text>
                                        </View>
                                        <TouchableOpacity style={styles.selectBackgroundStyle}
                                            onPress={this.toggleModalDocnum}                                         >
                                            <Text style={styles.selectproducts}>{this.state.selectedDocumentNumber?this.state.selectedDocumentNumber:"Document number"}</Text>
                                            <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                                        </TouchableOpacity>
                                    </View> : this.state.selectedDocumentTypeId === 0 ? <View>

                                        <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                            <Text style={styles.productsdisable}>Document Number </Text>
                                            <Text style={{ color: 'red' }}>*</Text>
                                        </View>
                                        <View style={styles.selectBackgroundStyle}>
                                            <TextInput
                                                line={1}
                                                underlineColorAndroid='transparent'
                                                style={styles.selectproducts}
                                                keyboardType='default'
                                                placeholder={'Enter Document number'}
                                                value={this.state.documentNumber}
                                                onChangeText={documentNumber => {
                                                    this.setState({ documentNumber },()=>{console.log("value : ", this.state.documentNumber)})
                                                }}
                                                placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Regular', fontSize: 20 }}></TextInput>
                                        </View>

                                        <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                            <Text style={styles.productsdisable}>Recipient </Text>
                                            <Text style={{ color: 'red' }}>*</Text>
                                        </View>
                                        <TouchableOpacity style={styles.selectBackgroundStyle} onPress={() => { this.state.recipientList.length > 0 ? this.setState({ isRecipientModalVisible: !this.state.isRecipientModalVisible }) : ToastAndroid.show("No Recipient available", ToastAndroid.LONG, 25, 50); }}>
                                            <Text style={styles.selectproducts}>{this.state.selectedRecipientName || "Select Recipient"}</Text>
                                            <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                                        </TouchableOpacity>

                                        <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                            <Text style={styles.productsdisable}>Batch Details </Text>
                                            <Text style={{ color: 'red' }}>*</Text>
                                            {/* <Text style={{ justifyContent: 'center', alignSelf: 'center', fontFamily: 'Montserrat-Regular', fontSize: wp('3.0%'), marginLeft: wp('2%'), color: color.gradientEndColor}}>(Add Comma(,) seprated)</Text> */}
                                        </View>
                                        <View style={styles.selectBackgroundStyle}>
                                            <TextInput
                                                autoCapitalize='characters'
                                                line={1}
                                                underlineColorAndroid='transparent'
                                                style={styles.selectproducts}
                                                keyboardType='default'
                                                placeholder={'Enter batch details'}
                                                value={this.state.batchDetails}
                                                onChangeText={batchDetails => {
                                                    this.bachDetailsHandle(batchDetails)
                                                }}
                                                placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Regular', fontSize: 20 }} ></TextInput>
                                        </View>
                                    </View> : null
                            }
                        </View>
                    </ScrollView>
                    <View style={{
                        flex: 1, position: 'absolute',
                        bottom: 0,
                    }}>
                        <TouchableOpacity onPress={async () => { 
                            Alert.alert(
                                'Alert !',
                                'Please first select sub location and start scanning your items.',
                                [
                                    { text: 'Ok', onPress: () => this.startProductReturn() },
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

                                <View style={{ height: hp('8%'), justifyContent: 'center', alignSelf: 'center' }}>
                                    <Text style={styles.buttonStart}>Start</Text>
                                </View>

                            </LinearGradient>
                        </TouchableOpacity>

                    </View>
                    {this.state.documentTypeList && this.state.documentTypeList.length > 0 ? (
                        <SearchableDropdown
                            title={'Select Document'}
                            data={this.state.documentTypeList}
                            onSelect={(selectedItem) => {
                                this.setState({ selectedDocumentTypeName: selectedItem.itemName, selectedDocumentTypeId: selectedItem.id, isModalVisible: false }, () => {
                                    console.log("id : ", this.state.selectedDocumentTypeId)
                                    if (this.state.selectedDocumentTypeId === 0) {
                                        this.getRecipient()
                                    }
                                })
                            }}
                            onCancel={() => { this.setState({ isModalVisible: false }) }}
                            isVisible={this.state.isModalVisible === true} />) : null}

                    {this.state.recipientList && this.state.recipientList.length > 0 ? (
                        <SearchableDropdown
                            title={'Select Document'}
                            data={this.state.recipientList}
                            onSelect={(selectedItem) => {
                                this.setState({ selectedRecipientName: selectedItem.itemName, selectedRecipientId: selectedItem.id, isRecipientModalVisible: false })
                            }}
                            onCancel={() => { this.setState({ isRecipientModalVisible: false }) }}
                            isVisible={this.state.isRecipientModalVisible === true} />) : null}
                    {this.state.Documentnum && this.state.Documentnum.length > 0 ? (
                        <Searchable
                            title={'Select Document'}
                            data={this.state.Documentnum}
                            onSelect={(selectedItem) => {
                                this.setState({ selectedDocumentNumber: selectedItem.document_number,selectedDocumentNoId:selectedItem._id, isModalVisibleDocnum: false })
                            }}
                            onCancel={() => { this.setState({ isModalVisibleDocnum: false }) }}
                            isVisible={this.state.isModalVisibleDocnum === true} />) : null}
                </View>

            )
        }
    }
}

export default withNavigation(ProductReturn);

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
        flex: 1,
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: wp('2%'),
        color: '#636363'
    },
    buttonStart: {
        fontSize: hp('2.5%'),
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
        borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('2%'),
    }
});