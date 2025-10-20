import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const image = './images/my_image.jpg';
const uploadOnCloudinary = async (localFilePath) => {
    try{
        if(!localFilePath) return null ;
        // upload the file 
        const response = await cloudinary.uploader.upload(localFilePath ,{
            resource_type : "auto" 
        })
        // file has been uploaded
        console.log("file uploaded successfully" , response.url );
        return response;
    }
    catch (error) {
        fs.unlinkSync(localFilePath); //remove the locally saved file
        return null ;
    }
}

export { uploadOnCloudinary };