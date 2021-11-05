import { Router } from "@vaadin/router";
import { state } from "../../state";
var _ = require("lodash");
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8010";

export class Home extends HTMLElement {
  connectedCallback() {
    const cs = state.getState();
    this.render();
    const giveLocation = document.getElementById("give-location");

    giveLocation.addEventListener("click", () => {
      state.getCurrentLocation();
      this.petsAround();
    });
  }

  petsAround() {
    const homeUbic = document.querySelector(".home__ubic") as any;
    const cs = state.getState();
    fetch(
      API_BASE_URL +
        "/pets/around?lat=" +
        cs.myLocation.lat +
        "&lng=" +
        cs.myLocation.lng
    )
      .then((res) => {
        return res.json();
      })
      .then((pets) => {
        if (pets) {
          homeUbic.style.display = "none";
          for (const p of pets) {
            this.addPetsAround(p);
          }
        }
        if (pets.length == 0) {
          const div = document.createElement("div");
          div.innerHTML = `
            <my-text variant="large">No se encuentran mascotas perdidas cerca de su ubicacion</my-text>
          `;
          this.appendChild(div);
        }
      });
  }

  addPetsAround(p) {
    const petIMG = require("url:../../images/perro.jpg");
    const cardsContainer = document.querySelector(".cards__container");

    const div = document.createElement("div");

    div.innerHTML = `
    <div class="card" id="home__card" >
          <div class="home-card-image">
            <figure>
              <img src=${p.petPhoto} crossorigin="anonymous" alt="Placeholder image">
            </figure>
          </div>
          <div class="card-content">
            <div class="media">
              <div class="media-content">
                <p class="title is-4">${p.petName}</p>
                <p class="subtitle is-6">${p.petDescription}</p>
                <p class="subtitle is-6">Perdido en: ${p.petUbication}</p>
              </div>
            </div>
          </div>
          <footer class="card-footer">
            <a id="report-pet-${p.objectID}" class="card-footer-item">Reportar información</a>
          </footer>
        </div>
    `;

    cardsContainer.appendChild(div);
    const reportPet = document.getElementById(`report-pet-${p.objectID}`);

    reportPet.addEventListener("click", () => {
      const cs = state.getState();

      cs.petToReport.id = p.objectID;
      cs.petToReport.petName = p.petName;
      cs.petToReport.petOwnerEmail = p.petOwnerEmail;
      state.setState(cs);

      Router.go("/petsight");
    });
  }

  render() {
    this.innerHTML = `
    <my-header></my-header>
    <br/>
    <br/>
    <my-text variant="title">Mascotas perdidas cerca tuyo</my-text>
    <br/>
    <div class="home__ubic">
      <my-text variant="body">Para ver las mascotas reportadas cerca tuyo necesitamos permiso para conocer tu ubicación.</my-text>
      <button id="give-location" class="button is-success">Dar mi ubicación</button>
    </div>
    <div class="cards__container"></div>
    
    `;
  }
}
customElements.define("home-page", Home);
