// Pure Encrytion 
import {encrypt, encryptWithPassword, decrypt, decryptWithPassword} from './modules/encryption.js'
//Tokenization Functions
import {tokenize, detokenize} from './modules/data_tokenization.js';
//File Storage Functions
import {encryptFile, decryptFile, getFiles, getFileEncryptionKeys} from './modules/file_storage.js';
//Key Pair Functions
import {createKeyPair, getKeyPairs, uploadKeyPair} from './modules/key_pair.js';
//Array Functions
import {initArray, addUserToArray, addToArray, getArray, getArrayNames, getMyEncryptionKeyForArray} from './modules/array.js'
//Key Value Functions
import {get, put, getKeys} from './modules/key_value.js';
//Notification Functions
import {sendEmail, sendSMS, updateProfile, getProfiles, sendBulkEmail, sendBulkSMS, updateIntroductionMessage,
  getProfile, createNotificationGroup, getNotificationGroupByName, getNotificationGroups} from './modules/notifications.js';
//Event Functions
import {retrieveEvents} from './modules/events.js';

import Fetch from './helpers/fetch.js';

export default class SelfGuard {

  constructor(api_key, public_key, private_key, api_domain) {
    this.api_domain = api_domain || "https://api.selfguard.xyz";
    this.api_key = api_key;
    this.pub_key = public_key; //optional
    this.private_key = private_key; //optional
    this.fetch = new Fetch(this.api_key, this.pub_key, this.private_key, this.api_domain);
  }

  // Pure Encryption Functions
  async encrypt(value){
    return await encrypt.call(this, value);
  }

  async decrypt(value, encryption_key_id){
    return await decrypt.call(this, value, encryption_key_id);
  }

  encryptWithPassword(value, password){
    return encryptWithPassword.call(this, value, password);
  }

  decryptWithPassword(value, password){
    return decryptWithPassword.call(this, value, password);
  }

  //File Storage Methods
  async encryptFile(file, callback){
    return await encryptFile.call(this, file, callback);
  }

  async decryptFile(file_id, callback){
    return await decryptFile.call(this, file_id,callback);
  }

  async getFiles(){
    return await getFiles.call(this);
  }

  async getFileEncryptionKeys(file_id){
    return await getFileEncryptionKeys.call(this, file_id);
  }


  //Tokenization Functions
  async tokenize(value) {
    return await tokenize.call(this, value);
  }

  async detokenize(id) {
    return await detokenize.call(this, id);
  }

  // Key Pair Functions
  createKeyPair(type){
    return createKeyPair.call(this, type);
  }

  async getKeyPairs(){
    return await getKeyPairs.call(this);
  }

  async uploadKeyPair({public_key, private_key}, password){
    return await uploadKeyPair.call(this, {public_key, private_key}, password);
  }

  // Key Value Functions
  async put(key, value) {
    return await put.call(this, key, value);
  }

  async get(key) {
    return await get.call(this, key);
  }

  async getKeys(options) {
    return await getKeys.call(this, options);
  }

  // Array Functions
  async initArray(name){
    return await initArray.call(this, name);
  }

  async addUserToArray(name, user_pub_key){
    return await addUserToArray.call(this, name, user_pub_key);
  }

  async addToArray(name, value) {
    return await addToArray.call(this, name, value);
  }

  async getArray(name, gte, limit){
    return await getArray.call(this, name, gte, limit);rn
  }

  async getArrayNames() {
    return await getArrayNames.call(this);
  }

  async getMyEncryptionKeyForArray(name){
    return await getMyEncryptionKeyForArray.call(this, name);
  }

  //Notifications Functions
  async sendEmail({user_address, collection_name, subject, body}){
    return await sendEmail.call(this, {user_address, collection_name, subject,  body})
  }

  async sendSMS({user_address, collection_name, text}){
    return await sendSMS.call(this, {user_address, collection_name, text});
  }

  async sendBulkEmail({collection_name, subject, body}){
    return await sendBulkEmail.call(this, {collection_name, subject, body})
  }

  async sendBulkSMS({collection_name, text}){
    return await sendBulkSMS.call(this, {collection_name, text});
  }

  async updateProfile({user_address, value, collection_name}){
    return await updateProfile.call(this, {user_address, value, collection_name})
  }

  async getProfiles({limit, offset, collection_name}){
    return await getProfiles.call(this, {limit, offset, collection_name});
  }

  async getProfile({user_address, collection_name}) {
    return await getProfile.call(this, {user_address, collection_name});
  }
  
  async getNotificationGroupByName({collection_name}) {
    return await getNotificationGroupByName.call(this, {collection_name});
  }

  async getNotificationGroups() {
    return await getNotificationGroups.call(this);
  }

  async createNotificationGroup({contract_address, collection_name}) {
    return await createNotificationGroup.call(this, {contract_address, collection_name});
  }

  async updateIntroductionMessage({notification_group_id, email_subject, email_body, sms_text}) {
    return await updateIntroductionMessage.call(this, {notification_group_id, email_subject, email_body, sms_text});
  }

  // Event Functions
  async retrieveEvents(){
    return await retrieveEvents.call(this);
  }
}