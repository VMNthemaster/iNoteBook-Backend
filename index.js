const connectToMongo = require('./db');
const express = require('express')
var cors = require('cors')
connectToMongo();

const app = express()
const port = 5000
 
app.use(cors())

app.use(express.json())

// available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.get('/', (req, res) => {
  res.json({message: "Set Up Success"})
})
app.listen(process.env.PORT || port, () => {
  console.log(`iNoteBook backend listening at http://localhost:${port}`)
})

// npm run test
