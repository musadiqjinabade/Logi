import {
    Text, View, FlatList, StatusBar, TextInput, StyleSheet, Image, Linking, AsyncStorage, TouchableOpacity, ToastAndroid, Dimensions, ActivityIndicator, 
    AppState,
    Platform,
    PermissionsAndroid,
    BackHandler,
    DeviceEventEmitter
} from 'react-native';
import { withNavigation } from 'react-navigation';
import { Button, Container, Title, Header, Left} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import SvgUri from 'react-native-svg-uri';
import { ScrollView } from 'react-native-gesture-handler';
import QRCodeScanner from "react-native-qrcode-scanner";
import svgImages from '../Images/images';
import * as Animatable from "react-native-animatable";
import APIService from '../component/APIServices';
import moment from "moment";
import Sound from 'react-native-sound';
import ImagePicker from 'react-native-image-crop-picker';
import DataWedgeIntents from 'react-native-datawedge-intents';

import React, { Component } from 'react';
import {  ScanditModule,
    Barcode,
    ScanSettings
} from 'scandit-react-native';


ScanditModule.setAppKey('AXZORj2nI0ZMHjyLexkWTD4mrkrjAEPrtXgCuecYbnjOFdU2d23g4BJzs00JbnSO9kZAtpNswn8ATLqojjZJ/zdz7cwHRaD3dxaoV/VDmq+bYuAxWjA/tTsxsMngOuBhZTdlDeMaFiuBYAOCQ3ldwMdCLOSZLmo1ltZ59+gN01VbmCtcFAiZKWwF4+5a5Hi1DQLxcGLgOtGJzGKs/rWsXKXKxTIazPt2z2VM+dK1y15HR9lI3RAKV5JWpoxKPIXrHij7fNep4cdwOWXnps4NQy7w4USWe9iWo7J/IC4IrmHAbz/QkOR1ZZiMOJmOF9ME9Ty3eMmIAEZSPIbcREpUmDwtMVJHcH02cMF1AExn1cdeinIWPNitXETQR0RCNfJJVwL3ktcUkqo9lmSySZHRdKNM87laMm11SqF60IX5koMGGADrVaw8yb2Zxvk1EHzaT6J+0gQmc50QbUt051D6yTlmGJkWUfRnRIHqqcFrWMNeL8fNbl0l3ewIOmDl06nddaTFqHKTVPR+LCugEXjN4xZvOIwA4RlBrXnvLcL10DuTN30mavL0FeqZ/v33s95D5yKIAmgGpIakYljrxoeuvb+OI8E3r7eBx2iJ6ycfXztY6q3kIqeL2Xva4bH23EmlvV1VAQ21iaiTc6eX5+9Q+3XJSDLPYHDKn1srwI2zzEx68IopPQUKQpui6hVIlbPTPBRwNNi1vgqu132Qp7k5zXlxt6NAisMHzeCIQgBOfaDjHDVwWFMcC6drp53LtQFVCru/gPAz2ttDocEZm0Rgr0reHrWups6jo4afQLzkhbLqQ5md4Hw=');


class AuditScanProduct extends Component {
    static navigationOptions = { header: null }
    constructor(props) {
        super(props);
        this.state = {
            selectedItems: [],
            focus: false,
            username: '',
            products: '',
            heightProduct: widthPercentageToDP('85%'),
            heightExpiry: widthPercentageToDP('85%'),
            heightmanufac: widthPercentageToDP('85%'),
            heightMRP: widthPercentageToDP('85%'),
            height: 40,
            newValue: '',
            model: false,
            data: '',
            isVisible: true,
            checked: false,
            capture: true,
            photo_data: [],
            flash: false,
            progressText: 'Loading...',
            seqnumber: {}

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

    updateSize = (height) => {
        this.setState({
            height: height
        });
    }

    updateSizeProduct = (height) => {
        this.setState({
            heightProduct: height
        });
    }

    updateSizeMRP = (height) => {
        this.setState({
            heightMRP: height
        });
    }

    updateSizemanufac = (height) => {
        this.setState({
            heightmanufac: height
        });
    }

    updateSizeExpiry = (height) => {
        this.setState({
            heightExpiry: height
        });
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

    async saveandcomplete() {
        var data = {}
        data.sequence_number = this.state.audit_data.sequence_number
            data.level_type_id = this.state.audit_data.level_id
            data.product_id = this.state.audit_data.level_id
            data.image_url = null
            data.comment = this.state.newValue
            data.assignment_mapping_id = this.state.audit_data.assignment_mapping_id
        var Updatedata = await APIService.execute('POST', APIService.URLBACKEND + 'audit/saveauditdetail', data)
        if (Updatedata.data.status_code == 200) {
            this.setState({ model: false, delete: false, Updatedata: '' }, () => {
                ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);
            })
        }
        else if (Updatedata.data.status_code == 400) {
            ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);

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
        // console.log("prop data:", this.props.navigation.state.params.item)
        var model = await AsyncStorage.getItem('deviceModel')
        console.log('model', model);
        this.setState({ model: true, /*props: this.props.navigation.state.params.item,*/ deviceModel: model }, () => {
            console.log("prop data:", this.state.props)
        });

    }


    upload() {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: false,
            mediaType: 'photo',
            compressImageQuality: 0.7
        }).then(async response => {
            this.setState({ url: response })
        });
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



    async checkForCameraPermission() {
        const hasPermission = await this.hasCameraPermission();
        if (hasPermission) {
            this.cameraPermissionGranted();
        } else {
            await this.requestCameraPermission();
        }
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

    scabByZebra(session) {
        console.log('session.data', session.data)
        var sURLVariables = session.data != null ? session.data.split('/')[3] : null
        console.log("sURLVariables:", sURLVariables);
        // this.playSound()
        session.data != null ?
            this.setState({ data: session.data, delete: true, sURLVariables: sURLVariables, seqnumber: { ...this.state.seqnumber, [sURLVariables]: !this.state.seqnumber[sURLVariables] } }, () => {
                console.log("sURLVariables", this.state.seqnumber)
                this.Updatedata();
            }) : null

        this.timeout = setTimeout(function () {
            clearTimeout(this.timeout)
            // this.scanner.resumeScanning();
        }.bind(this), 5000)
    }

    render() {
        const hgt = Dimensions.get("window").height

        const wdt = Dimensions.get("window").width

        return (
            <Container style={{ flex: 1, backgroundColor: '#F1EFEE' }}>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['#1D3567', '#1C6DAE']} >
                    <Header transparent>
                        <Left style={{ flex: 1, justifyContent: 'flex-start', marginLeft: 10, flexDirection: 'row', alignItems: 'center' }} >
                            <Button style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: "transparent", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0, shadowRadius: 0, elevation: 0, marginLeft: widthPercentageToDP('-6%') }}
                                onPress={() => this.props.navigation.goBack()}>
                                <SvgUri width="30" height="20" fill="#FFFFFF" svgXmlData={svgImages.left_arrow} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center', margin: widthPercentageToDP('2%') }} />
                                {/* <Title style={{ justifyContent: 'flex-start', alignItems: 'center',fontSize:16, fontFamily: 'Montserrat-Bold', marginLeft: widthPercentageToDP('1%') }} >{this.state.model  ? this.state.delete ?"Scan Each to Delete": "Scan Each QR Code" :this.state.delete ?"Scan Each to Delete": "Scan Each "}</Title> */}
                                <Title style={{ justifyContent: 'flex-start', alignItems: 'center', fontSize: 16, fontFamily: 'Montserrat-Bold', marginLeft: widthPercentageToDP('1%') }} >{"Scan Each QR Code"}</Title>
                            </Button>
                        </Left>
                    </Header>
                </LinearGradient>
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

                        {this.bottomrender()}
                    </ScrollView>
                </View>
                {this.renderModalContent()}

            </Container>

        );

    }




    onScan(session) {
        this.scanner.pauseScanning();
        // console.log("item link scan:",e)
        if (this.state.delete) {
            this.setState({ data: session.newlyRecognizedCodes[0].data, start: true });
            console.log("delete:true:", session.newlyRecognizedCodes[0].data)

            var data = session.newlyRecognizedCodes[0].data;

            var sURLVariables = data.split('/')[3]
            console.log("sURLVariables:", sURLVariables);
            this.playSound()

            this.setState({ data: session.newlyRecognizedCodes[0].data, sURLVariables: sURLVariables }, () => {
                // console.log("item link scan:",e)
                this.Updatedata();
                // setTimeout(() => { this.scanner.resumeScanning(); }, 5000);
                // this.setState({scannerload:false})
            })


        } else {
            var sURL_Variables = session.newlyRecognizedCodes[0].data.split('/')[3]
            // console.log("sURLVariables:",sURLVariables);
            this.playSound()

            this.setState({ data: session.newlyRecognizedCodes[0].data, delete: true, sURLVariables: sURL_Variables, }, () => {
                // console.log("item link scan:",e)
                this.Updatedata();
                // this.scanner.pauseScanning()
                // setTimeout(() => { this.scanner.resumeScanning(); }, 5000);
                // this.setState({scannerload:false})

                // ToastAndroid.show(this.state.data.data, ToastAndroid.LONG,ToastAndroid.BOTTOM, 25, 100);
                // Toast.show({ text: `Successfully Scan`, position: 'bottom', buttonText: 'OK' })
                // Toast.show({
                //     text: `Successfully Scan`,
                //     buttonText: "Okay",
                //     duration: 1500,
                //     buttonStyle: { backgroundColor: "#00ff00" },
                //     style: { backgroundColor: "#00ff00" },
                //   })
            })
        }
        this.timeout = setTimeout(function () {
            clearTimeout(this.timeout)
            this.scanner.resumeScanning();
        }.bind(this), 5000)
    }

    async Updatedata() {
        var logintoken = await AsyncStorage.getItem('loginData');
        var decoded = ''
        if (logintoken) {
            logintoken = JSON.parse(logintoken);
            var jwtDecode = require('jwt-decode');
            decoded = jwtDecode(logintoken.token);
            console.log('decoded:', decoded)
        }

        // var data = {}
        // data.mapping_id = this.state.props.data.data.mapping_id
        // data.sequence_number = this.state.sURLVariables
        // data.location_id = decoded.location_id[0];
        // console.log("body:", data);
        var Updatedata = await APIService.execute('GET', APIService.URLBACKEND + 'audit/auditdetail?sequence_number=' + this.state.sURLVariables, null)
        this.setState({ message: Updatedata.data.data.message }, () => {
            if (Updatedata.data.status_code == 200) {
                console.log('audit:', Updatedata)

                ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);
                this.setState({ model: true, audit_data: Updatedata.data.data.audit_details[0], audit_product: Updatedata.data.data.product_details })
                // this.setState({ })


            } else if (Updatedata.data.status_code == 400) {
                ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);
            }
        })
        // if(Updatedata.data.status_code == 400){

        //     ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);
        // }
        // if (Updatedata.data.status_code == 200) {
        //     ToastAndroid.show(this.state.message, ToastAndroid.LONG, 25, 50);

        // } else if (Updatedata.data.status_code == 400) {
        // console.log("Updatedata:", Updatedata.data.message);
        //     ToastAndroid.show(Updatedata.data.message, ToastAndroid.LONG, 25, 50);
        // }

        /** */

        // var scan = await APIService.execute('GET', APIService.URLBACKEND + 'mapping/getmappingsummary?mapping_id=' + this.state.props.data.data.mapping_id, null)
        // this.setState({ job_detail: scan.data.data.job_detail[0], Updatedata: scan.data.data.assignment_mapping },()=>{
        //     // console.log("update:",this.state.Updatedata[0])
        //     // var levels1=[]
        //     // levels1.push(this.state.Updatedata)
        //     // for(i=0; i<levels1.length; i++){
        //         if(scan.data.data.assignment_mapping.length>0?this.state.Updatedata[0].level_id == 2:false){
        //             console.log("levels1[i].level_id:",this.state.Updatedata[0].level_id)
        //             this.setState({ levels:true})
        //         }
        //     // }


        // })
        // console.log("scan summary:", scan)

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


    onSuccess = e => {
        Linking
        // console.log("item link scan:",e)
        if (this.state.delete) {
            this.setState({ data: e });
            console.log("delete:true:", e)

            var sURLVariables = e.data.split('/')[3]
            console.log("sURLVariables:", sURLVariables);
            this.playSound()

            this.setState({ data: e, delete: true, sURLVariables: sURLVariables }, () => {
                console.log("item link scan:", e)
                setTimeout(() => { this.setState({ timePassed: false }) }, 5000);
                this.Updatedata();

            })


        } else {
            var sURL_Variables = e.data.split('/')[3]
            console.log("sURLVariables:", sURL_Variables);
            this.playSound()

            this.setState({ data: e, delete: true, sURLVariables: sURL_Variables }, () => {
                console.log("item link scan:", e)
                setTimeout(() => { this.setState({ timePassed: false }) }, 5000);
                this.Updatedata();
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

    bottomrender = () => {
        const {  height, newValue, photo_data } = this.state
        let newStyle = {
            height,
            width: widthPercentageToDP('90%'),
            fontFamily: 'Montserrat-Regular',
        }
        if (this.state.model) {
            return (
                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF' }}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF', margin: widthPercentageToDP('4%') }}>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                            {/* <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'Montserrat-Bold' }}>{"Lenovo- Lapi L2765"}</Text> */}
                            <Text style={{ justifyContent: 'center', alignItems: 'center', fontFamily: 'Montserrat-Regular' }}>Sequence No: {this.state.audit_data ? this.state.audit_data.sequence_number : '---'}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5FCFF', margin: widthPercentageToDP('2%') }}>
                        <TouchableOpacity
                            onContentSizeChange={(e) => this.updateSizeProduct(e.nativeEvent.contentSize.height)}
                            style={{
                                width: widthPercentageToDP('94%'),
                                height: widthPercentageToDP('12%'),
                                marginTop: widthPercentageToDP('2%'),
                                marginBottom: widthPercentageToDP('2%'),
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
                            <Text onContentSizeChange={(e) => this.updateSizeProduct(e.nativeEvent.contentSize.height)} style={styles.selectproducts}>Product Name: {this.state.audit_product != null ? this.state.audit_product[0].product_name != null ? this.state.audit_product[0].product_name : '---' : '---'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            width: widthPercentageToDP('94%'),
                            height: widthPercentageToDP('12%'),
                            marginTop: widthPercentageToDP('2%'),
                            marginBottom: widthPercentageToDP('2%'),
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
                            <Text style={styles.selectproducts}>{"MRP:"}</Text>
                            <Text onContentSizeChange={(e) => this.updateSizeMRP(e.nativeEvent.contentSize.height)} style={styles.selectproducts}>{this.state.audit_data ? this.state.audit_data.product_mrp : "---"}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onContentSizeChange={(e) => this.updateSizeMRP(e.nativeEvent.contentSize.height)}
                            style={{
                                width: widthPercentageToDP('94%'),
                                marginTop: widthPercentageToDP('2%'),
                                marginBottom: widthPercentageToDP('2%'),
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
                            <Text onContentSizeChange={(e) => this.updateSizemanufac(e.nativeEvent.contentSize.height)} style={styles.selectproducts}>Manufacturing Date: {this.state.audit_data ? this.state.audit_data.manu_date != null ? moment.unix(this.state.audit_data.manu_date).format('DD MMM, YYYY') : '---' : '---'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            width: widthPercentageToDP('94%'),
                            height: widthPercentageToDP('12%'),
                            marginTop: widthPercentageToDP('2%'),
                            marginBottom: widthPercentageToDP('2%'),
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
                            <Text style={styles.selectproducts}>{"Expiry Date:"}</Text>
                            <Text onContentSizeChange={(e) => this.updateSizeExpiry(e.nativeEvent.contentSize.height)} style={styles.selectproducts}> {this.state.audit_data ? this.state.audit_data.exp_date != null ? moment.unix(this.state.audit_data.exp_date).format('DD MMM, YYYY') : '---' : '---'}</Text>
                        </TouchableOpacity>

                        <View style={{
                            flex: 1,
                            // marginLeft: widthPercentageToDP('4%'),
                            marginTop: widthPercentageToDP('4%'),
                            width: widthPercentageToDP('94%'),
                            height: widthPercentageToDP('10%'),
                            flexDirection: 'column',
                            backgroundColor: '#F5FCFF', justifyContent: 'flex-start', alignItems: 'flex-start',
                        }}>
                            <Text style={{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', fontFamily: 'Montserrat-Regular', }}>Comment:</Text>
                        </View>

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
                            <TextInput placeholderTextColor='grey' editable={true} style={{ flex: 1, width: widthPercentageToDP('90%'), fontFamily: 'Montserrat-Regular', marginLeft: 10, fontSize: 14, justifyContent: 'flex-start', height: 80/*,width:270,marginBottom:10, marginLeft:5,backgroundColor: 'white',marginTop:5,borderRadius: 5,shadowColor: 'grey',shadowOffset: { width: 0, height: 1 },shadowOpacity: 3,elevation: 3,shadowRadius:1*/ }}
                                placeholder={'Enter your comment here.'}
                                placeholderStyle={{ fontWeight: 'bold', fontFamily: 'Montserrat-Regular', fontSize: 20 }} onChangeText={(newValue) => this.setState({ newValue })} style={[newStyle]} multiline={true} value={newValue} onContentSizeChange={(e) => this.updateSize(e.nativeEvent.contentSize.height)} />
                        </View>

                        {photo_data ?
                            <View style={{
                                flex: 1,
                                borderRadius: 5,
                                // marginLeft: widthPercentageToDP('4%'),
                                // marginRight: widthPercentageToDP('4%'),
                                marginBottom: widthPercentageToDP('4%'),
                                // width: widthPercentageToDP('94%'),
                                flexDirection: 'row',
                                // elevation: 4,
                                backgroundColor: "#F5FCFF", justifyContent: 'flex-start', alignItems: 'flex-start',
                            }}>
                                <FlatList
                                    data={photo_data}
                                    renderItem={({ item }) => (
                                        <ScrollView>
                                            <Image source={item} style={{
                                                width: widthPercentageToDP('90%'),
                                                height: widthPercentageToDP('60%'),
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                alignItems: 'center', resizeMode: 'contain',
                                                // justifyContent: 'flex-start', alignItems: 'flex-start' , 
                                                borderRadius: 5, margin: widthPercentageToDP('2%')
                                            }} />
                                        </ScrollView>

                                    )}
                                />
                            </View> :
                            null}


                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                            <SvgUri width="32" height="22" svgXmlData={svgImages.plus} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                            <TouchableOpacity
                                // onPress={() => this.setState({capture: false})}
                                onPress={() => this.upload()}

                                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: widthPercentageToDP('7%') }}>
                                <SvgUri width="35" height="25" svgXmlData={svgImages.photo_camera} style={{ resizeMode: 'contain', justifyContent: 'flex-start', alignItems: 'center' }} />
                            </TouchableOpacity>
                        </View>


                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
                            <TouchableOpacity
                                onPress={() => this.saveandcomplete()}
                                style={{
                                    flex: 1,
                                    height: widthPercentageToDP('12%'),
                                    marginRight: widthPercentageToDP('7%'),
                                    marginHorizontal: widthPercentageToDP('7%'),
                                    marginTop: widthPercentageToDP('2%'),
                                    marginBottom: widthPercentageToDP('2%'),
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.8,
                                    shadowColor: '#CECECE',
                                    shadowRadius: 3,
                                    elevation: 4,
                                    backgroundColor: '#65CA8F',
                                    borderRadius: 5, justifyContent: 'center', alignItems: 'center'
                                }}>
                                <Text style={styles.btntext}>{'Save & Complete'}</Text>
                            </TouchableOpacity></View>
                    </View>
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


export default withNavigation(AuditScanProduct);
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

    selectproducts: {
        fontFamily: 'Montserrat-Regular',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: widthPercentageToDP('2%'),
        marginLeft: widthPercentageToDP('1%'),
        color: '#636363'
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



