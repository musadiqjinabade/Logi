// // import NetInfo from "@react-native-community/netinfo";
// import { AsyncStorage, Platform, NetInfo } from 'react-native';



// export default class Internet {
//   constructor(props) {
//     this.state = {
//         isConnected: true,
//         // connection_Status: true,
//         // retryload: false,
//         // refreshing: false,
//     }
//   }



// //   static async getConnectionInfo() {
// //     if (Platform.OS === 'ios') {
// //         return new Promise((resolve, reject) => {
// //             const connectionHandler = connectionInfo => {
// //                 NetInfo.removeEventListener('connectionChange', connectionHandler)
// //                 resolve(connectionInfo)
// //             }

// //             NetInfo.addEventListener('connectionChange', connectionHandler)
// //         })
// //     }
// //     return NetInfo.getConnectionInfo();

// // }

//     static async checkInternet(){
//         NetInfo.addEventListener('connectionChange', async (isConnected) => {
//             if (isConnected) {
//             //   this.setState({ isConnected: isConnected }, async () => {
//                 try {
//                   let req = await fetch('https://www.google.com');
//                   let hasConnection = req.status === 200;
//                   if (hasConnection) {
//                     new Promise((resolve, reject) => {
//                         return true
                        
            
//                     })
//                   } else {
//                     return new Promise.resolve({
//                         success: false,
//                     })
//                   }
//                 }
//                 catch (error) {return new Promise.resolve({
//                     success: false,
//                     errorMessage: 'Please re-login to continue!'
//                 }) }
              
//             } else { return new Promise.resolve({
//                 success: true,
//             }) }
//           });
//     }
// }