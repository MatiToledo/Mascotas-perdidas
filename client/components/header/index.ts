import { Router } from "@vaadin/router";
import { state } from "../../state";

export function HeaderComp() {
  customElements.define(
    "my-header",
    class extends HTMLElement {
      constructor() {
        super();
        this.render();
      }
      render() {
        const shadow = this.attachShadow({ mode: "open" });
        const div = document.createElement("div");
        const style = document.createElement("style");
        const logoIMG = require("url:../../images/logo.png");
        const burguerIMG = require("url:../../images/burguer.png");
        const closeIMG = require("url:../../images/close.png");

        div.innerHTML = `
          <div class="container">
            <img class="logo" src="${logoIMG}">
            <img class="burguer" src="${burguerIMG}">
          </div>
          <div class="burguer__content">
            <img class="close" src="${closeIMG}">
            <div class="burguer__text">
              <my-text variant="large" class="md">Mis datos</my-text>
              <my-text variant="large" class="mmr">Mis mascotas reportadas</my-text>
              <my-text variant="large" class="rm">Reportar mascota</my-text>
            </div>
          </div>
        `;

        style.innerHTML = `
          .container{
            height: 60px;
            background-color:#ffe08a
            ;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
          }
          .logo{
            width: 40px;
            height: 40px;
          }
          .burguer{
            width: 40px;
            height: 30px;
          }
          .burguer__content{
            background-color: gray;
            position: absolute;
            right: 0;
            top: 0;
            left: 0;
            bottom: 0;
            display:none;
            justify-content: center;
            z-index: 1;
          }
          .close{
            position: absolute;
            right: 30px;
            top: 30px;
            width: 40px;
            height: 40px;
          }
          .burguer__text{
            display: flex;
            color: white;
            flex-direction: column;
            max-width: 200px;
            height: 500px;
            margin: auto;
            justify-content: space-around;
            text-align: center;
          }
        `;

        const open = div.querySelector(".burguer");
        const close = div.querySelector(".close");
        const content = div.querySelector(".burguer__content") as any;
        const logo = div.querySelector(".logo");

        logo.addEventListener("click", () => {
          Router.go("/");
        });
        open.addEventListener("click", () => {
          content.style.display = "flex";
        });
        close.addEventListener("click", () => {
          content.style.display = "none";
        });

        const cs = state.getState();

        const md = div.querySelector(".md");
        const mmr = div.querySelector(".mmr");
        const rm = div.querySelector(".rm");

        if (cs.token == "") {
          md.addEventListener("click", () => {
            Router.go("/ingresar");
          });
          mmr.addEventListener("click", () => {
            Router.go("/ingresar");
          });
          rm.addEventListener("click", () => {
            Router.go("/ingresar");
          });
        } else {
          md.addEventListener("click", () => {
            Router.go("/mydata");
          });
          mmr.addEventListener("click", () => {
            Router.go("/mypets");
          });
          rm.addEventListener("click", () => {
            Router.go("/reportpet");
          });
        }

        shadow.appendChild(div);
        shadow.appendChild(style);
      }
    }
  );
}
