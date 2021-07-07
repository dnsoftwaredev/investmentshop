import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { productListReducer, productDetailsReducer } from './reducers/productReducers';
import { cartReducer } from './reducers/cartReducers';
import { userLoginReducer, userRegisterReducer, userDetailsReducer, userUpdateProfileReducer } from './reducers/userReducers';
// combineReducers is to be used to combine all reducers into a single thing that can be passed to the store
const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer
});

// grab the cart items from local storage
const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

const initialState = {
    cart: { cartItems: cartItemsFromStorage },
    userLogin: { userInfo: userInfoFromStorage }
};

const middleware = [thunk];

// this is where you create a store that can be passed into a Provider
// apply middleware is to apply thunk
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;