import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Rating from './Rating';

const Product = ({ product }) => {
    const styles = {
        cardImage: {
            objectFit: 'cover',
            borderRadius: 10,
            height: '280px'
        }
    };
    return (
        <Card className='my-3 p-3 rounded'>
            <Link to={`/product/${product._id}`}>
                <Card.Img src={product.image} variant='top' style={styles.cardImage}  />
            </Link>

            <Card.Body >
                <Link to={`/product/${product._id}`}>
                    <Card.Title as='div' >
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>

                <Card.Text as='div'>
                    <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                </Card.Text>

                <Card.Text className='my-2 border-bottom border-dark'>Target IRR: {product.targetIRR}%</Card.Text>
                <Card.Text className='my-2 border-bottom border-dark'>Target Cash Yield: {product.targetCashYield}%</Card.Text>
                <Card.Text >Hold Period: {product.holdPeriod} Years</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default Product;
