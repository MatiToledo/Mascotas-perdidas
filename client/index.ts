import "./router";

import "./pages/home/index";
import "./pages/ingresar/index";
import "./pages/mydata/index";
import "./pages/mypets/index";
import "./pages/reportpet/index";
import "./pages/registrarse/index";
import "./pages/editpet/index";
import "./pages/petsight/index";

import { HeaderComp } from "./components/header";
import { TextComp } from "./components/text";

import { state } from "./state";

(function () {
  if (localStorage["pet-storage"] == null) {
    state.setState(state.data);
  }
  state.init();
  HeaderComp();
  TextComp();
})();
