import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/ingresar", component: "ingresar-page" },
  { path: "/mydata", component: "mydata-page" },
  { path: "/mypets", component: "mypets-page" },
  { path: "/reportpet", component: "reportpet-page" },
  { path: "/editpet", component: "editpet-page" },
  { path: "/registrarse", component: "registrarse-page" },
  { path: "/petsight", component: "petsight-page" },
]);
