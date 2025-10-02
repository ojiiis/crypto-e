const { JSDOM } = require('jsdom');
const puppeteer = require('puppeteer');
/*
(async () => {
  // Launch browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Go to website
  await page.goto('https://example.com');

  // Take screenshot
  await page.screenshot({ path: 'example.png' });

  // Close browser
  await browser.close();
})();
*/
const getPrice = async (coin = null,callback) => {
   const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  await page.goto('https://coinmarketcap.com');
  const html = await page.content(); // Gets full HTML of the page
  //console.log(html);
const dom = new JSDOM(html);
const document = dom.window.document;

        let rows = document.getElementsByClassName("cmc-table")[0].getElementsByTagName("tbody")[0].getElementsByTagName("tr");
        let data = [];
        [...rows].forEach((v,i)=>{
            let fetch = {};
            fetch.coin = v.getElementsByTagName("td")[2].getElementsByTagName("a")[0].href.split("currencies/")[1].slice(0,-1);
            fetch.price = v.getElementsByTagName("td")[3].textContent;
            fetch.change1hr = v.getElementsByTagName("td")[4].textContent;
            //console.log(v.getElementsByClassName("sc-d5c03ba0-0")[0]?.textContent);
            //fetch.change24hr = v.getElementsByTagName("td")[5].textContent;
            //fetch.change7d = v.getElementsByTagName("td")[6].textContent;
         data.push(fetch);
        });
if(coin){
  return data.filter((v)=>v.coin == coin);
}
//console.log(data); // Output: "World"


  await browser.close();
  if(typeof callback == "function"){
    callback(data);
  }
  console.log("done");
  return data;
}

(
  async () => {
    console.log(await getPrice("bitcoin")); 
  }
)();
/*
*/
/*
getPrice("bitcoin",(r)=>{
console.log(r)
});
console.log(getPrice().then(r=>c));*/
