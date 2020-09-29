import React, { Component } from 'react';
import { Text, View, FlatList, StatusBar, StyleSheet,TouchableOpacity, AsyncStorage, ToastAndroid, Dimensions, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import {  Container } from 'native-base';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import APIService from '../component/APIServices';
import Headers from '../component/Headers';
import moment from "moment";

var screen = Dimensions.get('window');

class Highlevel extends Component {
    static navigationOptions = { header: null }
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            data: '',
            page_no: 0,
            page_count: 50,
            progressText: 'Loading...',
            scanhistory: true,
            expanded: true
        }
    }

    async componentDidMount() {
        this.setState({ data: this.props.navigation.state.params.item }, () => {
            console.log("data:data", this.state.data.data)
        })
    }

    async Updatedata() {
        var logintoken = await AsyncStorage.getItem('loginData');
        var decoded = ''
        if (logintoken) {
            logintoken = JSON.parse(logintoken);
            var jwtDecode = require('jwt-decode');
            decoded = jwtDecode(logintoken.token);
        }
        var data = {}
        data.sequence_number = this.state.data ? this.state.data.data.data.table_data[0].sequence_number : null
        var Updatedata = await APIService.execute('POST', APIService.URLBACKEND + 'scanCheck/scanandcheck', data)
        if (Updatedata.data.status_code == 200) {
            this.setState({ data: Updatedata })
        } else {
            ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);
        }
    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    updateSize = (height) => {
        this.setState({
            height
        });
    }

    conformationNo() {
        this.setState({ loading: false });
        this.refs.modal6.close();
    }

    conformation() {
        this.setState({ loading: false });
        this.refs.modal6.close();
        this.props.navigation.navigate('FirstandLast');
    }

    scanhistory() {
        this.setState({ scanhistory: false }, async () => {
            var data = {}
            data.sequence_number = this.state.data ? this.state.data.data.data.card_details[0].sequence_number : null;
            var History = await APIService.execute('POST', APIService.URLBACKEND + 'scanCheck/getscanhistory', data);
            this.setState({ History: History.data.data.data })
        })
    }

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

    async ProductDetails(item, index, Sequence_data) {
        console.log('item',Sequence_data)
        if(Sequence_data.level_id > 1){
            var data = {}
            data.sequence_number = item.table_data ? item.table_data[index].sequence_number : null;
            var Updatedata = await APIService.execute('POST', APIService.URLBACKEND + 'scanCheck/scanandcheck', data)
            if (Updatedata.data.status_code == 200) {
                if (Updatedata.data.data.level_id > 2) {
                    this.setState({ data: Updatedata })
                } else {
                    this.props.navigation.navigate("Shipperlevel", { item: Updatedata });
                }
            }
            else if (Updatedata.data.status_code == 400) {
                ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);
            }
        }
        else if(Sequence_data.level_id == 1){ 
            var body_data = {}
            body_data.sequence_number = item.table_data ? item.table_data[index].sequence_number : null;
            var ResponseData = await APIService.execute('POST', APIService.URLBACKEND + 'scanCheck/getproductdetails', body_data)
            if (ResponseData.data.status_code == 200) {
                    this.props.navigation.navigate("SKUlevel", { item: ResponseData });
            }
            else if (ResponseData.data.status_code == 400) {
                ToastAndroid.show(ResponseData.data.message, ToastAndroid.LONG, 25, 50);
            }
        }
    }

    render() {
        return (
            <Container style={{ flex: 1, backgroundColor: '#F1F3FD' }}>
                <Headers isHome={true} onBackHome={() => { this.props.navigation.navigate('Dashboard') }} label={this.state.data ? this.state.data.data.data.card_details[0].level_name : '---'} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <View style={{ flexDirection: 'row', backgroundColor: '#F1F3FD', justifyContent: 'space-between', alignItems: 'center', margin: widthPercentageToDP('2%') }}>
                        <TouchableOpacity
                            onPress={() => this.setState({ scanhistory: true })}
                            style={{ flex: 1, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowColor: '#CECECE', shadowRadius: 3, borderRadius: 5, padding: widthPercentageToDP('4%'), marginLeft: widthPercentageToDP('1%'), marginTop: widthPercentageToDP('4%'), marginRight: widthPercentageToDP('1%'), marginBottom: widthPercentageToDP('4%'), flexDirection: 'column', elevation: 4, backgroundColor: this.state.scanhistory ? '#65CA8F' : '#FFFFFF', justifyContent: 'center', alignItems: 'center', height: widthPercentageToDP('15%') }}>
                            <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'Montserrat-Bold', color: this.state.scanhistory ? '#1D3567' : '#1D3567' }}>{this.state.data ? this.state.data.data.data.card_details[0].level_name : '---'}</Text>
                            {/* <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'Montserrat-Regular', fontSize: 9, color: '#1D3567' }}>Seq No: PP123445456</Text> */}
                        </TouchableOpacity>
                        {/* <SvgUri width="20" height="13" fill="#000000" svgXmlData={svgImages.right_arrow} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', margin: widthPercentageToDP('2%') }} /> */}
                        <TouchableOpacity onPress={() => this.scanhistory()} style={{ flex: 1, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowColor: '#CECECE', shadowRadius: 3, borderRadius: 5, padding: widthPercentageToDP('4%'), marginLeft: widthPercentageToDP('1%'), marginTop: widthPercentageToDP('4%'), marginRight: widthPercentageToDP('1%'), marginBottom: widthPercentageToDP('4%'), flexDirection: 'column', elevation: 4, backgroundColor: this.state.scanhistory ? '#FFFFFF' : '#65CA8F', justifyContent: 'center', alignItems: 'center', height: widthPercentageToDP('15%') }}>
                            <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'Montserrat-Bold', color: this.state.scanhistory ? '#1D3567' : '#1D3567' }}>Scan History</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView style={{ flex: 1 }}>
                        {
                            this.state.scanhistory ?
                                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: widthPercentageToDP('2%') }}>
                                    <View
                                        onContentSizeChange={(e) => this.updateSizeProduct(e.nativeEvent.contentSize.height)}
                                        style={{
                                            width: widthPercentageToDP('94%'),
                                            height: widthPercentageToDP('10%'),
                                            marginTop: widthPercentageToDP('1%'),
                                            marginBottom: widthPercentageToDP('1%'),
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            shadowColor: '#CECECE',
                                            shadowRadius: 3,
                                            elevation: 4,
                                            backgroundColor: '#FFFFFF',
                                            flexDirection: 'row',
                                            borderRadius: 5, justifyContent: 'flex-start', alignItems: 'center', padding: widthPercentageToDP('2%')
                                        }} >
                                        <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                        <Text onContentSizeChange={(e) => this.updateSizeProduct(e.nativeEvent.contentSize.height)} style={styles.selectproducts}>{this.state.data ? this.state.data.data.data.card_details[0].level_name : 'pallet'}: {this.state.data ? this.state.data.data.data.card_details[0].sequence_number : '--'}</Text>
                                    </View>
                                    <View
                                        onContentSizeChange={(e) => this.updateSizeProduct(e.nativeEvent.contentSize.height)}
                                        style={{
                                            width: widthPercentageToDP('94%'),
                                            height: widthPercentageToDP('10%'),
                                            marginTop: widthPercentageToDP('2%'),
                                            marginBottom: widthPercentageToDP('1%'),
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            shadowColor: '#CECECE',
                                            shadowRadius: 3,
                                            elevation: 4,
                                            backgroundColor: '#FFFFFF',
                                            flexDirection: 'row',
                                            borderRadius: 5, justifyContent: 'flex-start', alignItems: 'center', padding: widthPercentageToDP('2%')
                                        }} >
                                        <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                        <Text onContentSizeChange={(e) => this.updateSizeProduct(e.nativeEvent.contentSize.height)} style={styles.selectproducts}>Truck UID: {this.state.data ? this.state.data.data.data.card_details[0].parent_sequence_number : '--'}</Text>
                                        {this.state.data && this.state.data.data.data.card_details[0].parent_sequence_number != null ?
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ScanMove', { item: this.state.data.data.data.card_details[0].parent_sequence_number })} style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <SvgUri width="22" height="12" color={'#fff'} svgXmlData={svgImages.edit} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', }} />
                                            </TouchableOpacity>
                                            : <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                <SvgUri width="22" height="12" color={'#fff'} svgXmlData={svgImages.edit} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', }} /></View>}
                                    </View> 
                                    <View
                                        onContentSizeChange={(e) => this.updateSizeProduct(e.nativeEvent.contentSize.height)}
                                        style={{
                                            flex: 1,
                                            width: widthPercentageToDP('94%'),
                                            // height: widthPercentageToDP('10%'),
                                            marginTop: widthPercentageToDP('1%'),
                                            marginBottom: widthPercentageToDP('1%'),
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            shadowColor: '#CECECE',
                                            shadowRadius: 3,
                                            elevation: 4,
                                            backgroundColor: '#FFFFFF',
                                            flexDirection: 'row',
                                            borderRadius: 5, justifyContent: 'flex-start', alignItems: 'center', padding: widthPercentageToDP('2%')
                                        }} >
                                        <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                        <Text onContentSizeChange={(e) => this.updateSizeProduct(e.nativeEvent.contentSize.height)} style={{ flex: 1 }}>Product Name: {this.state.data && this.state.data.data.data.card_details[0] ? this.state.data.data.data.card_details[0].product_name : '----'}</Text>
                                    </View>
                                    <View
                                        onContentSizeChange={(e) => this.updateSizeProduct(e.nativeEvent.contentSize.height)}
                                        style={{
                                            width: widthPercentageToDP('94%'),
                                            height: widthPercentageToDP('10%'),
                                            marginTop: widthPercentageToDP('1%'),
                                            marginBottom: widthPercentageToDP('1%'),
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            shadowColor: '#CECECE',
                                            shadowRadius: 3,
                                            elevation: 4,
                                            backgroundColor: '#FFFFFF',
                                            flexDirection: 'row',
                                            borderRadius: 5, justifyContent: 'flex-start', alignItems: 'center', padding: widthPercentageToDP('2%')
                                        }} >
                                        <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                        <Text onContentSizeChange={(e) => this.updateSizeProduct(e.nativeEvent.contentSize.height)} style={styles.selectproducts}>Total Quantity: {this.state.data ? this.state.data.data.data.card_details[0].total_product_count : '--'}</Text>
                                    </View>
                                    <View style={{
                                        flex: 1, width: widthPercentageToDP('94%'), shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        marginBottom: widthPercentageToDP('2%'),
                                        marginTop: widthPercentageToDP('2%'),
                                        paddingTop: widthPercentageToDP('2%'),
                                        paddingBottom: widthPercentageToDP('2%'),
                                        marginHorizontal: widthPercentageToDP('1%'),
                                        shadowRadius: 3,
                                        borderRadius: 5,
                                        flexDirection: 'row',
                                        elevation: 4,
                                        backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'center'
                                    }} >
                                        <View style={{
                                            flex: 1,
                                            flexDirection: 'column',
                                            backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%'),
                                        }}>
                                            <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'flex-start', marginHorizontal: widthPercentageToDP('2%') }}>
                                                <View style={{
                                                    flexDirection: 'row', width: widthPercentageToDP('39%'), height: widthPercentageToDP('6%'),
                                                    backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'center',
                                                }}>
                                                    <Text style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567', fontWeight: 'bold' }}>{'Sequence UID'}</Text>
                                                </View>
                                                {/* <View style={{justifyContent:'flex-end', alignItems:'flex-end',margin:widthPercentageToDP('2%'), flex:1, flexDirection:'row',padding:widthPercentageToDP('1%'),borderWidth:1}}> */}
                                                <View style={{
                                                    flexDirection: 'row', width: widthPercentageToDP('28.5%'), height: widthPercentageToDP('6%'),
                                                    backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'center',
                                                }}>
                                                    <Text style={{ margin: 2, color: '#1D3567', fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>{'Product'}</Text>
                                                </View>

                                                <View style={{
                                                    flexDirection: 'row', width: widthPercentageToDP('22.5%'), height: widthPercentageToDP('6%'),
                                                    backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'center',
                                                }}>
                                                    <Text style={{ margin: 2, color: '#1D3567', fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>{'Quantity'}</Text>
                                                </View>
                                                {/* </View> */}
                                            </View>
                                            <View style={{ flex: 1, width: widthPercentageToDP('90%'), borderBottomColor: '#DBDBDB', borderBottomWidth: 1, marginHorizontal: widthPercentageToDP('1%'), marginTop: widthPercentageToDP('2%'), marginBottom: widthPercentageToDP('4%') }} />
                                            <FlatList
                                                extraData={this.state.data ? this.state.data.data.data.table_data : ''}
                                                data={this.state.data ? this.state.data.data.data.table_data : ''}
                                                renderItem={({ item, index }) => (
                                                    <TouchableOpacity
                                                        onPress={() => { this.ProductDetails(this.state.data.data.data, index, item) }} style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'flex-start', marginHorizontal: widthPercentageToDP('2%') }}>
                                                        <View style={{
                                                            flexDirection: 'row', width: widthPercentageToDP('39%'), height: widthPercentageToDP('6%'),
                                                            backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'center',
                                                        }}>
                                                            <Text style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567' }}>{item.sequence_number || '--'}</Text>
                                                        </View>
                                                        {/* <View style={{justifyContent:'flex-end', alignItems:'flex-end',margin:widthPercentageToDP('2%'), flex:1, flexDirection:'row',padding:widthPercentageToDP('1%'),borderWidth:1}}> */}
                                                        <View style={{
                                                            flexDirection: 'row', width: widthPercentageToDP('30%'),
                                                            backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'center',
                                                        }}>
                                                            <Text style={{ flex: 1, margin: 2, color: '#1D3567', fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center' }}>{item.product_name || '--'}</Text>
                                                        </View>
                                                        <View style={{
                                                            flexDirection: 'row', width: widthPercentageToDP('22.5%'), height: widthPercentageToDP('6%'),
                                                            backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',
                                                        }}>
                                                            <Text style={{ flex: 1, margin: 2, color: '#1D3567', fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center' }}>{item.total_products}</Text>
                                                        </View>
                                                        {/* </View> */}
                                                    </TouchableOpacity>
                                                )} />
                                        </View>
                                    </View>
                                </View>
                                : <View style={{
                                    flex: 1,
                                    flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center',
                                    backgroundColor: '#F1F3FD'
                                }}>
                                    <FlatList
                                        extraData={this.state.History}
                                        data={this.state.History}
                                        renderItem={({ item }) => (
                                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', width: widthPercentageToDP('93%') }}>
                                                <View>
                                                    <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', marginLeft: -5 }} />
                                                    <View style={{ height: widthPercentageToDP('25%'), borderLeftColor: '#DBDBDB', borderLeftWidth: 1, marginTop: widthPercentageToDP('1%'), marginBottom: widthPercentageToDP('1%'), marginRight: widthPercentageToDP('1%'), marginLeft: 5 }} />
                                                </View>
                                                <View
                                                    style={{
                                                        flex: 3, shadowOffset: { width: 0, height: 2 },
                                                        shadowOpacity: 0.8,
                                                        shadowColor: '#CECECE',
                                                        shadowRadius: 3,
                                                        marginTop: widthPercentageToDP('2%'),
                                                        borderRadius: 5,
                                                        width: widthPercentageToDP('85%'),
                                                        flexDirection: 'column',
                                                        elevation: 4,
                                                        backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start', padding: widthPercentageToDP('1%'), margin: widthPercentageToDP('0.5%')
                                                    }}>
                                                    <View style={{ marginLeft: widthPercentageToDP('2%'), flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                        <View style={{
                                                            flex: 1,
                                                            backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start'
                                                        }}>
                                                            <Text style={{ margin: 2, color: '#1D3567', fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center', fontSize: 14, fontWeight: 'bold' }}>{item.activity}</Text>
                                                        </View>
                                                        <View style={{
                                                            flex: 1,
                                                            flexDirection: 'row',
                                                            backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start'
                                                        }}>
                                                            <SvgUri width="22" height="12" svgXmlData={svgImages.calendar} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: 5, marginLeft: -3 }} />
                                                            <Text style={{ margin: 2, fontSize: 12, color: '#1D3567', fontFamily: 'Montserrat-Regular', justifyContent: 'flex-start', alignItems: 'flex-start' }}>{item.time != 'null' || item.time ? moment.unix(item.time).format('DD MMM YYYY') + ' at ' + moment.unix(item.time).format('HH:mm') : '---'}</Text>
                                                             </View>
                                                    </View>
                                                    <View style={{ flex: 1, width: widthPercentageToDP('80%'), borderBottomColor: '#DBDBDB', borderBottomWidth: 1, marginHorizontal: widthPercentageToDP('1%'), marginTop: -20 }} />
                                                    <View style={{marginLeft: widthPercentageToDP('2%'), flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: -10 }}>
                                                        <View style={{
                                                            flex: 1, flexDirection: 'row',
                                                            backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start'
                                                        }}>
                                                            <SvgUri width="12" height="12" svgXmlData={svgImages.profile} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', marginTop: 5 }} />
                                                            <Text style={{ fontSize: 11, color: '#1D3567', fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center', marginLeft: 10, marginTop: 5, }}>{item.user}</Text>
                                                       
                                                            </View>
                                                        <View style={{
                                                            flex: 1,
                                                            flexDirection: 'row',
                                                            backgroundColor: '#FFFFFF', alignItems: 'center',
                                                        }}>
                                                            <SvgUri width="20" height="15" svgXmlData={svgImages.marker} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', marginTop: -5, }} />
                                                            <Text style={{ margin: 2, marginRight: 10, fontSize: 12, color: '#1D3567', marginTop: -5, fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center' }}>{item.location != 'null' ? item.location : '---'}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        )} />
                                </View>
                        }
                    </ScrollView>
                </View>
                {this.renderModalContent()}
            </Container>
        )
    }
}

export default withNavigation(Highlevel);

var styles = StyleSheet.create({

    linearGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F3FD',
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
    text: {
        textAlign: 'left',
        fontFamily: 'Montserrat-Bold',
        color: '#1D3567',
        margin: 5
    },
    textrow: {
        textAlign: 'left',
        color: '#1D3567',
        margin: 5,
        fontFamily: 'Montserrat-Regular',
    },
    row: {
        flex: 1,
        height: 40,
        flexDirection: 'row',
        backgroundColor: '#EAF1FC',
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
    }
});