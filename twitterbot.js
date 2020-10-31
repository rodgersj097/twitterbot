const twitterAPI = require('twit');
 const creds = require('./config')
const csv = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const csvWriter = createCsvWriter({
  path: 'out.csv',
  append: true, 
  header: [
    {id: 'userId', title: 'UserId'},
    {id: 'userName', title: 'UserName'},
  ]
})
const fs = require('fs')
const twit = new twitterAPI(creds);
const CronJob = require('cron').CronJob
const logger = require('log-to-file')

UserToSearch = '1308247602518020098'

function getList(){
  return new Promise((resolve, reject)=>{
    ids = []
//get list of users from midnightsloths
  twit.get('followers/list', { user_id: '1308247602518020098'}, function(err,data,res){//Twitter userId is of MidnightSloths
      if(err){
          reject(err)
          logger(err)
      }else{
            for(var i = 0; i < data.users.length; i++){ 
              ids.push({ userId : data.users[i].id, userName : data.users[i].screen_name})
            }
            resolve(ids)
      }
  })
  }).catch(e=>{
      console.log(e)
      logger(e)
  })
}
//Function is not used 
function getUsersWhoRetweets(){
    return new Promise((resolve, reject)=>{
    twit.get('statuses/retweeters/ids', {id: '1321143494098980866', count : 100, stringify_ids: false}, function(err, data, res){
       if(!err){
           resolve(data.ids)
       }else{
           reject(err)
           logger(err)
       }
    })
}).catch(e=>{
    console.log(e)
})
}


async function compare(){
    twitterFollowers = await getList()
    usersWhoRetweeted = await getUsersWhoRetweets()
    usersToAdd = [] 
    //Search through both arrays to find matching
   for(var i =0; i < usersWhoRetweeted.length; i++){
     for(var j = 0; j < twitterFollowers.length; j++){ 
       if(usersWhoRetweeted[i] == twitterFollowers[j].userId){ 
        usersToAdd.push(twitterFollowers[i])
       }
     }
   }

    //Check if user in UsersToAdd doesnt already exist in csv
    //writeToFile(usersToAdd)
    checkedUsers = await checkDuplicateInCsv(usersToAdd)
    writeToFile(checkedUsers)
}

function checkDuplicateInCsv(usersToAdd){
    return new Promise((resolve, reject)=>{
  fs.createReadStream('./out.csv')//Add file name
    .pipe(csv())
    .on('data', (row)=>{
      //check if row matches any of new ids
     for(var i=0; i < usersToAdd.length; i++){
         //console.log(usersToAdd[i].userId , row.UserId.toString())
        if(usersToAdd[i].userId == row.UserId){
            console.log('Removing id')
            usersToAdd.splice(i)
        }
     }

    })
    .on('end', ()=>{
      console.log('end of file')
      resolve(usersToAdd)
    })
})
}
function writeToFile(data){
  csvWriter
    .writeRecords(data)
    .then(()=>{
      console.log('Records written')
    })
}

/*var job = new CronJob('0 * * * * ', function(){
    compare()
}, null , true, 'America/LosAngeles')

job.start()*/

compare()