import React, { Component } from 'react';
import { Text, View, StatusBar, StyleSheet, TouchableOpacity, ToastAndroid, Dimensions, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container } from 'native-base';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import SearchableDropdown from './searchablebleDropdown';
import svgImages from '../Images/images';
import moment from 'moment';
import APIService from '../component/APIServices';
import Headers from '../component/Headers';


class ScanCheck extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            tableHead: ['Product Code', 'Quantity'],
            widthArr: [widthPercentageToDP('44%'), widthPercentageToDP('44%')],
            heightProduct: widthPercentageToDP('85%'),
            heightExpiry: widthPercentageToDP('85%'),
            heightmanufac: widthPercentageToDP('85%'),
            heightmanuloc: widthPercentageToDP('85%'),
            heightMRP: widthPercentageToDP('85%'),
            Product: '',
            products: '',
            data: ''

        }

    }
    componentDidMount() {
        console.log("scan check screen")

        this.setState({ data: this.props.navigation.state.params.item, products: this.props.navigation.state.params.item.selected_sequence_number }, () => {
            console.log("selected_sequence_number:", this.props.navigation.state.params.item.selected_sequence_number)
        })
    }

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

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible, Product: this.state.data.dropdown_list, });
    };

    updateSize = (height) => {
        this.setState({
            height: height
        });
    }

    updateSizeProduct = (height) => {
        this.setState({
            heightProduct: height
        });
    }

    updateSizeMRP = (height) => {
        this.setState({
            heightMRP: height
        });
    }

    updateSizemanufac = (height) => {
        this.setState({
            heightmanufac: height
        });
    }

    updateSizeExpiry = (height) => {
        this.setState({
            heightExpiry: height
        });
    }

    updateSizemanuloc = (height) => {
        this.setState({
            heightmanuloc: height
        });
    }

    async save_completed() {
        this.setState({ saveloading: true })
        var data = {}
        data.sequence_number = this.state.data.product.sequence_number
        data.product_id = this.state.data.product.product_id
        data.parent_level_id = this.state.data.product.parent_level_id
        data.parent_sequence_number = this.state.products
        var save_competed = await APIService.execute('POST', APIService.URLBACKEND + 'scanCheck/scanandmove', data)
        if (save_competed.data.status_code == 200) {
            ToastAndroid.show(save_competed.data.message, ToastAndroid.LONG, 25, 50);
            this.setState({ saveloading: false })
            this.props.navigation.navigate('Dashboard')

        }
        else {
            ToastAndroid.show(save_competed.data.message, ToastAndroid.LONG, 25, 50);
            this.setState({ saveloading: false })

        }
        // this.props.navigation.navigate('FirstandLast')
    }


    render() {
        const { selectedItems, height, newValue } = this.state
        const tableData = [['Lenovo XLS12', '50'],
        ['LG X 1234', '40'],
        ['Redmi MI A', '60'],
        ['ONIDA MG12', '80'],
        ['OPPO SM89', '50'],
        ['IphoneX', '99']]

        let newStyle = {
            height
        }
        return (
            <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                <Headers isHome={true} onBackHome={() => { this.props.navigation.navigate('Dashboard') }} label={"Scan & Check"} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', margin: widthPercentageToDP('4%') }}>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                                    <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'Montserrat-Bold' }}>{this.state.data ? this.state.data.product.sequence_number != null ? this.state.data.product.sequence_number : '---' : "----"}</Text>
                                    <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'Montserrat-Regular' }}>Level: {this.state.data ? this.state.data.product.level_id == 1 ? "SKU" : this.state.data.product.level_id == 2 ? "Shipper" : '---' : '---'}</Text>
                                </View>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', marginTop: widthPercentageToDP('2%'), marginBottom: widthPercentageToDP('2%') }}>
                                <TouchableOpacity
                                    onContentSizeChange={(e) => this.updateSizeProduct(e.nativeEvent.contentSize.height)}
                                    style={{
                                        width: widthPercentageToDP('94%'),
                                        height: widthPercentageToDP('12%'),
                                        marginTop: widthPercentageToDP('2%'),
                                        marginBottom: widthPercentageToDP('2%'),
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        shadowRadius: 3,
                                        elevation: 4,
                                        backgroundColor: '#FFFFFF',
                                        flexDirection: 'row',
                                        borderRadius: 5, justifyContent: 'flex-start', alignItems: 'center', padding: widthPercentageToDP('4%')
                                    }} >
                                    <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                    <Text onContentSizeChange={(e) => this.updateSizeProduct(e.nativeEvent.contentSize.height)} style={styles.selectproducts}>Product Name:{this.state.data ? this.state.data.product_details.length > 0 ? this.state.data.product_details[0].product_name : '---' : '---'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    width: widthPercentageToDP('94%'),
                                    height: widthPercentageToDP('12%'),
                                    margin: widthPercentageToDP('2%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    elevation: 4,
                                    backgroundColor: '#FFFFFF',
                                    flexDirection: 'row',
                                    borderRadius: 5, justifyContent: 'flex-start', alignItems: 'center', padding: widthPercentageToDP('4%')
                                }} >
                                    <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                    <Text style={styles.selectproducts}>{"MRP:"}</Text>
                                    <Text onContentSizeChange={(e) => this.updateSizeMRP(e.nativeEvent.contentSize.height)} style={styles.selectproducts}>{this.state.data ? this.state.data.product.product_mrp || '---' : '---'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onContentSizeChange={(e) => this.updateSizeMRP(e.nativeEvent.contentSize.height)}
                                    style={{
                                        width: widthPercentageToDP('94%'),
                                        margin: widthPercentageToDP('2%'),
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        shadowRadius: 3,
                                        elevation: 4,
                                        backgroundColor: '#FFFFFF',
                                        flexDirection: 'row',
                                        borderRadius: 5, justifyContent: 'flex-start', alignItems: 'center', padding: widthPercentageToDP('4%')
                                    }} >
                                    <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                    <Text onContentSizeChange={(e) => this.updateSizemanufac(e.nativeEvent.contentSize.height)} style={styles.selectproducts}>Manufacturing Date: {this.state.data ? this.state.data.product.manu_date != null ? moment.unix(this.state.data.product.manu_date).format('DD MMM, YYYY') : '---' : '---'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{
                                    width: widthPercentageToDP('94%'),
                                    height: widthPercentageToDP('12%'),
                                    margin: widthPercentageToDP('2%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    elevation: 4,
                                    backgroundColor: '#FFFFFF',
                                    flexDirection: 'row',
                                    borderRadius: 5, justifyContent: 'flex-start', alignItems: 'center', padding: widthPercentageToDP('4%')
                                }} >
                                    <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                    <Text style={styles.selectproducts}>{"Expiry Date:"}</Text>
                                    <Text onContentSizeChange={(e) => this.updateSizeExpiry(e.nativeEvent.contentSize.height)} style={styles.selectproducts}>{this.state.data ? this.state.data.product.exp_date != null ? moment.unix(this.state.data.product.exp_date).format('DD MMM, YYYY') : '---' : '---'}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{
                                    width: widthPercentageToDP('94%'),
                                    height: widthPercentageToDP('12%'),
                                    margin: widthPercentageToDP('2%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    elevation: 4,
                                    backgroundColor: '#FFFFFF',
                                    flexDirection: 'row',
                                    borderRadius: 5, justifyContent: 'flex-start', alignItems: 'center', padding: widthPercentageToDP('4%')
                                }} >
                                    <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                    <Text style={styles.selectproducts}>{"Manufature location: "}</Text>
                                    <Text onContentSizeChange={(e) => this.updateSizemanuloc(e.nativeEvent.contentSize.height)} style={styles.selectproducts}>{this.state.data ? this.state.data.product.manu_location != 'null' ? this.state.data.product.manu_location : '---' : '---'}</Text>
                                </TouchableOpacity>

                                <View style={{
                                    width: widthPercentageToDP('94%'),
                                    height: widthPercentageToDP('10%'),
                                    // marginLeft: widthPercentageToDP('5%'),
                                    marginTop: widthPercentageToDP('5%'),
                                    marginRight: widthPercentageToDP('5%'),
                                    backgroundColor: '#FFFFFF',
                                    flexDirection: 'row',
                                    borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start',
                                }}>
                                    <Text style={styles.products}>Move to Shipper</Text>
                                    <Text style={{
                                        justifyContent: 'flex-start',
                                        alignItems: 'center',
                                        margin: widthPercentageToDP('2%'),
                                        marginLeft: widthPercentageToDP('1%'),
                                        marginRight: widthPercentageToDP('1%'), color: 'red'
                                    }}>*</Text>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: widthPercentageToDP('3%'), marginBottom: widthPercentageToDP('5%') }}>

                                    <TouchableOpacity style={{
                                        width: widthPercentageToDP('84%'),
                                        height: widthPercentageToDP('10%'),
                                        // marginLeft: widthPercentageToDP('3%'),
                                        // marginRight: widthPercentageToDP('2%'),
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        shadowRadius: 3,
                                        elevation: 4,
                                        backgroundColor: '#FFFFFF',
                                        flexDirection: 'row',
                                        borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: widthPercentageToDP('5%'),
                                    }} onPress={this.toggleModal}>
                                        <Text style={styles.selectproducts}>{this.state.products || "Select a Product"}</Text>
                                        <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: widthPercentageToDP('4%'), marginRight: widthPercentageToDP('4%') }} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        // onPress={() => this.props.navigation.navigate('DashScanner', { id: 2 })}
                                        style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', margin: widthPercentageToDP('1%') }}>
                                        <SvgUri width="35" height="25" svgXmlData={svgImages.photo_camera} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                    </TouchableOpacity>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                                    {this.state.data ? this.state.products == this.state.data.selected_sequence_number ? <View
                                        // onPress={() => this.save_completed()}
                                        style={{
                                            flex: 1,
                                            height: widthPercentageToDP('12%'),
                                            marginRight: widthPercentageToDP('7%'),
                                            marginHorizontal: widthPercentageToDP('7%'),
                                            marginTop: widthPercentageToDP('2%'),
                                            marginBottom: widthPercentageToDP('2%'),
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            shadowColor: '#CECECE',
                                            shadowRadius: 3,
                                            elevation: 4,
                                            backgroundColor: '#65CA8F',
                                            borderRadius: 5, justifyContent: 'center', alignItems: 'center'
                                        }}>
                                        {
                                            this.state.saveloading === true ? (
                                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                    <View style={{ paddingRight: 10 }}>
                                                        <ActivityIndicator size={'small'} color='#FFFFFF' />
                                                    </View>
                                                    <View>
                                                        <Text style={styles.btntext}>Please wait...</Text>
                                                    </View>
                                                </View>
                                            ) : (
                                                    <Text style={styles.btntext}>{'Save & Complete'}</Text>
                                                )
                                        }

                                    </View> : <TouchableOpacity
                                        onPress={() => this.save_completed()}
                                        style={{
                                            flex: 1,
                                            height: widthPercentageToDP('12%'),
                                            marginRight: widthPercentageToDP('7%'),
                                            marginHorizontal: widthPercentageToDP('7%'),
                                            marginTop: widthPercentageToDP('2%'),
                                            marginBottom: widthPercentageToDP('2%'),
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            shadowColor: '#CECECE',
                                            shadowRadius: 3,
                                            elevation: 4,
                                            backgroundColor: '#65CA8F',
                                            borderRadius: 5, justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            {
                                                this.state.saveloading === true ? (
                                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                        <View style={{ paddingRight: 10 }}>
                                                            <ActivityIndicator size={'small'} color='#FFFFFF' />
                                                        </View>
                                                        <View>
                                                            <Text style={styles.btntext}>Please wait...</Text>
                                                        </View>
                                                    </View>
                                                ) : (
                                                        <Text style={styles.btntext}>{'Save & Complete'}</Text>
                                                    )
                                            }
                                        </TouchableOpacity> : null}
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    {this.renderModalContent()}

                </View>
                {this.state.Product.length > 0 ? (
                    <SearchableDropdown
                        title={'Select Products'}
                        data={this.state.Product}
                        onSelect={(selectedItem) => {
                            this.setState({ products: selectedItem.sequence_number, isModalVisible: false })
                        }}
                        onCancel={() => { this.setState({ isModalVisible: false }) }}
                        isVisible={this.state.isModalVisible === true} />) : null}
            </Container>

        )

    }
}

export default withNavigation(ScanCheck);

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
        margin: widthPercentageToDP('3%'),
        marginRight: widthPercentageToDP('1%'),
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
        margin: widthPercentageToDP('2%'),
        marginLeft: widthPercentageToDP('1%'),
        marginRight: widthPercentageToDP('1%')

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
        height: 48,
        backgroundColor: '#FFFFFF'
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
    }
});