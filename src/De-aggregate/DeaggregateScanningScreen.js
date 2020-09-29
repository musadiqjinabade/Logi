import React, { Component } from 'react';
import { Text, View, KeyboardAvoidingView, StatusBar, TextInput, StyleSheet, TouchableOpacity, BackHandler, Dimensions } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import { Container } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import Headers from '../component/Headers';
import color from '../component/color';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Deaggregate' })],
});
class DeaggregateScanningScreen extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            expanded: true
        }

    }

    componentDidMount() {
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
        })
    }

    handleBackPress() {
        this.navigateBack();
        return true;
    }

    async navigateBack() {
        this.props.navigation.goBack()
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    render() {
        const fontSize = 11
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <Headers isHome={true} onBackHome={() => { this.props.navigation.navigate('Dashboard') }} label={'De-Aggregate Stock - 12345'} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <ScrollView style={{ bottom: 0, position: 'absolute', marginBottom: hp('10%'), flex: 1 }}>
                    <View style={{ flexDirection: 'column', paddingLeft: wp('2%'), paddingRight: wp('2%') }}>
                        <View style={{ width: wp('100%'), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center' }}>
                            <View style={{
                                flexDirection: 'row', width: wp('30%'), height: hp('5%'), shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                borderRadius: 34,
                                margin: wp('2%'),
                                elevation: 4,
                                backgroundColor: '#65CA8F', justifyContent: 'center', alignItems: 'center',
                            }}>
                                <Text style={{ margin: 2, color: '#fff', fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'center', alignItems: 'center' }}>Total Scan:</Text>
                                <Text style={{ margin: 2, color: '#fff', fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'center', alignItems: 'center' }}>{this.state.Updatedata ? this.state.Updatedata.length : '0'}</Text>
                            </View>

                            <TouchableOpacity style={{
                                flexDirection: 'row', width: wp('30%'), height: hp('5%'), shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                borderRadius: 34,
                                margin: wp('2%'),
                                elevation: 4,
                                backgroundColor: '#FE3547', justifyContent: 'center', alignItems: 'center',
                            }}
                            // onPress={() => this.props.navigation.navigate('LinkEditProduct')}
                            >
                                <Text style={{ margin: 2, fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'center', alignItems: 'center', color: '#fff' }}>- Remove</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{ marginTop: hp('2%') }} />

                        <View style={{
                            flex: 1,

                            // padding: wp('1%'),
                            flexDirection: 'column',
                            backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start',
                        }}>
                            <View style={{
                                flex: 1, flexDirection: 'row', backgroundColor: color.gradientEndColor,
                                shadowOpacity: 0.8,
                                height: wp('8%'),
                                shadowColor: '#CECECE',
                                shadowRadius: 3, elevation: 5, borderRadius: 5,
                                margin: wp('1%'), marginTop: wp('0.5%'), marginBottom: wp('2%'), justifyContent: 'flex-start', alignItems: 'center'
                            }} >

                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', margin: wp('0.5%'), marginLeft: wp('2%') }}>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#ffffff' }}>Shipper</Text>
                                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', }}>
                                        <SvgUri width="14" height="12" fill="#FFFFFF" svgXmlData={svgImages.minus} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', margin: wp('1%') }} />
                                    </View>
                                </View>

                            </View>

                            <View style={{
                                marginLeft: wp('5%'),
                                flex: 1, flexDirection: 'row', backgroundColor: '#4A90E2',
                                shadowOpacity: 0.8,
                                height: wp('8%'),
                                shadowColor: '#CECECE',
                                shadowRadius: 3, elevation: 5, borderRadius: 5,
                                margin: wp('1%'), marginTop: wp('0.5%'), marginBottom: wp('2%'), justifyContent: 'flex-start', alignItems: 'center'
                            }} >

                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', margin: wp('0.5%'), marginLeft: wp('2%') }}>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#ffffff' }}>SKU 1</Text>

                                </View>

                            </View>
                            <View style={{
                                marginLeft: wp('5%'),
                                flex: 1, flexDirection: 'row', backgroundColor: '#4A90E2',
                                shadowOpacity: 0.8,
                                height: wp('8%'),
                                shadowColor: '#CECECE',
                                shadowRadius: 3, elevation: 5, borderRadius: 5,
                                margin: wp('1%'), marginTop: wp('0.5%'), marginBottom: wp('2%'), justifyContent: 'flex-start', alignItems: 'center'
                            }} >

                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', margin: wp('0.5%'), marginLeft: wp('2%') }}>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#ffffff' }}>SKU 2</Text>

                                </View>

                            </View>

                            <View style={{
                                flex: 1, flexDirection: 'row', backgroundColor: color.gradientEndColor,
                                shadowOpacity: 0.8,
                                height: wp('8%'),
                                shadowColor: '#CECECE',
                                shadowRadius: 3, elevation: 5, borderRadius: 5,
                                margin: wp('1%'), marginTop: wp('0.5%'), marginBottom: wp('2%'), justifyContent: 'flex-start', alignItems: 'center'
                            }} >

                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', margin: wp('0.5%'), marginLeft: wp('2%') }}>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#ffffff' }}>Shipper 2</Text>
                                    <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', }}>
                                        <SvgUri width="14" height="12" fill="#FFFFFF" svgXmlData={svgImages.plus} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', margin: wp('1%') }} />
                                    </View>
                                </View>

                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={{ flex: 1 }}>
                    <View style={{
                        flex: 1, position: 'absolute',
                        bottom: 0, flexDirection: 'row'
                    }}>

                        <TouchableOpacity onPress={async () => { this.props.navigation.goBack() }}
                            style={[styles.center, {
                                marginTop: hp('1%'),
                                width: wp('50.5%'),
                                height: hp('8%'),
                                borderTopLeftRadius: wp('2.5%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: '#FFFFFF',
                                borderWidth: 0.2
                            }]}>

                            <View style={{ height: hp('8%'), justifyContent: 'center', alignSelf: 'center' }}>
                                <Text style={styles.buttonCancel}>Cancel</Text>
                            </View>

                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('DeaggregateItemsScreen') }}>
                            <LinearGradient
                                colors={[color.gradientStartColor, color.gradientEndColor]}
                                start={{ x: 0.0, y: 0.25 }} end={{ x: 1.2, y: 1.0 }}
                                style={[styles.center, {
                                    marginTop: hp('1%'),
                                    width: wp('50.5%'),
                                    height: hp('8%'),
                                    borderWidth: 0.2,
                                    borderTopRightRadius: wp('2.5%'),
                                }]}>

                                <View style={{ height: hp('8%'), justifyContent: 'center', alignSelf: 'center' }}>
                                    <Text style={styles.buttonStart}>Continue</Text>
                                </View>

                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )

    }
}

export default withNavigation(DeaggregateScanningScreen);

var styles = StyleSheet.create({
    buttonStart: {
        fontSize: hp('2.5%'),
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    buttonCancel: {
        fontSize: hp('2.5%'),
        color: '#000000',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    header: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    selectBackgroundStyle: {
        height: wp('10%'),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowColor: '#CECECE',
        shadowRadius: 3,
        elevation: 4,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('5%'),
    },
    selectSubLocation: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: wp('2%'),
        color: '#636363'
    },
    scanItems: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        marginLeft: wp('2%'),
        color: '#636363'
    },
});