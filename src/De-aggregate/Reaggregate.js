import React, { Component } from 'react';
import { Text, View, StatusBar, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import { Container, Button } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import Headers from '../component/Headers';
import color from '../component/color'

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Deaggregate'})],
});
class Reaggregate extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            expanded: true
        }

    }

    componentDidMount() {
        
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
       
    }

    render() {

        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <Headers isHome={true} onBackHome={() => { this.props.navigation.navigate('Dashboard') }} label={'Re-Aggregate Stock'} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <ScrollView>
                    <View style={{ justifyContent: 'center', flex: 1, flexDirection: 'column', padding: wp('2%') }}>
                        <View style={{ marginTop: hp('1%'), height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                            <Text style={styles.productsdisable}>Remove From</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={styles.selectBackgroundStyle}>
                                <TextInput
                                    numberOfLines={1}
                                    underlineColorAndroid='transparent'
                                    style={styles.textInputStyle}
                                    keyboardType='default'></TextInput>
                            </View>
                            <Button style={styles.buttonStyle}>
                                <Text style={styles.header} >Scan</Text>
                            </Button>
                        </View>

                        <View style={{ marginTop: hp('2%'), height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                            <Text style={styles.productsdisable}>Re-aggregate To</Text>
                        </View>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View style={styles.selectBackgroundStyle}>
                                <TextInput
                                    numberOfLines={1}
                                    underlineColorAndroid='transparent'
                                    style={styles.textInputStyle}
                                    keyboardType='default'></TextInput>
                            </View>
                            <Button style={styles.buttonStyle}>
                                <Text style={styles.header} >Scan</Text>
                            </Button>
                        </View>

                    </View>
                </ScrollView>
                <View style={{
                    flex: 1, position: 'absolute',
                    bottom: 0,
                }}>
                    <TouchableOpacity onPress={async () => { this.props.navigation.navigate('ReaggregateItemsScreen') }}>
                        <LinearGradient
                            colors={[color.gradientStartColor, color.gradientEndColor]}
                            start={{ x: 0.0, y: 0.25 }} end={{ x: 1.2, y: 1.0 }}
                            style={[styles.center, {
                                marginTop: hp('1%'),
                                width: wp('100.1%'),
                                height: hp('8%'),
                                borderTopLeftRadius: wp('2.5%'),
                                borderTopRightRadius: wp('2.5%'),
                            }]}>

                            <View style={{ height: hp('8%'), justifyContent: 'center', alignSelf: 'center' }}>
                                <Text style={styles.buttonStart}>Continue</Text>
                            </View>

                        </LinearGradient>
                    </TouchableOpacity>

                </View>
            </View>

        )

    }
}

export default withNavigation(Reaggregate);

var styles = StyleSheet.create({
    textInputStyle: {
        width: wp('92%'),
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: wp('2%'),
        color: '#000000'
    },
    header: {
        fontSize: wp('3%'),
        flex: 1,
        color: '#ffffff',
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
    },
    buttonStyle: {
        marginLeft: wp('2%'),
        width: wp('30%'),
        height: wp('11%'),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowColor: '#CECECE',
        shadowRadius: 3,
        elevation: 4,
        backgroundColor: color.gradientEndColor,
        flexDirection: 'row',
        borderRadius: 5, justifyContent: 'center', alignItems: 'center', marginBottom: wp('5%'),
    },
    productsdisable: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    selectBackgroundStyle: {
        width: wp('64%'),
        height: wp('11%'),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowColor: '#CECECE',
        shadowRadius: 3,
        elevation: 4,
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        borderRadius: 5, justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: wp('5%'),
    },
    buttonStart: {
        fontSize: hp('2.5%'),
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
});