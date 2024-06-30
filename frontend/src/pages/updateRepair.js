import Axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Alert, Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';
import { Dialog } from '@mui/material';

const UpdateRepair = () => {

    const { _id, cname, billNo, billDate, pname, description, mobile } = useParams();
    const navigate = useNavigate();

    const [id_u, setID] = useState(_id);
    const [cname_u, setcname] = useState(cname)
    const [billNo_u, setbNo] = useState(billNo);
    const [billDate_u, setbdate] = useState(billDate);
    const [pname_u, setpname] = useState(pname);
    const [description_u, setdesc] = useState(description);
    const [mobile_u, setMobile] = useState(mobile);
    const [errorMessage, setErrorMessage] = useState('');
    const [open, setOpen] = useState(true);

    const updateRepair = async (_id, cname, billNo, billDate, pname, description, mobile) => {
        try {
            const response = await Axios.post('http://localhost:4000/api/updateRepair', {
                _id: _id,
                cname,
                billNo,
                billDate,
                pname,
                description,
                mobile
            });
            console.log('Repair updated successfully');
        } catch (error) {
            console.error(error);
        }
    }

    const update = async () => {

        if (!id_u || !cname_u || !billNo_u || !billDate_u || !pname_u || !description_u || !mobile_u) {
            setErrorMessage('Please dont put black fields');
            return;
        }
        try {
            const response = await updateRepair(id_u, cname_u, billNo_u, billDate_u, pname_u, description_u, mobile_u);
            console.log(response);
            setID(_id);
            navigate('/repairs');
        } catch (error) {
            console.log('Error', error);
        }
    }
    return (
        <div>
            <Layout>
                <Dialog open={open}>
                    <div style={{ marginLeft: '5%', marginRight: '5%', marginTop: '4%', marginBottom: '4%' }}>
                        <p style={{ fontSize: '1.5em', textAlign: 'center' }}>Update Repair id = {_id}</p><br />
                        {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
                        <Form>
                            <Form.Group>
                                <Form.Label>Your name</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={cname_u}
                                    onChange={e => setcname(e.target.value)}
                                    required />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Bill No</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={billNo_u}
                                    onChange={e => setbNo(e.target.value)}
                                    required />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Bill Date</Form.Label>
                                <Form.Control
                                    type='date'
                                    value={billDate_u}
                                    onChange={e => setbdate(e.target.value.toString())}
                                    required />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Product name</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={pname_u}
                                    onChange={e => setpname(e.target.value)}
                                    required />
                            </Form.Group>
                            <Form.Group >
                                <Form.Label>Describe your issue</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={description_u}
                                    onChange={e => setdesc(e.target.value)}
                                    required />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Contact number</Form.Label>
                                <Form.Control
                                    type='text'
                                    value={mobile_u}
                                    onChange={e => setMobile(e.target.value.slice(0, 10))}
                                    maxLength={10} // added maxLength attribute to limit input
                                    required />
                            </Form.Group>
                            <br />
                            <Button variant='primary' onClick={update}>
                                Update
                            </Button>
                            <Button variant='primary' style={{ marginLeft: '10%' }} onClick={() => navigate('/repairs')}>
                                Go Back
                            </Button>
                        </Form>
                    </div>
                </Dialog>
            </Layout>
        </div>
    )
}

export default UpdateRepair;
