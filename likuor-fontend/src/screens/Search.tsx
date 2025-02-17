import React, {useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    ScrollView,
} from 'react-native';

import {text} from '../text';
import {svg} from '../assets/svg';
import {theme} from '../constants';
import {components} from '../components';
import type {RootStackParamList} from '../types';
import {
    useGetProductsQuery,
    useGetCategoriesQuery,
} from '../store/slices/apiSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

const Search: React.FC<Props> = ({route}): JSX.Element => {
    // @ts-ignore
    const {search_text} = route.params;
    const [loading, setLoading] = useState(false);

    const {
        data: productsData,
        error: productsError,
        isLoading: productsLoading,
    } = useGetProductsQuery();

    const drinks = productsData instanceof Array ? productsData : [];

    if (loading) {
        return <components.Loader/>;
    }

    const renderStatusBar = () => {
        return <components.StatusBar/>;
    };

    const renderHeader = () => {
        return <components.Header goBack={true} title='Search' basket={false}/>;
    };

    const renderContent = () => {
        const drinksBySearch = drinks?.filter((drink) => {
            return JSON.stringify(drink.name)?.includes(search_text) || JSON.stringify(drink.category)?.includes(search_text);
        });
        console.log(drinksBySearch)
        return (
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingHorizontal: 20,
                }}
                showsVerticalScrollIndicator={false}
            >
                {drinksBySearch?.map((item, index, array) => {
                    const lastItem = index === array.length - 1;
                    return (
                        <components.MenuListItem
                            item={item}
                            lastItem={lastItem}
                            key={item.id}
                        />
                    );
                })}
            </ScrollView>
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

export default Search;
