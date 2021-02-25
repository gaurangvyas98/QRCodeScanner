import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function DetailsPage() {

    const [data, setData] = useState();
    // const [qid, setQid] = useState();

    var { id } = useParams();
    console.log(id)
    // setQid(id);
    
    useEffect(() => {
        axios.get("/QRScanned", {
            params: {
              uniqueId: id
            }}).then((response) => {
                setData(response.data.entries[0])       
                console.log('Data has been received!!', response.data.entries[0]);
              })
              .catch(() => {
                alert('Error retrieving data!!!');
              });

    }, [])
    console.log('222', data);

    if(data){
        return(
           <div className="detailsContainer">
            <h1 style={{textAlign: "center"}}>Details</h1><br />
            <div className="detailsDiv">
               <h3>Product Type </h3> : <h4> {data.BookAuthor._}</h4> 
            </div>
            <div className="detailsDiv">
               <h3>Facility Name </h3> : <h4> {data.BookTitle._}</h4> 
            </div>
            <div className="detailsDiv">
               <h3>Serial Numbe </h3> : <h4> {data.BookPrice._}</h4> 
            </div>
            <br />
            <div className="detailsDiv">
                <button type="button" className="btn btn-primary" style={{margin: "0 auto", display: "flex"}}>
                    <a href={data.BuyURL._} target="_blank" style={{textDecoration: "none", color: "white"}}>Go to url</a>
                </button>
            </div>
            </div>

        )
    }
    else{
        return(
            <h1>
                LOADING.....
            </h1>
        )
    }
}


