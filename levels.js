const mongo = require('./mongo.js')
const profileSchema = require('./schemas/profile-schema.js')

module.exports = (client) => {
  client.on('message', message => {
    const {guild, member} = message

    addXP(guild.id, member.id, 100,message)

  })
}
const getNeededXP = (level) => level * 100 * 100;

const addXP = async (guildId, userId, xpToAdd, message) => {
  await mongo().then(async mongoose => {
    try{
      const result = await profileSchema.findOneAndUpdate({
        guildId,
        userId,
      } , {
        guildId,
        userId,
        $inc : {
          xp : xpToAdd
        }
      } , {
        upsert : true,
        new: true
      })

     let{xp, level} = result
     const needed = getNeededXP(level)

     if(xp >= needed){
       ++level
       xp -= needed

       

       await profileSchema.updateOne({
         guildId,
         userId
       }, {
         level,
         xp
       })

     }
     console.log(xp)
     console.log(level)
    } finally{
      mongoose.connection.close()
    }
  })
}
module.exports.addXP = addXP
