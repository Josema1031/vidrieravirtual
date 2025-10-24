// 🚀 Inicializar Firebase (solo una vez)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyA36uwBk0FBDc6rI16BAsqUNe_AXLpv62Q",
  authDomain: "carniceriadonjose-48638.firebaseapp.com",
  projectId: "carniceriadonjose-48638",
  storageBucket: "carniceriadonjose-48638.appspot.com",
  messagingSenderId: "322531750471",
  appId: "1:322531750471:web:78e290c9c81eecc7be3762"
};

// Inicialización de Firebase y Firestore
const app = initializeApp(firebaseConfig);

// 👁️ Mostrar / Ocultar contraseña
function togglePassword() {
  const input = document.getElementById("password");
  input.type = input.type === "password" ? "text" : "password";
}

// 🔑 Registrar nuevo usuario
async function registrarUsuario() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("mensaje-error");

  if (!email || !password) {
    errorMsg.textContent = "Por favor completá correo y contraseña.";
    return;
  }

  try {
    const { getAuth, createUserWithEmailAndPassword } = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js");
    const auth = getAuth(app);

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const { getFirestore, doc, setDoc } = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js");
    const db = getFirestore(app);
    const tiendaId = localStorage.getItem("tiendaId") || "MATES-GUAY";

    await setDoc(doc(db, "tiendas", tiendaId, "usuarios", user.uid), {
      email: email,
      creado: new Date().toISOString()
    });

    alert("✅ Cuenta creada correctamente. Ya podés ingresar con tu contraseña.");
    errorMsg.textContent = "";
  } catch (error) {
    console.error(error);
    if (error.code === "auth/email-already-in-use") {
      errorMsg.textContent = "⚠️ Este correo ya está registrado. Iniciá sesión.";
    } else if (error.code === "auth/weak-password") {
      errorMsg.textContent = "⚠️ La contraseña debe tener al menos 6 caracteres.";
    } else if (error.code === "auth/invalid-api-key") {
      errorMsg.textContent = "⚠️ Verificá la clave API o los dominios autorizados en Firebase.";
    } else {
      errorMsg.textContent = "❌ Error al crear la cuenta.";
    }
  }
}

// ✉️ Recuperar contraseña con pantalla profesional
async function recuperarContrasena() {
  const email = document.getElementById("email").value.trim();
  const errorMsg = document.getElementById("mensaje-error");
  const exitoMsg = document.getElementById("mensaje-exito");

  // Limpiar mensajes previos
  errorMsg.textContent = "";
  exitoMsg.style.display = "none";

  if (!email) {
    errorMsg.textContent = "Por favor ingresá tu correo electrónico.";
    return;
  }

  try {
    const { getAuth, sendPasswordResetEmail } = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js");
    const auth = getAuth();

    await sendPasswordResetEmail(auth, email);

    // Mostrar mensaje de éxito con animación
    exitoMsg.innerHTML = `✅ Se envió un correo de recuperación a <strong>${email}</strong>. 
                          <br>Revisá tu bandeja de entrada o la carpeta de spam.`;
    exitoMsg.style.display = "block";
    exitoMsg.style.opacity = 0;
    exitoMsg.style.transition = "opacity 0.5s ease";
    setTimeout(() => (exitoMsg.style.opacity = 1), 50);

  } catch (error) {
    console.error(error);
    if (error.code === "auth/user-not-found") {
      errorMsg.textContent = "⚠️ No existe una cuenta con ese correo.";
    } else if (error.code === "auth/invalid-email") {
      errorMsg.textContent = "⚠️ El correo ingresado no es válido.";
    } else if (error.code === "auth/missing-email") {
      errorMsg.textContent = "⚠️ Ingresá tu correo electrónico.";
    } else {
      errorMsg.textContent = "❌ Error al enviar el correo de recuperación.";
    }
  }
}



// 👉 Exponer funciones al ámbito global (para usarlas desde el HTML)
window.togglePassword = togglePassword;
window.registrarUsuario = registrarUsuario;
window.recuperarContrasena = recuperarContrasena;


