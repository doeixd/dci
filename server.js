const express = require('express')
const cron = require('node-cron')
const app = express()
const fetch = require('isomorphic-unfetch')
const fs = require('fs')

Array.prototype.right = function(n = 1) { return this[this.length - n] }



let teams = JSON.parse(fs.readFileSync('./teams.json'))
let scores = JSON.parse(fs.readFileSync('./scores/scores.json'))

let calcTeamScores = (teams, scores) => {
  let obj = {}
  Object.entries(teams).map( ([team, corps]) => {
    obj[team] = {}
    
    Object.entries(corps).map( ([caption, name]) => {
      let path = caption == 'VIS' ? ['Visual','VIS'] : caption == 'Perc' ? ['Music','Perc'] : caption == 'CG' ? ['Visual','CG'] : caption == 'BRS' ? ['Music', 'BRS'] : caption == 'MA' ? ['Music', 'MA'] : caption == 'GE' ? ['GeneralEffect',''] : caption
      // if (!scores[corps[caption]].score) scores[corps[caption]].score = 0
      // console.log(name);
      try{
        path[1] == 'VIS' ? obj[team][caption] =  `${(+(scores[name].Visual.VA.score) / 2 + Number(scores[corps[caption]].Visual.VP.score) / 2).toFixed(2)}` : path[1] ? obj[team][caption] = scores[corps[caption]][path[0]][path[1]].score : scores[corps[caption]][path[0]].score  
        // console.log(scores[name].Visual.VA)
      } catch(err) {
        console.log(err)
        obj[team][caption] = 0
      }
    } )
    // console.log(scores[corps.GE].GeneralEffect.score == null ? 0 : scores[corps.GE].GeneralEffect.score);
    // console.log(scores[corps] || 0)
    // obj[team].VIS = scores[corps].Visual.score
  } )
 return obj
}

// calcTeamScores(teams, scores)

console.log(calcTeamScores(teams, scores))

let openURL = 'https://backend.dci.org/api/v1/performances/corps-results?class=Open+Class&season=2019'
let worldURL = 'https://backend.dci.org/api/v1/performances/corps-results?class=World+Class&season=2019'

// let job = cron.schedule('* * */3 * *', () => {
  ; (async function () {

    let latestWorldScores = await getLatestScores(worldURL)
    let latestOpenScores = await getLatestScores(openURL)

    let newScores = { ...latestWorldScores, ...latestOpenScores }
    newScores = Object.assign(newScores, scores)
    
    fs.writeFileSync('./scores/scores.json', JSON.stringify(newScores))

    


    
  })()

// })

// job.start()

async function getLatestScores (divi) {
    let data = await fetch(divi)
    data = await data.json()
    return parseData(data)
}


function parseData(d) {
  let obj = {}
  Object.entries(d)
    .map(([corps, comps]) => {
      obj[corps] = {}
      obj[corps].name = corps
      obj[corps].totalScore = comps.right().totalScore
      obj[corps].latest = comps.right().competition.date
      comps.right().categories
        .map((caption) => {
          caption.Name == 'General Effect' ? caption.Name = 'GeneralEffect' : null
          obj[corps][caption.Name] = {}
          obj[corps][caption.Name].score = caption.Score
          caption.Captions
            .map((subcaption) => {
              obj[corps][caption.Name][subcaption.Initials] = {}
              obj[corps][caption.Name][subcaption.Initials].score = subcaption.Score

              obj[corps][caption.Name][subcaption.Initials].Subcaptions = subcaption.Subcaptions
              // db.scores.save(obj[corps])
            })
          })
    })

  return obj
}