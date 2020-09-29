import React, { Component } from 'react';
import { Text, View, StatusBar, TextInput, StyleSheet, AsyncStorage, ToastAndroid, Dimensions, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container, CheckBox } from 'native-base';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import SearchableDropdown from './searchablebleDropdown';
import svgImages from '../../Images/images';
import APIService from '../../component/APIServices';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from "moment";
import Headers from '../../component/Headers';

class All extends Component {
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
            TagsData: [],
            SelectedTags: []
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
            // console.log('v', typeof (value));
            var location = JSON.parse(value);
            // console.log('location id and name', location);
            this.setState({
                locationId: location.id ? location.id : location.value,
                locationName: location.itemName ? location.itemName : location.label
            })
        });
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
        })
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
    }

    async start_All() {
        if (this.state.checked) {
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
        else {

            if (this.state.products) {
                // if (this.state.batch_no) {
                //     if (this.state.mrp) {

                // if (this.state.manufactureloc) {
                this.setState({ loading: true })


                var manu_date = moment(this.state.manufacture).unix()
                var expiry_date = moment(this.state.expiry).unix()
                if (this.state.manufacture == null || this.state.expiry == null || manu_date < expiry_date) {


                    let bodydata = {}
                    bodydata.product_id = this.state.products.id || 0
                    bodydata.batch_no = this.state.batch_no
                    bodydata.product_mrp = this.state.mrp
                    bodydata.manu_date = manu_date
                    bodydata.exp_date = expiry_date
                    bodydata.is_product_added = this.state.products.id ? true : false
                    bodydata.manu_location = this.state.manufactureloc
                    bodydata.target_state = this.state.selectedState.name || null
                    bodydata.location_id = this.state.locationId
                    bodydata.workorderno = this.state.workorder || null
                    bodydata.tag_name = this.state.SelectedTags.length > 0 ? this.state.SelectedTags : []

                    var start_assignall = await APIService.execute('POST', APIService.URLBACKEND + 'assignment/assignall', bodydata)
                    if (start_assignall.data.status_code == 200) {
                        ToastAndroid.show(start_assignall.data.message, ToastAndroid.LONG, 25, 50);
                        this.props.navigation.navigate('Scanproduct', { item: start_assignall })
                        this.setState({ loading: false })
                    }
                    else if (start_assignall.data.status_code == 400) {
                        ToastAndroid.show(start_assignall.data.message, ToastAndroid.LONG, 25, 50);
                        this.setState({ loading: false })
                    }
                    this.setState({ loading: false })
                }
                else {
                    ToastAndroid.show('Select Valid Expiry Date', ToastAndroid.LONG, 25, 50);
                    this.setState({ loading: false, finish_loading: false })
                }


            } else {
                ToastAndroid.show('Select Product', ToastAndroid.LONG, 25, 50);
                this.setState({ loading: false, finish_loading: false })
            }
        }
    }

    TagsData() {
        this.props.navigation.navigate('SearchableTags', { item: this.state.TagsData })
        console.log("select tag", this.state.TagsData)
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
            this.setState(obj, () => console.log('obj is', obj))
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

    render() {
        return (
            <Container style={{ flex: 1, backgroundColor: '#F5F5F4' }}>
                <Headers isHome={true} onBackHome={() => { this.props.navigation.navigate('Dashboard') }} label={'Assign'} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1, width: widthPercentageToDP('100%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', paddingLeft: widthPercentageToDP('3%'), paddingRight: widthPercentageToDP('12%'), paddingBottom: 10, marginBottom: 30, marginTop: widthPercentageToDP('2%') }}>
                            <View style={{ height: widthPercentageToDP('10%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('10%'), marginLeft: widthPercentageToDP('-2%') }}>
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
                                    <SvgUri width="17" height="13" fill='#6B829D' svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignSelf: 'center', marginTop: widthPercentageToDP('1%'), marginRight: widthPercentageToDP('4%') }} />

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
                                    <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignSelf: 'center', marginTop: widthPercentageToDP('1%'), marginRight: widthPercentageToDP('4%') }} />
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
                                <View style={{
                                    width: widthPercentageToDP('13%'),
                                    height: widthPercentageToDP('11%'), fontSize: 14, justifyContent: 'center', backgroundColor: '#C0BCBC', borderRadius: 5, shadowColor: '#F1F1F1', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.8, elevation: 2, shadowRadius: 1
                                }}>
                                    <Text style={{ justifyContent: 'center', alignSelf: 'center', color: this.state.checked ? 'grey' : '#494848' }}>INR</Text>
                                </View>
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
                                        <Text style={{ justifyContent: 'center', alignSelf: 'center', color: this.state.checked ? 'grey' : '#000' }}>INR</Text>
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
                                onPress={this.state.checked ? null : this._showDateTimeManfacture}
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
                                    color: this.state.checked ? 'gray' : '#000000',
                                    fontSize: 14,
                                }}>{this.state.manufacture || 'Select Manufacturing Date'}</Text>
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
                                onPress={this.state.checked ? null : this._showDateTimeExpiry}
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
                                    color: this.state.checked ? 'gray' : '#000000',
                                    fontSize: 14,
                                }}>{this.state.expiry || 'Select Expiry Date'}</Text>
                            </TouchableOpacity>
                            <DateTimePicker
                                isVisible={this.state.isDateTimePickerExpiry}
                                onConfirm={(value) => this._handleDateExpiry('expiry', moment(value).format("DD MMMM YYYY"))}
                                onCancel={this._hideDateTimeExpiry} />


                            <View style={{ height: widthPercentageToDP('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%') }}>
                                <Text style={this.state.checked ? styles.productsdisable : styles.products}>Manufacturing Location</Text>
                                {/* <Text style={{ color: this.state.checked ? '#EEBBBB' : 'red' }}>*</Text> */}
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
                                }} >
                                    <Text style={styles.selectproductsdiable}>{"Select tags"}</Text>
                                    <SvgUri width="17" height="13" fill={'#6B829D'} svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: widthPercentageToDP('4%'), marginRight: widthPercentageToDP('4%') }} />
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
                                }}
                                    onPress={() => this.TagsData()}
                                >
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
                            }

                            {this.state.checked == false && this.state.SelectedTags !== null && this.state.SelectedTags.length > 0 ? <View style={{
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
                                {/* <Text style={{ color: 'red' }}>*</Text> */}
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
                                    editable={this.state.checked ? false : true}
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
            </Container>

        )

    }
}

export default withNavigation(All);

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