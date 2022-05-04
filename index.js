const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config();

//middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server Online');
})

app.listen( port , () => {
    console.log('Server on port', port)
})