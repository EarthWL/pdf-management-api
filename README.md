
# PDF Management API

This is a Node.js-based API for managing PDF files. The API allows you to upload, retrieve, delete, and fill PDF templates with form data. It is built using Express and integrates with Multer for file uploads and manipulation.

## Features

- **Upload PDF**: Upload a PDF file and extract its form fields.
- **List PDFs**: Retrieve a list of all PDF files stored in the `template` directory.
- **Get PDF Fields**: Retrieve form fields from a specific PDF by its filename.
- **Delete PDF**: Delete a PDF file from the `template` directory.
- **Fill PDF**: Fill a PDF template with provided data and return the filled PDF.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/earthwl/pdf-management-api.git
   cd pdf-management-api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:

   ```bash
   PORT=4000
   ```

4. Start the server:

   ```bash
   npm start
   ```

   The server will run on `http://localhost:4000`.

## API Endpoints

### Upload PDF and Get Fields

- **Endpoint**: `/api/v1/files`
- **Method**: `POST`
- **Description**: Upload a PDF file and return its form fields.
- **Request Body**: `multipart/form-data` with `pdfFile` as the key.

### List All PDFs

- **Endpoint**: `/api/v1/files`
- **Method**: `GET`
- **Description**: Get a list of all PDFs stored in the `template` directory.

### Get PDF Fields by Filename

- **Endpoint**: `/api/v1/files/{fileName}`
- **Method**: `GET`
- **Description**: Get form fields of a specific PDF by its filename.

### Delete PDF by Filename

- **Endpoint**: `/api/v1/files/{fileName}`
- **Method**: `DELETE`
- **Description**: Delete a specific PDF file by its filename.

### Fill PDF with Data

- **Endpoint**: `/api/v1/renderPdf`
- **Method**: `POST`
- **Description**: Fill a PDF template with provided field data and return the filled PDF.
- **Request Body**: 
  ```json
  {
    "fileName": "example.pdf",
    "field": [
      {
        "fieldID": "name",
        "fieldType": "text",
        "value": "John Doe"
      },
      {
        "fieldID": "agree",
        "fieldType": "checkbox",
        "value": true
      }
    ]
  }
  ```

## Swagger API Documentation

This project uses Swagger to generate API documentation. Once the server is running, you can view the API documentation by navigating to:

```
http://localhost:4000/api-docs
```

## Project Structure
```
├── .dockerignore            # Docker ignore file
├── .env                     # Environment variables
├── Dockerfile               # Docker configuration
├── index.mjs                # Entry point of the application
├── package.json             # Node.js dependencies and scripts
├── fonts                    # Directory for storing custom fonts
│   ├── AngsanaNew.ttf       # Angsana New font
│   └── THSarabunNew.ttf     # TH Sarabun New font
├── middleware               # Middleware functions
│   └── apiKeyAuth.js        # API Key authentication middleware
├── routes                   # API route handlers
│   └── api-v1.js            # API routes for version 1
├── template                 # Directory for storing PDF templates
│   └── transferPower.pdf    # Example PDF template
└── utilities                # Utility functions
    └── pdfUtils.js          # PDF handling utilities
```
## Dependencies

- [Express](https://expressjs.com/) - Web framework for Node.js
- [Multer](https://github.com/expressjs/multer) - Middleware for handling `multipart/form-data`, used for file uploads
- [Swagger UI Express](https://github.com/scottie1984/swagger-ui-express) - Swagger integration for Express
- [fs](https://nodejs.org/api/fs.html) - File system module for Node.js
- [path](https://nodejs.org/api/path.html) - Utilities for working with file and directory paths
- [helmet](https://helmetjs.github.io/) - Security middleware for Express
- [cors](https://github.com/expressjs/cors) - Middleware for enabling Cross-Origin Resource Sharing
- [express-rate-limit](https://github.com/nfriedly/express-rate-limit) - Basic rate-limiting middleware for Express
- [dotenv](https://github.com/motdotla/dotenv) - Module that loads environment variables from a `.env` file

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
