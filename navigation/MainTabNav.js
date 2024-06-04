import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createStackNavigator } from '@react-navigation/stack'
import { TabBar } from '../components'
import Home from '../screens/Home'
import { COLORS } from '../constants'
import Settings from '../screens/Settings'
import Products from '../screens/Products'
import MyOrders from '../screens/MyOrders'
import Inventory from '../screens/Products/Inventory'
import InventoryDetails from '../screens/Products/Details'
import Cart from '../screens/Cart'
import FeedBack from '../screens/FeedBack'

const Stack = createStackNavigator()

function MainTabNav () {
  const Tab = createBottomTabNavigator()
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: COLORS.white }
      }}
      initialRouteName={'Home'}
      tabBar={props => <TabBar {...props} />}
    >
      <Tab.Screen name='Home' component={HomeStack} />
      <Tab.Screen name='Inventory' component={InventoryStack} />
      <Tab.Screen name='User' component={MyOrders} />
      <Tab.Screen name='Cart' component={Cart} />
      <Tab.Screen name='Settings' component={SettingsStack} />
    </Tab.Navigator>
  )
}

export default MainTabNav

function HomeStack () {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'card'
      }}
    >
      <Stack.Screen name='Home' component={Home} />
      <Stack.Screen name='Products' component={Products} />
      <Stack.Screen name='InventoryDetails' component={InventoryDetails} />
    </Stack.Navigator>
  )
}

function SettingsStack () {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'card'
      }}
    >
      <Stack.Screen name='Settings' component={Settings} />
      <Stack.Screen name='FeedBack' component={FeedBack} />
    </Stack.Navigator>
  )
}

function InventoryStack () {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'card'
      }}
    >
      <Stack.Screen name='Inventory' component={Inventory} />
      <Stack.Screen name='InventoryDetails' component={InventoryDetails} />
    </Stack.Navigator>
  )
}
