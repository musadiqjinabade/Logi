import React, { Component } from 'react';
import { Text, View, FlatList, StatusBar, TextInput, StyleSheet, TouchableOpacity, AsyncStorage, ToastAndroid, ActivityIndicator, BackHandler } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import { Button, Container } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import APIService from '../component/APIServices';
import Headers from '../component/Headers';
import color from '../component/color';
import Modal from 'react-native-modalbox';

const _ = require('lodash');

const resetAction = StackActions.reset({
    index: 0,
    key: null,
    actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
});

class ProductReturnScanningItemsScreen extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            focus: false,
            height: 40,
            username: '',
            newValue: '',
            progressText: 'Loading...',
            mapping_id: '',
            levels: false,
            loading: true,
            locationId: null,
            locationName: '',
            assignment_mapping: '',
            receivedList: '',
            expanded: true,
            TagsData: [],
            reasonsData: [],
            comment: ''
        }
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
        var scan = await APIService.execute('GET', APIService.URLBACKEND + APIService.getReturnSummary + '?return_id=' + this.props.navigation.state.params.item, null)
        if (scan.data.status_code !== 400) {
            var responseData = _.map(scan.data.data.location_wise, (item, index) => {
                return {
                    ...item,
                    mode: 'Collapsed',
                    sequence_number: index
                }
            })

            this.setState({ packagingDetails: scan.data.data.level_wise_count, productDetails: scan.data.data.product_wise_count, assignment_mapping: responseData, loading: false }, () => {
                if (this.state.assignment_mapping.length > 0 && this.state.assignment_mapping[0].level_id == 2) {
                    console.log("levels1[i].level_id:", this.state.assignment_mapping[0].level_id)
                    this.setState({ levels: true })
                }
            })
        }
        else {
            this.setState({ assignment_mapping: '', loading: false })
            ToastAndroid.show(scan.data.message, ToastAndroid.LONG, 25, 50);
        }

    }


    async componentDidMount() {
        var com = await AsyncStorage.getItem('comment')
        await AsyncStorage.getItem('SelectedLocation').then((value) => {
            var location = JSON.parse(value);
            this.setState({
                comment: com,
                locationId: location.id ? location.id : location.value,
                locationName: location.itemName ? location.itemName : location.label
            }, () => console.log('values', this.state.locationId, this.state.locationName))
        });
        this.focusListener = this.props.navigation.addListener('didFocus', () => {
            BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
            this.setState({ jobid: this.props.navigation.state.params.item, loading: true }, async () => {
                var tags = await AsyncStorage.getItem('Tagsdata')
                console.log("tag:", tags);
                var myArray = []
                if (tags != null) {
                    myArray = JSON.parse(tags)
                }

                //return reasons
                var reasons = await AsyncStorage.getItem('reasonsdata')
                console.log("tag:", tags);
                var reasonsArray = []
                if (reasons != null) {
                    reasonsArray = JSON.parse(reasons)
                }

                this.setState({ TagsData: myArray, reasonsData: reasonsArray })
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
        var body = {}
        body.job_id = this.props.navigation.state.params.item;
        body.tagids = this.state.TagsData != null ? this.state.TagsData : null;
        body.job_type = "Return"
        var tagAPI = await APIService.execute('POST', APIService.URLBACKEND + APIService.assignTags, body)
        console.log('end tagAPI:', tagAPI);
        await AsyncStorage.removeItem('Tagsdata');
        await AsyncStorage.removeItem('SelectedTags');


        body = {}
        body.return_id = this.props.navigation.state.params.item;
        body.comment = this.state.comment;
        body.returnTag_ids = this.state.reasonsData


        this.refs.modal6.close()
        var scan = await APIService.execute('POST', APIService.URLBACKEND + APIService.endReturnJob, body)
        AsyncStorage.setItem('comment','')
        ToastAndroid.show(scan.data.message, ToastAndroid.LONG, 25, 50);
        await AsyncStorage.removeItem('reasonsdata');
        await AsyncStorage.removeItem('Selectedreasons');
        this.setState({ loadingsave: false });
        this.props.navigation.dispatch(StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
        }))
    }


    checkLevel(item, index) {

        var responseData = _.map(this.state.assignment_mapping, (data) => {
            if (data.assignment_mapping_id == item.assignment_mapping_id) {
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
                if (x.location_id && x.count) {
                    return x
                }
                if (x.level_id < item.level_id && x.parent_sequence_number == null) {
                    return x
                }
                return x.level_id >= item.level_id
            });

            console.log('findIndex:', array)

            if (array) {
                if (item.mode == 'Collapsed') {
                    var responseData1 = _.map(array, (data, indexes) => {
                        if (data.assignment_mapping_id != item.assignment_mapping_id && data.level_id == item.level_id) {
                            return {
                                ...data,
                                mode: data.mode = 'Collapsed'
                            }
                        }
                        else if (data.assignment_mapping_id == item.assignment_mapping_id) {
                            if (item.mode == 'Collapsed') {
                                // this.expandReceivedata(item.sequence_number, indexes)
                                if (item.count) {
                                    this.expandReceivedata(item.sequence_number, indexes, item.location_id)
                                    console.log('working 1', indexes)
                                }
                                else {
                                    this.expandReceivedata(item.sequence_number, indexes, null)
                                    console.log('working 1', indexes)
                                }

                                console.log('working 1', indexes)

                            }
                            return { ...data }
                        }
                        else {
                            return { ...data }
                        }
                    })
                    this.setState({ assignment_mapping: responseData1 })
                }
                else {
                    this.setState({
                        assignment_mapping: array
                    })
                }
            }
            if (check) {
                // this.expandReceivedata(item.sequence_number, index)
                if (item.mode == 'Collapsed') {
                    if (item.count) {
                        this.expandReceivedata(item.sequence_number, index, item.location_id)
                        console.log('working 1', index)
                    }
                    else {
                        this.expandReceivedata(item.sequence_number, index, null)
                        console.log('working 1', index)
                    }
                }

            }

        })
    }

    async expandReceivedata(seqnum, index, location) {
        console.log("location : ", location)
        var url = ''
        if (location) {
            url = APIService.URLBACKEND + APIService.getReturnSummary + '?return_id=' + this.props.navigation.state.params.item + '&sequence_number=' + null + '&location_id=' + location;
        }
        else {
            url = APIService.URLBACKEND + APIService.getReturnSummary + '?return_id=' + this.props.navigation.state.params.item + '&sequence_number=' + seqnum + '&location_id=null';
        }

        var scan = await APIService.execute('GET', url, null)

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
                this.state.assignment_mapping.splice(index + 1, 0, responseData[i])
            }
        }

        var uniq = _.uniqBy(this.state.assignment_mapping, 'sequence_number')
        console.log("after uniq data:", uniq, this.state.assignment_mapping)
        console.log('receivedList expand', this.state.assignment_mapping.length, uniq.length, uniq);
        this.setState({ assignment_mapping: uniq }, () => {
            console.log("update:", this.state.assignment_mapping)
        })

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

    async cancelJob() {
        this.refs.redirectHome.open()
        var data = {}
        data.job_type = "Return"
        data.job_id = this.props.navigation.state.params.item
        data.location_name = this.state.locationName
        var cancelJobresponse = await APIService.execute('DELETE', APIService.URLBACKEND + 'stockTransfer/canceljob', data)
        console.log('cancelJobresponse', cancelJobresponse);
        if (cancelJobresponse.data.status_code == 200) {

            await AsyncStorage.setItem('comment', '')
            ToastAndroid.show(cancelJobresponse.data.message, ToastAndroid.LONG, 25, 50);
            this.props.navigation.dispatch(resetAction)
        }
    }


    render() {
        var seq = this.props.navigation.state.params.url;

        const fontSize = 11

        return (
            <Container style={{ flex: 1, backgroundColor: '#F1F3FD' }}>
                <Headers onBackHome={() => { this.refs.redirectHome.open() }} isHome={true} label={'Product Return - ' + this.props.navigation.state.params.item} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <ScrollView style={{ flex: 1 }}>
                        <View style={{ flex: 1, flexDirection: 'column', }}>
                            <View style={{ paddingLeft: wp('2%'), paddingRight: wp('2%'), justifyContent: 'space-between', flexDirection: 'row', marginTop: hp('1%') }}>
                                <Button style={styles.buttonStyle} onPress={() => { this.props.navigation.navigate('ProductReturnScanningDetailScreen', { item: this.props.navigation.state.params.item }) }}>
                                    <Text style={styles.header} >+ Details</Text>
                                </Button>
                                <Button onPress={() => { this.refs.modalComment.open() }} style={styles.buttonStyle}>
                                    <Text style={styles.header} >+ Comment</Text>
                                </Button>
                                <Button style={styles.buttonStyle} onPress={() => { this.props.navigation.goBack() }}>
                                    <Text style={styles.header} >+ Add</Text>
                                </Button>
                                <Button style={styles.buttonStyle}
                                    onPress={() => this.state.assignment_mapping.length === 0 ? alert("There is no item to delete.") : this.props.navigation.navigate('Deletebyscan', { item: seq, jobId: this.props.navigation.state.params.item, jobType: "Return", jobhistroy: this.props.navigation.state.params.jobhistroy })}>
                                    <Text style={styles.header} >- Remove</Text>
                                </Button>

                            </View>

                            <View style={styles.line} />

                            <View style={{ paddingLeft: wp('2%'), paddingRight: wp('2%') }}>
                                <View style={{ marginTop: hp('1%') }} />
                                <Text style={styles.headerBold}>Packaging</Text>

                                <FlatList
                                    extraData={this.state.packagingDetails}
                                    data={this.state.packagingDetails}
                                    renderItem={({ item, index }) => (
                                        <View>
                                            <View style={{ marginTop: hp('1%'), flex: 1, flexDirection: 'row' }}>
                                                <Text style={styles.packagingItems} >{item.level_name}</Text>
                                                <Text style={styles.packagingValue} >{item.level_count}</Text>
                                            </View>
                                        </View>
                                    )}
                                //  keyExtractor={item => item.assignment_mapping_id}
                                />
                            </View>


                            <View style={styles.line} />
                            {/* <View style={[styles.line, { marginTop: hp('2%') }]} /> */}


                            <View style={{ paddingLeft: wp('2%'), paddingRight: wp('2%') }}>
                                <View style={{ marginTop: hp('1%') }} />
                                <Text style={styles.headerBold}>Products</Text>

                                <FlatList
                                    extraData={this.state.productDetails}
                                    data={this.state.productDetails}
                                    renderItem={({ item, index }) => (
                                        <View>
                                            <View style={{ marginTop: hp('1%'), flex: 1, flexDirection: 'row' }}>
                                                <Text style={styles.packagingItems} >{item.product_name}</Text>
                                                <Text style={styles.packagingValue} >{item.product_count}</Text>
                                            </View>
                                        </View>
                                    )}
                                //  keyExtractor={item => item.assignment_mapping_id}
                                />
                            </View>
                            <View style={styles.line} />

                            <View style={{
                                flex: 1, marginTop: hp('2%'), paddingLeft: wp('2%'), paddingRight: wp('2%')
                            }}>

                                <Text style={styles.headerBold}>Items</Text>
                                <View style={{ marginTop: hp('2%') }}>
                                    <FlatList
                                        extraData={this.state.assignment_mapping}
                                        data={this.state.assignment_mapping}
                                        renderItem={({ item, index }) => {
                                            if (item.assignment_mapping_id) {
                                                return (
                                                    <View style={{

                                                        flex: 1, flexDirection: 'row',
                                                        backgroundColor: item.level_id >= 2 ? color.gradientStartColor : '#4A90E2',
                                                        shadowOpacity: 0.8,
                                                        height: wp('8%'),
                                                        shadowColor: '#CECECE',
                                                        shadowRadius: 3, elevation: 2, borderRadius: 5,
                                                        margin: wp('1%'), marginTop: wp('0.5%'), marginBottom: wp('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginVertical: hp('0.5%'), marginLeft: item.child_count === 0 && item.mode === "Collapsed" && item.level_id != 1 ? null : item.level_id == 1 ? wp('8%') : item.level_id == 2 ? wp('6%') : item.level_id == 3 ? wp('4%') : null
                                                    }}>
                                                        {
                                                            item.child_count != 0 ?
                                                                <TouchableOpacity onPress={() => this.checkLevel(item, index)} style={{
                                                                    flex: 1, flexDirection: 'row', borderRadius: 5,
                                                                    margin: wp('1%'), marginTop: wp('0.5%'), marginBottom: wp('0.5%'), justifyContent: 'flex-start', alignItems: 'center',
                                                                }} >
                                                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', margin: wp('0.5%'), marginLeft: wp('2%') }}>
                                                                        <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#ffffff' }}>{item.level_name} :</Text>
                                                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5 }}>{item.sequence_number || '---'}</Text>
                                                                        {item.level_id == 1 ? <Text numberOfLines={1} style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5 }}>- {item.product_name || '---'}</Text> : null}
                                                                        {item.ishighlighted ? <SvgUri width="14" height="12" fill="#FFFFFF" svgXmlData={svgImages.warningflag} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', margin: wp('1%') }} /> : null}
                                                                    </View>

                                                                    {item.level_id >= 2 ? item.child_count === 0 ? null : this.plusimages(item) : null}
                                                                </TouchableOpacity> : <View style={{
                                                                    flex: 1, flexDirection: 'row', borderRadius: 5,
                                                                    margin: wp('1%'), marginTop: wp('0.5%'), marginBottom: wp('0.5%'), justifyContent: 'flex-start', alignItems: 'center',
                                                                }} >
                                                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', margin: wp('0.5%'), marginLeft: wp('2%') }}>
                                                                        <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#ffffff',justifyContent: 'flex-start',alignSelf: 'center', }}>{item.level_name} :</Text>
                                                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5, justifyContent: 'flex-start',alignSelf: 'center', }}>{item.sequence_number || '---'}</Text>
                                                                        {item.level_id == 1 ? <Text numberOfLines={1} style={{flex:1, fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#ffffff', marginLeft: 5,alignSelf: 'center', }}>- {item.product_name || '---'}</Text> : null}
                                                                        {item.ishighlighted ? <SvgUri width="14" height="12" fill="#FFFFFF" svgXmlData={svgImages.warningflag} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'center', margin: wp('1%') }} /> : null}
                                                                    </View>

                                                                    {item.level_id >= 2 ? item.child_count === 0 ? null : this.plusimages(item) : null}
                                                                </View>
                                                        }

                                                    </View>
                                                )
                                            }
                                            else {
                                                return (
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        backgroundColor: color.gradientStartColor,
                                                        shadowOpacity: 0.8,
                                                        height: wp('8%'),
                                                        shadowColor: '#CECECE',
                                                        shadowRadius: 3, elevation: 2, borderRadius: 5,
                                                        margin: wp('1%'), marginTop: wp('0.5%'), marginBottom: wp('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginVertical: hp('0.5%')
                                                    }}>
                                                        <TouchableOpacity onPress={() => this.checkLevel(item, index)} style={{
                                                            flexDirection: 'row', borderRadius: 5, marginTop: wp('0.5%'), marginBottom: wp('0.5%'), justifyContent: 'flex-start', alignItems: 'center'
                                                        }} >
                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', margin: wp('0.5%'), marginLeft: wp('2%') }}>
                                                                <Text style={{ width: wp('70%'), fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#ffffff' }}>{item.location_name} </Text>
                                                                <Text style={{ width: wp('10%'),fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#ffffff', justifyContent: 'flex-end', alignSelf: 'flex-end' }}>{item.count || '0'}</Text>
                                                            </View>


                                                            {this.plusimages(item)}
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

                    </ScrollView>
                    <View style={{ justifyContent: 'flex-end', alignSelf: 'center', flexDirection: 'row', marginTop: wp('5%') }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
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
                        <TouchableOpacity onPress={() => this.state.assignment_mapping.length === 0 ? alert("There is no item. So this job cannot finish.") : this.save_complete()}>
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
                                                <Text style={styles.btntext}>{'Please Wait...'}</Text>
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
                <Modal style={[styles.modal, styles.modal1]} position={"center"} ref={"redirectHome"} swipeArea={20}
                    backdropPressToClose={true}  >
                    <ScrollView>
                        <View style={{ /*height: wp('65%'),*/ width: wp('65%'), justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 10 }} >
                            <TouchableOpacity style={{ width: wp('10%'), height: hp('5%'), justifyContent: 'center', alignSelf: 'flex-end', alignItems: 'flex-end' }} onPress={() => { this.refs.redirectHome.close() }} >
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
                                        this.props.navigation.dispatch(resetAction)
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
                                    value={this.state.comment}
                                    onChangeText={comment => {
                                        this.setState({ comment }
                                            , async () => {
                                                await AsyncStorage.setItem('comment', '')
                                                await AsyncStorage.setItem('comment', comment)
                                            })
                                    }}
                                    placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Regular', fontSize: 20 }} onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)} ></TextInput>

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
                {this.renderModalContent()}
            </Container>

        )

    }
}

export default withNavigation(ProductReturnScanningItemsScreen);

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
        fontSize: wp('5%'),
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'center',
        alignSelf: 'center',
        color: '#FFFFFF'
    },
    overlay: {
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
        paddingHorizontal: wp('2%'),
        flex: 1, justifyContent: 'center', alignItems: 'flex-start',
        color: '#000000',
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
        fontSize: wp('3.5%'),
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    buttonCancel: {
        fontSize: wp('5%'),
        color: '#000000',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
});