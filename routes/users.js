var express = require('express');
var router = express.Router();
const fs = require('fs')
const path =require('path')
var multer  = require('multer')
var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, './public/uploads/')
  },
  filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});

var upload = multer({ //multer settings
  storage: storage,
  fileFilter: function (req, file, callback) {
      var ext = path.extname(file.originalname);
      if(ext !== '.csv') {
          return callback(new Error('Only CSV are allowed'))
      }
      callback(null, true)
  },
  limits:{
      // fileSize: 1024 * 1024
  }
})

/* GET users listing. */
router.post('/', upload.single("csvfile"),function(req, res, next) {
       const csvpath = req.file.path
      //  console.log(csvpath)

       fs.readFile(csvpath, "utf8",(err, data) => {
        if (err){ throw err;}
        csvJSON(data)

        // console.log(data);
      });

  function csvJSON(data){
    var lines=data.split("\n");
    
  
    var result = [];
    var headers=lines[0].split(",");
    
    for(var i=1;i<lines.length;i++){
  
        var obj = {};
        var currentline=lines[i].split(",");
        // console.log(currentline)
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
  
        result.push(obj);
        
  
    }
    res.json(result)
  }
  
});

module.exports = router;
