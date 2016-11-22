module.exports = function(app, connection) {

    app.post('/api/v1/newtask', function(req, res) {

        connection.query('INSERT INTO tasks (task) VALUES (?)', [req.body.task], function(err, rows, fields) {
            if (err) {
                res.status(401);
            }
        });
        res.end();
    });

    app.get('/api/v1/loadtasks', function(req, res) {

        connection.query('SELECT * from tasks', function(err, rows, fields) {
            if (rows.length != 0) {
                data = rows;
                res.json(data);

            } else {
                data = null;
                res.json(data);
            }
            res.end();
        });
    });

     app.post('/api/v1/taskstatus', function(req, res) {

        connection.query('UPDATE tasks SET `taskstatus`=(?) WHERE `idtasks`=(?)', [req.body.taskstatus, req.body.taskid], function(err, rows, fields) {
            if (err) {
                res.status(401);
            }
        });
        res.end();
    });   

}