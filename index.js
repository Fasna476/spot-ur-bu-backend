const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const usersModel = require("./models/users")
const busModel = require("./models/bus")
const routeModel = require("./models/route")
const scheduleModel = require("./models/schedule")

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb+srv://ayishafasna476:FIodsbt09jz9Uvch@cluster0.whuy2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")



async function createAdmin() {
  try {
      const username = 'admin101';
      const email = 'admin101@gmail.com';
      const password = '101113'; 

     

      // Create a new admin user
      const admin = new usersModel({
          username: username,
          email: email,
          password:password,
          usertype: 'admin',
      });

      // Save the admin user to the database
      await admin.save();
      console.log('Admin user created successfully!');
  } catch (err) {
      console.error('Error creating admin:', err);
  }
}
createAdmin();

app.post('/signin', (req, res) =>{
  const {email, password} = req.body;
  usersModel.findOne({email: email})
  .then(user => {
      if(user) {
          if(user.usertype==="admin" && user.password === password) {
              res.json("admin success")
          }else if(user.password === password){
            res.json("user success")
          }
           else{
              res.json("the password is incorrect")
          }
      } else{
          res.json("No record exists")
      }
  })
})

app.post('/signup', (req, res)=>{
    usersModel.create(req.body)
    .then(user => res.json(user))
    .catch(err => res.json(err))
})


app.post('/addBus', async (req, res) => {
    try {
      const { name, type, number, routeId } = req.body;
      const bus = new busModel({ name, type, number, routeId });
      await bus.save();
      res.json(bus);
    } catch (error) {
      res.json({ message: 'Error adding bus', error });
    }
  });
  // Get all buses
app.get('/buses', async (req, res) => {
  try {
    const buses = await busModel.find()// Populate route details if needed
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching buses', error });
  }
});
  // Update a bus
app.put('/buses/update/:id', async (req, res) => {
  const { id } = req.params;
  const { name, type, number, routeId } = req.body;

  try {
    const updatedBus = await busModel.findByIdAndUpdate(
      id,
      { name, type, number, routeId },
      { new: true } // Return the updated document
    );

    if (!updatedBus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    res.json(updatedBus);
  } catch (error) {
    res.status(500).json({ message: 'Error updating bus', error });
  }
});

// Delete a bus
app.delete('/buses/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBus = await busModel.findByIdAndDelete(id);

    if (!deletedBus) {
      return res.status(404).json({ message: 'Bus not found' });
    }

    res.json({ message: 'Bus deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting bus', error });
  }
});


  app.post('/addRoute', async (req, res) => {
    try {
      const { name, startLocation, endLocation, stops } = req.body;
      const route = new routeModel({ name, startLocation, endLocation, stops });
      await route.save();
      res.json(route);
    } catch (error) {
      res.json({ message: 'Error adding route', error });
    }
  });
  app.get('/routes', async (req, res) => {
    try {
      const routes = await routeModel.find();
      res.json(routes);
      
    } catch (error) {
      res.status(500).json({ message: 'Error fetching routes', error });
    }
  });
  
  // Update a route
  app.put('/routes/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, startLocation, endLocation, stops } = req.body;
  
    try {
      const updatedRoute = await routeModel.findByIdAndUpdate(
        id,
        { name, startLocation, endLocation, stops },
        { new: true }
      );
      res.json(updatedRoute);
    } catch (error) {
      res.status(500).json({ message: 'Error updating route', error });
    }
  });
  
  // Delete a route
  app.delete('/routes/delete/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      await routeModel.findByIdAndDelete(id);
      res.json({ message: 'Route deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting route', error });
    }
  });

  app.post('/addSchedule', async (req, res) => {
    try {
      const { busId, routeId, stopTimes,direction } = req.body;
      if (!['forward', 'backward'].includes(direction)) {
        return res.status(400).json({ message: 'Invalid direction' });
      }
      const schedule = new scheduleModel({ busId, routeId, stopTimes,direction });
      await schedule.save();
      res.json(schedule);
    } catch (error) {
      res.json({ message: 'Error adding schedule', error });
    }
  });

// Get schedule by bus ID
app.get('/schedule/:busId', async (req, res) => {
    try {
      const { busId } = req.params;
      const schedule = await scheduleModel.findOne({ busId })
        .populate('busId')   // Get full Bus document
        .populate('routeId'); // Get full Route document
  
      if (!schedule) {
        return res.send('Schedule not found');
      }
  
      const route = schedule.routeId;
  
      res.json({
        bus: schedule.busId.name,
        route: route.name,
        arrivalTime: schedule.arrivalTime // Send the stopTimes directly
      });
    } catch (error) {
      res.send('Server Error: ' + error.message);
    }
  });

  // Update a schedule
app.put('/schedules/update/:id', async (req, res) => {
  const { id } = req.params;
  const { busId, routeId, stopTimes,direction } = req.body;

  try {
    const updatedSchedule = await scheduleModel.findByIdAndUpdate(
      id,
      { busId, routeId, stopTimes,direction },
      { new: true }
    );
    res.json(updatedSchedule);
  } catch (error) {
    res.status(500).json({ message: 'Error updating schedule', error });
  }
});

// Delete a schedule
app.delete('/schedules/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await scheduleModel.findByIdAndDelete(id);
    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting schedule', error });
  }
});


  app.get('/api/busDetails', async (req, res) => {
    try {
      const { start, end } = req.query;
  
      // 1. Find all routes that include both the `start` and `end` locations
      const matchingRoutes = await routeModel.find({
        "stops.name": { $all: [start, end] }
      });
  
      // 2. Prepare an empty array to hold bus details
      const buses = [];
  
      for (const route of matchingRoutes) {
        // 3. Find the positions of start and end stops within each route’s stop array
        const startIndex = route.stops.findIndex(stop => stop.name === start);
        const endIndex = route.stops.findIndex(stop => stop.name === end);
  
        // 4. Verify that the start stop appears before the end stop
        if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
          // 5. Find all buses associated with this route
          const routeBuses = await busModel.find({ routeId: route._id });
  
          for (const bus of routeBuses) {
            // 6. Find the schedule for each bus on this route
            const schedule = await scheduleModel.findOne({ busId: bus._id, routeId: route._id });
  
            if (schedule) {
              // 7. Retrieve arrival times for the start and end stops
              const startArrivalTimeObj = schedule.stopTimes.find(stop => stop.stopName === start);
              const endArrivalTimeObj = schedule.stopTimes.find(stop => stop.stopName === end);
  
              // 8. Add bus details along with the arrival times
              buses.push({
                name: bus.name,
                number: bus.number,
                type: bus.type,
                route: route.name,
                startStop: route.stops[startIndex].name,
                endStop: route.stops[endIndex].name,
                startArrivalTime: startArrivalTimeObj ? startArrivalTimeObj.arrivalTime : null,
                endArrivalTime: endArrivalTimeObj ? endArrivalTimeObj.arrivalTime : null
              });
            }
          }
        }
      }
  
      // 9. If no buses were found, return a 404 status
      if (buses.length === 0) {
        return res.status(404).json({ message: 'No buses found for this route segment.' });
      }
  
      // 10. Respond with the array of buses that meet the search criteria
      res.json({ buses });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  });
  
  

app.listen(3020, () => {
    console.log("server is running")
})