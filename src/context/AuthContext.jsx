import {
  createContext,
  useContext,
  useState
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");

      return savedUser
        ? JSON.parse(savedUser)
        : null;

    } catch (error) {
      console.error(
        "Không thể đọc user:",
        error
      );

      return null;
    }
  });


  const login = (userData) => {

    setUser(userData);

    localStorage.setItem(
      "user",
      JSON.stringify(userData)
    );
  };


  const logout = () => {

    setUser(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {

  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth phải được sử dụng bên trong AuthProvider"
    );
  }

  return context;
}