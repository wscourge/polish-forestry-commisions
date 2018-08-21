'use strict'

const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs')

const cities = [
  "bialystok",
  "gdansk",
  "katowice",
  "krakow",
  "krosno",
  "lublin",
  "lodz",
  "olsztyn",
  "pila",
  "poznan",
  "radom",
  "szczecin",
  "szczecinek",
  "torun",
  "warszawa",
  "wroclaw",
  "zielonagora"
]

Promise.all(cities.map(city => {

  return new Promise((resolve, reject) => {

    const address = "http://www." + city + ".lasy.gov.pl/nadlesnictwa"

    request(address, (err, response, body) => {

      if(err) {
        reject(err)
        return
      }

      const $ = cheerio.load(body)
      const mails = []
      $("body").find(".email a[href^='mailto:']").each((i,a) => {
        mails.push($(a).attr("href").replace('mailto:', ''))
      })

      resolve(mails)

    })

  })

})).then((values) => {

  const mails = values.reduce((p,c) => p.concat(c), [])
  console.log("AMOUNT", mails.length);
  fs.writeFileSync("./mails.txt", mails.join(" "))

}).catch(err => {
  console.log('----------------')
  console.log(err)
  console.log('----------------')
})
