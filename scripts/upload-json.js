const pinataSDK = require('@pinata/sdk');
const fs = require('fs');
const path = require('path');

// 你的Pinata JWT
const pinata = new pinataSDK({ 
  pinataJWTKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJiMjIwNjdkOC1iMDMyLTRiYTAtYTNkMi1hZjg5MGY5Yzk0NTkiLCJlbWFpbCI6ImppbmdydXpoYW5nODJAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjA2ODYxM2M4MzZhMGIyODQ2YWZkIiwic2NvcGVkS2V5U2VjcmV0IjoiNjc2NWJlZmM2MTliNDk2ZTZhOTE4ZDY3YzY2ZmNkNGNiYTIyOTUzMTk0NDgxMjlmOTRmNDVhMThmYTM5MjhlMiIsImV4cCI6MTc5NDY2MDUzMH0.808vhXvB6kqutBlyCcYgeK9no7TDIrwOnXhdzFS-5o4' 
});

const jsonFolder = './metadata';

async function uploadJSONFiles() {
  try {
    const files = fs.readdirSync(jsonFolder).filter(f => f.endsWith('.json'));
    if (files.length === 0) {
      console.log('未找到JSON文件');
      return;
    }
    for (const file of files) {
      const filePath = path.join(jsonFolder, file);
      const fileStream = fs.createReadStream(filePath);
      
      // 添加文件元数据（关键：指定文件名）
      const options = {
        pinataMetadata: {
          name: file // 用本地文件名作为IPFS上的名称
        }
      };

      console.log(`正在上传 ${file}...`);
      const res = await pinata.pinFileToIPFS(fileStream, options); // 传入options
      console.log(`${file} 上传成功：https://ipfs.io/ipfs/${res.IpfsHash}`);
    }
  } catch (err) {
    console.error('失败：', err.message);
  }
}

uploadJSONFiles();