import React, {useState} from 'react';
import axios from 'axios'
import Loader from './Loader';

const Register:React.FC = () => {

    const [Login2,setLogin2] = useState<string>()
    const [Password2,setPassword2] = useState<string>()
    const [Email2,setEmail2] = useState<string>()
    const [photo,setPhoto] = useState<string>('https://previews.123rf.com/images/triken/triken1608/triken160800029/61320775-male-avatar-profile-picture-default-user-avatar-guest-avatar-simply-human-head-vector-illustration-i.jpg')

    const rejestruj = (e:any) => {
        e.preventDefault()
        let data = {username:Login2,password:Password2,email:Email2,userPhoto:photo}
        axios.post("http://localhost:5000/Moto/register",data)
            .then(res => {
                setTimeout(() => window.location.href="/Login",500)
            })
            .catch(err => console.log(err.msg+"Bład"))
        setLogin2('')
        setPassword2('')
        setEmail2('')
    }

    return (
        <div className="wrapper fadeInDown">
            <div id="formContent">
                <h2 className="inactive underlineHover"><a href="http://localhost:3000/Login">Sign In </a></h2>
                <h2 className="active">Sign Up </h2>
                <div className="fadeIn first">
                    <img src={photo} id="icon" alt="Loading photo ..." />
                </div>          
                <form onSubmit={rejestruj}>
                    <input type="text" id="login"  onChange={(e) => setLogin2(e.target.value)} className="fadeIn first" name="login" placeholder="Imię"/>
                    <input type="text" id="email"  onChange={(e) => setEmail2(e.target.value)} className="fadeIn second" name="login" placeholder="Email"/>
                    <input type="text" id="password"  onChange={(e) => setPassword2(e.target.value)} className="fadeIn third" name="login" placeholder="Hasło"/>
                    <input type="text" id="password"  onChange={(e) => setPhoto(e.target.value)} className="fadeIn fourth" name="login" placeholder="Dodaj zdjęcie .."/>
                    <input type="submit" className="fadeIn fourth" value="Sign Up"/>
                </form>
                <div id="formFooter">
                    <a className="underlineHover" href="#">Forgot Password?</a>
                </div>
            </div>
        </div>
    );
}

export default Register;