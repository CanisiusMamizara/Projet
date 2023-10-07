const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const ejs = require("ejs");

const app = express();
const port  = 8080;

app.use('/public', express.static('public'));

const conn = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "",
        database: "test"
    }
);
// conn.connect((error) =>{
//     if(!!error){
//         console.log(error);
//     }else{
//         console.log("database connected succefully");
//     }
// })

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/', (req, res)=>{
    let sql = "SELECT * FROM test ";
    let query = conn.query(sql, (err, rows) => {
        if(err){
            throw err;
        }
        res.render('user_index',{
            title: "Crud avec node js, mysql, express et ejs",
            user: rows
        });
    });
    
});




app.get('/add', (req, res)=>{
    res.render('user_add', {
        title: "Ajouter nouveau utilisateur"
    })
})



app.post('/save', (req, res) => {
    let data = { 
        nom: req.body.nom,
        prenom: req.body.prenom,
        mobile: req.body.number
     };
     let sql = "INSERT INTO test SET ?";
     let query = conn.query(sql, data, (err, results) => {
        if(err) throw err;
        res.redirect('/');
     });
})


app.get("/edit/:userId", (req, res) => {
    const userId = req.params.userId;
    let sql = `SELECT * FROM test where id = ${userId}`;
    let query = conn.query(sql,(err, result) => {
        if(err) throw err;
        res.render('user_edit', {
            title: "Modifier un utilisateur",
            user : result[0]
        })
    })
})

app.post('/update', (req, res) => {
    const userId = req.body.id;
     let sql = "UPDATE test SET nom='"+ req.body.nom +"',prenom='"+ req.body.prenom +"',mobile='"+ req.body.number +"' where id = " + userId;
     let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/');
     });
})

app.get('/delete/:userId', (req, res) => {
    const userId = req.params.userId;
     let sql = `DELETE  FROM test WHERE id = ${userId}  `;
     let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/');
     });
})

app.listen(port, () =>{
    console.log(`Ouvert sur le port ${port}`);
});