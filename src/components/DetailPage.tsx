import React,{useState,useReducer, useEffect} from 'react';
import axios from 'axios'

import { FcLike, FcDislike,FcDeleteRow } from 'react-icons/fc';
import Loader from './Loader';
import { getJwt } from '../jwt';

interface Post {
    _id:string,
    helmetName:string,
    helmetPrice:number,
    helmetPhotos:[string]
    helmetDescription:string,
    overallRatio?:number,
    helmetComments:any
}

type Actions = 
    | {type:'FETCH_SUCCESS'; payload:any} 
    | {type:'FETCH_FAIL'; payload:string}


interface State {
    loading:boolean,
    post:object | Post,
    err:string
}

const FETCH_SUCCESS = 'FETCH_SUCCESS'
const FETCH_FAIL = 'FETCH_FAIL'

const initialState = {
    loading:true,
    post:{},
    err:''
}

const reducer = (state:State,action:Actions) => {
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

const DetailPage:React.FC = (props:any) => {

    const [photos,dispatch] = useReducer(reducer,initialState)
    const [bigPhoto,setBigPhoto] = useState<number>(0)
    const [commentText,setComment] = useState<string>()
    const jwt = getJwt()

    useEffect(() => {
        axios.get(`http://localhost:5000/Moto/helmet/${props.match.params.id}`)
        .then(res => dispatch({type:FETCH_SUCCESS,payload:res.data}))
        .catch(err => dispatch({type:FETCH_SUCCESS,payload:'Błąd'}))
    },[])

    const dodajKomentarz = () => {
        axios.post(`http://localhost:5000/Moto/addComment/${props.match.params.id}`,{commentText},{headers:{Authorization:`Bearer ${jwt}`}})
        .then(res => setTimeout(() => window.location.href = `./${props.match.params.id}`,1000))
        .catch(err => window.alert("Nie dodano"))
    }
    
    const usunKomentarz = (commentId:string) => {
        axios.post(`http://localhost:5000/Moto/deleteComment/${props.match.params.id}/comment/${commentId}`,'',{headers:{Authorization:`Bearer ${jwt}`}})
        .then(res => setTimeout(() => window.location.href = `./${props.match.params.id}`,1000))
        .catch(err => {window.alert('Nie możesz usunąć komantarza innego użytkownika!')})
    }

    const {_id,helmetComments,helmetDescription,helmetName,helmetPrice,helmetPhotos} = photos.post

    interface itemProps {
        _id:string,
        commentDate:string,
        commentDisLikes?:number,
        commentLikes?:number,
        commentText:string,
        commentedBy:any
    }

    return (
        <div className="DetailPage">
            {photos.loading ? <Loader /> :
                <React.Fragment>
                    <div className="DetailPage-Content">
                        <div className="Photos">
                            <div className="BigPhoto"><img  className="BigPhoto-Img" src={helmetPhotos[bigPhoto]}/></div>
                            <div className="SmallPhotos">
                                {helmetPhotos.map((item:string,index:number) => {
                                    return <div onClick={() => setBigPhoto(index)} className="SmallPhoto-Img"><img className="SmallPhoto-Img-Pic" src={item}/></div>})}
                            </div>
                        </div>
                        <div className="Description">
                            <div className="Description-Name">{helmetName}</div>
                            <div className="Description-Price">{helmetPrice} zł</div>
                            <div className="Description-Desc">{helmetDescription}</div>
                        </div>
                    </div> 
                    <div className="Comments">
                        <div><h1>Komentarze:</h1></div>
                        {helmetComments.length == 0 ? <p>Brak komentarzy</p> : 
                            <div className="Comments-Comments">
                                {photos.post.helmetComments.map((item:itemProps) => <Comment removeCom={() => usunKomentarz(item._id)} key={item._id} item={item} />)}
                            </div> 
                        }
                        {jwt &&
                            <div className="Comments-AddComment">
                                <input placeholder="Dodaj komentarz..." style={{margin:"10px"}} onChange={(e:any) => setComment(e.target.value)} type="text"/>
                                <button onClick={dodajKomentarz} className="custom-btn btn-8"><span>Dodaj komentarz</span></button>
                            </div> 
                        }
                    </div> 
                </React.Fragment>
            }
        </div>
    );
}

interface CommentProps {
     item:{
        _id:string,
        commentDate:string,
        commentDisLikes?:number,
        commentLikes?:number,
        commentText:string,
        commentedBy:any
    },
    removeCom:() => void
}

export default DetailPage;

const Comment:React.FC<CommentProps> = (props) => {

    const {_id,commentDate,commentDisLikes,commentLikes,commentText,commentedBy} = props.item

    return (
        <div className="Comment">
            <div className="Comment-Picture"><img src={commentedBy.userPhoto} className="Comment-Picture-Logo" /></div>
            <div className="Comment-Content">
                <div className="Comment-Data">
                    <div className="Comment-Data-User">{commentedBy.username}</div>
                    <div className="Comment-Data-Date">{commentDate.slice(0, 10)}</div>
                </div>
                <div className="Comment-Text">{commentText}</div>
                <div className="Comment-Tags">
                    <div onClick={props.removeCom}><FcDeleteRow size="30px" color="red" /></div>
                </div>
            </div>
        </div>
    )
}