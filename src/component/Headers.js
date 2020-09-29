import React from "react";
import { ImageBackground, View, Image, SafeAreaView, TouchableOpacity, StatusBar, Platform,ActivityIndicator, Text } from 'react-native';
// import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
// import styles from '../../styles/Common';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import OfflineNotice from './OfflineNotice'
import svgImages from '../Images/images';
import SvgUri from 'react-native-svg-uri';
import { Button, Container, Right, Title, Header, Toast, CheckBox, Body, ListItem, Left, Row, Icon } from 'native-base';
import * as Animatable from 'react-native-animatable';


const Headers = ({
    expanded,
    label,
    onBack,
    profile,
    menubar,
    logout,
    location,
    isHome,
    loader,
    onBackHome
}) => {
    if (expanded) {
        return (
            <SafeAreaView style={{ marginTop: Platform.OS === 'android' ? null : hp('-5%') }} >
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={{ width: "100%" }}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#1D3567', '#1C6DAE']} >
                        <Header transparent>
                            <Left style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row', alignItems: 'center' }} >
                                <Animatable.View
                                    animation="fadeInDownBig"
                                    duration={700}
                                    style={{ backgroundColor: "transparent", flexDirection: 'row' }}>
                                    <TouchableOpacity
                                        style={{ width: wp('12%') }}
                                        onPress={onBack}>
                                        <SvgUri width="20" height="30" fill="#FFFFFF" svgXmlData={svgImages.left_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-start' }} />
                                        {/* <Title style={{ justifyContent: 'flex-start', alignItems: 'center',fontSize:16, fontFamily: 'Montserrat-Bold', marginLeft: widthPercentageToDP('1%') }} >{this.state.model  ? this.state.delete ?"Scan Each to Delete": "Scan Each QR Code" :this.state.delete ?"Scan Each to Delete": "Scan Each "}</Title> */}
                                    </TouchableOpacity>
                                    <Title style={{  justifyContent: 'flex-start', width: wp('73%'), textAlign: 'left', fontSize: wp('5%'), fontFamily: 'Montserrat-Bold'}} >{label}</Title>
                                    {
                                        isHome ?
                                            <TouchableOpacity
                                                style={{ width: wp('10%') }}
                                                onPress={onBackHome}>
                                                <SvgUri width="20" height="30" fill="#FFFFFF" svgXmlData={svgImages.home} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                                {/* <Title style={{ justifyContent: 'flex-start', alignItems: 'center',fontSize:16, fontFamily: 'Montserrat-Bold', marginLeft: widthPercentageToDP('1%') }} >{this.state.model  ? this.state.delete ?"Scan Each to Delete": "Scan Each QR Code" :this.state.delete ?"Scan Each to Delete": "Scan Each "}</Title> */}
                                            </TouchableOpacity> : null
                                    }

                                </Animatable.View>
                            </Left>
                            {/* <Body style={{ flex: 1 }} /> */}
                            {/* <Right style={{ flex: 1, justifyContent: 'flex-end', marginLeft: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <Button onPress={() => this.setState({ model: !this.state.model })} style={{ justifyContent: 'space-between', alignItems: 'center', backgroundColor: "transparent", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0, marginLeft: widthPercentageToDP('-4%') }}>
                                    <SvgUri width="28" height="20" fill="#FFFFFF" svgXmlData={svgImages.list} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%') }} />
                                </Button>
                            </Right> */}
                            {logout ? (

                                <Right style={{ flex: 1 }}>
                                    <Animatable.View
                                        animation="fadeInDownBig"
                                        duration={1000}
                                        style={{ backgroundColor: "transparent" }}>
                                        <Button onPress={logout} style={{ justifyContent: 'space-between', alignItems: 'center', backgroundColor: "transparent", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0,}}>
                                            <SvgUri width="28" height="20" fill="#FFFFFF" svgXmlData={svgImages.logout} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', marginLeft: wp('4%') }} />
                                        </Button>
                                    </Animatable.View>
                                </Right>
                            ) : null}

                        </Header>
                    </LinearGradient>
                </View>
            </SafeAreaView>

        )
    }
    else {
        return (
            <SafeAreaView style={{ marginTop: Platform.OS === 'android' ? null : hp('-5%') }} >
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <Animatable.View style={{ width: "100%" }}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#1D3567', '#1C6DAE']} >
                        <Header transparent>
                            <Left style={{ flex: 1, justifyContent: 'flex-start', marginLeft: 8 }}>
                                <TouchableOpacity
                                    onPress={() => location()} style={{ flexDirection: 'row' }}>
                                    {label == 'Location'?
                                     <View style={{ flexDirection: 'row' }}>
                                        <Title style={{ fontFamily: 'Montserrat-Bold', }}>{label }</Title>
                                        <ActivityIndicator size={'small'} color='#fff' />                                    
                                    </View>
                                    :
                                        <View style={{ flexDirection: 'row' }}>
                                            <Title style={{ fontFamily: 'Montserrat-Bold', }}>{label}</Title>
                                            <SvgUri width="16" height="15" fill={'#fff'} svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: hp('1%'), marginLeft: hp('1%') }} />
                                        </View>}
                                </TouchableOpacity>
                            </Left>
                            {/* <Body style={{ flex: 1 }} /> */}

                            <Right style={{ flex: 1, justifyContent: 'flex-end' }}>
                                <Animatable.View
                                    animation="fadeInDownBig"
                                    duration={1000}
                                // style={{ justifyContent: 'flex-end', alignItems: 'center',borderWidth:1 }}
                                >
                                    {
                                        menubar ? (
                                            <Button transparent onPress={() => {
                                                menubar()
                                            }}>
                                                <SvgUri width="28" height="17" fill={'#ffff'} svgXmlData={svgImages.threedots} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center' }} />
                                            </Button>
                                        ) : null
                                    }
                                </Animatable.View>

                            </Right>

                        </Header>
                    </LinearGradient>
                </Animatable.View >
            </SafeAreaView>
        )
    }
}
export default withNavigation(Headers);