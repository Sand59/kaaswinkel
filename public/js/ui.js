import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js"
import { getDatabase, get, child, ref} from "https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js"
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCWMR40Kj4zcfTmlC7z_ma-udXQ4YNrrOQ",
    authDomain: "kaas-winkel.firebaseapp.com",
    databaseURL: "https://kaas-winkel-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "kaas-winkel",
    storageBucket: "kaas-winkel.appspot.com",
    messagingSenderId: "50738767363",
    appId: "1:50738767363:web:1db90a087d794320b35036"
};

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const auth = getAuth();
const dbRef = ref(getDatabase());

// get producten
const producten = document.querySelector('.producten');

const date = new Date();
let month = date.getMonth() + 1;

get(child(dbRef, 'product/')).then((snapshot) => {
    if (snapshot.exists()) {
        snapshot.forEach(function(product){
            if(product.val().kortingsmaand === month) {
                var featured = 'featured'
                var korting = `<p>${product.val().kortings_prijs}</p>`
            } else {
                var featured = ''
                var korting = ''
            }
           
            // producten loop
            const html = 
            `<div class="col ${featured}">
                <div class="media-2">
                    <img src="images/${product.val().afbeelding_url}" alt="">
                </div>
                <div class="col-title">
                    <h3>${product.val().naam}</h3>
                    <div class="prijs">
                        ${korting}
                        <p>${product.val().prijs}</p>
                        <div class="icon-1">
                            <img src="images/punten.png" alt="">
                            <p>+${product.val().spaarpunt}</p>
                        </div>
                    </div>
                </div>
            </div>`
            producten.innerHTML += html
        })
    } 
    else {
        console.log("No data available")
    }
}).catch((error) => {
    console.error(error)
});


// punten
const punten = document.getElementById('punten')
const button = document.getElementById('login')

onAuthStateChanged(auth, (user) => {
    // check login
    if (user) {
        const uid = user.uid;
        const dbRef = ref(getDatabase());
        
        // user toevoegen database
        get(child(dbRef, 'users/' + uid)).then((snapshot) => {
            if (snapshot.exists()) {
                punten.innerHTML = snapshot.val().punten
                
                // button change
                button.innerHTML = 'uitloggen'
                button.addEventListener('click', function(){
                    signOut(auth)
                    console.log('Signed out')
                })

            } 
            else {
                console.log("No data available")
            }
        }).catch((error) => {
            console.error(error)
            button.innerHTML = 'login'
        });
    } 
    
    else {
        console.log('user signed out')
    }
});
