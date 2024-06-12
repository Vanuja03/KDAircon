import React from 'react'
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from './firebase';
import Layout from '../components/Layout';
import { Button, Card, Container } from 'react-bootstrap';
const Profile = () => {

    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();

    const signOutUser = async() => {
        try{
            await signOut(auth);

           if(window.confirm('Are you sure ?')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
           }
            
            navigate("/");

        }catch(error){
            console.error(error);
        }
    }
  return (
    <div>
      <Layout>
        <Container>
            <Card>
                {user && (<img src={user.photoURL} alt='profile' width={200} height={200}/>)}
                <h1>Welcome {user.displayName}</h1>
                <h2>{user.email}</h2>
                <Button onClick={signOutUser} className='log-out'>Log out</Button>
            </Card>
        </Container>
      </Layout>
    </div>
  )
}

export default Profile
