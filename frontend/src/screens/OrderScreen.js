import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PayPalButton } from 'react-paypal-button-v2';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import NumberFormat from 'react-number-format';
import { getOrderDetails, payOrder, approveOrder } from '../actions/orderActions';
import { ORDER_PAY_RESET, ORDER_APPROVE_RESET } from '../constants/orderConstants';

const OrderScreen = ({ match, history }) => {
    const orderId = match.params.id;

    const [sdkReady, setSdkReady] = useState(false);

    const dispatch = useDispatch();

    const orderDetails = useSelector(state => state.orderDetails);
    const { order, loading, error } = orderDetails;

    const userLogin = useSelector(state => state.userLogin);
    const { userInfo } = userLogin;

    const orderPay = useSelector(state => state.orderPay);
    // rename syntax
    const { loading: loadingPay, success: successPay } = orderPay;

    const orderApprove = useSelector(state => state.orderApprove);
    const { loading: loadingApprove, success: successApprove } = orderApprove;

    useEffect(() => {
        if (!userInfo) {
            history.push('/login');
        }

        const addPayPalScript = async () => {
            const { data: clientId } = await axios.get('/api/config/paypal');
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
            script.async = true;
            script.onload = () => {
                setSdkReady(true);
            };
            document.body.appendChild(script);
        };

        if (!order || order._id !== orderId || successPay || successApprove) {
            dispatch({ type: ORDER_PAY_RESET });
            dispatch({ type: ORDER_APPROVE_RESET });
            dispatch(getOrderDetails(orderId));
        } else if (!order.isPaid) {
            if (!window.paypal) {
                addPayPalScript();
            } else {
                setSdkReady(true);
            }
        }
    }, [order, orderId, dispatch, successPay, successApprove, history, userInfo]);

    const successPaymentHandler = (paymentResult) => {
        console.log(paymentResult);
        dispatch(payOrder(orderId, paymentResult));
    };

    const approveHandler = () => {
        dispatch(approveOrder(order));
    };

    return loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : <>
        <h1>Order {order._id}</h1>
        <Row>
            <Col md={8}>
                <ListGroup variant='flush'>
                    <ListGroup.Item>
                        <h2>Billing</h2>
                        <p>
                            <strong>Name: </strong> {order.user.name}
                        </p>
                        <p>
                            <strong>Email: </strong> {' '}
                            <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                        </p>
                        <p>
                            <strong>Address:</strong>
                            {order.billingAddress.address}, {order.billingAddress.city} {order.billingAddress.postalCode}, {' '} {order.billingAddress.country}
                        </p>
                        {order.isApproved ? <Message variant='success'>Approved on {order.approvedAt}</Message> : <Message variant='danger'>Not Approved</Message>}
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <h2>Payment Method</h2>
                        <p>
                            <strong>Method: </strong>
                            {order.paymentMethod}
                        </p>
                        {order.isPaid ? <Message variant='success'>Paid on {order.paidAt}</Message> : <Message variant='danger'>Not Paid</Message>}
                    </ListGroup.Item>

                    <ListGroup.Item>
                        <h2>Investment Selections</h2>
                        {order.orderItems.length === 0 ? (<Message>Your order is empty</Message>) : (
                            <ListGroup variant='flush'>
                                {order.orderItems.map((item, index) => (
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
                                <Col>Investment Amount</Col>
                                <Col><NumberFormat value={order.itemsPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} /></Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Platform Fee</Col>
                                <Col><NumberFormat value={order.platformFee} displayType={'text'} thousandSeparator={true} prefix={'$'} /></Col>
                            </Row>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Row>
                                <Col>Total</Col>
                                <Col><NumberFormat value={order.totalPrice} displayType={'text'} thousandSeparator={true} prefix={'$'} /></Col>
                            </Row>
                        </ListGroup.Item>
                        {!order.isPaid && (
                            <ListGroup.Item>
                                {loadingPay && <Loader />}
                                {!sdkReady ? <Loader /> : (
                                    <PayPalButton amount={order.totalPrice} onSuccess={successPaymentHandler} />
                                )}
                            </ListGroup.Item>
                        )}
                        {loadingApprove && <Loader />}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isApproved && (
                            <ListGroup.Item>
                                <Button type='button' className='btn col-12' onClick={approveHandler}>
                                    Mark As Approved
                                </Button>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    </>;
};

export default OrderScreen;
