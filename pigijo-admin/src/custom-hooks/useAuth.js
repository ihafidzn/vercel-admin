// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const useAuth = () => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCurrentUser = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         console.log("Token:", token);
//         if (!token) {
//           setCurrentUser(null);
//           navigate("/login");
//           return;
//         }
//         const response = await axios.get("/api/auth/current-user", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log("Response status:", response.status);
//         setCurrentUser(response.data);
//         console.log("User set:", response.data);

//         if (response.data) {
//           // Pastikan bahwa navigasi ke halaman beranda dilakukan di sini
//           console.log("Navigating to /home");
//           navigate("/home");
//         }
//       } catch (error) {
//         console.error("Error fetching current user:", error);
//         setCurrentUser(null);
//       }
//     };

//     fetchCurrentUser();
//   }, [navigate]);

//   const login = async (email, password) => {
//     try {
//       const response = await axios.post("/api/auth/login", {
//         email,
//         password,
//       });
//       console.log("Login response:", response);

//       const token = response.data.token;
//       localStorage.setItem("token", token);
//       console.log("Token saved successfully:", token);
//       fetchCurrentUser();
//     } catch (error) {
//       console.error("Error logging in:", error);
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setCurrentUser(null);
//     navigate("/login");
//   };

//   return {
//     currentUser,
//     login,
//     logout,
//   };
// };

// export default useAuth;
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get("/api/auth/registers");
        setCurrentUser(response.data);

        // console.log(response.data);

        // if (!response.data) {
        //   // Jika user belum login, simpan path saat ini di local storage
        //   localStorage.setItem("redirectPath", window.location.pathname);
        //   // Arahkan ke halaman login
        //   navigate("/login");
        // }
      } catch (error) {
        console.error("Error fetching current user:", error);
        setCurrentUser(null);
      }
    };

    fetchCurrentUser();
  }, [navigate]); // useEffect dijalankan hanya saat komponen di-mount

  const login = async (username, password) => {
    try {
      const response = await axios.post("/api/auth/registers", {
        username,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);

      fetchCurrentUser();
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setCurrentUser(null);
    navigate("/login"); // Tambahkan ini saat user logout
  };

  return {
    currentUser,
    login,
    logout,
  };
};

export default useAuth;
