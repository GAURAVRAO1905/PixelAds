import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Alert } from 'react-bootstrap';

const PaymentSuccess = () => {
    const searchQuery = useSearchParams()[0];
    const referenceNum = searchQuery.get("reference");

    return (
        <Container fluid className="d-flex vh-100 align-items-center justify-content-center">
            <Row className="text-center">
                <Col>
                    <h1 className="text-uppercase">Order Successful</h1>
                    <Alert variant="success">
                        Reference No.: {referenceNum}
                    </Alert>
                </Col>
            </Row>
        </Container>
    );
}

export default PaymentSuccess;
