import React, {useState, useRef} from 'react';
import {View, ViewStyle, TextInput, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import axios from 'axios';
import {Alert} from "react-native";
import {text} from '../../text';
import {svg} from '../../assets/svg';
import {theme} from '../../constants';
import {components} from '../../components';
import {useAppNavigation} from '../../hooks';
import {homeIndicatorHeight} from '../../utils';
import {BASE_URL, ENDPOINTS} from '../../config';
import UserStore from './UserStore'
import {validatePhoneNumber, validateEmailAddress, validatePassword} from "./regexValidation";

const SignUp: React.FC = (): JSX.Element => {
    const navigation = useAppNavigation();
    const [email, setEmail] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [consent, setConsent] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
    const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState<boolean>(true);
    const [eyeOffIcon, setEyeOffIcon] = useState<boolean>(true);
    const [eyeOffIconConfirm, setEyeOffIconConfirm] = useState<boolean>(true);
    const toggleSecureTextEntry = () => {
        setSecureTextEntry(!secureTextEntry);
        setEyeOffIcon(!eyeOffIcon);
    };
    const toggleConfirmSecureTextEntry = () => {
        setSecureConfirmTextEntry(!secureConfirmTextEntry);
        setEyeOffIconConfirm(!eyeOffIconConfirm);
    };
    const inp1Ref = useRef<TextInput>({
        focus: () => {
        }
    } as TextInput);
    const inp2Ref = useRef<TextInput>({
        focus: () => {
        }
    } as TextInput);
    const inp3Ref = useRef<TextInput>({
        focus: () => {
        }
    } as TextInput);
    const inp4Ref = useRef<TextInput>({
        focus: () => {
        }
    } as TextInput);

    const renderStatusBar = () => {
        return <components.StatusBar/>;
    };
    const renderLogo = () => {
        return <View style={{
            flexDirection: 'column-reverse',
            alignItems: 'center'
        }}>
            <Image source={require('../../../assets/logo-without-background-Photoroom.png')}
                   style={{width: 300, height: 300, resizeMode: "contain"}}/>
        </View>
    }
    const renderHeader = () => {
        return <components.Header goBack={true}/>;
    };

    const renderMainText = () => {
        return <text.H1 style={{marginBottom: 30}}>Sign up</text.H1>;
    };

    const renderInputFields = () => {
        return (
            <React.Fragment>
                <components.InputField
                    type='email'
                    value={email}
                    // checkIcon={true}
                    innerRef={inp2Ref}
                    placeholder='please enter email address'
                    containerStyle={{marginBottom: 14}}
                    onChangeText={(text) => setEmail(text)}
                />
                <components.InputField
                    type='phone'
                    value={phoneNumber}
                    innerRef={inp2Ref}
                    keyboardType={"phone-pad"}
                    placeholder='please enter phone number'
                    containerStyle={{marginBottom: 14}}
                    onChangeText={(text) => setPhoneNumber(text)}
                />
                <components.InputField
                    type='password'
                    value={password}
                    eyeOffIcon={eyeOffIcon}
                    secureTextEntry={secureTextEntry}
                    toggleSecureTextEntry={toggleSecureTextEntry}
                    placeholder='Please enter your password'
                    onChangeText={(text) => setPassword(text)}
                    containerStyle={{marginBottom: 20}}
                />
                <components.InputField
                    type='password'
                    value={confirmPassword}
                    eyeOffIcon={eyeOffIconConfirm}
                    secureTextEntry={secureConfirmTextEntry}
                    toggleSecureTextEntry={toggleConfirmSecureTextEntry}
                    placeholder='please verify password'
                    onChangeText={(text) => setConfirmPassword(text)}
                    containerStyle={{marginBottom: 20}}
                />

            </React.Fragment>
        );
    };

    const renderConsent = () => {
        return (
            <TouchableOpacity
                style={{flexDirection: 'row', alignItems: 'center'}}
                onPress={() => setConsent(!consent)}
            >
                <View
                    style={{
                        width: 18,
                        height: 18,
                        backgroundColor: '#E6EFF8',
                        borderRadius: 4,
                        marginRight: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {consent && (
                        <View
                            style={{
                                width: 10,
                                height: 10,
                                borderRadius: 2,
                                backgroundColor: theme.colors.mainTurquoise,
                            }}
                        />
                    )}
                </View>
                <text.T14>I am over the age of 18</text.T14>
            </TouchableOpacity>
        );
    };

    const renderAdditionalButtons = () => {
        const containerStyle: ViewStyle = {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 40,
        };

        return (
            <View style={{...containerStyle}}>
                {renderConsent()}
            </View>
        );
    };
    const renderButton = () => {
        return (
            <View>
            <components.Button
                title='Sign up'
                loading={loading}
                containerStyle={{marginBottom: 20}}
                onPress={async () => {
                    if (!email || !phoneNumber || !password) {
                        Alert.alert('Sign up failed', "Email, password & phone number are required!");
                    } else if (password != confirmPassword) {
                        Alert.alert('Sign up failed', "Password does not match.");
                    } else if (!consent) {
                        Alert.alert('Sign up failed', "Sorry, you need to be above the age of 18 to sign up.");
                    } else if (!validateEmailAddress(email)) {
                        Alert.alert('Sign up failed', "You have not entered a valid email.");
                    } else if (!validatePhoneNumber(phoneNumber)) {
                        Alert.alert('Sign up failed', "You have not entered a valid phone number.");
                    } else if (!validatePassword(password)) {
                        Alert.alert('Sign up failed', "Password must contain the following: \n\n" +
                            "> At least 8 characters long\n" +
                            "> Contains at least one lowercase letter\n" +
                            "> Contains at least one uppercase letter\n" +
                            "> Contains at least one numeric digit\n" +
                            "> Contains at least one special character ");
                    } else {
                        if (!loading) {
                            try {
                                setLoading(true);
                                const response = await axios.post(`${BASE_URL}${ENDPOINTS.auth.signup}`, {
                                        username: email,
                                        email: email,
                                        password: password,
                                        phone_number: phoneNumber
                                    });
                                if (response.data.success) {
                                    UserStore.setEmail(email)
                                    setLoading(false);
                                    // @ts-ignore
                                    navigation.navigate('ConfirmationCode', {forgotPassword: false});
                                } else {
                                    setLoading(false);
                                    Alert.alert('Sign up failed', response.data.error);
                                }
                            } catch (error) {
                                setLoading(false);
                                Alert.alert('User registration failed', 'Please email us on support@likour.com');
                            }
                        }
                    }
                }}
            />
            </View>
        );
    };

    const renderAlreadyHaveAccount = () => {
        return (
            <components.ParsedText
                parse={[
                    {
                        pattern: /Sign in./,
                        style: {color: theme.colors.mainTurquoise},
                        onPress: () => navigation.replace('SignIn'),
                    },
                ]}
            >
                Already have an account? Sign in.
            </components.ParsedText>
        );
    };

    const renderContent = () => {
        const styles: ViewStyle = {
            flexGrow: 1,
            backgroundColor: theme.colors.white,
            paddingHorizontal: 20,
            marginHorizontal: 20,
            borderTopEndRadius: 10,
            borderTopStartRadius: 10,
            // justifyContent: 'center',
            // marginTop: 10,
        };

        return (
            <components.KAScrollView contentContainerStyle={{...styles}}>
                {renderLogo()}
                {renderMainText()}
                {renderInputFields()}
                {renderAdditionalButtons()}
                {renderButton()}
                {renderAlreadyHaveAccount()}
            </components.KAScrollView>
        );
    };

    const renderFooter = () => {
        const styles: ViewStyle = {
            backgroundColor: theme.colors.white,
            width: '48%',
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
        };

        return (
            <View
                style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: 20,
                    justifyContent: 'space-between',
                    marginTop: 10,
                    marginBottom: homeIndicatorHeight() === 0 ? 20 : 10,
                }}
            >
                <View style={{...styles}}>
                    <svg.FacebookSvg/>
                </View>
                <View style={{...styles}}>
                    <svg.GoogleSvg/>
                </View>
            </View>
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
            {/*{renderFooter()}*/}
        </components.SmartView>
    );
};

export default SignUp;
