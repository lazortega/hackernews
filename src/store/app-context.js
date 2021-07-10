import React, {useEffect, useState} from "react";

const AppContext = React.createContext({
    isLoggedIn: false,
    onLogout: () => {},
    onLogin: (email, password) => {}
});

export function AuthContextProvider(props) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const storedUserLoggedInInformation = localStorage.getItem("isLoggedIn");

        if (storedUserLoggedInInformation === "1") {
            setIsLoggedIn(true);
        }
    }, []);

    function logoutHandler() {
        localStorage.removeItem("isLoggedIn");
        setIsLoggedIn(false);
    }

    function loginHandler() {
        localStorage.setItem("isLoggedIn", "1");
        setIsLoggedIn(true);
    }

    return (
        <AppContext.Provider
            value={{
                isLoggedIn: isLoggedIn,
                onLogout: logoutHandler,
                onLogin: loginHandler,
            }}
        >
            {props.children}
        </AppContext.Provider>
    );
}

export default AppContext;
