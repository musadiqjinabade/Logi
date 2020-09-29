import React, { Component } from 'react';
import { Text, View, StatusBar,SafeAreaView,FlatList, StyleSheet, TouchableOpacity,AsyncStorage,ToastAndroid, BackHandler } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import Headers from '../component/Headers';
import color from '../component/color';
import Modal from 'react-native-modalbox';
import APIService from '../component/APIServices';

// import SearchableTags from './SearchableTags';



//Dummy Data for the MutiSelect
// this.items = [
//     { id: '1', name: 'America' },
//     { id: '2', name: 'Argentina' },
//     { id: '3', name: 'Armenia' },
//     { id: '4', name: 'Australia' },
//     { id: '5', name: 'Austria' },
//     { id: '6', name: 'Azerbaijan' },
//     { id: '7', name: 'Argentina' },
//     { id: '8', name: 'Belarus' },
//     { id: '9', name: 'Belgium' },
//     { id: '10', name: 'Brazil' },
//   ];

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'ScanSummary' })],
});
class LinkScanDetailScreen extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            expanded: true,
            selectedItem: [],
            TagsData:[],
            isStateModalVisible:false,
            jobId:'',
            SelectedTags:[]


        }

    }

    async componentDidMount() {
        this.setState({ jobId: this.props.navigation.state.params.header})
        this.focusListener = this.props.navigation.addListener('didFocus',async () => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
            var tags = await AsyncStorage.getItem('Tagsdata')
            console.log("tag:", tags);
            var myArray = []
            if (tags != null) {
                myArray = JSON.parse(tags)
            }
            this.setState({ TagsData: myArray },()=>{
                console.log('length:',this.state.TagsData)
            })
            var SelectedTags = await AsyncStorage.getItem('SelectedTags')
            var SelectedArray = []
            if (SelectedTags != null) {
                SelectedArray = JSON.parse(SelectedTags)
            }
            this.setState({ SelectedTags: SelectedArray }, () => {
                console.log('SelectedTags:', this.state.SelectedTags)
            })
                // this.getDetails()
    
          
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

    async getTagList(){
        // var data = await APIService.execute('GET', APIService.URLBACKEND + 'tag/gettaglist?page_no=1&page_count=10&sort_on=created_at&sort_by=desc', null)
        // console.log("taglist data :",data)
        // if(data.data.status_code==200){
        //     this.setState({isStateModalVisible:!this.state.isStateModalVisible,Tags:data.data.data},()=>{
                this.props.navigation.navigate('SearchableTags',{item: this.state.TagsData})
                console.log('tags',this.state.TagsData)
        //     })
        // }
        // else{
        //     ToastAndroid.show('No data', ToastAndroid.LONG, 25, 50);
        // }

        
    }

    async cancelJob() {
        this.refs.redirectHome.close()
        var data = {}
        data.mapping_id = this.state.jobId||null
        var cancelJobresponse = await APIService.execute('DELETE', APIService.URLBACKEND + 'mapping/canceljob', data)
        if (cancelJobresponse.data.status_code == 200) {
            ToastAndroid.show(cancelJobresponse.data.message, ToastAndroid.LONG, 25, 50);
            // this.props.navigation.navigate('LinkMap')
                this.props.navigation.navigate('Dashboard')      
        }
    }


    render() {
        return (
            <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
                {/* {
                    this.state.isStateModalVisible ? (
                        <SearchableTags
                        onAssignToMe={(value) => {
                            console.log('props data',value)
                        }} />
                    ) : null
                } */}
                <Headers isHome={true} onBackHome={() => { this.refs.redirectHome.open() }}  label={'Aggregate - '+this.state.jobId}  onBack={() => this.props.navigation.goBack() }expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <ScrollView style={{marginBottom: hp('8%')}}>
                    <View style={{ flex: 1, flexDirection: 'column' }}>                        
                        <View style={{ marginLeft: wp('2%'), marginRight: wp('2%'), }}>
                            <View style={{ marginTop: hp('2%'), height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                <Text style={styles.header}>Attributes</Text>
                            </View>
                            <TouchableOpacity style={styles.selectBackgroundStyle}>
                                <Text style={styles.selectValues}>{"Select attributes"}</Text>
                                <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />

                            </TouchableOpacity>
                        </View>
                       
                        <TouchableOpacity onPress={()=>this.getTagList()}style={{ marginLeft: wp('2%'), marginRight: wp('2%'),flexDirection:'column' }}>
                            <View style={{ marginTop: hp('2%'), height: wp('6%'), flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', marginBottom: wp('2%') }}>
                                <Text style={styles.header}>Tags</Text>
                            </View>
                            {this.state.TagsData!==null &&this.state.TagsData.length > 0 ?
                                <View style={styles.selectBackgroundStyle} >
                                    <Text style={styles.selectValues}>{' ('+this.state.TagsData.length + ') Tags selected'}</Text>
                                    <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                                </View> :
                                <View style={styles.selectBackgroundStyle} >
                                    <Text style={styles.selectValues}>{"Select tags"}</Text>
                                    <SvgUri width="17" height="13" svgXmlData={svgImages.drop_down_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', marginTop: wp('4%'), marginRight: wp('4%') }} />
                                </View>
                            }
                        </TouchableOpacity>

                        {this.state.SelectedTags!==null &&this.state.SelectedTags.length > 0 ?<View style={{flex: 1,flexDirection:'column',justifyContent:'flex-start',alignSelf:'flex-start',margin: wp('2%')
                                }}>
                                <FlatList
                                // extraData={this.state.SelectedTags}
                                    data={this.state.SelectedTags}
                                    numColumns={3}
                                    renderItem={({ item }) => {
                                        console.log("item",item, this.state.SelectedTags)
                                        return(
                                            <View style={{ borderWidth: 1,borderColor:'#1D3567', borderRadius: 18, backgroundColor: '#fff', padding: 8, margin: 1, alignSelf: 'center' }}>
                                                <Text style={{ color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize:12 }}>{item}</Text>
                                            </View>
                                        )
                                    }}
                                    />
                            </View>:null}
                        {/* <View style={[styles.line, { marginTop: hp('2%') }]} />
                        <View style={{ marginBottom: hp('2%'), marginLeft: wp('2%'), marginRight: wp('2%'), }}>
                            <Text style={[styles.header]}>Comment</Text>

                            <TextInput
                                multiline={true}
                                underlineColorAndroid='transparent'
                                style={styles.batchstyle}
                                keyboardType='default'
                                placeholder={'Enter comment'}></TextInput>
                        </View> */}


                    </View>
                    
                </ScrollView>
                <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"redirectHome"} swipeArea={20}
                    backdropPressToClose={true}  >
                    <ScrollView>
                        <View style={{ /*height: wp('65%'),*/ width: wp('65%'), justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10 }} >
                        <TouchableOpacity style={{ width: wp('10%'), height: hp('5%'), justifyContent: 'center', alignSelf: 'flex-end', alignItems: 'flex-end'}} onPress={() => { this.refs.redirectHome.close() }} >
                                    <SvgUri width="20" height="20" svgXmlData={svgImages.close} style={{ resizeMode: 'contain' }} />
                                </TouchableOpacity>
                            <SvgUri width="55" height="55" svgXmlData={svgImages.checkmark} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', marginTop: wp('4%') }} />
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', padding: 5 }}>
                                <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 16, color: '#1D3567' }}>Confirmation</Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignSelf: 'center', flex: 1 }}>
                                <Text style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567', textAlign: 'center' }}>Do you want to go back without completing job ?</Text>
                            </View>
                            <View style={{ justifyContent: 'space-between', alignSelf: 'center', flex: 1, flexDirection: 'row', marginBottom: wp('2%') }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.refs.redirectHome.close()
                                        this.props.navigation.navigate('Dashboard')                                    
                                    }}
                                    style={{
                                        width: wp('26%'), height: wp('12%'), shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        margin: wp('2%'),
                                        shadowRadius: 3, justifyContent: 'center', alignSelf: 'center',
                                        borderRadius: 5,
                                        flexDirection: 'column',
                                        elevation: 4,
                                        backgroundColor: '#6AC259',
                                    }}>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#FFFFFF', textAlign: 'center' }}>Save to in progress</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.cancelJob()}
                                    style={{
                                        width: wp('26%'), height: wp('12%'), shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        margin: wp('2%'),
                                        shadowRadius: 3, justifyContent: 'center', alignSelf: 'center',
                                        borderRadius: 5,
                                        flexDirection: 'column',
                                        elevation: 4,
                                        backgroundColor: '#FFFFFF',
                                    }}
                                >
                                    <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#1D3567', textAlign: 'center' }}>Cancel job</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
                    <View style={{ flexDirection: 'row'
                    }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()      }>
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
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()      }>
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

            </SafeAreaView >

        )

    }
}

export default withNavigation(LinkScanDetailScreen);

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
    multiselecter:{
        height: wp('15%'),
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowColor: '#CECECE',
        shadowRadius: 3,
        elevation: 4,
        // paddingLeft:hp('1%'),
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
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    modal4: {
        maxHeight: 300,
        minHeight: 80
    },
    modal1: {
        maxHeight: 260,
        minHeight: 80
    }
});