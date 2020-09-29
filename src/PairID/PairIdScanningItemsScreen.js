import React, { Component } from 'react';
import { Text, View,StatusBar, TextInput, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ScrollView } from 'react-native-gesture-handler';
import Headers from '../component/Headers';
import color from '../component/color';
import Modal from 'react-native-modalbox';
import { Button } from 'native-base';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'PairIdScanningScreen' })],
});
class PairIdScanningItemsScreen extends Component {
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
        this.props.navigation.dispatch(resetAction)
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <Headers isHome={true} onBackHome={() => { this.props.navigation.navigate('Dashboard') }} label={'Pair IDs - 129'} onBack={() => { this.props.navigation.dispatch(resetAction) }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <ScrollView>
                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <View style={{ paddingLeft: wp('2%'), paddingRight: wp('2%'), justifyContent: 'space-between', flexDirection: 'row', marginTop: hp('1%') }}>
                            <Button onPress={() => { this.refs.modalComment.open() }} style={styles.buttonStyle}>
                                <Text style={styles.header} >Comment</Text>
                            </Button>
                            <Button style={styles.buttonStyle}>
                                <Text style={styles.header} >+ Add</Text>
                            </Button>
                            <Button style={styles.buttonStyle}>
                                <Text style={styles.header} >- Remove</Text>
                            </Button>
                           
                        </View>
                        <View style={styles.line} />

                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.scanheader}>TruSale</Text>
                                <Text style={styles.scanItems}>2020202020 </Text>
                                <Text style={styles.scanItems}>2020202021</Text>
                                <Text style={styles.scanItems}>2020202022</Text>
                                <Text style={styles.scanItems}>2020202023</Text>
                                <Text style={styles.scanItems}>2020202024</Text>
                                <Text style={styles.scanItems}>2020202025</Text>
                                <Text style={styles.scanItems}>2020202026</Text>
                                <Text style={styles.scanItems}>2020202027</Text>
                                <Text style={styles.scanItems}>2020202023</Text>
                                <Text style={styles.scanItems}>2020202024</Text>
                                <Text style={styles.scanItems}>2020202025</Text>
                                <Text style={styles.scanItems}>2020202026</Text>
                                <Text style={styles.scanItems}>2020202027</Text>
                            </View>
                            <View style={{marginTop: hp('2%')}}/>
                            <View style={{ flexDirection: 'column' }}>
                                <Text style={styles.scanheader}>LogiTrak</Text>
                                <Text style={styles.scanItems}>2020202020</Text>
                                <Text style={styles.scanItems}>2020202021</Text>
                                <Text style={styles.scanItems}>2020202022</Text>
                                <Text style={styles.scanItems}>2020202023</Text>
                                <Text style={styles.scanItems}>2020202024</Text>
                                <Text style={styles.scanItems}>2020202025</Text>
                                <Text style={styles.scanItems}>2020202026</Text>
                                <Text style={styles.scanItems}>2020202027</Text>
                                <Text style={styles.scanItems}>2020202023</Text>
                                <Text style={styles.scanItems}>2020202024</Text>
                                <Text style={styles.scanItems}>2020202025</Text>
                                <Text style={styles.scanItems}>2020202026</Text>
                                <Text style={styles.scanItems}>2020202027</Text>
                            </View>

                        </View>
                    </View>
                </ScrollView>
                <View style={{ flex: 1 }}>
                    <View style={{
                        flex: 1, position: 'absolute',
                        bottom: 0, flexDirection: 'row'
                    }}>
                        <TouchableOpacity onPress={async () => { this.props.navigation.dispatch(resetAction) }}>
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
                        <TouchableOpacity onPress={async () => {  }}>
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
                                    <Text style={styles.buttonStart}>Finish</Text>
                                </View>

                            </LinearGradient>
                        </TouchableOpacity>

                    </View>

                </View>
                <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"modalComment"} swipeArea={20}
                    backdropPressToClose={true}  >
                    <ScrollView>
                        <View style={{ height: hp('35%'), width: wp('90%'), backgroundColor: '#fff', borderRadius: 5 }} >
                            <View style={{ flex: 1, flexDirection: 'column', margin: wp('5%') }}>

                                <Text style={[styles.headerBold]}>Comment</Text>

                                <TextInput
                                    multiline={true}
                                    underlineColorAndroid='transparent'
                                    style={styles.batchstyle}
                                    keyboardType='default'
                                    placeholder={'Enter comment'}></TextInput>

                                <View style={{ flex: 1 }}>
                                    <View style={{
                                        flex: 1, position: 'absolute',
                                        bottom: 0, flexDirection: 'row'
                                    }}>
                                        <TouchableOpacity onPress={async () => { this.refs.modalComment.close() }}>
                                            <View
                                                style={[styles.center, {
                                                    marginTop: hp('1%'),
                                                    width: wp('40%'),
                                                    height: hp('6%'),
                                                   
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.8,
                                                    shadowColor: '#CECECE',
                                                    shadowRadius: 3,
                                                    elevation: 4,
                                                    backgroundColor: '#FFFFFF',
                                                    borderWidth: 0.2
                                                }]}>

                                                <View style={{ height: hp('6%'), justifyContent: 'center', alignSelf: 'center' }}>
                                                    <Text style={styles.buttonCancel}>Cancel</Text>
                                                </View>

                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={async () => { this.props.navigation.navigate('ProductReturnScanningDetailScreen') }}>
                                            <LinearGradient
                                                colors={[color.gradientStartColor, color.gradientEndColor]}
                                                start={{ x: 0.0, y: 0.25 }} end={{ x: 1.2, y: 1.0 }}
                                                style={[styles.center, {
                                                    marginTop: hp('1%'),
                                                    width: wp('40%'),
                                                    height: hp('6%'),
                                                    borderWidth: 0.2,
                                                }]}>

                                                <View style={{ height: hp('6%'), justifyContent: 'center', alignSelf: 'center' }}>
                                                    <Text style={styles.buttonStart}>Add Comment</Text>
                                                </View>

                                            </LinearGradient>
                                        </TouchableOpacity>

                                    </View>

                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
            </View >

        )

    }
}

export default withNavigation(PairIdScanningItemsScreen);

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
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    modal1: {
        maxHeight: hp('40%'),
        minHeight: hp('40%')
    },
    buttonStyle: {
        borderRadius: 5,
        width: wp("22%"),
        height: hp('6%'),
        backgroundColor: color.gradientEndColor
    },
    headerBold: {
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        color: '#000000'
    },
    line: {
        marginTop: hp('1%'),
        marginBottom: hp('1%'),
        borderBottomColor: '#828EA5',
        borderBottomWidth: 0.7,
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
    header: {
        fontSize: wp('3%'),
        flex: 1,
        color: '#ffffff',
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
    },
    selectSubLocation: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: wp('2%'),
        color: '#636363'
    },
    // scanItems: {
    //     fontFamily: 'Montserrat-Regular',
    //     justifyContent: 'flex-start',
    //     marginLeft: wp('2%'),
    //     color: '#636363'
    // },
    packagingItems: {
        flex: 1, justifyContent: 'center', alignItems: 'flex-start',
        color: '#000000',
        fontFamily: 'Montserrat-Regular',
    },
    packagingValue: {
        alignItems: 'flex-end',
        color: '#000000',
        fontFamily: 'Montserrat-Regular',
    },
    items: {
        marginTop: hp('0.5%'),
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        marginLeft: wp('2%'),
        color: '#636363'
    },
    scanItems: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        marginHorizontal: wp('4%'),
        color: '#636363'
    },
    scanheader: {
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'center',
        alignSelf:'center',
        fontSize:16,
        marginHorizontal: wp('2%'),
        color: '#636363'
    },
});