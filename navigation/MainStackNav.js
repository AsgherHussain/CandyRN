import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import Splash from "../screens/Splash"
import Login from "../screens/Login"
import ForgotPassword from "../screens/ForgotPassword"
import AuthLoading from "../screens/AuthLoading"
import MainTabNav from "./MainTabNav"
import Verification from "../screens/ForgotPassword/Verification"
import SetPasswrod from "../screens/ForgotPassword/SetPasswrod"
import Profile from "../screens/Profile"
import PrivacyPolicy from "../screens/PrivacyPolicy"
import TermsCondition from "../screens/TermsCondition"
import AdminPanel from "../screens/AdminPanel"
import ListAllUsers from "../screens/ListAllUsers"
import ListAllSalepersons from "../screens/ListAllSalepersons"
import Notifications from "../screens/Notifications"
import CreateNotification from "../screens/Notifications/CreateNotification"
import AdminFeedback from "../screens/FeedBack/AdminFeedback"
import UploadContent from "../screens/UploadContent"
import ListProduct from "../screens/UploadContent/ListProduct"
import ProductDetails from "../screens/UploadContent/ProductDetails"
import PendingComfimOrder from "../screens/PendingComfimOrder"
import OrderDetails from "../screens/PendingComfimOrder/OrderDetails"
import UserOrders from "../screens/PendingComfimOrder/UserOrders"
import ProfileView from "../screens/Profile/ProfileView"
import InvoicePage from "../screens/PendingComfimOrder/InvoicePage"
import Invoices from "../screens/PendingComfimOrder/Invoices"
import CustomerInvoice from "../screens/MyOrders/CustomerInvoice"
import OrderDetailsForProcess from "../screens/PendingComfimOrder/OrderDetailsForProcess"
import InventoryList from "../screens/Products/InventoryList"
import AdminSettings from "../screens/AdminSettings"
import UserProfiles from "../screens/Profile/UserProfiles"
import SalepersonProfile from "../screens/Profile/SalepersonProfile"
import NewSalesperson from "../screens/Profile/NewSalesperson"

const Stack = createStackNavigator()
function MainStackNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: "card"
      }}
    >
      <Stack.Screen name="Splash" component={Splash} />
      <Stack.Screen name="AuthLoading" component={AuthLoading} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Verification" component={Verification} />
      <Stack.Screen name="SetPasswrod" component={SetPasswrod} />
      <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="TermsCondition" component={TermsCondition} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="MainTabNav" component={MainTabNav} />
      <Stack.Screen name="AdminPanel" component={AdminPanel} />
      <Stack.Screen name="ListAllUsers" component={ListAllUsers} />
      <Stack.Screen name="Notifications" component={Notifications} />
      <Stack.Screen name="UploadContent" component={UploadContent} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="AdminFeedback" component={AdminFeedback} />
      <Stack.Screen name="CreateNotification" component={CreateNotification} />
      <Stack.Screen name="ListProduct" component={ListProduct} />
      <Stack.Screen name="PendingComfimOrder" component={PendingComfimOrder} />
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
      <Stack.Screen
        name="OrderDetailsForProcess"
        component={OrderDetailsForProcess}
      />
      <Stack.Screen name="UserOrders" component={UserOrders} />
      <Stack.Screen name="ProfileView" component={ProfileView} />
      <Stack.Screen name="InvoicePage" component={InvoicePage} />
      <Stack.Screen name="Invoices" component={Invoices} />
      <Stack.Screen name="CustomerInvoice" component={CustomerInvoice} />
      <Stack.Screen name="InventoryList" component={InventoryList} />
      <Stack.Screen name="AdminSettings" component={AdminSettings} />
      <Stack.Screen name="UserProfiles" component={UserProfiles} />
      <Stack.Screen name="ListAllSalepersons" component={ListAllSalepersons} />
      <Stack.Screen name="SalepersonProfile" component={SalepersonProfile} />

      <Stack.Screen name="NewSalesperson" component={NewSalesperson} />
    </Stack.Navigator>
  )
}

export default MainStackNav
