const express = require('express');
const app  = express();
const path = require('path')
const fs = require('fs/promises');
const fsSync = require('fs');
const bodyParser = require('body-parser')

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'))


app.get("/",async (req,res,next)=>{
 try{ 

  const fileList = await getFilesList()
  res.render("index",{data:fileList})
 }catch(err){
   console.error(err)
 }
})


app.get("/create",(req,res)=>{
    res.render("create")
})



app.post("/create",async (req,res)=>{
    try{
        console.log(req.body)
        await createFile(req.body.name,req.body.content)
        res.redirect('/'); 

    }catch(err){

    }
})

app.get("/file/:name", (req,res,next)=>{
  const filePath = path.join(__dirname,"data",req.params.name)
  if(filePath!=='C:\\Users\\HP\\Desktop\\ahmed-shaheen-nodejs-sec\\data\\style.css')
  fsSync.readFile(filePath,"utf8",(err,content)=>{
    console.log(err)
    if(err){
    console.log(content)

      if(err.code==="ENOENT"){ 
        return res.status(404).send("File not dound")
      }
    return next(new Error("Failed to read file"))

    }
    res.render('details',{name:req.params.name,content})

  });
});


app.delete('/file/:filename',async(req,res)=>{

  const name =  req.params.filename
  await deleteFile(name)
  res.redirect("/")
})



app.put("/edit/:fileName",async(req,res)=>{
  const {currentName,newName} = req.body
  renameFile(currentName,newName)
})
app.use((err,req,res,next)=>{
  res.status(404).send("Error")
})
app.listen(3000,()=>{
    console.log('Server is runing on port 3000')
})


async function getFilesList(req,res,next){
  try {
    const mydir = path.join(__dirname,'data')
    const fileList = await fs.readdir(mydir)
    return fileList
  } catch (error) {
    console.error(error.message)
  }
}

async function createFile(name,content){
  const fullpath = path.join(__dirname,'data',name)
  if(!fsSync.existsSync(fullpath) ){
    const newFile= await fs.writeFile(fullpath,content)
  }
  else{
    res.send("File already exists")
  }

}
async function deleteFile(name){
  try{
    const filePath = path.join(__dirname,"data",name)
    await fs.unlink(filePath)
  }catch(err){
    console.error(err)
  }

}
function renameFile(oldName, newName){
  try{
    const filePathOld = path.join(__dirname,"data",oldName)
    const filePathNew = path.join(__dirname,"data",newName)
    if(fsSync.existsSync(filePathOld)){
      console.log('file exists')
      fs.rename(filePathOld,filePathNew);

    }
  }catch(err){
    console.error(err)
  }

}


