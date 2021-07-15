var firebase = require("firebase/app");
require("firebase/database");

var firebaseConfig = {
    apiKey: "AIzaSyBOneWagWEe-JLdeFuAKjsafHx3WRJNgs0",
    authDomain: "projeto-pcs.firebaseapp.com",
    databaseURL: "https://projeto-pcs-default-rtdb.firebaseio.com",
    projectId: "projeto-pcs",
    storageBucket: "projeto-pcs.appspot.com",
    messagingSenderId: "415874711827",
    appId: "1:415874711827:web:83d7e53e6c9ff000685ae6",
    measurementId: "G-441PETN02Z",
};
firebase.initializeApp(firebaseConfig);
var porta_id,
    _senha = gerarSenha(),
    tickCounter = 30,
    updateLoop;
function gerarSenha(n = 4) {
    let s = 0;
    for (let i = 0; i < n; i++)
        s +=
            (Math.floor(Math.random() * (i == n - 1 ? 9 : 10)) +
                (i == n - 1 ? 1 : 0)) *
            Math.pow(10, i);
    return s;
}
function substituir() {
    if (--tickCounter === 0) {
        tickCounter = 30;
        _senha = gerarSenha();
    }
    firebase
        .database()
        .ref("/portas/" + porta_id)
        .update({
            "/timer/": tickCounter,
            "/senha/": _senha,
        })
        .then(function () {
            return { success: true, message: "Porta updated" };
        })
        .catch(function () {
            return { success: false, message: "Updated failed" };
        });
}
tickCounter = 30;
firebase
    .database()
    .ref()
    .child("portas")
    .get()
    .then((snapshot) => {
        porta_id = Object.entries(snapshot.val())[0][0];
        updateLoop = setInterval(substituir, 1000);
    });
