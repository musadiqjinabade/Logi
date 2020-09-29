
import React, { Component } from 'react';
import { Text, View, KeyboardAvoidingView, FlatList, StatusBar, TextInput, StyleSheet, Image, Animated, TouchableOpacity, Alert, AsyncStorage, ToastAndroid, Dimensions, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Button, Container, Right, Title, Toast, Header, CheckBox, Body, ListItem, Left, Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import Modal from 'react-native-modalbox';
import svgImages from '../Images/images';
import APIService from '../component/APIServices';
import Headers from '../component/Headers';
import moment from "moment";
import images from '../Images/images';



class Assignment extends Component {

    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            job_details: '',
            product_details:'',
            progressText: 'Loading...',
            Sequence_details: [],
            expanded:true
        }
    }

    async componentDidMount(){
        this.setState({loading:true})
        var job_id = this.props.navigation.state.params.item.job_id
        var assignment_data = await APIService.execute('GET', APIService.URLBACKEND + 'assignment/viewjobhistory?job_id=' + job_id , null)
        var product_details = assignment_data.data.data.product_details[0];
        var Sequence_details = assignment_data.data.data.job_details;
        var job_details = assignment_data.data.data.job_details[0];
        this.setState({job_details:job_details,product_details:product_details,loading:false, Sequence_details: Sequence_details})
    }

    renderModalContent = () => {
        if (this.state.loading) {
            return (
                <View style={styles.overlay}>
                    <ActivityIndicator color="#1D3567" size="large" />
                    <Text style={{ marginTop: 20, fontSize: 14, fontWeight: 'bold', color: '#1D3567' }}>{this.state.progressText}</Text>
                </View>
            );
        }
        else {
            return null;
        }
    }

    render() {
        const fontSize = 12
        return (
            <Container style={{ flex: 1, backgroundColor: '#F1F3FD' }}>
                <Headers  label={"Job History"} onBack={() => { this.props.navigation.goBack()}}  expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <ScrollView style={{ flex: 1 }}>

                        <View
                            style={{
                                flex: 1,
                                padding: widthPercentageToDP('1%'),
                                // marginLeft: widthPercentageToDP('1%'),
                                marginTop: widthPercentageToDP('1%'),
                                // marginRight: widthPercentageToDP('1%'),
                                // marginBottom: widthPercentageToDP('4%'),
                                // width: widthPercentageToDP('94%'),
                                flexDirection: 'column',
                                elevation: 4, justifyContent: 'space-between', alignItems: 'center',
                            }}>

                            <View
                                style={{
                                    flex: 1, width: widthPercentageToDP('94%'), height: widthPercentageToDP('70%'), shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    marginBottom: widthPercentageToDP('4%'),
                                    paddingTop: widthPercentageToDP('2%'),
                                    paddingBottom: widthPercentageToDP('2%'),
                                    marginHorizontal: widthPercentageToDP('1%'),
                                    shadowRadius: 3,
                                    borderRadius: 5,
                                    flexDirection: 'column',
                                    elevation: 4,
                                    backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start'
                                }} >
                                <Image source={{uri:this.state.product_details?this.state.product_details.product_img:null}} style={{
                                    width: widthPercentageToDP('90%'),
                                    height: widthPercentageToDP('60%'),
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center', resizeMode: 'contain',
                                    // justifyContent: 'flex-start', alignItems: 'flex-start' , 
                                    borderRadius: 5, margin: widthPercentageToDP('2%')
                                }} />
                            </View>


                            <View
                                // onPress={() => this.refs.modal6.open()}
                                // onPress={() => this.modeldata(item)}

                                style={{
                                    flex: 1, width: widthPercentageToDP('94%'), shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    marginBottom: widthPercentageToDP('4%'),
                                    paddingTop: widthPercentageToDP('2%'),
                                    paddingBottom: widthPercentageToDP('2%'),
                                    marginHorizontal: widthPercentageToDP('1%'),
                                    shadowRadius: 3,
                                    borderRadius: 5,
                                    flexDirection: 'row',
                                    elevation: 4,
                                    backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'center'
                                }} >
                                {/* <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}> */}
                                <View style={{ width: widthPercentageToDP('93%'), flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: widthPercentageToDP('2%'), marginLeft: widthPercentageToDP('2%'), marginBottom: widthPercentageToDP('2%') }}>
                                            <Text style={{ fontFamily: 'Montserrat-Bold', color: '#1D3567' }}>Product Details</Text>
                                        </View>
                                        {/* <View style={{justifyContent:'flex-end', alignItems:'flex-end',margin:widthPercentageToDP('2%'), flex:1, flexDirection:'row',padding:widthPercentageToDP('1%'),borderWidth:1}}> */}
                                        <View style={{
                                            flexDirection: 'row', width: widthPercentageToDP('28%'), height: widthPercentageToDP('6%'), shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            shadowColor: '#CECECE',
                                            shadowRadius: 3,
                                            borderRadius: 34,
                                            margin: widthPercentageToDP('2%'),
                                            elevation: 4,
                                            backgroundColor: '#65CA8F', justifyContent: 'center', alignItems: 'center',
                                        }}>
                                            <Text style={{ margin: 2, fontFamily: 'Montserrat-Bold', fontSize: 10, justifyContent: 'center', alignItems: 'center' }}>Job Id:</Text>
                                            <Text style={{ margin: 2, fontFamily: 'Montserrat-Bold', fontSize: 10, justifyContent: 'center', alignItems: 'center' }}>{this.state.job_details?this.state.job_details.job_id : "---"}</Text>
                                        </View>
                                        {/* </View> */}
                                    </View>

                                    <View style={{ flex: 1, width: widthPercentageToDP('90%'), borderBottomColor: '#DBDBDB', borderBottomWidth: 1, marginHorizontal: widthPercentageToDP('1%'), marginTop: widthPercentageToDP('2%'), marginBottom: widthPercentageToDP('4%') }} />

                                    <View style={{ width: widthPercentageToDP('90%'), justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: widthPercentageToDP('2%'), }}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                            <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                        </View>
                                        <View style={{ flex: 1, width: widthPercentageToDP('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: widthPercentageToDP('1%') }}>
                                            <Text style={{ fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'center' }}>Product Name: </Text>
                                            <Text style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'center' }}>{this.state.product_details?this.state.product_details.product_name : "---"}</Text>
                                        </View>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                            <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                        </View>
                                        <View style={{ flex: 1, width: widthPercentageToDP('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: widthPercentageToDP('1%') }}>
                                            <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'center' }}>Product Code: </Text>
                                            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'center' }}>{"AMULP343" || "---"}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: widthPercentageToDP('90%'), justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: widthPercentageToDP('2%') }}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                            <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                        </View>
                                        <View style={{ flex: 1, width: widthPercentageToDP('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: widthPercentageToDP('1%') }}>
                                            <Text style={{ fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'center' }}>Batch No: </Text>
                                            <Text style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'center' }}>{this.state.job_details?this.state.job_details.batch_no : "---" }</Text>
                                        </View>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                            <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                        </View>
                                        <View style={{ flex: 1, width: widthPercentageToDP('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: widthPercentageToDP('1%') }}>
                                            <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'center' }}>Manufacturing Date: </Text>
                                            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'center' }}>{this.state.job_details?moment.unix(this.state.job_details.manu_date).format('DD MMM YYYY') : "---" }</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: widthPercentageToDP('90%'), justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: widthPercentageToDP('2%') }}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                            <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                        </View>
                                        <View style={{ flex: 1, width: widthPercentageToDP('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: widthPercentageToDP('1%') }}>
                                            <Text style={{ fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'center' }}>Expiry Date: </Text>
                                            <Text style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'center' }}>{this.state.job_details?moment.unix(this.state.job_details.exp_date).format('DD MMM YYYY') : "---" }</Text>
                                        </View>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                            <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                        </View>
                                        <View style={{ flex: 1, width: widthPercentageToDP('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: widthPercentageToDP('1%') }}>
                                            <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'center' }}>Target State: </Text>
                                            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'center' }}>{"---"}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: widthPercentageToDP('90%'), justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: widthPercentageToDP('2%') }}>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                            <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                        </View>
                                        <View style={{ flex: 1, width: widthPercentageToDP('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: widthPercentageToDP('1%') }}>
                                            <Text style={{ fontFamily: 'Montserrat-Bold', color: '#1D3567', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'center' }}>Manufacturing Location: </Text>
                                            <Text style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'center' }}>{this.state.job_details?this.state.job_details.manu_location : "---" }</Text>
                                        </View>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                            <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                        </View>
                                        <View style={{ flex: 1, width: widthPercentageToDP('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: widthPercentageToDP('1%') }}>
                                            <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'center' }}>MRP: </Text>
                                            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'center' }}>{this.state.job_details?this.state.job_details.product_mrp : "---"}</Text>
                                        </View>
                                    </View>

                                </View>
                            </View>
                            <View
                                // onPress={() => this.refs.modal6.open()}
                                // onPress={() => this.modeldata(item)}

                                style={{
                                    flex: 1, width: widthPercentageToDP('94%'),shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    marginBottom: widthPercentageToDP('4%'),
                                    paddingTop: widthPercentageToDP('2%'),
                                    paddingBottom: widthPercentageToDP('2%'),
                                    marginHorizontal: widthPercentageToDP('1%'),
                                    shadowRadius: 3,
                                    borderRadius: 5,
                                    flexDirection: 'column',
                                    elevation: 4,
                                    backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start'
                                }} >
                                <View style={{ height: widthPercentageToDP('10%'), marginTop: widthPercentageToDP('2%'), marginLeft: widthPercentageToDP('2%') }}>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', color: '#1D3567' }}>Sequence No.Details({this.state.Sequence_details.length || '0'})</Text>
                                </View>
                                <View style={{ flex: 1, width: widthPercentageToDP('90%'), borderBottomColor: '#DBDBDB', borderBottomWidth: 1, marginHorizontal: widthPercentageToDP('1%'), marginTop: widthPercentageToDP('2%'), marginBottom: widthPercentageToDP('4%') }} />
                                <FlatList
                                data={this.state.Sequence_details}
                                renderItem={({ item }) => (
                                    <View style={{ width: widthPercentageToDP('93%'), flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>

                                        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: widthPercentageToDP('2%'), marginLeft: widthPercentageToDP('4%'), marginBottom: widthPercentageToDP('2%') }}>
                                                <Text style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567' }}>{item.sequence_number || '---'}</Text>
                                            </View>
                                            {/* <View style={{justifyContent:'flex-end', alignItems:'flex-end',margin:widthPercentageToDP('2%'), flex:1, flexDirection:'row',padding:widthPercentageToDP('1%'),borderWidth:1}}> */}
                                            <View style={{
                                                flexDirection: 'row', width: widthPercentageToDP('28%'), height: widthPercentageToDP('6%'), shadowOffset: { width: 0, height: 2 },
                                                shadowOpacity: 0.8,
                                                shadowColor: '#CECECE',
                                                shadowRadius: 3,
                                                borderRadius: 34,
                                                margin: widthPercentageToDP('2%'),
                                                elevation: 4,
                                                backgroundColor: '#65CA8F', justifyContent: 'center', alignItems: 'center',
                                            }}>
                                                <Text style={{ margin: 2, fontFamily: 'Montserrat-Bold', fontSize: 10, justifyContent: 'center', alignItems: 'center',color: '#1D3567' }}>Success</Text>
                                                {/* <Text style={{ margin: 2, fontFamily: 'Montserrat-Bold', fontSize: 10, justifyContent: 'center', alignItems: 'center' }}>{"234" || "---"}</Text> */}
                                            </View>
                                            {/* </View> */}
                                        </View>

                                        <View style={{ flex: 1, width: widthPercentageToDP('90%'), borderBottomColor: '#DBDBDB', borderBottomWidth: 1, marginHorizontal: widthPercentageToDP('1%'), marginTop: widthPercentageToDP('2%'), marginBottom: widthPercentageToDP('4%') }} />

                                    </View>
                                     )}
                                     keyExtractor={item => item.assignment_mapping_id}
                                   /> 
                            </View>



                        </View>

                    </ScrollView>
                </View>
                {this.renderModalContent()}
            </Container>
        )
    }
}


export default withNavigation(Assignment);

var styles = StyleSheet.create({

    linearGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F3FD',
    },
    overlay: {
        height: Platform.OS === "android" ? Dimensions.get("window").height : null,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
    },

});
