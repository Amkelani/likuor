import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Alert, ActivityIndicator} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {text} from '../text';
import {svg} from '../assets/svg';
import {theme} from '../constants';
import {components} from '../components';
import type {RootStackParamList} from '../types';
import {resetCart} from '../store/slices/cartSlice';
import {useAppSelector, useAppNavigation, useAppDispatch} from '../hooks';
import AddressStore from "./auth/AddressStore";
import UserStore from "./auth/UserStore";
import axios from "axios";
import {BASE_URL, ENDPOINTS} from "../config";

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

const Checkout: React.FC<Props> = ({route}): JSX.Element => {
    const dispatch = useAppDispatch();
    const {total, subtotal, delivery, discount} = route.params;
    const navigation = useAppNavigation();
    const [loading, setLoading] = useState(false);

    const cart = useAppSelector((state) => state.cartSlice.list);

    const renderStatusBar = () => {
        return <components.StatusBar/>;
    };

    const renderHeader = () => {
        return <components.Header goBack={true} title='Checkout'/>;
    };

    const renderOrderSummary = () => {
        return (
            <View
                style={{
                    padding: 20,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: theme.colors.mainTurquoise,
                    marginBottom: 30,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomWidth: 1,
                        borderBottomColor: '#DBE9F5',
                        paddingBottom: 20,
                        marginBottom: 20,
                    }}
                >
                    <text.H4>My order</text.H4>
                    <text.H4>R{total}</text.H4>
                </View>
                {cart.map((item, index) => {
                    return (
                        <View
                            key={index}
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 10,
                            }}
                        >
                            <text.T14>{item.name}</text.T14>
                            <text.T14>
                                {item.quantity} x R{item.price}
                            </text.T14>
                        </View>
                    );
                })}
                {discount > 0 && (
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 10,
                        }}
                    >
                        <text.T14>Discount</text.T14>
                        <text.T14>- R{discount.toFixed(2)}</text.T14>
                    </View>
                )}
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <text.T14>Delivery</text.T14>
                    <text.T14>R{delivery}</text.T14>
                </View>
            </View>
        );
    };

    const renderShippingDetails = () => {
        return (
            <TouchableOpacity
                style={{
                    padding: 20,
                    backgroundColor: theme.colors.white,
                    borderRadius: 10,
                    marginBottom: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
                onPress={() => {
                    navigation.navigate("EditProfile")
                }}
            >
                <View>
                    <Text
                        style={{
                            ...theme.fonts.DMSans_500Medium,
                            fontSize: 14,
                            textTransform: 'capitalize',
                            color: theme.colors.mainColor,
                            marginBottom: 10,
                        }}
                    >
                        Shipping details
                    </Text>
                    <Text
                        style={{
                            ...theme.fonts.DMSans_400Regular,
                            color: theme.colors.textColor,
                            fontSize: 12,
                            lineHeight: 12 * 1.5,
                        }}
                    >
                        {AddressStore.getAddress()}
                    </Text>
                </View>
                <svg.ArrowRightSvg/>
            </TouchableOpacity>
        );
    };

    const renderPaymentMethod = () => {
        return (
            <TouchableOpacity
                style={{
                    padding: 20,
                    backgroundColor: theme.colors.white,
                    borderRadius: 10,
                    marginBottom: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <View>
                    <Text
                        style={{
                            ...theme.fonts.DMSans_500Medium,
                            fontSize: 14,
                            textTransform: 'capitalize',
                            color: theme.colors.mainColor,
                            marginBottom: 10,
                        }}
                    >
                        Payment method
                    </Text>
                    <Text
                        style={{
                            ...theme.fonts.DMSans_400Regular,
                            color: theme.colors.textColor,
                            fontSize: 15,
                            lineHeight: 12 * 1.5,
                        }}
                    >
                        Ozow
                    </Text>
                </View>
                <svg.ArrowRightSvg/>
            </TouchableOpacity>
        );
    };

    const renderInputField = () => {
        return (
            <View
                style={{
                    backgroundColor: theme.colors.white,
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                    borderRadius: 10,
                }}
            >
                <components.InputFieldBig containerStyle={{marginBottom: 14}}/>
                <components.Button
                    loading={loading}
                    title='Confirm order'
                    onPress={async () => {
                        setLoading(true);
                        if (!AddressStore.getAddress()) {
                            setLoading(false);
                            Alert.alert('Checkout Error', "Please set shipping address");
                        } else {
                            let products: {
                                id: number;
                                name: string;
                                price: number;
                                quantity: number | undefined;
                            }[] = []
                            cart.map((item, index) => {
                                let product = {
                                    id: item.id,
                                    name: item.name,
                                    price: item.price,
                                    quantity: item.quantity
                                }
                                products.push(product)
                            })
                            if (!loading) {
                                try {
                                    const response = await axios.post(`${BASE_URL}${ENDPOINTS.post.order}`, {
                                        username: UserStore.getEmail(),
                                        address: AddressStore.getAddress(),
                                        delivery: delivery,
                                        discount: discount,
                                        status: "Order Confirmed",
                                        total: total,
                                        products: products
                                    });
                                    if (response.data.success) {
                                        dispatch(resetCart())
                                        setLoading(false);
                                        navigation.navigate('OrderSuccessful');
                                    } else {
                                        setLoading(false);
                                        Alert.alert('Order Failed', response.data.error);
                                    }
                                } catch (error) {
                                    setLoading(false);
                                    Alert.alert('Error', 'Something went wrong. Please try again.');
                                }
                                // navigation.navigate('OrderFailed');
                            }
                            // navigation.navigate('OrderSuccessful');
                        }
                    }}
                />
            </View>
        );
    };

    const renderContent = () => {
        const contentContainerStyle = {
            flexGrow: 1,
            paddingTop: 10,
            paddingBottom: 20,
            paddingHorizontal: 20,
        };

        return (
            <components.KAScrollView
                contentContainerStyle={{...contentContainerStyle}}
            >
                {renderOrderSummary()}
                {renderShippingDetails()}
                {renderPaymentMethod()}
                {renderInputField()}
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

export default Checkout;
