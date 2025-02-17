import React, {useState} from 'react';
import {View, Text, ViewStyle, Alert} from 'react-native';

import {theme} from '../../constants';
import {components} from '../../components';
import {useAppNavigation} from '../../hooks';
import UserStore from "./UserStore";
import {validateEmailAddress} from "./regexValidation";
import axios from "axios";
import {BASE_URL, ENDPOINTS} from "../../config";

const ForgotPassword: React.FC = (): JSX.Element => {
    const navigation = useAppNavigation();

    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const renderStatusBar = () => {
        return <components.StatusBar/>;
    };

    const renderHeader = () => {
        return <components.Header goBack={true} title='Forgot password'/>;
    };

    const renderDescription = () => {
        const descriptionStyle = {
            ...theme.fonts.DMSans_400Regular,
            fontSize: 16,
            lineHeight: 16 * 1.7,
            color: theme.colors.textColor,
            marginBottom: 30,
        };

        return (
            <Text style={{...descriptionStyle}}>
                Please enter your email address. You will receive a code to create a new
                password via email.
            </Text>
        );
    };

    const renderInputField = () => {
        return (
            <React.Fragment>
                <components.InputField
                    type='email'
                    value={email}
                    placeholder='please enter email address'
                    containerStyle={{marginBottom: 20}}
                    onChangeText={(text) => setEmail(text)}
                />
            </React.Fragment>
        );
    };

    const renderContent = () => {
        const styles: ViewStyle = {
            flexGrow: 1,
            paddingHorizontal: 20,
            borderTopEndRadius: 10,
            borderTopStartRadius: 10,
            marginTop: 10,
        };

        const blockStyle = {
            backgroundColor: theme.colors.white,
            paddingVertical: 30,
            paddingHorizontal: 20,
            borderRadius: 10,
        };

        return (
            <components.KAScrollView contentContainerStyle={{...styles}}>
                <View style={{...blockStyle}}>
                    {renderDescription()}
                    {renderInputField()}
                    {renderButton()}
                </View>
            </components.KAScrollView>
        );
    };

    const renderButton = () => {
        return (
            <components.Button
                title='send'
                onPress={async () => {
                    if (!email) {
                        Alert.alert('Password restoration failed', 'You have not entered your email address');
                    } else if (!validateEmailAddress(email)) {
                        Alert.alert('Password restoration failed', "You have not entered a valid email.");
                    } else {
                        if (!loading){
                        try {
                            setLoading(true);
                            const response = await axios.post(`${BASE_URL}${ENDPOINTS.auth.signup}`, {
                                    username: email,
                                    forgot_password: true
                                },
                                {
                                    validateStatus: function (status) {
                                        return status >= 200 && status < 500;
                                    }
                                });
                            if (response.data.success) {
                                UserStore.setEmail(email)
                                setLoading(false);
                                // @ts-ignore
                                navigation.navigate('ConfirmationCode',  {forgotPassword: true});
                            } else {
                                setLoading(false);
                                Alert.alert('Password restoration failed', response.data.error);
                            }
                        } catch (error) {
                            setLoading(false);
                            Alert.alert('Password restoration failed', 'Please email us on support@likour.com');
                        }
                    }
                }}}
            />
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

export default ForgotPassword;
