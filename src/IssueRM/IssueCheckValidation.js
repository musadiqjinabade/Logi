import React, { Component } from 'react';
import { Text, View, FlatList, StyleSheet, ActivityIndicator, Platform, Dimensions } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container } from 'native-base';
import { widthPercentageToDP, heightPercentageToDP } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import APIService from '../component/APIServices';
import Headers from '../component/Headers'

class IssueCheckValidation extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            data: '',
            scanhistory: true,
            expanded: true,
            job_id: '',
            checkvalidation: '',
            progressText: 'Loading...',
        }
    }

    componentDidMount() {
        this.setState({ job_id: this.props.navigation.state.params.data }, () => {
            this.getCheckValidation()
        })
    }

    async getCheckValidation() {
        var responsive = await APIService.execute('GET', APIService.URLBACKEND + APIService.rawmaterialcheckscreen + 'job_id=' + this.state.job_id, null)
        // var responsive = await APIService.execute('GET', APIService.URLBACKEND+APIService.rawmaterialcheckscreen+'job_id=337', null)
        console.log('productreturn/checkscreen:', responsive)
        if (responsive.data.status == 200) {
            this.setState({ checkvalidation: responsive.data.data })
        }
        else if (responsive.data.status == 400) {
            ToastAndroid.show(responsive.data.data.message, ToastAndroid.LONG, 25, 50);
            this.props.navigation.goBack()
        }
    }

    render() {
        if (this.state.checkvalidation) {
            return (
                <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                    <Headers label={this.state.job_id?"Issue Raw Material - "+ this.state.job_id:"Issue Raw Material"} onBack={() => this.props.navigation.goBack() } expanded={this.state.expanded} />
                    <View style={styles.linearGradient}>
                        <ScrollView>
                            <View style={{ flex: 1, marginTop: widthPercentageToDP('2%') }}>
                                {/* <Text style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', fontFamily: 'Montserrat-Bold', color: '#1D3567' }}>Work Order - {this.state.data.data.data.workorder_no || '-'}</Text> */}
                                <View style={{ marginTop: heightPercentageToDP('1%'), flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: widthPercentageToDP('4%'), justifyContent: 'flex-start', alignSelf: 'flex-start' }}>Work Order Number</Text>
                                    <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Regular', color: '#1D3567', justifyContent: 'flex-end', alignSelf: 'center' }}>{this.state.checkvalidation ? '-' : '-'}</Text>
                                </View>
                                <View style={{ marginTop: heightPercentageToDP('1%'), width: widthPercentageToDP('90%'), borderColor: 'black', borderWidth: widthPercentageToDP('0.07') }} />
                                <View style={{ marginTop: heightPercentageToDP('4%'), flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignSelf: 'flex-start' }}>
                                    <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: widthPercentageToDP('4%'), justifyContent: 'flex-start', alignSelf: 'flex-start' }}>Raw Material</Text>
                                </View>
                                <FlatList
                                    extraData={this.state.checkvalidation}
                                    data={this.state.checkvalidation}
                                    renderItem={({ item }) => {
                                        return (
                                            <View style={{ backgroundColor: '#CECECE', flex: 1, marginTop: heightPercentageToDP('1%'), flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View
                                                    style={{
                                                        flexDirection: 'row', width: widthPercentageToDP('20%'), height: heightPercentageToDP('4%'), justifyContent: 'flex-start', alignItems: 'center',
                                                    }}>
                                                    <Text style={{ width: widthPercentageToDP('30%'), fontFamily: 'Montserrat-Regular', color: '#1D3567', fontSize: widthPercentageToDP('4%'), }}>{item.rm_name ? item.rm_name : '-'}</Text>
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
                    <Headers label={"Issue Raw Material"} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                    <View style={styles.overlay}>
                        <ActivityIndicator color="#1D3567" size="large" />
                        <Text style={{ marginTop: 20, fontSize: 14, fontWeight: 'bold', color: '#1D3567' }}>{this.state.progressText}</Text>
                    </View>
                </Container>
            )

        }
    }
}


export default withNavigation(IssueCheckValidation);

var styles = StyleSheet.create({

    linearGradient: {
        flex: 1,
        justifyContent: 'center',
        resizeMode: 'contain',
        alignItems: 'center',
        backgroundColor: '#F1F3FD',
        paddingTop: widthPercentageToDP('1%')
    },
    overlay: {
        height: Platform.OS === "android" ? Dimensions.get("window").height : null,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
    }
});