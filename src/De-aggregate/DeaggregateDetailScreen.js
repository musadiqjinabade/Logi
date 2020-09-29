import React, { Component } from 'react';
import { Text, View, KeyboardAvoidingView, StatusBar, TextInput, StyleSheet, TouchableOpacity, BackHandler, Dimensions } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import { Container, Button } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import Headers from '../component/Headers';
import color from '../component/color';
import Modal from 'react-native-modalbox';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'DeaggregateItemsScreen' })],
});
class DeaggregateDetailScreen extends Component {
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
                <Headers isHome={true} label={'De-aggregate - 12345'} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <ScrollView style={{marginBottom: hp('8%')}}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        
                        <View style={{ marginLeft: wp('2%'), marginRight: wp('2%'), }}>
                            <View style={{ marginTop: hp('2%'), height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                <Text style={styles.header}>Attributes</Text>
                            </View>
                            <TouchableOpacity style={styles.selectBackgroundStyle} onPress={() => { }}>
                                <Text style={styles.selectValues}>{"Select attributes"}</Text>
                                <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />

                            </TouchableOpacity>
                        </View>
                       
                        <View style={{ marginLeft: wp('2%'), marginRight: wp('2%'), }}>
                            <View style={{ marginTop: hp('2%'), height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                <Text style={styles.header}>Tags</Text>
                            </View>
                            <TouchableOpacity style={styles.selectBackgroundStyle} onPress={() => { }}>
                                <Text style={styles.selectValues}>{"Select tags"}</Text>
                                <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />

                            </TouchableOpacity>
                        </View>
                        

                    </View>
                </ScrollView>
                <View style={{ flex: 1 }}>
                    <View style={{
                        flex: 1, position: 'absolute',
                        bottom: 0, flexDirection: 'row'
                    }}>
                        <TouchableOpacity onPress={async () => { this.props.navigation.goBack() }}>
                            <View
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

                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={async () => { }}>
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

            </View >

        )

    }
}

export default withNavigation(DeaggregateDetailScreen);

var styles = StyleSheet.create({
    batchstyle: {
        textAlignVertical: 'top',
        marginTop: hp('1%'),
        height: hp('15%'),
        fontFamily: 'Montserrat-Regular',
        color: '#000000',
        fontSize: 14,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowColor: '#CECECE',
        shadowRadius: 3,
        elevation: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 5, alignItems: 'flex-start',
    },
    line: {
        marginTop: hp('1%'),
        marginBottom: hp('1%'),
        borderBottomColor: '#828EA5',
        borderBottomWidth: 0.7,
    },
    selectValues: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: wp('2%'),
        color: '#636363'
    },
    selectBackgroundStyle: {
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
    header: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
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
});