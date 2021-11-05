import { Router } from "@vaadin/router";
import { state } from "../../state";

export class Rregistrarse extends HTMLElement {
  connectedCallback() {
    this.render();
    const form = document.querySelector(".registrarse__form");
    const submitButton = document.getElementById("submit-button");
    form.addEventListener("submit", (e) => {
      submitButton.className = "button is-success is-loading";
      e.preventDefault();
      const target = e.target as any;
      const userName = target.username.value;
      const email = target.email.value;
      const password = target.password.value;
      const confirmpassword = target.confirmpassword.value;
      state.auth({ userName, email, password, confirmpassword }, () => {
        Router.go("/");
      });
    });
  }

  render() {
    this.innerHTML = `
    <my-header></my-header>
    <br/>
    <br/>
    <my-text variant="title" >Registrarse</my-text>
    <form class="registrarse__form">
        <div>
          <my-text>Nombre de usuario</my-text>
          <input class="input is-info" type="text" placeholder="Inserte su username" name="username">
        </div>
        <div>
          <my-text>Email</my-text>
          <input class="input is-info" type="text" placeholder="Inserte su email" name="email">
        </div>
        <div>
          <my-text>Contraseña</my-text>
          <input class="input is-info" type="password" placeholder="Inserte su contraseña" name="password">
        </div>
        <div>
          <my-text>Repetir contraseña</my-text>
          <input class="input is-info" type="password" placeholder="Confirme su contraseña" name="confirmpassword">
        </div>
      <button id="submit-button" class="button is-success">Guardar</button>
    </form>
    `;
  }
}
customElements.define("registrarse-page", Rregistrarse);
