import { Router } from "@vaadin/router";
import { state } from "../../state";
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8010";

export class Mypets extends HTMLElement {
  connectedCallback() {
    this.render();
    this.myPets();
  }
  addPet(p) {
    const petIMG = require("url:../../images/perro.jpg");

    const mypetsContainer = document.querySelector(".mypets-cards__container");

    const div = document.createElement("div");
    div.innerHTML = `
    <div id="mypets__card" class="card">
          <div class="mypets-card-image">
            <figure>
              <img crossorigin="anonymous" src="${p.petPhoto}" alt="Placeholder image">
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
            <div class="media-content">
            <p class="title is-4">${p.petName}</p>
          </div>
            </div>
          </div>
          <footer class="card-footer">
            <a id="edit-pet-${p.id}" class="card-footer-item">Editar</a>
            <a id="pet-${p.id}" class="card-footer-item">Eliminar</a>
          </footer>
        </div>
    `;
    mypetsContainer.appendChild(div);
    const deletePet = document.getElementById(`pet-${p.id}`);
    deletePet.addEventListener("click", () => {
      state.deletePetReport({ id: p.id }, () => {
        location.reload();
      });
    });
    const editPet = document.getElementById(`edit-pet-${p.id}`);
    editPet.addEventListener("click", () => {
      const cs = state.getState();

      cs.petToEdit.id = p.id;
      cs.petToEdit.petName = p.petName;
      cs.petToEdit.petDescription = p.petDescription;
      cs.petToEdit.petUbication = p.petUbication;
      state.setState(cs);
      Router.go("/editpet");
    });
  }

  noPet() {
    const div = document.createElement("div");
    div.innerHTML = `
      <my-text variant="large">No tienes mascotas reportadas</my-text>
    `;
    this.appendChild(div);
  }

  async myPets() {
    const cs = state.getState();
    const res = await fetch(API_BASE_URL + "/pets/me", {
      headers: {
        "content-type": "application/json",
        authorization: "bearer " + cs.token,
      },
    });

    const pets = await res.json();
    for (const p of pets) {
      this.addPet(p);
    }
    if (pets.length == 0) {
      this.noPet();
    }
  }

  render() {
    this.innerHTML = `
    <my-header></my-header>
    <br/>
    <br/>
    <my-text variant="title" >Mis mascotas reportadas</my-text>
    <div class="mypets-cards__container"></div>
    `;
  }
}
customElements.define("mypets-page", Mypets);
