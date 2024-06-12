// import Axios from 'axios';
// import React, { useEffect, useState } from 'react'
// import { Alert, Button, Form } from 'react-bootstrap';
// import { useNavigate, useParams } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import Layout from '../components/Layout';

// const UpdateRepair = () => {

//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [billNo, setbNo] = useState();
//   const [billDate, setbdate] = useState();
//   const [pname, setpname] = useState();
//   const [description, setdesc] = useState();
//   const [mobile, setMobile] = useState();
//   const [errorMessage, setErrorMessage] = useState('');

//   useEffect(() => {
//     const fetchrepdata = async () => {
//       try {
//         const response = await Axios.get('http://localhost:4000/api/repairup/' + id);
//         console.log(response);
//       } catch (error) {
//         console.log(error);
//       }
//     }

//     fetchrepdata();
//   }, [])

//   return (
//     <div>
//       <Layout>
//         <h1>Repairs</h1><br />
//         {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
//         <Form>
//           <Form.Group >
//             <Form.Label>Bill No</Form.Label>
//             <Form.Control
//               type='text'
//               value={billNo}
//               onChange={e => setbNo(e.target.value)}
//               required />
//           </Form.Group>
//           <Form.Group >
//             <Form.Label>Bill Date</Form.Label>
//             <Form.Control
//               type='date'
//               value={billDate}
//               onChange={e => setbdate(e.target.value.toString())}
//               required />
//           </Form.Group>
//           <Form.Group >
//             <Form.Label>Product name</Form.Label>
//             <Form.Control
//               type='text'
//               value={pname}
//               onChange={e => setpname(e.target.value)}
//               required />
//           </Form.Group>
//           <Form.Group >
//             <Form.Label>Describe your issue</Form.Label>
//             <Form.Control
//               type='text'
//               value={description}
//               onChange={e => setdesc(e.target.value)}
//               required />
//           </Form.Group>

//           <Form.Group>
//             <Form.Label>Contact number</Form.Label>
//             <Form.Control
//               type='text'
//               value={mobile}
//               onChange={e => setMobile(e.target.value.slice(0, 10))}
//               maxLength={10} // added maxLength attribute to limit input
//               required />
//           </Form.Group>
//           <br />
//           <Button variant='primary' /*onClick={confirmUpdate}*/>
//             Update
//           </Button>
//         </Form>
//       </Layout>
//     </div>
//   )
// }

// export default UpdateRepair;
