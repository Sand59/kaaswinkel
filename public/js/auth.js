import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js"
import { getDatabase, get, set, child, ref} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js"
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCWMR40Kj4zcfTmlC7z_ma-udXQ4YNrrOQ",
    authDomain: "kaas-winkel.firebaseapp.com",
    projectId: "kaas-winkel",
    databaseURL: "https://kaas-winkel-default-rtdb.europe-west1.firebasedatabase.app",
    storageBucket: "kaas-winkel.appspot.com",
    messagingSenderId: "50738767363",
    appId: "1:50738767363:web:1db90a087d794320b35036"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth()
const database = getDatabase(app)

// elements
const login = document.getElementById('login')
const register = document.getElementById('register')

// register 
register.addEventListener('click', function() {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const error = document.querySelectorAll('.form-items')

    // create user
    createUserWithEmailAndPassword(auth, email, password)
    .then(function() {
        var user = auth.currentUser

        set(ref(database, 'users/' + user.uid), {
            email: email,
            punten: '0',
            last_login: Date.now()
        });
        
        alert('Account created')
    }) 
    .catch(function() {
        // error handling
        for (const error_item of error) {
            error_item.classList.add('error')
        }
        alert('Wachtwoord tekort of onjuiste email')
    })
})

// login
login.addEventListener('click', function() {
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const error = document.querySelectorAll('.form-items')

    // sign in
    signInWithEmailAndPassword(auth, email, password)
    .then(function() {
        window.location.href = 'index.html'
    })
    .catch(function() {
        // error handling
        for (const error_item of error) {
            error_item.classList.add('error')
        }
        alert('Onjuiste inlognaam of wachtwoord')
    })
})
