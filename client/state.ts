import { Router } from "@vaadin/router";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8010";

const state = {
  data: {
    email: "",
    userName: "",
    token: "",
    myLocation: {
      lat: "",
      lng: "",
    },
    petToEdit: {
      id: "",
      petName: "",
      petUbication: "",
      petDescription: "",
      petPhoto: "",
    },
    petToReport: {
      id: "",
      petName: "",
      petOwnerEmail: "",
    },
    petCreateReport: {
      lastlocationLat: "",
      lastlocationLng: "",
    },
  },
  listeners: [],

  //-----------------------------------------------------------------------------------------------

  getState() {
    return this.data;
  },

  //-----------------------------------------------------------------------------------------------

  setState(newState) {
    this.data = newState;
    for (const cb of this.listeners) {
      cb(newState);
    }

    localStorage.setItem("pet-storage", JSON.stringify(newState));
  },

  //-----------------------------------------------------------------------------------------------

  subscribe(callback: (any) => any) {
    this.listeners.push(callback);
  },

  init() {
    const localData = localStorage.getItem("pet-storage");

    this.setState(JSON.parse(localData));
  },

  //-----------------------------------------------------------------------------------------------

  getCurrentLocation(callback?) {
    function success(pos) {
      const cs = state.getState();
      var crd = pos.coords;

      cs.myLocation.lat = crd.latitude;
      cs.myLocation.lng = crd.longitude;
      state.setState(cs);
    }

    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 30000,
    };

    function error(err) {
      console.warn("ERROR(" + err.code + "): " + err.message);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
  },

  //-----------------------------------------------------------------------------------------------

  auth(data, callback?) {
    fetch(API_BASE_URL + "/auth", {
      method: "post",

      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data == true) {
          window.alert("Registro realizado con exito");
          callback();
        } else {
          window.alert("Las contraseñas no coinciden");
          location.reload();
        }
      });
  },

  //-----------------------------------------------------------------------------------------------

  foundEmail(email, callback?) {
    const cs = state.getState();

    fetch(API_BASE_URL + "/users/" + email)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data == true) {
          callback();
        } else {
          window.alert("No existe un usuario con ese email");
          Router.go("/registrarse");
        }
      });
  },

  //-----------------------------------------------------------------------------------------------

  authToken(data, callback?) {
    const cs = state.getState();

    fetch(API_BASE_URL + "/auth/token", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.token) {
          cs.email = data.auth.email;
          cs.userName = data.user.userName;
          cs.token = data.token;
          state.setState(cs);
          window.alert("Incio de sesion realizado con exito");
          callback();
        } else {
          window.alert("Email o contraseña incorrecta");
          location.reload();
        }
      });
  },

  //-----------------------------------------------------------------------------------------------

  ModifyData(data, callback?) {
    const cs = state.getState();

    fetch(API_BASE_URL + "/users/modify", {
      method: "patch",
      headers: {
        "content-type": "application/json",
        authorization: "bearer " + cs.token,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data == false) {
          window.alert("No se pudo modificar los datos");
        } else {
          cs.userName = data.userName;
          cs.email = data.email;
          state.setState(cs);
          window.alert("Datos modificados con exito");
        }
      });
  },

  //-----------------------------------------------------------------------------------------------

  createPetReport(data, callback?) {
    const cs = state.getState();

    fetch(API_BASE_URL + "/pets/report", {
      method: "post",
      headers: {
        "content-type": "application/json",
        authorization: "bearer " + cs.token,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data == true) {
          window.alert("Mascota reportada con exito");
          callback();
        } else {
          window.alert("Error al reportar la mascota");
        }
      });
  },

  //-----------------------------------------------------------------------------------------------

  deletePetReport(data, callback?) {
    const cs = state.getState();

    fetch(API_BASE_URL + "/pets/delete", {
      method: "delete",
      headers: {
        "content-type": "application/json",
        authorization: "bearer " + cs.token,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data == true) {
          window.alert("Exito al eliminar el reporte de la mascota");
        }
        callback();
      });
  },

  //-----------------------------------------------------------------------------------------------

  editPetReport(data, callback?) {
    const cs = state.getState();

    fetch(API_BASE_URL + "/pets/edit", {
      method: "post",
      headers: {
        "content-type": "application/json",
        authorization: "bearer " + cs.token,
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data == true) {
          window.alert("Exito al modificar el reporte de la mascota");
        }
        callback();
      });
  },

  //-----------------------------------------------------------------------------------------------

  infoAboutPet(data, callback?) {
    fetch(API_BASE_URL + "/pets/info", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        callback();
      });
  },

  //-----------------------------------------------------------------------------------------------

  sendNotification(data, callback?) {
    fetch(API_BASE_URL + "/notifications", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data == true) {
          window.alert("reporte realizado con exito ");
        } else {
          window.alert("error al realizar el reporte");
        }
        callback();
      });
  },
};

export { state };
