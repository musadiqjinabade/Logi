import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, SafeAreaView,TextInput,ToastAndroid, TouchableOpacity, FlatList,AsyncStorage, ActivityIndicator } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { withNavigation,  StackActions, NavigationActions } from 'react-navigation';
import Headers from '../component/Headers';
import { CheckBox } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import color from '../component/color';
import APIService from '../component/APIServices';
const _ = require('lodash');
import svgImages from '../Images/images';
import SvgUri from 'react-native-svg-uri';



const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'LinkScanDetailScreen' })],
});

const selected_data = {}
class RawMaterialList extends Component {
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
            pagecount:0
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
        var data = await APIService.execute('GET', APIService.URLBACKEND + 'rowmaterial/getrowmaterial?page_no='+ this.state.pagecount+'&page_count=10&sort_on=created_at&sort_by=desc', null)
        console.log("taglist data :",data)
        if(data.data.status==200){
            this.setState({Tags:data.data.data, loading: false, pagecount: this.state.pagecount + 1},()=>{
                console.log("tags:",this.state.Tags)
                this.arrayholder = data.data.data;

            })
        }
        else{
            ToastAndroid.show('No Data', ToastAndroid.LONG, 25, 50);
        }
    }

    async loadMoreJobs(){
       this.setState({loading: true,pagecount:this.state.pagecount+1},async()=>{
        var data = await APIService.execute('GET', APIService.URLBACKEND + 'rowmaterial/getrowmaterial?page_no='+ this.state.pagecount+'&page_count=10&sort_on=created_at&sort_by=desc', null)
        console.log("taglist data :",data)
        if(data.data.status==200){

            if(data.data.data > 0) {
                for (var i = 0; i < data.data.data.length; i++) {
                    this.state.Tags.push(data.data.data[i])
                    this.arrayholder.push(data.data.data[i])
                }
                this.setState({
                    loading: false
                })
            }
            else{
                this.setState({loading:false})
                ToastAndroid.show('All Raw Material Loaded', ToastAndroid.LONG, 25, 50);
            }
        }
        else{
            ToastAndroid.show('No Data', ToastAndroid.LONG, 25, 50);
        }
       })
       

    }


    searchText(text) {
        this.setState({ searchtags: text }, () => {
            console.log(text)
            if (text != '') {
                var searchResults = [];
                for (var d of this.arrayholder) {
                    if ( d.rm_name.toLowerCase().includes(text.toLowerCase()) ) {
                        searchResults.push(d);
                    }
                }
                this.setState({
                    Tags: searchResults,
                    searchtags: text
                })
            }
            else {
                this.setState({ Tags: this.arrayholder, searchtags: text })
            }
        });
    }

    

    changecheck(item) {
        this.setState({
            check_id: { ...this.state.check_id, [item.rm_name]: !this.state.check_id[item.rm_name]  }
        },()=>{
            console.log('check change:',this.state.check_id)
        })
    }

    async save(item) {
        console.log('click_box:', item)
        var check_data = [];
        for (let i = 0; i < Object.keys(item).length; i++) {
            if (item[Object.keys(item)[i]] == true) {
                check_data.push(Object.keys(item)[i])
            }
        }
        var tag_data = [];
        for(let i=0; i<this.state.Tags.length; i++){
            for(let j=0; j<check_data.length; j++){
                if(check_data[j]==this.state.Tags[i].rm_name){
                    //push data
                    tag_data.push(this.state.Tags[i])

                }
            }
        }
        await AsyncStorage.removeItem('RawMaterildata');
        AsyncStorage.setItem('RawMaterildata',JSON.stringify(tag_data))
        await AsyncStorage.removeItem('RawMaterilSelected');
        AsyncStorage.setItem('RawMaterilSelected',JSON.stringify(check_data))
        this.props.navigation.goBack()    }


    render() {
            return (
                <SafeAreaView style={{flex:1}}>
                    <Headers  label={"Select Raw Material"} onBack={() => { this.props.navigation.goBack()  }} expanded={this.state.expanded} />
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
                                    placeholder={'Search Raw Material'}
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
                                    data={this.state.Tags}
                                    onEndReached={({ distanceFromEnd }) => {
                                        this.loadMoreJobs();
                                    }}
                                    onEndThreshold={20}
                                    renderItem={({ item }) => {
                                        // var checkedItem = _.find(this.state.check_id, function (o) {
                                        //     if (o.rm_name == item.rm_name) {
                                        //         return true
                                        //     } else {
                                        //         return false

                                        //     };
                                        // });
                                        // console.log("this.state.check_id[item.rm_name]:",item)
                                        return (
                                            <TouchableOpacity style={{ flexDirection: 'row', margin: wp('2%') }}
                                                onPress={() => this.changecheck(item)}
                                                >
                                                <CheckBox checked={this.state.check_id[item.rm_name]} style={{ borderRadius: 5, marginRight: 5, backgroundColor: this.state.check_id[item.rm_name] ? color.gradientStartColor : '#ffffff', borderColor: this.state.check_id[item.rm_name] ? color.gradientStartColor : color.gradientStartColor, marginTop: hp('1%'), width: 20, height: 20, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', alignContent: 'center', paddingTop:hp('0.7%') }}
                                                    onPress={() => this.changecheck(item)}
                                                />
                                                <Text style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: wp('3%'), marginTop: wp('2%'), marginLeft: wp('6%'), fontFamily: 'Catamaran-Bold', color:this.state.check_id[item.rm_name] ? color.gradientStartColor:null }}>{item.rm_name}</Text>
                                            </TouchableOpacity>
                                        )

                                    }} />
                                                                {this.state.loading?<View style={{flex:1, justifyContent:'center', alignSelf:'center'}}><ActivityIndicator/></View>:null}


                            
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



export default withNavigation(RawMaterialList);
