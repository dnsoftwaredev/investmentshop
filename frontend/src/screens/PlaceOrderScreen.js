import React, { useEffect } from 'react';
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import CheckoutSteps from '../components/CheckoutSteps';
import { createOrder } from '../actions/orderActions';
import NumberFormat from 'react-number-format';
import { ORDER_CREATE_RESET } from '../constants/orderConstants';

const PlaceOrderScreen = ({ history }) => {
    const dispatch = useDispatch();

    const cart = useSelector(state => state.cart);

    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    cart.itemsPrice = addDecimals(Number(cart.cartItems.reduce((acc, item) => acc + item.minimumInvestment * item.qty, 0)));
    cart.platformFee = addDecimals(Number((0.01 * cart.itemsPrice)));
    cart.totalPrice = addDecimals(Number(cart.itemsPrice) + Number(cart.platformFee));

    const orderCreate = useSelector(state => state.orderCreate);
    const { order, success, error } = orderCreate;

    useEffect(() => {
        if (success) {
            dispatch({ type: ORDER_CREATE_RESET });
            history.push(`/order/${order._id}`);
        }
        // eslint-disable-next-line
    }, [history, success]);

    const placeOrderHandler = () => {
        dispatch(createOrder({
            orderItems: cart.cartItems,
            billingAddress: cart.billingAddress,
            paymentMethod: cart.paymentMethod,
            itemsPrice: cart.itemsPrice,
            platformFee: cart.platformFee,
            totalPrice: cart.totalPrice
        }));
    };

    return (
        <>
            <CheckoutSteps step1 step2 step3 step4 />
            <Row>
                <Col md={8}>
                    {error && <Message variant='danger'>{error}</Message>}
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Billing</h2>
                            <p>
                                <strong>Address:</strong>
                                {cart.billingAddress.address}, {cart.billingAddress.city} {cart.billingAddress.postalCode}, {' '} {cart.billingAddress.country}
                            </p>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <strong>Method: </strong>
                            {cart.paymentMethod}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Investment Selections</h2>
                            {cart.cartItems.length === 0 ? (<Message>Your cart is empty</Message>) : (
                                <ListGroup variant='flush'>
                                    {cart.cartItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={1}>
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fluid
                                                        rounded
                                                    />
                                                </Col>
                                                <Col>
                                                    <Link to={`/product/${item.product}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.qty} x <NumberFormat value={item.minimumInvestment} displayType={'text'} thousandSeparator={true} prefix={'$'} /> = <NumberFormat value={item.qty * item.minimumInvestment} displayType={'text'} thousandSeparator={true} prefix={'$'} />
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col><NumberFormat value={cart.itemsPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} /></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Platform Fee</Col>
                                    <Col><NumberFormat value={cart.platformFee} displayType={'text'} thousandSeparator={true} prefix={'$'} /></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Row>
                                    <Col>Total</Col>
                                    <Col><NumberFormat value={cart.totalPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} /></Col>
                                </Row>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Button type='button' className='btn col-12' disabled={cart.cartItems === 0} onClick={placeOrderHandler}>Place Order</Button>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default PlaceOrderScreen;
