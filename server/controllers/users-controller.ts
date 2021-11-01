import { Auth, User, Pet } from "../models/index";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
const SECRET = "estoEsSecreto";

function getSHA256ofString(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export async function findUsers() {
  const users = await User.findAll();
  const auth = await Auth.findAll();
  return { users, auth };
}

export async function modifyData(body) {
  const { userName, email, newEmail, password, confirmpassword } = body;
  const passwordHasheada = getSHA256ofString(password);
  if (password == confirmpassword) {
    const auth = await Auth.update(
      { email: newEmail, password: passwordHasheada },
      {
        where: {
          email,
        },
      }
    );
    const user = await User.update(
      { email: newEmail, userName },
      {
        where: {
          email,
        },
      }
    );
    const modifiedUser = await User.findOne({ where: { email: newEmail } });
    return modifiedUser;
  } else {
    return false;
  }
}
export async function myPets(UserId) {
  const myPets = await Pet.findAll({ where: { UserId } });

  return myPets;
}
