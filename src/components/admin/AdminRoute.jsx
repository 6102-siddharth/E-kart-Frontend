// // src/AdminRoute.js
// import React, { useState, useEffect } from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { auth, db } from '../../firebaseConfig'; // Adjust path
// import { doc, getDoc } from 'firebase/firestore';

// const AdminRoute = () => {
//     const [isAdmin, setIsAdmin] = useState(null); // null: loading, true: admin, false: not admin/not logged in
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const unsubscribe = auth.onAuthStateChanged(async (user) => {
//             if (user) {
//                 try {
//                     // Option 1: Check custom claims (more secure, set via backend/Firebase functions)
//                     // const idTokenResult = await user.getIdTokenResult();
//                     // setIsAdmin(!!idTokenResult.claims.admin);

//                     // Option 2: Check Firestore document (simpler for this example)
//                     const userDocRef = doc(db, "users", user.uid);
//                     const userDocSnap = await getDoc(userDocRef);
//                     if (userDocSnap.exists() && userDocSnap.data().isAdmin === true) {
//                         setIsAdmin(true);
//                     } else {
//                         setIsAdmin(false); // User exists but not admin
//                     }
//                 } catch (error) {
//                     console.error("Error checking admin status:", error);
//                     setIsAdmin(false);
//                 }
//             } else {
//                 setIsAdmin(false); // Not logged in
//             }
//             setLoading(false);
//         });

//         return () => unsubscribe();
//     }, []);

//     if (loading) {
//         return <div className="flex justify-center items-center h-screen">Loading Admin Access...</div>; // Or a proper spinner
//     }

//     return isAdmin ? <Outlet /> : <Navigate to="/login" replace />; // Or to a "/unauthorized" page
// };

// export default AdminRoute;


// src/AdminRoute.js
import React, { useState, useEffect, createContext, useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

// Create a context to provide auth status and token to child admin components
const AdminAuthContext = createContext({
    currentUser: null,
    authToken: null,
})
export const useAdminAuth = () => useContext(AdminAuthContext);
// src/AdminRoute.js
// ... (imports and context creation as above) ...

const AdminRoute = () => {
    const [isAdmin, setIsAdmin] = useState(null); // null (loading), true, false
    const [loading, setLoading] = useState(true);
    const [authToken, setAuthToken] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setCurrentUser(user);
                try {
                    const token = await user.getIdToken(true);
                    setAuthToken(token); // Set token first

                    const userDocRef = doc(db, "users", user.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists() && userDocSnap.data().isAdmin === true) {
                        setIsAdmin(true);
                    } else {
                        setIsAdmin(false); // User exists but not admin, or doc doesn't exist
                    }
                } catch (error) {
                    console.error("Error in AdminRoute auth check:", error);
                    setIsAdmin(false); // Assume not admin on error
                    setAuthToken(null); // Clear token on error during its acquisition
                }
            } else { // No user logged in
                setCurrentUser(null);
                setAuthToken(null);
                setIsAdmin(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading Admin Access...</div>;
    }

    // If not loading, and user is not admin, or authToken is missing, redirect.
    // This check is crucial.
    if (!isAdmin || !authToken) {
        console.log(`AdminRoute: Redirecting. isAdmin: ${isAdmin}, authToken: ${authToken ? 'present' : 'missing'}`);
        return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
    }

    // Only if loading is false, isAdmin is true, AND authToken is present, render Outlet with Provider
    console.log("AdminRoute: Rendering Outlet with Auth Context.");
    return (
        <AdminAuthContext.Provider value={{ currentUser, authToken }}>
            <Outlet />
        </AdminAuthContext.Provider>
    );
};

export default AdminRoute;