import fs from 'fs/promises'; // Use the promises API for fs module
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getAllFormFieldsAndValues(filePath) {
    try {
        const pdfBuffer = await fs.readFile(filePath); // Read the PDF from the provided path using promises API
        const pdfDoc = await PDFDocument.load(pdfBuffer);

        // Get the form fields
        const form = pdfDoc.getForm();
        const fields = form.getFields();

        const fieldData = [];

        fields.forEach(field => {
            console.log(field)
            const type = field.constructor.name;
            const name = field.getName() || '[Unnamed Field]'; // Handle fields without names

            let value;
            if (type === 'PDFTextField') {
                value = "";
            } else if (type === 'PDFCheckBox') {
                value = false;
            }

            fieldData.push({
                fieldID: name,
                fieldType: type,
                value: value
            });
        });

        return {
            fileName: path.basename(filePath), // extracting the file name from the file path
            field: fieldData
        };
    } catch (error) {
        console.error('Error reading PDF:', error);
        return {};
    }
}

export async function fillPdfWithFormData(filePath, fieldData) {
    try {
        const pdfBuffer = await fs.readFile(filePath); // Read the PDF from the provided path using promises API
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        pdfDoc.registerFontkit(fontkit);
        console.log(__dirname, '..')
        const fontBytes = await fs.readFile(path.join(__dirname, '..','fonts', 'AngsanaNew.ttf'));
        const customFont = await pdfDoc.embedFont(fontBytes);

        const form = pdfDoc.getForm();

        for (const item of fieldData) {
            
            switch (item.fieldType) {
                case 'PDFTextField':
                    const textField = form.getTextField(item.fieldID);
                    textField.setText(item.value);
                    break;
                case 'PDFCheckBox':
                    const checkBox = form.getCheckBox(item.fieldID);
                    if (item.value) {
                        checkBox.check();
                    } else {
                        checkBox.uncheck();
                    }
                    break;
            }
        }

        const rawUpdateFieldAppearances = form.updateFieldAppearances.bind(form);
        form.updateFieldAppearances = function () {
            return rawUpdateFieldAppearances(customFont);
        };

        form.flatten();

        const filledPdfBytes = await pdfDoc.save();

        return filledPdfBytes;

    } catch (error) {
        throw error;
    }
}