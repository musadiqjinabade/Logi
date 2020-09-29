import React, { Component } from 'react';
import { Text, View, StatusBar, TextInput, StyleSheet, AsyncStorage, ToastAndroid, Dimensions, ActivityIndicator, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container, CheckBox } from 'native-base';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import SearchableDropdown from '../searchablebleDropdown';
import svgImages from '../../../Images/images';
import APIService from '../../../component/APIServices';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from "moment";
import Headers from '../../../component/Headers';
import RMDropdown from '../../FirstandLast/RMDropdown';
import VendorDropdown from '../../FirstandLast/VendorDropdown'

class RMAssign extends Component {
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
            invoice_no: ''
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
        if (this.state.isModalVisible) {
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

    async componentDidMount() {
        await AsyncStorage.getItem('SelectedLocation').then((value) => {
            var location = JSON.parse(value);
            this.setState({
                locationId: location.id ? location.id : location.value,
                locationName: location.itemName ? location.itemName : location.label
            })
        });
    }

    async start_All() {
        if (this.state.checked) {
            this.setState({ loading: true })
            var data = {}
            data.location_id = this.state.locationId
            var start = await APIService.execute('POST', APIService.URLBACKEND + APIService.checkRMAssignment, data)
            // var start = await APIService.execute('POST', APIService.URLBACKEND+'assignment/assignall', data)
            if (start.data.status == 200) {
                ToastAndroid.show(start.data.data.message, ToastAndroid.LONG, 25, 50);
                this.props.navigation.navigate('RMCheckScanningScreen', { item: start.data.data })
                this.setState({ loading: false })
            }
            else if (start.data.status == 400) {
                ToastAndroid.show(start.data.data.message, ToastAndroid.LONG, 25, 50);
                this.setState({ loading: false })
            }
            else {
                ToastAndroid.show(start.data.errorMessage, ToastAndroid.LONG, 25, 50);
            }
            this.setState({ loading: false })
        }
        else {
            if (this.state.Rawmaterialdata) {
                if (this.state.RawmaterialVendor) {
                    this.setState({ loading: true })
                    var manu_date = moment(this.state.manufacture).unix()
                    var expiry_date = moment(this.state.expiry).unix()
                    if (this.state.manufacture == null || this.state.expiry == null || manu_date < expiry_date) {
                        let bodydata = {}
                        bodydata.rm_id = this.state.Rawmaterialdata ? this.state.Rawmaterialdata.rm_id : null
                        bodydata.vendor_id = this.state.RawmaterialVendor ? this.state.RawmaterialVendor.recipient_id : null
                        bodydata.invoice_no = this.state.invoice_no || null
                        bodydata.receipt_date = manu_date || null
                        bodydata.exp_date = expiry_date || null
                        bodydata.fg_batch_no = this.state.FGbatch || null
                        bodydata.rm_batch_no = this.state.RMbatch || null
                        bodydata.location_id = this.state.locationId || null
                        var start_assign = await APIService.execute('POST', APIService.URLBACKEND + APIService.startRMAssignmentJob, bodydata)
                        console.log('response without check:', start_assign)
                        // if (start_assign.data.status_code == 200) {
                        ToastAndroid.show(start_assign.data.data.message, ToastAndroid.LONG, 25, 50);
                        this.props.navigation.navigate('RMNotCheckScanningScreen', { item: start_assign.data.data })
                        this.setState({ loading: false })

                        // }
                        // else if (start_assign.data.status_code == 400) {
                        //     ToastAndroid.show(start_assign.data.message, ToastAndroid.LONG, 25, 50);
                        //     this.setState({ loading: false })

                        // }
                        this.setState({ loading: false })
                    }
                    else {
                        ToastAndroid.show('Select Valid Expiry Date', ToastAndroid.LONG, 25, 50);
                        this.setState({ loading: false, finish_loading: false })
                    }
                }
                else {
                    ToastAndroid.show('Please Select Vendor', ToastAndroid.LONG, 25, 50);
                    this.setState({ loading: false, finish_loading: false })
                }
            } else {
                ToastAndroid.show('Please Select Raw Material', ToastAndroid.LONG, 25, 50);
                this.setState({ loading: false })
            }
            this.setState({ loading: false })
        }
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
        // this.setState(obj, () => console.log('obj is', obj))
        if (moment(date).isBefore(moment().format("DD MMMM YYYY"), 'day') || moment(date).isSame(moment().format("DD MMMM YYYY"), 'day')) {
            this.setState(obj, () => console.log('obj is', obj))
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

    RMtoggleModal = () => {
        this.setState({ isRMModalVisible: !this.state.isRMModalVisible });
    }

    VendortoggleModal = () => {
        this.setState({ isVendorModalVisible: !this.state.isVendorModalVisible });
    }

    render() {
        return (
            <Container style={{ flex: 1, backgroundColor: '#F5F5F4' }}>
                <Headers isHome={true} onBackHome={() => { this.props.navigation.navigate('Dashboard') }} label={'Raw Material Assign'} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1, width: wp('100%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', paddingLeft: wp('3%'), paddingRight: wp('12%'), paddingBottom: 10, marginBottom: 30, marginTop: wp('2%') }}>
                            <View style={{ height: wp('10%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('10%'), marginLeft: wp('-2%') }}>
                                <CheckBox checked={this.state.isVisible} style={{ backgroundColor: this.state.checked === true ? "#2B4781" : "white", borderColor: this.state.checked == true ? "#2B4781" : "#2B4781", marginTop: 10, width: 22, height: 21, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', alignContent: 'center', paddingTop: 5 }}
                                    onPress={() => this.setState({ checked: !this.state.checked })} />

                                {this.state.checked ?
                                    <TouchableOpacity onPress={() => this.setState({ checked: !this.state.checked })}>
                                        <Text style={{ marginHorizontal: 20, flex: 1, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', alignContent: 'center', paddingTop: 15, fontSize: 12, fontFamily: 'Montserrat-Bold' }}>Ask for product details after every scan</Text>
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity onPress={() => this.setState({ checked: !this.state.checked })}>
                                        <Text style={{ marginHorizontal: 20, flex: 1, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', alignContent: 'center', paddingTop: 15, fontSize: 12, fontFamily: 'Montserrat-Regular' }}>Ask for product details after every scan</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                            {this.state.checked ?
                                <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                    <Text style={styles.productsdisable}>Raw material</Text>
                                    <Text style={{ color: '#EEBBBB' }}>*</Text>
                                </View> :

                                <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                    <Text style={styles.products}>Raw material</Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                            }
                            {this.state.checked ?
                                <View style={{
                                    width: wp('94%'),
                                    height: wp('11%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    elevation: 4,
                                    backgroundColor: '#C0BCBC',
                                    flexDirection: 'row',
                                    borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('5%'),
                                }} onPress={this.toggleModal}>
                                    <Text numberOfLines={1} style={styles.selectproductsdiable}>{"Select a Raw Material"}</Text>
                                    <SvgUri width="17" height="13" fill='#6B829D' svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />

                                </View>
                                : <TouchableOpacity style={{
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
                            }

                            {this.state.checked ? <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                <Text style={styles.productsdisable}>Vendor</Text>
                                <Text style={{ color: '#EEBBBB' }}>*</Text>
                            </View> :
                                <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                    <Text style={styles.products}>Vendor</Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                            }

                            {this.state.checked ? <View style={{
                                width: wp('94%'),
                                height: wp('11%'),
                                // marginRight: wp('10%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: '#C0BCBC',
                                flexDirection: 'row',
                                borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('5%'),
                            }} >
                                <Text numberOfLines={1} style={styles.selectproducts}>{this.state.RawmaterialVendor.recipient_name || "Select a Vendor"}</Text>
                                <SvgUri width="17" height="13" fill='#6B829D' svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />

                            </View> :
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
                            }

                            {this.state.checked ? <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                <Text style={styles.productsdisable}>MRP</Text>
                                {/* <Text style={{ color: '#EEBBBB' }}>*</Text> */}
                            </View> :
                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                    <Text style={styles.products}>Invoice No</Text>
                                    {/* <Text style={{ color: 'red' }}>*</Text> */}
                                </View>
                            }
                            {this.state.checked ? <View style={{
                                width: wp('94%'),
                                height: wp('11%'),
                                shadowOffset: { width: 0, height: 2 },
                                flexDirection: 'row',
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: '#C0BCBC',
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('5%'),
                            }}>
                                <TextInput
                                    style={styles.batchstyle}
                                    // value={(this.state.mrp || '')}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType='default'
                                    returnKeyType="next"
                                    placeholder={'Enter Invoice No'}
                                    editable={false}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    placeholderTextColor="gray"
                                    placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                ></TextInput>
                            </View> :
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
                            }


                            <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                <Text style={this.state.checked ? styles.productsdisable : styles.products}>Receipt Date</Text>
                                {/* <Text style={{ color: this.state.checked ? '#EEBBBB' : 'red' }}>*</Text> */}
                            </View>
                            <TouchableOpacity onPress={this.state.checked ? null : this._showDateTimeManfacture} style={{
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
                                    color: this.state.checked ? 'grey' : '#000000',
                                    fontSize: 14,
                                }}>{this.state.manufacture || 'Enter Receipt Date'}</Text>

                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerManufacture}
                                onConfirm={(value) => this._handleDateManufacture('manufacture', moment(value).format("DD MMMM YYYY"))}
                                onCancel={this._hideDateTimeManufacture} />

                            <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                <Text style={this.state.checked ? styles.productsdisable : styles.products}>Expiry Date</Text>
                                {/* <Text style={{ color: this.state.checked ? '#EEBBBB' : 'red' }}>*</Text> */}
                            </View>
                            <TouchableOpacity onPress={this.state.checked ? null : this._showDateTimeExpiry} style={{
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
                                    color: this.state.checked ? 'grey' : '#000000',
                                    fontSize: 14,
                                }}>{this.state.expiry || 'Enter Expiry Date'}</Text>
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerExpiry}
                                onConfirm={(value) => this._handleDateExpiry('expiry', moment(value).format("DD MMMM YYYY"))}
                                onCancel={this._hideDateTimeExpiry} />

                            <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                <Text style={this.state.checked ? styles.productsdisable : styles.products}>RM Batch No</Text>
                                {/* <Text style={{ color: this.state.checked ? '#EEBBBB' : 'red' }}>*</Text> */}
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
                                {/* <Text style={{ color: this.state.checked ? '#EEBBBB' : 'red' }}>*</Text> */}
                            </View>
                            {this.state.checked ?
                                <View style={{
                                    width: wp('94%'),
                                    height: wp('11%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    elevation: 4,
                                    backgroundColor: '#C0BCBC',
                                    flexDirection: 'row',
                                    borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('5%'),
                                }} onPress={this.toggleModal}>
                                    <Text style={styles.selectproductsdiable}>{"FG Batch No"}</Text>
                                    <SvgUri width="17" height="13" fill='#6B829D' svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />

                                </View> :
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
                            }

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
                                            <Text style={styles.btntext}>{'Start'.toUpperCase()}</Text>
                                        )
                                }
                                {/* <Text style={styles.btntext}>{'Start'}</Text> */}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
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

export default withNavigation(RMAssign);
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
    }
});