import React, {useState} from 'react';
import axios from 'axios'

const Login:React.FC = () => {

    const [Email,setEmail] = useState<string>()
    const [Password,setPassword] = useState<string>()

    function zaloguj(e:any) {
        e.preventDefault()
        let data = {email:Email,password:Password}
        axios.post("http://localhost:5000/Moto/login",data)
            .then(res => {
                localStorage.setItem('cool-jwt',res.data.token)
                setTimeout(() => window.location.href="/helmets",500)
            })
        .catch((err) => {console.log('Bad haslo')})
        setEmail('')
        setPassword('')
    }

    return (
        <div className="wrapper fadeInDown">
            <div id="formContent">
                <h2 className="active"> Sign In </h2>
                <h2 className="inactive underlineHover"><a href="http://localhost:3000/Register">Sign Up </a></h2>
                <form onSubmit={zaloguj}>
                    <input type="text" id="login"  onChange={(e) => setEmail(e.target.value)} className="fadeIn first" name="login" placeholder="login"/>
                    <input type="text" id="password"  onChange={(e) => setPassword(e.target.value)} className="fadeIn second" name="login" placeholder="password"/>
                    <input type="submit" className="fadeIn third" value="Log In"/>
                </form>
                <div id="formFooter">
                    <a className="underlineHover" href="#">Forgot Password?</a>
                </div>
            </div>
    </div>
    );
}

export default Login;