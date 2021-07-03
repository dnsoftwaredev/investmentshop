import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { productListReducer, productDetailsReducer } from './reducers/productReducers';
import { cartReducer } from './reducers/cartReducers';
// combineReducers is to be used to combine all reducers into a single thing that can be passed to the store
const reducer = combineReducers({
    productList: productListReducer,
    productDetails: productDetailsReducer,
    cart: cartReducer
});

// grab the cart items from local storage
const cartItemsFromStorage = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : [];

const initialState = {
    cart: { cartItems: cartItemsFromStorage }
};

const middleware = [thunk];

// this is where you create a store that can be passed into a Provider
// apply middleware is to apply thunk
const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;