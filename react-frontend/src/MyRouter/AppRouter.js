import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { connect } from 'react-redux';
import ProtectedRoute from './ProtectedRoute';

import SingleCategoryPage from "../components/app_components/CategoryPage/SingleCategoryPage";
import CategoryProjectLayoutPage from "../components/app_components/CategoryPage/CategoryProjectLayoutPage";
import SingleProductPage from "../components/app_components/ProductPage/SingleProductPage";
import ProductProjectLayoutPage from "../components/app_components/ProductPage/ProductProjectLayoutPage";
import SingleProductColorPage from "../components/app_components/ProductColorPage/SingleProductColorPage";
import ProductColorProjectLayoutPage from "../components/app_components/ProductColorPage/ProductColorProjectLayoutPage";
import SingleProductPricePage from "../components/app_components/ProductPricePage/SingleProductPricePage";
import ProductPriceProjectLayoutPage from "../components/app_components/ProductPricePage/ProductPriceProjectLayoutPage";
import SingleProductSizePage from "../components/app_components/ProductSizePage/SingleProductSizePage";
import ProductSizeProjectLayoutPage from "../components/app_components/ProductSizePage/ProductSizeProjectLayoutPage";
import SingleProductRatingPage from "../components/app_components/ProductRatingPage/SingleProductRatingPage";
import ProductRatingProjectLayoutPage from "../components/app_components/ProductRatingPage/ProductRatingProjectLayoutPage";
import SingleProductStockPage from "../components/app_components/ProductStockPage/SingleProductStockPage";
import ProductStockProjectLayoutPage from "../components/app_components/ProductStockPage/ProductStockProjectLayoutPage";
import SingleCartPage from "../components/app_components/CartPage/SingleCartPage";
import CartProjectLayoutPage from "../components/app_components/CartPage/CartProjectLayoutPage";
import SingleCartItemPage from "../components/app_components/CartItemPage/SingleCartItemPage";
import CartItemProjectLayoutPage from "../components/app_components/CartItemPage/CartItemProjectLayoutPage";
import SingleCheckoutPage from "../components/app_components/CheckoutPage/SingleCheckoutPage";
import CheckoutProjectLayoutPage from "../components/app_components/CheckoutPage/CheckoutProjectLayoutPage";
import SingleCustomerDetailsPage from "../components/app_components/CustomerDetailsPage/SingleCustomerDetailsPage";
import CustomerDetailProjectLayoutPage from "../components/app_components/CustomerDetailsPage/CustomerDetailProjectLayoutPage";
import SingleCustomerAddressPage from "../components/app_components/CustomerAddressPage/SingleCustomerAddressPage";
import CustomerAddressProjectLayoutPage from "../components/app_components/CustomerAddressPage/CustomerAddressProjectLayoutPage";
import SingleCustomerEmailPage from "../components/app_components/CustomerEmailPage/SingleCustomerEmailPage";
import CustomerEmailProjectLayoutPage from "../components/app_components/CustomerEmailPage/CustomerEmailProjectLayoutPage";
import SingleOrderPage from "../components/app_components/OrderPage/SingleOrderPage";
import OrderProjectLayoutPage from "../components/app_components/OrderPage/OrderProjectLayoutPage";
import SingleItemsPage from "../components/app_components/ItemsPage/SingleItemsPage";
import ItemProjectLayoutPage from "../components/app_components/ItemsPage/ItemProjectLayoutPage";
import SingleOrderProductPage from "../components/app_components/OrderProductPage/SingleOrderProductPage";
import OrderProductProjectLayoutPage from "../components/app_components/OrderProductPage/OrderProductProjectLayoutPage";
import SingleOrderHistoryPage from "../components/app_components/OrderHistoryPage/SingleOrderHistoryPage";
import OrderHistoryProjectLayoutPage from "../components/app_components/OrderHistoryPage/OrderHistoryProjectLayoutPage";
import SingleUserDetailsPage from "../components/app_components/UserDetailsPage/SingleUserDetailsPage";
import UserDetailProjectLayoutPage from "../components/app_components/UserDetailsPage/UserDetailProjectLayoutPage";
//  ~cb-add-import~

const AppRouter = () => {
    return (
        <Routes>
            {/* ~cb-add-unprotected-route~ */}
<Route path="/category/:singleCategoryId" exact element={<SingleCategoryPage />} />
<Route path="/category" exact element={<CategoryProjectLayoutPage />} />
<Route path="/product/:singleProductId" exact element={<SingleProductPage />} />
<Route path="/product" exact element={<ProductProjectLayoutPage />} />
<Route path="/productColor/:singleProductColorId" exact element={<SingleProductColorPage />} />
<Route path="/productColor" exact element={<ProductColorProjectLayoutPage />} />
<Route path="/productPrice/:singleProductPriceId" exact element={<SingleProductPricePage />} />
<Route path="/productPrice" exact element={<ProductPriceProjectLayoutPage />} />
<Route path="/productSize/:singleProductSizeId" exact element={<SingleProductSizePage />} />
<Route path="/productSize" exact element={<ProductSizeProjectLayoutPage />} />
<Route path="/productRating/:singleProductRatingId" exact element={<SingleProductRatingPage />} />
<Route path="/productRating" exact element={<ProductRatingProjectLayoutPage />} />
<Route path="/productStock/:singleProductStockId" exact element={<SingleProductStockPage />} />
<Route path="/productStock" exact element={<ProductStockProjectLayoutPage />} />
<Route path="/cart/:singleCartId" exact element={<SingleCartPage />} />
<Route path="/cart" exact element={<CartProjectLayoutPage />} />
<Route path="/cartItem/:singleCartItemId" exact element={<SingleCartItemPage />} />
<Route path="/cartItem" exact element={<CartItemProjectLayoutPage />} />
<Route path="/checkout/:singleCheckoutId" exact element={<SingleCheckoutPage />} />
<Route path="/checkout" exact element={<CheckoutProjectLayoutPage />} />
<Route path="/customerDetails/:singleCustomerDetailsId" exact element={<SingleCustomerDetailsPage />} />
<Route path="/customerDetails" exact element={<CustomerDetailProjectLayoutPage />} />
<Route path="/customerAddress/:singleCustomerAddressId" exact element={<SingleCustomerAddressPage />} />
<Route path="/customerAddress" exact element={<CustomerAddressProjectLayoutPage />} />
<Route path="/customerEmail/:singleCustomerEmailId" exact element={<SingleCustomerEmailPage />} />
<Route path="/customerEmail" exact element={<CustomerEmailProjectLayoutPage />} />
<Route path="/order/:singleOrderId" exact element={<SingleOrderPage />} />
<Route path="/order" exact element={<OrderProjectLayoutPage />} />
<Route path="/items/:singleItemsId" exact element={<SingleItemsPage />} />
<Route path="/items" exact element={<ItemProjectLayoutPage />} />
<Route path="/orderProduct/:singleOrderProductId" exact element={<SingleOrderProductPage />} />
<Route path="/orderProduct" exact element={<OrderProductProjectLayoutPage />} />
<Route path="/orderHistory/:singleOrderHistoryId" exact element={<SingleOrderHistoryPage />} />
<Route path="/orderHistory" exact element={<OrderHistoryProjectLayoutPage />} />
<Route path="/userDetails/:singleUserDetailsId" exact element={<SingleUserDetailsPage />} />
<Route path="/userDetails" exact element={<UserDetailProjectLayoutPage />} />
            <Route element={<ProtectedRoute redirectPath={'/login'} />}>{/* ~cb-add-protected-route~ */}</Route>
        </Routes>
    );
};

const mapState = (state) => {
    const { isLoggedIn } = state.auth;
    return { isLoggedIn };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data)
});

export default connect(mapState, mapDispatch)(AppRouter);
