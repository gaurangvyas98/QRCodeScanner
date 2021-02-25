import React, { useState } from 'react'
import axios from 'axios'

export default function Home() {
    const [productType, setProductType] = useState();
    const [facilityName, setFacilityName] = useState();
    const [serialNumber, setSerialNumber] = useState();
    const [url, setUrl] = useState();
  
    const [data, setData] = useState({});
  
  
    const submit = (event) => {
      event.preventDefault();
      const payload = {
        productType,
        facilityName,
        serialNumber,
        url
      };
      axios({
        url: '/save',
        method: 'POST',
        data: payload
      })
        .then((res) => {
          console.log('Data has been sent to the server',res);
        })
        .catch(() => {
          console.log('Internal server error');
        });
    };
  
    const getData=(e)=>{
      e.preventDefault();
      axios.get('/getQRString')
        .then((response) => {
          setData(response.data)       
          console.log('Data has been received!!', response.data);
        })
        .catch(() => {
          alert('Error retrieving data!!!');
        });
    }
  
    return (
        <div className="app">
            <form>
                <h3>Generate QR Code</h3><br />
                <input placeholder="Product type" value={productType} type="text" className="form-control"
                onChange={e=>setProductType(e.target.value)}></input>
                <input placeholder="Facility Name" value={facilityName} type="text" className="form-control"
                onChange={e=>setFacilityName(e.target.value)}></input>
                <input placeholder="Serial Number" value={serialNumber} type="text" className="form-control"
                onChange={e=>setSerialNumber(e.target.value)}></input>
                <input placeholder="URL" value={url} type="text" className="form-control"
                onChange={e=>setUrl(e.target.value)}></input>
                <button onClick={submit} className="btn btn-primary mx-2">Generate</button>
                <button onClick={getData} className="btn btn-primary mx-2">View</button>
            </form>
            <div className="content-div text-center">
                <h3 >QR Code</h3>
                <img src={data}></img> 
            </div>
        </div>
   )
}
