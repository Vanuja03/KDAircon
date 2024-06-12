import React, { useState } from 'react'
import Layout from '../components/Layout';
import { Alert, Button, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import  Axios from 'axios';
import Swal from 'sweetalert2';

const UpdateProduct = () => {

    const {pid,pname,pdescription,pprice,pquantity,image} = useParams();
    const [pid_u,setpid] = useState(pid);
    const [pname_u , setpname] = useState(pname);
    const [pdescription_u , setpdesc] = useState(pdescription);
    const [pprice_u , setpprice] = useState(pprice);
    const [pquantity_u , setpquantity] = useState(pquantity);
    const [image_u , setpimage] = useState(image);
    const [errorMessage,setErrorMessage] = useState('');

    const navigate = useNavigate();

    const updateProduct = async(pid,pname,pdescription,pprice,pquantity) => {
        try{
            const response = await Axios.post('http://localhost:4000/api/updateProduct' , {
                pid,
                pname,
                pdescription,
                pprice,
                pquantity,
            });
            console.log('Update product response : ' , response.data);
            return response.data;
        }catch(error){
            console.error('Error updating product axios error : ' , error);
        }
    };

    const update = async(e) => {
        
        const response = await updateProduct(pid_u,pname_u,pdescription_u,pprice_u,pquantity_u);

        if( !pname_u || !pdescription_u || !pprice_u || !pquantity_u){
            setErrorMessage('Please fill in all required field');
            return;
        }
        if(response.error){
            setErrorMessage(response.error);
        }else{
            setpid(0);
            setpname('');
            setpdesc('');
            setpprice(0);
            setpquantity(0);
            setpimage(null);
            setErrorMessage(null);
            console.log('record updated ' , response);
        }
        navigate('/addproduct');
    }

    const confirmUpdate = () =>{
        Swal.fire({
            title: "Do you want to save the changes?",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Save",
            denyButtonText: `Don't save`
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
              update();
              Swal.fire("Saved!", "", "success");
              
            } else if (result.isDenied) {
              Swal.fire("Changes are not saved", "", "info");
            }
          });
    }
  return (
    <div>
        <Layout>
            {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
        <Form>
        <Form.Group controlId="pID">
          <Form.Label>Product ID ( <b>note : you can't change product id</b>)</Form.Label>
          <Form.Control
            type="number"
            id="pid"
            name="pid"
            min={0}
            value={pid_u}  
            required />
        </Form.Group>
        <Form.Group controlId="productName">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            type="text"
            id="pname"
            name="pname"
            value={pname_u}
            onChange={e => setpname(e.target.value)}
            required />
        </Form.Group>
        <Form.Group controlId="productDescription">
          <Form.Label>Product Description</Form.Label>
          <Form.Control
            as="textarea"
            id="pdescription"
            name="pdescription"
            value={pdescription_u}
            onChange={e => setpdesc(e.target.value)}
            required />
        </Form.Group>
        <Form.Group controlId="productPrice">
          <Form.Label>Product Price</Form.Label>
          <Form.Control
            type="text"
            id="pprice"
            min={0}
            name="pprice"
            value={pprice_u}
            onChange={e => setpprice(e.target.value)} 
            required/>
        </Form.Group>
        <Form.Group controlId="productQuantity">
          <Form.Label>Product Quantity</Form.Label>
          <Form.Control
            type="text"
            id="pquantity"
            min={0}
            name="pquantity"
            value={pquantity_u}
            onChange={e => setpquantity(e.target.value)}
            required />
            <br/>
        </Form.Group>
        <Form.Group controlId='productImage'>
          <Form.Label><b>Product image  : </b>ㅤ</Form.Label>
          <img src={require(`../images/${image_u}`)} alt='Product' style={{ maxWidth : '150px', maxHeight : '150px'}}/>
        </Form.Group>
        <br />
        <Button variant="primary" onClick={confirmUpdate}>
          Update
        </Button>
      </Form>
        </Layout>
      
    </div>
  );
}

export default UpdateProduct;
