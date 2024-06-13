import multer from "multer";
import path from 'path';
import { fileURLToPath } from 'url'; // Node.js utility to convert URL to file path

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/temp'));
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
    }
});

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};

const upload = multer({ 
    storage,
    fileFilter 
});

export { upload };
