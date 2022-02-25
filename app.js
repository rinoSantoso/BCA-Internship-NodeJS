const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const mysql = require('mysql');
const _ = require('lodash');
const { template } = require('lodash');
const $ = require('jquery');
const { json } = require('express');
const { type } = require('os');
const compression = require('compression');



// express app
const app = express();

// connect to mysql
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'rino',
    password: 'test1234',
    database: 'bca_intern',
    multipleStatements: true
})

connection.connect(function(err){
    if (err){
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected to mysql as id' + connection.threadId);
    app.listen(3000);
    console.log('Listening to port 3000');
});

// register view engine
app.set('view engine', 'ejs')

// middleware and static files
app.use(compression());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));


// // mysql sandbox routes
// app.get('/add-blog', (req, res) => {
//     console.log('adding new blog');
//     let sql = "INSERT INTO `blogs` (`id`, `title`, `snippet`, `body`, `timestamp`) VALUES (NULL, ?, ?, ?, current_timestamp())";
//     let inserts = ['My new blog 4', 'There is still...', 'There is still not much about my new blog.'];
//     sql = mysql.format(sql, inserts);
//     connection.query(sql, (err, result) => {
//         if (err) {
//             console.error('error connecting: ' + err.stack);
//             return;
//         } else{
//             res.send(result);
//         }
//     });
// })

// app.get('/all-blogs', (req, res) => {
//     console.log('finding all blogs');
//     let sql = "SELECT * FROM `blogs`";
//     connection.query(sql, (err,result) => {
//         if (err) {
//             console.error('error connecting: ' + err.stack);
//             return;
//         } else{
//             res.send(Object.values(JSON.parse(JSON.stringify(result))));
//         }
//     })
// })

// blog tutorial
// app.get('/', (req, res) => {
//     // redirect to blogs page
//     res.redirect('/blogs');
// })

// app.get('/about', (req, res) => {
//     res.render('about', { title: 'About' });
// })

// // blog routes
// app.get('/blogs', (req, res) => {
//     let sql = "SELECT * FROM `blogs` ORDER BY timestamp DESC";
//     connection.query(sql, (err, result) => {
//         if (err) {
//             console.error('error connecting: ' + err.stack);
//             return;
//         } else{
//             res.render('index', { title: 'All Blogs', blogs: result });
//         }
//     })
// })

// app.post('/blogs', (req, res) => {
//     let sql = "INSERT INTO `blogs` (`id`, `title`, `snippet`, `body`, `timestamp`) VALUES (NULL, ?, ?, ?, current_timestamp())";
//     let inserts = Object.values(req.body);
//     sql = mysql.format(sql, inserts);
//     connection.query(sql, (err, result) =>{
//         if (err) {
//             console.error('error connecting: ' + err.stack);
//             return;
//         } else{
//             res.redirect('/blogs');
//         }
//     });
// })

// app.get('/blogs/create', (req, res) => {
//     res.render('create', { title: 'Create a new Blog' });
// })

// app.get('/blogs/edit/:id', (req, res) => {
//     const id = req.params.id;
//     let sql = "SELECT * FROM `blogs` WHERE id = ?";
//     let inserts = [id];
//     sql = mysql.format(sql, inserts);
//     connection.query(sql, (err, result) => {
//         if (err) {
//             console.error('error connecting: ' + err.stack);
//             return;
//         } else {
//             res.render('edit', { blog: result[0], title: 'Edit a blog' });
//         }
//     })
// })

// app.get('/blogs/:id', (req, res) => {
//     const id = req.params.id;
//     let sql = "SELECT * FROM `blogs` WHERE id = ?";
//     let inserts = [id];
//     sql = mysql.format(sql, inserts);
//     connection.query(sql, (err, result) => {
//         if (err) {
//             console.error('error connecting: ' + err.stack);
//             return;
//         } else {
//             res.render('details', { blog: result[0], title: 'Blog Details' });
//         }
//     })
// })

// app.delete('/blogs/:id', (req,res) => {
//     const id = req.params.id;
//     let sql = 'DELETE FROM `blogs` where id = ?';
//     let inserts = [id];
//     sql =  mysql.format(sql, inserts);
//     connection.query(sql, (err, result) => {
//         if (err) {
//             console.error('error connecting: ' + err.stack);
//             return;
//         } else{
//             res.json({ redirect: '/blogs' });
//         }
//     })
// })

// app.post('/blogs/:id', (req, res) => {
//     if ('_method' in req.body){
//         if(req.body['_method'] == 'PUT'){
//             const id = req.params.id;
//             let sql = 'UPDATE blogs SET title = ?, snippet = ?, body = ? WHERE id = ?';
//             let inserts = req.body;
//             delete inserts['_method'];
//             inserts = Object.values(inserts);
//             inserts.push(id);
//             sql = mysql.format(sql, inserts);
            
//             connection.query(sql, (err, result) =>{
//                 if (err) {
//                     console.error('error connecting: ' + err.stack);
//                     return;
//                 } else{
//                     res.redirect('/blogs');
//                 }
//             });
//         }
//     }
// })

// template experimentation
app.get('/', (req, res) =>{
    // redirect to blogs page
    res.redirect('/dashboard');
})
// , pdrb2011, pdrb2012, pdrb2013, pdrb2014, pdrb2015, pdrb2016, pdrb2017, pdrb2018, pdrb2019
app.get('/dashboard', (req, res) => {
    let sql = "SELECT COUNT(no_id) AS branchCount FROM jarkbnp2";
    let sql2 = "SELECT COUNT(DISTINCT(prov)) as provCount FROM jarkbnp2";
    let sql3 = "SELECT COUNT(DISTINCT(kota)) as cityCount FROM jarkbnp2";
    let sql4 = "";

    for(let year = 2010; year <= 2019; year++){
        sql4 += `
            SELECT '` + year + `' as year, SUM(data_lob.` + year + `) AS pdrbTotal 
            FROM data_lob
            WHERE lob = "Produk Domestik Regional Bruto"
        `
        if(year != 2019){
            sql4 += " UNION"
        }
    }
    
    let sql5 = "";

    for(let year = 2010; year <= 2019; year++){
        sql5 += `
            SELECT '` + year + `' as year, SUM(dpk_` + year + `) AS dpkTotal, SUM(laba_rugi_` + year + `) AS labaRugiTotal
            FROM performance_cabang
        `
        if(year != 2019){
            sql5 += " UNION"
        }
    }

    connection.query(sql + ";" + sql2 + ";" + sql3 + ";" + sql4 + ";" + sql5,  (err, result) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        } else{
            let branchCount = result[0][0].branchCount;
            let provCount = result[1][0].provCount;
            let cityCount = result[2][0].cityCount;
            let dataLob = JSON.parse(JSON.stringify(result[3]));
            let performanceCabang = JSON.parse(JSON.stringify(result[4]));
            console.log();
            res.render('dashboard', { title: 'Dashboard', activePage: 'dashboard', branchCount, provCount, cityCount, dataLob, performanceCabang });
        }
    })
})


app.get('/getdata', (req, res) => {
    res.json({ labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'], series: [12, 17, 7, 17, 23, 18, 38] });
})

app.get('/tables', (req, res) => {
    let sql = "SELECT * FROM `jarkbnp2` ORDER BY no_id";
        connection.query(sql, (err, result) => {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            } else{
                result = JSON.parse(JSON.stringify(result));
                res.render('tables', { title: 'Tables', branches: result, activePage: 'tables' });
            }
        })
})

app.get('/details/:id', (req, res) => {

    const id = req.params.id;
    let sql = "SELECT * FROM jarkbnp2 WHERE no_id = ?";
    let inserts = [id];
    sql = mysql.format(sql, inserts);
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        } else{
            let rows = result;

            let sql = `
                SELECT list_daerah.kabupaten_atau_kota, data_lob.lob, data_lob.2010, data_lob.2011, data_lob.2012, data_lob.2013, data_lob.2014, data_lob.2015, data_lob.2016, data_lob.2017, data_lob.2018, data_lob.2019
                FROM list_daerah
                INNER JOIN data_lob ON list_daerah.sandi_dati=data_lob.sandi_dati
                WHERE data_lob.sandi_dati = ? AND (data_lob.lob = "Produk Domestik Regional Bruto" OR data_lob.lob = "Laju Pertumbuhan PDRB (persen)");
                SELECT *
                FROM performance_cabang
                WHERE no_id = ?
            `;
            let inserts = [result[0].sandidati, id];
            sql = mysql.format(sql,inserts);
            connection.query(sql, (err, result) => {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return;
                } else{
                    console.log(result[1][0])
                    var spawn = require('child_process').spawn,
                        py    = spawn('python', ['test2.py']),
                        data = result[1][0],
                        dataString = [];

                    py.stdout.on('data', function(data){
                        dataString.push(data.toString());
                        console.log('data recieved from python')
                    });

                    py.stdout.on('end', function(){
                        // console.log(dataString['prediction dataframe']);
                        console.log(JSON.parse(dataString)['prediction dataframe']);
                        res.render('details', { title: "Details", activePage: 'details', rows, dataLob: result[0], performanceCabang: result[1], forecastData: JSON.parse(dataString) });
                    });

                    // console.log(JSON.stringify(data));
                    py.stdin.write(JSON.stringify(data));
                    py.stdin.end();
                    
                }
            })
            
        }
    })
    
})

app.get('/map', (req, res) => {
    let sql = "SELECT * FROM `jarkbnp2` ORDER BY no_id";
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        } else{
            result = JSON.parse(JSON.stringify(result));
            res.render('map', { title: 'Map', activePage: 'map', branches: result });
        }
    })    
})

// Python test
app.get('/python', (req, res) => {
    let sql = "SELECT * FROM performance_cabang WHERE no_id = 1027"
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        } else{
            console.log(result[0])
            var spawn = require('child_process').spawn,
                py    = spawn('python', ['test.py']),
                data = result[0],
                dataString = [];

            py.stdout.on('data', function(data){
                dataString.push(data.toString());
                console.log('data recieved from python')
            });

            py.stdout.on('end', function(){
                // console.log(JSON.parse(dataString[0]));
                console.log(JSON.parse(dataString));
            });

            // console.log(JSON.stringify(data));
            py.stdin.write(JSON.stringify(data));
            py.stdin.end();

            // console.log(JSON.parse(JSON.stringify(result)));
        }
    })
    
})

app.get('/no-connection', (req, res) => {
    res.render('no-connection', { title: 'No Connection', activePage: 'fallback' })
})

app.get('/caching', (req, res) => {
    let sql = "SELECT * FROM `list_daerah` ORDER BY sandi_dati";
        connection.query(sql, (err, result) => {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return;
            } else{
                result = JSON.parse(JSON.stringify(result));
                res.render('caching', { title: 'Caching', regions: result, activePage: 'caching' });
            }
        })
})

app.get('/cache/:id', (req, res) => {
    const id = req.params.id;
    let sql = "SELECT no_id FROM jarkbnp2 WHERE sandidati = ?";
    let inserts = [id];
    sql = mysql.format(sql, inserts);
    connection.query(sql, (err, result) => {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        } else{
            result = JSON.parse(JSON.stringify(result));
            res.json({ branches: result })
        }
    })
})

// 404 page
app.use((req, res) =>{
    res.status(404).render('404', { title: '404 Error', activePage: '404' });
})



// run python test
// var spawn = require('child_process').spawn,
//     py    = spawn('python', ['compute_input.py']),
//     someBullshit = [1,2,3,4,5,6,7,8,9],
//     dataString;

// py.stdout.on('data', function(someBullshit){
//   dataString = someBullshit.toString();
//   console.log(typeof(someBullshit))
// });
// py.stdout.on('end', function(){
//   console.log(JSON.parse(dataString)[1]);
  
// });
// py.stdin.write(JSON.stringify(someBullshit));
// py.stdin.end();