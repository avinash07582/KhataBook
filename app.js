  const express = require('express');
  const app= express();
  const path = require('path');
  const fs = require('fs');
const { log } = require('console');
  
   app.set('view engine', 'ejs');
   app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "public")));

  app.get('/',(req,res)=>{
     fs.readdir(`./hisaab`,function(err,files){
        if (err) return res.status(500).send(err);
          res.render("index",{files:files})
     });
    
  });
  app.get('/create',(req,res)=>{
      res.render("create")
    
  });
  app.get('/edit/:filename',(req,res)=>{
    fs.readFile(`./hisaab/${req.params.filename}`,"utf-8",function(err,filedata){
        if(err) return res.status(500).send(err)
            res.render("edit",{filedata,filename: req.params.filename})

    })
      
    
  });
  app.get('/hisaab/:filename',(req,res)=>{
    fs.readFile(`./hisaab/${req.params.filename}`,"utf-8",function(err,filedata){
        if(err) return res.status(500).send(err)
            res.render("hisaab",{filedata,filename: req.params.filename})

    })
      
    
  });
  app.get('/delete/:filename',(req,res)=>{
    fs.unlink(`./hisaab/${req.params.filename}`,function(err,){
        if(err) return res.status(500).send(err)
           res.redirect("/")

    })
      
    
  });
  app.post('/update/:filename',(req,res)=>{ 
    fs.writeFile(`./hisaab/${req.params.filename}`,req.body.content, function(err){
        if(err) return res.status(500).send(err)
        res.redirect('/')
    
    })
    
  });
  app.post('/createhisaab', (req, res) => {
    const currentDate = new Date();
    const date = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
    const baseFilePath = `./hisaab/${date}`;
    let filePath = `${baseFilePath}.txt`;
    let counter = 1;

    // Function to check file existence and rename if needed
    const checkAndWriteFile = (path) => {
        fs.stat(path, (err) => {
            if (err && err.code === 'ENOENT') {
                // File does not exist, create it
                fs.writeFile(path, req.body.content, (err) => {
                    if (err) return res.status(500).send(err);
                    return res.redirect('/');
                });
            } else {
                // File exists, try with a new file name
                filePath = `${baseFilePath}_${counter}.txt`;
                counter++;
                checkAndWriteFile(filePath); // Recursively check for the next file name
            }
        });
    };

    checkAndWriteFile(filePath); // Initial call to start the process
});
  app.listen(3000)
  








