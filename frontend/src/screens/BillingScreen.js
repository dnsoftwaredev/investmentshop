import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import FormContainer from '../components/FormContainer';
import { saveBillingAddress } from '../actions/cartActions';
import CheckoutSteps from '../components/CheckoutSteps';

const BillingScreen = ({ history }) => {
    const cart = useSelector(state => state.cart);
    const { billingAddress } = cart;

    const [address, setAddress] = useState(billingAddress.address);
    const [city, setCity] = useState(billingAddress.city);
    const [postalCode, setPostalCode] = useState(billingAddress.postalCode);
    const [country, setCountry] = useState(billingAddress.country);

    const dispatch = useDispatch();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveBillingAddress({ address, city, postalCode, country }));
        history.push('/payment');
    };

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 />
            <h1>Billing Address</h1>
            <Form onSubmit={submitHandler} >
                <Form.Group controlId='address' className='py-2'>
                    <Form.Label>Address</Form.Label>
                    <Form.Control type='address' placeholder='Enter address' value={address} required onChange={(e) => setAddress(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group controlId='city' className='py-2'>
                    <Form.Label>City</Form.Label>
                    <Form.Control type='city' placeholder='Enter city' value={city} required onChange={(e) => setCity(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group controlId='postalCode' className='py-2'>
                    <Form.Label>Postal Code</Form.Label>
                    <Form.Control type='postalCode' placeholder='Enter postalCode' value={postalCode} required onChange={(e) => setPostalCode(e.target.value)}></Form.Control>
                </Form.Group>

                <Form.Group controlId='country' className='py-2'>
                    <Form.Label>Country</Form.Label>
                    <Form.Control type='country' placeholder='Enter country' value={country} required onChange={(e) => setCountry(e.target.value)}></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary' className='my-2'>Continue</Button>
            </Form>
        </FormContainer>
    );
};

export default BillingScreen;
