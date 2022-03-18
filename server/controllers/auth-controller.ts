import { Auth, User } from "../models/index";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

const SECRET = "estoEsSecreto";

function getSHA256ofString(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export async function auth(body) {
  const { email, userName, password, confirmpassword } = body;
  if (password == confirmpassword) {
    const [user, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        userName,
        email,
      },
    });
    const [auth, authCreated] = await Auth.findOrCreate({
      where: { userId: user.get("id") },
      defaults: {
        email,
        password: getSHA256ofString(password),
        userId: user.get("id"),
      },
    });
    return true;
  } else {
    return false;
  }
}

export async function foundEmail({ email }) {
  const found = await Auth.findOne({
    where: {
      email,
    },
  });
  if (found) {
    return true;
  } else {
    return false;
  }
}

export async function authToken({ email, password }) {
  const passwordHasheada = getSHA256ofString(password);
  const auth = await Auth.findOne({
    where: {
      email,
      password: passwordHasheada,
    },
  });
  const user = await User.findOne({
    where: {
      email,
    },
  });

  if (auth) {
    const token = jwt.sign({ id: auth.get("userId") }, SECRET);
    return { auth: auth, token: token, user: user };
  } else {
    return "password or email incorrect";
  }
}
