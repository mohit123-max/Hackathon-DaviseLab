import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import "dotenv/config";

import mongoose from "mongoose";







// const connectDB = async ()=>{



//     mongoose.connection.on('connected',()=>{
//         console.log("Database Connected");
//     })
//     await mongoose.connect(`${process.env.MONGODB_URI}/mern-auth`);
// }

//connectDB()


// const fileSchema = new mongoose.Schema({
//     url : {type : String , required : true},
// })

// const fileModal = mongoose.models.files || mongoose.model("files",fileSchema);





//const upload = multer({dest : "./uploads"});
const __dirname = path.resolve();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads')); 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
      }
});

const upload = multer({ storage: storage });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'uploads')));



app.post("/upload",upload.single("uploaded_file"),(req,res)=>{
    console.log(req.file);
    //console.log(req.body);
    res.send(`File uploaded successfully: ${req.file.originalname}`);
})



app.get("/files",(req,res)=>{
    console.log("Fetching all files");
    const directoryPath = path.join(path.join(__dirname, 'uploads'));
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send('Unable to scan files!');
        }
        res.json(files);
    });
})


app.get('/files/:filename', (req, res) => {
    const filename = req.params.filename;
   const filePath = path.join(__dirname, 'uploads', filename); 
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.download(filePath, (err) => {
        if (err) {
            console.error('Error downloading file:', err);
            res.status(500).send('Error downloading file : '+err.message);
        }
    });
});


app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})