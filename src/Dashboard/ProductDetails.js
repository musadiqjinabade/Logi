import React, { Component } from 'react';
import { Text, View, FlatList, StatusBar, StyleSheet, Image, TouchableOpacity, AsyncStorage, ToastAndroid } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Button, Container, Right, Title, Header, Left, Body } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import APIService from '../component/APIServices';
import Headers from '../component/Headers'

class ProductDetails extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            data: '',
            scanhistory: true,
            expanded: true
        }
    }

    componentDidMount() {
        this.setState({ data: this.props.navigation.state.params.item }, () => {
            console.log("data:data", this.state.data)
        })
    }
    scanhistory() {
        this.setState({ scanhistory: false }, async () => {
            var data = {}
            data.sequence_number = this.state.data ? this.state.data.data.data.data[0].sequence_number : null;
            var History = await APIService.execute('POST', APIService.URLBACKEND + 'scanCheck/getscanhistory', data);
            this.setState({ History: History.data.data.data })
        })
    }

    async sequence_number(item) {

        var logintoken = await AsyncStorage.getItem('loginData');
        var decoded = ''
        if (logintoken) {
            logintoken = JSON.parse(logintoken);
            var jwtDecode = require('jwt-decode');
            decoded = jwtDecode(logintoken.token);
            // console.log('decoded:', decoded)
        }

        var data = {}
        // data.mapping_id = this.state.props.data.data.mapping_id
        data.sequence_number = item.sequence_number
        // data.location_id = decoded.location_id[0];
        var Updatedata = await APIService.execute('POST', APIService.URLBACKEND + 'scanCheck/getproductdetails', data)
        this.setState({ message: Updatedata.data.data.message }, () => {
            if (Updatedata.data.status_code == 200) {
                ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);
                this.setState({ product_data: Updatedata.data.data }, () => {
                    if (Updatedata.data.data.message == 'Higher level details') {
                        ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 70);
                        this.props.navigation.navigate("Highlevel", { item: Updatedata });
                    }
                    else {
                        if (Updatedata.data.data.level_id == 1) {
                            ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);
                            this.props.navigation.navigate("SKUlevel", { item: Updatedata });
                        }
                        else if (Updatedata.data.data.level_id == 2) {
                            ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 70);
                            this.props.navigation.navigate("Shipperlevel", { item: Updatedata });
                        }
                    }
                })
            } else if (Updatedata.data.status_code == 400 && this.state.message) {
                ToastAndroid.show(this.state.message, ToastAndroid.LONG, 25, 50);
            } else if (Updatedata.data.status_code == 400) {
                ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);
            }
        })
    }

    render() {
        var count = 0;
        if (this.state.data) {
            return (
                <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                    <Headers isHome={true} onBackHome={() => { this.props.navigation.navigate('Dashboard') }} label={"Product Details"} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                    <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                    <View style={styles.linearGradient}>
                        <ScrollView>
                            <View style={{
                                flex: 1,
                                marginTop: widthPercentageToDP('1%'), 
                                flexDirection: 'column',
                                elevation: 4, justifyContent: 'space-between', alignItems: 'center',
                                backgroundColor: '#F1F3FD'
                            }}>
                                <View
                                    style={{
                                        flex: 1, width: widthPercentageToDP('93%'), height: widthPercentageToDP('60%'), shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        marginHorizontal: widthPercentageToDP('1%'),
                                        shadowRadius: 3,
                                        borderRadius: 5,
                                        flexDirection: 'column',
                                        backgroundColor: 'transparent', justifyContent: 'flex-start', alignItems: 'flex-start'
                                    }} >
                                    {this.state.data.product_details.length > 0 && this.state.data.product_details[0].product_img != null ?
                                        <Image source={{ uri: this.state.data.product_details[0].product_img != null ? this.state.data.product_details[0].product_img : null }} style={{
                                            width: widthPercentageToDP('93%'),
                                            flex: 1,
                                            height: widthPercentageToDP('56%'),
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center', resizeMode: 'contain',
                                            alignSelf: 'center',
                                            borderRadius: 5
                                        }} />
                                        :
                                        <Text style={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold' }}>No product img</Text>}
                                </View>
                                <View style={{ flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
                                    <Text style={{ width: widthPercentageToDP('80%'), justifyContent: 'center', alignSelf: 'center', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold' }}>{this.state.data.product_details.length > 0 && this.state.data.product_details[0].product_name != null ? this.state.data.product_details[0].product_name : '---'}</Text>
                                    <Text style={{ justifyContent: 'center', alignSelf: 'center', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular' }}>Total: {this.state.data ? this.state.data.sequence_details.length : '---'}</Text>
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
                                        backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: widthPercentageToDP('2%')
                                    }}>
                                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'flex-start', marginHorizontal: widthPercentageToDP('2%') }}>
                                            <View style={{
                                                flexDirection: 'row', width: widthPercentageToDP('44%'), height: widthPercentageToDP('6%'),
                                                backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',
                                            }}>
                                                <Text style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567', fontWeight: 'bold' }}>{'Sr. No'}</Text>
                                            </View>
                                            <View style={{
                                                flexDirection: 'row', width: widthPercentageToDP('32.5%'), height: widthPercentageToDP('6%'),
                                                backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',
                                            }}>
                                                <Text style={{ margin: 2, color: '#1D3567', fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' }}>{'Sequence UID'}</Text>
                                            </View>
                                        </View>
                                        <View style={{ flex: 1, width: widthPercentageToDP('90%'), borderBottomColor: '#DBDBDB', borderBottomWidth: 1, marginHorizontal: widthPercentageToDP('1%'), marginTop: widthPercentageToDP('2%'), marginBottom: widthPercentageToDP('4%') }} />
                                        <FlatList
                                            extraData={this.state.data ? this.state.data.sequence_details : null}
                                            data={this.state.data ? this.state.data.sequence_details : null}
                                            renderItem={({ item, index }) => {
                                                count = count + 1;
                                                return (
                                                    <TouchableOpacity
                                                        onPress={() => { this.sequence_number(item) }}
                                                        style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'flex-start', margin: widthPercentageToDP('2%') }}>
                                                        <View style={{
                                                            flexDirection: 'row', width: widthPercentageToDP('44%'), height: widthPercentageToDP('6%'),
                                                            backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',
                                                        }}>
                                                            <Text style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567' }}>{index+1 || '--'}</Text>
                                                        </View>
                                                        <View style={{
                                                            flexDirection: 'row', width: widthPercentageToDP('32.5%'), height: widthPercentageToDP('6%'),
                                                            backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',
                                                        }}>
                                                            <Text style={{ margin: 2, color: '#1D3567', fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center' }}>{item.sequence_number || '--'}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                )
                                            }} />
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
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
                                    <Title style={{ justifyContent: 'flex-end', alignItems: 'center', fontFamily: 'Montserrat-Bold', }} >SKU Level</Title>
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


export default withNavigation(ProductDetails);

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
    }
});