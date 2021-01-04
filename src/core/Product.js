import React, { useEffect, useState, Fragment } from 'react';
import * as firebase from 'firebase'
import { Row, Col, Container } from 'react-bootstrap'
import '../Styles/productcard.css'
import { addItem, updateItem } from '../helpers/CartHelper'
import { Link } from 'react-router-dom'
import ShowImage from '../PagesHelper/Showimage'
import Card from '../PagesHelper/Card'
import StarRatings from 'react-star-ratings';
import $ from 'jquery'
import { toast, ToastContainer } from 'react-toastify';

const Product = (props) => {

    const [special, setSpecial] = useState([])
    const db = firebase.firestore()
    const _id = props.match.params.dishId
    const [pro, setPro] = useState()
    const [count, setCount] = useState(1);
    const [quan, setquan] = useState(500)
    const [resh, setResh] = useState([])
    const [priccce, setpriccce] = useState(0)
    const [fakeprice, setfakeprice] = useState(0)
    const [revi, setRevi] = useState([])
    const [pirro, setpiroo] = useState({
        category: '',
        iPrice: '',
        price: '',
        name: '',
        rating: '',
        sCat: '',
        url: '',
        url2: '',
        url3: '',
        _id: '',
        description: '',
        quantity: ''
    })
    const [frequent, setfrequent] = useState('')

    useEffect(() => {
        setSpecial([])
        $(document).ready(function () {
            $(this).scrollTop(0);
        });
        db.collection('Dishes').where("special", "==", true).get()
            .then(res => {
                res.forEach((doc) => {
                    setSpecial(dish => [...dish, { data: doc.data(), _id: doc.id }])
                })
            })
        setRevi([])
        db.collection('Reviews').where('productId', '==', _id).limit(3).get()
            .then(res => {
                res.forEach((doc) => {
                    setRevi(rev => [...rev, { data: doc.data(), _id: doc.id }])
                })
            })
    }, [_id])

    useEffect(async () => {
        await db.collection('Dishes').doc(_id).get()
            .then(res => {
                setPro(res.data())
                setResh([])
                setpriccce(res.data().price)
                setfakeprice(res.data().iPrice)
                setpiroo({
                    ...pirro, category: res.data().category, iPrice: res.data().iPrice, price: res.data().price, name: res.data().name,
                    rating: res.data().rating, sCat: res.data().sCat, url: res.data().url, url2: res.data().url2, url3: res.data().url3,
                    _id: _id, description: res.data().description, quantity: quan,
                })
                db.collection("Dishes").where("category", "==", `${res.data().category}`).get()
                    .then(res => {
                        res.forEach((doc) => {
                            setResh(resu => [...resu, { data: doc.data(), _id: doc.id }])
                        })
                    })
                db.collection("Dishes").doc(`${res.data().boughtTogether}`).get()
                    .then(res => {
                        setfrequent(res.data())
                    })
            })
    }, [_id])

    const handleChangepostive = () => e => {
        const q = count + 1
        setCount(q < 1 ? 1 : q)
    }
    const handleChangeneagative = () => e => {
        const w = count - 1
        setCount(w < 1 ? 1 : w)
    }

    const addToCart = async (e) => {
        await addItem(pirro, () => {
            if (count > 0) {
                updateItem(_id, count)
            }
            toast.success('Item added sucessfully !!!')
            // window.location.reload(false)
        })
    }

    const handleChanged = () => (e) => {
        setquan(e.target.value)
        const k = e.target.value / quan
        setpriccce(k * priccce)
        setfakeprice(k * fakeprice)
        setpiroo({ ...pirro, price: k * priccce, quantity: e.target.value, iPrice: k * pro.iPrice })
    };

    const rrate = pro && pro.rating && Math.round(pro.rating)

    const freqbodis = pro && pro.boughtTogether

    return (
        <div className='hwami'>
            <ToastContainer />
            <div className="proccard">
                {
                    pro && pro.name && pro.url
                        ?
                        <div className="proccard1">
                            <Container fluid>
                                <Row>
                                    <Col md={5} xl={5}>
                                        <ShowImage item={pro} url="product" />
                                    </Col>
                                    <Col md={5} xl={5}>
                                        <div className="proccard2">
                                            <h5>{pro.name}</h5>
                                            <h6>{pro.category}</h6>
                                            <p>Rs {priccce}  <span>Rs {fakeprice}</span> </p>
                                            <h4>
                                                <StarRatings
                                                    rating={rrate}
                                                    starDimension="15px"
                                                    starSpacing="5px"
                                                    starRatedColor="rgb(255,176,0)"
                                                /></h4>
                                            <div style={{ color: 'gray', marginBottom: '-10px' }}><a href="#noob-rating" style={{ color: 'inherit' }}>{revi.length} rating & reviews</a></div>
                                            <div className="proccard4">
                                                <span>Adjust Quantity</span>
                                                <select onChange={handleChanged()} className="proccard5">
                                                    <option value='500'>500 ML</option>
                                                    <option value='1000'>1000 ML</option>
                                                    <option value='1500'>1500 ML</option>
                                                    <option value='2000'>2000 ML</option>
                                                </select>
                                            </div>
                                            <div>
                                                <span>{pro.productId}</span>
                                                {
                                                    pro.stock ?
                                                        <p style={{ fontSize: '17px' }}><i class="fa fa-check-circle" aria-hidden="true"></i> In Stock </p>
                                                        :
                                                        <p style={{ color: 'red', fontSize: '17px' }}><i class="fa fa-times-circle" aria-hidden="true"></i> Out Of Stock</p>
                                                }
                                            </div>
                                            <div className="proccard6">
                                                <span>No of Items</span>
                                                <div className="proccard611">
                                                    <button className='dec' onClick={handleChangeneagative()}>-</button>
                                                    <h1>{count}</h1>
                                                    <button className='inc' onClick={handleChangepostive()}>+</button>
                                                </div>
                                            </div>
                                            <div className="proccard7">
                                                <button onClick={addToCart}>Add To Cart</button>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={2} xl={2}>
                                        {
                                            frequent &&
                                            <div className='tic-ttok'>
                                                <h5>Frequently Bought Together</h5>
                                                <div className='tic-ttok4'>
                                                    {
                                                        frequent &&
                                                        <div className='tic-ttok1'>
                                                            <img src={`${frequent.url}`} alt="img-url" />
                                                            <h6>Rs {frequent.price}</h6>
                                                            <p>{frequent.name}</p>
                                                        </div>
                                                    }
                                                    <div className='tic-ttok2'><h3>+</h3></div>
                                                    <div className='tic-ttok1'>
                                                        <img src={`${pro.url}`} alt="img-url" />
                                                        <h6>Rs {pro.price}</h6>
                                                        <p>{pro.name}</p>
                                                    </div>
                                                </div>
                                                <div className="proccard7 tic-ttok3">
                                                    <button>Add To Cart</button>
                                                </div>
                                            </div>
                                        }
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                        :
                        null
                }
                <div className="proccard8">
                    <div className="ffdfd">
                        <Container fluid>
                            <Row>
                                <div className='ffdfd1'>
                                    <h4>Buy {pro && pro.name} Online</h4>
                                    <p>{pro && pro.description}</p>
                                </div>
                                <h5 className='ffdfd2'>Related Products</h5>
                                {
                                    resh && resh.length <= 1 ?
                                        <h5>No Product Found !!</h5>
                                        :
                                        null
                                }
                                {
                                    resh && resh.map((d, k) => (
                                        <Fragment>
                                            {
                                                d.data.name !== pro.name ?
                                                    <Col lg={4} xl={4} key={k} sm={6} xs={6} className='ffdfd3'>
                                                        <Card product={d} />
                                                    </Col>
                                                    :
                                                    null
                                            }
                                        </Fragment>
                                    ))
                                }
                            </Row>
                            <div className='rate-reiview' id="noob-rating">
                                <div className='rate-reivieww'>
                                    <div><h4>Ratings & Reviews <span>{pro && pro.rating} <i class="fa fa-star" aria-hidden="true"></i></span></h4></div>
                                    <div style={{ color: 'gray' }}> {revi.length} rating & reviews</div>
                                </div>
                                {

                                    revi && revi.map((o, p) => (
                                        <div className='rate-reiview1'>
                                            <div className='rate-reiview2'>
                                                <span>{o.data.rating}<i class="fa fa-star" aria-hidden="true"></i></span>
                                                {o.data.details}
                                            </div>
                                            <div className='rate-reiview3'>
                                                <div style={{ color: 'gray', marginTop: '4px' }}><img src={`${o.data.userImage}`} alt='no image' /> {o.data.userName}</div>
                                                <div>
                                                    <p style={{ color: 'blue', marginTop: '5.2px' }}><i class="fa fa-check-circle" aria-hidden="true"></i> Certifield Buyer</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                                {
                                    revi.length === 0 ? <p>No Reviews Now !!!</p> : null
                                }
                            </div>
                        </Container>
                        <div className='cnpp ffdfd5'>
                            <h5>Special Products</h5>
                            {
                                special.map((x, c) => (
                                    <Link to={`/dish/${x._id}`}>
                                        <div className='cnpp1'>
                                            <div className='cnpp2'>
                                                <img src={x.data.url} alt="special product" />
                                            </div>
                                            <div className='cnpp3'>
                                                <h6>{x.data.name}</h6>
                                                <p>Rs {x.data.price}</p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Product;