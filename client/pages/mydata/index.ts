import { Router } from "@vaadin/router";
import { state } from "../../state";

export class Mydata extends HTMLElement {
  connectedCallback() {
    this.render();
    const form = document.querySelector(".mydata__form");
    const submitButton = document.getElementById("submit-button");

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      submitButton.className = "button is-success is-loading";
      const email = state.getState().email;
      const target = e.target as any;
      const userName = target.username.value;
      const password = target.password.value;
      const newEmail = target.newemail.value;
      const confirmpassword = target.confirmpassword.value;
      state.ModifyData({
        userName,
        newEmail,
        email,
        password,
        confirmpassword,
      });
    });
  }

  render() {
    const cs = state.getState();
    this.innerHTML = `
    <my-header></my-header>
    <br/>
    <br/>
    <my-text variant="title" >Modificar datos</my-text>
    <form class="mydata__form">
        <div>
          <my-text>Nombre de usuario</my-text>
          <input class="input is-info" type="text" placeholder="Inserte su username" name="username" value="${cs.userName}">
        </div>
        <div>
          <my-text>Email</my-text>
          <input class="input is-info" type="text" placeholder="Inserte su contraseña" name="newemail" value="${cs.email}">
        </div>
        <div>
          <my-text>Contraseña</my-text>
          <input class="input is-info" type="password" placeholder="Inserte su contraseña" name="password">
        </div>
        <div>
          <my-text>Repetir contraseña</my-text>
          <input class="input is-info" type="password" placeholder="Confirme su contraseña" name="confirmpassword">
        </div>
      <button id="submit-button" class="button is-success">Modificar</button>
    </form>
    `;
  }
}
customElements.define("mydata-page", Mydata);
