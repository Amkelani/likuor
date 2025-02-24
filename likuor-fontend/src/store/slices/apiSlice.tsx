import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import {
    BASE_URL,
    clearTokens,
    ENDPOINTS,
    getAuthorizationToken,
    refreshAccessToken,
    setAuthorizationToken
} from '../../config';
import {
    ProductType,
    OrderType,
    CarouselType,
    TagType,
    CategoryType,
    PromocodeType,
} from '../../types';
import {useAppNavigation} from '../../hooks';

// Initialize authorization token with logging

setAuthorizationToken()

const baseQueryWithRefresh: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
    let token = await getAuthorizationToken();
    const baseQuery = fetchBaseQuery({
        baseUrl: BASE_URL,
        prepareHeaders: (headers: Headers, { endpoint }) => {
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    });

    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {

        const newToken = await refreshAccessToken();
        if (newToken) {
            token = newToken;
            result = await baseQuery(args, api, extraOptions);
        } else {
            const navigation = useAppNavigation();
            navigation.navigate('SignIn');
            await clearTokens();
        }
    }

    return result;
};



export const apiSlice = createApi({
    reducerPath: 'apiSlice',
    baseQuery: baseQueryWithRefresh,
    tagTypes: ['Products', 'Orders', 'Carousel', 'Categories', 'Reviews', 'Users', 'Tags', 'Promocodes'],
    endpoints: (builder) => ({
        getProducts: builder.query<{ products: ProductType[] }, void>({
            query: () => {
                return ENDPOINTS.get.products;
            },
            providesTags: ['Products']
        }),
        getOrders: builder.query<{ orders: OrderType[] }, { username: string }>({
            query: (body) => {
                console.debug('[API] getOrders query called with:', { username: body.username });
                return {
                    url: ENDPOINTS.post.orders,
                    method: 'POST',
                    body,
                };
            },
            providesTags: ['Orders']
        }),
        getCarousel: builder.query<{ carousel: CarouselType[] }, void>({
            query: () => ENDPOINTS.get.carousel,
            providesTags: ['Carousel'],
        }),
        getCategories: builder.query<{ categories: CategoryType[] }, void>({
            query: () => ENDPOINTS.get.categories,
            providesTags: ['Categories'],
        }),
        getReviews: builder.query<{ reviews: unknown[] }, void>({
            query: () => ENDPOINTS.get.reviews,
            providesTags: ['Reviews'],
        }),
        getUsers: builder.query<{ users: unknown[] }, void>({
            query: () => ENDPOINTS.get.users,
            providesTags: ['Users'],
        }),
        getTags: builder.query<{ tags: TagType[] }, void>({
            query: () => ENDPOINTS.get.tags,
            providesTags: ['Tags'],
        }),
        getPromocodes: builder.query<{ promocodes: PromocodeType[] }, void>({
            query: () => ENDPOINTS.get.promocodes,
            providesTags: ['Promocodes'],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetCarouselQuery,
    useGetCategoriesQuery,
    useGetOrdersQuery,
} = apiSlice;

export default apiSlice.reducer;