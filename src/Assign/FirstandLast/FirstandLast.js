import React, { Component } from 'react';
import { Text, View, Keyboard, FlatList, StatusBar, TextInput, StyleSheet, TouchableOpacity, AsyncStorage, ToastAndroid, Dimensions, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container, Toast } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import SearchableDropdown from './searchablebleDropdown';
import RMDropdown from './RMDropdown';
import VendorDropdown from './VendorDropdown'
import svgImages from '../../Images/images';
import APIService from '../../component/APIServices';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from "moment";
import Headers from '../../component/Headers';
import color from '../../component/color';

class FirstandLast extends Component {
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
            first: '',
            last: '',
            batch: '',
            Product: '',
            products: '',
            isVisible: true,
            checked: false,
            progressText: 'Loading...',
            manufacture: null,
            mrp: '',
            expiry: null,
            manufactureloc: '',
            targetstate: '',
            isDateTimePickerManufacture: false,
            isDateTimePickerExpiry: false,
            obj: {},
            selectedState: '',
            expanded: true,
            userdata: '',
            country: '',
            isModalCountry: false,
            CountryData: '',
            TagsData: [],
            workorder: '',
            SelectedTags: [],
            Rawmaterial: false,
            isRMModalVisible: false,
            isVendorModalVisible: false,
            isDocumentVisible: false,
            Rawmaterialdata: '',
            RawmaterialVendor: '',
            RMbatch: '',
            FGbatch: '',
            finish_loading: false,
            sublocation: '',
            locationId: '',
            locationName: ''

        }
    }

    RMtoggleModal = () => {
        this.setState({ isRMModalVisible: !this.state.isRMModalVisible });
    }

    VendortoggleModal = () => {
        this.setState({ isVendorModalVisible: !this.state.isVendorModalVisible });
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    toggleCountry = () => {
        this.setState({ isModalCountry: !this.state.isModalCountry }, async () => {
            console.log('country:', this.state.countryData)
            this.setState({ CountryData: this.state.countryData })
        });
    };

    renderModalContent = () => {
        if (this.state.isModalVisible || this.state.isStateModalVisible || this.state.isModalCountry || this.state.loading) {
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

    componentWillReceiveProps(item) {
        if (item.navigation.state.params.id == 1) {
            this.setState({ first: item.navigation.state.params.item, Rawmaterial: item.navigation.state.params.Rawmaterial })
        }
        else if (item.navigation.state.params.id == 2) {
            this.setState({ last: item.navigation.state.params.item })
        }
        console.log("item.navigation.state.params.item:", item.navigation.state.params.Rawmaterial)

    }


    showMessage(message) {
        Toast.show({
            text: message,
            duration: 2000
        })
    }

    componentDidMount() {
        this.setState({ loading: true }, async () => {
            var tags = await AsyncStorage.getItem('Tagsdata')
            console.log("tag:", tags);
            var myArray = []
            if (tags != null) {
                myArray = JSON.parse(tags)
            }
            this.setState({ TagsData: myArray }, () => {
                console.log('length:', this.state.TagsData)
            })
            var SelectedTags = await AsyncStorage.getItem('SelectedTags')
            var SelectedArray = []
            if (SelectedTags != null) {
                SelectedArray = JSON.parse(SelectedTags)
            }
            this.setState({ SelectedTags: SelectedArray }, () => {
                console.log('SelectedTags:', this.state.SelectedTags)
            })
            await AsyncStorage.getItem('SelectedLocation').then((value) => {
                var location = JSON.parse(value);
                this.setState({
                    locationId: location.id ? location.id : location.value,
                    locationName: location.itemName ? location.itemName : location.label
                })
            });
            var subL = await AsyncStorage.getItem('Sublocation');
            this.setState({
                sublocation: subL
            }, () => { console.log("sublocation : ", subL) })
            this.getDetails()

            var response = await APIService.execute('GET', APIService.URLTEST + 'product/listproductname', null)
            this.setState({ Product: response.data.data })

        })

        this.focusListener = this.props.navigation.addListener('didFocus', async () => {
            this.setState({ loading: true }, async () => {
                var tags = await AsyncStorage.getItem('Tagsdata')
                console.log("tag:", tags);
                var myArray = []
                if (tags != null) {
                    myArray = JSON.parse(tags)
                }
                this.setState({ TagsData: myArray, loading: false }, () => {
                    console.log('length:', this.state.TagsData)
                })
                var SelectedTags = await AsyncStorage.getItem('SelectedTags')
                var SelectedArray = []
                if (SelectedTags != null) {
                    SelectedArray = JSON.parse(SelectedTags)
                }
                this.setState({ SelectedTags: SelectedArray }, () => {
                    console.log('SelectedTags:', this.state.SelectedTags)
                })
                // this.getDetails()
                var response = await APIService.execute('GET', APIService.URLTEST + 'product/listproductname', null)
                this.setState({ Product: response.data.data })
            })
        })
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

    TagsData() {
        this.props.navigation.navigate('SearchableTags', { item: this.state.TagsData })
        console.log("select tag", this.state.TagsData)
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
            ToastAndroid.show('No user Country', ToastAndroid.LONG, 25, 50);
        }
    }

    async Rawfirstlaststart() {
        this.setState({ finish_loading: true })
        if (this.state.first != '') {
            if (this.state.first.length == '10') {
                if (this.state.last != '') {
                    if (this.state.last.length == '10') {

                        Keyboard.dismiss();
                        this.setState({ finish_loading: true })
                        // var manufactureDate 
                        if (this.state.manufacture) {
                            var manufactureDate = moment(this.state.manufacture).unix()
                        }
                        if (this.state.expiry) {
                            var expiryDate = moment(this.state.expiry).unix()
                        }
                        if (this.state.Rawmaterialdata) {
                            if (this.state.RawmaterialVendor) {
                                console.log('this.state.manufacture', this.state.manufacture, this.state.expiry)
                                if (this.state.manufacture == null || this.state.expiry == null || manufactureDate < expiryDate) {
                                    let data = {}
                                    data.qr_from = parseInt(this.state.first)
                                    data.qr_to = parseInt(this.state.last)
                                    data.rm_id = this.state.Rawmaterialdata.rm_id || null
                                    data.vendor_id = this.state.RawmaterialVendor.recipient_id || null
                                    data.invoice_no = this.state.invoice_no || null
                                    data.receipt_date = manufactureDate || null
                                    data.exp_date = expiryDate || null
                                    data.fg_batch_no = this.state.FGbatch || null
                                    data.rm_batch_no = this.state.RMbatch || null
                                    console.log("body", data)
                                    var start = await APIService.execute('POST', APIService.URLBACKEND + 'rowmaterial/rmassignfistandlast', data)
                                    console.log("start", start)
                                    if (start == 'SyntaxError: Unexpected token < in JSON at position 0') {
                                        ToastAndroid.show('Incorrect range provided', ToastAndroid.LONG, 25, 50);
                                    }
                                    else {
                                        if (start.data.status == 200) {
                                            ToastAndroid.show(start.data.message, ToastAndroid.LONG, 25, 50);
                                            await AsyncStorage.setItem('SelectedTags', "")
                                            this.props.navigation.navigate('Dashboard')
                                        } else if (start.data.status == 400) {
                                            ToastAndroid.show(start.data.message, ToastAndroid.LONG, 25, 50);
                                            // this.props.navigation.navigate('Dashboard')
                                        }
                                    }
                                    this.setState({ finish_loading: false })
                                }
                                else {
                                    ToastAndroid.show('Select Valid Expiry Date', ToastAndroid.LONG, 25, 50);
                                    this.setState({ finish_loading: false })
                                }
                            }
                            else {
                                ToastAndroid.show('Please Select Vendor', ToastAndroid.LONG, 25, 50);
                                this.setState({ finish_loading: false })
                            }
                        }
                        else {
                            ToastAndroid.show('Please Select Raw Material', ToastAndroid.LONG, 25, 50);
                            this.setState({ finish_loading: false })
                        }
                    } else {
                        ToastAndroid.show('Please Enter Valid Last Product', ToastAndroid.LONG, 25, 50);
                        this.setState({ finish_loading: false })
                    }
                } else {
                    ToastAndroid.show('Select Scan a Last Product', ToastAndroid.LONG, 25, 50);
                    this.setState({ finish_loading: false })
                }
            } else {
                ToastAndroid.show('Please Enter Valid First Product', ToastAndroid.LONG, 25, 50);
                this.setState({ finish_loading: false })
            }
        } else {
            ToastAndroid.show('Select Scan a First Product', ToastAndroid.LONG, 25, 50);
            this.setState({ finish_loading: false })
        }
    }

    async firstlaststart() {
        this.setState({ finish_loading: true })
        if (this.state.first != '') {
            if (this.state.first.length == '10') {
                if (this.state.last != '') {
                    if (this.state.last.length == '10') {
                        Keyboard.dismiss();
                        this.setState({ finish_loading: true })
                        // var manufactureDate 
                        if (this.state.manufacture) {
                            var manufactureDate = moment(this.state.manufacture).unix().toString();
                        }
                        if (this.state.expiry) {
                            var expiryDate = moment(this.state.expiry).unix().toString();
                        }
                        // var location = await APIService.execute('POST', APIService.URLBACKEND + 'settings/getlocations');
                        if (this.state.products) {
                            if (this.state.manufacture == null || this.state.expiry == null || manufactureDate < expiryDate) {
                                //     if (this.state.mrp) {
                                //         if (this.state.manufactureloc) {
                                let data = {}
                                data.from_uqr = parseInt(this.state.first)
                                data.to_uqr = parseInt(this.state.last)
                                data.product_id = this.state.products.id
                                data.batch_no = this.state.batch
                                data.product_mrp = this.state.mrp ? parseInt(this.state.mrp) : null
                                data.manu_date = manufactureDate || null
                                data.exp_date = expiryDate || null
                                data.target_state = this.state.targetstate
                                data.manu_location = this.state.manufactureloc
                                data.target_state = this.state.selectedState.name || null
                                data.location_id = this.state.locationId
                                data.location_name = this.state.locationName || null
                                data.job_id = null
                                data.tag_ids = this.state.TagsData != null ? this.state.TagsData : null
                                data.currency_prefix = this.state.country ? this.state.country.currency : null
                                data.workorderno = this.state.workorder || null
                                data.sub_location_id = this.state.sublocation || null

                                console.log("body", data)
                                await AsyncStorage.removeItem('Tagsdata');
                                await AsyncStorage.removeItem('SelectedTags');
                                var start = await APIService.execute('POST', APIService.URLBACKEND + 'assignment/assignfistandlast', data)
                                if (start == 'SyntaxError: Unexpected token < in JSON at position 0') {
                                    ToastAndroid.show('Incorrect Range Provided', ToastAndroid.LONG, 25, 50);
                                }
                                else {
                                    if (start.data.status_code == 200) {
                                        ToastAndroid.show(start.data.message, ToastAndroid.LONG, 25, 50);
                                        await AsyncStorage.setItem('SelectedTags', "")
                                        this.props.navigation.navigate('Dashboard')
                                    } else if (start.data.status_code == 400) {
                                        ToastAndroid.show(start.data.message, ToastAndroid.LONG, 25, 50);
                                        // this.props.navigation.navigate('Dashboard')
                                    }
                                }
                                this.setState({ finish_loading: false })
                            }
                            else {
                                ToastAndroid.show('Select Valid Expiry Date', ToastAndroid.LONG, 25, 50);
                                this.setState({ finish_loading: false })
                            }
                        } else {
                            ToastAndroid.show('Select Product', ToastAndroid.LONG, 25, 50);
                            this.setState({ finish_loading: false })
                        }
                    } else {
                        ToastAndroid.show('Please Enter Valid Last Product', ToastAndroid.LONG, 25, 50);
                        this.setState({ finish_loading: false })
                    }
                } else {
                    ToastAndroid.show('Select Scan a Last Product', ToastAndroid.LONG, 25, 50);
                    this.setState({ finish_loading: false })
                }
            } else {
                ToastAndroid.show('Please Enter Valid First Product', ToastAndroid.LONG, 25, 50);
                this.setState({ finish_loading: false })
            }
        } else {
            ToastAndroid.show('Select Scan a First Product', ToastAndroid.LONG, 25, 50);
            this.setState({ finish_loading: false })
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
            this.state.Rawmaterial ?
                ToastAndroid.show('Please Select Valid Receipt Date', ToastAndroid.LONG, 25, 50)
                :
                ToastAndroid.show('Please Select Valid Manufacturing Date', ToastAndroid.LONG, 25, 50)
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
            ToastAndroid.show('Please Select Manufacturing Date', ToastAndroid.LONG, 25, 50);
        }
    };

    selectState = () => {
        this.setState({ isStateModalVisible: !this.state.isStateModalVisible }, () => {
            this.setState({ stateData: this.Totalstates })
        });
    };

    render() {
        if (this.state.Rawmaterial) {
            return (
                <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                    <Headers isHome={true} onBackHome={() => { this.props.navigation.navigate('Dashboard') }} label={'Assign'} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                    <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                    <View style={styles.linearGradient}>
                        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='handled'>
                            <View style={{ flex: 1, width: wp('100%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', paddingHorizontal: 10, paddingBottom: 10, marginBottom: 30, marginTop: wp('5%') }}>
                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                    <Text style={styles.products}>Scan First QR Code</Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{
                                        width: wp('84%'),
                                        height: wp('11%'),
                                        // marginRight: wp('1%'),
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        flexDirection: 'row',
                                        shadowRadius: 3,
                                        elevation: 4,
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('5%'),
                                    }}>
                                        <TextInput
                                            style={styles.Firstbatchstyle}
                                            value={(this.state.first || '')}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            keyboardType='default'
                                            returnKeyType="next"
                                            placeholder={'Scan a First Product'}
                                            onFocus={this.handleFocus}
                                            onBlur={this.handleBlur}
                                            placeholderTextColor="gray"
                                            placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                            onChangeText={(text) => this.setState({
                                                first: text
                                            })}></TextInput>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Scanner', { id: 1 })}
                                        style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', margin: wp('2%') }}>
                                        <SvgUri width="35" height="25" svgXmlData={svgImages.photo_camera} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                    <Text style={styles.products}>Scan Last QR Code</Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{
                                        width: wp('84%'),
                                        height: wp('11%'),
                                        // marginRight: wp('1%'),
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        flexDirection: 'row',
                                        shadowRadius: 3,
                                        elevation: 4,
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('5%'),
                                    }}>
                                        <TextInput
                                            style={styles.Firstbatchstyle}
                                            value={(this.state.last || '')}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            keyboardType='default'
                                            returnKeyType="next"
                                            placeholder={'Scan a Last Product'}
                                            onFocus={this.handleFocus}
                                            onBlur={this.handleBlur}
                                            placeholderTextColor="gray"
                                            placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                            onChangeText={(text) => this.setState({
                                                last: text
                                            })}></TextInput>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Scanner', { id: 2 })}
                                        style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', margin: wp('2%') }}>
                                        <SvgUri width="35" height="25" svgXmlData={svgImages.photo_camera} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                    <Text style={styles.products}>Raw Material</Text>
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
                                }} onPress={this.RMtoggleModal}>
                                    <Text numberOfLines={1} style={styles.selectproducts}>{this.state.Rawmaterialdata.rm_name || "Select a Raw Material"}</Text>
                                    <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                                </TouchableOpacity>
                                <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
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
                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
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
                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
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

                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                    <Text style={styles.products}>RM Batch No</Text>
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
                                        value={(this.state.RMbatch || '')}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType='default'
                                        returnKeyType="next"
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
                                    <Text style={styles.products}>FG Batch No</Text>
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
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                    <View
                                        style={[styles.center, {
                                            marginTop: hp('1%'),
                                            width: wp('50%'),
                                            height: hp('8%'),
                                            borderTopLeftRadius: wp('2.5%'),
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            shadowColor: '#CECECE',
                                            shadowRadius: 3,
                                            elevation: 4,
                                            backgroundColor: '#FFFFFF',
                                            borderWidth: 0.2
                                        }]}>
                                        <View style={{ height: hp('8%'), justifyContent: 'center', alignSelf: 'center' }}>
                                            <Text style={styles.buttonCancel}>Cancel</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.Rawfirstlaststart()}>
                                    <LinearGradient
                                        colors={[color.gradientStartColor, color.gradientEndColor]}
                                        start={{ x: 0.0, y: 0.25 }} end={{ x: 1.2, y: 1.0 }}
                                        style={[styles.center, {
                                            marginTop: hp('1%'),
                                            width: wp('50%'),
                                            height: hp('8%'),
                                            borderWidth: 0.2,
                                            borderTopRightRadius: wp('2.5%'),
                                        }]}>
                                        {
                                            this.state.finish_loading === true ? (
                                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                    <View style={{ paddingRight: 10 }}>
                                                        <ActivityIndicator size={'small'} color='#FFFFFF' />
                                                    </View>
                                                    <View>
                                                        <Text style={styles.buttonStart}>Please Wait...</Text>
                                                    </View>
                                                </View>
                                            ) : (
                                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={styles.buttonStart}>{'Finish'}</Text>
                                                    </View>
                                                )
                                        }
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                        {this.renderModalContent()}
                    </View>
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
                </Container>
            )
        }
        else {
            return (
                <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                    <Headers isHome={true} onBackHome={() => { this.props.navigation.navigate('Dashboard') }} label={'Assign'} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />

                    <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                    <View style={styles.linearGradient}>
                        <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='handled'>
                            <View style={{ flex: 1, width: wp('100%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', paddingHorizontal: 10, paddingBottom: 10, marginBottom: 30, marginTop: wp('5%') }}>
                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                    <Text style={styles.products}>Scan First QR Code</Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{
                                        width: wp('84%'),
                                        height: wp('11%'),
                                        // marginRight: wp('1%'),
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        flexDirection: 'row',
                                        shadowRadius: 3,
                                        elevation: 4,
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('5%'),
                                    }}>
                                        <TextInput
                                            style={styles.Firstbatchstyle}
                                            value={(this.state.first || '')}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            keyboardType='default'
                                            returnKeyType="next"
                                            placeholder={'Scan a First Product'}
                                            onFocus={this.handleFocus}
                                            onBlur={this.handleBlur}
                                            placeholderTextColor="gray"
                                            placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                            onChangeText={(text) => this.setState({
                                                first: text
                                            })}></TextInput>

                                    </View>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Scanner', { id: 1 })}
                                        style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', margin: wp('2%') }}>
                                        <SvgUri width="35" height="25" svgXmlData={svgImages.photo_camera} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                    <Text style={styles.products}>Scan Last QR Code</Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row' }}>
                                    <View style={{
                                        width: wp('84%'),
                                        height: wp('11%'),
                                        // marginRight: wp('1%'),
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        flexDirection: 'row',
                                        shadowRadius: 3,
                                        elevation: 4,
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('5%'),
                                    }}>
                                        <TextInput
                                            style={styles.Firstbatchstyle}
                                            value={(this.state.last || '')}
                                            autoCapitalize="none"
                                            autoCorrect={false}
                                            keyboardType='default'
                                            returnKeyType="next"
                                            placeholder={'Scan a Last Product'}
                                            onFocus={this.handleFocus}
                                            onBlur={this.handleBlur}
                                            placeholderTextColor="gray"
                                            placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                            onChangeText={(text) => this.setState({
                                                last: text
                                            })}></TextInput>
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => this.props.navigation.navigate('Scanner', { id: 2 })}
                                        style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', margin: wp('2%') }}>
                                        <SvgUri width="35" height="25" svgXmlData={svgImages.photo_camera} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                    <Text style={styles.products}>Product Name</Text>
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
                                }} onPress={this.toggleModal}>
                                    <Text numberOfLines={1} style={styles.selectproducts}>{this.state.products.itemName || "Select a Product"}</Text>
                                    <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                                </TouchableOpacity>
                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                    <Text style={styles.products}>Batch No</Text>
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
                                        value={(this.state.batch || '')}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType='default'
                                        returnKeyType="next"
                                        placeholder={'Enter Batch No'}
                                        onFocus={this.handleFocus}
                                        onBlur={this.handleBlur}
                                        placeholderTextColor="gray"
                                        placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                        onChangeText={(text) => this.setState({
                                            batch: text
                                        })}></TextInput>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                    <Text style={styles.products}>MRP</Text>
                                </View>
                                <View style={{
                                    width: wp('94%'),
                                    height: wp('11%'),
                                    // marginRight: wp('10%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    flexDirection: 'row',
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    elevation: 4,
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('5%'),
                                }}>
                                    <TouchableOpacity
                                        onPress={this.toggleCountry}
                                        style={{
                                            width: wp('20%'),
                                            flexDirection: 'row',
                                            height: wp('11%'), fontSize: 14, justifyContent: 'center', backgroundColor: '#BDBCBC', borderRadius: 5, shadowColor: '#F1F1F1', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, elevation: 2, shadowRadius: 1
                                        }}>
                                        <Text style={{ justifyContent: 'center', alignSelf: 'center', color: '#000' }}>{this.state.country ? this.state.country.currency : '--'}</Text>
                                        <SvgUri width="17" height="13" fill={'#000'} svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', marginTop: wp('1%'), marginLeft: wp('2%') }} />
                                    </TouchableOpacity>
                                    <TextInput
                                        style={styles.batchstyle}
                                        value={(this.state.mrp || '')}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType='number-pad'
                                        returnKeyType="next"
                                        placeholder={'Enter Product MRP'}
                                        onFocus={this.handleFocus}
                                        onBlur={this.handleBlur}
                                        placeholderTextColor="gray"
                                        placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                        onChangeText={(text) => this.setState({
                                            mrp: text
                                        })}></TextInput>
                                </View>
                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                    <Text style={this.state.checked ? styles.productsdisable : styles.products}>Manufacturing Date</Text>
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
                                    }}>{this.state.manufacture || 'Enter Manufacturing Date'}</Text>

                                </TouchableOpacity>
                                <DateTimePicker
                                    isVisible={this.state.isDateTimePickerManufacture}
                                    onConfirm={(value) => this._handleDateManufacture('manufacture', moment(value).format("DD MMMM YYYY"))}
                                    onCancel={this._hideDateTimeManufacture} />

                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
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
                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                    <Text style={this.state.checked ? styles.productsdisable : styles.products}>Manufacturing Location</Text>
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
                                    backgroundColor: this.state.checked ? "#C0BCBC" : '#FFFFFF',
                                    borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('5%'),
                                }}>
                                    <TextInput
                                        style={styles.batchstyle}
                                        value={(this.state.manufactureloc || '')}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType='default'
                                        returnKeyType="next"
                                        editable={this.state.checked ? false : true}
                                        placeholder={'Enter Manufacturing Location'}
                                        onFocus={this.handleFocus}
                                        onBlur={this.handleBlur}
                                        placeholderTextColor="gray"
                                        placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                        onChangeText={(text) => this.setState({
                                            manufactureloc: text
                                        })}></TextInput>
                                </View>

                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                    <Text style={this.state.checked ? styles.productsdisable : styles.products}>Target state</Text>
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
                                        <Text style={styles.selectproductsdiable}>{"Select target state"}</Text>
                                        <SvgUri width="17" height="13" fill='#6B829D' svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                                    </View> :
                                    <TouchableOpacity style={{
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
                                    }} onPress={this.selectState}>
                                        <Text style={styles.selectproducts}>{this.state.selectedState.name || "Select target state"}</Text>
                                        <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                                    </TouchableOpacity>
                                }

                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                    <Text style={styles.products}>Dynamic Attributes</Text>
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
                                        value={(this.state.Dynattribute || '')}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType='default'
                                        returnKeyType="next"
                                        editable={true}
                                        placeholder={'Enter Dynamic Attribute'}
                                        onFocus={this.handleFocus}
                                        onBlur={this.handleBlur}
                                        placeholderTextColor="gray"
                                        placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                        onChangeText={(text) => this.setState({
                                            Dynattribute: text
                                        })}></TextInput>
                                </View>

                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                    <Text style={styles.products}>Tags</Text>
                                    {/* <Text style={{ color: this.state.checked ? '#EEBBBB' : 'red' }}>*</Text> */}
                                </View>

                                <TouchableOpacity style={{
                                    width: wp('94%'),
                                    height: wp('11%'),
                                    marginBottom: wp('5%'),
                                }}
                                    onPress={() => this.TagsData()}  >
                                    {this.state.TagsData !== null && this.state.TagsData.length > 0 ?
                                        <View style={styles.selectBackgroundStyle} >
                                            <Text style={styles.selectValues}>{' (' + this.state.TagsData.length + ') Tags selected'}</Text>
                                            <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                                        </View> :
                                        <View style={styles.selectBackgroundStyle} >
                                            <Text style={styles.selectValues}>{"Select tags"}</Text>
                                            <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                                        </View>}

                                </TouchableOpacity>
                                {this.state.SelectedTags !== null && this.state.SelectedTags.length > 0 ? <View style={{
                                    flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignSelf: 'flex-start', marginBottom: wp('2%')
                                }}>
                                    <FlatList
                                        // extraData={this.state.SelectedTags}
                                        data={this.state.SelectedTags}
                                        numColumns={3}
                                        renderItem={({ item }) => {
                                            console.log("item", item, this.state.SelectedTags)
                                            return (
                                                <View style={{ borderWidth: 1, borderColor: '#1D3567', borderRadius: 18, backgroundColor: '#fff', padding: 8, margin: 1, alignSelf: 'center' }}>
                                                    <Text style={{ color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: 12 }}>{item}</Text>
                                                </View>
                                            )
                                        }}
                                    />
                                </View> : null}

                                <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                    <Text style={styles.products}>Work Order Number</Text>
                                    {/* <Text style={{ color: 'red' }}>*</Text> */}
                                </View>

                                <View style={{
                                    width: wp('94%'),
                                    height: wp('11%'),
                                    // marginRight: widthPercentageToDP('10%'),
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
                                        value={(this.state.workorder || '')}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType='default'
                                        returnKeyType="next"
                                        placeholder={'Enter Work Order Number'}
                                        onFocus={this.handleFocus}
                                        onBlur={this.handleBlur}
                                        placeholderTextColor="gray"
                                        placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                        onChangeText={(text) => this.setState({
                                            workorder: text
                                        })}></TextInput>
                                </View>
                            </View>
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                                    <View
                                        style={[styles.center, {
                                            marginTop: hp('1%'),
                                            width: wp('50%'),
                                            height: hp('8%'),
                                            borderTopLeftRadius: wp('2.5%'),
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            shadowColor: '#CECECE',
                                            shadowRadius: 3,
                                            elevation: 4,
                                            backgroundColor: '#FFFFFF',
                                            borderWidth: 0.2
                                        }]}>
                                        <View style={{ height: hp('8%'), justifyContent: 'center', alignSelf: 'center' }}>
                                            <Text style={styles.buttonCancel}>Cancel</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => this.firstlaststart()}>
                                    <LinearGradient
                                        colors={[color.gradientStartColor, color.gradientEndColor]}
                                        start={{ x: 0.0, y: 0.25 }} end={{ x: 1.2, y: 1.0 }}
                                        style={[styles.center, {
                                            marginTop: hp('1%'),
                                            width: wp('50%'),
                                            height: hp('8%'),
                                            borderWidth: 0.2,
                                            borderTopRightRadius: wp('2.5%'),
                                        }]}>
                                        {
                                            this.state.finish_loading === true ? (
                                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                    <View style={{ paddingRight: 10 }}>
                                                        <ActivityIndicator size={'small'} color='#FFFFFF' />
                                                    </View>
                                                    <View>
                                                        <Text style={styles.buttonStart}>Please Wait...</Text>
                                                    </View>
                                                </View>
                                            ) : (
                                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Text style={styles.buttonStart}>{'Finish'}</Text>
                                                    </View>
                                                )
                                        }
                                    </LinearGradient>
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
                    {this.state.CountryData.length > 0 ? (
                        <SearchableDropdown
                            title={'Select Country'}
                            data={this.state.CountryData}
                            onSelect={(selectedItem) => {
                                this.setState({ country: selectedItem, isModalCountry: false })
                            }}
                            onCancel={() => { this.setState({ isModalCountry: false }) }}
                            isVisible={this.state.isModalCountry === true} />) : null}
                </Container>
            )
        }

    }
}

export default withNavigation(FirstandLast);

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
    Firstbatchstyle: {
        paddingLeft: 6,
        flexDirection: 'row',
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: wp('65%'),
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
    selectValues: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: wp('2%'),
        color: '#636363'
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
    buttonStart: {
        fontSize: hp('2.5%'),
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    buttonCancel: {
        fontSize: hp('2.5%'),
        color: '#000000',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    }
});