import React, {useEffect,useReducer} from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios'
import { IoMdLogIn } from 'react-icons/io';
import { IoMdLogOut } from 'react-icons/io';
import { getJwt } from '../jwt';

interface Props {
    logo:string
}

const FETCH_SUCCESS = 'FETCH_SUCCESS'
const FETCH_FAIL = 'FETCH_FAIL'

const initialState = {
  loading:true,
  post:{},
  err:''
}

const reducer = (state:any,action:any) => {
  switch(action.type) {
    case FETCH_SUCCESS: return {
      loading:false,
      post:action.payload,
      err:''
    }
    case FETCH_FAIL: return {
      loading:false,
      post:{},
      err:action.payload
    }
    default:return state
  }
}

const Navbar:React.FC<Props> = () => {

    const jwt = getJwt()

    const [photos,dispatch] = useReducer(reducer,initialState)

    useEffect(() => {
        axios.get(`http://localhost:5000/Moto/myProfile`,{headers:{Authorization:`Bearer ${jwt}`}})
        .then(res => dispatch({type:FETCH_SUCCESS,payload:res.data}))
        .catch(err => dispatch({type:FETCH_SUCCESS,payload:'Błąd'}))
      },[])

    const logout = () => {
        axios.post(`http://localhost:5000/Moto/logout`,'',{headers:{Authorization:`Bearer ${jwt}`}})
        .then(res => localStorage.removeItem('cool-jwt'))
        .catch(err => console.log('Błąd!'+err.msg))
        setTimeout(() => {window.location.href = '/Login'},2000)
      }
      console.log(photos)
  return (
    <div className="Navbar">
        <Link to={'/helmets'} className="Navbar-Picture">
            <img  className="Navbar-Picture-Logo" 
            src="https://araipolska.pl/wp-content/uploads/2014/04/arai-logo-BLK.png" 
            alt="Loading..." 
            title="ARAI POLSKA" />
        </Link>
        {jwt &&
        <div className="Navbar-right-div-one">
              <div  className="Navbar-right-div-photo"><img className="Navbar-right-div-photo-img" src={!photos.loading && photos.post.userPhoto} alt="Me"/></div>
              <div>{!photos.loading && photos.post.username}</div>
        </div> }
        {!jwt && <Link to={'./Login'}><IoMdLogIn color="black" size="40px"/></Link>}
        {jwt && <div><IoMdLogOut onClick={logout} color="black" size="40px" /></div>}
    </div>
  );
}

export default Navbar;