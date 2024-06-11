// Create web server
// Create web server
var http = require('http');
var url = require('url');
var fs = require('fs');
var querystring = require('querystring');

http.createServer(function (req, res) {
    var url_parts = url.parse(req.url);
    var path = url_parts.pathname;
    if (req.method === 'GET' && path === '/comments') {
        fs.readFile('comments.json', 'utf8', function (err, data) {
            if (err) {
                res.writeHead(404);
                res.end();
                return;
            }
            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.end(data);
        });
    } else if (req.method === 'POST' && path === '/comments') {
        var body = '';
        req.on('data', function (data) {
            body += data;
        });
        req.on('end', function () {
            var comment = querystring.parse(body);
            fs.readFile('comments.json', 'utf8', function (err, data) {
                if (err) {
                    res.writeHead(404);
                    res.end();
                    return;
                }
                var comments = JSON.parse(data);
                comments.push(comment);
                fs.writeFile('comments.json', JSON.stringify(comments), function (err) {
                    if (err) {
                        res.writeHead(404);
                        res.end();
                        return;
                    }
                    res.writeHead(200, {
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify(comments));
                });
            });
        });
    } else {
        res.writeHead(404);
        res.end();
    }
}).listen(3000);
console.log('Server running at http://localhost:3000/');