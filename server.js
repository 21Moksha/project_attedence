const express = require('express');
const multer = require('multer');
const exceljs = require('exceljs');
const path = require('path');

const app = express();
const port = 3000;

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Adminpage.html'));
});

app.post('/upload', upload.single('excel-file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const workbook = new exceljs.Workbook();
    workbook.xlsx.load(req.file.buffer)
        .then(workbook => {
            const worksheet = workbook.getWorksheet(1);
            const data = [];
            worksheet.eachRow(row => {
                data.push(row.values);
            });
            res.json({ data: data });
        })
        .catch(err => {
            console.error(err);
            res.status(500).send('Error processing the Excel file.');
        });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
