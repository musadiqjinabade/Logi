import React, { Component } from 'react';
import { Text, View, FlatList, StatusBar, StyleSheet, Image, TouchableOpacity, AsyncStorage, ToastAndroid } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Button, Container, Right, Title, Header, Left, Body } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import APIService from '../component/APIServices';
import Headers from '../component/Headers'

class DispatchCheckValidation extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            data: '',
            scanhistory: true,
            expanded: true,
            job_id: '',
            checkvalidation: ''
        }
    }

    componentDidMount() {
        this.setState({ job_id: this.props.navigation.state.params.data }, () => {
            this.getCheckValidation()
        })
    }

    async getCheckValidation() {
        var responsive = await APIService.execute('GET', APIService.URLBACKEND + APIService.productcheckscreen + 'job_id=' + this.state.job_id, null)
        console.log('productreturn/checkscreen:', responsive)
        if (responsive.data.status_code == 200) {
            this.setState({ checkvalidation: responsive.data.data })
        }
        else if (responsive.data.status_code == 400) {
            ToastAndroid.show(responsive.data.data.message, ToastAndroid.LONG, 25, 50);
            this.props.navigation.goBack()
        }
    }

    render() {
        if (this.state.checkvalidation) {
            return (
                <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                    <Headers label={"Dispatch Stock"} onBack={() => this.props.navigation.goBack()} expanded={this.state.expanded} />
                    <View style={styles.linearGradient}>
                        <ScrollView>
                            <View style={{ flex: 1, marginTop: widthPercentageToDP('4%') }}>
                                {/* <Text style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', fontFamily: 'Montserrat-Bold', color: '#1D3567' }}>Work Order - {this.state.data.data.data.workorder_no || '-'}</Text> */}
                                <View style={{ marginTop: heightPercentageToDP('5%'), width: widthPercentageToDP('90%'), borderColor: '#1D3567', borderWidth: widthPercentageToDP('0.07') }} />
                                <View style={{ marginTop: heightPercentageToDP('1%'), flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: widthPercentageToDP('4%'), justifyContent: 'flex-start', alignSelf: 'flex-start' }}>Document Type</Text>
                                    <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Regular', color: '#1D3567', justifyContent: 'flex-end', alignSelf: 'center' }}>{this.state.checkvalidation ? this.state.checkvalidation.document_no : '-'}</Text>
                                </View>
                                <View style={{ marginTop: heightPercentageToDP('1%'), flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: widthPercentageToDP('4%'), justifyContent: 'flex-start', alignSelf: 'flex-start' }}>Document Number</Text>
                                    <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Regular', color: '#1D3567', justifyContent: 'flex-end', alignSelf: 'center' }}>{this.state.checkvalidation ? this.state.checkvalidation.document_no : '-'}</Text>
                                </View>
                                <View style={{ marginTop: heightPercentageToDP('1%'), width: widthPercentageToDP('90%'), borderColor: 'black', borderWidth: widthPercentageToDP('0.07') }} />
                                <View style={{ marginTop: heightPercentageToDP('1%'), flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignSelf: 'flex-start' }}>
                                    <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: widthPercentageToDP('4%'), justifyContent: 'flex-start', alignSelf: 'flex-start' }}>Products</Text>
                                </View>
                                <FlatList
                                    extraData={this.state.checkvalidation ? this.state.checkvalidation.product_details : null}
                                    data={this.state.checkvalidation ? this.state.checkvalidation.product_details : null}
                                    renderItem={({ item }) => {
                                        console.log("item", item)
                                        return (
                                            <View style={{ backgroundColor: '#CECECE', flex: 1, marginTop: heightPercentageToDP('1%'), flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View
                                                    style={{
                                                        flexDirection: 'row', width: widthPercentageToDP('20%'), height: heightPercentageToDP('4%'), justifyContent: 'flex-start', alignItems: 'center',
                                                    }}>
                                                    <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Regular', color: '#1D3567', fontSize: widthPercentageToDP('4%'), }}>{item.product_name ? item.product_name : '-'}</Text>
                                                </View>
                                                <View
                                                    style={{
                                                        flexDirection: 'row', width: widthPercentageToDP('5%'), height: heightPercentageToDP('4%'), justifyContent: 'flex-start', alignItems: 'center',
                                                    }}>
                                                    <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Regular', color: '#1D3567', fontSize: widthPercentageToDP('4%'), }}>{item.current_qty ? item.current_qty + '/' + item.product_qty_doc : '-'}</Text>
                                                </View>
                                                <View
                                                    style={{
                                                        flexDirection: 'row', width: widthPercentageToDP('15%'), height: heightPercentageToDP('4%'), justifyContent: 'flex-start', alignItems: 'center',
                                                    }}>
                                                    <SvgUri width="28" height="18"
                                                        fill={item.flag ? "#6AC259" : '#FF4500'}
                                                        svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', marginLeft: widthPercentageToDP('7%') }} />
                                                </View>
                                            </View>
                                        )
                                    }}
                                />
                            </View>
                        </ScrollView>
                    </View>
                </Container>
            )
        }
        else {
            return (
                <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                    <Headers label={"Dispatch Stock"} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                </Container>
            )

        }
    }
}


export default withNavigation(DispatchCheckValidation);

var styles = StyleSheet.create({

    linearGradient: {
        flex: 1,
        justifyContent: 'center',
        resizeMode: 'contain',
        alignItems: 'center',
        backgroundColor: '#F1F3FD',
        paddingTop: widthPercentageToDP('1%')
    }
});