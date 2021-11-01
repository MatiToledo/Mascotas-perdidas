import { Router } from "@vaadin/router";
import { state } from "../../state";

export class Petsight extends HTMLElement {
  connectedCallback() {
    this.render();
    const form = document.querySelector(".report__form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const cs = state.getState();

      const target = e.target as any;
      const PetId = cs.petToReport.id;
      const petName = cs.petToReport.petName;
      const petOwnerEmail = cs.petToReport.petOwnerEmail;
      const reporterName = target.reporterName.value;
      const reporterPhoneNumber = target.reporterPhoneNumber.value;
      const seenIn = target.seenIn.value;
      state.infoAboutPet(
        { PetId, reporterName, reporterPhoneNumber, seenIn },
        () => {
          state.sendNotification(
            {
              petOwnerEmail,
              reporterName,
              reporterPhoneNumber,
              seenIn,
              petName,
            },
            () => {
              Router.go("/");
            }
          );
        }
      );
    });
  }

  render() {
    const cs = state.getState();
    this.innerHTML = `
    <my-header></my-header>
    <br/>
    <br/>
    <div class="report__container">
          <my-text variant="title">Reportar info sobre ${cs.petToReport.petName}</my-text>
          <form class="report__form">
            <div>
              <my-text>Tu nombre</my-text>
              <input class="input is-info" type="text" placeholder="Inserte su nombre" name="reporterName">
            </div>
            <div>
              <my-text>Tu telefono</my-text>
              <input class="input is-info" type="text" placeholder="Inserte su telefono" name="reporterPhoneNumber">
            </div>
            <div>
              <my-text>Donde lo viste?</my-text>
              <textarea class="textarea is-link" placeholder="Describa a su mascota" name="seenIn"></textarea>
            </div>
            <button class="button is-success">Enviar</button>
          </form>
        </div>
    `;
  }
}
customElements.define("petsight-page", Petsight);
