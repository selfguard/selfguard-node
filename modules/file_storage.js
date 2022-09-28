import {storeWithProgress, retrieveIPFSFile} from '../helpers/ipfs.js';
import {decryptShard, streamEncrypt} from '../helpers/encryption.js';
import {appendFile} from '../helpers/files.js';
import {File} from 'fetch-blob/file.js'
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

const path = await import('node:path');

let WEB3_STORAGE_URL = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDQxRjQ1QTY3NDQzRGJDNmQ3N0NEOThFYjJDZDVFZThERjRDMTlCYjciLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTg5NTI4NTYxOTksIm5hbWUiOiJ0ZXN0In0.I-fSz9b0Thg3nC5bnHHURoYiaXKHC9E3dcvJM7IdV4A';

 /**
  * It takes a file, splits it into shards, encrypts each shard, and uploads them to IPFS
  * @param file - the file to be encrypted
  * @returns The file id associating all the shards is being returned.
  */
 export async function encryptFile(file, callback){
    try {
      let file_id = uuidv4();

      const stats = fs.statSync(file); // file details
      let totalSize = stats.size;
      //save file assocation for each shard
      let file_shards = [];
      //iterate through each file chunk that has been encrypted
      let i = 0;
      let size_so_far = 0;
      let name = path.basename(file);
      let type = path.extname(file);
      let document_hash = await streamEncrypt(file, async (encrypted_bytes, encryption_key)=>{
         // create the encryption key id
        let encryption_key_id = uuidv4();

        // //save the file to ipfs
        let encrypted_file = new File([encrypted_bytes],name,{type});
        let cid = await storeWithProgress(WEB3_STORAGE_URL,[encrypted_file], size_so_far/totalSize, totalSize, callback);

        // //save the file shard assocation with SelfGuard
        size_so_far+=encrypted_bytes.byteLength;
        file_shards.push({cid, index:i, encryption_key:{key: encryption_key, id:encryption_key_id}});
        i++;
      });

      await this.fetch.saveFileAssociation({id:file_id,name, type, document_hash, file_shards})

      return {
        file_shards,
        document_hash,
        id:file_id,
        created_at: Date.now(),
        type,
        name
      }
    }
    catch(err){
      console.log({err});
      throw new Error(err);
    }
  }

  /**
   * It decrypts a file.
   * @param id - The id of the file you want to download
   * @returns A decrypted file
   */
export async function decryptFile(file_id, callback){
  try {
    let {file_shards, name, type} = await this.fetch.retrieveFile(file_id);
    //iterate through each shard
    for(let i = 0; i < file_shards.length;i++){
        try {
          //extract cid and encryption_key
          let {encryption_key, cid} = file_shards[i];
          encryption_key = encryption_key.key;
          //retrieve file from ipfs
          let encrypted_file = await retrieveIPFSFile(cid, name, type);
          //callback showing progress of decryption
          if(typeof callback === 'function') callback(null, Math.floor((i+1)/file_shards.length*100))

          //decrypt the file and append to new file based on the original name
          let decrypted_shard = await decryptShard(encrypted_file, encryption_key);
          await appendFile(name, decrypted_shard);
        }
        catch(err){
          console.log({err});
          throw new Error(err);
        }
    }
    return;
  } 
  catch(err){
    console.log({err});
    throw new Error(err);
  }
}

/**
 * It returns all the file associations for the respective user
 * @returns An array of files.
 */
export async function getFiles() {
  try {
    let data = await this.fetch.retrieveFiles();
    return data;
  }
  catch(err){
    console.log({err});
    throw new Error(err);
  }
}

export async function getFileEncryptionKeys(file_id) {
  try {
    let {file_shards} = await this.fetch.retrieveFile(file_id);
    return file_shards;
  }
  catch(err){
    console.log({err});
    throw new Error(err);
  }
}

