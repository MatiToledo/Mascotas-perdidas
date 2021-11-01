import { Router } from "@vaadin/router";
import { state } from "../../state";

export class Ingresar extends HTMLElement {
  connectedCallback() {
    this.render();
    const form = document.querySelector(".ingresar__form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const email = target.email.value;

      const password = target.password.value;
      state.foundEmail(email, () => {
        state.authToken({ email, password }, () => {
          Router.go("/");
        });
      });
    });
  }

  render() {
    this.innerHTML = `
    <my-header></my-header>
    <br/>
    <br/>
    <my-text variant="title">Ingresar</my-text>
    <form class="ingresar__form">
        <div>
          <my-text>Email</my-text>
          <input class="input is-info" type="text" placeholder="Inserte su email" name="email">
        </div>
        <div>
          <my-text>Password</my-text>
          <input class="input is-info" type="password" placeholder="Inserte su email" name="password">
        </div>
        <button class="button is-success">Ingresar</button>
        <a class="a__registrarse" href="/registrarse">Registrarse</a>
    </form>
    `;
  }
}
customElements.define("ingresar-page", Ingresar);
