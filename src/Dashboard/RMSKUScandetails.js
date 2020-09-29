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
class RMSKUScandetails extends Component {
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
        this.setState({ data: this.props.navigation.state.params.data })
        this.props.navigation.addListener('didFocus', (item) => {
            this.setState({ data: this.props.navigation.state.params.data })
        });
    }

    render() {
        var count = 0;
        if (this.state.data) {
            return (
                <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                    <Headers isHome={true} onBackHome={() => { this.props.navigation.navigate('Dashboard') }} label={"Scan & Check"} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                    <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                    <View style={styles.linearGradient}>
                        <ScrollView>
                            <View style={{ flex: 1, marginTop: widthPercentageToDP('4%') }}>
                                <Text style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', fontFamily: 'Montserrat-Bold', color: '#1D3567' }}>Work Order - {this.state.data.data.data.workorder_no || '-'}</Text>
                                <View style={{ marginTop: heightPercentageToDP('5%'), width: widthPercentageToDP('90%'), borderColor: '#1D3567', borderWidth: widthPercentageToDP('0.07') }} />
                                <View style={{ marginTop: heightPercentageToDP('1%'), flex: 1, flexDirection: 'row' }}>
                                    <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: widthPercentageToDP('4%'), textAlign: 'center' }}>Word Order</Text>
                                    <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: widthPercentageToDP('4%'), textAlign: 'center' }}>Vendor</Text>
                                    <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: widthPercentageToDP('4%'), textAlign: 'center' }}>Invoice Number</Text>
                                </View>
                                <View style={{ marginTop: heightPercentageToDP('1%'), width: widthPercentageToDP('90%'), borderColor: 'black', borderWidth: widthPercentageToDP('0.07') }} />

                                <FlatList
                                    extraData={this.state.data.data.data.rm_detail}
                                    data={this.state.data.data.data.rm_detail}
                                    renderItem={({ item }) => {
                                        console.log("item", item)
                                        return (
                                            <View style={{ backgroundColor: '#CECECE', flex: 1, marginTop: heightPercentageToDP('1%'), flexDirection: 'row' }}>
                                                <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Regular', color: '#1D3567', fontSize: widthPercentageToDP('4%'), textAlign: 'center', textAlignVertical: 'center' }}>{item.rm_name ? item.rm_name : '-'}</Text>
                                                <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Regular', color: '#1D3567', fontSize: widthPercentageToDP('4%'), textAlign: 'center', textAlignVertical: 'center' }}>{item.recipient_name ? item.recipient_name : '-'}</Text>
                                                <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-', color: '#1D3567', fontSize: widthPercentageToDP('4%'), textAlign: 'center', textAlignVertical: 'center' }}>{item.invoice_no ? item.invoice_no : '-'}</Text>
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
                    <Headers isHome={true} onBackHome={() => { this.props.navigation.navigate('Dashboard') }} label={"Scan & Check"} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                </Container>
            )

        }
    }
}


export default withNavigation(RMSKUScandetails);

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