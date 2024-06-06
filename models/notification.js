const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //user recois la notif 
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },// send la notif 
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, //id de post
  type: { type: String, enum: ['new_post', 'like', 'dislike','comment','response','reaction'], required: true }, // type de notif 
  message: { type: String, required: true }, //message c quoi la nootif 
  read: { type: Boolean, default: false } //si la notif vu ou non 
}, { timestamps: true }); //date de creation ou modification de la notif 

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
