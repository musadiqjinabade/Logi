import React, { Component } from 'react';
import { Text, View, FlatList, StatusBar, StyleSheet, Image, TouchableOpacity, AsyncStorage, ToastAndroid } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Button, Container, Right, Title, Header, Body, Left } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import moment from 'moment';
import APIService from '../component/APIServices';
import Headers from '../component/Headers';
import Modal from 'react-native-modalbox';

class SKUlevel extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            data: '',
            scanhistory: true,
            expanded: true,
            tagsvg: false
        }
    }

    componentDidMount() {
        this.setState({ data: this.props.navigation.state.params.item }, () => {
            console.log("data:data", this.state.data.data.data.data)
        })
        this.props.navigation.addListener('didFocus', (item) => {
            console.log("sku", this.state.data.data.data.data[0].sequence_number)
            this.Updatedata()
        });
    }

    async Updatedata() {
        var logintoken = await AsyncStorage.getItem('loginData');
        var decoded = ''
        if (logintoken) {
            logintoken = JSON.parse(logintoken);
            var jwtDecode = require('jwt-decode');
            decoded = jwtDecode(logintoken.token);
            // console.log('decoded:', decoded)
        }
        var data = {}
        data.sequence_number = this.state.data ? this.state.data.data.data.data[0].sequence_number : null
        console.log("body:", data)
        var Updatedata = await APIService.execute('POST', APIService.URLBACKEND + 'scanCheck/getproductdetails', data)
        console.log('reload:', Updatedata)
        if (Updatedata.data.status_code == 200) {
            this.setState({ data: Updatedata })
        } else {
            ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);
        }
    }

    scanhistory() {
        this.setState({ scanhistory: false }, async () => {
            var data = {}
            data.sequence_number = this.state.data ? this.state.data.data.data.data[0].sequence_number : null;
            var History = await APIService.execute('POST', APIService.URLBACKEND + 'scanCheck/getscanhistory', data);
            console.log("history:", History)
            this.setState({ History: History.data.data.data })
        })
    }

    gettagdwown() {
        this.setState({ tagsvg: !this.state.tagsvg })
    }

    async getdetails(item) {
        console.log("data", item)
        // var date = new Date(item.time);
        if (item.activity == "Dispatch") {
            var body = {}
            body.job_id = item.job_id || null
            body.workorder_no = null
            body.activity_type = item.activity || null
            body.search_string = '' 
            var data = await APIService.execute('POST', APIService.URLBACKEND + 'scanCheck/getproductactivitydetails', body)
            console.log("data", data)
            if (data.data.status_code === 200) {
                var formattedDate = moment(Date(data.data.data.start_time_unix)).format("MMM DD, YYYY")
                this.setState({
                    activity: item.activity,
                    job_id: item.job_id,
                    location: item.location,
                    location_from_name: data.data.data.location_from_name,
                    location_from_type: data.data.data.location_from_type,
                    location_to_name: data.data.data.location_to_name,
                    location_to_type: data.data.data.location_to_type,
                    document_no: data.data.data.document_no,
                    document_type: data.data.data.document_type,
                    time: formattedDate,
                    user: item.user
                }, () => {
                    this.refs.modal6.open()
                })
            }
        }
        else if (item.activity == "Receive" || item.activity == "Product Return") {
            var body = {}
            body.job_id = item.job_id || null
            body.workorder_no = null
            body.activity_type = item.activity || null
            body.search_string = '' 
            var data = await APIService.execute('POST', APIService.URLBACKEND + 'scanCheck/getproductactivitydetails', body)
            console.log("data", data, data.data.data.start_time_unix)
            if (data.data.status_code === 200) {
                var formatDate = moment(Date(data.data.data.start_time_unix)).format("MMM DD, YYYY") 
                this.setState({
                    activity: item.activity,
                    job_id: item.job_id,
                    location: item.location,
                    location_from_name: data.data.data.location_from_name,
                    location_from_type: data.data.data.location_from_type,
                    location_to_name: data.data.data.location_to_name,
                    location_to_type: data.data.data.location_to_type,
                    document_no: data.data.data.document_no,
                    document_type: data.data.data.document_type,
                    time: formatDate,
                    user: item.user
                }, () => {
                    this.refs.modal7.open()
                })
            }
        }
        else {
            ToastAndroid.show("No Data for this Activity", ToastAndroid.LONG, 25, 50);
        }
    }

    render() {
        var fontSize = 12;
        if (this.state.data) {
            return (
                <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                    <Headers isHome={true} onBackHome={() => { this.props.navigation.navigate('Dashboard') }} label={"Scan & Check"} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                    <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                    <View style={styles.linearGradient}>
                        <View style={{ flexDirection: 'row', backgroundColor: '#F1F3FD', justifyContent: 'space-between', alignItems: 'center', margin: widthPercentageToDP('2%') }}>
                            <TouchableOpacity
                                onPress={() => this.setState({ scanhistory: true })}
                                style={{ flex: 1, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowColor: '#CECECE', shadowRadius: 3, borderRadius: 5, padding: widthPercentageToDP('4%'), marginLeft: widthPercentageToDP('1%'), marginTop: widthPercentageToDP('4%'), marginRight: widthPercentageToDP('1%'), marginBottom: widthPercentageToDP('4%'), flexDirection: 'column', elevation: 4, backgroundColor: this.state.scanhistory ? '#65CA8F' : '#FFFFFF', justifyContent: 'center', alignItems: 'center', height: widthPercentageToDP('15%') }}>
                                <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'Montserrat-Bold', color: this.state.scanhistory ? '#1D3567' : '#1D3567' }}>Product Details</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.scanhistory()} style={{ flex: 1, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowColor: '#CECECE', shadowRadius: 3, borderRadius: 5, padding: widthPercentageToDP('4%'), marginLeft: widthPercentageToDP('1%'), marginTop: widthPercentageToDP('4%'), marginRight: widthPercentageToDP('1%'), marginBottom: widthPercentageToDP('4%'), flexDirection: 'column', elevation: 4, backgroundColor: this.state.scanhistory ? '#FFFFFF' : '#65CA8F', justifyContent: 'center', alignItems: 'center', height: widthPercentageToDP('15%') }}>
                                <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'Montserrat-Bold', color: this.state.scanhistory ? '#1D3567' : '#1D3567' }}>Scan History</Text>
                            </TouchableOpacity>
                        </View>
                        <ScrollView >
                            {this.state.scanhistory ?
                                <View style={{
                                    flex: 1,
                                    marginTop: widthPercentageToDP('1%'), 
                                    flexDirection: 'column',
                                    elevation: 4, justifyContent: 'space-between', alignItems: 'center',
                                    backgroundColor: '#F1F3FD'
                                }}>

                                    <View
                                        style={{
                                            flex: 1, width: widthPercentageToDP('93%'), height: widthPercentageToDP('40%'), shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            shadowColor: '#CECECE',
                                            // marginBottom: widthPercentageToDP('1%'),
                                            // paddingBottom: widthPercentageToDP('2%'),
                                            marginHorizontal: widthPercentageToDP('1%'),
                                            shadowRadius: 3,
                                            borderRadius: 5,
                                            flexDirection: 'column',
                                            backgroundColor: 'transparent', justifyContent: 'flex-start', alignItems: 'flex-start'
                                        }} >
                                        {/* <SvgUri width="30" height="20" fill="#FFFFFF" svgXmlData={svgImages.parle} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%'),marginRight:widthPercentageToDP('4%') }} /> */}
                                        {this.state.data.data.data.data[1].product_img != null ?

                                            <Image source={{ uri: this.state.data.data.data.data[1].product_img != null ? this.state.data.data.data.data[1].product_img : null }} style={{
                                                width: widthPercentageToDP('93%'),
                                                flex: 1,
                                                height: widthPercentageToDP('56%'),
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center', resizeMode: 'contain',
                                                alignSelf: 'center',
                                                // justifyContent: 'flex-start', alignItems: 'flex-start' , 
                                                borderRadius: 5
                                            }} /> :
                                            <Text style={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold' }}>No product img</Text>}
                                    </View>
                                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
                                        <Text style={{ width: widthPercentageToDP('80%'), justifyContent: 'center', alignSelf: 'center', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold' }}>{this.state.data.data.data.data[1].product_name != null ? this.state.data.data.data.data[1].product_name : '---'}</Text>
                                        <Text style={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular' }}>Product UID: {this.state.data ? this.state.data.data.data.data[0].sequence_number : '---'}</Text>
                                    </View>


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
                                            <Text onContentSizeChange={(e) => this.updateSizeProduct(e.nativeEvent.contentSize.height)} style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular' }}>Brand: {this.state.data.data.data.data[1].brand_name != null ? this.state.data.data.data.data[1].brand_name : '---'}</Text>
                                        </View>
                                        {this.state.data.data.data.data[0].parent_sequence_number != null || this.state.data.data.data.parent_level_name != null ?
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
                                                <Text onContentSizeChange={(e) => this.updateSizeProduct(e.nativeEvent.contentSize.height)} style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular' }}>{this.state.data.data.data.parent_level_name || '---'}: {this.state.data.data.data.data[0].parent_sequence_number != null ? this.state.data.data.data.data[0].parent_sequence_number : '---'}</Text>
                                                {this.state.data.data.data.data[0].parent_sequence_number != null ?
                                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('ScanMove', { item: this.state.data.data.data.data[0].sequence_number })} style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>

                                                        <SvgUri width="22" height="12" color={'#fff'} svgXmlData={svgImages.edit} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', }} />
                                                    </TouchableOpacity>
                                                    : <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }}>
                                                        <SvgUri width="22" height="12" color={'#fff'} svgXmlData={svgImages.edit} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', }} /></View>}

                                            </View> : null}

                                        {this.state.data.data.data.data[0].batch_no != null && this.state.data.data.data.data[0].batch_no != 'null' ?
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
                                                <Text onContentSizeChange={(e) => this.updateSizeProduct(e.nativeEvent.contentSize.height)} style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular' }}>Batch ID: {this.state.data.data.data.data[0].batch_no != null && this.state.data.data.data.data[0].batch_no != 'null' ? this.state.data.data.data.data[0].batch_no : '--'}</Text>

                                            </View> : null}

                                        {this.state.data.data.data.data[0].manu_date != null ?
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
                                                <Text onContentSizeChange={(e) => this.updateSizeProduct(e.nativeEvent.contentSize.height)} style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular' }}>Manufacture Date: {this.state.data.data.data.data[0].manu_date != null ? moment.unix(this.state.data.data.data.data[0].manu_date).format('DD MMM YYYY') : '--'}</Text>
                                            </View> : null}
                                        {this.state.data.data.data.data[0].manu_location && this.state.data.data.data.data[0].manu_location != null && this.state.data.data.data.data[0].manu_location != 'null' ?
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
                                                <Text onContentSizeChange={(e) => this.updateSizeProduct(e.nativeEvent.contentSize.height)} style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular' }}>Manufacture Location: {this.state.data.data.data.data[0].manu_location && this.state.data.data.data.data[0].manu_location != null && this.state.data.data.data.data[0].manu_location != 'null' ? this.state.data.data.data.data[0].manu_location : '--'}</Text>
                                            </View> : null}
                                        {this.state.data.data.data.data[0].exp_date != null ?
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
                                                <Text onContentSizeChange={(e) => this.updateSizeProduct(e.nativeEvent.contentSize.height)} style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular' }}>Expiry Date: {this.state.data.data.data.data[0].exp_date != null ? moment.unix(this.state.data.data.data.data[0].exp_date).format('DD MMM YYYY') : '--'}</Text>

                                            </View> : null}
                                        {this.state.data.data.data.tagName.length > 0 ?

                                            <View
                                                style={{
                                                    width: widthPercentageToDP('94%'),
                                                    flex: 1,
                                                    marginTop: widthPercentageToDP('2%'),
                                                    marginBottom: widthPercentageToDP('1%'),
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.8,
                                                    shadowColor: '#CECECE',
                                                    shadowRadius: 3,
                                                    elevation: 4,
                                                    backgroundColor: '#FFFFFF',
                                                    flexDirection: 'row',
                                                    borderRadius: 5, justifyContent: 'space-between', alignItems: 'center',
                                                }} >
                                                <View style={{ flexDirection: 'column', padding: widthPercentageToDP('2%') }}>
                                                    <View style={{ flexDirection: 'row', }}>
                                                        <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', marginTop: widthPercentageToDP('1%') }} />
                                                        <Text style={{ width: widthPercentageToDP('70%'), justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular' }}>{'Tags: ' + this.state.data.data.data.tagName.length}</Text>

                                                    </View>
                                                    {this.state.tagsvg ?
                                                        <View style={{
                                                            flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignSelf: 'flex-start', margin: widthPercentageToDP('2%')
                                                        }}>

                                                            <FlatList
                                                                extraData={this.state.data.data.data.tagName}
                                                                data={this.state.data.data.data.tagName}
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
                                                        </View>
                                                        : null}
                                                </View>

                                                {this.state.tagsvg ?
                                                    <TouchableOpacity
                                                        onPress={() => this.gettagdwown()} style={{
                                                            width: widthPercentageToDP('10%'), flexDirection: 'column', justifyContent: 'flex-start', alignSelf: 'flex-start', marginBottom: widthPercentageToDP('2%'), padding: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('1%')
                                                        }}>
                                                        <SvgUri width="22" height="15" svgXmlData={svgImages.drop_down} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'flex-end' }} />


                                                    </TouchableOpacity> : this.state.data.data.data.tagName.length > 0 ? <TouchableOpacity
                                                        onPress={() => this.gettagdwown()} style={{
                                                            width: widthPercentageToDP('10%'), flexDirection: 'column', justifyContent: 'flex-start', alignSelf: 'flex-start', marginBottom: widthPercentageToDP('2%'), padding: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('1%')
                                                        }}>
                                                        <SvgUri width="22" height="15" svgXmlData={svgImages.right_arrow_new} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'flex-end' }} />
                                                    </TouchableOpacity> : null}
                                            </View> : null}
                                    </View>
                                </View>
                                :
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center',
                                    backgroundColor: '#F1F3FD'
                                }}>
                                    <FlatList
                                        extraData={this.state.History}
                                        data={this.state.History}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                // onPress={() => {item.activity== "Dispatch"?this.refs.modal6.open():this.props.navigation.navigate('FGSKUScandetails')}}
                                                onPress={() => { this.getdetails(item) }}
                                                style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', width: widthPercentageToDP('93%') }}>
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

                                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
                                                        <View style={{
                                                            flex: 1,
                                                            backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop: widthPercentageToDP('3%')
                                                        }}>
                                                            <Text style={{ margin: 2, color: '#1D3567', fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center', fontSize: 14, fontWeight: 'bold' }}>{item.activity}</Text>
                                                        </View>
                                                        <View style={{
                                                            flex: 1.1,
                                                            flexDirection: 'row',
                                                            backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'center'
                                                        }}>
                                                            <SvgUri width="22" height="12" svgXmlData={svgImages.calendar} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: 5 }} />
                                                            <Text style={{ marginRight: widthPercentageToDP('3%'), fontSize: 12, color: '#1D3567', fontFamily: 'Montserrat-Regular', justifyContent: 'flex-start', alignItems: 'flex-start' }}>{item.time != 'null' || item.time ? moment.unix(item.time).format('DD MMM YYYY') + ' at ' + moment.unix(item.time).format('HH:mm') : '---'}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1, width: widthPercentageToDP('80%'), borderBottomColor: '#DBDBDB', borderBottomWidth: 1, marginHorizontal: widthPercentageToDP('1%'), marginTop: -20 }} />
                                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', paddingBottom: -10 }}>
                                                        <View style={{
                                                            width: widthPercentageToDP('42%'), flexDirection: 'row', marginTop: 10,
                                                            backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start', paddingRight: widthPercentageToDP('3%')
                                                        }}>
                                                            <SvgUri width="12" height="12" svgXmlData={svgImages.profile} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', marginTop: 5, marginLeft: 5 }} />
                                                            <Text style={{ fontSize: 11, color: '#1D3567', fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center', marginLeft: 10, marginTop: 3 }}>{item.user}</Text>
                                                        </View>
                                                        <View style={{
                                                            width: widthPercentageToDP('42%'),
                                                            flexDirection: 'row',
                                                            backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start', paddingHorizontal: widthPercentageToDP('1%')
                                                        }}>
                                                            <SvgUri width="20" height="15" svgXmlData={svgImages.marker} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: 10, }} />
                                                            <Text style={{ fontSize: 12, color: '#1D3567', marginTop: 10, fontFamily: 'Montserrat-Regular', justifyContent: 'flex-start', alignItems: 'flex-start', marginRight: widthPercentageToDP('3') }}>{item.location != 'null' ? item.location : '---'}</Text>
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )} />
                                </View>
                            }
                        </ScrollView>
                        <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"modal6"} swipeArea={20}
                            backdropPressToClose={true}  >
                            <ScrollView>
                                <View style={{ /*height: widthPercentageToDP('65%'),*/ width: widthPercentageToDP('95%'), justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10 }} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'flex-start', padding: 5 }}>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567' }}>{this.state.activity}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', padding: 5 }}>
                                        <Text style={{ flex: 1, fontFamily: 'Montserrat-Regular', alignSelf: 'flex-start', fontSize: fontSize, color: '#1D3567' }}>Location: {this.state.location}</Text>
                                        <Text style={{ flex: 0.5, fontFamily: 'Montserrat-Regular', alignSelf: 'flex-end', fontSize: fontSize, color: '#1D3567' }}>Date: {this.state.time}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', padding: 5 }}>
                                        <Text style={{ flex: 1, fontFamily: 'Montserrat-Regular', alignSelf: 'flex-start', fontSize: fontSize, color: '#1D3567' }}>From: {this.state.location_from_name != null ? this.state.location_from_name : '-'}</Text>
                                        <Text style={{ flex: 1.2, fontFamily: 'Montserrat-Regular', alignSelf: 'flex-end', fontSize: fontSize, color: '#1D3567' }}>Sub-Loc: {this.state.location}</Text>
                                        <Text style={{ flex: 0.9, fontFamily: 'Montserrat-Regular', alignSelf: 'flex-end', fontSize: fontSize, color: '#1D3567' }}>Type: {this.state.location_from_type != null ? this.state.location_from_type : '-'}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', padding: 5 }}>
                                        <Text style={{ flex: 1, fontFamily: 'Montserrat-Regular', alignSelf: 'flex-start', fontSize: fontSize, color: '#1D3567' }}>To: {this.state.location_to_name != null ? this.state.location_to_name : '-'}</Text>
                                        <Text style={{ flex: 1.2, fontFamily: 'Montserrat-Regular', alignSelf: 'flex-end', fontSize: fontSize, color: '#1D3567' }}>Loc: {this.state.location}</Text>
                                        <Text style={{ flex: 0.9, fontFamily: 'Montserrat-Regular', alignSelf: 'flex-end', fontSize: fontSize, color: '#1D3567' }}>Type: {this.state.document_type != null ? this.state.document_type : '-'}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', padding: 5 }}>
                                        <Text style={{ flex: 1, fontFamily: 'Montserrat-Regular', alignSelf: 'flex-start', fontSize: fontSize, color: '#1D3567' }}>Document Type: {this.state.location_to_type != null ? this.state.location_to_type : '-'}</Text>
                                        <Text style={{ flex: 0.4, fontFamily: 'Montserrat-Regular', alignSelf: 'flex-end', fontSize: fontSize, color: '#1D3567' }}>Doc No: {this.state.document_no != null ? this.state.document_no : '-'}</Text>
                                    </View>
                                </View>
                            </ScrollView>
                        </Modal>
                        <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"modal7"} swipeArea={20}
                            backdropPressToClose={true}  >
                            <ScrollView>
                                <View style={{ /*height: widthPercentageToDP('65%'),*/ width: widthPercentageToDP('95%'), justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10 }} >
                                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'flex-start', padding: 5 }}>
                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567' }}>{this.state.activity}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', padding: 5 }}>
                                        <Text style={{ flex: 1, fontFamily: 'Montserrat-Regular', alignSelf: 'flex-start', fontSize: fontSize, color: '#1D3567' }}>Location: {this.state.location}</Text>
                                        <Text style={{ flex: 0.5, fontFamily: 'Montserrat-Regular', alignSelf: 'flex-end', fontSize: fontSize, color: '#1D3567' }}>Date: {this.state.time}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', padding: 5 }}>
                                        <Text style={{ flex: 1, fontFamily: 'Montserrat-Regular', alignSelf: 'flex-start', fontSize: fontSize, color: '#1D3567' }}>From: {this.state.location_from_name != null ? this.state.location_from_name : '-'}</Text>
                                        <Text style={{ flex: 1.2, fontFamily: 'Montserrat-Regular', alignSelf: 'flex-end', fontSize: fontSize, color: '#1D3567' }}>Loc: {this.state.location}</Text>
                                        <Text style={{ flex: 0.9, fontFamily: 'Montserrat-Regular', alignSelf: 'flex-end', fontSize: fontSize, color: '#1D3567' }}>Type: {this.state.location_from_type != null ? this.state.location_from_type : '-'}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', padding: 5 }}>
                                        <Text style={{ flex: 1, fontFamily: 'Montserrat-Regular', alignSelf: 'flex-start', fontSize: fontSize, color: '#1D3567' }}>To: {this.state.location_to_name != null ? this.state.location_to_name : '-'}</Text>
                                        <Text style={{ flex: 1.2, fontFamily: 'Montserrat-Regular', alignSelf: 'flex-end', fontSize: fontSize, color: '#1D3567' }}>Sub-Loc: {this.state.location}</Text>
                                        <Text style={{ flex: 0.9, fontFamily: 'Montserrat-Regular', alignSelf: 'flex-end', fontSize: fontSize, color: '#1D3567' }}>Type: {this.state.document_type != null ? this.state.document_type : '-'}</Text>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', padding: 5 }}>
                                        <Text style={{ flex: 1, fontFamily: 'Montserrat-Regular', alignSelf: 'flex-start', fontSize: fontSize, color: '#1D3567' }}>Document Type: {this.state.location_to_type != null ? this.state.location_to_type : '-'}</Text>
                                        <Text style={{ flex: 0.4, fontFamily: 'Montserrat-Regular', alignSelf: 'flex-end', fontSize: fontSize, color: '#1D3567' }}>Doc No: {this.state.document_no != null ? this.state.document_no : '-'}</Text>
                                    </View>
                                </View>
                            </ScrollView>
                        </Modal>
                    </View>
                </Container>
            )
        }
        else {
            return (
                <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#1D3567', '#1C6DAE']} >
                        <Header transparent>
                            <Left style={{ flex: 1, justifyContent: 'flex-start', marginLeft: 10, flexDirection: 'row', alignItems: 'center' }} >
                                <Button style={{ flex: 1, justifyContent: 'space-between', alignItems: 'center', backgroundColor: "transparent", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0, marginLeft: widthPercentageToDP('-6%') }}
                                    onPress={() => this.props.navigation.goBack()}>
                                    <SvgUri width="30" height="20" fill="#FFFFFF" svgXmlData={svgImages.left_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('4%') }} />
                                    <Title style={{ justifyContent: 'flex-end', alignItems: 'center', fontFamily: 'Montserrat-Bold', }} >SKU level</Title>
                                </Button>
                            </Left>
                            <Body style={{ flex: 1 }} />
                            <Right style={{ flex: 1 }}>
                            </Right>
                        </Header>
                    </LinearGradient>
                </Container>
            )

        }
    }
}


export default withNavigation(SKUlevel);

var styles = StyleSheet.create({

    linearGradient: {
        flex: 1,
        justifyContent: 'center',
        resizeMode: 'contain',
        alignItems: 'center',
        backgroundColor: '#F1F3FD',
        paddingTop: widthPercentageToDP('1%')
    },
    cardRow: {
        flex: 1,
        height: widthPercentageToDP('48%'),
        marginBottom: widthPercentageToDP('4%'),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    cardStyle: {
        flexDirection: 'column',
        width: widthPercentageToDP('94%'),
        height: widthPercentageToDP('47%'),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowColor: '#CECECE',
        shadowRadius: 1,
        elevation: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        marginRight: 8,
        marginLeft: 8,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingTop: 20,
        marginBottom: widthPercentageToDP('5%'),
        paddingBottom: 20
    },
    fulltextStyle: {
        flex: 1,
        fontFamily: 'Montserrat-Regular',
        fontSize: 14,
        color: '#141312',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginRight: widthPercentageToDP('2%'),
        marginBottom: widthPercentageToDP('2%'),
        marginLeft: widthPercentageToDP('8%')
    },
    textStyle: {
        flex: 1,
        fontFamily: 'Montserrat-Bold',
        fontSize: 14,
        color: '#141312',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: widthPercentageToDP('5%'),
        marginRight: widthPercentageToDP('2%'),
        marginLeft: widthPercentageToDP('8%')
    },
    cardtext: {
        flex: 1,
        flexDirection: 'row',
        width: widthPercentageToDP('93%'),
        justifyContent: 'space-between',
        alignItems: 'center'
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
});