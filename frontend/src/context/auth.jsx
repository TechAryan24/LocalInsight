import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const signUp = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setCurrentUser(userCredential.user); // <-- update context state
            console.log("Successfully created an account:", userCredential.user);
            return userCredential.user;
        } catch (error) {
            console.error("Error signing up:", error.message);
            throw error;
        }
    };


    const signIn = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setCurrentUser(userCredential.user); // <-- update context state
            return userCredential.user; // optionally return the user
        } catch (error) {
            console.error("Error signing in:", error.message);
            throw error; // important so your login form shows an error
        }
    };


    const logOut = async () => {
        try {
            await signOut(auth);
            console.log("User signed out successfully.");
        } catch (error) {
            console.error("Error signing out:", error.message);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = { currentUser, signUp, signIn, logOut };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// ✅ Correct way: define a custom hook
export const useAuth = () => {
    return useContext(AuthContext);
};
