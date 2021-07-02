import React from 'react';
import { Alert } from 'react-bootstrap';

const Message = ({ variant, children }) => {
    // children props here can be put inside the component when it is called from somewhere else=> <Message>{children}</Message>
    return (
        <Alert variant={variant}>
            {children}
        </Alert>
    );
};

Message.defaultProps = {
    variant: 'info'
};

export default Message;
