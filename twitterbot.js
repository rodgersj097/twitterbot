const twitterAPI = require('twit');
const creds = require('./config')
const twit = new twitterAPI(creds);

UserToSearch = '1308247602518020098'


 function getList(){
  return new Promise((resolve, reject)=>{
//get list of users from midnightsloths
  twit.get('followers/ids', { user_id: '1308247602518020098'}, function(err,data,res){//Twitter userId is of MidnightSloths
      if(err){
          reject(err)
      }else{
            resolve(data.ids)
      }
  })
  }).catch(e=>{
      console.log(e)
  })

}


//check if they have liked a tweet
function  checkUserLikedTweet(userId){
    return new Promise((resolve, reject)=>{
        twit.get('favorites/list', {user_id:  userId.toString(), count: 20 }, function(err,data,res){
          if(err){
            console.log(userId, err)
          }
          //console.log(data)
            for(var i =0; i < data.length; i++){
              console.log(userId , data[i].id_str)
                resolve(data[i].user.id_str)
            }
        })
      }).catch(e=>{
        console.log(e)
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
       }
    })
}).catch(e=>{
    console.log(e)
})
}


async function compare(){

    twitterFollowers = await getList()

    UsersWhoRetweeted = await getUsersWhoRetweets()
   // console.log( twitterFollowers)
    for(var i =0; i < UsersWhoRetweeted.length; i++){
        if(twitterFollowers.includes(UsersWhoRetweeted[i])){
            console.log(`True : ${UsersWhoRetweeted[i]}`)
        }else{
            console.log(false)
        }
    }

}

compare()
