import React, { Component } from 'react';
import { Text, View, KeyboardAvoidingView, FlatList, StatusBar, TextInput, StyleSheet, Image, Animated, TouchableOpacity, Alert, AsyncStorage, ToastAndroid, Dimensions, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Button, Container, Right, Title, Toast, Header, CheckBox, Body, ListItem, Left, Icon } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import svgImages from '../Images/images';
import Modal from 'react-native-modalbox';
import APIService from '../component/APIServices';
import Headers from '../component/Headers';
const _ = require('lodash');

const truck = [
    {
        id: 1,
        Created_date: "24 Jul 2019, 12:50",
        Scanned_at: "25 Aug 2018, 17:50",
        Sequence_No: "PP123445454",
        Pallet: 13,
        Shipper: 20,
        SKU_Count: 50,
    },
    {
        id: 2,
        Created_date: "25 Jul 2019, 09:50",
        Scanned_at: "15 Aug 2018, 10:05",
        Sequence_No: "PP123396494",
        Pallet: 23,
        Shipper: 60,
        SKU_Count: 150,
    },
    {
        id: 3,
        Created_date: "08 Aug 2019, 19:50",
        Scanned_at: "12 Aug 2018, 08:05",
        Sequence_No: "PP136407595",
        Pallet: 23,
        Shipper: 60,
        SKU_Count: 150,
    },
    {
        id: 4,
        Created_date: "09 Aug 2019, 19:50",
        Scanned_at: "22 Aug 2018, 08:05",
        Sequence_No: "PP136407595",
        Pallet: 23,
        Shipper: 60,
        SKU_Count: 90,
    },
    {
        id: 5,
        Created_date: "08 Aug 2019, 19:50",
        Scanned_at: "13 Aug 2018, 08:05",
        Sequence_No: "PP136407595",
        Pallet: 3,
        Shipper: 10,
        SKU_Count: 30,
    },
    {
        id: 6,
        Created_date: "08 Aug 2019, 19:50",
        Scanned_at: "19 Aug 2018, 08:05",
        Sequence_No: "PP136407595",
        Pallet: 77,
        Shipper: 33,
        SKU_Count: 250,
    },
    {
        id: 7,
        Created_date: "08 Aug 2019, 19:50",
        Scanned_at: "12 Aug 2018, 08:05",
        Sequence_No: "PP136407595",
        Pallet: 19,
        Shipper: 89,
        SKU_Count: 203,
    },
    {
        id: 8,
        Created_date: "24 Jul 2019, 12:50",
        Scanned_at: "25 Aug 2018, 17:50",
        Sequence_No: "PP123445454",
        Pallet: 23,
        Shipper: 60,
        SKU_Count: 150,
    },

];

const Pallet = [
    {
        id: 1,
        Created_date: "24 Jul 2019, 12:50",
        Scanned_at: "25 Aug 2018, 17:50",
        Sequence_No: "PP123445454",
        Shipper: 20,
        SKU_Count: 50,
    },
    {
        id: 2,
        Created_date: "25 Jul 2019, 09:50",
        Scanned_at: "15 Aug 2018, 10:05",
        Sequence_No: "PP123396494",
        Shipper: 70,
        SKU_Count: 60,

    },
    {
        id: 3,
        Created_date: "08 Aug 2019, 19:50",
        Scanned_at: "12 Aug 2018, 08:05",
        Sequence_No: "PP136407595",
        Shipper: 70,
        SKU_Count: 110,


    },
    {
        id: 4,
        Created_date: "09 Aug 2019, 19:50",
        Scanned_at: "22 Aug 2018, 08:05",
        Sequence_No: "PP136407595",
        Shipper: 10,
        SKU_Count: 50,
    },
    {
        id: 5,
        Created_date: "08 Aug 2019, 19:50",
        Scanned_at: "13 Aug 2018, 08:05",
        Sequence_No: "PP136407595",
        Shipper: 50,
        SKU_Count: 70,
    },
    {
        id: 6,
        Created_date: "24 Jul 2019, 12:50",
        Scanned_at: "25 Aug 2018, 17:50",
        Sequence_No: "PP123445454",
        Shipper: 20,
        SKU_Count: 50,
    },
    {
        id: 7,
        Created_date: "25 Jul 2019, 09:50",
        Scanned_at: "15 Aug 2018, 10:05",
        Sequence_No: "PP123396494",
        Shipper: 70,
        SKU_Count: 60,

    },
    {
        id: 8,
        Created_date: "08 Aug 2019, 19:50",
        Scanned_at: "12 Aug 2018, 08:05",
        Sequence_No: "PP136407595",
        Shipper: 70,
        SKU_Count: 110,


    },
    {
        id: 9,
        Created_date: "09 Aug 2019, 19:50",
        Scanned_at: "22 Aug 2018, 08:05",
        Sequence_No: "PP136407595",
        Shipper: 10,
        SKU_Count: 50,
    },
    {
        id: 10,
        Created_date: "08 Aug 2019, 19:50",
        Scanned_at: "13 Aug 2018, 08:05",
        Sequence_No: "PP136407595",
        Shipper: 50,
        SKU_Count: 70,
    }

];

const Shipper = [
    {
        id: 1,
        Created_date: "24 Jul 2019, 12:50",
        Scanned_at: "25 Aug 2018, 17:50",
        Sequence_No: "PP123445454",
        SKU_Count: 50,
    },
    {
        id: 2,
        Created_date: "25 Jul 2019, 09:50",
        Scanned_at: "15 Aug 2018, 10:05",
        Sequence_No: "PP123396494",
        SKU_Count: 60,

    },
    {
        id: 3,
        Created_date: "08 Aug 2019, 19:50",
        scanned_at: "12 Aug 2018, 08:05",
        Sequence_No: "PP136407595",
        SKU_Count: 110,


    },
    {
        id: 4,
        manu_date: "09 Aug 2019, 19:50",
        Scanned_at: "22 Aug 2018, 08:05",
        Sequence_No: "PP136407595",
        SKU_Count: 50,
    },
    {
        id: 5,
        Created_date: "08 Aug 2019, 19:50",
        Scanned_at: "13 Aug 2018, 08:05",
        Sequence_No: "PP136407595",
        SKU_Count: 70,
    }

];


const SKU = [
    {
        id: 1,
        manu_date: "24 Jul 2019, 12:50",
        scanned_at: "25 Aug 2018, 17:50",
        sequence_number: "PP123445454",
        Shipper: 20,
        SKU_Count: 50,
    },
    {
        id: 2,
        manu_date: "25 Jul 2019, 09:50",
        scanned_at: "15 Aug 2018, 10:05",
        sequence_number: "PP123396494",
        Shipper: 70,
        SKU_Count: 60,

    },
    {
        id: 3,
        manu_date: "08 Aug 2019, 19:50",
        scanned_at: "12 Aug 2018, 08:05",
        sequence_number: "PP136407595",
        Shipper: 70,
        SKU_Count: 110,


    }
];

class Truck extends Component {
    static navigationOptions = { header: null }

    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            data: '',
            truck_data: truck,
            pallet_data: Pallet,
            shipper_data: Shipper,
            SKU_data: SKU,
            Truck: false,
            Pallet: false,
            Shipper: false,
            SKU_Count: false,
            model: null,
            levelInfo: '',
            jobHistory: '',
            level: 0,
            loading: false,
            seqnum: {},
            expanded:true
        }

    }

    async componentDidMount() {
        console.log("prop data:", this.props.navigation.state.params.item)
        this.setState({ loading: true })
        await AsyncStorage.removeItem('Levelwiseseqnum');
        var jobId = this.props.navigation.state.params.item.job_type == 'Assignment' || 'Mapping' ? this.props.navigation.state.params.item.job_id : this.props.navigation.state.params.item.stockdetails_id
        var seqNum = this.props.navigation.state.params.item.sequence_number ? this.props.navigation.state.params.item.sequence_number : null
        var historyresponse = await APIService.execute('GET', APIService.URLBACKEND + 'assignment/viewjobhistory?sequence_number=' + seqNum + '&job_type=' + this.props.navigation.state.params.item.job_type + '&job_id=' + job_id, null)
        console.log('historyresponse', historyresponse != null && historyresponse.data.data.getparentlevels ? historyresponse.data.data.getparentlevels.sequence_number : null);
        var levelresponse = await APIService.execute('GET', APIService.URLBACKEND +'genrateId/getlevel', null)
        console.log('levelresponse', levelresponse.data.data, levelresponse.data.data[0].itemName);
        var parentlevel;
        if (this.props.navigation.state.params.item.job_type == 'Assignment') {
            parentlevel = _.filter(levelresponse.data.data, (item) => { return item.itemName === historyresponse.data.data.level_name });
            console.log('assignmentLevel', parentlevel, historyresponse.data.data.level_name);
        }
        else {
            parentlevel = _.chunk(levelresponse.data.data, historyresponse.data.data.getparentlevels.length > 0 ? historyresponse.data.data.getparentlevels[0].level_id : null);
            console.log('parentlevel', parentlevel, this.props.navigation.state.params.item.job_type == 'Assignment' ? historyresponse.data.data.job_details[0].parent_level_id : historyresponse.data.data.getparentlevels.length > 0 ? historyresponse.data.data.getparentlevels[0].parent_level_id : null);
            var invertedLvelData = [];
            console.log('parent', parentlevel[0].length, parentlevel[0])
            var levels = parentlevel[0];
            for (var i = parentlevel[0].length - 1; i >= 0; i--) {
                invertedLvelData.push(levels[i]);
            }
            console.log('invertedLvelData', invertedLvelData);

        }

        this.setState({ data: this.props.navigation.state.params.item, jobHistory: this.props.navigation.state.params.item.job_type == 'Assignment' ? historyresponse.data.data.job_details : historyresponse.data.data.getparentlevels, levelInfo: this.props.navigation.state.params.item.job_type == 'Assignment' ? parentlevel : invertedLvelData, loading: false }, () => {
            console.log('jobhistory', this.state.jobHistory)

            let wait = new Promise((resolve) => setTimeout(resolve, 500));
            this.state.levelInfo != null ?
                wait.then(() => {
                    this.flatListRef.scrollToIndex({ index: this.state.level, animated: true });
                }) : null
        })
    }

    modeldata(item) {
        this.setState({ model: item }, () => {
            this.refs.modal6.open()
        })
    }

    async loadData(seqnum, index) {
        this.setState({ level: this.state.levelInfo.length - 1 == this.state.level ? this.state.level : this.state.level + 1, seqnum: { ...this.state.seqnum, [this.state.level]: seqnum } }, () => console.log('level num', this.state.seqnum, this.state.level, seqnum));

        this.setState({ loading: true })
        var result = await APIService.execute('GET', APIService.URLBACKEND + 'assignment/viewjobhistory?sequence_number=' + seqnum + '&job_type=' + this.props.navigation.state.params.item.job_type + '&job_id=' + this.props.navigation.state.params.item.job_id, null)
        console.log('res', result);
        this.setState({
            // level: this.state.levelInfo.length - 1 == this.state.level ? this.state.level : this.state.level + 1,
            jobHistory: result.data.data.length > 0 ? result.data.data : [],
            loading: false
        },
            () => {
                let wait = new Promise((resolve) => setTimeout(resolve, 500));
                wait.then(() => {
                    this.flatListRef.scrollToIndex({ index: this.state.level, animated: true });
                });
            }
        )
    }

    async loadAnotherData(seq) {
        this.setState({ loading: true })
        var result = await APIService.execute('GET', APIService.URLBACKEND + 'assignment/viewjobhistory?sequence_number=' + seq + '&job_type=' + this.props.navigation.state.params.item.job_type + '&job_id=' + this.props.navigation.state.params.item.job_id, null)
        console.log('res', result);
        this.setState({
            // level: this.state.levelInfo.length - 1 == this.state.level ? this.state.level : this.state.level + 1,
            jobHistory: result.data.data.length > 0 ? result.data.data : [],
            loading: false
        },
            () => {
                let wait = new Promise((resolve) => setTimeout(resolve, 500));
                wait.then(() => {
                    this.flatListRef.scrollToIndex({ index: this.state.level, animated: true });
                });
            }
        )
    }

    renderdata() {
        console.log('inside renderdata');
        const fontSize = 11;
        if (this.state.loading) {
            return (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', paddingTop: 50 }}>
                    <ActivityIndicator size={'large'} color='#1D3567' />
                </View>
            )
        }
        else if (this.state.jobHistory.length > 0) {
            return (
                <View>
                    <FlatList
                        data={this.state.jobHistory != null ? this.state.jobHistory : []}
                        renderItem={({ item, index }) => (
                            <View>
                                <TouchableOpacity
                                    onPress={() => this.modeldata(item)}
                                    style={{
                                        flex: 1, width: widthPercentageToDP('94%'), shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        marginBottom: widthPercentageToDP('4%'),
                                        marginHorizontal: widthPercentageToDP('1%'),
                                        paddingTop: widthPercentageToDP('2%'),
                                        paddingBottom: widthPercentageToDP('2%'),
                                        shadowRadius: 3,
                                        borderRadius: 5,
                                        flexDirection: 'row',
                                        elevation: 4,
                                        backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'center'
                                    }} >
                                    <View style={{ width: widthPercentageToDP('76%'), flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                                        <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#FFFFFF', '#FFFFFF']} style={{ flex: 1, borderRadius: 3, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: widthPercentageToDP('76%'), padding: widthPercentageToDP('2%') }}>
                                            <Text style={{ justifyContent: 'flex-start', alignItems: 'flex-start', color: '#1D3567', fontFamily: 'Montserrat-Bold' }}>Sequence No: {item.sequence_number || "---"} </Text>
                                        </LinearGradient>
                                        <View style={{ width: widthPercentageToDP('76%'), justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: widthPercentageToDP('2%'), paddingLeft: widthPercentageToDP('1%'), }}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                                <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                            </View>
                                            <View style={{ flex: 1, width: widthPercentageToDP('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: widthPercentageToDP('1%') }}>
                                                <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'center' }}>Created at: </Text>
                                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'center' }}>{item.manu_date || "---"}</Text>
                                            </View>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                                <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                            </View>
                                            <View style={{ flex: 1, width: widthPercentageToDP('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: widthPercentageToDP('1%') }}>

                                                <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'center' }}>Scanned at: </Text>
                                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'center' }}>{item.scanned_at || "---"}</Text>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ flex: 1, flexDirection: 'column', width: widthPercentageToDP('18%') }}>
                                        <TouchableOpacity onPress={() => item.sequence_number ? this.loadData(item.sequence_number, index) : console.log('no seq num')} style={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                                            <SvgUri width="34" height="34" fill="#1D3567" svgXmlData={svgImages.right} style={{ resizeMode: 'contain', justifyContent: 'flex-end', alignItems: 'flex-end', marginTop: widthPercentageToDP('4%'), marginBottom: widthPercentageToDP('4%'), marginLeft: widthPercentageToDP('3%') }} />
                                        </TouchableOpacity>
                                    </View>


                                </TouchableOpacity>
                            </View>

                        )}
                        keyExtractor={item => item.assignment_mapping_id}
                    />
                </View >)
        }
        else {
            return (
                // <View
                //     style={{
                //         flex: 1, shadowOffset: { width: 0, height: 2 },
                //         shadowOpacity: 0.8,
                //         shadowColor: '#CECECE',
                //         shadowRadius: 3,
                //         borderRadius: 5,
                //         padding: widthPercentageToDP('2%'),
                //         marginLeft: widthPercentageToDP('1%'),
                //         marginTop: widthPercentageToDP('2%'),
                //         marginRight: widthPercentageToDP('1%'),
                //         marginBottom: widthPercentageToDP('4%'),
                //         width: widthPercentageToDP('93%'),
                //         height: widthPercentageToDP('40%'),
                //         flexDirection: 'column',
                //         elevation: 4,
                //         backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center',
                //     }}>

                <View style={{ justifyContent: 'center', paddingTop: 30, padding: 20, marginBottom: 10, marginLeft: 10, marginRight: 10, backgroundColor: 'white', borderRadius: 5, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowColor: '#CECECE', shadowRadius: 3, }}>
                    <Text style={{ textAlign: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: fontSize }}>No job history details available</Text>
                </View>
                // </View>
            )
        }
    }

    TruckData() {
        this.setState({ Truck: true, Pallet: false, Shipper: false })
    }

    Palletdata() {
        this.setState({ Truck: false, Pallet: true, Shipper: false })
    }

    ShipperData() {
        this.setState({ Truck: false, Pallet: false, Shipper: true }, () => {
            console.log("working shipper:");
        })

    }

    SKU_Count() {
        this.setState({ Truck: false, Pallet: false, Shipper: false, }, () => {
            console.log("working SKU count:");
        })
    }

    conformationNo() {
        this.setState({ loading: false });
        this.refs.modal6.close();
    }

    conformation() {
        this.setState({ loading: false });
        this.refs.modal6.close();
        this.props.navigation.navigate('FirstandLast');
    }

    goIndex = () => {

        this.flatList_Ref.scrollToIndex({ animated: true, index: 2 });

    };

    getItemLayout = (data, index) => (
        { length: 50, offset: 50 * index, index }
    )

    scrollToIndex = () => {
        let randomIndex = this.state.levelInfo.length;
        console.log('randomindex', randomIndex);
        this.flatListRef.scrollToIndex({ animated: true, index: randomIndex });
    }


    render() {
        const { selectedItems, height, newValue } = this.state
        let newStyle = {
            height
        }
        const fontSize = 11

        const tableData = [['Lenovo XLS12', '50/25', '1'],
        ['LG X 1234', '36/50', '2'],
        ['Redmi MI A', '40/30', '1'],
        ['ONIDA MG12', '12/46', '3'],
        ['OPPO SM89', '35/44', '2'],
        ['IphoneX', '99/88', '2']]
        console.log("data:", this.state.data)
        console.log('level', this.state.level);
        return (
            <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                <Headers  label={this.state.data.Job_title || '---'} onBack={() => { this.props.navigation.goBack()}}  expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <FlatList
                            data={this.state.levelInfo}
                            extraData={this.state.level}
                            ref={(ref) => { this.flatListRef = ref; }}
                            horizontal={true}
                            renderItem={({ item, index }) => (

                                <View style={{ flexDirection: 'row', backgroundColor: '#F1F3FD', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        onPress={() => this.loadAnotherData(this.state.seqnum[index - 1])}
                                        style={{ flex: 1, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.8, shadowColor: '#CECECE', shadowRadius: 3, borderRadius: 5, padding: widthPercentageToDP('4%'), marginLeft: widthPercentageToDP('1%'), marginTop: widthPercentageToDP('4%'), marginRight: widthPercentageToDP('1%'), marginBottom: widthPercentageToDP('4%'), flexDirection: 'column', elevation: 4, backgroundColor: this.state.level == index ? '#65CA8F' : '#FFFFFF', justifyContent: 'center', alignItems: 'center', height: widthPercentageToDP('15%') }}>
                                        <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'Montserrat-Bold', color: '#1D3567' }}>{item.itemName}</Text>
                                        <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'Montserrat-Regular', fontSize: 9, color: '#1D3567' }}>Seq no: {this.state.seqnum[this.state.level]}</Text>
                                    </TouchableOpacity>
                                    {
                                        index == this.state.levelInfo.length ? null : <SvgUri width="20" height="13" fill="#000000" svgXmlData={svgImages.right_arrow} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', margin: widthPercentageToDP('2%') }} />
                                    }
                                </View>
                                // </ScrollView>
                            )}
                            keyExtractor={item => item.id} />

                    </View>
                    {
                        this.renderdata()
                    }

                    <Modal style={this.state.Pallet ? [styles.modal, styles.modal2] : this.state.Shipper ? [styles.modalbottom, styles.modal3] : [styles.modal, styles.modal1]} position={"bottom"} ref={"modal6"} swipeArea={20}
                        backdropPressToClose={true}  >
                        <ScrollView>
                            <View style={{ height: this.state.Pallet ? widthPercentageToDP('80%') : this.state.Shipper ? widthPercentageToDP('75%') : widthPercentageToDP('85%'), width: widthPercentageToDP('94%'), flexDirection: 'column', justifyContent: 'center', backgroundColor: '#fff', borderRadius: 10 }} >
                                {this.state.Truck ?
                                    <View>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', margin: widthPercentageToDP('4%'), paddingTop: widthPercentageToDP('4%') }}>
                                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: widthPercentageToDP('6%') }}>
                                                <Text style={{ justifyContent: 'center', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold' }}>{"Sequence No:"}{this.state.model ? this.state.model.Sequence_No : "---"}</Text>
                                                <Text style={{ justifyContent: 'center', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular' }}>{"Level:Truck"}</Text>
                                            </View>
                                        </View>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: widthPercentageToDP('4%') }}>

                                            <TouchableOpacity
                                                // onContentSizeChange={(e) => this.updateSizeMRP(e.nativeEvent.contentSize.height)}
                                                style={{
                                                    width: widthPercentageToDP('80%'),
                                                    margin: widthPercentageToDP('2%'),
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.8,
                                                    shadowColor: '#CECECE',
                                                    shadowRadius: 3,
                                                    elevation: 4,
                                                    backgroundColor: '#FFFFFF',
                                                    flexDirection: 'row',
                                                    borderRadius: 5, justifyContent: 'flex-start', alignItems: 'center', padding: widthPercentageToDP('2%')
                                                }} >
                                                <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                                <Text style={styles.selectproducts}>{"Pallet:"}{this.state.model ? this.state.model.Pallet : "---"}</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                // onContentSizeChange={(e) => this.updateSizeMRP(e.nativeEvent.contentSize.height)}
                                                style={{
                                                    width: widthPercentageToDP('80%'),
                                                    margin: widthPercentageToDP('2%'),
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.8,
                                                    shadowColor: '#CECECE',
                                                    shadowRadius: 3,
                                                    elevation: 4,
                                                    backgroundColor: '#FFFFFF',
                                                    flexDirection: 'row',
                                                    borderRadius: 5, justifyContent: 'flex-start', alignItems: 'center', padding: widthPercentageToDP('2%')
                                                }} >
                                                <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                                <Text style={styles.selectproducts}>{"Shipper:"}{this.state.model ? this.state.model.Shipper : "---"}</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                // onContentSizeChange={(e) => this.updateSizeMRP(e.nativeEvent.contentSize.height)}
                                                style={{
                                                    width: widthPercentageToDP('80%'),
                                                    margin: widthPercentageToDP('2%'),
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.8,
                                                    shadowColor: '#CECECE',
                                                    shadowRadius: 3,
                                                    elevation: 4,
                                                    backgroundColor: '#FFFFFF',
                                                    flexDirection: 'row',
                                                    borderRadius: 5, justifyContent: 'flex-start', alignItems: 'center', padding: widthPercentageToDP('2%')
                                                }} >
                                                <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                                <Text style={styles.selectproducts}>{"SKU Count:"}{this.state.model ? this.state.model.SKU_Count : "---"}</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                    : null}

                                {this.state.Pallet ?
                                    <View>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', margin: widthPercentageToDP('4%'), paddingTop: widthPercentageToDP('4%') }}>
                                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: widthPercentageToDP('6%') }}>
                                                <Text style={{ justifyContent: 'center', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold' }}>{"Sequence No:"}{this.state.model ? this.state.model.Sequence_No : "---"}</Text>
                                                <Text style={{ justifyContent: 'center', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular' }}>{"Level:Pallet"}</Text>
                                            </View>
                                        </View>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: widthPercentageToDP('4%') }}>


                                            <TouchableOpacity
                                                // onContentSizeChange={(e) => this.updateSizeMRP(e.nativeEvent.contentSize.height)}
                                                style={{
                                                    width: widthPercentageToDP('80%'),
                                                    margin: widthPercentageToDP('2%'),
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.8,
                                                    shadowColor: '#CECECE',
                                                    shadowRadius: 3,
                                                    elevation: 4,
                                                    backgroundColor: '#FFFFFF',
                                                    flexDirection: 'row',
                                                    borderRadius: 5, justifyContent: 'flex-start', alignItems: 'center', padding: widthPercentageToDP('2%')
                                                }} >
                                                <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                                <Text style={styles.selectproducts}>{"Shipper:"}{this.state.model ? this.state.model.Shipper : "---"}</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                // onContentSizeChange={(e) => this.updateSizeMRP(e.nativeEvent.contentSize.height)}
                                                style={{
                                                    width: widthPercentageToDP('80%'),
                                                    margin: widthPercentageToDP('2%'),
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.8,
                                                    shadowColor: '#CECECE',
                                                    shadowRadius: 3,
                                                    elevation: 4,
                                                    backgroundColor: '#FFFFFF',
                                                    flexDirection: 'row',
                                                    borderRadius: 5, justifyContent: 'flex-start', alignItems: 'center', padding: widthPercentageToDP('2%')
                                                }} >
                                                <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                                <Text style={styles.selectproducts}>{"SKU Count:"}{this.state.model ? this.state.model.SKU_Count : "---"}</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                    : null}


                                {this.state.Shipper ?
                                    <View>
                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', margin: widthPercentageToDP('4%'), paddingTop: widthPercentageToDP('4%') }}>
                                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: widthPercentageToDP('6%') }}>
                                                <Text style={{ justifyContent: 'center', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold' }}>{"Sequence No:"}{this.state.model ? this.state.model.Sequence_No : "---"}</Text>
                                                <Text style={{ justifyContent: 'center', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular' }}>{"Level:Shipper"}</Text>
                                            </View>
                                        </View>
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: widthPercentageToDP('4%') }}>

                                            <TouchableOpacity
                                                // onContentSizeChange={(e) => this.updateSizeMRP(e.nativeEvent.contentSize.height)}
                                                style={{
                                                    width: widthPercentageToDP('80%'),
                                                    margin: widthPercentageToDP('2%'),
                                                    shadowOffset: { width: 0, height: 2 },
                                                    shadowOpacity: 0.8,
                                                    shadowColor: '#CECECE',
                                                    shadowRadius: 3,
                                                    elevation: 4,
                                                    backgroundColor: '#FFFFFF',
                                                    flexDirection: 'row',
                                                    borderRadius: 5, justifyContent: 'flex-start', alignItems: 'center', padding: widthPercentageToDP('2%')
                                                }} >
                                                <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                                <Text style={styles.selectproducts}>{"SKU Count:"}{this.state.model ? this.state.model.SKU_Count : "---"}</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                    : null}


                                {/* {this.state.SKU_Count?<View>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF', margin: widthPercentageToDP('4%'),paddingTop:widthPercentageToDP('4%') }}>
                                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop:widthPercentageToDP('6%') }}>
                                            <Text style={{ justifyContent: 'center', alignItems: 'center',color: '#1D3567', fontFamily: 'Montserrat-Bold' }}>{"Sequence No:"}{this.state.model?this.state.model.Sequence_No : "---"}</Text>
                                            <Text style={{ justifyContent: 'center', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular' }}>{"Level:SKU Count"}</Text>
                                        </View>
                                    </View>
                                <View style={{justifyContent: 'center', alignItems: 'center',marginTop: widthPercentageToDP('4%')}}>

                                <TouchableOpacity
                                    // onContentSizeChange={(e) => this.updateSizeMRP(e.nativeEvent.contentSize.height)}
                                    style={{
                                        width: widthPercentageToDP('80%'),
                                        margin: widthPercentageToDP('2%'),
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        shadowRadius: 3,
                                        elevation: 4,
                                        backgroundColor: '#FFFFFF',
                                        flexDirection: 'row',
                                        borderRadius: 5, justifyContent: 'flex-start', alignItems: 'center', padding: widthPercentageToDP('2%')
                                    }} >
                                    <SvgUri width="22" height="12" svgXmlData={svgImages.checkboxgreen} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                                    <Text style={styles.selectproducts}>{"SKU Count:"}{this.state.model?this.state.model.SKU_Count : "---"}</Text>
                                </TouchableOpacity>
                                </View>

                                </View>: null} */}

                                <View style={{ justifyContent: 'flex-end', alignSelf: 'center', flex: 1, flexDirection: 'row', marginTop: this.state.Shipper ? widthPercentageToDP('8%') : widthPercentageToDP('2%') }}>
                                    <TouchableOpacity
                                        onPress={() => this.conformationNo()}
                                        style={{
                                            width: widthPercentageToDP('80%'), height: widthPercentageToDP('12%'), shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.8,
                                            shadowColor: '#CECECE',
                                            margin: widthPercentageToDP('2%'),
                                            shadowRadius: 3, justifyContent: 'center', alignSelf: 'center',
                                            borderRadius: 8,
                                            flexDirection: 'column',
                                            elevation: 4,
                                            backgroundColor: '#FE3547',
                                        }}
                                    >
                                        <Text style={{ fontFamily: 'Montserrat-Bold', justifyContent: 'center', alignSelf: 'center', color: '#FFFFFF' }}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </ScrollView>
                    </Modal>

                </View>
            </Container>

        )

    }
}

export default withNavigation(Truck);

var styles = StyleSheet.create({

    linearGradient: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#F1F3FD',
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
    modalbottom: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        position: "absolute",
        backgroundColor: 'rgba(0, 0, 0, 0)',
    },
    modal4: {
        maxHeight: 330,
        minHeight: 80
    },
    modal1: {
        maxHeight: 310,
        minHeight: 80
    },
    modal2: {
        maxHeight: 295,
        minHeight: 80
    },
    modal3: {
        maxHeight: 280,
        minHeight: 80
    },
    selectproducts: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        color: '#1D3567',
        alignItems: 'center',
        margin: widthPercentageToDP('2%'),
    }
});