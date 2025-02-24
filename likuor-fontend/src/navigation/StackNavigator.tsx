import { View, Text } from 'react-native';
import React from 'react';
import { Stack } from '../hooks';
import { screens } from '../screens';
import TabNavigator from './TabNavigator';

interface StackNavigatorProps {
        initialRouteName: string;
}

const StackNavigator: React.FC<StackNavigatorProps> = ({ initialRouteName }) => {
        return (
            <Stack.Navigator initialRouteName={initialRouteName}>
                    <Stack.Screen
                        name="Onboarding"
                        component={screens.Onboarding}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="TabNavigator"
                        component={TabNavigator}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Reviews"
                        component={screens.Reviews}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="LeaveAReview"
                        component={screens.LeaveAReview}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="OrderHistory"
                        component={screens.OrderHistory}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="SignIn"
                        component={screens.SignIn}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="NewPassword"
                        component={screens.NewPassword}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="SignUp"
                        component={screens.SignUp}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Search"
                        component={screens.Search}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ConfirmationCode"
                        component={screens.ConfirmationCode}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="SignUpaccountCreated"
                        component={screens.SignUpaccountCreated}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ForgotPassword"
                        component={screens.ForgotPassword}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="ForgotPasswordSentEmail"
                        component={screens.ForgotPasswordSentEmail}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="EditProfile"
                        component={screens.EditProfile}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Product"
                        component={screens.Product}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Checkout"
                        component={screens.Checkout}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="OrderSuccessful"
                        component={screens.OrderSuccessful}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="OrderFailed"
                        component={screens.OrderFailed}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Menulist"
                        component={screens.Menulist}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="VerifyYourPhoneNumber"
                        component={screens.VerifyYourPhoneNumber}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="TrackYourOrder"
                        component={screens.TrackYourOrder}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="Promocodes"
                        component={screens.Promocodes}
                        options={{ headerShown: false }}
                    />
            </Stack.Navigator>
        );
};

export default StackNavigator;