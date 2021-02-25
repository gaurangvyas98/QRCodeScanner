// Import npm packages
const express = require('express');
const morgan = require('morgan');
const azure = require('azure-storage');
const qrcode = require('qrcode');
const { v1: uuidv1 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8080; // Step 1


// Data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// HTTP request logger
app.use(morgan('tiny'));
// app.use('/api', routes);


var qrCodeString;

// Routes
app.get('/getQRString', (req, res) => {
    res.json(qrCodeString);
});

app.post('/save', (req, res) => {
    console.log(req.body)
    var strBody = req.body;
    // data = req.body;
    // save into azure Storage
    var uniqId = uuidv1();
    insertIntoAzure(strBody, uniqId, res);
    res.json(qrCodeString)
});

const generateQR = async text => {
    try {
      return await qrcode.toDataURL(text);
    } catch (err) {
      console.error(err)
    }
}

async function  insertIntoAzure(inputObj, uniqId, res)  {
    let tableService = azure.createTableService("saqrdemo","/1gsWe9n9smSPdc1QCiGcBFqNnmWbzU+qpZxZGSktrmm6lylbkFnOvFChxuib+GejmlYqoZThpF5mG2ezscF5w==");
    
    var status = "";
    console.log('Author test :'+ inputObj.bkAuthor+ " "+ uniqId);
    
    var itemObj = {
      PartitionKey : {'_': 'QRDATA', '$':'Edm.String'},
      RowKey: {'_': uniqId, '$':'Edm.String'},
      BookAuthor: {'_': inputObj.facilityName, '$':'Edm.String'},
      BookPrice: {'_': inputObj.serialNumber, '$':'Edm.Int32'},
      BookTitle: {'_': inputObj.productType, '$':'Edm.String'},
      BuyURL: {'_': inputObj.url, '$':'Edm.String'}
    };
  
    await tableService.insertEntity('tblQRData', itemObj, { echoContent: true }, function (error, result, response) {
      if (!error) {
        console.log(response);
        if (response.statusCode == 201 && response.isSuccessful) {
          //create QR Code
        //   res.setHeader('Content-Type', 'text/html');
        //   res.write(' <h2>QR Code Generated </h2><h3> Please scan below QR code to test - </h3><br/>');
          //console.log('Data inserted successfully.. Creating QR Code ... ');
          isSuccess = true;
          generateQR("http://localhost:8000/QRScanned?qid="+uniqId).then(str => {
            //console.log(str);
            // res.end('<img src="'+str+'" />');
            qrCodeString = str;
            console.log("QRCode String", qrCodeString);
          });
          res.end();
        }
      } else {
        console.log(error);
        res.end('Oops! There was an error, please try again.');
      }
    });
  }

app.get("/QRScanned", (req,res)=>{

  const qid = req.query.uniqueId;
  console.log(qid)
  //get Data
  let tableService = azure.createTableService("saqrdemo","/1gsWe9n9smSPdc1QCiGcBFqNnmWbzU+qpZxZGSktrmm6lylbkFnOvFChxuib+GejmlYqoZThpF5mG2ezscF5w==");
  //console.log('Trying to connect');
  if (tableService != null)  {
    //console.log('9390166268 to Table');
    var query = new azure.TableQuery()
    .where('PartitionKey eq ?', 'QRDATA')
    .and ('RowKey eq ?',''+qid);

    tableService.queryEntities('tblQRData',query, null, function(error, result, response) {
        if(!error) {
          //console.log('result.entries - ' + result.entries.length);//.entries.length);
          console.log(result.entries);
          if (result.entries.length> 0) {
              res.json(result)
            // strQRScanHTMLCOde = strQRScanHTMLCOde.replace('$bookAuthor',result.entries[0].BookAuthor._);
            // strQRScanHTMLCOde = strQRScanHTMLCOde.replace('$bookTitle',result.entries[0].BookTitle._);
            // strQRScanHTMLCOde = strQRScanHTMLCOde.replace('$bookPrice',result.entries[0].BookPrice._);
            // strQRScanHTMLCOde = strQRScanHTMLCOde.replace('$buyUrl',result.entries[0].BuyURL._);
            // res.end(strQRScanHTMLCOde);
          }
          else {
            strQRScanHTMLCOde = 'Oops!! Sorry we could find any data with QR code scanned.';
            res.end(strQRScanHTMLCOde);
          }
        }
        else {
          strQRScanHTMLCOde = 'Error! Please contact support team.';
          res.end(strQRScanHTMLCOde);
          //console.log(error);
        }
      });
    tableService = null;  
  }
})



app.listen(PORT, console.log(`Server is starting at ${PORT}`));