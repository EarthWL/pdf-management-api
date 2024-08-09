import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { getAllFormFieldsAndValues, fillPdfWithFormData } from '../utilities/pdfUtils.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'template/')
    },
    filename: function (req, file, cb) {
        const timestamp = new Date().toISOString().replace(/:/g, '-').replace('T', '-').split('.')[0];
        const newName = `${path.basename(file.originalname, path.extname(file.originalname))}-${timestamp}${path.extname(file.originalname)}`;
        cb(null, newName);
    }
})

const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/v1/files:
 *   post:
 *     summary: Upload a PDF and get its fields
 *     responses:
 *       200:
 *         description: Returns list of fields in the uploaded PDF.
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               pdfFile:
 *                 type: string
 *                 format: binary
 */
router.post('/files', upload.single('pdfFile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Please upload a file!' });
    }

    const fieldAndType = await getAllFormFieldsAndValues(req.file.path);
    res.json(fieldAndType);
});

/**
 * @swagger
 * /api/v1/files:
 *   get:
 *     summary: Returns a list of files in the template folder
 *     responses:
 *       200:
 *         description: Successful response with the list of files.
 */
router.get('/files', (req, res) => {
    const templateDirectory = path.join(__dirname, '..', 'template'); // Adjust the path if your directory structure is different

    fs.readdir(templateDirectory, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read directory' });
        }
        res.json(files);
    });
});

/**
 * @swagger
 * /api/v1/files/{fileName}:
 *   get:
 *     summary: Get form fields of a PDF by its filename
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         description: The filename of the PDF stored in the /template directory
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns list of fields in the requested PDF.
 *       404:
 *         description: File not found.
 *       500:
 *         description: Error reading the file.
 */
router.get('/files/:fileName', async (req, res) => {
    const filePath = path.join(__dirname, '..', 'template', req.params.fileName);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: 'File not found.' });
    }

    try {
        const fieldAndType = await getAllFormFieldsAndValues(filePath);
        res.json(fieldAndType);
    } catch (error) {
        console.error('Error reading PDF:', error);
        res.status(500).json({ message: 'Error reading the file.' });
    }
});

/**
 * @swagger
 * /api/v1/files/{fileName}:
 *   delete:
 *     summary: Delete a file by its filename
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         description: The filename of the file to be deleted from the /template directory
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File deleted successfully.
 *       404:
 *         description: File not found.
 *       500:
 *         description: Error deleting the file.
 */
router.delete('/files/:fileName', async (req, res) => {
    const fileName = req.params.fileName;
    const filePath = path.join(__dirname, '..', 'template', fileName);

    try {
        // Check if the file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found.' });
        }

        // Delete the file
        fs.unlinkSync(filePath);

        res.status(200).json({ message: 'File deleted successfully.' });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ message: 'Error deleting the file.' });
    }
});

/**
 * @swagger
 * /api/v1/renderPdf:
 *   post:
 *     summary: Fill a PDF with provided data
 *     description: Fill a PDF template with the provided field data.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileName:
 *                 type: string
 *                 description: The filename of the PDF template stored in the /template directory.
 *               field:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     fieldID:
 *                       type: string
 *                     fieldType:
 *                       type: string
 *                     value:
 *                       oneOf:
 *                         - type: string
 *                         - type: boolean
 *     responses:
 *       200:
 *         description: Returns the filled PDF.
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Failed to process the PDF.
 */
router.post('/renderPdf', async (req, res) => {
    const { fileName, field } = req.body; // Change `filename` to `fileName`

    try {
        const filePath = path.join(__dirname, '..', 'template', fileName);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found.' });
        }

        const filledPdfBytes = await fillPdfWithFormData(filePath, field); // Pass filePath to the function

        // Set the appropriate headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename=filled-${Date.now()}.pdf`);

        // Send the filled PDF bytes as a response (ensure filledPdfBytes is a Buffer)
        res.end(Buffer.from(filledPdfBytes));

    } catch (error) {
        console.error('Error processing the PDF:', error);
        res.status(500).send('Failed to process the PDF.');
    }
});

export default router;
