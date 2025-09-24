import multer from "multer";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
  
const upload = multer({ storage: storage });
  
const uploadMiddleware = (req, res, next) => {
  upload.single('media')(req, res, (err) => {
    if (err) {
      return next(err);
    }
    req.fileUrl = req.file.path.replace('uploads', 'http://localhost:3000/uploads');
    next();
  });
};
  
export { uploadMiddleware as upload };
