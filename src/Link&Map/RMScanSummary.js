import React, { Component } from 'react';
import { Text, View, FlatList, StatusBar, TextInput, StyleSheet,TouchableOpacity, AsyncStorage, ToastAndroid, Dimensions, ActivityIndicator, BackHandler } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import { Button, Container} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import SearchableDropdown from '../Assign/All/searchablebleDropdown';
import svgImages from '../Images/images';
import APIService from '../component/APIServices';
import Headers from '../component/Headers';
import color from '../component/color';
import Modal from 'react-native-modalbox';

const _ = require('lodash');



const mockData = [
    { id: 1, name: 'React Native Developer' }, // set default checked for render option item
    { id: 2, name: 'Android Developer' },
    { id: 3, name: 'iOS Developer' },
    { id: 4, name: 'React Native Developer' }, // set default checked for render option item
    { id: 5, name: 'Android Developer' },
    { id: 6, name: 'iOS Developer' },
    { id: 12, name: 'React Native Developer' }, // set default checked for render option item
    { id: 22, name: 'Android Developer' },
    { id: 32, name: 'iOS Developer' },
    { id: 142, name: 'React Native Developer' }, // set default checked for render option item
    { id: 23, name: 'Android Developer' },
    { id: 34, name: 'iOS Developer' }
];
const resetAction = StackActions.reset({
    index: 0,
    key: null,
    actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
});

class RMScanSummary extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            focus: false,
            height: 40,
            username: '',
            newValue: '',
            Product: mockData,
            products: '',
            isVisible: true,
            checked: false,
            progressText: 'Loading...',
            mapping_id: '',
            levels: false,
            loading: true,
            locationId: null,
            locationName: '',
            assignment_mapping: '',
            receivedList: '',
            expanded: true,
            TagsData:[],
            product_details:'',
            packeing_details:'',
            Comment:'',
            jobType:''

        }

    }

    toggleModal = () => {
        this.setState({ isModalVisible: !this.state.isModalVisible });
    };

    searchText(text) {
        this.setState({ username: text }, () => {
            const newData = mockData.filter(item => {
                var itemData = item.name ? (item.name) : '----';
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });
            //   mockData = newData;
            this.setState({ Product: newData });
        });
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


    updateSize = (height) => {
        this.setState({
            height
        });
    }

    async ScanSummary() {
        var scan = await APIService.execute('GET', APIService.URLBACKEND + 'rowmaterial/getaggregationrmsummary?mapping_id=' + this.state.mapping_id + '&job_type='+ this.state.jobType, null)
        var responseData = _.map(scan.data.data.assignment_mapping, (item) => {
            return {
                ...item,
                mode: 'Collapsed'
            }
        })
        this.setState({ job_detail: scan.data.data.job_detail[0], assignment_mapping: responseData, product_details:scan.data.data.product_details, packeing_details: scan.data.data.packeing_details, loading: false }, () => {
            // var levels1=[]
            // levels1.push(this.state.assignment_mapping)
            // for(i=0; i<levels1.length; i++){
            if (this.state.assignment_mapping.length > 0 && this.state.assignment_mapping[0].level_id == 2) {
                console.log("levels1[i].level_id:", this.state.assignment_mapping[0].level_id)
                this.setState({ levels: true })
            }
            // }


        })
    }


    async componentDidMount() {
        await AsyncStorage.getItem('SelectedLocation').then((value) => {
            var location = JSON.parse(value);
            this.setState({
                locationId: location.id ? location.id : location.value,
                locationName: location.itemName ? location.itemName : location.label
            }, () => console.log('values', this.state.locationId, this.state.locationName))
        });
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
            this.setState({ mapping_id: this.props.navigation.state.params.item, loading: true, jobType:this.props.navigation.state.params.jobType }, async() => {
                var tags = await AsyncStorage.getItem('Tagsdata')
                console.log("tag:", tags);
                var myArray = []
                if (tags != null) {
                    myArray = JSON.parse(tags)
                }
                this.setState({ TagsData: myArray },()=>{
                    console.log('length:',this.state.TagsData)
                })
                this.ScanSummary()
            })
           
        });

    }


    handleBackPress() {
        this.navigateBack();
        return true;
    }

    async navigateBack() {
        this.props.navigation.navigate('LinkScanproduct')
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
        this.focusListener.remove();
    }

    async save_complete() {
        this.setState({ loadingsave: true });
        this.refs.modal6.open()


    }
    conformationNo() {
        this.setState({ loadingsave: false });

        this.refs.modal6.close()
    }

    async conformation() {
        var data = {}
        data.mapping_id = this.state.mapping_id;
        data.comment = this.state.newValue;
        data.location_id = this.state.locationId
        this.refs.modal6.close()
        var scan = await APIService.execute('POST', APIService.URLBACKEND + 'rowmaterial/endrmmappingjob', data)
        ToastAndroid.show(scan.data.message, ToastAndroid.LONG, 25, 50);
        console.log('end details:', scan);
        AsyncStorage.setItem('mappingId', data.mapping_id);
        AsyncStorage.setItem('comment','')
        this.setState({ loadingsave: false });
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
        }))
    }


    checkLevel(item, index) {
        console.log('item:',item)
        var responseData = _.map(this.state.assignment_mapping, (data) => {
            if (data.sequence_number == item.sequence_number) {
                return {
                    ...data,
                    mode: data.mode === "Expanded" ? 'Collapsed' : 'Expanded'
                }
            }
            else {
                return { ...data }
            }
        })
        this.setState({
            assignment_mapping: responseData
        }, () => {
            var check = true

            var array = this.state.assignment_mapping.filter(function (x) {
                if (x.level_id < item.level_id) {
                    check = false
                }
                if( x.level_id < item.level_id && x.parent_sequence_number==null){
                    return x
                }
                return x.level_id >= item.level_id
            });
            // var findIndex = array.findIndex(item.sequence_number)
            console.log('findIndex:',array)

            if (array) {
                if (item.mode == 'Collapsed') {
                    var responseData = _.map(array, (data, indexes) => {
                        if (data.sequence_number != item.sequence_number && data.level_id == item.level_id) {
                            return {
                                ...data,
                                mode: data.mode = 'Collapsed'
                            }
                        }
                        else if (data.sequence_number == item.sequence_number) {
                            if (item.mode == 'Collapsed') {
                                console.log('working123',indexes)

                                this.expandReceivedata(item.sequence_number, indexes)

                            }
                            return { ...data }
                        }
                        else {
                            return { ...data }
                        }
                    })
                    this.setState({ assignment_mapping: responseData })
                }
                else {
                    this.setState({
                        assignment_mapping: array
                    })
                }
            }
            if (check) {
                this.expandReceivedata(item.sequence_number, index)
            }

        })
    }

    async expandReceivedata(seqnum, index) {
        var url = APIService.URLBACKEND + 'rowmaterial/getaggregationrmsummary?mapping_id=' + this.state.mapping_id + '&sequence_number=' + seqnum + '&job_type='+ this.state.jobType;
        var scan = await APIService.execute('GET', url, null)
        var i;
        if(scan.data.data!= null){
            var responseData = _.map(scan.data.data, (item) => {
                return {
                    ...item,
                    mode: 'Collapsed'
                }
            })
           }
        if (scan.data.data != null && responseData!=null) {
            for (i = 0; i < responseData.length; i++) {
                // this.state.receivedList.push(scan.data.data.assignment_mapping[i])
                this.state.assignment_mapping.splice(index + 1, 0, responseData[i])
            }
        }
        var uniq = _.uniqBy(this.state.assignment_mapping, 'sequence_number')
        this.setState({ assignment_mapping: uniq }, () => {
            console.log("update:", this.state.assignment_mapping)
        })

        if (this.props.navigation.state.params.item == 'jobHistory') {
            for (let i = 0; i < scan.data.data.length; i++) {
                var seqfull = scan.data.data[i].sequence_number
                // seqnumber.push(scan.data.data.assignment_mapping[i].sequence_number)
                this.setState({ seqnumber: { ...this.state.seqnumber, [seqfull]: !this.state.seqnumber[seqfull] } })
            }
        }

    }

    plusimages(item) {
        if (item.mode == "Expanded") {
            return (
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', }}>
                    <SvgUri width="14" height="12" fill="#FFFFFF" svgXmlData={svgImages.minus} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', margin: wp('1%') }} />
                </View>
            )
        }
        else {
            return (
                <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end', }}>
                    <SvgUri width="14" height="12" fill="#FFFFFF" svgXmlData={svgImages.plus} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', margin: wp('1%') }} />
                </View>
            )
        }
    }

    onChangeCommentText(Text){
        this.setState({Comment:Text},async ()=>{ 
            await AsyncStorage.setItem('comment', '')
            await AsyncStorage.setItem('comment', Text)
         })
    }

    marginlevel(item) {
        if (item.level_id == 0) {
            if (item.level_id == 0 && item.parent_sequence_number == null) {
                return null;

            }
            else {
                console.log("leve id 1 false")

                return wp('8%')
            }
        }
        else if (item.level_id == 2) {
            if (item.level_id == 2 && item.parent_sequence_number == null) {
                console.log("leve id 2 true")
                return null
            }
            else {
                console.log("leve id 2 false")
                return wp('6%')

            }
        }
        else if (item.level_id == 3) {
            if (item.level_id == 3 && item.parent_sequence_number == null) {
                return null
            }
            else {
                return wp('4%')
            }
        }
        else {
            return null
        }
    }

    async cancelJob() {
        this.refs.redirectHome.close()
        var data = {}
        data.job_id = this.state.job_detail?this.state.job_detail.jobId:null
        var cancelJobresponse = await APIService.execute('POST', APIService.URLBACKEND + 'rowmaterial/cancelrmjob', data)
        if (cancelJobresponse.data.status == 200) {
            ToastAndroid.show("Job Cancel Successfully", ToastAndroid.LONG, 25, 50);
            // this.props.navigation.navigate('LinkMap')
            AsyncStorage.setItem('comment','')
            this.props.navigation.navigate('Dashboard')              
        }
    }

    render() {
        var seq = this.props.navigation.state.params.url;

        const {   newValue } = this.state
        
        const fontSize = 11

        return (
            <Container style={{ flex: 1, backgroundColor: '#F1F3FD' }}>
                <Headers isHome={true} onBackHome={() => { this.refs.redirectHome.open() }}  label={this.state.job_detail ? 'RM Aggregate - '+this.state.job_detail.job_id : null} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} isHome={true}  />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1, flexDirection: 'column',  }}>
                            <View style={{ flex:1,justifyContent: 'space-between', flexDirection: 'row', marginTop: hp('1%')  }}>
                                {/* <Button style={styles.buttonStyle} >
                                    <Text style={styles.header} > + Details</Text>
                                </Button> */}
                                <Button onPress={() => { this.refs.modalComment.open() }} style={styles.buttonStyle}>
                                    <Text style={styles.header} > + Comment</Text>
                                </Button>
                                <Button style={styles.buttonStyle} onPress={() => { this.props.navigation.goBack() }}>
                                    <Text style={styles.header} > + Add</Text>
                                </Button>
                                <Button style={styles.buttonStyle}
                                onPress={() => this.props.navigation.navigate('RMDeletebyscan', { item: seq, jobId: this.state.job_detail.job_id, jobType: this.state.jobType, jobhistroy: this.props.navigation.state.params.jobhistroy })}>
                                    <Text style={styles.header} > - Remove</Text>
                                </Button>

                            </View>

                            <View style={styles.line} />

                        <View style={{ paddingLeft: wp('2%'), paddingRight: wp('2%') }}>
                            <View style={{ marginTop: hp('1%') }} />
                            <Text style={styles.headerBold}>Packaging</Text>
                            <FlatList
                                    extraData={this.state.packeing_details}
                                    data={this.state.packeing_details}
                                    renderItem={({ item, index }) => (
                                        <View style={{ marginTop: hp('1%'), flex: 1, flexDirection: 'row' }}>
                                            <Text style={styles.packagingItems} >{item.pkg_name || '---'}</Text>
                                            <Text style={styles.packagingValue} >{item.Count || '---'}</Text>
                                        </View>
                                )} /> 
                        </View>


                        <View style={styles.line} />
                        {/* <View style={[styles.line, { marginTop: hp('2%') }]} /> */}


                        <View style={{ paddingLeft: wp('2%'), paddingRight: wp('2%') }}>
                        <Text style={styles.headerBold}>Products</Text>

                            <FlatList
                                    extraData={this.state.product_details}
                                    data={this.state.product_details}
                                    renderItem={({ item, index }) => (
                                        <View style={{ marginTop: hp('1%'), flex: 1, flexDirection: 'row' }}>
                                            <Text style={styles.packagingItems} >{item.product_name || '---'}</Text>
                                            <Text style={styles.packagingValue} >{item.Count || '---'}</Text>
                                        </View>
                                )} />                                
                        </View>
                        <View style={styles.line} />

                            <View style={{
                                flex: 1, marginTop:hp('2%'),paddingLeft: wp('2%'), paddingRight: wp('2%')
                            }}>

                                <Text style={styles.headerBold}>Items</Text>
                                    <View style={{marginTop:hp('2%')}}>                             
                                    <FlatList
                                    extraData={this.state.assignment_mapping}
                                    data={this.state.assignment_mapping}
                                    renderItem={({ item, index }) => (
                                        <View style={{

                                            flex: 1, flexDirection: 'row',
                                            backgroundColor: item.level_id >= 2 ? color.gradientEndColor : '#4A90E2',
                                            shadowOpacity: 0.8,
                                            height: wp('8%'),
                                            shadowColor: '#CECECE',
                                            shadowRadius: 3, elevation: 2, borderRadius: 5,
                                            margin: wp('1%'), marginTop: wp('0.5%'), marginBottom: wp('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginVertical: hp('0.5%'),marginLeft: this.marginlevel(item)
                                        }}>
                                            <TouchableOpacity onPress={() => this.checkLevel(item, index)} style={{
                                                flex: 1, flexDirection: 'row', borderRadius: 5,
                                                margin: wp('1%'), marginTop: wp('0.5%'), marginBottom: wp('0.5%'), justifyContent: 'flex-start', alignItems: 'center', 
                                            }} >
                                                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', margin: wp('0.5%'), marginLeft: wp('2%') }}>
                                                    <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#ffffff', justifyContent: 'flex-start',alignSelf: 'center', }}>{item.level_name} :</Text>
                                                    <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5, justifyContent: 'flex-start',alignSelf: 'center', }}>{item.sequence_number || '---'}</Text>
                                                    {item.level_id == 0 ? <Text numberOfLines={1} style={{flex:1, fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5,justifyContent: 'center',alignSelf: 'center' }}>- {item.rm_name|| '---'}</Text> : null}
                                                </View>

                                                {item.level_id >= 2 ? this.plusimages(item) : null}
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                //  keyExtractor={item => item.assignment_mapping_id}
                                />
                                </View>

                            </View>

                        </View>

                    </ScrollView>
                    <View style={{ justifyContent: 'flex-end', alignSelf: 'center', flexDirection: 'row', marginTop: wp('5%')}}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()      }>
                            <View
                                style={[styles.center, {
                                    marginTop: hp('1%'),
                                    width: wp('50%'),
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
                        <TouchableOpacity onPress={() => this.save_complete()}>
                            <LinearGradient
                                colors={[color.gradientStartColor, color.gradientEndColor]}
                                start={{ x: 0.0, y: 0.25 }} end={{ x: 1.2, y: 1.0 }}
                                style={[styles.center, {
                                    marginTop: hp('1%'),
                                    width: wp('50%'),
                                    height: hp('8%'),
                                    borderWidth: 0.2,
                                    borderTopRightRadius: wp('2.5%'),
                                }]}>
                                    {
                                this.state.loadingsave === true ? (
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ paddingRight: 10 }}>
                                            <ActivityIndicator size={'small'} color='#FFFFFF' />
                                        </View>
                                        <View>
                                            <Text style={styles.btntext}>Please Wait...</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={styles.btntext}>{'Finish'}</Text>
                                    </View>
                                    )
                            }
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                {this.state.Product.length > 0 ? (
                    <SearchableDropdown
                        title={'Select Products'}
                        data={this.state.Product}
                        onSelect={(selectedItem) => {
                            this.setState({ products: selectedItem, isModalVisible: false })
                        }}
                        onCancel={() => { this.setState({ isModalVisible: false }) }}
                        isVisible={this.state.isModalVisible === true} />) : null}

                <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"modal6"} swipeArea={20}
                    backdropPressToClose={false}  >
                    <ScrollView>
                        <View style={{ /*height: wp('65%'),*/ width: wp('65%'), justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10 }} >
                            <SvgUri width="55" height="55" svgXmlData={svgImages.checkmark} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', marginTop: wp('4%') }} />
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', padding: 5 }}>
                                <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: 16, color: '#1D3567' }}>Confirmation</Text>
                            </View>
                            <View style={{ justifyContent: 'center', alignSelf: 'center', flex: 1 }}>
                                <Text style={{ fontFamily: 'Montserrat-Regular', color: '#1D3567', textAlign: 'center' }}>Are you sure that you want to complete this Job?</Text>
                            </View>
                            <View style={{ justifyContent: 'space-between', alignSelf: 'center', flex: 1, flexDirection: 'row', marginBottom: wp('2%') }}>
                                <TouchableOpacity
                                    onPress={() => this.conformation()}
                                    style={{
                                        width: wp('23%'), height: wp('10%'), shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        margin: wp('2%'),
                                        shadowRadius: 3, justifyContent: 'center', alignSelf: 'center',
                                        borderRadius: 5,
                                        flexDirection: 'column',
                                        elevation: 4,
                                        backgroundColor: '#6AC259',
                                    }}>
                                    <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#FFFFFF' }}>Ok</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.conformationNo()}
                                    style={{
                                        width: wp('23%'), height: wp('10%'), shadowOffset: { width: 0, height: 2 },
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
                                    <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#1D3567' }}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </Modal>
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
                                    placeholder={'Enter your comment here.'}
                                    placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Regular', fontSize: 20 }} onChangeText={(newValue) => this.setState({ newValue })}  multiline={true} value={newValue} onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)} ></TextInput>

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
                                        <TouchableOpacity onPress={async () => { this.refs.modalComment.close()}}>
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
                {this.renderModalContent()}
            </Container>

        )

    }
}

export default withNavigation(RMScanSummary);

var styles = StyleSheet.create({

    linearGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F3FD',
    },
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
    btntext: {
        fontFamily: 'Montserrat-Bold', 
        justifyContent: 'center', 
        alignSelf: 'center', 
        color: '#FFFFFF' 
    },
    overlay: {
        height: Platform.OS === "android" ? Dimensions.get("window").height : null,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
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
    },
    buttonStyle: {
        borderRadius: 5,
        width: wp("31%"),
        height: hp('6%'),
        margin: wp('0.5'),
        backgroundColor: color.gradientEndColor
    },
    headerBold: {
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        color: '#000000'
    },
    header: {
        fontSize: wp('3%'),
        flex: 1,
        color: '#ffffff',
        fontFamily: 'Montserrat-Bold',
        textAlign: 'center',
    },
    packagingItems: {
        flex: 1, justifyContent: 'center', alignItems: 'flex-start',
        color: '#000000',
        paddingHorizontal: wp('2%'),
        fontFamily: 'Montserrat-Regular',
    },
    packagingValue: {
        alignItems: 'flex-end',
        color: '#000000',
        fontFamily: 'Montserrat-Regular',
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
});