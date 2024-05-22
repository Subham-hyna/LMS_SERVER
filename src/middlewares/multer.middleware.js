import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      cb(null, `image-${Date.now()}-${file.originalname}`)
    }
  })
  
  export const upload = multer({
    storage 
})