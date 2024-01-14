db.createCollection("user")
db.createCollection("products")

db.user.insertMany(
    [
        {
            "id":1,
            "name":"tony",
            "email":"tony@123",
            "phone":"1234567890",
            "password":"123456"
        },
        {
            "id":2,
            "name":"jeya",
            "email":"jeya@123",
            "phone":"098765432",
            "password":"6789"
        },
        {
            "id":3,
            "name":"zoro",
            "email":"zoro@123",
            "phone":"1888867890",
            "password":"123456"
        },{
            "id":4,
            "name":"luffy",
            "email":"luffy@123",
            "phone":"125367464",
            "password":"12232326"
        }
    ]
)



db.products.insertMany([
    {
        "productID":1,
        "brand":"apple",
        "name":"i phone 1",
        "price":10000,
        "rating":5,
        "stock":10,
        "specs":["128gb","4gb","108mp","metal"],
        "total":{
            "gst":10,
            "discount":"no discount",
            "value":false
        },
        "others":[{
            "warranty":"1 year",
            "delivery":"free"
        }]
    },
    {
        "productID":2,
        "brand":"android",
        "name":"redmi",
        "price":20000,
        "rating":4,
        "stock":7,
        "specs":["120gb","6gb","64mp","metal"],
        
        "total":{
            "gst":8,
            "discount":"no discount",
            "value":false
        },
        "others":[{
            "warranty":"2 year",
            "delivery":"charge"
        }]
    },{
        "productID":3,
        "brand":"nokia",
        "name":"nokia 1",
        "price":50000,
        "rating":5,
        "stock":9,
        "specs":["20gb","6gb","64mp","diamond"],
        "total":{
            "gst":5,
            "discount":"no discount",
            "value":false
        },
        "others":[{
            "warranty":"5 year",
            "delivery":"charge"
        }]
    },{
        "productID":4,
        "brand":"google",
        "name":"pixel",
        "price":20000,
        "rating":3,
        "stock":8,
        "specs":["500gb","8gb","69mp","metal"],
        "total":{
            "gst":9,
            "discount":" 15%",
            "value":false
        },
        "others":[{
            "warranty":"3 year",
            "delivery":"charge"
        }]
    }
    
])

db.user.find({name:"jeya"}).pretty()

db.products.updateOne({productID:1},{$set:{name:"i phone"}})

db.products.aggregate([
    {
    $group:{
        _id:"brand",
        total:{$min:"$price"}
    }
    }
])

db.products.aggregate([{
    $match:{"rating":{$gte:3}}
}])

db.products.aggregate([
    {
        $lookup:{
            from:"user",
            localField:"id",
            foreignField:"productID",
            as:"combined"
        }
    },{
        $unwind:"$combined"
    },{
        $group:{
            _id:"$brand",
            total:{$sum:"$price"}
        }
    }
])

db.orders.insertMany([
    {
        "orderID":1,
        "customerName":
    }
])

db.random.insertMany([
        {
            "id":1,
            "name":new objectId("65a2794c38c90118a011d061"),
            "room":new ObjectId("65a276d3ec31523bef7d832a"),
            "randomname":"random"
}

])

db.random.insertMany([
    {
      "id": 1,
      "name": new ObjectId("65a2794c38c90118a011d061"),
      "room": new ObjectId("65a276d3ec31523bef7d832a"),
      "randomname": "random"
    }
  ])
  db.customer.insertMany([
  {
          "id" : 2,
          "name" : "luffy",
          "date" : new Date(),
          "startTime" : "9pm",
          "end time" : "10 pm",
          "roomId" : 2
  },{
    "id" : 3,
    "name" : "zoro",
    "date" : new Date(),
    "startTime" : "8pm",
    "end time" : "9 pm",
    "roomId" : 3
},{
    "id" : 4,
    "name" : "sanji",
    "date" : new Date(),
    "startTime" : "9pm",
    "end time" : "10 pm",
    "roomId" : 4
}
])

db.room.insertMany([
{
        "id" : 2,
        "seats" : 200,
        "aminities" : "snacks",
        "price" : 100
},
,{
    "id" : 3,
    "seats" : 150,
    "aminities" : "seats",
    "price" : 100
},{
    "id" : 4,
    "seats" : 50,
    "aminities" : "dolby atmos",
    "price" : 300
}
])

const names=["vetri","jaya","rohini","inox"]

for(i=0;i<names.length;i++){
    db.room.updateMany(
        {id:i+1},{$set:{names[i]}}
    )
}
$project: {
    _id: 1,
    seats: 1,
    amenities: 1,
    price: 1,
    booked: {
      $cond: {
        if: { $gt: [{ $size: "$bookings" }, 0] },
        then: true,
        else: false,
      },
    },
  },