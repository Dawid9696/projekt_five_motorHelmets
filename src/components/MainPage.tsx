import React,{useState,useReducer, useEffect} from 'react';
import {Link} from 'react-router-dom'
import axios from 'axios'
import { FaFilter } from 'react-icons/fa';
import { lookup } from 'dns';
import Loader from './Loader';


interface Posts {
    _id:string,
    helmetName:string,
    helmetPrice:number,
    helmetPhotos:[string]
}

type Actions = 
    | {type:'FETCH_SUCCESS'; payload:any} 
    | {type:'FETCH_FAIL'; payload:string}


interface State {
    loading:boolean,
    post:object | Posts,
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
            loading:true,
            post:{},
            err:action.payload
        }
        default:return state
    }
}

interface styleProps {
    top:string,
    opacity:string,
    transition:string
}

const MainPage:React.FC = () => {

    const [textStyle,setTextStyle] = useState<styleProps>({
        top:'200px',
        opacity:'0',
        transition:'1s'
    })

    useEffect(() => {
        setTimeout(() => setTextStyle({top:'0px',opacity:'1',transition:'1s'}),0)
    },[])

    const [photos,dispatch] = useReducer(reducer,initialState)
    const [limit,setLimit] = useState<any>(100)
    const [name,setName] = useState<string>('')
    const [sort,setSort] = useState<boolean>(true)
    const [greater,setGreater] = useState<string>('0')
    const [lower,setLower] = useState<string>('10000')

    useEffect(() => {
        axios.get(`http://localhost:5000/Moto/helmets?limit=${limit}&skip=0&priceSortDescending=${sort}&priceGreaterThan=${greater}&priceLowerThan=${lower}&filter=${name}`)
        .then(res => dispatch({type:FETCH_SUCCESS,payload:res.data}))
        .catch(err => dispatch({type:FETCH_SUCCESS,payload:'Błąd'}))
      },[sort,limit,lower,greater,name])

    interface itemProps {
        _id: string,
        helmetName: string,
        helmetPrice: number,
        helmetPhotos: [string]
    }

    return (
        <div className="MainPage">
            {photos.loading ? <Loader /> :
            <React.Fragment>
                <div className="MainPage-FirstSection">
                    <div className="MainPage-FirstSection-Photo">
                        <img className="MainPage-FirstSection-Photo-Img" src="https://cdp.azureedge.net/products/USA/KA/2018/MC/SPORT/NINJA_400_KRT_EDITION/50/LIME_GREEN_-_EBONY/2000000002.jpg"/>
                    </div>
                    <div className="MainPage-FirstSection-Text" style={textStyle}>
                        <p>
                            Od ponad 90 lat specjalizujemy się w tworzeniu kasków premium. Opracowaliśmy najbardziej zaawansowane technologie stosowane obecnie również przez inne marki (m.in. ECRS, CLC, PB-SNC, 3-strefowy EPS, R75). Ponad połowa zawodników wyścigów Isle Of Man TT oraz Formuły 1 jeździ w naszych kaskach. Niemal 95% osób, które kupiły nasz kask, pozostaje wierna naszej marce.
                        </p>
                    </div>
                </div>
                <div  className="MainPage-SecondSection"></div>
                <div  className="MainPage-ThirdSection">
                    <div  className="MainPage-ThirdSection-Filter">
                        <div  className="MainPage-ThirdSection-Filter-normal"><h3>Filtruj Wg  <FaFilter /></h3></div>
                        <div  className="MainPage-ThirdSection-Filter-normal"><i>{photos.post.length} Produktów</i></div>
                        <input type="text" placeholder="Szukaj produkt..." onChange={(e) => setName(e.target.value)}/>
                        <div  className="MainPage-ThirdSection-Filter-Show">
                            <div onClick={() => setLimit(4)}>4 szt.</div>
                            <div onClick={() => setLimit(8)}>8 sz.</div>
                            <div onClick={() => setLimit(16)}>16 sz.</div>
                        </div>
                        <div className="MainPage-ThirdSection-Filter-unnormal" onClick={() => setSort(false)}>Cena od najniższej</div>
                        <div className="MainPage-ThirdSection-Filter-unnormal" onClick={() => setSort(true)}>Cena od najwyższej</div>
                        <input type="range" max="5000" onChange={(e) => setGreater(e.target.value)} value={greater}/>
                        <div><p>Cena od: {greater} zł</p></div>
                        <input type="range" max="5000" onChange={(e) => setLower(e.target.value)} value={lower}/>
                        <div><p>Cena do: {lower} zł</p></div>
                    </div>
                    <div  className="MainPage-ThirdSection-Cards">
                        {photos.post.map((item:itemProps) => <HelmetCard key={item._id} helmet={item}  />)}
                    </div>
                </div> 
            </React.Fragment>}
        </div>
  );
}

export default MainPage;

interface HelmetCardProps {
    helmet:{
        _id:string,
        helmetName:string,
        helmetPrice:number,
        helmetPhotos:[string]
    }
}

const HelmetCard:React.FC<HelmetCardProps> = (props) => {

    const {helmetName,helmetPhotos,helmetPrice,_id} = props.helmet

    return ( 
        <Link to={`./helmet/${_id}`}className="HelmetCard">
            <div className="HelmetCard-Hover">ZOBACZ</div>
            <div className="HelmetCard-Photo">
                <img  className="HelmetCard-Photo-Img" src={helmetPhotos[0]} />
            </div>
            <div className="HelmetCard-Name">{helmetName}</div>
            <div className="HelmetCard-Price">{helmetPrice} zł</div>
        </Link>
    )
}