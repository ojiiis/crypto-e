const { exec } = require('child_process');
const { JSDOM } = require('jsdom');
const puppeteer = require('puppeteer');

const extractData = (data)=>{
    const dom = new JSDOM(data);
  const document = dom.window.document;
  // console.log(document.body);
    let out = document.getElementsByTagName('main')[0].getElementsByTagName("div")[19]; 
  return out.innerHTML.match(/data-last-price="(.*?)"/)[1];
}
const browser = async () => {
  // Launch browser
 const browser = await puppeteer.launch({
     args: ['--no-sandbox', '--disable-setuid-sandbox'],
   });
  const page = await browser.newPage();

  // Go to website
  await page.goto('https://www.google.com/finance/quote/USD-EUR');

  // Take screenshot
 const html = await page.content();

  // Close browser
  await browser.close();
 // console.log(html,' browser');
  return html;
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
  resolve(stdout);
  //return stdout;
  
});
});
}



(async ()=>{
    let a = await getRate("USD","NGN");
  // let a = await browser();
   console.log(extractData(a));
   // console.log(a,' test');
})();
