import React, { Component } from 'react';
import { Text, View, StatusBar, StyleSheet, Platform, TouchableOpacity, RefreshControl, ToastAndroid, Dimensions, ActivityIndicator, DeviceEventEmitter } from 'react-native';
import { withNavigation, NavigationActions, StackActions } from 'react-navigation';
import { Container } from 'native-base';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import svgImages from '../Images/images';
import DataWedgeIntents from 'react-native-datawedge-intents';
import APIService from '../component/APIServices';
import { SinglePickerMaterialDialog } from 'react-native-material-dialog';
import Headers from '../component/Headers';
var { height, width } = Dimensions.get('window');
const _ = require('lodash');
import { DrawerActions } from 'react-navigation-drawer';
import AsyncStorage from '@react-native-community/async-storage';

const resetAction = StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: 'Dashboard' })],
});

class Dashboard extends Component {
    static navigationOptions = { header: null }
    constructor(props) {
        super(props);
        this.state = {
            ean8checked: true,
            ean13checked: true,
            code39checked: true,
            code128checked: true,
            modulePickerVisible: false,
            locationData: [],
            selectedLocation: '',
            selected: undefined,
            curloading: false,
            loading: false,
            expanded: false
        }
        this.sendCommandResult = "false";
        this.setDecoders();
        this.broadcastReceiverHandler = (intent) => {
            this.broadcastReceiver(intent);
        }
        DeviceEventEmitter.addListener('datawedge_broadcast_intent', this.broadcastReceiverHandler);
        this.registerBroadcastReceiver();
        this.determineVersion();
    }

    setDecoders() {
        //  Set the new configuration
        var profileConfig = {
            "PROFILE_NAME": "ZebraReactNativeDemo",
            "PROFILE_ENABLED": "true",
            "CONFIG_MODE": "UPDATE",
            "PLUGIN_CONFIG": {
                "PLUGIN_NAME": "BARCODE",
                "PARAM_LIST": {
                    //"current-device-id": this.selectedScannerId,
                    "scanner_selection": "auto",
                    "decoder_ean8": "" + this.state.ean8checked,
                    "decoder_ean13": "" + this.state.ean13checked,
                    "decoder_code128": "" + this.state.code128checked,
                    "decoder_code39": "" + this.state.code39checked
                }
            }
        };
        this.sendCommand("com.symbol.datawedge.api.SET_CONFIG", profileConfig);
    }

    determineVersion() {
        // DataWedgeIntents.sendIntent(DataWedgeIntents.ACTION_SOFTSCANTRIGGER, DataWedgeIntents.START_SCANNING);
        this.sendCommand("com.symbol.datawedge.api.GET_VERSION_INFO", "");
    }

    broadcastReceiver(intent) {
        //  Broadcast received

    }

    registerBroadcastReceiver() {
        DataWedgeIntents.registerBroadcastReceiver({
            filterActions: [
                'com.sepio_logitrack.ACTION',
                'com.symbol.datawedge.api.RESULT_ACTION'
            ],
            filterCategories: [
                'android.intent.category.DEFAULT'
            ]
        });
    }


    componentDidMount() {
        // BackHandler.addEventListener('hardwareBackPress', this.handleBackPress.bind(this));
        this.setState({ loading: false }, async () => {
            // this.getLocation();
            await AsyncStorage.getItem('AllLocation').then((value) => {
                var location = JSON.parse(value);
                if (location) {
                    this.setState({ locationData: location })
                }
            });
            await AsyncStorage.getItem('SelectedLocation').then((value) => {
                var location = JSON.parse(value);
                if (location ? location.id || location.value ? true : false : false) {
                    this.setState({
                        locationId: location.id ? location.id : location.value,
                        locationName: location.itemName ? location.itemName : location.label
                    }, () => {
                        if (this.state.locationId || this.state.locationId != '' || this.state.locationName || this.state.locationName != '') {
                            this.setState({ loading: false, selectedLocation: this.state.locationName })
                        }
                        else {
                            this.getLocation();
                        }
                    })
                }
                else {
                    this.getLocation();
                }

            });
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

    sendCommand(extraName, extraValue) {
        var broadcastExtras = {};
        broadcastExtras[extraName] = extraValue;
        broadcastExtras["SEND_RESULT"] = this.sendCommandResult;
        DataWedgeIntents.sendBroadcastWithExtras({
            action: "com.symbol.datawedge.api.ACTION",
            extras: broadcastExtras
        });
    }

    async getLocation() {
        var locationresponse = await APIService.execute('POST', APIService.URLBACKEND + 'settings/getlocations')
        if (locationresponse.data.message == 'success') {
            this.setState({
                locationData: locationresponse.data.data
            }, async () => {
                await AsyncStorage.getItem('SelectedLocation').then(async (value) => {
                    if (value == null) {
                        if (this.state.locationData.length > 0) {
                            await AsyncStorage.setItem('AllLocation', JSON.stringify(this.state.locationData));
                            await AsyncStorage.setItem('SelectedLocation', JSON.stringify(this.state.locationData[0]));
                            await AsyncStorage.getItem('SelectedLocation').then((value) => {
                                var location = JSON.parse(value);
                                this.setState({
                                    selectedLocation: location.itemName, loading: false
                                }, () => console.log('location id and name', this.state.selectedLocation))
                            }
                            );
                        }
                        else {
                            this.setState({
                                loading: false
                            }, () => {
                                ToastAndroid.show("No Location are Available", ToastAndroid.LONG, 25, 50);
                            })
                        }
                    }
                    else {
                        await AsyncStorage.getItem('SelectedLocation').then((value) => {
                            var location = JSON.parse(value);
                            this.setState({
                                selectedLocation: location.itemName ? location.itemName : location.label,
                                selected: location, loading: false
                            }, () => console.log('selectedLocation', this.state.selectedLocation, this.state.selected))
                        })
                    }
                });

            })
        } else {
            this.setState({
                loading: false
            }, () => {
                ToastAndroid.show("No Location are Available", ToastAndroid.LONG, 25, 50);
            })
        }
    }

    async setLocationtostorage(location) {

        await AsyncStorage.setItem('SelectedLocation', JSON.stringify(location));
        await AsyncStorage.getItem('SelectedLocation').then((value) => {
            var location = JSON.parse(value);
            this.setState({
                selectedLocation: location.itemName ? location.itemName : location.label
            })
        }
        );
    }

    async getSelectedItem() {
        var sortArray = this.state.locationData.map((row, index) => ({ value: row.id, label: row.itemName }));
        await AsyncStorage.getItem('SelectedLocation').then((value) => {
            var location = JSON.parse(value);
            console.log('select location', _.find(sortArray, function (o) {
                return o.label == location.itemName
            }))
            var selected = _.find(sortArray, function (o) {
                return o.label == location.itemName
            })
            return selected;
        })

    }
    _onRefresh = () => {
        this.setState({ curloading: true, loading: true, selectedLocation: false }, () => {
            this.getLocation();
            this.setState({ curloading: false })
        });
    }

    loadingdata() {
        return (
            <View></View>
        )
    }

    renderListFooter() {
        if (this.state.loading) {
            return (
                <View style={styles.overlay}>
                    <ActivityIndicator size={'large'} color='#1D3567' />
                </View>
            )
        }
        else {
            return null;
        }
    }

    render() {
        return (
            <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                <Headers label={this.state.selectedLocation || 'Location'} menubar={() => this.props.navigation.dispatch(DrawerActions.openDrawer())} expanded={this.state.expanded} location={() => this.setState({ modulePickerVisible: true })} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={styles.linearGradient}>
                    <ScrollView /*style={{ flex: 1 }}*/
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.curloading}
                                onRefresh={this._onRefresh}
                                colors={["#1D3567"]}
                            />
                        }>
                        <View style={{ flex: 1, width: widthPercentageToDP('100%'), flexDirection: 'column', paddingLeft: 10, paddingRight: 10, paddingBottom: 10, paddingTop: 5, marginBottom: 15, marginTop: 5 }}>
                            <View style={styles.cardRow}>
                                <TouchableOpacity style={styles.cardStyle} onPress={() => this.props.navigation.navigate('Assign')}>
                                    <SvgUri width="50" height="40" svgXmlData={svgImages.Assign} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%') }} />
                                    <View style={styles.cardtext}>
                                        <Text style={styles.textStyle}>{"Assign"}</Text>
                                        {/* <SvgUri width="16" height="17" fill="#545A5F" svgXmlData={svgImages.right_arrow} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', paddingTop: widthPercentageToDP('3%'), paddingRight: widthPercentageToDP('4%') }} /> */}
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cardStyle}
                                    onPress={() => this.props.navigation.navigate('LinkMap')}
                                // onPress={() => this.props.navigation.navigate('LinkScanproduct')}
                                >
                                    <SvgUri width="50" height="40" svgXmlData={svgImages.link} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%') }} />
                                    <View style={styles.cardtext}>
                                        <Text style={styles.textStyle}>{"Aggregation"}</Text>
                                        {/* <SvgUri width="16" height="17" fill="#545A5F" svgXmlData={svgImages.right_arrow} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', paddingTop: widthPercentageToDP('3%'), paddingRight: widthPercentageToDP('4%') }} /> */}
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardRow}>
                                <TouchableOpacity style={styles.cardStyle} onPress={() => this.props.navigation.navigate('Movestock')}>
                                    <SvgUri width="50" height="38" svgXmlData={svgImages.truck} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%') }} />
                                    <View style={styles.cardtext}>
                                        <Text style={styles.textStyle}>{"Dispatch Stock"}</Text>
                                        {/* <SvgUri width="16" height="17" fill="#545A5F" svgXmlData={svgImages.right_arrow} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', paddingTop: widthPercentageToDP('3%'), paddingRight: widthPercentageToDP('4%') }} /> */}
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cardStyle} onPress={() => this.props.navigation.navigate('ReceiveStock')}>
                                    <SvgUri width="50" height="38" svgXmlData={svgImages.delivery} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%') }} />
                                    <View style={styles.cardtext}>
                                        <Text style={styles.textStyle}>{"Receive Stock"}</Text>
                                        {/* <SvgUri width="16" height="17" fill="#545A5F" svgXmlData={svgImages.right_arrow} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', paddingTop: widthPercentageToDP('3%'), paddingRight: widthPercentageToDP('4%') }} /> */}
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardRow}>
                                <TouchableOpacity style={styles.cardStyle}
                                    onPress={() => this.props.navigation.navigate('ProductReturn')}
                                >
                                    <SvgUri width="50" height="38" svgXmlData={svgImages.Product_return} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%') }} />
                                    <View style={styles.cardtext}>
                                        <Text style={styles.textStyle}>{"Product Return"}</Text>
                                        {/* <SvgUri width="16" height="17" fill="#545A5F" svgXmlData={svgImages.right_arrow} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', paddingTop: widthPercentageToDP('3%'), paddingRight: widthPercentageToDP('4%') }} /> */}
                                    </View>

                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cardStyle}
                                    onPress={() => this.props.navigation.navigate('IssueRawMaterial')}
                                >
                                    <SvgUri width="50" height="38" svgXmlData={svgImages.Rawmaterial} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%') }} />
                                    <View style={styles.cardtext}>
                                        <Text style={styles.textStyle}>{"Issue Raw Material"}</Text>
                                        {/* <SvgUri width="16" height="17" fill="#545A5F" svgXmlData={svgImages.right_arrow} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', paddingTop: widthPercentageToDP('3%'), paddingRight: widthPercentageToDP('4%') }} /> */}
                                    </View>

                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardRow}>
                                <TouchableOpacity style={styles.cardStyle}
                                    onPress={() => this.props.navigation.navigate('Attribute')}>
                                    <SvgUri width="50" height="38" svgXmlData={svgImages.Adddetails} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%') }} />
                                    <View style={styles.cardtext}>
                                        <Text style={styles.textStyle}>{"Add Details"}</Text>
                                        {/* <SvgUri width="16" height="17" fill="#545A5F" svgXmlData={svgImages.right_arrow} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', paddingTop: widthPercentageToDP('3%'), paddingRight: widthPercentageToDP('4%') }} /> */}
                                    </View>

                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cardStyle}
                                    onPress={() => this.props.navigation.navigate('QuickMove')}
                                >
                                    <SvgUri width="50" height="38" svgXmlData={svgImages.Quickmove} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%') }} />
                                    <View style={styles.cardtext}>
                                        <Text style={styles.textStyle}>{"Quick Move"}</Text>
                                        {/* <SvgUri width="16" height="17" fill="#545A5F" svgXmlData={svgImages.right_arrow} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', paddingTop: widthPercentageToDP('3%'), paddingRight: widthPercentageToDP('4%') }} /> */}
                                    </View>

                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardRow}>
                                <TouchableOpacity style={styles.cardStyle} onPress={() => this.props.navigation.navigate('PairIdscreen')}>
                                    <SvgUri width="50" height="38" svgXmlData={svgImages.Pairs_id} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%') }} />
                                    <View style={styles.cardtext}>
                                        <Text style={styles.textStyle}>{"Pair IDs"}</Text>
                                        {/* <SvgUri width="16" height="17" fill="#545A5F" svgXmlData={svgImages.right_arrow} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', paddingTop: widthPercentageToDP('3%'), paddingRight: widthPercentageToDP('4%') }} /> */}
                                    </View>

                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cardStyle}
                                    onPress={() => this.props.navigation.navigate('Deaggregate')}
                                >
                                    <SvgUri width="50" height="38" svgXmlData={svgImages.Deaggregate} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%') }} />
                                    <View style={styles.cardtext}>
                                        <Text style={styles.textStyle}>{"De-aggregate"}</Text>
                                        {/* <SvgUri width="16" height="17" fill="#545A5F" svgXmlData={svgImages.right_arrow} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', paddingTop: widthPercentageToDP('3%'), paddingRight: widthPercentageToDP('4%') }} /> */}
                                    </View>

                                </TouchableOpacity>
                            </View>
                            <View style={styles.cardRow}>
                                <TouchableOpacity style={styles.cardStyle}
                                    onPress={() => this.props.navigation.navigate('StockCount')}
                                >
                                    <SvgUri width="50" height="38" svgXmlData={svgImages.StockCount} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%') }} />
                                    <View style={styles.cardtext}>
                                        <Text style={styles.textStyle}>{"Stock Count"}</Text>
                                        {/* <SvgUri width="16" height="17" fill="#545A5F" svgXmlData={svgImages.right_arrow} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', paddingTop: widthPercentageToDP('3%'), paddingRight: widthPercentageToDP('4%') }} /> */}
                                    </View>

                                </TouchableOpacity>
                                <TouchableOpacity style={styles.cardStyle} onPress={() => this.props.navigation.navigate('AuditScanProduct')}>
                                    <SvgUri width="50" height="38" svgXmlData={svgImages.Audit} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%') }} />
                                    <View style={styles.cardtext}>
                                        <Text style={styles.textStyle}>{"Audit"}</Text>
                                        {/* <SvgUri width="16" height="17" fill="#545A5F" svgXmlData={svgImages.right_arrow} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', paddingTop: widthPercentageToDP('3%'), paddingRight: widthPercentageToDP('4%') }} /> */}
                                    </View>

                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                    <View style={{
                        height: widthPercentageToDP('15%'), borderTopWidth: 0.3, borderTopColor: 'grey', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                        backgroundColor: '#F4F4F4',
                        borderRadius: 5
                    }}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('JobHistory')}
                            style={{
                                flex: 1,
                                justifyContent: 'center', alignItems: 'center',
                                flexDirection: 'column'

                            }}>
                            <SvgUri width="22" height="20" svgXmlData={svgImages.History} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', margin: widthPercentageToDP('1%') }} />
                            <Text style={styles.btntextBottom}>{'History'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate('DashScanner', { id: 1 })}
                            style={{
                                flex: 1,
                                justifyContent: 'center', alignItems: 'center',
                                flexDirection: 'column'
                            }}>
                            <SvgUri width="22" height="20" svgXmlData={svgImages.qr_code} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', margin: widthPercentageToDP('1%') }} />
                            <Text style={styles.btntextBottom}>{'Scan'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <SinglePickerMaterialDialog
                    scrolled
                    colorAccent='#1D3567'
                    title={'Select Location'}
                    items={this.state.locationData.map((row, index) => ({ value: row.id, label: row.itemName }))}
                    visible={this.state.modulePickerVisible}
                    selectedItem={{ value: 147, label: 'new mumbai' }}
                    okLabel='OK'
                    cancelLabel='CANCEL'
                    onCancel={() => this.setState({ modulePickerVisible: false }, () => console.log('hh', this.state.selected))}
                    onOk={result => {
                        this.setState({ modulePickerVisible: false }, () => {
                            this.setLocationtostorage(result.selectedItem)
                        })
                    }}
                />
                {/* {this.renderListFooter()} */}
            </Container>
        );
    }
}

export default withNavigation(Dashboard);

var styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        justifyContent: 'center',
        resizeMode: 'contain',
        alignItems: 'center',
        backgroundColor: '#F1F3FD',
        // paddingTop: 40
    },
    overlay: {
        height: Platform.OS === "android" ? Dimensions.get("window").height : null,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
    },
    cardRow: {
        flex: 1,
        width: widthPercentageToDP('95%'),
        height: widthPercentageToDP('32%'),
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',

    },
    cardStyle: {
        flex: 1,
        flexDirection: 'column',
        width: widthPercentageToDP('45%'),
        height: widthPercentageToDP('20%'),
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.8,
        // shadowColor: '#f1f1f1',
        // shadowRadius: 1,
        // borderColor: '#f9f9f9',
        // elevation: 5,
        // backgroundColor: '#FFFFFF',
        borderRadius: 5,
        // marginRight: 8,
        margin: 8,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        paddingTop: 10,
        // paddingBottom: 10,
        paddingRight: 10
    },
    textStyle: {
        flex: 1,
        fontFamily: 'Montserrat-Bold',
        // color: '#1D3567',
        marginTop: 2,
        fontSize: 14,
        color: '#141312',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: widthPercentageToDP('2%'),
        // marginLeft: widthPercentageToDP('4%')
    },
    cardtext: {
        flexDirection: 'row',
        width: widthPercentageToDP('45%'),
        justifyContent: 'space-between'
    },
    btntextBottom: {
        color: '#000000',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

});
