import React, { Component } from 'react';
import { Text, View, KeyboardAvoidingView, StatusBar, TextInput, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import { Container } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import Headers from '../component/Headers';
import color from '../component/color'

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
});
class Deaggregate extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            expanded: true
        }

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    render() {

        return (
            <View style={{ flex: 1, flexDirection: 'column' }}>
                <Headers isHome={false} label={'De-Aggregate Stock'} onBack={() => { this.props.navigation.goBack()  }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <ScrollView>
                    <View style={{ height: hp('80%'), justifyContent: 'center', flex: 1, flexDirection: 'column', padding: wp('2%') }}>
                        <TouchableOpacity onPress={() => { this.props.navigation.navigate('DeaggregateScanningScreen') }} style={styles.cardStyle}>
                            <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', textAlign: 'center', fontSize: hp('2.7%'), color: color.gradientStartColor }}>Remove Individual</Text>
                            <Text style={{ marginTop: hp('1%'), fontFamily: 'Montserrat-Regular', justifyContent: 'center', textAlign: 'center', fontSize: hp('2.3%'), color: '#8A8A8A' }}>Scan each item to remove</Text>
                        </TouchableOpacity>
                        <View style={styles.cardStyle}>
                            <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', textAlign: 'center', fontSize: hp('2.7%'), color: color.gradientStartColor }}>Remove all</Text>
                            <Text style={{ marginTop: hp('1%'), fontFamily: 'Montserrat-Regular', justifyContent: 'center', textAlign: 'center', fontSize: hp('2.3%'), color: '#8A8A8A' }}>Scan parent ID to remove all items</Text>
                        </View>
                        <TouchableOpacity onPress={()=>{this.props.navigation.navigate('Reaggregate')}} style={styles.cardStyle}>
                            <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', textAlign: 'center', fontSize: hp('2.7%'), color: color.gradientStartColor }}>Re-pack</Text>
                            <Text style={{ marginTop: hp('1%'), fontFamily: 'Montserrat-Regular', justifyContent: 'center', textAlign: 'center', fontSize: hp('2.3%'), color: '#8A8A8A' }}>Move from one parent to another</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

            </View>

        )

    }
}

export default withNavigation(Deaggregate);

var styles = StyleSheet.create({
    cardStyle: {
        marginTop: hp('2%'),
        marginBottom: hp('2%'),
        flexDirection: 'column',
        width: wp('94%'),
        height: wp('25%'),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowColor: '#CECECE',
        shadowRadius: 1,
        elevation: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    buttonStart: {
        fontSize: hp('2.5%'),
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
});