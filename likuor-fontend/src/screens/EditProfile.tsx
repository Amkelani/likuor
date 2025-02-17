import 'react-native-get-random-values';
import axios from 'axios';
import {View, TextInput, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import Image from "../components/custom/Image";
import {svg} from '../assets/svg';

import {theme} from '../constants';
import {showMessage} from '../utils';
import {components} from '../components';
import {useAppNavigation} from '../hooks';
import {validation} from '../utils/validation';
import {setUser} from '../store/slices/userSlice';
import {BASE_URL, ENDPOINTS, CONFIG} from '../config';
import {useAppSelector, useAppDispatch} from '../hooks';
import UserStore from '../screens/auth/UserStore'
import AddressStore from "./auth/AddressStore";
import {setScreen} from "../store/slices/tabSlice";
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';


const styles = StyleSheet.create({
    textInput: {
        borderWidth: 1,
        borderColor: "#DBE9F5",
        height: 50,
        borderRadius: 10,
        paddingLeft: 25,
        marginBottom: 20,
        backgroundColor: "#E9F3F6"
    },
    inputContainer: {
        width: "100%",
    }
});


const EditProfile: React.FC = (): JSX.Element => {
    const navigation = useAppNavigation();
    const [loading, setLoading] = useState<boolean>(false);
    const email = UserStore.getEmail();
    const address = AddressStore.getAddress();
    const [phone, setPhone] = useState<string>('');
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post(`${BASE_URL}${ENDPOINTS.auth.getUser}`, {
                    username: email
                }, {
                    validateStatus: function (status) {
                        return status >= 200 && status < 500;
                    }
                });
                if (response.data.success) {
                    setPhone(response.data.phone_number)
                    AddressStore.setAddress(response.data.address)
                } else {
                    Alert.alert('Authentication Failed', response.data.error);
                }
            } catch (error) {
                console.log(error)
                Alert.alert('Error', 'Something went wrong. Please try again.');
            }
            console.log(email);
        }
        fetchData();
    }, []);


    const renderSearchAddressBar = () => {
        return (
            <View>
                <components.BlockHeading
                    title="Search New Address"
                    containerStyle={{marginHorizontal: 20, marginBottom: 14}}
                />
                <GooglePlacesAutocomplete
                    placeholder='Search ...'
                    onPress={(data, details = null) => {
                        AddressStore.setAddress(data.description)
                    }}
                    query={{
                        key: 'AIzaSyDbVFup-VKE5YABXsFh143a5DxyElq3ieg',
                        language: 'en',
                        components: 'country:za'
                    }}
                    disableScroll={true}
                    styles={{
                        textInput: styles.textInput,
                        container: styles.inputContainer,
                    }}
                />
            </View>
        );
    };

    const renderStatusBar = () => {
        return <components.StatusBar/>;
    };

    const renderHeader = () => {
        return <components.Header goBack={true} title='Edit profile'/>;
    };
    const renderLogo = () => {
        return <View style={{
            flexDirection: 'column-reverse',
            alignItems: 'center'
        }}>
            <Image source={require('../../assets/logo-without-background-Photoroom.png')}
                   style={{width: 300, height: 300, resizeMode: "contain"}}/>
        </View>
    }
    const renderInputFields = () => {
        return (
            <React.Fragment>
                <components.BlockHeading
                    title={email.toLowerCase()}
                    containerStyle={{marginHorizontal: 20, marginBottom: 14}}
                />
                <components.InputField
                    value={phone}
                    placeholder='please enter phone number'
                    onChangeText={(text) => setPhone(text)}
                    type='phone'
                    containerStyle={{marginBottom: 14}}
                />
                <components.InputField
                    value={address}
                    placeholder="Current Address"
                    type='location'
                    editable = {false}
                    containerStyle={{marginBottom: 20}}
                />
            </React.Fragment>
        );
    };

    const renderButton = () => {
        return (
            <View>
                <components.Button
                    title='save changes'
                    loading={loading}
                    onPress={async () => {
                        if (phone.length != 10) {
                            Alert.alert('Update Failed', 'You have entered an invalid phone number. Please start with "0"');
                        } else {
                            if (!loading) {
                                try {
                                    setLoading(true);
                                    const response = await axios.post(`${BASE_URL}${ENDPOINTS.auth.updateUser}`, {
                                        username: email,
                                        phone_number: phone,
                                        address: AddressStore.getAddress()
                                    }, {
                                        validateStatus: function (status) {
                                            return status >= 200 && status < 500;
                                        }
                                    });
                                    if (response.data.success) {
                                        setLoading(false);
                                        navigation.navigate('TabNavigator');
                                    } else {
                                        setLoading(false);
                                        AddressStore.setAddress("")
                                        Alert.alert('Update Failed', response.data.error);
                                    }
                                } catch (error) {
                                    setLoading(false);
                                    Alert.alert('Error', 'Something went wrong. Please try again.');
                                }
                            }
                        }
                    }}
                    containerStyle={{marginBottom: 14}}
                />
            </View>
        );
    };

    const renderContent = () => {
        const contentContainerStyle = {
            backgroundColor: theme.colors.white,
            marginHorizontal: 20,
            paddingBottom: 30,
            paddingTop: 50,
            paddingHorizontal: 20,
            borderRadius: 10,
            marginTop: 10,
            flexGrow: 0,
        };

        return (
            <components.KAScrollView
                contentContainerStyle={{...contentContainerStyle}}
            >
                {renderLogo()}
                {renderInputFields()}
                {renderSearchAddressBar()}
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

export default EditProfile;
