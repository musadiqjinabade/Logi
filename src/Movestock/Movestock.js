import React, { Component } from 'react';
import { Text, View, StatusBar, Keyboard, StyleSheet, TouchableOpacity, AsyncStorage, TextInput, ToastAndroid, Dimensions, ActivityIndicator, BackHandler } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import { Container } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import SearchableDropdown from './searchablebleDropdown';
import svgImages from '../Images/images';
import APIService from '../component/APIServices';
import Headers from '../component/Headers';
import color from '../component/color';

var decoded = {}

var jwtDecode = require('jwt-decode');

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
});

class Movestock extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            focus: false,
            username: '',
            Product: '',
            products: '',
            locations: '',
            Location: '',
            Documenttype: '',
            documenttype: '',
            Documentnum: '',
            documentnum: '',
            isVisible: true,
            checked: false,
            progressText: 'Loading...',
            expanded: true,
            isModalVisibleDocnum: false,
            isModalVisibleDoctype: false,
            locationId: '',
            locationName: ''
        }

    }

    async componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', async () => {
            var loginData = await AsyncStorage.getItem('loginData');

            if (loginData) {
                loginData = JSON.parse(loginData);
            }
            console.log('loginData ', loginData.token);
            decoded = jwtDecode(loginData.token);
            console.log('decoded:', decoded)
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
            await AsyncStorage.getItem('SelectedLocation').then((value) => {
                var location = JSON.parse(value);
                this.setState({
                    locationId: location.id ? location.id : location.value,
                    locationName: location.itemName ? location.itemName : location.label
                }, () => console.log('values', this.state.locationId, this.state.locationName))
            });
            var data = {}
            data.id = this.state.locationId
            data.itemName = this.state.locationName
            this.setState({ products: data })
        })
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

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible }, async () => {
            var location = await APIService.execute('POST', APIService.URLBACKEND + 'settings/getlocations');

            console.log("location:", location.data.data)
            this.setState({ Product: location.data.data })
        });
    };

    toggleModallocation = () => {
        this.setState({ isModalVisibleloc: !this.state.isModalVisibleloc }, async () => {

            var response = await APIService.execute('GET', APIService.URLBACKEND + 'settings/getparentlocations', null)
            console.log('response:', this.state.products.itemName, response.data.data)
            if (response.data.data.length > 0) {
                var data = []
                for (let i = 0; i < response.data.data.length; i++) {
                    if (response.data.data[i].id !== this.state.products.id) {
                        data.push(response.data.data[i])
                    }
                }
                this.setState({ Location: data })
            }
            else {
                ToastAndroid.show("To Location Not Avaliable", ToastAndroid.LONG, 25, 50);
            }
        });
    };

    toggleModalDoctype = () => {
        this.setState({ isModalVisibleDoctype: !this.state.isModalVisibleDoctype }, async () => {
            // try{
            // var response = await APIService.execute('GET', APIService.URLBACKEND + 'settings/listdocument?page_no=0&sort_on=created_at&sort_by=desc&page_count=25', null)
            var response = await APIService.execute('GET', APIService.URLBACKEND + APIService.settinggetdocumenttypelist + 'job_type=Dispatch', null)
            console.log('response:', response)
            if (response.data.status_code == 200) {
                var temp = {}
                temp.id = 0
                temp.itemName = "Add Manually"
                var tempArr = response.data.data
                tempArr.push(temp)
                this.setState({ Documenttype: tempArr })
            }
        });
    };

    toggleModalDocnum = () => {
        this.setState({ isModalVisibleDocnum: !this.state.isModalVisibleDocnum }, async () => {
            const body = {}
            body.document_type = this.state.documenttype ? this.state.documenttype.itemName : null
            body.company_id = decoded.company_id || null

            var response = await APIService.execute('POST', APIService.URL_ERP + APIService.documentgetdocumentbytype, body)
            console.log('response:', response)
            if (response.success) {
                if (response.data.data.length > 0) {
                    this.setState({ Documentnum: response.data.data, }, () => {
                        console.log('this.Document', this.state.Documentnum)
                    })
                }
                else {
                    ToastAndroid.show("No Document Number found. Please contact the administrator", ToastAndroid.LONG, 25, 50);
                }
            }
        });
    };

    searchText(text) {
        this.setState({ username: text }, () => {
            const newData = this.state.Product.filter(item => {
                var itemData = item.location_name ? (item.location_name) : '----';
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            //   mockData = newData;
            this.setState({ Product: newData });
        });
    }

    renderModalContent = () => {
        if (this.state.isModalVisible || this.state.isModalVisibleloc || this.state.isModalVisibleDoctype || this.state.isModalVisibleDocnum) {
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

    async ContinueRender() {

        if (this.state.products && this.state.locations && this.state.documenttype && (this.state.DocumentTextNum || this.state.documentnum && this.state.documentnum.document_number)) {
            var item = {}
            item.From_location = this.state.products ? this.state.products : null;
            item.To_location = this.state.locations ? this.state.locations : null;
            item.DocumentType = this.state.documenttype ? this.state.documenttype : null;
            item.DocumentNumber = this.state.documentnum ? this.state.documentnum.document_number : this.state.DocumentTextNum;
            this.props.navigation.navigate('StockMovement', { item: item })
            this.setState({ products: '', locations: '' })
        } else {
            if (this.state.documenttype) {
                if (this.state.documentnum ? this.state.documentnum.document_number : this.state.DocumentTextNum) {
                    if (this.state.products) {
                        if (this.state.locations) {
                            // if(this.state.documenttype){
                            // ToastAndroid.show("Please Select", ToastAndroid.LONG, 25, 50);
                            // }else{
                            // ToastAndroid.show("Please Select Document Type", ToastAndroid.LONG, 25, 50);
                            // }
                        } else {
                            ToastAndroid.show("Please Select To Location", ToastAndroid.LONG, 25, 50);
                        }
                    } else {
                        ToastAndroid.show("Please Select From Location ", ToastAndroid.LONG, 25, 50);
                    }
                }
                else {
                    ToastAndroid.show("Please Select Document Number", ToastAndroid.LONG, 25, 50);
                }
            }
            else {
                ToastAndroid.show("Please Select Document Type", ToastAndroid.LONG, 25, 50);
            }
        }
    }


    render() {

        return (
            <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                <Headers label={"Dispatch Stock"} onBack={() => { this.props.navigation.goBack() || this.props.navigation.dispatch(resetAction) }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='always' >
                        <View style={{ flex: 1, width: wp('100%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', paddingHorizontal: 10, paddingBottom: 10, marginBottom: 30, marginTop: wp('5%') }}>

                            <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                <Text style={styles.products}>Document Type</Text>
                                <Text style={{ color: 'red' }}>*</Text>
                            </View>
                            <TouchableOpacity style={{
                                width: wp('94%'),
                                height: wp('10%'),
                                // marginLeft: wp('5%'),
                                // marginRight: wp('10%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: '#FFFFFF',
                                flexDirection: 'row',
                                borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('5%'),
                            }} onPress={this.toggleModalDoctype}>
                                <Text style={styles.selectproducts}>{this.state.documenttype ? this.state.documenttype.itemName : "Select a Document Type"}</Text>
                                <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                            </TouchableOpacity>
                            {this.state.documenttype && this.state.documenttype.itemName == 'Add Manually' ?
                                <View>
                                    <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                        <Text style={styles.products}>Document Number</Text>
                                        <Text style={{ color: 'red' }}>*</Text>
                                    </View>

                                    <TextInput
                                        style={{
                                            width: wp('94%'),
                                            height: wp('10%'),
                                            fontFamily: 'Montserrat-Regular',
                                            // marginLeft: wp('5%'),
                                            // marginRight: wp('10%'),
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            shadowColor: '#CECECE',
                                            shadowRadius: 3,
                                            elevation: 4,
                                            backgroundColor: '#FFFFFF',
                                            flexDirection: 'row',
                                            borderRadius: 5,
                                            justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('5%'),
                                        }}
                                        value={(this.state.DocumentTextNum || '')}
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        keyboardType='default'
                                        returnKeyType="next"
                                        placeholder={'Enter Document Number'}
                                        onFocus={this.handleFocus}
                                        onBlur={this.handleBlur}
                                        placeholderTextColor="black"
                                        placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                        onChangeText={(text) => this.setState({
                                            DocumentTextNum: text
                                        })}></TextInput>
                                </View> :
                                this.state.documenttype && this.state.documenttype.itemName ?
                                    <View>
                                        <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                            <Text style={styles.products}>Document Number</Text>
                                            <Text style={{ color: 'red' }}>*</Text>
                                        </View>

                                        <TouchableOpacity style={{
                                            width: wp('94%'),
                                            height: wp('10%'),
                                            // marginLeft: wp('5%'),
                                            // marginRight: wp('10%'),
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            shadowColor: '#CECECE',
                                            shadowRadius: 3,
                                            elevation: 4,
                                            backgroundColor: '#FFFFFF',
                                            flexDirection: 'row',
                                            borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('5%'),
                                        }}
                                            onPress={this.toggleModalDocnum}
                                        >
                                            <Text style={styles.selectproducts}>{this.state.documentnum ? this.state.documentnum.document_number : "Select a Document Number"}</Text>
                                            <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                                        </TouchableOpacity></View> : null}
                            {this.state.documenttype && this.state.documenttype.itemName == "Add Manually" ?
                                <View>
                                    <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                        <Text style={styles.products}>From</Text>
                                        <Text style={{ color: 'red' }}>*</Text>
                                    </View>

                                    <View style={{
                                        width: wp('94%'),
                                        height: wp('10%'),
                                        // marginLeft: wp('5%'),
                                        // marginRight: wp('10%'),
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        shadowRadius: 3,
                                        elevation: 4,
                                        backgroundColor: '#FFFFFF',
                                        flexDirection: 'row',
                                        borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('5%'),
                                    }} >
                                        <Text style={styles.selectproducts}>{this.state.products.itemName || "Select From Location"}</Text>
                                        {/* <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} /> */}
                                    </View>

                                    <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                        <Text style={styles.products}>To</Text>
                                        <Text style={{ color: 'red' }}>*</Text>
                                    </View>
                                    <TouchableOpacity style={{
                                        width: wp('94%'),
                                        height: wp('10%'),
                                        // marginLeft: wp('5%'),
                                        // marginRight: wp('10%'),
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        shadowRadius: 3,
                                        elevation: 4,
                                        backgroundColor: '#FFFFFF',
                                        flexDirection: 'row',
                                        borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('5%'),
                                    }} onPress={this.toggleModallocation}>
                                        <Text style={styles.selectproducts}>{this.state.locations.itemName || "Select to location"}</Text>
                                        <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                                    </TouchableOpacity>
                                </View> :
                                this.state.documenttype && this.state.documenttype.itemName ?
                                    <View>
                                        <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                            <Text style={styles.products}>From</Text>
                                            <Text style={{ color: 'red' }}>*</Text>
                                        </View>

                                        <TouchableOpacity style={{
                                            width: wp('94%'),
                                            height: wp('10%'),
                                            // marginLeft: wp('5%'),
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
                                            <Text style={styles.selectproducts}>{this.state.products.itemName || "Select From Location"}</Text>
                                            <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                                        </TouchableOpacity>

                                        <View style={{ height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%'), }}>
                                            <Text style={styles.products}>To</Text>
                                            <Text style={{ color: 'red' }}>*</Text>
                                        </View>
                                        <TouchableOpacity style={{
                                            width: wp('94%'),
                                            height: wp('10%'),
                                            // marginLeft: wp('5%'),
                                            // marginRight: wp('10%'),
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            shadowColor: '#CECECE',
                                            shadowRadius: 3,
                                            elevation: 4,
                                            backgroundColor: '#FFFFFF',
                                            flexDirection: 'row',
                                            borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('5%'),
                                        }} onPress={this.toggleModallocation}>
                                            <Text style={styles.selectproducts}>{this.state.locations.itemName || "Select to location"}</Text>
                                            <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                                        </TouchableOpacity>
                                    </View> : null}
                        </View>
                    </ScrollView>
                    <View style={{
                        flex: 1, position: 'absolute',
                        bottom: 0,
                    }}>
                        <TouchableOpacity onPress={async () => { this.ContinueRender() }}>
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
                                    this.state.loading === true ? (
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <View style={{ paddingRight: 10 }}>
                                                <ActivityIndicator size={'small'} color='#FFFFFF' />
                                            </View>
                                            <View>
                                                <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#FFFFFF' }}>Please Wait...</Text>
                                            </View>
                                        </View>
                                    ) : <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: hp('2.5%'), fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#FFFFFF' }}>{'Continue'}</Text>
                                        </View>
                                }

                            </LinearGradient>
                        </TouchableOpacity>

                    </View>
                </View>

                {this.state.Product.length > 0 ? (
                    <SearchableDropdown
                        title={'Select Products'}
                        data={this.state.Product}
                        onSelect={(selectedItem) => {
                            console.log("selectedItem:", selectedItem)
                            Keyboard.dismiss();
                            this.setState({ products: selectedItem, isModalVisible: false })
                        }}
                        onCancel={() => { this.setState({ isModalVisible: false }) }}
                        isVisible={this.state.isModalVisible === true} />) : null}
                {this.state.Location.length > 0 ? (
                    <SearchableDropdown
                        title={'Select Products'}
                        data={this.state.Location}
                        onSelect={(selectedItem) => {
                            console.log("selectedItem:", selectedItem)
                            Keyboard.dismiss();
                            this.setState({ locations: selectedItem, isModalVisibleloc: false })
                        }}
                        onCancel={() => { this.setState({ isModalVisibleloc: false }) }}
                        isVisible={this.state.isModalVisibleloc === true} />) : null}
                {this.state.Documenttype ? this.state.Documenttype.length > 0 ? (
                    <SearchableDropdown
                        title={'Select Products'}
                        data={this.state.Documenttype}
                        onSelect={(selectedItem) => {
                            console.log("selectedItem:", selectedItem)
                            Keyboard.dismiss();
                            this.setState({ documenttype: selectedItem, isModalVisibleDoctype: false })
                            if (selectedItem.itemName == "Add Manually") {
                                var data = {}
                                data.id = this.state.locationId
                                data.itemName = this.state.locationName
                                this.setState({ products: data })
                            }

                        }}
                        onCancel={() => { this.setState({ isModalVisibleDoctype: false }) }}
                        isVisible={this.state.isModalVisibleDoctype === true} />) : null : null}
                {this.state.Documentnum ? this.state.Documentnum.length > 0 ? (
                    <SearchableDropdown
                        title={'Select Products'}
                        data={this.state.Documentnum}
                        onSelect={(selectedItem) => {
                            console.log("selectedItem:", selectedItem)
                            Keyboard.dismiss();
                            this.setState({ documentnum: selectedItem, isModalVisibleDocnum: false })
                        }}
                        onCancel={() => { this.setState({ isModalVisibleDocnum: false }) }}
                        isVisible={this.state.isModalVisibleDocnum === true} />
                ) : null : null}
                {/* {this.renderModalContent()} */}

            </Container>

        )

    }
}

export default withNavigation(Movestock);

var styles = StyleSheet.create({

    linearGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
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
        margin: wp('2%'),
    },
    selectproductsdiable: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: wp('2%'),
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
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
    }
});