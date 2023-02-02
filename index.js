//imports
const express = require('express');
const app = express();
const port = 3000;


//static files
app.use(express.static(__dirname + '/views'));

//set views
app.set('views','./views')
app.set('view engine','ejs')


app.get('',(req,res) => {
    res.sendFile(__dirname+'/views/index.html')
})
//listen on port 3000
app.listen(port, () => console.info(`Listening to port ${port}`))