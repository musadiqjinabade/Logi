import React, { Component } from 'react';
import { Text, View, StatusBar, TextInput, StyleSheet, TouchableOpacity, AsyncStorage, ToastAndroid, Dimensions, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import SearchableDropdown from '../searchablebleDropdown';
import svgImages from '../../../Images/images';
import APIService from '../../../component/APIServices';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from "moment";
import Headers from '../../../component/Headers'
import RMDropdown from '../../FirstandLast/RMDropdown';
import VendorDropdown from '../../FirstandLast/VendorDropdown'
import Modal from 'react-native-modalbox';

class RMCheckProductAssign extends Component {
    static navigationOptions = { header: null }

    Totalstates = [
        {
            "id": "AN",
            "name": "Andaman and Nicobar Islands"
        },
        {
            "id": "AP",
            "name": "Andhra Pradesh"
        },
        {
            "id": "AR",
            "name": "Arunachal Pradesh"
        },
        {
            "id": "AS",
            "name": "Assam"
        },
        {
            "id": "BR",
            "name": "Bihar"
        },
        {
            "id": "CG",
            "name": "Chandigarh"
        },
        {
            "id": "CH",
            "name": "Chhattisgarh"
        },
        {
            "id": "DH",
            "name": "Dadra and Nagar Haveli"
        },
        {
            "id": "DD",
            "name": "Daman and Diu"
        },
        {
            "id": "DL",
            "name": "Delhi"
        },
        {
            "id": "GA",
            "name": "Goa"
        },
        {
            "id": "GJ",
            "name": "Gujarat"
        },
        {
            "id": "HR",
            "name": "Haryana"
        },
        {
            "id": "HP",
            "name": "Himachal Pradesh"
        },
        {
            "id": "JK",
            "name": "Jammu and Kashmir"
        },
        {
            "id": "JH",
            "name": "Jharkhand"
        },
        {
            "id": "KA",
            "name": "Karnataka"
        },
        {
            "id": "KL",
            "name": "Kerala"
        },
        {
            "id": "LD",
            "name": "Lakshadweep"
        },
        {
            "id": "MP",
            "name": "Madhya Pradesh"
        },
        {
            "id": "MH",
            "name": "Maharashtra"
        },
        {
            "id": "MN",
            "name": "Manipur"
        },
        {
            "id": "ML",
            "name": "Meghalaya"
        },
        {
            "id": "MZ",
            "name": "Mizoram"
        },
        {
            "id": "NL",
            "name": "Nagaland"
        },
        {
            "id": "OR",
            "name": "Odisha"
        },
        {
            "id": "PY",
            "name": "Puducherry"
        },
        {
            "id": "PB",
            "name": "Punjab"
        },
        {
            "id": "RJ",
            "name": "Rajasthan"
        },
        {
            "id": "SK",
            "name": "Sikkim"
        },
        {
            "id": "TN",
            "name": "Tamil Nadu"
        },
        {
            "id": "TS",
            "name": "Telangana"
        },
        {
            "id": "TR",
            "name": "Tripura"
        },
        {
            "id": "UP",
            "name": "Uttar Pradesh"
        },
        {
            "id": "UK",
            "name": "Uttarakhand"
        },
        {
            "id": "WB",
            "name": "West Bengal"
        }
    ]


    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            focus: false,
            batch_no: null,
            Product: '',
            products: '',
            isVisible: true,
            checked: false,
            progressText: 'Loading...',
            manufacture: null,
            mrp: 0,
            expiry: null,
            manufactureloc: null,
            targetstate: null,
            isDateTimePickerManufacture: false,
            isDateTimePickerExpiry: false,
            obj: {},
            locationId: null,
            locationName: '',
            selectedState: '',
            expanded: true,
            workorder: '',
            Rawmaterial: false,
            isRMModalVisible: false,
            isVendorModalVisible: false,
            CountryData: '',
            Rawmaterialdata: '',
            RawmaterialVendor: '',
            RMbatch: '',
            FGbatch: '',
            finish_loading: false,
            invoice_no: '',
            job_id: ''
        }
    }

    async componentDidMount() {
        // this.getDetails()
        await AsyncStorage.getItem('SelectedLocation').then((value) => {
            var location = JSON.parse(value);
            this.setState({
                locationId: location.id ? location.id : location.value,
                locationName: location.itemName ? location.itemName : location.label
            })
            console.log("location", location)
        });
        this.setState({ job_id: this.props.navigation.state.params.job_id, sequence_number: this.props.navigation.state.params.item1 })
    }

    RMtoggleModal = () => {
        console.log("working model")
        this.setState({ isRMModalVisible: !this.state.isRMModalVisible });
    }

    VendortoggleModal = () => {
        this.setState({ isVendorModalVisible: !this.state.isVendorModalVisible });
    }

    async getDetails() {
        var userdata = await APIService.execute('GET', APIService.URLUSER + 'users/userdetails');
        console.log("user data:", userdata.data.data[0])
        if (userdata.success == true) {
            this.setState({ userdata: userdata.data.data[0] })
        }
        else {
            ToastAndroid.show('No User Details', ToastAndroid.LONG, 25, 50);
        }
        this.getCountry()
    }

    async getCountry() {
        var userdata = await APIService.execute('GET', APIService.URLUSER + 'users/listcountrydetails');
        console.log("user country:", userdata)
        if (userdata.success == true) {
            // this.setState({ userdata:userdata})
            var searchResults = [];
            for (var d of userdata.data.data) {
                console.log('filter:', d.itemName, this.state.userdata.country)
                if (d.itemName == this.state.userdata.country) {
                    searchResults.push(d);
                }
            }
            this.setState({
                country: searchResults[0],
                countryData: userdata.data.data,
                loading: false
            })
        }
        else {
            ToastAndroid.show('No User Country', ToastAndroid.LONG, 25, 50);
        }
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible }, async () => {
            var response = await APIService.execute('GET', APIService.URLTEST + 'product/listproductname', null)
            this.setState({ Product: response.data.data })
        });
    };

    selectState = () => {
        this.setState({ isStateModalVisible: !this.state.isStateModalVisible }, () => {
            this.setState({ stateData: this.Totalstates })
        });
    };

    renderModalContent = () => {
        if (this.state.isModalVisible || this.state.isStateModalVisible) {
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

    async start_All() {
        if (this.state.Rawmaterialdata) {
            if (this.state.RawmaterialVendor) {
                this.setState({ loading: true })
                var manu_date = moment(this.state.manufacture).unix()
                var expiry_date = moment(this.state.expiry).unix()
                let bodydata = {}
                bodydata.job_id = this.state.job_id || null
                bodydata.rm_id = this.state.Rawmaterialdata ? this.state.Rawmaterialdata.rm_id : null
                bodydata.vendor_id = this.state.RawmaterialVendor ? this.state.RawmaterialVendor.recipient_id : null
                bodydata.invoice_no = this.state.invoice_no || null
                bodydata.sequence_number = this.state.sequence_number
                bodydata.receipt_date = manu_date || null
                bodydata.exp_date = expiry_date || null
                bodydata.fg_batch_no = this.state.FGbatch || null
                bodydata.rm_batch_no = this.state.RMbatch || null
                bodydata.location_id = this.state.locationId || null
                bodydata.location_name = this.state.locationName || null
                var Updatedata = await APIService.execute('POST', APIService.URLBACKEND + APIService.getjobexecution, bodydata)
                console.log("updated:", Updatedata)
                if (Updatedata.data.status == 200) {
                    ToastAndroid.show(Updatedata.data.data.message, ToastAndroid.LONG, 25, 50);
                    this.props.navigation.goBack()
                } else if (Updatedata.data.status == 400) {
                    ToastAndroid.show(Updatedata.data.data.message, ToastAndroid.LONG, 25, 50);
                }
                else {
                    if (Updatedata.data.errorMessage) {
                        ToastAndroid.show(Updatedata.data.errorMessage, ToastAndroid.LONG, 25, 50);
                    }
                    else {
                        ToastAndroid.show(Updatedata.data.error, ToastAndroid.LONG, 25, 50);
                    }
                    this.props.navigation.goBack()
                }
                this.setState({ loading: false })
            }
            else {
                ToastAndroid.show('Please Select Vendor', ToastAndroid.LONG, 25, 50);
                this.setState({ loading: false })
            }
        } else {
            ToastAndroid.show('Please Select Raw Material', ToastAndroid.LONG, 25, 50);
            this.setState({ loading: false })
        }
        this.setState({ loading: false })
    }

    _showDateTimeManfacture = () => this.setState({ isDateTimePickerManufacture: true });
    _hideDateTimeManufacture = () => this.setState({ isDateTimePickerManufacture: false });
    _showDateTimeExpiry = () => this.setState({ isDateTimePickerExpiry: true });
    _hideDateTimeExpiry = () => this.setState({ isDateTimePickerExpiry: false });
    _handleDateManufacture = (name, date) => {
        this._hideDateTimeManufacture();
        var obj = {}
        obj[name] = date
        obj['isDateSelected'] = true
        if (moment(date).isBefore(moment().format("DD MMMM YYYY"), 'day') || moment(date).isSame(moment().format("DD MMMM YYYY"), 'day')) {
            this.setState({
                manufacture: date,
                obj
            }, () => console.log('obj is', obj, this.state.manufacture))
        }
        else {
            ToastAndroid.show('Please Select Valid Receipt Date', ToastAndroid.LONG, 25, 50);
        }
    };
    _handleDateExpiry = (name, date) => {
        this._hideDateTimeExpiry();
        var obj = {}
        obj[name] = date
        obj['isDateSelected'] = true
        var check = moment(date).isAfter(this.state.manufacture, 'day')
        if (this.state.manufacture) {
            if (check == true) {
                this.setState({
                    expiry: date,
                    obj
                }, () => {
                    console.log('obj is', obj, this.state.expiry)
                })
            }
            else {
                ToastAndroid.show('Please Select Valid Expiry Date', ToastAndroid.LONG, 25, 50);
            }
        }
        else {
            ToastAndroid.show('Please Select Receipt Date', ToastAndroid.LONG, 25, 50);
        }
    };


    async cancelJob() {
        this.refs.redirectHome.close()
        var data = {}
        data.job_id = this.state.job_id || null
        var cancelJobresponse = await APIService.execute('POST', APIService.URLBACKEND + APIService.cancelAssignJob, data)
        if (cancelJobresponse.data.status == 200) {
            ToastAndroid.show(cancelJobresponse.data.message, ToastAndroid.LONG, 25, 50);
            this.props.navigation.navigate('Dashboard')
        }
    }

    render() {
        return (
            <Container style={{ flex: 1, backgroundColor: '#F5F5F4' }}>
                <Headers isHome={true} onBackHome={() => { this.refs.redirectHome.open() }} label={'Assign'} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1, width: wp('100%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', paddingLeft: wp('3%'), paddingRight: 10, paddingBottom: 10, marginBottom: 30, marginTop: wp('2%') }}>
                            {this.state.checked ?
                                <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                    <Text style={styles.productsdisable}>Raw Material</Text>
                                    <Text style={{ color: '#EEBBBB' }}>*</Text>
                                </View> :
                                <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                    <Text style={styles.products}>Raw Material</Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                            }
                            <TouchableOpacity style={{
                                width: wp('94%'),
                                height: wp('11%'),
                                // marginRight: wp('10%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: '#FFFFFF',
                                flexDirection: 'row',
                                borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('5%'),
                            }} onPress={this.RMtoggleModal}>
                                <Text numberOfLines={1} style={styles.selectproducts}>{this.state.Rawmaterialdata.rm_name || "Select a Raw Material"}</Text>
                                <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                            </TouchableOpacity>
                            <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                <Text style={styles.products}>Vendor</Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </View>
                            <TouchableOpacity style={{
                                width: wp('94%'),
                                height: wp('11%'),
                                // marginRight: wp('10%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: '#FFFFFF',
                                flexDirection: 'row',
                                borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('5%'),
                            }} onPress={this.VendortoggleModal}>
                                <Text numberOfLines={1} style={styles.selectproducts}>{this.state.RawmaterialVendor.recipient_name || "Select a Vendor"}</Text>
                                <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                            </TouchableOpacity>
                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                <Text style={styles.products}>Invoice No</Text>
                                {/* <Text style={{ color: 'red' }}>*</Text> */}
                            </View>
                            <View style={{
                                width: wp('94%'),
                                height: wp('11%'),
                                // marginRight: wp('10%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: '#FFFFFF',
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('5%'),
                            }}>
                                <TextInput
                                    style={styles.batchstyle}
                                    value={(this.state.invoice_no || '')}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType='default'
                                    returnKeyType="next"
                                    placeholder={'Enter Invoice No'}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    placeholderTextColor="gray"
                                    placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                    onChangeText={(text) => this.setState({
                                        invoice_no: text
                                    })}></TextInput>
                            </View>
                            <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                <Text style={this.state.checked ? styles.productsdisable : styles.products}>Receipt Date</Text>
                            </View>
                            <TouchableOpacity onPress={this._showDateTimeManfacture} style={{
                                width: wp('94%'),
                                height: wp('11%'),
                                // marginRight: wp('10%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: this.state.checked ? "#C0BCBC" : '#FFFFFF',
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('5%'),
                            }}>
                                <Text style={{
                                    paddingLeft: 6,
                                    marginTop: 9,
                                    flexDirection: 'row',
                                    fontFamily: 'Montserrat-Regular',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    flex: 1,
                                    height: wp('11%'),
                                    color: '#000000',
                                    fontSize: 14,
                                }}>{this.state.manufacture || 'Enter Receipt Date'}</Text>
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerManufacture}
                                onConfirm={(value) => this._handleDateManufacture('manufacture', moment(value).format("DD MMMM YYYY"))}
                                onCancel={this._hideDateTimeManufacture} />
                            <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                <Text style={this.state.checked ? styles.productsdisable : styles.products}>Expiry Date</Text>
                            </View>
                            <TouchableOpacity onPress={this._showDateTimeExpiry} style={{
                                width: wp('94%'),
                                height: wp('11%'),
                                // marginRight: wp('10%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: this.state.checked ? "#C0BCBC" : '#FFFFFF',
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('5%'),
                            }}>
                                <Text style={{
                                    paddingLeft: 6,
                                    marginTop: 9,
                                    flexDirection: 'row',
                                    fontFamily: 'Montserrat-Regular',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    flex: 1,
                                    height: wp('11%'),
                                    color: '#000000',
                                    fontSize: 14,
                                }}>{this.state.expiry || 'Enter Expiry Date'}</Text>
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerExpiry}
                                onConfirm={(value) => this._handleDateExpiry('expiry', moment(value).format("DD MMMM YYYY"))}
                                onCancel={this._hideDateTimeExpiry} />
                            <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                <Text style={this.state.checked ? styles.productsdisable : styles.products}>RM Batch No</Text>
                            </View>
                            <View style={{
                                width: wp('94%'),
                                height: wp('11%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: this.state.checked ? "#C0BCBC" : '#FFFFFF',
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('5%'),
                            }}>
                                <TextInput
                                    style={styles.batchstyle}
                                    value={(this.state.RMbatch || '')}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType='default'
                                    returnKeyType="next"
                                    editable={this.state.checked ? false : true}
                                    placeholder={'Enter Raw Material Batch No'}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    placeholderTextColor="gray"
                                    placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                    onChangeText={(text) => this.setState({
                                        RMbatch: text
                                    })}></TextInput>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                <Text style={this.state.checked ? styles.productsdisable : styles.products}>FG Batch No</Text>
                            </View>
                            <View style={{
                                width: wp('94%'),
                                height: wp('11%'),
                                // marginRight: wp('10%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: '#FFFFFF',
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('5%'),
                            }}>
                                <TextInput
                                    style={styles.batchstyle}
                                    value={(this.state.FGbatch || '')}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType='default'
                                    returnKeyType="next"
                                    placeholder={'Enter Finished Batch No'}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    placeholderTextColor="gray"
                                    placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                    onChangeText={(text) => this.setState({
                                        FGbatch: text
                                    })}></TextInput>
                            </View>

                            <TouchableOpacity onPress={() =>
                                this.start_All()
                                // this.props.navigation.navigate('Scanproduct')
                            } style={{
                                width: wp('94%'),
                                height: wp('13%'),
                                // marginHorizontal:wp('10%'),
                                marginTop: wp('3%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: '#65CA8F',
                                borderRadius: 5, justifyContent: 'center', alignItems: 'center'
                            }}>
                                {
                                    this.state.loading === true ? (
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <View style={{ paddingRight: 10 }}>
                                                <ActivityIndicator size={'small'} color='#FFFFFF' />
                                            </View>
                                            <View>
                                                <Text style={styles.btntext}>Please Wait...</Text>
                                            </View>
                                        </View>
                                    ) : (
                                            <Text style={styles.btntext}>{'Save'.toUpperCase()}</Text>
                                        )
                                }
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                    <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"redirectHome"} swipeArea={20}
                        backdropPressToClose={true}  >
                        <ScrollView>
                            <View style={{ /*height: wp('65%'),*/ width: wp('65%'), justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10 }} >
                                <TouchableOpacity style={{ width: wp('10%'), height: hp('5%'), justifyContent: 'center', alignSelf: 'flex-end', alignItems: 'flex-end' }} onPress={() => { this.refs.redirectHome.close() }} >
                                    <SvgUri width="20" height="20" svgXmlData={svgImages.close} style={{ resizeMode: 'contain' }} />
                                </TouchableOpacity>
                                <SvgUri width="55" height="55" svgXmlData={svgImages.checkmark} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', marginTop: wp('4%') }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', padding: 5 }}>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 16, color: '#1D3567' }}>Confirmation</Text>
                                </View>
                                <View style={{ justifyContent: 'center', alignSelf: 'center', flex: 1 }}>
                                    <Text style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567', textAlign: 'center' }}>Do you want to go back without completing job ?</Text>
                                </View>
                                <View style={{ justifyContent: 'space-between', alignSelf: 'center', flex: 1, flexDirection: 'row', marginBottom: wp('2%') }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.refs.redirectHome.close()
                                            this.props.navigation.navigate('Dashboard')
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
                                        <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#FFFFFF', textAlign: 'center' }}>Save to in progress</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => this.cancelJob()}
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
                                        }} >
                                        <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#1D3567', textAlign: 'center' }}>Cancel job</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </Modal>
                    {this.renderModalContent()}
                </View>
                {this.state.Product.length > 0 ? (
                    <SearchableDropdown
                        title={'Select Products'}
                        data={this.state.Product}
                        onSelect={(selectedItem) => {
                            this.setState({ products: selectedItem, isModalVisible: false })
                        }}
                        onCancel={() => { this.setState({ isModalVisible: false }) }}
                        isVisible={this.state.isModalVisible === true} />) : null}

                {this.Totalstates.length > 0 ? (
                    <SearchableDropdown
                        title={'Select State'}
                        data={this.Totalstates}
                        onSelect={(selectedItem) => {
                            this.setState({ selectedState: selectedItem, isStateModalVisible: false })
                        }}
                        onCancel={() => { this.setState({ isStateModalVisible: false }) }}
                        isVisible={this.state.isStateModalVisible === true} />) : null}
                {this.state.CountryData.length > 0 ? (
                    <SearchableDropdown
                        title={'Select Country'}
                        data={this.state.CountryData}
                        onSelect={(selectedItem) => {
                            this.setState({ country: selectedItem, isModalCountry: false })
                        }}
                        onCancel={() => { this.setState({ isModalCountry: false }) }}
                        isVisible={this.state.isModalCountry === true} />) : null}
                {this.state.isRMModalVisible ?
                    <RMDropdown
                        title={'Select Raw Material'}
                        data={this.state.CountryData}
                        onSelect={(selectedItem) => {
                            this.setState({ Rawmaterialdata: selectedItem, isRMModalVisible: false })
                        }}
                        onCancel={() => { this.setState({ isRMModalVisible: false }) }}
                        isVisible={this.state.isRMModalVisible === true} /> : null}

                {this.state.isVendorModalVisible ?
                    <VendorDropdown
                        title={'Select Raw Material'}
                        data={this.state.CountryData}
                        onSelect={(selectedItem) => {
                            this.setState({ RawmaterialVendor: selectedItem, isVendorModalVisible: false })
                        }}
                        onCancel={() => { this.setState({ isVendorModalVisible: false }) }}
                        isVisible={this.state.isVendorModalVisible === true} /> : null}
            </Container>
        )
    }
}

export default withNavigation(RMCheckProductAssign);
var styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F3FD',
    },
    products: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    productsdisable: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: '#C0BCBC'
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
    selectproductsdiable: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: wp('2%'),
        color: '#636363'

    },
    searchstyle: {
        paddingLeft: 6,
        flexDirection: 'row',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 15,
        alignSelf: 'center',
        width: wp('75%'),
        height: 48,
        color: '#000000',
        fontSize: 14,
        paddingTop: 0,
        paddingBottom: 0,
    },
    batchstyle: {
        paddingLeft: 6,
        flexDirection: 'row',
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: wp('75%'),
        height: wp('11%'),
        color: '#000000',
        fontSize: 14,
    },
    btntext: {
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
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
    modal1: {
        maxHeight: hp('40%'),
        minHeight: hp('40%')
    }
});