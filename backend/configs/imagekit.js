import { config } from 'dotenv';
config();

import ImageKit from "imagekit";

 
const imagekit = new ImageKit({
  
  
    publicKey:process.env.PUBLIC_KEY, 
    privateKey :process.env.PRIVATE_KEY,
    urlEndpoint :process.env.URL_END_POINT
      
  })

  
 
  export default imagekit;
  
