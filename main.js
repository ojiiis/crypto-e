const { exec } = require('child_process');
const { JSDOM } = require('jsdom');
const http = require('http');

const extractPriceData = (data)=>{
 
      const dom = new JSDOM(data);
  const document = dom.window.document;
    let rows = document.getElementsByClassName("cmc-table")[0]?.getElementsByTagName("tbody")[0]?.getElementsByTagName("tr");
     
    let out = [];
        [...rows].forEach((v,i)=>{
            let fetch = {};
            fetch.coin = v.getElementsByTagName("td")[2].getElementsByTagName("a")[0].href.split("currencies/")[1].slice(0,-1);
            fetch.price = v.getElementsByTagName("td")[3].textContent;
            fetch.digitPrice = v.getElementsByTagName("td")[3].textContent.replace(".","").replace("$","").replace(",","");
            fetch.change1hr = v.getElementsByTagName("td")[4].textContent;
            //console.log(v.getElementsByClassName("sc-d5c03ba0-0")[0]?.textContent);
            //fetch.change24hr = v.getElementsByTagName("td")[5].textContent;
            //fetch.change7d = v.getElementsByTagName("td")[6].textContent;
         out.push(fetch);
        });
  return out;
}

const getPrice = ()=>{
    return new Promise((resolve,reject)=>{
    let loads = `curl -v "https://coinmarketcap.com" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" \
  -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8" \
  -H "Accept-Language: en-US,en;q=0.9" \
  -H "Connection: keep-alive" \
  -H "Upgrade-Insecure-Requests: 1" \
  -H "Cache-Control: max-age=0"`;
  let loads1 = `ls -l`;
    // Run `ls` to list directory contents on Linux/macOS
exec(loads, (error, stdout, stderr) => {
  if (error) {
   // console.error(`exec error: ${error}`);
    reject(error);
    //return;
  }
  if (stderr) {
   // console.error(`stderr: ${stderr}`);
   // return;
   // reject(stderr);
  }
  resolve(extractPriceData(stdout));
  //return stdout;
  
});
});
}

const extractRateData = (data)=>{
    const dom = new JSDOM(data);
  const document = dom.window.document;
  // console.log(document.body);
    let out = document.getElementsByTagName('main')[0]?.getElementsByTagName("div")[19]; 
  return out?.innerHTML.match(/data-last-price="(.*?)"/)[1];
}

const getRate = (from,to)=>{
    return new Promise((resolve,reject)=>{
    let loads = `curl -v "https://www.google.com/finance/quote/${from}-${to}" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36" \
  -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8" \
  -H "Accept-Language: en-US,en;q=0.9" \
  -H "Connection: keep-alive" \
  -H "Upgrade-Insecure-Requests: 1" \
  -H "Cache-Control: max-age=0"`;
  let loads1 = `ls -l`;
    // Run `ls` to list directory contents on Linux/macOS
exec(loads, { maxBuffer: 1024 * 1024 * 10 },(error, stdout, stderr) => {
  if (error) {
   // console.error(`exec error: ${error}`);
    reject(error);
    //return;
  }
  if (stderr) {
   // console.error(`stderr: ${stderr}`);
   // return;
   // reject(stderr);
  }
  resolve(extractRateData(stdout));
  //return stdout;
  
});
});
}

const server = http.createServer(async (req,res)=>{
   // const [url,query]= req.url.toString().split("?");
    //req.url = url;
  //  if(req.url == );
  let match = req.url.match(/convert\/([a-zA-Z]+)\/([a-zA-Z]+\/[0-9]+|[a-zA-Z]+)/);
  if(!match){
     res.end("");
     return;
  }
  let coin = match[1];
  let to = match[2].split("/")[0];
  let value = (match[2].split("/")[1] != undefined)?match[2].split("/")[1]:1;
 // console.log(coin);
  let b = await getPrice(coin);
   b = b.filter((v)=>v.coin.toLowerCase() == coin.toLowerCase());
  let price = b[0].digitPrice;
  
  if(to.toUpperCase() !== "USD"){
    price = price * await getRate('USD',to.toUpperCase());
  }
  res.setHeader('Content-Type','application/json');
  let out = {
     status:1,
     data:{
      value:parseInt(price) * parseInt(value),
      change24h:null,
      change7d:null
     } 
    }
  res.end(JSON.stringify(out));
});
server.listen(3000);
