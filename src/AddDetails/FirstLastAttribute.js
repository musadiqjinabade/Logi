import React, { Component } from 'react';
import { Text, View, Keyboard, StatusBar, TextInput, StyleSheet, TouchableOpacity, ToastAndroid, Dimensions, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container, Toast } from 'native-base';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import SearchableDropdown from '../Assign/All/searchablebleDropdown';
import svgImages from '../Images/images';
import APIService from '../component/APIServices';
import moment from "moment";
import Headers from '../component/Headers';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';



const mockData = [
    { id: 1, name: 'React Native Developer' }, // set default checked for render option item
    { id: 2, name: 'Android Developer' },
    { id: 3, name: 'iOS Developer' },
    { id: 4, name: 'React Native Developer' }, // set default checked for render option item
    { id: 5, name: 'Android Developer' },
    { id: 6, name: 'iOS Developer' },
    { id: 12, name: 'React Native Developer' }, // set default checked for render option item
    { id: 22, name: 'Android Developer' },
    { id: 32, name: 'iOS Developer' },
    { id: 142, name: 'React Native Developer' }, // set default checked for render option item
    { id: 23, name: 'Android Developer' },
    { id: 34, name: 'iOS Developer' }
];

class FirstLastAttribute extends Component {
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
            manufacture: moment().format("DD MMMM YYYY"),
            mrp: '',
            expiry: moment().format("DD MMMM YYYY"),
            manufactureloc: '',
            targetstate: '',
            isDateTimePickerManufacture: false,
            isDateTimePickerExpiry: false,
            obj: {},
            selectedState: '',
            expanded: true



        }

    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible }, async () => {

            var response = await APIService.execute('GET', APIService.URLTEST + 'product/listproductname', null)
            this.setState({ Product: response.data.data })
        });
    };

    searchText(text) {
        this.setState({ username: text }, () => {
            const newData = Product.filter(item => {
                var itemData = item.itemName ? (item.itemName) : '----';
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            //   mockData = newData;
            this.setState({ Product: newData });
        });
    }

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

    componentWillReceiveProps(item) {
        if (item.navigation.state.params.id == 1) {
            this.setState({ first: item.navigation.state.params.item })
        }
        else if (item.navigation.state.params.id == 2) {
            this.setState({ last: item.navigation.state.params.item })
        }
    }

    async componentDidMount() {
        await AsyncStorage.getItem('SelectedLocation').then((value) => {
            var location = JSON.parse(value);
            this.setState({
                locationId: location.id ? location.id : location.value,
                locationName: location.itemName ? location.itemName : location.label
            }, () => console.log('values', this.state.locationId, this.state.locationName))
        });
    }

    showMessage(message) {
        Toast.show({
            text: message,
            duration: 2000
        })
    }

    async firstlaststart() {
        if (this.state.first != '') {
            if (this.state.first.length == '10') {
                if (this.state.last != '') {
                    if (this.state.last.length == '10') {

                        Keyboard.dismiss();
                        this.setState({ loading: true })
                        // var manufactureDate 
                        if (this.state.manufacture) {
                            var manufactureDate = moment(this.state.manufacture).unix().toString();
                        }
                        if (this.state.expiry) {
                            var expiryDate = moment(this.state.expiry).unix().toString();
                        }
                        var location = await APIService.execute('POST', APIService.URLBACKEND + 'settings/getlocations');
                        if (this.state.products) {
                            // if (this.state.batch) {
                            //     if (this.state.mrp) {
                            //         if (this.state.manufactureloc) {
                            let data = {}
                            data.from_uqr = parseInt(this.state.first)
                            data.to_uqr = parseInt(this.state.last)
                            data.product_id = this.state.products.id
                            data.batch_no = this.state.batch
                            data.product_mrp = parseInt(this.state.mrp)
                            data.manu_date = manufactureDate
                            data.exp_date = expiryDate
                            data.target_state = this.state.targetstate
                            data.manu_location = this.state.manufactureloc
                            data.target_state = this.state.selectedState.name || null
                            data.location_id = this.state.locationId
                            data.location_name = location.data.data[0].itemName || null
                            data.job_id = null

                            var start = await APIService.execute('POST', APIService.URLBACKEND + 'assignment/assignfistandlast', data)
                            if (start == 'SyntaxError: Unexpected token < in JSON at position 0') {
                                ToastAndroid.show('Incorrect Range Provided', ToastAndroid.LONG, 25, 50);
                            }
                            else {
                                if (start.data.status_code == 200) {
                                    ToastAndroid.show(start.data.message, ToastAndroid.LONG, 25, 50);
                                    this.props.navigation.navigate('Dashboard')
                                } else if (start.data.status_code == 400) {
                                    ToastAndroid.show(start.data.message, ToastAndroid.LONG, 25, 50);
                                    // this.props.navigation.navigate('Dashboard')
                                }
                            }
                            this.setState({ loading: false })

                        } else {
                            ToastAndroid.show('Select Product', ToastAndroid.LONG, 25, 50);
                            this.setState({ loading: false })

                        }
                    } else {
                        ToastAndroid.show('Please Enter Valid Last Product', ToastAndroid.LONG, 25, 50);
                        this.setState({ loading: false })

                    }
                } else {
                    ToastAndroid.show('Select Scan a Last Product', ToastAndroid.LONG, 25, 50);
                    this.setState({ loading: false })

                }
            } else {
                ToastAndroid.show('please Enter Valid First Product', ToastAndroid.LONG, 25, 50);
                this.setState({ loading: false })

            }
        } else {
            ToastAndroid.show('Select Scan a First Product', ToastAndroid.LONG, 25, 50);
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
        this.setState(obj, () => console.log('obj is', obj))
    };
    _handleDateExpiry = (name, date) => {
        this._hideDateTimeExpiry();
        var obj = {}
        obj[name] = date
        obj['isDateSelected'] = true
        var check = moment(date).isAfter(this.state.manufacture, 'day')
        if (check == true) {
            this.setState({
                expiry: date,
                obj
            })
        }
        else {
            ToastAndroid.show('Please Select Valid Expiry Date', ToastAndroid.LONG, 25, 50);
        }
    };

    selectState = () => {
        this.setState({ isStateModalVisible: !this.state.isStateModalVisible }, () => {
            this.setState({ stateData: this.Totalstates })
        });
    };

    render() {
        return (
            <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                <Headers label={'Attribute and Tags'} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />

                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='handled'>
                        <View style={{ flex: 1, width: widthPercentageToDP('100%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', paddingHorizontal: 10, paddingBottom: 10, marginBottom: 30, marginTop: widthPercentageToDP('5%') }}>
                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%'), }}>
                                <Text style={styles.products}>Scan First Item</Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{
                                    width: widthPercentageToDP('84%'),
                                    height: widthPercentageToDP('11%'),
                                    // marginRight: widthPercentageToDP('1%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    flexDirection: 'row',
                                    shadowRadius: 3,
                                    elevation: 4,
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
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
                                    style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', margin: widthPercentageToDP('2%') }}>
                                    <SvgUri width="35" height="25" svgXmlData={svgImages.qr_code} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                </TouchableOpacity>
                            </View>


                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%'), }}>
                                <Text style={styles.products}>Scan Last Item</Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </View>

                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{
                                    width: widthPercentageToDP('84%'),
                                    height: widthPercentageToDP('11%'),
                                    // marginRight: widthPercentageToDP('1%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    flexDirection: 'row',
                                    shadowRadius: 3,
                                    elevation: 4,
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
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
                                    style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', margin: widthPercentageToDP('2%') }}>
                                    <SvgUri width="35" height="25" svgXmlData={svgImages.qr_code} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                </TouchableOpacity>
                            </View>


                            <View style={{ height: widthPercentageToDP('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%'), }}>
                                <Text style={styles.products}>Attribute</Text>
                                {/* <Text style={{ color: 'red' }}>*</Text> */}
                            </View>

                            <TouchableOpacity style={{
                                width: widthPercentageToDP('94%'),
                                height: widthPercentageToDP('11%'),
                                // marginRight: widthPercentageToDP('10%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: '#FFFFFF',
                                flexDirection: 'row',
                                borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                            }}
                            // onPress={this.toggleModal}
                            >
                                <Text style={styles.selectproducts}>{this.state.products.itemName || "Select a Attribute"}</Text>
                                <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: widthPercentageToDP('4%'), marginRight: widthPercentageToDP('4%') }} />

                            </TouchableOpacity>


                            <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%'), }}>
                                <Text style={this.state.checked ? styles.productsdisable : styles.products}>Select Tags</Text>
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
                                }}
                                // onPress={this.toggleModal}
                                >
                                    <Text style={styles.selectproductsdiable}>{"Select Tags"}</Text>
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
                                    <Text style={styles.selectproducts}>{this.state.selectedState.name || "Select Tags"}</Text>
                                    <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: widthPercentageToDP('4%'), marginRight: widthPercentageToDP('4%') }} />

                                </TouchableOpacity>
                            }





                        </View>

                    </ScrollView>
                    <View style={{ flexDirection: 'row', bottom: 0, position: 'relative', marginBottom: heightPercentageToDP('2%') }}>
                        <TouchableOpacity style={{
                            width: widthPercentageToDP('47%'),
                            height: widthPercentageToDP('13%'),
                            // marginHorizontal:widthPercentageToDP('10%'),
                            marginTop: widthPercentageToDP('5%'),
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowColor: '#CECECE',
                            shadowRadius: 3,
                            elevation: 4,
                            backgroundColor: '#fff',
                            borderRadius: 5, justifyContent: 'center', alignItems: 'center'
                        }}
                            onPress={() => this.firstlaststart()}>
                            {
                                this.state.loading === true ? (
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ paddingRight: 10 }}>
                                            <ActivityIndicator size={'small'} color='#FFFFFF' />
                                        </View>
                                        <View>
                                            <Text style={styles.btntextcancel}>Please Wait...</Text>
                                        </View>
                                    </View>
                                ) : (
                                        <Text style={styles.btntextcancel}>{'Cancel'}</Text>
                                    )
                            }
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            width: widthPercentageToDP('47%'),
                            height: widthPercentageToDP('13%'),
                            // marginHorizontal:widthPercentageToDP('10%'),
                            marginTop: widthPercentageToDP('5%'),
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowColor: '#CECECE',
                            shadowRadius: 3,
                            elevation: 4,
                            backgroundColor: '#65CA8F',
                            borderRadius: 5, justifyContent: 'center', alignItems: 'center'
                        }}
                            onPress={() => this.firstlaststart()}>
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
                                        <Text style={styles.btntext}>{'Finish'}</Text>
                                    )
                            }
                        </TouchableOpacity>

                    </View>
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

export default withNavigation(FirstLastAttribute);

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
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: widthPercentageToDP('2%'),
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
    Firstbatchstyle: {
        paddingLeft: 6,
        flexDirection: 'row',
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: widthPercentageToDP('65%'),
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
    }
});
