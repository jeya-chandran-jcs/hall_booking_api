import express from "express"
import { MongoClient } from "mongodb";

const app = express()
app.use(express.json())

const PORT = 5000;

const Mongo_URL="mongodb://localhost:27017"

async function CreateConnection(){
  try{
    const client=new MongoClient(Mongo_URL)
  await client.connect()
  return client
  }
  catch(err){
    console.log(err,"client error")
    throw err
  }
}
const clienttrue=CreateConnection()
// Route for the root URL

app.get("/", (req, res) => {
  res.send("Hi this are my end points  /roomlist , /customer_booked_room , /listcustomer");
});

app.post("/room",async (req,res)=>{
 
  const client = await clienttrue
  const result = await client.db("hall_booking_api").collection("room").insertMany(req.body)
  res.send(result)

})

app.post("/customer",async (req,res)=>{
 
  const client = await clienttrue
  const result = await client.db("hall_booking_api").collection("customer").insertMany(req.body)
  res.send(result)

})

app.get("/roomlist",async (req,res)=>{
 
  const client = await clienttrue
  const result = await client.db("hall_booking_api").collection("room").aggregate([
    {
      $lookup: {
        from: "customer",
        localField: "id",
        foreignField: "roomId",
        as: "bookings"
      }
    },
    {
      $unwind: "$bookings"
    },
    {
      $addFields: {
        bookedStatus: true,
        customerName: "$bookings.name",
        date: "$bookings.date",
        startTime: "$bookings.startTime",
        endTime: "$bookings.end time"
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        bookedStatus: 1,
        customerName: 1,
        date: 1,
        startTime: 1,
        endTime: 1
      }
    }
  ]).toArray()
  res.send(result)
})

app.get("/listcustomer",async(req,res)=>{
 try{
  const client=await clienttrue
  const result= await client.db("hall_booking_api").collection("customer").aggregate([
    {
    $lookup:{
      from:"room",
      localField:"id",
      foreignField:"id",
      as:"booked"
    }},
    {
      $unwind:"$booked"
    },
    {
      $project:{
        _id:1,
        name:1,
        Room_name:"$booked.name",
        date:1,
        startTime:1,
        end_time:1
      }
    }
]).toArray()
res.send(result)
 }
 catch(err){
  console.log("error from list customer",err)
  res.status(404).send({message:"error list customer"})
 }
})

  
app.get("/customer_booked_room", async (req, res) => {
  try {
    const client = await clienttrue;
    const result = await client
      .db("hall_booking_api")
      .collection("customer")
      .aggregate([
        {
          $lookup: {
            from: "room",
            localField: "id",
            foreignField: "id",
            as: "customerData"
          }
        },
        {
          $unwind: "$customerData"
        },
        {
          $group: {
            _id: {
              customerID: "$customerData.id",
              roomName: "$customerData.name",
              date: "$customerData.date",
              startTime: "$customerData.startTime",
              endTime: "$customerData.end_time"
            },
            bookingCount: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            customerID: "$_id.customerID",
            roomName: "$_id.roomName",
            date: "$_id.date",
            startTime: "$_id.startTime",
            endTime: "$_id.endTime",
            bookingCount: 1,
            status: {
              $cond: {
                if: {
                  $cond: {
                    if: { $isArray: "$customerData" },
                    then: { $gt: [{ $size: "$customerData" }, 0] },
                    else: false
                  }
                },
                then: false,
                else: true
              }
            }
          }
        }
      ])
      .toArray();

    res.send(result);
  } catch (err) {
    console.error("Error fetching customer booked room:", err);
    res.status(404).send({ message: "customer booked error" });
  }
});

// Start server
app.listen(PORT, () => console.log("Server is started on port", PORT));
