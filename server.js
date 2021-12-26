const express=require('express')
const bodyParser=require("body-parser")
const app=express()
const mongoose=require("mongoose")
const date = require(__dirname+"/date.js")
require("dotenv").config();
const port=process.env.PORT || 3000


app.set('view engine', 'ejs')


app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("public"))

const mongoURI=process.env.DATABASE
mongoose.connect(mongoURI,{useNewUrlParser:true})

const itemSchema={
    name:String
}

const Item=mongoose.model("Item",itemSchema)

const item1=new Item({
    name:"welcome"
})
const item2=new Item({
    name:"welcome hey hello"
})
const defaultItems=[item1,item2];

const listSchema={
    name:String,
    items:[itemSchema]
}

const List=mongoose.model("List",listSchema)





app.get("/",function(req,res){
   let day="today"
 

//    Item.find({},{name:1,_id:0},function(foundItems){
//      console.log(foundItems);
//           res.render('list', {kindofday:day,gg:foundItems}); 
//     })

Item.find({},function(err, foundItems) {
    if(foundItems.length===0){
        Item.insertMany(defaultItems,function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("success")
            }
        })
        res.redirect("/")
    } else{
        res.render('list', {kindofday:day,gg:foundItems});
    }

  });

})

app.post("/",function(req,res){
      const itemName=req.body.gamer
      const listName=req.body.list
      const item = new Item({
          name:itemName
      })
      if(listName==="today"){

        item.save()
        res.redirect("/")
      }
      else{
          List.findOne({name:listName},function(err,foundList){
              foundList.items.push(item)
              foundList.save()
              res.redirect("/"+listName)
          })
      }
     
    
})

app.get("/:topics",function(req,res){
    const customListName=req.params.topics;
   
    List.findOne({name:customListName},function(err,foundList){
        if(!err){
            if(!foundList){
                const list=new List({
                    name:customListName,
                    items:defaultItems
                })
                list.save()
                res.redirect("/"+customListName)
            }
            else{
              res.render("list",{kindofday:foundList.name,gg:foundList.items})
            }
        }
    })

    
})

app.post("/delete",function(req,res){
   const checkedItem=req.body.checkbox;
   Item.findByIdAndRemove(checkedItem,function(err){
       if(!err){
           console.log("deleted successfully")
       }
   })
   res.redirect("/")
})

 
app.listen(port)