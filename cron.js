const express = require('express')
const cron = require('node-cron')
const app = express()
const fetch = require('isomorphic-unfetch')
const fs = require('fs')

Array.prototype.right = function (n = 1) { return this[this.length - n] }

app.use(express.static('dist'))

app.get('/data', (req, res) => {
  let data = JSON.parse(fs.readFileSync('./scores/calc.json'))
  res.send(data)
})
app.listen(80)


let openURL = 'https://backend.dci.org/api/v1/performances/corps-results?class=Open+Class&season=2019'
let worldURL = 'https://backend.dci.org/api/v1/performances/corps-results?class=World+Class&season=2019'

// let job = cron.schedule('* * */3 * *', () => {
  ; (async function () {
    let scores = JSON.parse(fs.readFileSync('./scores/scores.json'))
    let teams = JSON.parse(fs.readFileSync('./teams.json'))
    
    let latestWorldScores = await getLatestScores(worldURL)
    let latestOpenScores = await getLatestScores(openURL)
    
    let newScores = { ...latestWorldScores, ...latestOpenScores }
    newScores = Object.assign(newScores, scores)
    scores = newScores
    
    fs.writeFileSync('./scores/scores.json', JSON.stringify(newScores))
    fs.writeFileSync('./scores/calc.json', JSON.stringify(calcTeamScores(teams, scores)))

  })()

  // })
  
// job.start()

async function getLatestScores(divi) {
  let data = await fetch(divi)
  data = await data.json()
  return parseData(data)
}


function parseData(d) {
  let obj = {}
  Object.entries(d)
    .map(([corps, comps]) => {
      obj[corps] = {}
      obj[corps].shows = []
      obj[corps].name = corps
      obj[corps].latest = comps.right().competition.date.replace('T00:00:00','')
      obj[corps].totalShows = comps.length
      
      comps.map((show, idx) => {
        obj[corps].shows[idx] = {}
        obj[corps].shows[idx].date = show.competition.date.replace('T00:00:00', '')
        show.categories.map((caption) => {
          caption.Name == 'General Effect' ? caption.Name = 'generalEffect' : null
          if (caption.Name == 'Timing & Penalties') return;
          obj[corps].shows[idx][caption.Name] = caption.Score
          caption.Captions
          .map((subcaption) => {
            obj[corps].shows[idx][subcaption.Initials.replace(' ', '')] = subcaption.Score
          })
        })
      } )        
    })
    
  return obj
}

function calcTeamScores (teams, scores)  {
  let obj = {}
  Object.entries(teams).map(([team, picks]) => {
    obj[team] = {}
    obj[team].name = team
    obj[team].choices = {}
    Object.entries(picks).map(([caption, corps]) => {
      let search = caption == 'GE' ? 'generalEffect' : caption
      obj[team].choices[caption] = corps
      // console.log(obj[team]) 
      for (show of scores[corps].shows) {
        if (!show[search]) break
        obj[team][caption] = show[search]
      }
    })
    obj[team].weightedTotal = Object.entries(obj[team]).slice(2).reduce((acc, cur) => {
      cur[1] = Number(cur[1])
      // console.log(cur)
      return cur[0] == 'GE' ? cur[1] + acc : (cur[1]/2 + acc)
    }, 0  ).toFixed(2) 
    obj[team].total = (Object.entries(obj[team]).slice(0,-1).slice(2).reduce((acc, cur) => (+cur[1] + acc), 0  ) / 160 * 100).toFixed(2) 
  })
  // console.log(obj)
  return obj
}