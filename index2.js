const { exec } = require('child_process');
const { JSDOM } = require('jsdom');

const extractData = (data)=>{
 
      const dom = new JSDOM(data);
  const document = dom.window.document;
    let rows = document.getElementsByClassName("cmc-table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
     
    let out = [];
        [...rows].forEach((v,i)=>{
            let fetch = {};
            fetch.coin = v.getElementsByTagName("td")[2].getElementsByTagName("a")[0].href.split("currencies/")[1].slice(0,-1);
            fetch.price = v.getElementsByTagName("td")[3].textContent;
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
  resolve(extractData(stdout));
  //return stdout;
  
});
});
}



(async ()=>{
    let a = await getPrice();
   // console.log(extractData(a));
    console.log(a,' test');
})();
