import React, { useState, useEffect, useCallback } from "react";
import logo from "./logo.svg";
import "./App.css";
import { User } from "./messaging/User";
import { MessageType } from "./messaging/MessageTypes";
import { UserResponse } from "./messaging/UserResponse";

function App() {
  const [user, setUser] = useState<User>({
    name: "Click Fetch",
    date: new Date(),
  });
  const [signedIn, setSignedIn] = useState<boolean>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [error, setError] = useState<string>();

  const getMe = useCallback(() => {
    chrome.runtime.sendMessage(
      {
        message: MessageType.LookupUser,
      },
      (cb: UserResponse) => {
        console.log(cb);
        if (cb.success) {
          setUser(cb.user as User);
        } else {
          setSignedIn(false);
          setError(cb.errorMsg);
        }
      }
    );
  }, []);

  useEffect(() => {
    console.log("useEffect");
    setIsLoading(true);
    chrome.runtime.sendMessage(
      {
        message: MessageType.AttemptAuth,
      },
      (cb: boolean) => {
        console.log(`auth response ${cb}`);
        setSignedIn(cb);
        setIsLoading(false);
        if (cb) {
          getMe();
        }
      }
    );
  }, [getMe]);

  function signIn() {
    chrome.tabs.create({
      url: `${process.env.REACT_APP_AUTH_AUTHORITY}/Identity/Account/Login`,
      active: true,
    });
  }

  function signOut() {
    setIsLoading(true);
    chrome.runtime.sendMessage(
      {
        message: MessageType.SignOut,
      },
      (cb: boolean) => {
        console.log(`signout response ${cb}`);
        setSignedIn(false);
        setIsLoading(false);
      }
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        {isLoading && <img src={logo} className="App-logo" alt="logo" />}
        {!isLoading && !signedIn && (
          <button onClick={() => signIn()}>Sign In</button>
        )}
        {!isLoading && signedIn && (
          <>
            <h1>{user?.name}</h1>
            <button onClick={() => signOut()}>Sign Out</button>
          </>
        )}
        {!isLoading && error && <h2>{error}</h2>}
      </header>
    </div>
  );
}

export default App;
