import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configure storage and file filter for text files
const textFileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/uploads'));
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// File filter to allow only text files
const textFileFilter = (req, file, cb) => {
    if (file.mimetype === 'text/plain') {
        cb(null, true);
    } else {
        cb(new Error('Only .txt files are allowed!'), false);
    }
};

const uploadTextFile = multer({ 
    storage: textFileStorage,
    fileFilter: textFileFilter 
});

export { uploadTextFile };
