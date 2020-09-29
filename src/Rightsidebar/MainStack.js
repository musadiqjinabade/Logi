import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';



import Dashboard from '../Dashboard/DashScanner';
import Profile from '../Profile/Profile';


const screens ={
    Dashboard:{
        screen:Dashboard,
        navigationOptions:{
            header: null       
        }
    },
    Profile:{
        screen:Profile,
        navigationOptions:{
            header: null       
         }
    }
}

const MainStack = createStackNavigator(screens,{
    navigationOptions: { header: null },
});

export default createAppContainer(MainStack);