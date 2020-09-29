import React, { Component } from 'react';
import { Text, View, FlatList, StatusBar, StyleSheet, TouchableOpacity, AsyncStorage, ToastAndroid,TextInput, Dimensions, ActivityIndicator, BackHandler } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Button, Container } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import SearchableDropdown from '../Assign/All/searchablebleDropdown';
import svgImages from '../Images/images';
import APIService from '../component/APIServices';
import Headers from '../component/Headers';
import Modal from 'react-native-modalbox';
import color from '../component/color';
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

class RecieveScanSummary extends Component {
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
            recieve_id: '',
            locationId: null,
            locationName: '',
            receivedData: '',
            receivedList: [],
            expanded: true,
            loading:true,
            product_details:'',
            packaging_details:''
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
        var url = APIService.URLBACKEND + 'stockTransfer/getrecievesummary?recieve_id=' + this.props.navigation.state.params.item;
        var scan = await APIService.execute('GET', url, null)
        console.log("scan summary:", scan)
        var i;
        if (scan.data.data.location_wise != null) {
            var responseData = _.map(scan.data.data.location_wise, (item, index) => {
                console.log("collapse item:", item, scan.data.data.location_wise)
                return {

                    ...item,
                    mode: 'Collapsed',
                    sequence_number: index
                }
            })
            for (i = 0; i < responseData.length; i++) {
                this.state.receivedList.push(responseData[i])
            }
        }

        var uniq = _.uniqBy(this.state.receivedList, 'location_id')
        console.log("after uniq data:",uniq,this.state.receivedList)
        this.setState({ job_detail: scan.data.data.stockdetails[0], receivedData: uniq,packaging_details:scan.data.data.packaging_details,product_details:scan.data.data.product_details, loading: false }, () => console.log('receivedData', this.state.receivedData))
    }


    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
        console.log('receive ID', this.props.navigation.state.params.item)
        await AsyncStorage.getItem('SelectedLocation').then((value) => {
            console.log('v', typeof (value));
            var location = JSON.parse(value);
            console.log('location id and name', location);
            this.setState({
                locationId: location.id ? location.id : location.value,
                locationName: location.itemName ? location.itemName : location.label
            }, () => console.log('values', this.state.locationId, this.state.locationName))
        });
        this.setState({ recieve_id: this.props.navigation.state.params.item, loading: true }, async() => {
            console.log("recieve_id id:", this.state.recieve_id)
            // var tags = await AsyncStorage.getItem('Tagsdata')
            //     console.log("tag:", tags);
            //     var myArray = []
            //     if (tags != null) {
            //         myArray = JSON.parse(tags)
            //     }
            //     this.setState({ TagsData: myArray }, () => {
            //         console.log('length:', this.state.TagsData)
            //     })
            // this.ScanSummary()

        })
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
            this.setState({ recieve_id: this.props.navigation.state.params.item, loading: true }, async() => {
                console.log("recieve_id id:", this.state.recieve_id)
                var tags = await AsyncStorage.getItem('Tagsdata')
                console.log("tag:", tags);
                var myArray = []
                if (tags != null) {
                    myArray = JSON.parse(tags)
                }
                this.setState({ TagsData: myArray }, () => {
                    console.log('length:', this.state.TagsData)
                })
                this.ScanSummary()

            })
        })
    }

    handleBackPress() {
        this.navigateBack();
        return true;
    }

    async navigateBack() {
        this.props.navigation.goBack()
        // this.props.navigation.navigate('ReceiveScanStock')
        return true;
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
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

        var body = {}
        body.job_id = this.state.job_detail ? this.state.job_detail.stockdetails_id:null;
        body.tagids = this.state.TagsData!=null?this.state.TagsData:null;
        body.job_type =  this.state.job_detail ? this.state.job_detail.job_type:null

        var tagAPI = await APIService.execute('POST', APIService.URLBACKEND + 'tag/assigntags', body)
        console.log('end tagAPI:', tagAPI);
        await AsyncStorage.removeItem('Tagsdata');
        await AsyncStorage.removeItem('SelectedTags');


        var data = {}
        data.recieve_id = this.state.recieve_id;
        data.comment = this.state.newValue;
        data.location_id = this.state.locationId
        this.refs.modal6.close()
        var scan = await APIService.execute('POST', APIService.URLBACKEND + 'stockTransfer/endrecievejob', data)
        if (scan.data.status_code == '200') {
            ToastAndroid.show(scan.data.message, ToastAndroid.LONG, 25, 50);
            console.log('end details:', scan);
            this.setState({ loadingsave: false });
            this.props.navigation.navigate('Dashboard')
        }
        else {
            this.setState({ loadingsave: false });
            ToastAndroid.show(scan.data.message, ToastAndroid.LONG, 25, 50);

        }

    }

    async expandReceivedata(seqnum, index, location) {
        console.log('inside expand row', seqnum, index, location!=null);
        // var url = APIService.URLBACKEND + 'stockTransfer/getrecievesummary?recieve_id=1079&sequence_number=' + seqnum;
        var url = ''
        if(location!=null){
            url = APIService.URLBACKEND + 'stockTransfer/getrecievesummary?recieve_id=' + this.props.navigation.state.params.item + '&sequence_number=' + null +'&location_id=' + location;

        }
        else{
            url = APIService.URLBACKEND + 'stockTransfer/getrecievesummary?recieve_id=' + this.props.navigation.state.params.item + '&sequence_number=' + seqnum;

        }
        // var url = APIService.URLBACKEND + 'stockTransfer/getrecievesummary?recieve_id=860&sequence_number=21023458099';
        console.log("get url:", url, seqnum||null);
        var scan = await APIService.execute('GET', url, null)
        console.log("expand data:", scan.data)
        var i;
        if (scan.data.data.assignment_mapping != null) {
            var responseData = _.map(scan.data.data.assignment_mapping, (item) => {
                console.log("collapse item:", item, scan.data.data.assignment_mapping)
                return {

                    ...item,
                    mode: 'Collapsed'
                }
            })
            for (i = 0; i < responseData.length; i++) {
                // this.state.receivedList.push(responseData[i])
                this.state.receivedData.splice(index + 1, 0, responseData[i])
            }
        }
        
        var uniq = _.uniqBy(this.state.receivedData, 'sequence_number')
        console.log("after uniq data:",uniq,this.state.receivedData)
        console.log('receivedList expand', this.state.receivedData.length, uniq.length, uniq);
        this.setState({ receivedData: uniq }, () => {
            console.log("update:", this.state.receivedData)
        })

    }


    

    getLevelwisecolor(level) {
        if (level == 9) {
            return '#F5A623'
        }
        else if (level == 8) {
            return '#8B572A'
        }
        else if (level == 7) {
            return '#417505'
        }
        else if (level == 6) {
            return '#B325D0'
        }
        else if (level == 5) {
            return '#F76D9D'
        }
        else if (level == 4) {
            return '#33B4E4'
        }
        else if (level == 3) {
            return '#4A90E2'
        }
        else if (level == 2) {
            return '#50E3C2'
        }
        else if (level == 1) {
            return '#FFFFFF'
        }
    }

    getLevelwisemargin(level) {
        if (level == 9) {
            return wp('1%')
        }
        else if (level == 8) {
            return wp('1.5%')
        }
        else if (level == 7) {
            return wp('2%')
        }
        else if (level == 6) {
            return wp('2.5%')
        }
        else if (level == 5) {
            return wp('3%')
        }
        else if (level == 4) {
            return wp('4%')
        }
        else if (level == 3) {
            return wp('5%')
        }
        else if (level == 2) {
            return wp('6%')
        }
        else if (level == 1) {
            return wp('7%')
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

    checkLevel(item, index) {
        console.log('Mode::',item.mode)
        var responseData = _.map(this.state.receivedData, (data) => {
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
            receivedData: responseData
        }, () => {
            var check = true

            var array = this.state.receivedData.filter(function (x) {
                if (x.level_id < item.level_id) {
                    check = false
                }
                if(x.location_id && x.count){
                    return x
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
                        if (data.sequence_number != item.sequence_number && data.level_id == item.level_id ) {
                            return {
                                ...data,
                                mode: data.mode = 'Collapsed'
                            }
                        }
                        else if (data.assignment_mapping_id == item.assignment_mapping_id) {
                            if (item.mode == 'Collapsed') {
                                if(item.count){
                                    this.expandReceivedata(item.sequence_number, indexes, item.location_id)
                                    console.log('working 1',indexes)
                                }
                                else{
                                    this.expandReceivedata(item.sequence_number, indexes, null)
                                    console.log('working 1',indexes)
                                }
                                

                            }
                            return { ...data }
                        }
                        else {
                            return { ...data }
                        }
                    })
                    this.setState({ receivedData: responseData })
                }
                else {
                    this.setState({
                        receivedData: array
                    },()=>{
                        console.log('not expand:',this.state.receivedData)
                    })
                }
            }
            if (check) {
                if (item.mode == 'Collapsed') {
                    if(item.count){
                        this.expandReceivedata(item.sequence_number, index, item.location_id)
                        console.log('working 1',index)
                    }
                    else{
                        this.expandReceivedata(item.sequence_number, index, null)
                        console.log('working 1',index)
                    }
                }
            }

        })
    }

    // renderLevelwisedata() {
    //     const fontSize = 11
    //     if (this.state.receivedData != null && _.isArray(this.state.receivedData)) {
    //         console.log('inside renderLevelwisedata', this.state.receivedData)
    //         return (
    //             <View style={{
    //                 flex: 1, shadowOffset: { width: 0, height: 2 },
    //                 shadowOpacity: 0.8,
    //                 shadowColor: '#CECECE',
    //                 shadowRadius: 3,
    //                 borderRadius: 5,
    //                 marginBottom: wp('4%'),
    //                 width: wp('94%'),
    //                 padding: wp('2%'),
    //                 flexDirection: 'column',
    //                 elevation: 4,
    //                 backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',
    //             }}>

    //                 < FlatList
    //                     style={{
    //                         flex: 1
    //                     }
    //                     }
    //                     extraData={this.state.receivedData}
    //                     data={this.state.receivedData}
    //                     // inverted={true}
    //                     renderItem={({ item, index }) => (
    //                         <View style={{
    //                             flex: 1,
    //                             width: wp('90%'),
    //                             // padding: wp('1%'),
    //                             flexDirection: 'column',
    //                             backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start',
    //                         }}>
    //                             <TouchableOpacity onPress={() => this.checkLevel(item, index)} style={{
    //                                 flex: 1, flexDirection: 'row', backgroundColor: item.level_id >= 2 ? '#4A90E2' : null,
    //                                 shadowOpacity: item.level_id >= 2 ? 0.8 : null,
    //                                 height: item.level_id >= 2 ? wp('8%') : null,
    //                                 shadowColor: item.level_id >= 2 ? '#CECECE' : null,
    //                                 shadowRadius: item.level_id >= 2 ? 3 : null, elevation: item.level_id >= 2 ? 2 : null, borderRadius: 5,
    //                                 margin: wp('1%'), marginTop: wp('0.5%'), marginBottom: wp('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: item.level_id == 1 ? wp('6%') : null
    //                             }} >
    //                                 {item.level_id >= 2 ?
    //                                     <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', margin: wp('0.5%'), marginLeft: wp('2%') }}>
    //                                         <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#ffffff' }}>{item.level_name} :</Text>
    //                                         <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5 }}>{item.sequence_number || '---'}</Text>
    //                                         {item.level_id == 1 ? <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5 }}>- {item.product_name || '---'}</Text> : null}
    //                                     </View>
    //                                     :
    //                                     <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', margin: wp('0.5%') }}>
    //                                         <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#4A90E2' }}>{item.level_name} :</Text>
    //                                         <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#4A90E2', marginLeft: 5 }}>{item.sequence_number || '---'}</Text>
    //                                         {item.level_id == 1 ? <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#4A90E2', marginLeft: 5 }}>- {item.product_name || '---'}</Text> : null}
    //                                     </View>}
    //                                 {item.level_id >= 2 ? this.plusimages(item) : null}
    //                             </TouchableOpacity>
    //                         </View>
    //                     )
    //                     }
    //                     keyExtractor={item => item.sequence_number}
    //                 />
                    

    //             </View>

    //         )
    //     }
    //     else {
    //         return null;
    //     }
    // }

    marginlevel(item){
        if(item.level_id == 1) { 
            if((item.level_id == 1 && item.child_count == 0 && item.mode == 'Collapsed') || (item.level_id == 1 && item.parent_sequence_number === null)){
                return null;

            }
            else{
                console.log("leve id 1 false")

                return wp('8%') 
            }
        }
        else if(item.level_id == 2){
            if(item.level_id == 2 && item.parent_sequence_number==null && item.receive_sub_location==null){
                console.log("leve id 2 true")
                return null
            }
            else{
                console.log("leve id 2 false")
                return wp('6%') 
                
            }
        }
        else if(item.level_id == 3 ) { 
            if(item.level_id == 3 && item.parent_sequence_number==null && item.receive_sub_location==null){
                return null
            }
            else{
                return wp('4%') 
            }
        }
        else{
            return null
        } 
    }

    async cancelJob() {
        this.refs.redirectHome.close()
        var data = {}
        data.job_type = this.state.job_detail ? this.state.job_detail.job_type : "Recieve"
        data.job_id = this.state.job_detail ?  this.state.job_detail.stockdetails_id : null
        data.location_name = this.state.locationName
        var cancelJobresponse = await APIService.execute('DELETE', APIService.URLBACKEND + 'stockTransfer/canceljob', data)
        if (cancelJobresponse.data.status_code == 200) {
            ToastAndroid.show(cancelJobresponse.data.message, ToastAndroid.LONG, 25, 50);
            this.props.navigation.navigate('Dashboard')       
        }
    }


    render() {
        console.log('scan', this.props.navigation.state.params.url, this.props.navigation.state.params.item);
        var seq = this.props.navigation.state.params.url;
        console.log('sequence', seq);
        console.log('keys', _.keys(seq));
        const fontSize = 11

        return (
            <Container style={{ flex: 1, backgroundColor: '#F1F3FD' }}>
                <Headers isHome={true} onBackHome={() => { this.refs.redirectHome.open()  }}  label={this.state.job_detail ? 'Receive Stock - ' + this.state.job_detail.stockdetails_id : 'Receive Stock'} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', paddingHorizontal: 10, paddingBottom: 10, marginBottom: 30 }}>

                            <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginVertical: hp('1%') }}>
                                <Button style={styles.buttonStyle} onPress={() => { this.props.navigation.navigate('ReceiveStockDetailsScreen', { header: this.state.job_detail ? this.state.job_detail.stockdetails_id : 'Receive Stock' }) }}>
                                    <Text style={styles.header} > + Details</Text>
                                </Button>
                                <Button onPress={() => { this.refs.modalComment.open() }} style={styles.buttonStyle}>
                                    <Text style={styles.header} > + Comment</Text>
                                </Button>
                                <Button style={styles.buttonStyle} onPress={() => { this.props.navigation.goBack() }}>
                                    <Text style={styles.header} > + Add</Text>
                                </Button>
                                <Button style={styles.buttonStyle}
                                    onPress={() => this.props.navigation.navigate('Deletebyscan', { item: seq, jobId: this.state.job_detail.stockdetails_id, jobType: this.state.job_detail.job_type, jobhistroy: this.props.navigation.state.params.jobhistroy })}>
                                    <Text style={styles.header} > - Remove</Text>
                                </Button>

                            </View>

                            <View style={{ flex: 1, paddingLeft: wp('2%'), paddingRight: wp('2%'),  marginTop: hp('1%')  }}>
                                <Text style={styles.headerBold}>Packaging</Text>
                                <View style={{ flex: 1, width: wp('88%') }}>
                                    <FlatList
                                        extraData={this.state.packaging_details}
                                        data={this.state.packaging_details}
                                        renderItem={({ item, index }) => (
                                            <View style={{ marginTop: hp('1%'), flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={styles.packagingItems} >{item.pkg_name || '---'}</Text>
                                                <Text style={styles.packagingValue} >{item.Count || '---'}</Text>
                                            </View>
                                        )} />
                                </View>
                            </View>

                            <View style={styles.line} />

                            <View style={{ flex: 1, paddingLeft: wp('2%'), paddingRight: wp('2%'),  marginTop: hp('1%')  }}>
                                <Text style={styles.headerBold}>Products</Text>
                                <View style={{ flex: 1, width: wp('88%') }}>
                                    <FlatList
                                        extraData={this.state.product_details}
                                        data={this.state.product_details}
                                        renderItem={({ item, index }) => (
                                            <View style={{ marginTop: hp('1%'), flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <Text style={styles.packagingItems} >{item.product_name || '---'}</Text>
                                                <Text style={styles.packagingValue} >{item.Count || '---'}</Text>
                                            </View>
                                        )} />
                                </View>
                            </View>
                            <View style={styles.line} />

                            <View style={{ marginTop:hp('2%'),paddingLeft: wp('2%'), 
                            }}>

                                <Text style={styles.headerBold}>Items</Text>
                                    <View style={{width:wp('91%'),marginTop:hp('2%'),}}>                             
                                    <FlatList
                                    extraData={this.state.receivedData}
                                    data={this.state.receivedData}
                                    renderItem={({ item, index }) => {
                                        var checkLevel = false;
                                        if(item.level_id >1){
                                            checkLevel = true
                                        }
                                        
                                        if (item.assignment_mapping_id) {
                                            return (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    backgroundColor: item.level_id >= 2 ? color.gradientEndColor : '#4A90E2',
                                                    shadowOpacity: 0.8,
                                                    height: wp('8%'),
                                                    shadowColor: '#CECECE',
                                                    shadowRadius: 3, elevation: 2, borderRadius: 5,
                                                    margin: wp('1%'), marginTop: wp('0.5%'), marginBottom: wp('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginVertical: hp('0.5%'), marginLeft: this.marginlevel(item)
                                                }}>
                                                    <TouchableOpacity onPress={() => this.checkLevel(item, index)} style={{
                                                        flexDirection: 'row', borderRadius: 5,
                                                        margin: wp('1%'), marginTop: wp('0.5%'), marginBottom: wp('0.5%'), justifyContent: 'flex-start', alignItems: 'center',
                                                    }} >
                                                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', margin: wp('0.5%'), marginLeft: wp('2%') }}>
                                                            <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#ffffff', justifyContent: 'flex-start',alignSelf: 'center', }}>{item.level_name} :</Text>
                                                            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5, justifyContent: 'flex-start',alignSelf: 'center', }}>{item.sequence_number || '---'}</Text>
                                                            {item.level_id == 1 ? <Text numberOfLines={1} style={{ flex:1, fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5, alignSelf: 'center', }}>- {item.product_name || '---'}</Text> : null}
                                                        </View>

                                                        {item.level_id >= 2 ? this.plusimages(item) : null}
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        }
                                        else {
                                            return (
                                                <View style={{
                                                    flexDirection: 'row',
                                                    backgroundColor: color.gradientEndColor ,
                                                    shadowOpacity: 0.8,
                                                    height: wp('8%'),
                                                    shadowColor: '#CECECE',
                                                    shadowRadius: 3, elevation: 2, borderRadius: 5,
                                                    margin: wp('1%'), marginTop: wp('0.5%'), marginBottom: wp('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginVertical: hp('0.5%')
                                                }}>
                                                    <TouchableOpacity onPress={() => this.checkLevel(item, index)} style={{
                                                        flexDirection: 'row', borderRadius: 5, marginTop: wp('0.5%'), marginBottom: wp('0.5%'), justifyContent: 'flex-start', alignItems: 'center'
                                                    }} >
                                                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: wp('0.5%'), marginLeft: wp('2%')}}>
                                                            <Text numberOfLines={1} style={{ width: wp('70%'), fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#ffffff', flex:1 }}>{item.location_name} </Text>
                                                            <Text numberOfLines={1} style={{ width: wp('10%'), fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#ffffff', justifyContent: 'flex-end', alignSelf: 'flex-end'  }}>{item.count || '0'}</Text>
                                                        </View>

                                                        {this.plusimages(item) }
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        }
                                
                                }}
                                //  keyExtractor={item => item.assignment_mapping_id}
                                />
                                </View>

                            </View>
                        </View>
                        {/* <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center', alignItems: 'center', alignContent: 'center' }}>
                            {this.renderLevelwisedata()}
                        </View> */}
                    </ScrollView>
                    <View style={{ flexDirection: 'row'}}>
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
                        <TouchableOpacity onPress={() => this.save_complete()}>
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
                            console.log("selectedItem:", selectedItem)
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
                                    placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Regular', fontSize: 20 }} onChangeText={(newValue) => this.setState({ newValue })} multiline={true} value={this.state.newValue} onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)} ></TextInput>
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
                                        <TouchableOpacity onPress={async () => { this.refs.modalComment.close() }}>
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

export default withNavigation(RecieveScanSummary);

var styles = StyleSheet.create({

    linearGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F3FD',
    },
    batchstyle: {
        paddingLeft: 6,
        flexDirection: 'row',
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: wp('75%'),
        height: wp('11%'),
        color: '#000000',
        fontSize: 14,
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
        width: wp("22%"),
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
        paddingHorizontal : wp('2%'),
        fontFamily: 'Montserrat-Regular',
    },
    packagingValue: {
        alignItems: 'flex-end',
        color: '#000000',
        fontFamily: 'Montserrat-Regular',
    },
    line: {
        marginTop: hp('3%'),
        marginBottom: hp('1%'),
        width:wp('90%'),
        justifyContent:'center',
        alignSelf:'center',
        borderBottomColor: '#DBDBDB',
        borderBottomWidth: 0.9,
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
    items: {
        marginTop: hp('0.5%'),
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        marginLeft: wp('2%'),
        fontSize: 11, color: '#ffffff'
    },
});