import fs from 'fs';

function readBytes(fd, sharedBuffer) {
  return new Promise((resolve, reject) => {
      fs.read(
          fd, 
          sharedBuffer,
          0,
          sharedBuffer.length,
          null,
          (err) => {
              if(err) { return reject(err); }
              resolve();
          }
      );
  });
}
  
export async function* generateChunks(filePath, size) {
  const sharedBuffer = Buffer.alloc(size);
  const stats = fs.statSync(filePath); // file details
  const fd = fs.openSync(filePath); // file descriptor
  let bytesRead = 0; // how many bytes were read
  let end = size; 
  
  for(let i = 0; i < Math.ceil(stats.size / size); i++) {
      await readBytes(fd, sharedBuffer);
      bytesRead = (i + 1) * size;
      if(bytesRead > stats.size) {
          end = size - (bytesRead - stats.size);
      }
      yield sharedBuffer.slice(0, end);
  }
}

export function appendFile(path, data){
  return new Promise((resolve, reject) => {
    fs.appendFile(path, data, (err, data) => {
      if (err) reject(err);
      resolve(data);
    })
  })
}