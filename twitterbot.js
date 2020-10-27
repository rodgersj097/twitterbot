const twitterAPI = require('twit');
const conf = require('./config');
const twit = new twitterAPI(conf);

 function getList(){
//get list of users from midnightsloths

twit.get('followers/list', { user_id: '1308247602518020098'}, function(err,data,res){//Twitter userId is of MidnightSloths
    if(err){
        console.log(err)
        return
    }
    data.users.forEach(user => {
        let rdata =  checkUserLikedTweet(user.id)
        console.log(rdata)

    });
})
}


//check if they have liked a tweet
async function  checkUserLikedTweet(userId){
    let promise = new Promise((resolve, reject)=>{
        twit.get('favorites/list', {user_id: userId}, async function(err,data,res){
            for(var i =0; i < data.length; i++){
                //console.log(data[i].length)
                if(data[i] !== 'errors'){
                   
                   await resolve(data[i])
                }
            }
        })
    })
    let result
   promise.then((value)=>{
       console.log(value)
       result =  value
   })

   return result
}


getList()