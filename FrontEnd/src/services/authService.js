import { useSelector } from "react-redux";

function getUserData() {
  const user = useSelector((state) => state.currentUser);

  if (!user) {
    // 🔥 Fallback to localStorage if Redux state is empty
    const storedUser = localStorage.getItem("userDetails");
    console.log("getUserData called - Redux empty, using localStorage:", storedUser);
    return storedUser ? JSON.parse(storedUser) : null;
  }

  console.log("getUserData called - Redux user:", user);
  return user;
}

function getLoggedIn() {
  const loggedIn = useSelector((state) => state.loggedIn);

  if (loggedIn === undefined) {
    // 🔥 Fallback to localStorage if Redux state is empty
    const token = localStorage.getItem("authToken");
    console.log("getLoggedIn called - Redux empty, checking localStorage:", token);
    return !!token; // Return `true` if token exists
  }

  console.log("getLoggedIn called - Redux loggedIn:", loggedIn);
  return loggedIn;
}


export { getUserData, getLoggedIn };
