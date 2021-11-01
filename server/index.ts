import "dotenv/config";
import * as express from "express";
import * as path from "path";
import * as cors from "cors";
import * as jwt from "jsonwebtoken";
import { auth, authToken, foundEmail } from "./controllers/auth-controller";
import { findUsers, modifyData, myPets } from "./controllers/users-controller";
import {
  findPets,
  createPetReport,
  deletePetReport,
  petsAround,
  editPetReport,
  infoAboutPet,
  sendNotification,
  petReports,
} from "./controllers/pets-controller";
import { sequelize } from "./models/connect";

// sequelize.sync({ force: true }).then((res) => {
//   console.log(res);
// });

const SECRET = process.env.TOKEN_SECRET;

const app = express();
const port = process.env.PORT || 8010;
const staticDirPath = path.resolve(__dirname, "../../client-dist");

app.use(cors());
app.use(
  express.json({
    limit: "50mb",
  })
);

//------------------------------------------------------ USER ------------------------------------------------------

app.get("/users", async (req, res) => {
  const findUsersRes = await findUsers();
  res.json(findUsersRes);
});

app.get("/foundEmail", async (req, res) => {
  if (!req.query) {
    res.status(400).json({
      message: "no tengo query",
    });
  }

  const foundEmailRes = await foundEmail(req.query);
  res.json(foundEmailRes);
});

app.post("/auth", async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      message: "no tengo body",
    });
  }

  const AuthRes = await auth(req.body);
  res.json(AuthRes);
});

app.post("/auth/token", async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      message: "no tengo body",
    });
  }

  const AuthTokenRes = await authToken(req.body);
  res.json(AuthTokenRes);
});

function authMiddleware(req, res, next) {
  const authHeader = req.get("authorization");
  if (authHeader) {
    const token = req.headers.authorization.split(" ")[1];
    try {
      const data = jwt.verify(token, SECRET);
      req._user = data;
      next();
    } catch {
      res.status(401).json({ error: "error when validating the token" });
    }
  } else {
    res.status(401).json({ error: "header authorization doesn´t exists" });
  }
}

app.patch("/modifyData", authMiddleware, async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      message: "no tengo body",
    });
  }
  const modifyDataRes = await modifyData(req.body);
  res.json(modifyDataRes);
});

//------------------------------------------------------ PET ------------------------------------------------------

app.get("/pets", async (req, res) => {
  const findPetsRes = await findPets();
  res.json(findPetsRes);
});

app.post("/reportPet", authMiddleware, async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      message: "no tengo body",
    });
  }

  const createPetReportRes = await createPetReport(req._user.id, req.body);
  res.json(createPetReportRes);
});

app.get("/pets/me", authMiddleware, async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      message: "no tengo body",
    });
  }

  const response = await myPets(req._user.id);
  console.log(response);

  res.json(response);
});

app.get("/pets/around", async (req, res) => {
  if (!req.query) {
    res.status(400).json({
      message: "no tengo query",
    });
  }
  console.log(req.query);

  const petsAroundRes = await petsAround(req.query);
  res.json(petsAroundRes);
});

app.delete("/deletePetReport", authMiddleware, async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      message: "no tengo query",
    });
  }

  const deletePetReportRes = await deletePetReport(req.body);
  res.json(deletePetReportRes);
});

app.post("/editPetReport", authMiddleware, async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      message: "no tengo query",
    });
  }

  const editPetReportRes = await editPetReport(req.body);
  res.json(editPetReportRes);
});

app.post("/infoAboutPet", async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      message: "no tengo query",
    });
  }

  const infoAboutPettRes = await infoAboutPet(req.body);
  res.json(infoAboutPettRes);
});

app.post("/sendNotification", async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      message: "no tengo query",
    });
  }
  const sendNotificationRes = await sendNotification(req.body);
  res.json(sendNotificationRes);
});

app.get("/petReports", async (req, res) => {
  if (!req.body) {
    res.status(400).json({
      message: "no tengo query",
    });
  }
  const petReportsRes = await petReports();
  res.json(petReportsRes);
});

app.use(express.static(staticDirPath));
console.log(staticDirPath);

app.get("*", (req, res) => {
  res.sendFile(staticDirPath + "/index.html");
});

app.listen(port, () => {
  console.log("Funcionando en http://localhost:" + port);
});
