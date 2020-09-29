import React, { Component } from 'react';
import { Text, View, FlatList, StatusBar, StyleSheet, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Button, Container, Right, Title, Header, Body, Left } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import moment from 'moment';
import Headers from '../component/Headers';

class SKUlevelRawMaterial extends Component {
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

        this.props.navigation.addListener('didFocus', (item) => {
            this.setState({ data: this.props.navigation.state.params.item })
        });
    }

    scanhistory() {
        this.setState({ scanhistory: false }, async () => {
            this.setState({ History: this.state.data.data.data.activity_history })
        })
    }

    gettagdwown() {
        this.setState({ tagsvg: !this.state.tagsvg })
    }

    render() {
        if (this.state.data) {
            return (
                <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                    <Headers isHome={true} onBackHome={() => { this.props.navigation.navigate('Dashboard') }} label={'Scan & Check'} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                    <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                    <View style={styles.linearGradient}>
                        <View style={{ flexDirection: 'row', backgroundColor: '#F1F3FD', justifyContent: 'space-between', alignItems: 'center', margin: widthPercentageToDP('2%') }}>
                            <TouchableOpacity
                                onPress={() => this.setState({ scanhistory: true })}
                                style={{ flex: 1, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowColor: '#CECECE', shadowRadius: 3, borderRadius: 5, padding: widthPercentageToDP('4%'), marginLeft: widthPercentageToDP('1%'), marginTop: widthPercentageToDP('4%'), marginRight: widthPercentageToDP('1%'), marginBottom: widthPercentageToDP('4%'), flexDirection: 'column', elevation: 4, backgroundColor: this.state.scanhistory ? '#65CA8F' : '#FFFFFF', justifyContent: 'center', alignItems: 'center', height: widthPercentageToDP('15%') }}>
                                <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'Montserrat-Bold', color: '#1D3567' }}>Raw Material Details</Text>
                                {/* <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'Montserrat-Regular', fontSize: 9, color: '#1D3567' }}>Seq No: PP123445456</Text> */}
                            </TouchableOpacity>
                            {/* <SvgUri width="20" height="13" fill="#000000" svgXmlData={svgImages.right_arrow} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', margin: widthPercentageToDP('2%') }} /> */}
                            <TouchableOpacity onPress={() => this.scanhistory()} style={{ flex: 1, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowColor: '#CECECE', shadowRadius: 3, borderRadius: 5, padding: widthPercentageToDP('4%'), marginLeft: widthPercentageToDP('1%'), marginTop: widthPercentageToDP('4%'), marginRight: widthPercentageToDP('1%'), marginBottom: widthPercentageToDP('4%'), flexDirection: 'column', elevation: 4, backgroundColor: this.state.scanhistory ? '#FFFFFF' : '#65CA8F', justifyContent: 'center', alignItems: 'center', height: widthPercentageToDP('15%') }}>
                                <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'Montserrat-Bold', color: '#1D3567' }}>Scan History</Text>
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
                                    {this.state.data.data.data.raw_material_name ?
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Text style={{ width: widthPercentageToDP('55%'), fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: widthPercentageToDP('4%') }}>Raw Material Name</Text>
                                        <Text style={{ textAlign: 'right', width: widthPercentageToDP('35%'), fontFamily: 'Montserrat-Regular', color: '#1D3567', fontSize: widthPercentageToDP('4%') }}>{this.state.data.data.data.raw_material_name ? this.state.data.data.data.raw_material_name : '-'}</Text>
                                    </View>: null}
                                    {this.state.data.data.data.raw_material_uid ?
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Text style={{ width: widthPercentageToDP('55%'), fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: widthPercentageToDP('4%') }}>RM UID</Text>
                                        <Text style={{ textAlign: 'right', width: widthPercentageToDP('35%'), fontFamily: 'Montserrat-Regular', color: '#1D3567', fontSize: widthPercentageToDP('4%') }}>{this.state.data.data.data.raw_material_uid ? this.state.data.data.data.raw_material_uid : '-'}</Text>
                                    </View>:null}
                                    {this.state.data.data.data.vendor_name ?
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Text style={{ width: widthPercentageToDP('55%'), fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: widthPercentageToDP('4%') }}>Vendor Name</Text>
                                        <Text style={{ textAlign: 'right', width: widthPercentageToDP('35%'), fontFamily: 'Montserrat-Regular', color: '#1D3567', fontSize: widthPercentageToDP('4%') }}>{this.state.data.data.data.vendor_name ? this.state.data.data.data.vendor_name : '-'}</Text>
                                    </View>:null}
                                    {this.state.data.data.data.invoice_no != "null" ?
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Text style={{ width: widthPercentageToDP('55%'), fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: widthPercentageToDP('4%') }}>Invoice Number</Text>
                                        <Text style={{ textAlign: 'right', width: widthPercentageToDP('35%'), fontFamily: 'Montserrat-Regular', color: '#1D3567', fontSize: widthPercentageToDP('4%') }}>{this.state.data.data.data.invoice_no != "null" ? this.state.data.data.data.invoice_no : '-'}</Text>
                                    </View> :null}
                                    {this.state.data.data.data.rm_batch_no != "null" ?
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Text style={{ width: widthPercentageToDP('55%'), fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: widthPercentageToDP('4%') }}>RM Batch Number</Text>
                                        <Text style={{ textAlign: 'right', width: widthPercentageToDP('35%'), fontFamily: 'Montserrat-Regular', color: '#1D3567', fontSize: widthPercentageToDP('4%') }}>{this.state.data.data.data.rm_batch_no != "null" ? this.state.data.data.data.rm_batch_no : '-'}</Text>
                                    </View> : null}
                                    {this.state.data.data.data.exp_date ?
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Text style={{ width: widthPercentageToDP('55%'), fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: widthPercentageToDP('4%') }}>Expiry Date</Text>
                                        <Text style={{ textAlign: 'right', width: widthPercentageToDP('35%'), fontFamily: 'Montserrat-Regular', color: '#1D3567', fontSize: widthPercentageToDP('4%') }}>{this.state.data.data.data.exp_date ? this.state.data.data.data.exp_date : '-'}</Text>
                                    </View> : null}
                                    {this.state.data.data.data.receipt_date ? 
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Text style={{ width: widthPercentageToDP('55%'), fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: widthPercentageToDP('4%') }}>Date Of Receipt</Text>
                                        <Text style={{ textAlign: 'right', width: widthPercentageToDP('35%'), fontFamily: 'Montserrat-Regular', color: '#1D3567', fontSize: widthPercentageToDP('4%') }}>{this.state.data.data.data.receipt_date ? this.state.data.data.data.receipt_date : '-'}</Text>
                                    </View>: null}

                                    <View style={{ marginTop: heightPercentageToDP('5%'), width: widthPercentageToDP('90%'), borderColor: '#1D3567', borderWidth: widthPercentageToDP('0.07') }} />
                                    <View style={{ marginTop: heightPercentageToDP('1%'), flex: 1, flexDirection: 'row' }}>
                                        <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: widthPercentageToDP('4%'), textAlign: 'center' }}>Word Order</Text>
                                        <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: widthPercentageToDP('4%'), textAlign: 'center' }}>Product</Text>
                                        <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: widthPercentageToDP('4%'), textAlign: 'center' }}>Date</Text>
                                    </View>
                                    <View style={{ marginTop: heightPercentageToDP('1%'), width: widthPercentageToDP('90%'), borderColor: 'black', borderWidth: widthPercentageToDP('0.07') }} />

                                    <FlatList
                                        extraData={this.state.data.data.data.otherDetails}
                                        data={this.state.data.data.data.otherDetails}
                                        renderItem={({ item }) => {
                                            console.log("item", item)
                                            return (
                                                <View style={{ backgroundColor: '#CECECE', flex: 1, marginTop: heightPercentageToDP('1%'), flexDirection: 'row' }}>
                                                    <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Regular', color: '#1D3567', fontSize: widthPercentageToDP('4%'), textAlign: 'center', textAlignVertical: 'center' }}>{item.workorder_no ? item.workorder_no : '-'}</Text>
                                                    <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Regular', color: '#1D3567', fontSize: widthPercentageToDP('4%'), textAlign: 'center', textAlignVertical: 'center' }}>{item.product_name ? item.product_name : '-'}</Text>
                                                    <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-', color: '#1D3567', fontSize: widthPercentageToDP('4%'), textAlign: 'center', textAlignVertical: 'center' }}>{moment(item.Date).format('DD-MMM-YYYY')}</Text>
                                                </View>
                                            )
                                        }}
                                    />
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

                                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
                                                        <View style={{
                                                            flex: 1,
                                                            backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start', paddingTop:heightPercentageToDP('2%')
                                                        }}>
                                                            <Text style={{ margin: 2, color: '#1D3567', fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center', fontSize: 14, fontWeight: 'bold' }}>{item.activity}</Text>
                                                        </View>
                                                        <View style={{
                                                            flex: 1,
                                                            flexDirection: 'row',
                                                            backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'center'
                                                        }}>
                                                            <SvgUri width="22" height="12" svgXmlData={svgImages.calendar} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', marginTop: 5, }} />
                                                            <Text style={{ marginRight: widthPercentageToDP('3%'), fontSize: 12, color: '#1D3567', fontFamily: 'Montserrat-Regular', justifyContent: 'flex-start', alignItems: 'flex-start' }}>{item.time != 'null' || item.time ? moment.unix(item.time).format('DD MMM YYYY') + ' at ' + moment.unix(item.time).format('HH:mm') : '---'}</Text>
                                                        </View>
                                                    </View>
                                                    <View style={{ flex: 1, width: widthPercentageToDP('80%'), borderBottomColor: '#DBDBDB', borderBottomWidth: 1, marginHorizontal: widthPercentageToDP('1%'), marginTop: -20 }} />
                                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', paddingBottom: -10 }}>
                                                        <View style={{
                                                            width: widthPercentageToDP('42%'), flexDirection: 'row', marginTop: 10,
                                                            backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start', paddingRight: widthPercentageToDP('3%')
                                                        }}>
                                                            <SvgUri width="12" height="12" svgXmlData={svgImages.profile} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: 5 }} />
                                                            <Text style={{ fontSize: 11, color: '#1D3567', fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center', marginLeft: 3, marginTop: 4, }}>{item.user}</Text>
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
                                            </View>
                                        )} />
                                </View>
                            }
                        </ScrollView>
                    </View>
                </Container>
            )
        }
        else {
            return (
                <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#1D3567', '#1C6DAE']} >
                        <Headers isHome={true} onBackHome={() => { this.props.navigation.navigate('Dashboard') }} label={'Scan & Check'} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                    </LinearGradient>
                </Container>
            )
        }
    }
}


export default withNavigation(SKUlevelRawMaterial);

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
