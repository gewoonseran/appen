// Import Firebase-modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Firebase-configuratie
const firebaseConfig = {
  apiKey: "AIzaSyCk8GqEbhJ82udp-wt4guwdwy-adP8xWcc",
  authDomain: "chatten-b4320.firebaseapp.com",
  databaseURL: "https://chatten-b4320-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "chatten-b4320",
  storageBucket: "chatten-b4320.firebasestorage.app",
  messagingSenderId: "1023014427499",
  appId: "1:1023014427499:web:ffc0aa9e2eda0a7ad6ca2e",
  measurementId: "G-09QQ7WF0XD"
};

// Initialiseer Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Referentie naar berichten in de Realtime Database
const messagesRef = ref(database, 'messages');

// Variabele voor de gebruikersnaam
let username = "";

// Voeg een eventlistener toe voor de gebruikersnaam
document.getElementById("set-username").addEventListener("click", function() {
  const usernameInput = document.getElementById("username-input");
  username = usernameInput.value.trim();

  if (username) {
    // Verberg het gebruikersnaamformulier en toon het chatformulier
    document.getElementById("username-container").style.display = "none";
    document.getElementById("chat-form").style.display = "block";
    document.getElementById("messages").style.display = "block";
  } else {
    alert("Voer een geldige gebruikersnaam in.");
  }
});

// Haal berichten op in real-time en voeg ze toe aan de lijst
onChildAdded(messagesRef, function(snapshot) {
  const messageData = snapshot.val();
  const li = document.createElement("li");
  li.textContent = `${messageData.username}: ${messageData.message}`;
  document.getElementById("messages").appendChild(li);

  // Scroll naar beneden als een nieuw bericht wordt toegevoegd
  const messagesList = document.getElementById("messages");
  messagesList.scrollTop = messagesList.scrollHeight;
});

// Verstuur een bericht
document.getElementById("chat-form").addEventListener("submit", function(event) {
  event.preventDefault();
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value.trim();

  if (message && username) {
    // Voeg het bericht samen met de gebruikersnaam toe aan de database
    const newMessageRef = push(messagesRef);  // Genereert automatisch een unieke ID
    set(newMessageRef, {
      username: username,  // Voeg de gebruikersnaam toe
      message: message,
      timestamp: Date.now()
    }).then(() => {
      messageInput.value = ""; // Maak het invoerveld leeg
    }).catch((error) => {
      console.error("Error bij het versturen van bericht:", error);
    });
  }
});
