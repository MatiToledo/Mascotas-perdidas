import * as mapboxgl from "mapbox-gl";
import * as mapboxClient from "mapbox";
import { Dropzone } from "dropzone";
import { state } from "../../state";
import { Router } from "@vaadin/router";

export class Editpet extends HTMLElement {
  connectedCallback() {
    this.render();

    const form = document.querySelector(".reportpet__form");
    let imageDataURL;

    const imageDrop = document.querySelector(".dropzone-photo");
    const buttonImg = document.querySelector(".load-photo");
    const myDropzone = new Dropzone(imageDrop, {
      url: "/falsa",
      autoProcessQueue: false,
      clickable: true,
      clickeableElements: buttonImg,
      clickeableElements: imageDrop,
      thumbnail: function (file, dataUrl) {
        // Display the image in your file.previewElement
        imageDrop.setAttribute("src", dataUrl);
      },
    });

    myDropzone.on("thumbnail", function (file) {
      imageDataURL = file.dataURL;
    });

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const MAPBOX_TOKEN =
      "pk.eyJ1IjoibWF0aS10b2xlZG8iLCJhIjoiY2t1cG1qam83MDJsaTMxbWc3eHVyenVkeiJ9.HkGvX59y8Azu1LzbFDoemw";

    const clientMapbox = new mapboxClient(MAPBOX_TOKEN);

    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-64.184772, -31.428619],
      zoom: 10,
    });

    const searchButton = document.querySelector(".ubic__search-button");
    searchButton.addEventListener("click", () => {
      const ubic = document.getElementById("ubicacion");
      clientMapbox.geocodeForward(
        ubic.value,
        {
          country: "ar",
          autocomplete: true,
          language: "es",
        },
        function (err, data, res) {
          const firstResult = data.features[0];
          const [lng, lat] = firstResult.geometry.coordinates;
          map.setCenter(firstResult.geometry.coordinates);
          map.setZoom(14);
        }
      );
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const cs = state.getState();
      const id = cs.petToEdit.id;
      const petName = e.target.petName.value;
      const petPhoto = imageDataURL;
      const lastlocationLat = -31.343339;
      const lastlocationLng = -63.9460372;
      const petUbication = e.target.petUbication.value;
      const petDescription = e.target.petDescription.value;
      state.editPetReport(
        {
          id,
          petName,
          petPhoto,
          lastlocationLat,
          lastlocationLng,
          petUbication,
          petDescription,
        },
        () => {
          Router.go("/");
        }
      );
    });
  }

  render() {
    const cs = state.getState();
    let imageDataURL =
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9PpYaew1LwBYxbcFk0axCjqHM7WKyFu1Nr1oFLjklPNX1MPvIrVSmauKtEewNMSsPYKU&usqp=CAU";
    this.innerHTML = `
    <my-header></my-header>
    <br/>
    <br/>
    
    <div class="report__title">
      <my-text variant="title" >Editar mascota perdida</my-text>
    </div>

    <form class="reportpet__form">
      <div>
        <my-text>Nombre</my-text>
        <input class="input is-info" type="text" value="${cs.petToEdit.petName}" name="petName">
      </div>

      <div>
        <my-text>Descripción</my-text>
        <textarea class="textarea is-link" name="petDescription">${cs.petToEdit.petDescription}</textarea>
      </div>

      <div class="dropzone__container">
        <img src="${imageDataURL}" class="dropzone-photo">
        <div class="load-photo" >Clickee la imagen de arriba para subir una foto</div>
      </div>

      <div class="ubicacion__container">
        <div>
          <my-text>Ubicación</my-text>
          <div class="ubic__search">
            <input id="ubicacion" style="margin-bottom:10px" class="input is-info" type="text" value="${cs.petToEdit.petUbication}" name="petUbication">
            <div class="ubic__search-button">Buscar</div>
          </div>
          <my-text>Buscá un punto de referencia para reportar a tu mascota. Puede ser una dirección, un barrio o una ciudad.</my-text>
        </div>
        <div id="map" class="mapbox"></div>
      </div>  

      <button class="button is-success">Editar reporte</button>
    </form>
    `;
  }
}
customElements.define("editpet-page", Editpet);
