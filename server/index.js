const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const bcrypt = require("bcrypt");
const UserModel = require("./models/Users");
const router = express.Router();
const RegisterModel = require("./models/Register");
const ArticleModel = require("./models/Article");
const DocumentModel = require("./models/Document");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.json());
const upload = multer();
const port = process.env.DB_PORT;
app.use(express.json());
// app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.get("/getUsers", (req, res) => {
  UserModel.find()
    .then((users) => res.json(users))
    .catch((err) => res.json(err));
});

app.get("/getRegisters", (req, res) => {
  RegisterModel.find()
    .then((registers) => res.json(registers))
    .catch((err) => res.json(err));
});

app.get("/getArticles", (req, res) => {
  ArticleModel.find()
    .then((articles) => res.json(articles))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/getDocument", (req, res) => {
  DocumentModel.find()
    .then((document) => res.json(document))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
});

app.get("/documents/:filename", async (req, res) => {
  try {
    const document = await DocumentModel.findOne({
      "fileDocument.name": req.params.filename,
    });

    if (document) {
      res.set("Content-Type", document.fileDocument.contentType);
      res.set(
        "Content-Disposition",
        `attachment; filename=${document.fileDocument.name}`
      );
      res.send(document.fileDocument.data);
    } else {
      res.status(404).send("File not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// app.post("/login", (req, res) => {
//   const { email, password } = req.body;
//   RegisterModel.findOne({ email: email }).then((user) => {
//     if (user) {
//       if (user.password === password) {
//         res.json("Success");
//       } else {
//         res.json("the passsword is incorrect");
//       }
//     } else {
//       res.json("No Record existed");
//     }
//   });
// });

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await RegisterModel.findOne({ email: email });

    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        res.json("Success");
      } else {
        res.json("The password is incorrect");
      }
    } else {
      res.json("No record existed");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/registers", async (req, res) => {
  try {
    const { email, password, passwordConfirm } = req.body;

    if (!email || !password || !passwordConfirm) {
      return res.status(400).json({ error: "Incomplete request body" });
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const user = await RegisterModel.findOne({ email: email });

    if (user) {
      return res.status(400).json({ error: "Already have an account" });
    }

    await RegisterModel.create({
      email: email,
      password: encryptedPassword,
      passwordConfirm: encryptedPassword,
    });

    res.json({ message: "Account created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

app.post("/articles", async (req, res) => {
  try {
    const {
      titleID,
      titleEN,
      descriptionID,
      descriptionEN,
      articleDate,
      category,
      imageCover,
    } = req.body;

    if (
      !titleID ||
      !titleEN ||
      !descriptionID ||
      !descriptionEN ||
      !articleDate ||
      !category
    ) {
      return res.status(400).json({ error: "Incomplete request body" });
    }

    await ArticleModel.create({
      titleID: titleID,
      titleEN: titleEN,
      descriptionID: descriptionID,
      descriptionEN: descriptionEN,
      articleDate: articleDate,
      category: category,
      imageCover: imageCover,
    });

    res.json({ message: "Article created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/document", upload.single("fileDocument"), async (req, res) => {
  try {
    const { descriptionID, descriptionEN, articleDate, category, selectType } =
      req.body;
    const newFileDocument = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
      name: req.file.originalname,
    };

    await DocumentModel.create({
      descriptionID,
      descriptionEN,
      fileDocument: newFileDocument,
      articleDate,
      category,
      selectType,
    });

    res.json({ message: "File uploaded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/documents/:id", async (req, res) => {
  try {
    const documentIdToDelete = req.params.id;
    await DocumentModel.findByIdAndDelete(documentIdToDelete);

    res.json({ message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.delete("/articles/:id", async (req, res) => {
  try {
    const articleIdToDelete = req.params.id;
    await ArticleModel.findByIdAndDelete(articleIdToDelete);

    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log("serve ris running");
});
