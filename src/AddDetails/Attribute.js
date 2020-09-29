import React, { Component } from 'react';
import { Text, View, StatusBar, StyleSheet, Image,TouchableOpacity, ActivityIndicator, BackHandler } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import { Container,  } from 'native-base';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import Headers from '../component/Headers';




const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
});

class Attribute extends Component {
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
            <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                <Headers label={'Attribute and Tags'} onBack={() => {this.props.navigation.goBack() ||  this.props.navigation.dispatch(resetAction) }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={styles.cardRow}>
                            <View style={styles.cardRow}>
                                <TouchableOpacity style={styles.cardStyle}
                                    onPress={() => this.props.navigation.navigate('ScanAttribute')}
                                >
                                    <View style={styles.cardtext}>
                                        <SvgUri width="80" height="50" svgXmlData={svgImages.All} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%'), marginLeft: widthPercentageToDP('3%') }} />
                                        <SvgUri width="20" height="20" fill="#545A5F" svgXmlData={svgImages.right_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', paddingTop: widthPercentageToDP('3%'), paddingRight: widthPercentageToDP('4%') }} />
                                    </View>

                                    <Text style={styles.textStyle}>{"Scan Each QR Code"}</Text>
                                    {/* <Text style={styles.fulltextStyle}>{"Assign digital IDs to products by scanning one ID after another"}</Text> */}

                                </TouchableOpacity>
                            </View>  
                        </View>
                        <View style={styles.cardRow}>
                                <TouchableOpacity style={styles.cardStyle} onPress={() => this.props.navigation.navigate('FirstLastAttribute')}>
                                    <View style={styles.cardtext}>
                                        {/* <SvgUri width="60" height="38" svgXmlData={svgImages.FirstandLast} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%'), marginLeft: widthPercentageToDP('8%') }} /> */}
                                        <Image source={require('../Images/firstlast.png')} style={{ height: 100, width: 70, resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%'), marginLeft: widthPercentageToDP('8%') }} />
                                        <SvgUri width="20" height="20" fill="#545A5F" svgXmlData={svgImages.right_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', paddingTop: widthPercentageToDP('3%'), paddingRight: widthPercentageToDP('4%') }} />
                                    </View>
                                    <Text style={styles.textStyle}>{"Scan First and Last Item"}</Text>
                                    {/* <Text style={styles.fulltextStyle}>{"Assign digital IDs to products by scanning one ID after another"}</Text> */}
                                </TouchableOpacity>                            
                        </View>
                    </ScrollView>
                    <View style={{ justifyContent: 'flex-end', alignSelf: 'center', flexDirection: 'row', marginTop: widthPercentageToDP('5%') }}>
                        <TouchableOpacity
                            // onPress={() => this.startpairjob()}
                            style={{
                                width: widthPercentageToDP('100%'), height: widthPercentageToDP('14%'), shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                // margin: widthPercentageToDP('2%'),
                                shadowRadius: 3, justifyContent: 'center', alignSelf: 'center',
                                borderTopLeftRadius: 10,
                                borderTopRightRadius: 10,
                                flexDirection: 'column',
                                elevation: 4,
                                backgroundColor: '#65CA8F',
                            }}>
                            {
                                this.state.loading === true ? (
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ paddingRight: 10 }}>
                                            <ActivityIndicator size={'small'} color='#FFFFFF' />
                                        </View>
                                        <View>
                                            <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#FFFFFF' }}>Please Wait...</Text>
                                        </View>
                                    </View>
                                ) : (
                                        <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#FFFFFF' }}>{'Start'}</Text>
                                    )
                            }
                            {/* <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#FFFFFF' }}>Start stock receive job</Text> */}
                        </TouchableOpacity>
                    </View>
                </View>
            </Container>

        )

    }
}



export default withNavigation(Attribute);

var styles = StyleSheet.create({

    linearGradient: {
        flex: 1,
        justifyContent: 'center',
        resizeMode: 'contain',
        alignItems: 'center',
        backgroundColor: '#F1F3FD',
        paddingTop: widthPercentageToDP('20%')
    },
    cardRow: {
        flex: 1,
        height: widthPercentageToDP('48%'),
        // marginBottom: widthPercentageToDP('4%'),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    cardStyle: {
        flexDirection: 'column',
        width: widthPercentageToDP('94%'),
        height: widthPercentageToDP('37%'),
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
        // paddingTop: 10,
        // marginBottom: widthPercentageToDP('5%'),
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
        // flex: 1,
        fontFamily: 'Montserrat-Bold',
        fontSize: 14,
        color: '#141312',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: widthPercentageToDP('2%'),
        // marginRight: widthPercentageToDP('2%'),
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