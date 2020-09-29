import React, { Component } from 'react';
import { Text, View, FlatList, StatusBar, TextInput, StyleSheet, TouchableOpacity, Keyboard, ToastAndroid, Dimensions, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container } from 'native-base';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import SearchableDropdown from '../Assign/FirstandLast/searchablebleDropdown';
import APIService from '../component/APIServices';
import Headers from '../component/Headers';

const mockData = [
    { id: 1, name: 'React Native Developer', quantity: 50 }, // set default checked for render option item
    { id: 2, name: 'Android Developer', quantity: 10 },
    { id: 3, name: 'iOS Developer', quantity: 20 },
    { id: 4, name: 'React Native Developer', quantity: 44 }, // set default checked for render option item
    { id: 5, name: 'Android Developer', quantity: 88 },
    { id: 6, name: 'iOS Developer', quantity: 54 },
    { id: 12, name: 'React Native Developer', quantity: 50 }, // set default checked for render option item
    { id: 22, name: 'Android Developer', quantity: 90 },
    { id: 32, name: 'iOS Developer', quantity: 220 },
    { id: 142, name: 'React Native Developer', quantity: 80 }, // set default checked for render option item
    { id: 23, name: 'Android Developer', quantity: 510 },
    { id: 34, name: 'iOS Developer', quantity: 220 }
];

class StockMovement extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Product Code', 'Quantity'],
            widthArr: [widthPercentageToDP('47%'), widthPercentageToDP('47%')],
            products_data: '',
            products_code: '',
            quantity: '',
            data: [],
            stock_data: '',
            Product: '',
            progressText: 'Loading...',
            locationId: null,
            locationName: '',
            expanded: true
        }
        this.array = []

    }

    componentDidMount() {
        this.setState({ data: [...this.array] })
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            console.log("prop data:", this.props.navigation.state.params.item)
            this.setState({ stock_data: this.props.navigation.state.params.item })
        })
    }

    toggleModalpdt = () => {
        this.setState({ loading: true, isModalVisible: !this.state.isModalVisible }, async () => {

            var response = await APIService.execute('GET', APIService.URLTEST + 'product/listproductname', null)
            console.log('response:', response.data.data)
            this.setState({ Product: response.data.data, loading: false })
        });
    };


    async add_detail() {
        // this.state.quantity.trim()
        console.log("this.state.quantity", this.state.quantity)
        if (this.state.quantity.trim() != "" && this.state.products_code && this.state.quantity) {
            // if (!this.state.quantity.match(/^\d+/)) {
            if (!isNaN(this.state.quantity) || this.state.quantity < 0 || this.state.quantity > 10) {
                this.setState({ loading: true });
                Keyboard.dismiss();
                var res = {}
                res.products_code = this.state.products_code;
                res.quantity = this.state.quantity;
                console.log("res:", res)

                this.array.push(res);
                this.setState({ data: [...this.array], products_code: '', quantity: '', loading: false }, () => {
                    console.log("res:", this.state.data)
                })
            }
            else {
                ToastAndroid.show('Please Enter a Valid Quantity', ToastAndroid.LONG, 25, 50);

            }

        }
        else {
            if (!this.state.products_code) {
                ToastAndroid.show('Please Select a Product', ToastAndroid.LONG, 25, 50);
            }
            else if (!this.state.quantity || this.state.quantity.trim() == "") {
                ToastAndroid.show('please Enter a Quantity', ToastAndroid.LONG, 25, 50);
            }
        }
    }

    handleFocus = event => {
        this.setState({ isFocused: true });
        if (this.props.onFocus) {
            this.props.onFocus(event);
        }
    };
    handleBlur = event => {
        this.setState({ isFocused: false });
        if (this.props.onBlur) {
            this.props.onBlur(event);
        }
    };

    renderModalContent = () => {
        if (this.state.loading) {
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

    async startrender() {
        // console.log("this.state.data:",this.state.data)
        if (this.state.data.length == 0) {
            this.setState({ loadingpro: true })
            // console.log("this.state.:",this.state.data)
            ToastAndroid.show("Please Select Product details", ToastAndroid.LONG, 25, 50);
            this.setState({ loadingpro: false })
        } else {
            this.setState({ loadingpro: true })
            console.log("this:", this.state.data)
            var data = {}
            data.stock_details = this.state.data;
            var body = {}
            body.location_id = this.state.stock_data ? this.state.stock_data.From_location != null ? this.state.stock_data.From_location.id : null : null;
            body.location_to = this.state.stock_data ? this.state.stock_data.To_location != null ? this.state.stock_data.To_location.id : null : null;
            body.document_type = this.state.stock_data && this.state.stock_data.DocumentType != null ? this.state.stock_data.DocumentType.itemName == 'Add Manually' ? 0 : this.state.stock_data.DocumentType.id : null;
            body.document_no = this.state.stock_data && this.state.stock_data.DocumentNumber != null ? this.state.stock_data.DocumentNumber : null;
            body.stock_details = data.stock_details;
            body.user_location = this.state.stock_data ? this.state.stock_data.From_location != null ? this.state.stock_data.From_location.id : null : null;

            console.log("startrender:", body)
            var start = await APIService.execute('POST', APIService.URLBACKEND + 'stockTransfer/startdispatchjob', body)
            console.log("start:", start)
            console.log("start2:", start.data.status_code)
            if (start.data.status_code == '200') {
                this.setState({ loadingpro: false })
                this.props.navigation.navigate('MoveScanproduct', { item: data, item1: start })
            } else {
                this.setState({ loadingpro: false })
                ToastAndroid.show(start.data.data.message, ToastAndroid.LONG, 25, 50);
            }
        }
    }

    delete(item) {
        console.log("item:", item);
        var array = [...this.state.data];
        var index = array.indexOf(item)
        if (index !== -1) {
            array.splice(index, 1);
            console.log("array:", array);
            this.array = array;
            this.setState({ data: array });
        }
    }

    render() {
        const fontSize = 11;
        return (
            <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                <Headers label={"Dispatch Stock"} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps='handled'>
                        <View style={{ flex: 1, width: widthPercentageToDP('100%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', paddingHorizontal: 10, paddingBottom: 10, marginBottom: 30, marginTop: widthPercentageToDP('5%') }}>
                            <View style={{
                                flex: 1, shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                borderRadius: 5,
                                marginTop: widthPercentageToDP('4%'),
                                marginBottom: widthPercentageToDP('4%'),
                                width: widthPercentageToDP('94%'),
                                padding: widthPercentageToDP('2%'),
                                flexDirection: 'column',
                                elevation: 4,
                                backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start',
                            }}>
                                <View style={{ width: widthPercentageToDP('90%'), justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: widthPercentageToDP('2%'), marginLeft: widthPercentageToDP('1%') }}>
                                    <View style={{ flex: 1, width: widthPercentageToDP('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: widthPercentageToDP('1%') }}>
                                        <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: fontSize }}>From Location:</Text>
                                        <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize }}>{this.state.stock_data && this.state.stock_data.From_location != null ? this.state.stock_data.From_location.itemName : '---'}</Text>
                                    </View>

                                    <View style={{ flex: 1, width: widthPercentageToDP('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: widthPercentageToDP('1%') }}>
                                        <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: fontSize }}>To Location:</Text>
                                        <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize }}>{this.state.stock_data && this.state.stock_data.To_location != null ? this.state.stock_data.To_location.itemName : '---'}</Text>
                                    </View>
                                </View>
                                <View style={{ width: widthPercentageToDP('90%'), justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: widthPercentageToDP('2%'), marginLeft: widthPercentageToDP('1%') }}>
                                    <View style={{ flex: 1, width: widthPercentageToDP('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: widthPercentageToDP('1%') }}>
                                        <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: fontSize }}>Document Type:</Text>
                                        <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize }}>{this.state.stock_data && this.state.stock_data.DocumentType != null ? this.state.stock_data.DocumentType.itemName : "---"}</Text>
                                    </View>
                                    <View style={{ flex: 1, width: widthPercentageToDP('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: widthPercentageToDP('1%') }}>
                                        <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: fontSize }}>Document Number:</Text>
                                        <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize }}>{this.state.stock_data && this.state.stock_data.DocumentNumber != null ? this.state.stock_data.DocumentNumber : '---'}</Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{
                                flex: 1, shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                borderRadius: 5,
                                marginTop: widthPercentageToDP('4%'),
                                marginBottom: widthPercentageToDP('4%'),
                                width: widthPercentageToDP('94%'),
                                flexDirection: 'column',
                                elevation: 4,
                                backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'center',
                            }}>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    backgroundColor: '#FFFFFF', justifyContent: 'space-between', alignItems: 'center',
                                }}>
                                    <View style={{ flex: 1, justifyContent: 'flex-start', marginLeft: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('2%'), flexDirection: 'column' }}>
                                        <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold' }}>{"Product Code" || '---'}</Text>
                                    </View>
                                    <View style={{ width: widthPercentageToDP('29%'), height: widthPercentageToDP('7%'), marginLeft: widthPercentageToDP('1%'), marginRight: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('3%'), marginBottom: widthPercentageToDP('2%'), fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center', }}>
                                        <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'Montserrat-Bold', color: '#1D3567' }}>{"Quantity"}</Text>
                                    </View>
                                    <TouchableOpacity
                                        // onPress={() => this.refs.modal6.open()}
                                        style={{ width: widthPercentageToDP('19%'), fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center', marginRight: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('3%'), }}>
                                        {/* <SvgUri width="30" height="30"  svgXmlData={svgImages.add} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%') }} /> */}
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'center', marginBottom: widthPercentageToDP('2%')
                                }}>
                                    <FlatList
                                        extraData={this.state.data}
                                        data={this.state.data}
                                        renderItem={({ item }) => (
                                            <View style={{
                                                flex: 1,
                                                flexDirection: 'column',
                                                backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%')
                                            }}>
                                                <View style={{ flex: 1, width: widthPercentageToDP('90%'), borderBottomColor: '#DBDBDB', borderBottomWidth: 1, marginHorizontal: widthPercentageToDP('1%'), marginTop: widthPercentageToDP('2%'), marginBottom: widthPercentageToDP('4%') }} />
                                                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'flex-start', marginHorizontal: widthPercentageToDP('2%') }}>
                                                    <View style={{
                                                        flexDirection: 'row', width: widthPercentageToDP('44%'),
                                                        backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'center',
                                                    }}>
                                                        <Text numberOfLines={2} style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567' }}>{item.products_code ? item.products_code.itemName : '---'}</Text>
                                                    </View>
                                                    {/* <View style={{justifyContent:'flex-end', alignItems:'flex-end',margin:widthPercentageToDP('2%'), flex:1, flexDirection:'row',padding:widthPercentageToDP('1%'),borderWidth:1}}> */}
                                                    <View style={{
                                                        flexDirection: 'row', width: widthPercentageToDP('32.5%'),
                                                        backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',
                                                    }}>
                                                        <Text style={{ margin: 2, color: '#1D3567', fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center', marginLeft: widthPercentageToDP('2%') }}>{item.quantity || '---'}</Text>
                                                    </View>

                                                    <TouchableOpacity
                                                        onPress={() => this.delete(item)}
                                                        style={{
                                                            flexDirection: 'row', width: widthPercentageToDP('10%'), height: widthPercentageToDP('8%'),
                                                            backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'center',
                                                        }}>
                                                        <SvgUri width="25" height="25" svgXmlData={svgImages.error} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%') }} />
                                                    </TouchableOpacity>
                                                    {/* </View> */}
                                                </View>
                                            </View>

                                        )}
                                    // keyExtractor={item => item}
                                    />
                                </View>
                                <View style={{
                                    flex: 1, width: widthPercentageToDP('94%'),
                                    flexDirection: 'column',
                                    borderRadius: 5,
                                    paddingHorizontal: widthPercentageToDP('1%'),
                                    backgroundColor: '#F1F3FD', justifyContent: 'space-between', alignItems: 'center', marginLeft: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('2%'), marginHorizontal: widthPercentageToDP('8%'),
                                }}>
                                    <TouchableOpacity style={{
                                        width: widthPercentageToDP('90%'),
                                        flex: 1,
                                        // marginRight: widthPercentageToDP('10%'),
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        shadowRadius: 3,
                                        elevation: 4,
                                        backgroundColor: '#FFFFFF',
                                        paddingVertical: widthPercentageToDP('1%'),
                                        flexDirection: 'row',
                                        borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginTop: widthPercentageToDP('5%'), marginHorizontal: widthPercentageToDP('2%'), marginBottom: widthPercentageToDP('2%'),
                                    }} onPress={this.toggleModalpdt}>
                                        <Text numberOfLines={1} style={styles.selectproducts}>{this.state.products_code.itemName || "Select a Product"}</Text>
                                        <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: widthPercentageToDP('4%'), marginRight: widthPercentageToDP('4%') }} />

                                    </TouchableOpacity>
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        backgroundColor: '#F1F3FD', justifyContent: 'space-between', alignItems: 'center',
                                    }}>
                                        <View style={{
                                            width: widthPercentageToDP('75%'),
                                            height: widthPercentageToDP('11%'),
                                            // marginRight: widthPercentageToDP('10%'),
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
                                                value={(this.state.quantity || '')}
                                                autoCapitalize="none"
                                                autoCorrect={false}
                                                keyboardType={"numeric"}
                                                returnKeyType="next"
                                                placeholder={'Enter a Quantity'}
                                                onFocus={this.handleFocus}
                                                onBlur={this.handleBlur}
                                                placeholderTextColor="gray"
                                                placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                                onChangeText={(text) => this.setState({
                                                    quantity: text
                                                })}></TextInput>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => this.add_detail()}
                                            style={{ width: widthPercentageToDP('14%'), fontFamily: 'Montserrat-Regular', justifyContent: 'flex-end', alignItems: 'center', marginBottom: widthPercentageToDP('5%') }}>
                                            <SvgUri width="35" height="35" svgXmlData={svgImages.success} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%') }} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                            <TouchableOpacity
                                onPress={() => this.startrender()}
                                // onPress={() => this.props.navigation.navigate('MoveScanproduct')}

                                style={{
                                    width: widthPercentageToDP('75%'),
                                    height: widthPercentageToDP('13%'),
                                    marginHorizontal: widthPercentageToDP('10%'),
                                    marginTop: widthPercentageToDP('5%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    elevation: 4,
                                    backgroundColor: '#65CA8F',
                                    borderRadius: 5, justifyContent: 'center', alignItems: 'center'
                                }} >
                                {
                                    this.state.loadingpro === true ? (
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                            <View style={{ paddingRight: 10 }}>
                                                <ActivityIndicator size={'small'} color='#FFFFFF' />
                                            </View>
                                            <View>
                                                <Text style={styles.btntext}>Please Wait...</Text>
                                            </View>
                                        </View>
                                    ) : (
                                            <Text style={styles.btntext}>{'Start'}</Text>
                                        )
                                }
                                {/* <Text style={styles.btntext}>{'Start'}</Text> */}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
                {this.state.Product.length > 0 ? (
                    <SearchableDropdown
                        title={'Select Products'}
                        data={this.state.Product}
                        onSelect={(selectedItem) => {
                            console.log("selectedItem:", selectedItem)
                            this.setState({ products_code: selectedItem, isModalVisible: false })
                        }}
                        onCancel={() => { this.setState({ isModalVisible: false }) }}
                        isVisible={this.state.isModalVisible === true} />) : null}
                {this.renderModalContent()}
            </Container>
        )
    }
}

export default withNavigation(StockMovement);
var styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    products: {
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        color: '#1D3567'
    },
    productsdisable: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        color: '#C0BCBC'
    },
    selectproducts: {
        flex: 1,
        width: widthPercentageToDP('80%'),
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: widthPercentageToDP('2%'),
    },
    selectproductsdiable: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: widthPercentageToDP('2%'),
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
    header: {
        height: 44,
        backgroundColor: '#FFFFFF',
        justifyContent: 'flex-start',
    },
    text: {
        textAlign: 'left',
        fontFamily: 'Montserrat-Bold',
        color: '#1D3567',
        margin: 5
    },
    textrow: {
        textAlign: 'left',
        fontFamily: 'Montserrat-Regular',
        color: '#1D3567',
        margin: 5

    },
    row: {
        height: 40,
        backgroundColor: '#EAF1FC',

    },
    overlay: {
        height: Platform.OS === "android" ? Dimensions.get("window").height : null,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    modal1: {
        maxHeight: 290,
        minHeight: 80
    },
});