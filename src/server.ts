import puppeteer from "puppeteer";

const url = "https://www.mercadolivre.com.br/";
const searcFor = "macbook";
let count = 1;
let items = [];

(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();

    console.log('init')

    await page.goto(url)

    await page.waitForSelector('#cb1-edit')
    await page.type('#cb1-edit', searcFor)
  

    await Promise.all([
        page.waitForNavigation(),
        page.click('.nav-icon-search')
    ])

    const links  = await page.$$eval('.ui-search-result__image > a', el => el.map( lk => lk.href))

    for(const link  of links){

        if(count == 10) continue;
    
        await page.goto(link)

        const title = await page.$eval('.ui-pdp-title', el => el?.innerText )
        const price = await  page.$eval('.andes-money-amount__fraction',el => el?.innerText)
        const seller = await page.evaluate(()=> {
            const element = document.querySelector('.ui-pdp-action-modal__link > span')
            if(!element) return '--'
            return element?.innerText
        })
        
        const item = {
            title,
            price,
            seller,
            link
        }
        console.log(item)
        // items.push(item)
        count++;
    }
    console.log(links)
    await delay(3000)
    console.log('pagina url')
    await browser.close();
})();

function delay(time: any) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }
