const puppeteer = require('puppeteer')
const config = require('./config')

process.env.PHONE = '01012345678';

(async () => {
  let browser = await puppeteer.launch(config)
  try {
    const context = await browser.createIncognitoBrowserContext()
    const page = await context.newPage()
    const navigationPromise = page.waitForNavigation()

    await page.goto('https://globfone.com/send-text-online/')
    await navigationPromise
  
    await page.waitForSelector('input[type="tel"]')
    await page.click('input[type="tel"]')
    await navigationPromise
  
    await page.type('input[type="tel"]', process.env.PHONE.replace(/-/g, '').replace('010', '10'))
    await page.waitForSelector('#next-step')
    await page.click('#next-step')
    await navigationPromise
  
    // 타이밍 조정용, 최대 3번 max
    let reqtry = 0
    while (reqtry < 3){
      try {
        await page.waitFor(1000)
        await page.waitForSelector('textarea')
        break
      } catch (e) {
        console.log('retry!!!!', e)
      } finally {
        reqtry += 1
      }
    }
    
    await page.type('textarea', `Auth Code [${new Date().getTime() % 10000}}]`)
    await page.waitForSelector('#next-step')
    // async wait all resolve
    await page.click('#next-step')
    // await Promise.all([
    //   ,
    //   // page.click('button[type=submit]'),
    //   page.waitForNavigation({waitUntil: 'networkidle2'})
    // ])
    
    await page.waitForFunction('document.querySelector("#sms-4 > div > div.progress_sms > div > div > span > span:nth-child(1)").innerText.length == 4');
  
  } catch (e) {
    console.log(e)
    browser ? await browser.close() : ''
  }
  console.log('End!!!')
})()

// description!!
// 보안 이슈로 특정 계정은 로그인 안될 수 있음