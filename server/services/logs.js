const fs = require('fs');
module.exports = (req, res, next) => {
    const text = `${Date.now()}: ${req.method} ${req.path}\n`;
    fs.appendFile('log.txt', text, (err, data) => {
        next();
    })
}

