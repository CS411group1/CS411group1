import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js";
        // TODO: Add SDKs for Firebase products that you want to use
        // https://firebase.google.com/docs/web/setup#available-libraries
      
        // Your web app's Firebase configuration
    const firebaseConfig = {
        apiKey: "AIzaSyDM6VcJ98dmXCkBZg3H14qL0IuaC1Qc4FQ",
        authDomain: "fly2gig-auth.firebaseapp.com",
        projectId: "fly2gig-auth",
        storageBucket: "fly2gig-auth.appspot.com",
        messagingSenderId: "884079248233",
        appId: "1:884079248233:web:d906d0200216fda60b73f8"
        };
      
        // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider(app);

    login.addEventListener('click', (e) => {
        signInWithRedirect(auth, provider);
        getRedirectResult(auth)
        .then((result) => {
                // This gives you a Google Access Token. You can use it to access Google APIs.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;

                // The signed-in user info.
            const user = result.user;
                // IdP data available using getAdditionalUserInfo(result)
                // ...
        }).catch((error) => {
                // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
                // The email of the user's account used.
            const email = error.customData.email;
                // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
        });
    })