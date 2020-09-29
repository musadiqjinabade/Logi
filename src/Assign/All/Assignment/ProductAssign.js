import React, { Component } from 'react';
import { Text, View, StatusBar, TextInput, StyleSheet, TouchableOpacity, AsyncStorage, ToastAndroid, Dimensions, ActivityIndicator, FlatList } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container } from 'native-base';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import SearchableDropdown from '../searchablebleDropdown';
import svgImages from '../../../Images/images';
import APIService from '../../../component/APIServices';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from "moment";
import Headers from '../../../component/Headers'
import Modal from 'react-native-modalbox';

class ProductAssign extends Component {
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
            userdata: '',
            country: '',
            isModalCountry: false,
            CountryData: '',
            loading: true,
            workorder: '',
            sublocation: '',
            TagsData: [],
            SelectedTags: []
        }
    }

    async componentDidMount() {
        this.getDetails()
        await AsyncStorage.getItem('SelectedLocation').then((value) => {
            var location = JSON.parse(value);
            this.setState({
                locationId: location.id ? location.id : location.value,
                locationName: location.itemName ? location.itemName : location.label
            })
        });
        await AsyncStorage.getItem('Sublocation').then((value) => {
            var sublocation = JSON.parse(value);
            this.setState({
                sublocation: sublocation
            })
        });
        this.setState({ data: this.props.navigation.state.params.item, sequence_number: this.props.navigation.state.params.item1 })
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
        var response = await APIService.execute('GET', APIService.URLTEST + 'product/listproductname', null)
        this.setState({ Product: response.data.data })
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
            })
            var response = await APIService.execute('GET', APIService.URLTEST + 'product/listproductname', null)
            this.setState({ Product: response.data.data })
        })
    }

    TagsData() {
        this.props.navigation.navigate('SearchableTags', { item: this.state.TagsData })
        console.log("select tag", this.state.TagsData)
    }

    async getDetails() {
        this.setState({ loading: true })
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
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    selectState = () => {
        this.setState({ isStateModalVisible: !this.state.isStateModalVisible }, () => {
            this.setState({ stateData: this.Totalstates })
        });
    };

    renderModalContent = () => {
        if (this.state.isModalVisible || this.state.isStateModalVisible || this.state.loading) {
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
        if (this.state.products) {
            this.setState({ loading: true })
            var manu_date = moment(this.state.manufacture).unix()
            var expiry_date = moment(this.state.expiry).unix()
            let data = {}
            data.sequence_number = this.state.sequence_number
            data.job_id = this.state.data.job_id || null
            data.product_id = this.state.products.id || 0
            data.batch_no = this.state.batch_no
            data.product_mrp = this.state.mrp
            data.manu_date = manu_date
            data.exp_date = expiry_date
            data.location_id = this.state.locationId
            data.location_name = this.state.locationName || null
            data.manu_location = this.state.manufactureloc
            data.target_state = this.state.selectedState.name || null
            data.workorderno = this.state.workorder || null
            data.sub_location_id = this.state.sublocation.id || null
            data.tag_name = this.state.SelectedTags.length > 0 ? this.state.SelectedTags : []

            var start = await APIService.execute('POST', APIService.URLBACKEND + 'assignment/assignandmap', data)

            if (start.data.status_code == 200) {
                ToastAndroid.show(start.data.message, ToastAndroid.LONG, 25, 50);
                this.props.navigation.goBack()
                this.setState({ loading: false })
            }
            else if (start.data.status_code == 400) {
                ToastAndroid.show(start.data.message, ToastAndroid.LONG, 25, 50);
                this.setState({ loading: false })
            }
            this.setState({ loading: false })

        } else {
            ToastAndroid.show('Select Product', ToastAndroid.LONG, 25, 50);
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

        if (moment(date).isBefore(moment().format("DD MMMM YYYY"), 'day') || moment(date).isSame(moment().format("DD MMMM YYYY"), 'day')) {
            this.setState({
                manufacture: date,
                obj
            }, () => console.log('obj is', obj, this.state.manufacture))
        }
        else {
            ToastAndroid.show('Please Select Valid Manufacturing Date', ToastAndroid.LONG, 25, 50);
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
            ToastAndroid.show('Please Select Manufacturing Date', ToastAndroid.LONG, 25, 50);
        }
    };

    async cancelJob() {
        this.refs.redirectHome.close()
        var data = {}
        data.mapping_id = this.state.data.job_id || null
        var cancelJobresponse = await APIService.execute('DELETE', APIService.URLBACKEND + 'mapping/canceljob', data)
        if (cancelJobresponse.data.status_code == 200) {
            ToastAndroid.show(cancelJobresponse.data.message, ToastAndroid.LONG, 25, 50);
            this.props.navigation.navigate('Dashboard')
        }
    }


    render() {
        return (
            <Container style={{ flex: 1, backgroundColor: '#F5F5F4' }}>
                <Headers isHome={true} onBackHome={() => { this.refs.redirectHome.open() }} label={'Assigns'} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1, width: widthPercentageToDP('100%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', paddingLeft: widthPercentageToDP('3%'), paddingRight: 10, paddingBottom: 10, marginBottom: 30, marginTop: widthPercentageToDP('2%') }}>
                            {this.state.checked ?
                                <View style={{ height: widthPercentageToDP('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%') }}>
                                    <Text style={styles.productsdisable}>Product</Text>
                                    <Text style={{ color: '#EEBBBB' }}>*</Text>
                                </View> :

                                <View style={{ height: widthPercentageToDP('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%') }}>
                                    <Text style={styles.products}>Product</Text>
                                    <Text style={{ color: 'red' }}>*</Text>
                                </View>
                            }
                            {this.state.checked ?
                                <View style={{
                                    width: widthPercentageToDP('94%'),
                                    height: widthPercentageToDP('11%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    elevation: 4,
                                    backgroundColor: '#C0BCBC',
                                    flexDirection: 'row',
                                    borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                                }} onPress={this.toggleModal}>
                                    <Text style={styles.selectproductsdiable}>{"Select a Product"}</Text>
                                    <SvgUri width="17" height="13" fill='#6B829D' svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: widthPercentageToDP('4%'), marginRight: widthPercentageToDP('4%') }} />
                                </View>
                                : <TouchableOpacity style={{
                                    width: widthPercentageToDP('94%'),
                                    height: widthPercentageToDP('11%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    elevation: 4,
                                    backgroundColor: '#FFFFFF',
                                    flexDirection: 'row',
                                    borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                                }} onPress={this.toggleModal}>
                                    <Text numberOfLines={1} style={styles.selectproducts}>{this.state.products.itemName || "Select a Product"}</Text>
                                    <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: widthPercentageToDP('4%'), marginRight: widthPercentageToDP('4%') }} />
                                </TouchableOpacity>
                            }
                            {this.state.checked ? <View style={{ height: widthPercentageToDP('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%') }}>
                                <Text style={styles.productsdisable}>Batch</Text>
                                {/* <Text style={{ color: '#EEBBBB' }}>*</Text> */}
                            </View> :
                                <View style={{ height: widthPercentageToDP('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%') }}>
                                    <Text style={styles.products}>Batch</Text>
                                    {/* <Text style={{ color: 'red' }}>*</Text> */}
                                </View>
                            }

                            {this.state.checked ? <View style={{
                                width: widthPercentageToDP('94%'),
                                height: widthPercentageToDP('11%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: '#C0BCBC',
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                            }}>
                                <TextInput
                                    style={styles.batchstyle}
                                    value=''
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={false}
                                    keyboardType='default'
                                    returnKeyType="next"
                                    placeholder={'Select a Batch'}
                                    onFocus={false}
                                    onBlur={this.handleBlur}
                                    placeholderTextColor="gray"
                                ></TextInput>
                            </View> :
                                <View style={{
                                    width: widthPercentageToDP('94%'),
                                    height: widthPercentageToDP('11%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    elevation: 4,
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                                }}>
                                    <TextInput
                                        style={styles.batchstyle}
                                        value={(this.state.batch_no || '')}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType='default'
                                        returnKeyType="next"
                                        placeholder={'Select a Batch'}
                                        onFocus={this.handleFocus}
                                        onBlur={this.handleBlur}
                                        placeholderTextColor="gray"
                                        placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                        onChangeText={(text) => this.setState({
                                            batch_no: text
                                        })}></TextInput>
                                </View>
                            }
                            {this.state.checked ? <View style={{ height: widthPercentageToDP('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%') }}>
                                <Text style={styles.productsdisable}>MRP</Text>
                                {/* <Text style={{ color: '#EEBBBB' }}>*</Text> */}
                            </View> :
                                <View style={{ height: widthPercentageToDP('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%') }}>
                                    <Text style={styles.products}>MRP</Text>
                                    {/* <Text style={{ color: 'red' }}>*</Text> */}
                                </View>
                            }
                            {this.state.checked ? <View style={{
                                width: widthPercentageToDP('94%'),
                                height: widthPercentageToDP('11%'),
                                shadowOffset: { width: 0, height: 2 },
                                flexDirection: 'row',
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: '#C0BCBC',
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                            }}>
                                <TouchableOpacity
                                    onPress={this.toggleCountry} style={{
                                        width: widthPercentageToDP('13%'),
                                        height: widthPercentageToDP('11%'), fontSize: 14, justifyContent: 'center', backgroundColor: '#C0BCBC', borderRadius: 5, shadowColor: '#F1F1F1', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, elevation: 2, shadowRadius: 1
                                    }}>
                                    <Text style={{ justifyContent: 'center', alignSelf: 'center', color: '#494848' }}>{this.state.country ? this.state.country.currency : '--'}</Text>
                                    <SvgUri width="17" height="13" fill={'#000'} svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', marginTop: widthPercentageToDP('1%'), marginLeft: widthPercentageToDP('2%') }} />
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.batchstyle}
                                    // value={(this.state.mrp || '')}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType='default'
                                    returnKeyType="next"
                                    placeholder={'Enter Product MRP'}
                                    editable={false}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    placeholderTextColor="gray"
                                    placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                ></TextInput>
                            </View> :
                                <View style={{
                                    width: widthPercentageToDP('94%'),
                                    height: widthPercentageToDP('11%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    flexDirection: 'row',
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    elevation: 4,
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                                }}>
                                    <View style={{
                                        width: widthPercentageToDP('13%'),
                                        height: widthPercentageToDP('11%'), fontSize: 14, justifyContent: 'center', backgroundColor: '#BDBCBC', borderRadius: 5, shadowColor: '#F1F1F1', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, elevation: 2, shadowRadius: 1
                                    }}>
                                        <Text style={{ justifyContent: 'center', alignSelf: 'center', color: '#000' }}>{this.state.country ? this.state.country.currency : '--'}</Text>
                                    </View>
                                    <TextInput
                                        style={styles.batchstyle}
                                        value={(this.state.mrp || '')}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType={"numeric"}
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
                            }
                            <View style={{ height: widthPercentageToDP('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%') }}>
                                <Text style={this.state.checked ? styles.productsdisable : styles.products}>Manufacturing Date</Text>
                                {/* <Text style={{ color: this.state.checked ? '#EEBBBB' : 'red' }}>*</Text> */}
                            </View>
                            <TouchableOpacity
                                onPress={this._showDateTimeManfacture}
                                style={{
                                    width: widthPercentageToDP('94%'),
                                    height: widthPercentageToDP('11%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    elevation: 4,
                                    backgroundColor: this.state.checked ? "#C0BCBC" : '#FFFFFF',
                                    borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                                }}>
                                <Text style={{
                                    paddingLeft: 6,
                                    marginTop: 9,
                                    flexDirection: 'row',
                                    fontFamily: 'Montserrat-Regular',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    flex: 1,
                                    height: widthPercentageToDP('11%'),
                                    color: '#000000',
                                    fontSize: 14,
                                }}>{this.state.manufacture || 'Select Manufacture Date'}</Text>
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerManufacture}
                                onConfirm={(value) => this._handleDateManufacture('manufacture', moment(value).format("DD MMMM YYYY"))}
                                onCancel={this._hideDateTimeManufacture} />
                            <View style={{ height: widthPercentageToDP('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%') }}>
                                <Text style={this.state.checked ? styles.productsdisable : styles.products}>Expiry Date</Text>
                                {/* <Text style={{ color: this.state.checked ? '#EEBBBB' : 'red' }}>*</Text> */}
                            </View>
                            <TouchableOpacity
                                onPress={this._showDateTimeExpiry}
                                style={{
                                    width: widthPercentageToDP('94%'),
                                    height: widthPercentageToDP('11%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    elevation: 4,
                                    backgroundColor: this.state.checked ? "#C0BCBC" : '#FFFFFF',
                                    borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                                }}>
                                <Text style={{
                                    paddingLeft: 6,
                                    marginTop: 9,
                                    flexDirection: 'row',
                                    fontFamily: 'Montserrat-Regular',
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                    flex: 1,
                                    height: widthPercentageToDP('11%'),
                                    color: '#000000',
                                    fontSize: 14,
                                }}>{this.state.expiry || 'Select Expiry Date'}</Text>
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerExpiry}
                                onConfirm={(value) => this._handleDateExpiry('expiry', moment(value).format("DD MMMM YYYY"))}
                                onCancel={this._hideDateTimeExpiry} />
                            <View style={{ height: widthPercentageToDP('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%') }}>
                                <Text style={this.state.checked ? styles.productsdisable : styles.products}>Manufacturing Location</Text>
                            </View>
                            <View style={{
                                width: widthPercentageToDP('94%'),
                                height: widthPercentageToDP('11%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: this.state.checked ? "#C0BCBC" : '#FFFFFF',
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
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
                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%'), }}>
                                <Text style={this.state.checked ? styles.productsdisable : styles.products}>Target state</Text>
                                {/* <Text style={{ color: this.state.checked ? '#EEBBBB' : 'red' }}>*</Text> */}
                            </View>
                            {this.state.checked ?
                                <View style={{
                                    width: widthPercentageToDP('94%'),
                                    height: widthPercentageToDP('11%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    elevation: 4,
                                    backgroundColor: '#C0BCBC',
                                    flexDirection: 'row',
                                    borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                                }} onPress={this.toggleModal}>
                                    <Text style={styles.selectproductsdiable}>{"Select target state"}</Text>
                                    <SvgUri width="17" height="13" fill='#6B829D' svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: widthPercentageToDP('4%'), marginRight: widthPercentageToDP('4%') }} />
                                </View> :
                                <TouchableOpacity style={{
                                    width: widthPercentageToDP('94%'),
                                    height: widthPercentageToDP('11%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    elevation: 4,
                                    backgroundColor: '#FFFFFF',
                                    flexDirection: 'row',
                                    borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                                }} onPress={this.selectState}>
                                    <Text style={styles.selectproducts}>{this.state.selectedState.name || "Select target state"}</Text>
                                    <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: widthPercentageToDP('4%'), marginRight: widthPercentageToDP('4%') }} />
                                </TouchableOpacity>
                            }
                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%'), }}>
                                <Text style={this.state.checked ? styles.productsdisable : styles.products}>Tags</Text>
                            </View>
                            <TouchableOpacity style={{
                                width: widthPercentageToDP('94%'),
                                height: widthPercentageToDP('11%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: '#FFFFFF',
                                flexDirection: 'row',
                                borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                            }} onPress={() => this.TagsData()} >
                                {this.state.TagsData !== null && this.state.TagsData.length > 0 ?
                                    <View style={styles.selectBackgroundStyle} >
                                        <Text style={styles.selectproducts}>{' (' + this.state.TagsData.length + ') Tags selected'}</Text>
                                        <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: widthPercentageToDP('4%'), marginRight: widthPercentageToDP('4%') }} />
                                    </View> :
                                    <View style={styles.selectBackgroundStyle} >
                                        <Text style={styles.selectproducts}>{"Select tags"}</Text>
                                        <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: widthPercentageToDP('4%'), marginRight: widthPercentageToDP('4%') }} />
                                    </View>}
                            </TouchableOpacity>
                            {this.state.SelectedTags !== null && this.state.SelectedTags.length > 0 ? <View style={{
                                flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignSelf: 'flex-start', marginBottom: widthPercentageToDP('2%')
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
                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%'), }}>
                                <Text style={this.state.checked ? styles.productsdisable : styles.products}>Work Order Number</Text>
                            </View>
                            <View style={{
                                width: widthPercentageToDP('94%'),
                                height: widthPercentageToDP('11%'),
                                // marginRight: widthPercentageToDP('10%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: this.state.checked ? "#C0BCBC" : '#FFFFFF',
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                            }}>
                                <TextInput
                                    style={styles.batchstyle}
                                    value={(this.state.workorder || '')}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType='default'
                                    returnKeyType="next"
                                    placeholder={'Enter Work Order Number'}
                                    // editable={this.state.checked ? false : true}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    placeholderTextColor="gray"
                                    placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                    onChangeText={(text) => this.setState({
                                        workorder: text
                                    })}></TextInput>
                            </View>
                            <TouchableOpacity onPress={() =>
                                this.start_All()
                                // this.props.navigation.navigate('Scanproduct')
                            } style={{
                                width: widthPercentageToDP('94%'),
                                height: widthPercentageToDP('13%'),
                                // marginHorizontal:widthPercentageToDP('10%'),
                                marginTop: widthPercentageToDP('3%'),
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
                            <View style={{ /*height: widthPercentageToDP('65%'),*/ width: widthPercentageToDP('65%'), justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10 }} >
                                <TouchableOpacity style={{ width: widthPercentageToDP('10%'), height: widthPercentageToDP('5%'), justifyContent: 'center', alignSelf: 'flex-end', alignItems: 'flex-end' }} onPress={() => { this.refs.redirectHome.close() }} >
                                    <SvgUri width="20" height="20" svgXmlData={svgImages.close} style={{ resizeMode: 'contain' }} />
                                </TouchableOpacity>
                                <SvgUri width="55" height="55" svgXmlData={svgImages.checkmark} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', marginTop: widthPercentageToDP('4%') }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', padding: 5 }}>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 16, color: '#1D3567' }}>Confirmation</Text>
                                </View>
                                <View style={{ justifyContent: 'center', alignSelf: 'center', flex: 1 }}>
                                    <Text style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567', textAlign: 'center' }}>Do you want to go back without completing job ?</Text>
                                </View>
                                <View style={{ justifyContent: 'space-between', alignSelf: 'center', flex: 1, flexDirection: 'row', marginBottom: widthPercentageToDP('2%') }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.refs.redirectHome.close()
                                            this.props.navigation.navigate('Dashboard')
                                        }}
                                        style={{
                                            width: widthPercentageToDP('26%'), height: widthPercentageToDP('12%'), shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            shadowColor: '#CECECE',
                                            margin: widthPercentageToDP('2%'),
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
                                            width: widthPercentageToDP('26%'), height: widthPercentageToDP('12%'), shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            shadowColor: '#CECECE',
                                            margin: widthPercentageToDP('2%'),
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
            </Container>
        )
    }
}

export default withNavigation(ProductAssign);
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
        marginLeft: widthPercentageToDP('2%'),
        color: '#636363'
    },
    selectproductsdiable: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: widthPercentageToDP('2%'),
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
        width: widthPercentageToDP('75%'),
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
        width: widthPercentageToDP('75%'),
        height: widthPercentageToDP('11%'),
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
    modal4: {
        maxHeight: 300,
        minHeight: 80
    },
    modal1: {
        maxHeight: 260,
        minHeight: 80
    },
    selectBackgroundStyle: {
        width: widthPercentageToDP('94%'),
        height: widthPercentageToDP('11%'),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowColor: '#CECECE',
        shadowRadius: 3,
        elevation: 4,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
    }
});