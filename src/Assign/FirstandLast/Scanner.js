import {
    Text, View,  FlatList, StatusBar, StyleSheet,  Linking, AsyncStorage, TouchableOpacity, ToastAndroid, Dimensions, ActivityIndicator,
    AppState,
    Platform,
    PermissionsAndroid,
    BackHandler,
    DeviceEventEmitter
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { Container } from 'native-base';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import QRCodeScanner from "react-native-qrcode-scanner";
import svgImages from '../../Images/images';
import * as Animatable from "react-native-animatable";
import APIService from '../../component/APIServices';
import moment from "moment";
import Sound from 'react-native-sound';
import DataWedgeIntents from 'react-native-datawedge-intents';
import Headers from '../../component/Headers'

import React, { Component } from 'react';
import { ScanditModule, 
    Barcode, 
    ScanSettings
} from 'scandit-react-native';


ScanditModule.setAppKey('AXZORj2nI0ZMHjyLexkWTD4mrkrjAEPrtXgCuecYbnjOFdU2d23g4BJzs00JbnSO9kZAtpNswn8ATLqojjZJ/zdz7cwHRaD3dxaoV/VDmq+bYuAxWjA/tTsxsMngOuBhZTdlDeMaFiuBYAOCQ3ldwMdCLOSZLmo1ltZ59+gN01VbmCtcFAiZKWwF4+5a5Hi1DQLxcGLgOtGJzGKs/rWsXKXKxTIazPt2z2VM+dK1y15HR9lI3RAKV5JWpoxKPIXrHij7fNep4cdwOWXnps4NQy7w4USWe9iWo7J/IC4IrmHAbz/QkOR1ZZiMOJmOF9ME9Ty3eMmIAEZSPIbcREpUmDwtMVJHcH02cMF1AExn1cdeinIWPNitXETQR0RCNfJJVwL3ktcUkqo9lmSySZHRdKNM87laMm11SqF60IX5koMGGADrVaw8yb2Zxvk1EHzaT6J+0gQmc50QbUt051D6yTlmGJkWUfRnRIHqqcFrWMNeL8fNbl0l3ewIOmDl06nddaTFqHKTVPR+LCugEXjN4xZvOIwA4RlBrXnvLcL10DuTN30mavL0FeqZ/v33s95D5yKIAmgGpIakYljrxoeuvb+OI8E3r7eBx2iJ6ycfXztY6q3kIqeL2Xva4bH23EmlvV1VAQ21iaiTc6eX5+9Q+3XJSDLPYHDKn1srwI2zzEx68IopPQUKQpui6hVIlbPTPBRwNNi1vgqu132Qp7k5zXlxt6NAisMHzeCIQgBOfaDjHDVwWFMcC6drp53LtQFVCru/gPAz2ttDocEZm0Rgr0reHrWups6jo4afQLzkhbLqQ5md4Hw=');


class Scanner extends Component {
    static navigationOptions = { header: null }
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            focus: false,
            username: '',
            products: '',
            model: false,
            data: '',
            isVisible: true,
            checked: false,
            progressText: 'Loading...',
            delete: false,
            active: true,
            props: '',
            sURLVariables: '',
            Updatedata: '',
            message: '',
            job_detail: '',
            levels: false,
            seqnumber: {},
            expanded: true,
            Rawmaterial:false
        }
        this.scanHandler = (deviceEvent) => {
            this.scabByZebra(deviceEvent)
        };

        this.sendCommandResult = "false";
        // this.setDecoders();
        this.broadcastReceiverHandler = (intent) => {
            this.broadcastReceiver(intent);
        }
        DeviceEventEmitter.addListener('datawedge_broadcast_intent', this.broadcastReceiverHandler);
        DeviceEventEmitter.addListener('barcode_scan', this.scanHandler);
        this.registerBroadcastReceiver();
        this.determineVersion();

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

    sendCommand(extraName, extraValue) {
        console.log("Sending Command: " + extraName + ", " + JSON.stringify(extraValue));
        var broadcastExtras = {};
        broadcastExtras[extraName] = extraValue;
        broadcastExtras["SEND_RESULT"] = this.sendCommandResult;
        DataWedgeIntents.sendBroadcastWithExtras({
            action: "com.symbol.datawedge.api.ACTION",
            extras: broadcastExtras
        });
    }

    async componentWillMount() {
        this.settings = new ScanSettings();
        // this.settings.setSymbologyEnabled(Barcode.Symbology.EAN13, true);
        this.settings.setSymbologyEnabled(Barcode.Symbology.DOTCODE, true);
        // this.settings.setSymbologyEnabled(Barcode.Symbology.EAN8, true);
        // this.settings.setSymbologyEnabled(Barcode.Symbology.UPCA, true);
        // this.settings.setSymbologyEnabled(Barcode.Symbology.UPCE, true);
        // this.settings.setSymbologyEnabled(Barcode.Symbology.CODE39, true);
        // this.settings.setSymbologyEnabled(Barcode.Symbology.ITF, true);
        this.settings.setSymbologyEnabled(Barcode.Symbology.QR, true);
        // this.settings.setSymbologyEnabled(Barcode.Symbology.DATA_MATRIX, true);
        // this.settings.setSymbologyEnabled(Barcode.Symbology.CODE128, true);
        // this.settings.getSymbologySettings(Barcode.Symbology.CODE39)
        //     .activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        this.settings.getSymbologySettings(Barcode.Symbology.DOTCODE, true)
            .activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

        this.settings.highDensityModeEnabled = true;
        this.settings.beep = true;
        this.settings.vibrate = true;
        // this.settings.getSymbologySettings = true;
    }


    isAndroidMarshmallowOrNewer() {
        return Platform.OS === 'android' && Platform.Version >= 23;
    }


    async hasCameraPermission() {
        if (this.isAndroidMarshmallowOrNewer()) {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
            return granted;
        } else {
            return true;
        }
    }

    async requestCameraPermission() {
        if (this.isAndroidMarshmallowOrNewer()) {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Android Camera Permission has been granted.");
                    this.cameraPermissionGranted();
                } else {
                    console.log("Android Camera Permission has been denied - the app will shut itself down.");
                    this.cameraPermissionDenied();
                }
            } catch (err) {
                console.warn(err);
            }

        } else {

            this.cameraPermissionGranted();

        }

    }


    cameraPermissionDenied() {
        BackHandler.exitApp();
    }


    cameraPermissionGranted() {
        this.scanner.startScanning();
    }



    async componentDidMount() {
        var model = await AsyncStorage.getItem('deviceModel')
        this.setState({ model: true, id: this.props.navigation.state.params.id, deviceModel: model });
        this.props.navigation.addListener('didFocus', (item) => {
            this.setState({ model: true, id: this.props.navigation.state.params.id }, () => {
                console.log("prop data:", this.state.id)

            });
        })
    }


    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        if (this.timeout) {
            clearTimeout(this.timeout)
        }
    }



    _handleAppStateChange = async (nextAppState) => {
        if (nextAppState.match(/inactive|background/)) {
            this.scanner.stopScanning();
        } else {
            this.checkForCameraPermission();
        }

    }

    scabByZebra(session) {
        var sURLVariables = session.data != null ? session.data.split('/')[3] : null
        // this.playSound()
        session.data != null ?
            this.setState({ data: session.data, delete: true, sURLVariables: sURLVariables, seqnumber: { ...this.state.seqnumber, [sURLVariables]: !this.state.seqnumber[sURLVariables] } }, () => {
                this.Updatedata();
            }) : null

        this.timeout = setTimeout(function () {
            clearTimeout(this.timeout)
            // this.scanner.resumeScanning();
        }.bind(this), 5000)
    }

    async checkForCameraPermission() {
        const hasPermission = await this.hasCameraPermission();
        if (hasPermission) {
            this.cameraPermissionGranted();
        } else {
            await this.requestCameraPermission();
        }
    }

    onSuccess = e => {
        Linking
        // console.log("item link scan:",e)
        if(e.data.match(new RegExp('/'))!==null){
            if (this.state.delete) {
                this.setState({ data: e });

                var sURLVariables = e.data.split('/')[3]
                this.playSound()

                this.setState({ data: e, delete: true,Rawmaterial:false, sURLVariables: sURLVariables }, () => {

                    setTimeout(() => { this.setState({ timePassed: false }) }, 5000);
                    this.Updatedata();

                })


            } else {
                var sURL_Variables = e.data.split('/')[3]

                this.playSound()

                this.setState({ data: e, delete: true,Rawmaterial:false, sURLVariables: sURL_Variables }, () => {
                    setTimeout(() => { this.setState({ timePassed: false }) }, 5000);
                    this.Updatedata();
                })
            }
        }
        else{

            this.playSound()

            this.setState({ data: e, delete: true, sURLVariables: e.data, Rawmaterial:true }, () => {
                setTimeout(() => { this.setState({ timePassed: false }) }, 5000);
                this.RMGetSequence();
            })

        }
    };


    makeSlideOutTranslation(translationType, fromValue) {
        return {
            from: {
                [translationType]: wdt * -0.16
            },
            to: {
                [translationType]: fromValue
            }
        };
    }

    renderModalContent = () => {
        if (this.state.scannerload) {
            return (
                <View style={styles.overlay}>
                    <ActivityIndicator color="#1D3567" size="large" />
                    {/* <Text style={{ marginTop: 20, fontSize: 14, fontWeight: 'bold', color: '#1D3567' }}>{this.state.progressText}</Text> */}
                </View>
            );
        }
        else {
            return null;
        }
    }


    render() {
        const hgt = Dimensions.get("window").height

        const wdt = Dimensions.get("window").width

        return (
            <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                <Headers label={'Scan Each QR Code'} onBack={() => { this.props.navigation.goBack() }} expanded={this.state.expanded} />
                <StatusBar barStyle="light-content" hidden={false} backgroundColor="transparent" translucent={true} />
                <View style={{
                    flex: 1,
                    flexDirection: 'column'
                }}>
                    <ScrollView>
                        {
                            this.state.deviceModel == 'TC20' ?
                                <TouchableOpacity
                                    onPress={() => this.sendCommand("com.symbol.datawedge.api.SOFT_SCAN_TRIGGER", 'TOGGLE_SCANNING')}
                                    style={{
                                        flex: 1,
                                        height: widthPercentageToDP('12%'),
                                        marginRight: widthPercentageToDP('7%'),
                                        marginHorizontal: widthPercentageToDP('6%'),
                                        marginTop: widthPercentageToDP('2%'),
                                        marginBottom: widthPercentageToDP('5%'),
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        shadowRadius: 3,
                                        elevation: 4,
                                        backgroundColor: '#65CA8F',
                                        borderRadius: 5, justifyContent: 'center', alignItems: 'center'
                                    }}>
                                    <Text style={styles.btntext}>{'SCAN'}</Text>
                                </TouchableOpacity> :
                                <QRCodeScanner
                                    onRead={this.onSuccess.bind(this)}
                                    cornerOffsetSize={3}
                                    showMarker={true}
                                    reactivate={true}
                                    reactivateTimeout={5000}
                                    markerStyle={{
                                        borderWidth: 2,
                                        borderColor: '#1A6DD5',
                                        borderRadius: 4,
                                    }}
                                    // topContent={this.toprender()}
                                    // bottomContent={this.bottomrender()}
                                    customMarker={
                                        <View style={styles.rectangleContainer}>
                                            <View style={styles.topOverlay} />

                                            <View style={{ flexDirection: "row" }}>
                                                <View style={styles.leftAndRightOverlay} />

                                                <View style={styles.rectangle}>
                                                    <View style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: 0,
                                                        height: 25,
                                                        width: 25,
                                                        borderColor: '#FFFFFF',
                                                        borderLeftWidth: 3,
                                                        borderTopWidth: 3,
                                                    }} />
                                                    <View style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        height: 25,
                                                        width: 25,
                                                        borderColor: '#FFFFFF',
                                                        borderLeftWidth: 3,
                                                        borderBottomWidth: 3,
                                                    }} />

                                                    <Animatable.View
                                                        style={styles.scanBar}
                                                        direction="alternate-reverse"
                                                        iterationCount="infinite"
                                                        duration={1800}
                                                        easing="linear"
                                                        animation={this.makeSlideOutTranslation(
                                                            "translateY",
                                                            wdt * -0.74
                                                        )}
                                                    />
                                                    <View style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        right: 0,
                                                        height: 25,
                                                        width: 25,
                                                        borderColor: '#FFFFFF',
                                                        borderRightWidth: 3,
                                                        borderTopWidth: 3,
                                                    }} />
                                                    <View style={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        right: 0,
                                                        height: 25,
                                                        width: 25,
                                                        borderColor: '#FFFFFF',
                                                        borderRightWidth: 3,
                                                        borderBottomWidth: 3,
                                                    }} />
                                                </View>

                                                <View style={styles.leftAndRightOverlay} />
                                            </View>

                                            <View style={styles.bottomOverlay} />
                                        </View>
                                    }

                                    checkAndroid6Permissions={true}
                                    ref={elem => {
                                        this.scanner = elem;
                                    }}
                                    cameraStyle={{
                                        height: this.state.model || this.state.delete ? this.state.Updatedata ?
                                            this.state.Updatedata === undefined || this.state.Updatedata == [] ? hgt : hgt - widthPercentageToDP('103%') : hgt - widthPercentageToDP('18.1%') : hgt - widthPercentageToDP('18.1%')
                                    }}
                                >
                                </QRCodeScanner>
                        }
                    </ScrollView>
                </View>
                {this.renderModalContent()}
            </Container>
        );
    }




    onScan(session) {
        this.scanner.pauseScanning();
        var data = session.newlyRecognizedCodes[0].data;
        var sURLVariables = data.split('/')[3]
        this.setState({ sURLVariables: sURLVariables }, () => {
            this.Updatedata()
        })
        // this.props.navigation.navigate("FirstandLast", {
        //   id:this.state.id,
        //   item: sURLVariables,
        // //   scanner: this.scanner
        // });
        this.timeout = setTimeout(function () {
            clearTimeout(this.timeout)
            this.scanner.resumeScanning();
        }.bind(this), 5000)
    }

    async RMGetSequence(){
        var data = {}
        // data.job_id = this.state.props.data.data.job_id
        data.sequence_number = this.state.sURLVariables
        // data.location_id = decoded.location_id[0];
        var Updatedata = await APIService.execute('POST', APIService.URLBACKEND + 'rowmaterial/getsequencenumberrm', data)
        console.log("rowmaterial/getsequencenumberrm:", Updatedata)
            if (Updatedata.data.status == 200) {
                ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);

                this.props.navigation.navigate("FirstandLast", {
                    id: this.state.id,
                    item: Updatedata.data.data.data.rm_sequence_no,
                    Rawmaterial:this.state.Rawmaterial
                });

            }  else if (Updatedata.data.status == 400) {
                ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);
            }
    }

    async Updatedata() {

        var data = {}
        // data.job_id = this.state.props.data.data.job_id
        data.sequence_number = this.state.sURLVariables
        // data.location_id = decoded.location_id[0];
        var Updatedata = await APIService.execute('POST', APIService.URLBACKEND + 'assignment/getsequencenumber', data)
        console.log("Updated:", Updatedata)

        this.setState({ message: Updatedata.data.data.message }, () => {
            if (Updatedata.data.status_code == 200) {
                this.props.navigation.navigate("FirstandLast", {
                    id: this.state.id,
                    item: Updatedata.data.data.data.sequence_no,
                    Rawmaterial:this.state.Rawmaterial
                });
                ToastAndroid.show(this.state.message, ToastAndroid.LONG, 25, 50);

            } else if (Updatedata.data.status_code == 400 && this.state.message) {
                ToastAndroid.show(this.state.message, ToastAndroid.LONG, 25, 50);
            } else if (Updatedata.data.status_code == 400) {
                ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);
            }
        })
        // if (Updatedata.data.status_code == 200) {
        //     // this.props.navigation.navigate("FirstandLast", {
        //     //     id: this.state.id,
        //     //     item: sURLVariables,
        //     // });
        //     ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);


        // } else if (Updatedata.data.status_code == 400) {
        //     ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);
        // }

    }

    playSound() {
        const mySound = new Sound('beep_08.mp3', Sound.MAIN_BUNDLE, (e) => {
            if (e) {
                console.log('error', e);
            } else {
                console.log('duration', mySound.getDuration());
                mySound.play();
            }
        });
    }



    bottomrender = () => {
        const fontSize = 11
        if (this.state.model) {
            return (
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F3FD' }}>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#F1F3FD' }}>
                        <View style={{
                            flexDirection: 'row', width: widthPercentageToDP('30%'), height: widthPercentageToDP('8%'), shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowColor: '#CECECE',
                            shadowRadius: 3,
                            borderRadius: 34,
                            margin: widthPercentageToDP('7%'),
                            marginLeft: widthPercentageToDP('4%'),
                            marginBottom: widthPercentageToDP('1%'),
                            elevation: 4,
                            backgroundColor: '#65CA8F', justifyContent: 'center', alignItems: 'center',
                        }}>
                            <Text style={{ margin: 2, fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'center', alignItems: 'center' }}>Total Scan:</Text>
                            <Text style={{ margin: 2, fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'center', alignItems: 'center' }}>{this.state.Updatedata ? this.state.Updatedata.length : '0'}</Text>
                        </View>

                        <TouchableOpacity style={{
                            flexDirection: 'row', flex: 1, width: widthPercentageToDP('2%'),
                            margin: widthPercentageToDP('7%'),
                            marginRight: widthPercentageToDP('2%'),
                            backgroundColor: '#F1F3FD', justifyContent: 'flex-end', alignItems: 'center',
                        }}
                        // onPress={() => this.props.navigation.navigate('LinkEditProduct')}
                        >
                            <SvgUri width="25" height="18" svgXmlData={svgImages.edit} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', margin: widthPercentageToDP('2%') }} />
                        </TouchableOpacity>
                    </View>
                    {this.state.Updatedata ?
                        this.state.Updatedata === undefined || this.state.Updatedata == [] ? null :
                            <View style={{
                                flex: 1, shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                borderRadius: 5,
                                // marginLeft: widthPercentageToDP('4%'),
                                // marginRight: widthPercentageToDP('4%'),
                                marginBottom: widthPercentageToDP('4%'),
                                width: widthPercentageToDP('94%'),
                                padding: widthPercentageToDP('2%'),
                                flexDirection: 'column',
                                elevation: 4,
                                backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start',
                            }}>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    backgroundColor: '#FFFFFF', justifyContent: 'space-between', alignItems: 'center',
                                }}>
                                    <View style={{ flex: 1, justifyContent: 'flex-start', marginLeft: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('2%'), flexDirection: 'column' }}>
                                        <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold' }}>{this.state.job_detail ? this.state.job_detail.job_id : '---'}</Text>
                                    </View>
                                    <View style={{ width: widthPercentageToDP('29%'), height: widthPercentageToDP('5%'), marginLeft: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('2%'), fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: '#F3DDB6' }}>
                                        <Text style={{ justifyContent: 'center', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: fontSize }}>{this.state.job_detail ? this.state.job_detail.status : '---'}</Text>
                                    </View>

                                </View>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start',
                                }}>
                                    <Text style={{ justifyContent: 'flex-start', marginLeft: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('2%'), alignItems: 'flex-start', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize }}>Job type: {this.state.job_detail ? this.state.job_detail.job_type : '---'}</Text>
                                </View>
                                <View style={{ width: widthPercentageToDP('86%'), borderBottomColor: '#DBDBDB', borderBottomWidth: 1, marginLeft: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('2%') }} />
                                <View style={{ width: widthPercentageToDP('90%'), justifyContent: 'flex-start', alignItems: 'center', flexDirection: 'row', marginBottom: widthPercentageToDP('2%'), marginLeft: widthPercentageToDP('1%') }}>
                                    <View style={{ flex: 1, width: widthPercentageToDP('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: widthPercentageToDP('1%') }}>
                                        <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: fontSize }}>Created Date:</Text>
                                        <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize }}>{this.state.job_detail ? moment(this.state.job_detail.created_at).format('DD MMM YYYY') : '---'}</Text>
                                    </View>

                                    <View style={{ flex: 1, width: widthPercentageToDP('45%'), justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'column', margin: widthPercentageToDP('1%') }}>
                                        <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold', fontSize: fontSize }}>Created by:</Text>
                                        <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize }}>{this.state.job_detail ? this.state.job_detail.created_by : '---'}</Text>
                                    </View>
                                </View>
                            </View> : null}

                    {this.state.Updatedata ?
                        this.state.Updatedata === undefined || this.state.Updatedata.length === 0 ? null :

                            <View style={{
                                flex: 1, shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                borderRadius: 5,
                                marginBottom: widthPercentageToDP('4%'),
                                width: widthPercentageToDP('94%'),
                                padding: widthPercentageToDP('2%'),
                                flexDirection: 'column',
                                elevation: 4,
                                backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start',
                            }}>
                                <FlatList
                                    extraData={this.state.Updatedata}
                                    data={this.state.Updatedata}
                                    renderItem={({ item }) => (
                                        // <View style={{
                                        //     flex: 1,
                                        //     width: widthPercentageToDP('94%'),
                                        //     // padding: widthPercentageToDP('1%'),
                                        //     flexDirection: 'column',
                                        //     backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start'

                                        // }}>

                                        //     {item.level_id == 4 ?
                                        //         <View style={{
                                        //             flex: 1, flexDirection: 'row',
                                        //             margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('3%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#FFFFFF',
                                        //         }} >
                                        //             <View style={{
                                        //                 flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', shadowOffset: { width: 0, height: 2 },
                                        //                 shadowOpacity: 0.8,
                                        //                 height: widthPercentageToDP('8%'),
                                        //                 shadowColor: '#CECECE', backgroundColor: '#33B4E4',
                                        //                 shadowRadius: 3, elevation: 2, padding: widthPercentageToDP('2%'), paddingHorizontal: widthPercentageToDP('2%'), borderRadius: 3
                                        //             }} >
                                        //                 <Text style={{ fontFamily: 'Montserrat-Bold', color: '#FFFFFF', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'flex-start' }}>Truck ID:</Text>
                                        //                 <Text style={{ fontFamily: 'Montserrat-Regular', color: '#FFFFFF', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 5 }}>PP1023457347</Text>

                                        //             </View>
                                        //         </View> : null}



                                        //     {item.level_id == 3 ?
                                        //         <View style={{
                                        //             flex: 1, flexDirection: 'row',
                                        //             margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('0.5%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: widthPercentageToDP('6%'),
                                        //         }} >
                                        //             <View style={{
                                        //                 flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', shadowOffset: { width: 0, height: 2 },
                                        //                 shadowOpacity: 0.8,
                                        //                 height: widthPercentageToDP('8%'),
                                        //                 shadowColor: '#CECECE', backgroundColor: '#FEBA33',
                                        //                 shadowRadius: 3, elevation: 2, padding: widthPercentageToDP('2%'), paddingHorizontal: widthPercentageToDP('2%'), borderRadius: 3
                                        //             }}>
                                        //                 <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#FFFFFF' }}>Pallet ID:</Text>
                                        //                 <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#FFFFFF', marginLeft: 5 }}>{item.sequence_number || '---'}</Text>
                                        //             </View>

                                        //         </View> : null}
                                        //     {item.level_id == 2 ?
                                        //         <View style={{
                                        //             flex: 1, flexDirection: 'row',
                                        //             marginRight: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('0.5%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'flex-start', alignItems: 'center', 
                                        //             // marginLeft: item.parent_level_id==3?widthPercentageToDP('6%'):null
                                        //         }} >
                                        //             <View style={{
                                        //                 flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', shadowOffset: { width: 0, height: 2 },
                                        //                 shadowOpacity: 0.8,
                                        //                 height: widthPercentageToDP('8%'),
                                        //                 shadowColor: '#CECECE', backgroundColor: '#00C551',
                                        //                 shadowRadius: 3, elevation: 2, padding: widthPercentageToDP('2%'), paddingHorizontal: widthPercentageToDP('2%'), borderRadius: 3,

                                        //             }}>
                                        //                 <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#FFFFFF' }}>Shipper ID:</Text>
                                        //                 <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#FFFFFF', marginLeft: 5 }}>{item.sequence_number || '---'}</Text>
                                        //             </View>
                                        //         </View> : null}
                                        //         {/* <View style={{ marginLeft: this.state.levels?widthPercentageToDP('10%'):null}}> */}
                                        //     { item.level_id != 2 || item.level_id == 1 && this.state.levels ?
                                        //         <View style={{
                                        //             flex: 1, flexDirection: 'row',
                                        //             margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('0.5%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'flex-start', alignItems: 'center',marginLeft: this.state.levels?widthPercentageToDP('6%'):null
                                        //         }} >
                                        //             <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                                        //                 <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567' }}>{item.level_id == 1?"Sequence No:":item.level_id == 2?'Shipper ID:':null}</Text>
                                        //                 <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567', marginLeft: 5 }}>{item.sequence_number || '---'}</Text>
                                        //             </View>

                                        //         </View> 
                                        //         : null} 
                                        //         {/* </View> */}
                                        // </View>
                                        <View style={{
                                            flex: 1,
                                            width: widthPercentageToDP('94%'),
                                            // padding: widthPercentageToDP('1%'),
                                            flexDirection: 'column',
                                            backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start',
                                        }}>

                                            {item.level_id == 10 ?
                                                <View style={{
                                                    flex: 1, flexDirection: 'row',
                                                    margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('3%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#FFFFFF',
                                                }} >
                                                    <View style={{
                                                        flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', shadowOffset: { width: 0, height: 2 },
                                                        shadowOpacity: 0.8,
                                                        height: widthPercentageToDP('8%'),
                                                        shadowColor: '#CECECE', backgroundColor: '#E13B4F',
                                                        shadowRadius: 3, elevation: 2, padding: widthPercentageToDP('2%'), paddingHorizontal: widthPercentageToDP('2%'), borderRadius: 3
                                                    }} >
                                                        <Text style={{ fontFamily: 'Montserrat-Bold', color: '#FFFFFF', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'flex-start' }}>{item.level_name}:</Text>
                                                        <Text style={{ fontFamily: 'Montserrat-Regular', color: '#FFFFFF', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 5 }}>{item.sequence_number || '---'}</Text>

                                                    </View>
                                                </View> : null}

                                            {item.level_id == 9 ?
                                                <View style={{
                                                    flex: 1, flexDirection: 'row',
                                                    margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('3%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#FFFFFF',
                                                }} >
                                                    <View style={{
                                                        flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', shadowOffset: { width: 0, height: 2 },
                                                        shadowOpacity: 0.8,
                                                        height: widthPercentageToDP('8%'),
                                                        shadowColor: '#CECECE', backgroundColor: '#F5A623',
                                                        shadowRadius: 3, elevation: 2, padding: widthPercentageToDP('2%'), paddingHorizontal: widthPercentageToDP('2%'), borderRadius: 3
                                                    }} >
                                                        <Text style={{ fontFamily: 'Montserrat-Bold', color: '#FFFFFF', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'flex-start' }}>{item.level_name}:</Text>
                                                        <Text style={{ fontFamily: 'Montserrat-Regular', color: '#FFFFFF', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 5 }}>{item.sequence_number || '---'}</Text>

                                                    </View>
                                                </View> : null}

                                            {item.level_id == 8 ?
                                                <View style={{
                                                    flex: 1, flexDirection: 'row',
                                                    margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('3%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#FFFFFF',
                                                }} >
                                                    <View style={{
                                                        flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', shadowOffset: { width: 0, height: 2 },
                                                        shadowOpacity: 0.8,
                                                        height: widthPercentageToDP('8%'),
                                                        shadowColor: '#CECECE', backgroundColor: '#8B572A',
                                                        shadowRadius: 3, elevation: 2, padding: widthPercentageToDP('2%'), paddingHorizontal: widthPercentageToDP('2%'), borderRadius: 3
                                                    }} >
                                                        <Text style={{ fontFamily: 'Montserrat-Bold', color: '#FFFFFF', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'flex-start' }}>{item.level_name}:</Text>
                                                        <Text style={{ fontFamily: 'Montserrat-Regular', color: '#FFFFFF', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 5 }}>{item.sequence_number || '---'}</Text>

                                                    </View>
                                                </View> : null}


                                            {item.level_id == 7 ?
                                                <View style={{
                                                    flex: 1, flexDirection: 'row',
                                                    margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('3%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#FFFFFF',
                                                }} >
                                                    <View style={{
                                                        flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', shadowOffset: { width: 0, height: 2 },
                                                        shadowOpacity: 0.8,
                                                        height: widthPercentageToDP('8%'),
                                                        shadowColor: '#CECECE', backgroundColor: '#417505',
                                                        shadowRadius: 3, elevation: 2, padding: widthPercentageToDP('2%'), paddingHorizontal: widthPercentageToDP('2%'), borderRadius: 3
                                                    }} >
                                                        <Text style={{ fontFamily: 'Montserrat-Bold', color: '#FFFFFF', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'flex-start' }}>{item.level_name}:</Text>
                                                        <Text style={{ fontFamily: 'Montserrat-Regular', color: '#FFFFFF', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 5 }}>{item.sequence_number || '---'}</Text>

                                                    </View>
                                                </View> : null}

                                            {item.level_id == 6 ?
                                                <View style={{
                                                    flex: 1, flexDirection: 'row',
                                                    margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('3%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#FFFFFF',
                                                }} >
                                                    <View style={{
                                                        flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', shadowOffset: { width: 0, height: 2 },
                                                        shadowOpacity: 0.8,
                                                        height: widthPercentageToDP('8%'),
                                                        shadowColor: '#CECECE', backgroundColor: '#B325D0',
                                                        shadowRadius: 3, elevation: 2, padding: widthPercentageToDP('2%'), paddingHorizontal: widthPercentageToDP('2%'), borderRadius: 3
                                                    }} >
                                                        <Text style={{ fontFamily: 'Montserrat-Bold', color: '#FFFFFF', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'flex-start' }}>{item.level_name}:</Text>
                                                        <Text style={{ fontFamily: 'Montserrat-Regular', color: '#FFFFFF', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 5 }}>{item.sequence_number || '---'}</Text>

                                                    </View>
                                                </View> : null}

                                            {item.level_id == 5 ?
                                                <View style={{
                                                    flex: 1, flexDirection: 'row',
                                                    margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('3%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#FFFFFF',
                                                }} >
                                                    <View style={{
                                                        flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', shadowOffset: { width: 0, height: 2 },
                                                        shadowOpacity: 0.8,
                                                        height: widthPercentageToDP('8%'),
                                                        shadowColor: '#CECECE', backgroundColor: '#F76D9D',
                                                        shadowRadius: 3, elevation: 2, padding: widthPercentageToDP('2%'), paddingHorizontal: widthPercentageToDP('2%'), borderRadius: 3
                                                    }} >
                                                        <Text style={{ fontFamily: 'Montserrat-Bold', color: '#FFFFFF', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'flex-start' }}>{item.level_name}:</Text>
                                                        <Text style={{ fontFamily: 'Montserrat-Regular', color: '#FFFFFF', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 5 }}>{item.sequence_number || '---'}</Text>

                                                    </View>
                                                </View> : null}

                                            {item.level_id == 4 ?
                                                <View style={{
                                                    flex: 1, flexDirection: 'row',
                                                    margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('3%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'center', alignItems: 'flex-start', backgroundColor: '#FFFFFF',
                                                }} >
                                                    <View style={{
                                                        flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', shadowOffset: { width: 0, height: 2 },
                                                        shadowOpacity: 0.8,
                                                        height: widthPercentageToDP('8%'),
                                                        shadowColor: '#CECECE', backgroundColor: '#33B4E4',
                                                        shadowRadius: 3, elevation: 2, padding: widthPercentageToDP('2%'), paddingHorizontal: widthPercentageToDP('2%'), borderRadius: 3
                                                    }} >
                                                        <Text style={{ fontFamily: 'Montserrat-Bold', color: '#FFFFFF', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'flex-start' }}>{item.level_name}:</Text>
                                                        <Text style={{ fontFamily: 'Montserrat-Regular', color: '#FFFFFF', fontSize: fontSize, justifyContent: 'flex-start', alignItems: 'flex-start', marginLeft: 5 }}>{item.sequence_number || '---'}</Text>

                                                    </View>
                                                </View> : null}



                                            {item.level_id == 3 ?
                                                <View style={{
                                                    flex: 1, flexDirection: 'row',
                                                    margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('0.5%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'flex-start', alignItems: 'center',
                                                }} >
                                                    <View style={{
                                                        flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', shadowOffset: { width: 0, height: 2 },
                                                        shadowOpacity: 0.8,
                                                        height: widthPercentageToDP('8%'),
                                                        shadowColor: '#CECECE', backgroundColor: '#4A90E2',
                                                        shadowRadius: 3, elevation: 2, padding: widthPercentageToDP('2%'), paddingHorizontal: widthPercentageToDP('2%'), borderRadius: 3
                                                    }}>
                                                        <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#FFFFFF' }}>{item.level_name}:</Text>
                                                        <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#FFFFFF', marginLeft: 5 }}>{item.sequence_number || '---'}</Text>
                                                    </View>

                                                </View> : null}

                                            <View style={{
                                                flex: 1, flexDirection: 'row', marginLeft: item.level_id == 3 ? 2 : widthPercentageToDP('6%'),
                                                marginTop: widthPercentageToDP('0.5%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'flex-start', alignItems: 'center',
                                            }}>
                                                {item.level_id == 2 ?
                                                    <View style={{
                                                        flex: 1, flexDirection: 'row',
                                                    }} >
                                                        <View style={{
                                                            flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', shadowOffset: { width: 0, height: 2 },
                                                            shadowOpacity: 0.8,
                                                            height: widthPercentageToDP('8%'),
                                                            shadowColor: '#CECECE', backgroundColor: '#50E3C2',
                                                            shadowRadius: 3, elevation: 2, padding: widthPercentageToDP('2%'), paddingHorizontal: widthPercentageToDP('2%'), borderRadius: 3
                                                        }}>
                                                            <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#FFFFFF' }}>{item.level_name}:</Text>
                                                            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#FFFFFF', marginLeft: 5 }}>{item.sequence_number || '---'}</Text>
                                                        </View>
                                                    </View> : null}
                                                {/* <View style={{ flex: 1, flexDirection: 'row',marginLeft: item.level_id == 2 ? null : widthPercentageToDP('6%'), justifyContent: 'flex-start', alignItems: 'center', }}> */}
                                                {item.level_id == 1 ?
                                                    <View style={{
                                                        flex: 1, flexDirection: 'row',
                                                        margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('0.5%'), marginBottom: widthPercentageToDP('0.5%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: this.state.levels ? widthPercentageToDP('6%') : widthPercentageToDP('6%')
                                                    }} >
                                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                                                            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#4A90E2' }}>{item.level_name}:</Text>
                                                            <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#4A90E2', marginLeft: 5 }}>{item.sequence_number || '---'}</Text>
                                                        </View>

                                                    </View> : null}
                                                {/* </View> */}
                                            </View>
                                        </View>
                                    )}
                                //  keyExtractor={item => item.assignment_mapping_id}
                                />
                            </View> : null}

                    {this.state.Updatedata ?

                        this.state.Updatedata === undefined || this.state.Updatedata.length === 0 ? null :

                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F3FD' }}>
                                <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{
                                    flex: 1,
                                    height: widthPercentageToDP('12%'),
                                    marginLeft: widthPercentageToDP('7%'),
                                    marginHorizontal: widthPercentageToDP('6%'),
                                    marginTop: widthPercentageToDP('2%'),
                                    marginBottom: widthPercentageToDP('5%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    elevation: 4,
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: 5, justifyContent: 'center', alignItems: 'center'
                                }}>
                                    <Text style={styles.btntextcancel}>{'Cancel'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.props.navigation.navigate('ScanSummary', { item: this.state.props.data.data })}
                                    style={{
                                        flex: 1,
                                        height: widthPercentageToDP('12%'),
                                        marginRight: widthPercentageToDP('7%'),
                                        marginHorizontal: widthPercentageToDP('6%'),
                                        marginTop: widthPercentageToDP('2%'),
                                        marginBottom: widthPercentageToDP('5%'),
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.8,
                                        shadowColor: '#CECECE',
                                        shadowRadius: 3,
                                        elevation: 4,
                                        backgroundColor: '#65CA8F',
                                        borderRadius: 5, justifyContent: 'center', alignItems: 'center'
                                    }}>
                                    <Text style={styles.btntext}>{'Continue'}</Text>
                                </TouchableOpacity>
                            </View> : null}
                </View>
            )
        } else if (this.state.delete) {
            return (
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F3FD' }}>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', backgroundColor: '#F1F3FD' }}>
                        <View style={{
                            flexDirection: 'row', width: widthPercentageToDP('30%'), height: widthPercentageToDP('8%'), shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowColor: '#CECECE',
                            shadowRadius: 3,
                            borderRadius: 34,
                            margin: widthPercentageToDP('7%'),
                            marginLeft: widthPercentageToDP('4%'),
                            marginBottom: widthPercentageToDP('4%'),
                            elevation: 4,
                            backgroundColor: '#65CA8F', justifyContent: 'center', alignItems: 'center',
                        }}>
                            <Text style={{ margin: 2, fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'center', alignItems: 'center' }}>Total Scan:</Text>
                            <Text style={{ margin: 2, fontFamily: 'Montserrat-Bold', fontSize: fontSize, justifyContent: 'center', alignItems: 'center' }}>4</Text>
                        </View>

                        <TouchableOpacity style={{
                            flexDirection: 'row', flex: 1, width: widthPercentageToDP('2%'),
                            margin: widthPercentageToDP('7%'),
                            marginRight: widthPercentageToDP('2%'), justifyContent: 'flex-end', alignItems: 'center',
                        }}
                        // onPress={() => this.props.navigation.navigate('EditProduct')}
                        >
                            {/* <SvgUri width="25" height="18" svgXmlData={svgImages.edit} style={{ resizeMode: 'contain', justifyContent: 'center', alignItems: 'center', margin: widthPercentageToDP('2%') }} /> */}
                        </TouchableOpacity>
                    </View>
                    <View style={{
                        flex: 1, shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.8,
                        shadowColor: '#CECECE',
                        shadowRadius: 3,
                        borderRadius: 5,
                        marginBottom: widthPercentageToDP('4%'),
                        width: widthPercentageToDP('94%'),
                        padding: widthPercentageToDP('2%'),
                        flexDirection: 'column',
                        elevation: 4,
                        backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start',
                    }}>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            backgroundColor: '#FFFFFF', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <View style={{ flex: 1, justifyContent: 'flex-start', marginLeft: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('2%'), flexDirection: 'column' }}>
                                <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Bold' }}>M2392</Text>
                            </View>
                            <View style={{ width: widthPercentageToDP('29%'), height: widthPercentageToDP('5%'), marginLeft: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('2%'), fontFamily: 'Montserrat-Regular', justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: '#F3DDB6' }}>
                                <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'Montserrat-Bold', fontSize: 10 }}>In-progress</Text>
                            </View>

                        </View>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start',
                        }}>
                            <Text style={{ justifyContent: 'flex-start', marginLeft: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('2%'), alignItems: 'flex-start', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize}}>{'Type: Assignment & Mapping'}</Text>
                        </View>
                        <View style={{ width: widthPercentageToDP('86%'), borderBottomColor: '#DBDBDB', borderBottomWidth: 1, marginLeft: widthPercentageToDP('2%'), marginRight: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('2%') }} />
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            backgroundColor: '#FFFFFF', justifyContent: 'space-between', alignItems: 'center',
                        }}>
                            <View style={{ flex: 1, justifyContent: 'flex-start', margin: widthPercentageToDP('2%'), flexDirection: 'row' }}>
                                <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize }}>Created Date:</Text>
                                <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize, marginLeft: widthPercentageToDP('1%') }}>{'24 Jul 2019'}</Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'flex-end', margin: widthPercentageToDP('2%'), flexDirection: 'row' }}>
                                <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize }}>Created by:</Text>
                                <Text style={{ justifyContent: 'flex-start', alignItems: 'center', color: '#1D3567', fontFamily: 'Montserrat-Regular', fontSize: fontSize, marginLeft: widthPercentageToDP('1%') }}>{'test@test.com'}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{
                        flex: 1, shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.8,
                        shadowColor: '#CECECE',
                        shadowRadius: 3,
                        borderRadius: 5,
                        marginBottom: widthPercentageToDP('4%'),
                        width: widthPercentageToDP('94%'),
                        padding: widthPercentageToDP('2%'),
                        flexDirection: 'column',
                        elevation: 4,
                        backgroundColor: '#FFFFFF', justifyContent: 'flex-start', alignItems: 'flex-start',
                    }}>

                        <View style={{
                            flex: 1, flexDirection: 'row',
                            margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('1%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: widthPercentageToDP('10'),
                        }} >
                            <View style={{
                                flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                height: widthPercentageToDP('8%'),
                                shadowColor: '#CECECE', backgroundColor: '#00C551',
                                shadowRadius: 3, elevation: 2, padding: widthPercentageToDP('2%'), paddingHorizontal: widthPercentageToDP('2%'), borderRadius: 3
                            }}>
                                <Text style={{ fontFamily: 'Montserrat-Bold', fontSize: fontSize, color: '#FFFFFF' }}>Shipper ID:</Text>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#FFFFFF', marginLeft: 5 }}>PP1023457347</Text>
                            </View>
                        </View>
                        <View style={{
                            flex: 1, flexDirection: 'row',
                            margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('3%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: widthPercentageToDP('13'),
                        }} >
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567' }}>Sequence No:</Text>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567', marginLeft: 5 }}>PP1023457347</Text>
                            </View>

                        </View>
                        <View style={{
                            flex: 1, flexDirection: 'row',
                            margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('3%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: widthPercentageToDP('13'),
                        }} >
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567' }}>Sequence No:</Text>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567', marginLeft: 5 }}>PP1023457347</Text>
                            </View>

                        </View>
                        <View style={{
                            flex: 1, flexDirection: 'row',
                            margin: widthPercentageToDP('2%'), marginTop: widthPercentageToDP('3%'), justifyContent: 'flex-start', alignItems: 'center', marginLeft: widthPercentageToDP('13'),
                        }} >
                            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-start', }}>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567' }}>Sequence No:</Text>
                                <Text style={{ fontFamily: 'Montserrat-Regular', fontSize: fontSize, color: '#1D3567', marginLeft: 5 }}>PP1023457347</Text>
                            </View>

                        </View>

                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F3FD' }}>
                        <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={{
                            flex: 1,
                            height: widthPercentageToDP('12%'),
                            marginLeft: widthPercentageToDP('7%'),
                            marginHorizontal: widthPercentageToDP('6%'),
                            marginTop: widthPercentageToDP('2%'),
                            marginBottom: widthPercentageToDP('5%'),
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.8,
                            shadowColor: '#CECECE',
                            shadowRadius: 3,
                            elevation: 4,
                            backgroundColor: '#FFFFFF',
                            borderRadius: 5, justifyContent: 'center', alignItems: 'center'
                        }}>
                            <Text style={styles.btntextcancel}>{'Cancel'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.refs.modal6.open()}
                            style={{
                                flex: 1,
                                height: widthPercentageToDP('12%'),
                                marginRight: widthPercentageToDP('7%'),
                                marginHorizontal: widthPercentageToDP('6%'),
                                marginTop: widthPercentageToDP('2%'),
                                marginBottom: widthPercentageToDP('5%'),
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.8,
                                shadowColor: '#CECECE',
                                shadowRadius: 3,
                                elevation: 4,
                                backgroundColor: '#FE3547',
                                borderRadius: 5, justifyContent: 'center', alignItems: 'center'
                            }}>
                            <Text style={styles.btntext}>{'Delete'}</Text>
                        </TouchableOpacity></View>
                </View>

            )
        } else {
            null
        }
    }



}


const overlayColor = "rgba(0,0,0,0.7)"; // this gives us a black color with a 50% transparency
const wdt = Dimensions.get("window").width

const rectDimensions = wdt * 0.65; // this is equivalent to 255 from a 393 device width
const rectBorderWidth = wdt * 0.005; // this is equivalent to 2 from a 393 device width
const rectBorderColor = "#1A6DD5";

const scanBarWidth = wdt * 0.56; // this is equivalent to 180 from a 393 device width
const scanBarHeight = wdt * 0.0025; //this is equivalent to 1 from a 393 device width
const scanBarColor = "#22ff00";

const iconScanColor = "#FFFFFF";


export default withNavigation(Scanner);
var styles = StyleSheet.create({

    linearGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    container: {
        justifyContent: "center",
        alignItems: "center",
        // backgroundColor: "#F5FCFF"
    },
    btntext: {
        color: '#FFFFFF',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    btntextcancel: {
        color: '#000000',
        fontFamily: 'Montserrat-Bold',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    overlay: {
        height: Platform.OS === "android" ? Dimensions.get("window").height : null,
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center', alignItems: 'center', alignSelf: 'center'
    },
    rectangleContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent"
    },

    rectangle: {
        height: rectDimensions,
        width: rectDimensions,
        // borderWidth: rectBorderWidth,
        borderColor: rectBorderColor,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent"
    },

    topOverlay: {
        flex: 1,
        height: wdt,
        width: wdt,
        backgroundColor: overlayColor,
        justifyContent: "center",
        alignItems: "center"
    },

    bottomOverlay: {
        flex: 1,
        height: wdt,
        width: wdt,
        backgroundColor: overlayColor,
        // paddingBottom: wdt * 0.25
    },

    leftAndRightOverlay: {
        height: wdt * 0.65,
        width: wdt,
        backgroundColor: overlayColor
    },

    scanBar: {
        width: scanBarWidth,
        height: scanBarHeight,
        marginTop: widthPercentageToDP('90%'),
        backgroundColor: scanBarColor
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
