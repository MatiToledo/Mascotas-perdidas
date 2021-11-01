export function TextComp() {
  customElements.define(
    "my-text",
    class extends HTMLElement {
      constructor() {
        super();
        this.render();
      }
      render() {
        const shadow = this.attachShadow({ mode: "open" });
        const div = document.createElement("div");
        const variant = this.getAttribute("variant") || "body";
        const style = document.createElement("style");

        style.innerHTML = `
        .title{
          text-align: center;
          font-family: 'Inter', sans-serif;
          font-size: 46px;
          font-weight: 700;
          color:black;
          line-height: normal;
        }
        .large{
          font-family: 'Inter', sans-serif;
          font-size: 30px;
          font-weight: 500;
          color:black;
        }
        .body{
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          font-weight: 400;
          color:black;
        }
        `;

        div.className = variant;
        div.textContent = this.textContent;
        shadow.appendChild(div);
        shadow.appendChild(style);
      }
    }
  );
}
