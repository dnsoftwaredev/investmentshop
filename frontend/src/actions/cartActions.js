import axios from 'axios';
import { CART_ADD_ITEM, CART_REMOVE_ITEM, CART_SAVE_PAYMENT_METHOD, CART_SAVE_BILLING_ADDRESS } from '../constants/cartConstants';

export const addToCart = (id, qty) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/products/${id}`);

    dispatch({
        type: CART_ADD_ITEM,
        payload: {
            product: data._id,
            name: data.name,
            image: data.image,
            minimumInvestment: data.minimumInvestment,
            targetIRR: data.targetIRR,
            targetCashYield: data.targetCashYield,
            countInStock: data.countInStock,
            qty
        }
    });

    // store the cartItems into localStorage
    // so even if you reload the website the web browser still have info on those cart items
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const removeFromCart = (id) => async (dispatch, getState) => {
    dispatch({
        type: CART_REMOVE_ITEM,
        payload: id
    });

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const saveBillingAddress = (data) => async (dispatch, getState) => {
    dispatch({
        type: CART_SAVE_BILLING_ADDRESS,
        payload: data
    });

    localStorage.setItem('billingAddress', JSON.stringify(data));
};

export const savePaymentMethod = (data) => async (dispatch, getState) => {
    dispatch({
        type: CART_SAVE_PAYMENT_METHOD,
        payload: data
    });

    localStorage.setItem('paymentMethod', JSON.stringify(data));
};
