import { Web3Storage } from "web3.storage";
import axios from "axios";
import { Blob } from "fetch-blob";

function makeStorageClient(token) {
  return new Web3Storage({ token });
}

/**
 * It takes a token and a cid, and returns a file
 * @param token - the token you got from the login function
 * @param cid - The CID of the file you want to retrieve.
 * @returns A file object
 */
export async function retrieveIPFSFile(cid, name, type) {
  let retrieve = async () => {
    let res = await axios.get(
      `https://${cid}.ipfs.w3s.link/ipfs/${cid}/${name}`,
      {
        headers: {
          Accept: type,
        },
        responseType: "arraybuffer",
      }
    );
    let file = new Blob([res.data]);
    return file;
  }
  try {
    return await retrieve();
  }
  catch (e) {
    //if it fails once try again
    try {
      console.log(`Failed to retrieve ${cid}, trying 2/3...`)
      return await retrieve();
    }
    catch(e){
      try {
        console.log(`Failed to retrieve ${cid}, trying 3/3...`)
        return await retrieve();
      }
      catch(e){
        throw new Error(`Failed to retrieve ${cid}`);
      }
    }
  }
}
/**
 * It takes a token and a list of files, and returns a promise that resolves to the root CID of the
 * stored data
 * @param token - The token you got from the web3.storage
 * @param files - an array of files to store
 * @returns A promise that resolves to the root cid of the file.
 */
export async function storeWithProgress(token, files, finishedSoFar, fileSize, chunkLength, callback) {
  return new Promise((resolve, reject) => {
    let cid = null;
    // when each chunk is stored, update the percentage complete and display
    const totalSize = files.map((f) => f.size).reduce((a, b) => a + b, 0);
    let uploaded = 0;

    let ratio = chunkLength / totalSize;
    // show the root cid as soon as it's ready
    const onRootCidReady = async (c) => {
      cid = c;
    };

    const onStoredChunk = async (size) => {
      uploaded+= size
      if(uploaded > totalSize) uploaded = totalSize;
      if(typeof callback === 'function') callback(null, (100*(finishedSoFar + ((uploaded*ratio)/fileSize)).toFixed(2)))
      const pct = (uploaded / totalSize);
      if(pct >= 1) resolve(cid);
    };
    const client = makeStorageClient(token);
    return client.put(files, { onRootCidReady, onStoredChunk });
  });
}
