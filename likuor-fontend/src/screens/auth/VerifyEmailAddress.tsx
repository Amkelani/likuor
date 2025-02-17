import {View, TextInput, Alert} from 'react-native';
import React, {useState, useRef} from 'react';
import {text} from '../../text';
import {theme} from '../../constants';
import UserStore from './UserStore'
import {components} from '../../components';
import {useAppNavigation} from '../../hooks';
import {BASE_URL, ENDPOINTS} from '../../config';
import axios from 'axios';
import userStore from "./UserStore";

const VerifyEmailAddress: React.FC = (): JSX.Element => {
    const navigation = useAppNavigation();

    const inp1Ref = useRef<TextInput>({
        focus: () => {
        }
    } as TextInput);

    const email = UserStore.getEmail()
    const renderStatusBar = () => {
        return <components.StatusBar/>;
    };

    const renderHeader = () => {
        return <components.Header goBack={true} title='Verify your email address'/>;
    };

    const renderButton = () => {
        return (
            <components.Button
                title='confirm'
                containerStyle={{marginBottom: 20}}
                onPress={async () => {
                    try {
                        const response = await axios.post(`${BASE_URL}${ENDPOINTS.auth.emailVerify}`, {
                            username: email
                        }, {
                            validateStatus: function (status) {
                                return status >= 200 && status < 500;
                            }
                        });
                        if (response.data.success) {
                            UserStore.setEmail(email)
                            navigation.navigate('ConfirmationCode');
                        } else {
                            Alert.alert('Authentication Failed', response.data.message);
                        }
                    } catch (error) {
                        console.log(error)
                        Alert.alert('Error', 'Something went wrong. Please try again.');
                    }
                }}
            />
        );
    };

    const renderDescription = () => {
        return (
            <text.T16 style={{marginBottom: 30}}>
                We will send an email to the email address below. Please confirm the email address.
            </text.T16>
        );
    };

    const renderInputField = () => {
        return (
            <View>
                <components.InputField
                    type='email'
                    innerRef={inp1Ref}
                    value={email}
                    placeholder={email}
                    keyboardType='email-address'
                    containerStyle={{marginBottom: 20}}
                    onChangeText={(text) => userStore.setEmail(text)}
                />
            </View>
        );
    };

    const renderContent = () => {
        return (
            <components.KAScrollView
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 30,
                    marginHorizontal: 20,
                    backgroundColor: theme.colors.white,
                    borderRadius: 10,
                }}
                style={{flexGrow: 0}}
            >
                {renderDescription()}
                {renderInputField()}
                {renderButton()}
            </components.KAScrollView>
        );
    };

    const renderHomeIndicator = () => {
        return <components.HomeIndicator/>;
    };

    return (
        <components.SmartView>
            {renderStatusBar()}
            {renderHeader()}
            {renderContent()}
            {renderHomeIndicator()}
        </components.SmartView>
    );
};

export default VerifyEmailAddress;
