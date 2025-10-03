const { exec } = require('child_process');
const { JSDOM } = require('jsdom');
const puppeteer = require('puppeteer');



const extractPriceData = (data)=>{
 
      const dom = new JSDOM(data);
  const document = dom.window.document;
    let rows = document.getElementsByTagName("section")[2].getElementsByTagName("div")[0].getElementsByTagName("div")[0];
    console.log(rows.innerHTML);

    /*
    let out = [];
        [...rows].forEach((v,i)=>{
          console.log(v, ' /content end/ id '+i);
        });
    */
        
  return rows;
}

const getPrice2 = (currencyName,from,to)=>{
    return new Promise((resolve,reject)=>{
    let loads = `curl -v "https://coinmarketcap.com/currencies/${currencyName.toLowerCase()}/${from.toLowerCase()}/${to.toLowerCase()}/" \
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
  resolve(extractPriceData(stdout));
  //return stdout;
  
});
});
}

(async ()=>{
    let a = await getPrice2('bitcoin','BTC','NGN');
   // console.log(a);
})();