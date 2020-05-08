//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose=require("mongoose");
const uuid=require("uuid");
mongoose.connect("mongodb://localhost:27017/BookmarkDB",{useNewUrlParser:true , useUnifiedTopology:true});
const tagSchema =new mongoose.Schema({
Id: String,
Title:String,
TimeCreated:String,
TimeUpdated:String

});
const bookmarkSchema=new mongoose.Schema({
  Id: String,
  Link: String,
  Title: String,
  TimeCreated: String,
  TimeUpdated: String,
  Publisher: String,
  Tags: [tagSchema]
});
const Tag=mongoose.model("tags",tagSchema);
const Bookmarks=mongoose.model("bookmarks",bookmarkSchema);
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.route("/bookmarks").get(function(req,res){
  Bookmarks.find(function(err,bookmarks){
    if (err){
      console.log(err);
    }
    else{
      res.send(bookmarks);
    }
  });
})
.post(function(req,res){
  const bookmark=new Bookmarks({
    Id: uuid.v4(),
    Link: req.body.link,
    Title: req.body.title,
    TimeCreated:Math.round(Date.now() / 1000),
    TimeUpdated:Math.round(Date.now() / 1000),
    Publisher: req.body.publisher
  });
  bookmark.save(function(err){
    if(!err){
      res.send("success");
    }
  });
})
.delete(function(req,res){
  Bookmarks.deleteMany(function(err){
    if(!err){
      res.send("deleted all Bookmarks");
    }
  });
});

app.route("/bookmarks/:booktitle").get(function(req,res){
    Bookmarks.findOne({title:req.params.title},function(err,foundBookmark){
      if(!err){
        res.send(foundBookmark);
      }
    });
})

.post(function(req,res){
  const tagGiven=req.body.tagtitle;
  Bookmarks.findOne({title:req.params.title},function(err,foundBookmark){
    Tag.findOne({title:tagGiven},function(err,foundTag){
      foundBookmark.Tag.push(foundTag);
      res.send("added tag");
    });
  });
})
.delete(function(req,res){
  Bookmarks.deleteOne({title:req.params.booktitle},function(err){
    if(!err){
      res.send("deleted this bookmark");
    }
  });
});


app.route("/tags").get(function(req,res){
  Tag.find(function(err,foundtags){
    if(!err){
      res.send(foundtags);
    }
  });
}
)
.post(function(req,res){
  Tag.findOne({Title:req.body.title},function(err,foundTag){
    if(!err){
      if(!foundTag){
  const newTag = new Tag({
    Id:uuid.v4(),
    Title:req.body.title,
    TimeCreated:Math.round(Date.now() / 1000),
    TimeUpdated:Math.round(Date.now() / 1000)
  });
  newTag.save(function(err){
    if(!err){
      res.send("added");
    }
  });
}
else{
  res.send("cannot add such tag already exist");
}
}
});
})
.delete(function(req,res){
    Tag.deleteMany(function(err){
      if(!err){
        res.send("deleted all tags");
      }
    });
});

app.route("/tags/:tagtitle").get(function(req,res){
  Tag.findOne(function(err,foundTag){
    if(!err){}
    res.send(foundTag);
  });
}
).delete(function(req,res){
  Tag.deleteOne({title:foundTag},function(){
    res.send("deleted the tag");
  });
}
);
app.listen(3000,function(){
  console.log("server live on 3000");
});
