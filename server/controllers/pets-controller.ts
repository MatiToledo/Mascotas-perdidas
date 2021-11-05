import { Pet, Report, User } from "../models";
import { index } from "../../lib/algolia";
import { cloudinary } from "../../lib/cloudinary";

//-----------------------------------------------------------------------------------------------------------

export async function findPets() {
  const pets = await Pet.findAll();
  return pets;
}

//-----------------------------------------------------------------------------------------------------------

export async function createPetReport(UserId, body) {
  const {
    petName,
    petPhoto,
    lastlocationLat,
    lastlocationLng,
    petUbication,
    petDescription,
    petOwnerEmail,
  } = body;

  const imagen = await cloudinary.uploader.upload(petPhoto, {
    resource_type: "image",
    discard_original_filename: true,
    width: 1000,
  });

  const user = await User.findByPk(UserId);

  if (user) {
    const pet = await Pet.create({
      petName,
      petPhoto: imagen.secure_url,
      lastlocationLat,
      lastlocationLng,
      petUbication,
      petDescription,
      UserId,
      petOwnerEmail,
    });

    const algoliaRes = await index.saveObject({
      objectID: pet.get("id"),
      petName: pet.get("petName"),
      petPhoto: pet.get("petPhoto"),
      _geoloc: {
        lat: pet.get("lastlocationLat"),
        lng: pet.get("lastlocationLng"),
      },
      petUbication: pet.get("petUbication"),
      petDescription: pet.get("petDescription"),
      petOwnerEmail: pet.get("petOwnerEmail"),
      UserId,
    });
    return true;
  } else {
    return false;
  }
}

//-----------------------------------------------------------------------------------------------------------

export async function petsAround(query) {
  const { lat, lng } = query;
  const { hits } = await index.search("", {
    aroundLatLng: [lat, lng].join(","),
    aroundRadius: 10000000,
  });
  return hits;
}

//-----------------------------------------------------------------------------------------------------------

export async function deletePetReport(body) {
  const { id } = body;
  const deletePet = await Pet.destroy({ where: { id } });
  const deletePetAlgolia = await index.deleteObject(id);
  return true;
}

//-----------------------------------------------------------------------------------------------------------

export async function editPetReport(body) {
  const {
    petName,
    petPhoto,
    lastlocationLat,
    lastlocationLng,
    petUbication,
    petDescription,
  } = body;

  const imagen = await cloudinary.uploader.upload(petPhoto, {
    resource_type: "image",
    discard_original_filename: true,
    width: 1000,
  });

  const editPet = await Pet.update(
    {
      petName,
      petPhoto: imagen.url,
      lastlocationLat,
      lastlocationLng,
      petUbication,
      petDescription,
    },
    { where: { id: body.id } }
  );
  const objectId = body.id;
  body.objectID = objectId;
  delete body.id;

  const editPetAlgolia = await index.partialUpdateObject(body);
  return true;
}

//-----------------------------------------------------------------------------------------------------------

export async function infoAboutPet(body) {
  const report = await Report.create(body);
  return report;
}

//-----------------------------------------------------------------------------------------------------------

export async function sendNotification(body) {
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: body.petOwnerEmail,
    from: "toledo.nicolas.matias@gmail.com",
    subject: `Información acerca de ${body.petName}`,
    text: `Tenemos nueva informacion sobre ${body.petName}!!
      
      El señor/a ${body.reporterName} envio esta informacion:
      ${body.seenIn}
      Puedes comunicarte con ${body.reporterName} mediante su numero de telefono: ${body.reporterPhoneNumber}`,
  };
  sgMail
    .send(msg)
    .then(() => {
      return true;
    })
    .catch((error) => {
      return error;
    });
  return true;
}

//-----------------------------------------------------------------------------------------------------------

export async function petReports() {
  const reports = await Report.findAll();
  return reports;
}
