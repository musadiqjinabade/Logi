import React, { Component } from 'react';
import { Dimensions, StyleSheet, View, ScrollView, Text, SafeAreaView,TextInput, Image,ToastAndroid, TouchableOpacity, FlatList,AsyncStorage, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { withNavigation,  StackActions, NavigationActions } from 'react-navigation';
import Headers from '../component/Headers';
import Modal from 'react-native-modalbox';
import { CheckBox,Toast } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import color from '../component/color';
import APIService from '../component/APIServices';
const _ = require('lodash');
import svgImages from '../Images/images';
import SvgUri from 'react-native-svg-uri';

const selected_data = {}
class SearchableReturnReasons extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            topbarOption: 0,
            selected: true,
            expanded: true,
            data: '',
            checked: false,
            check_data: {},
            check_id: {},
            headerstate:'',
            pagecount:1
        }
        this.arrayholder = [];

    }

    async componentDidMount() {
        this.setState({ data: this.props.navigation.state.params.item }, () => {
            console.log('chck_iddd:', this.state.data)
            for (var match of this.state.data) {
                let obj = {
                    ...obj, [match]: true
                }
                this.setState({
                    check_id: obj
                }, () => {
                    console.log('check_id data', this.state.check_id)
                })
            }

        this.getData();


        })
        
        
    }

    async getData(){
        var data = await APIService.execute('GET', APIService.URLBACKEND + APIService.getReturnReasons, null)
        if(data.data.status_code==200){
            this.setState({reasons:data.data.data, loading: false, pagecount: this.state.pagecount + 1},()=>{
                console.log("reasons:",this.state.reasons)
                this.arrayholder = data.data.data;

            })
        }
        else{
            ToastAndroid.show('No Data', ToastAndroid.LONG, 25, 50);
        }
    }

    async loadMoreJobs(){
       this.setState({loading: false})
       

    }

    searchText(text) {
        this.setState({ searchtags: text }, () => {
            console.log(text)
            if (text != '') {
                var searchResults = [];
                for (var d of this.arrayholder) {
                    if ( d.itemName.toLowerCase().includes(text.toLowerCase()) ) {
                        searchResults.push(d);
                    }
                }
                this.setState({
                    reasons: searchResults,
                    searchtags: text
                })
            }
            else {
                this.setState({ reasons: this.arrayholder, searchtags: text })
            }
        });
    }

    

    changecheck(item) {
        var i = 0;

        this.setState({
            check_id: { ...this.state.check_id, [item.id]: !this.state.check_id[item.id]  }
        },()=>{
            console.log('check change:',this.state.check_id)
        })
        // this.getData(this.state.data);


    }

    async save(item) {
        console.log('click_box:', item)
        var check_data = [];
        for (let i = 0; i < Object.keys(item).length; i++) {
            if (item[Object.keys(item)[i]] == true) {
                check_data.push(Object.keys(item)[i])
            }
        }
        var reasons_data = [];
        for(let i=0; i<this.state.reasons.length; i++){
            for(let j=0; j<check_data.length; j++){
                if(check_data[j]==this.state.reasons[i].id){
                    //push data
                    reasons_data.push(this.state.reasons[i].itemName)
                }
            }
        }
        await AsyncStorage.removeItem('reasonsdata');
        AsyncStorage.setItem('reasonsdata',JSON.stringify(check_data))
        await AsyncStorage.removeItem('Selectedreasons');
        await AsyncStorage.setItem('Selectedreasons',JSON.stringify(reasons_data))
        var temp = await AsyncStorage.getItem('Selectedreasons')
        console.log("selected reasons : ",JSON.parse(temp) )
        this.props.navigation.goBack()    }


    render() {
        const { navigate } = this.props.navigation;
        var userData = null;
        if (this.state.loading) {
            return (
                <SafeAreaView style={{flex:1}}>
                   <Headers  label={"Select Reasons"} onBack={() => { this.props.navigation.goBack()  }} expanded={this.state.expanded} />
                    <View style={{flex:1, justifyContent:'center',alignSelf:'center'}}>
                        <ActivityIndicator
                            size='large'
                            color={color.gradientStartColor}
                        />
                    </View>
                </SafeAreaView>
            )
        }
        else {
            return (
                <SafeAreaView style={{flex:1}}>
                    <Headers  label={"Select Reasons"} onBack={() => { this.props.navigation.goBack()  }} expanded={this.state.expanded} />
                    <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ flex: 1, width: wp('100%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', paddingHorizontal: 10, marginBottom: 5, marginTop: wp('5%') }}>
                            <View style={{
                                width: wp('94%'),
                                height: wp('10%'),
                                // marginLeft: wp('5%'),
                                // marginRight: wp('10%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                flexDirection: 'row',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: this.state.checked ? "#C0BCBC" : '#FFFFFF',
                                borderRadius: 5, justifyContent: 'flex-start', alignItems: 'flex-start', 
                            }}>
                                <SvgUri width="15" height="15" svgXmlData={svgImages.search} style={{
                                    padding: wp('3%'),
                                    justifyContent: 'flex-start',
                                    alignItems: 'center',
                                }} />
                                <TextInput
                                    style={{height:hp('6%'),width: wp('80%')}}
                                    value={(this.state.searchtags || '')}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType='default'
                                    returnKeyType="next"
                                    placeholder={'Search reasons'}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                    placeholderTextColor="gray"
                                    placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Bold', fontSize: 20 }}
                                    onChangeText={(text) => this.searchText(text)}></TextInput>
                            </View>
                        </View>
                        <View style={{flex:1}}>
                                <FlatList
                                // extraData={this.state.Tags}
                                    data={this.state.reasons}
                                    onEndReached={({ distanceFromEnd }) => {
                                        this.loadMoreJobs();
                                    }}
                                    // onEndThreshold={20}
                                    renderItem={({ item }) => {
                                        var checkedItem = _.find(this.state.check_id, function (o) {
                                            if (o.id == item.id) {
                                                return true
                                            } else {
                                                return false

                                            };
                                        });
                                        // console.log("this.state.check_id[item.tag_id]:",item)
                                        return (
                                            <TouchableOpacity style={{ flexDirection: 'row', margin: wp('2%') }}
                                                onPress={() => this.changecheck(item)}
                                                >
                                                <CheckBox checked={this.state.check_id[item.id]} style={{ borderRadius: 5, marginRight: 5, backgroundColor: this.state.check_id[item.id] ? color.gradientStartColor : '#ffffff', borderColor: this.state.check_id[item.id] ? color.gradientStartColor : color.gradientStartColor, marginTop: hp('1%'), width: 20, height: 20, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', alignContent: 'center', paddingTop:hp('0.7%') }}
                                                    onPress={() => this.changecheck(item)}
                                                />
                                                <Text style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: wp('3%'), marginTop: wp('2%'), marginLeft: wp('6%'), fontFamily: 'Catamaran-Bold', color:this.state.check_id[item.id] ? color.gradientStartColor:null }}>{item.itemName}</Text>
                                            </TouchableOpacity>
                                        )

                                    }} />

                            
                        </View>
                    </ScrollView>
                    <View style={{borderRadius: 5,justifyContent: 'flex-end', alignSelf: 'center', flexDirection: 'row', marginTop: wp('5%') }}>
                                <TouchableOpacity style={{justifyContent:'center', alignSelf:'center'}}
                                    onPress={() => {
                                        this.save(this.state.check_id);
                                    }}
                                >
                                    <LinearGradient
                                        colors={[color.gradientStartColor, color.gradientEndColor]} 
                                        start={{ x: 0.0, y: 0.25 }} end={{ x: 1.2, y: 1.0 }}
                                        style={{
                                            width: wp('100%'),height:hp('7%'),
                                            borderTopLeftRadius: 8,
                                            borderTopRightRadius: 8,
                                            borderColor: '#fff',
                                            shadowColor: "#000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 2,
                                            },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,
                                            elevation: 5,
                                            justifyContent:'center',
                                            alignSelf:'center'
                                        }}>
                                        {
                                            this.state.saveloading === true ? (
                                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                                    <View style={{ paddingRight: 10, backgroundColor: 'transparent' }}>
                                                        <ActivityIndicator size={'small'} color='#FFFFFF' />
                                                    </View>
                                                    <View style={{ backgroundColor: 'transparent' }}>
                                                        <Text style={{ color: '#FFFFFF', fontFamily: 'Catamaran-Bold', }}>Please Wait...</Text>
                                                    </View>
                                                </View>
                                            ) : (
                                                    <Text style={{ color: 'white', textAlign: 'center',alignSelf:'center',fontFamily: 'Catamaran-Bold', }}> SAVE</Text>
                                                )
                                        }
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                </SafeAreaView>
            );
        }


    }
}

const styles = StyleSheet.create({
    logoutImage: {
        width: wp('5%'),
        height: hp('5%'),
        resizeMode: 'contain'
    },
    editImage: {
        width: wp('4%'),
        height: hp('4%'),
        resizeMode: 'contain'
    },
    otherImages: {
        width: wp('3.5%'),
        height: hp('3.5%'),
        resizeMode: 'contain'
    },
    clientImage: {
        width: wp('18%'), height: hp('18%'),
        aspectRatio: 1,
        borderColor: '#fff',
        backgroundColor: '#CFCFCF',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
    },
    itemHeader: {
        fontFamily: 'Catamaran-Bold',
        color: '#293D68',
        fontSize: hp('2.2%')
    },
    smallImage: {
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        margin: hp('1%'),
        width: wp('8%'),
        height: hp('8%'),
        aspectRatio: 1
    },
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    modal2: {
        maxHeight: 490,
        minHeight: 80
    },
    overlay: {
        // height: Platform.OS === "ios" ? Dimensions.get("window").height : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT"),
        ...StyleSheet.absoluteFillObject,
        // marginBottom:wp('-2%'),
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
    }
});



export default withNavigation(SearchableReturnReasons);
