import { MessageType } from "../messaging/MessageTypes";
import { User } from "../messaging/User";
import { UserResponse } from "../messaging/UserResponse";

export default function chromeListeners() {
  var user: User | null;
  chrome.runtime.onMessage.addListener(function (
    request,
    sender,
    sendResponse
  ) {
    try {
      switch (request.message) {
        case MessageType.LookupUser:
          if (user) {
            sendResponse({
              user: user,
              success: true,
              errorMsg: "",
            });
          }
          getUser().then((u) => sendResponse(u));
          break;
        case MessageType.AttemptAuth:
          attemptAuth().then((a) => sendResponse(a));
          break;
        case MessageType.SignOut:
          signOut().then((a) => sendResponse(a));
          break;
        default:
          return false;
      }

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  });

  function signOut(): Promise<boolean> {
    let re = fetch(`${process.env.REACT_APP_AUTH_AUTHORITY}/api/me/signout`, {
      mode: "cors",
      credentials: "include",
      redirect: "error",
      method: "POST",
    })
      .then((r) => {
        console.log(r);
        user = null;
        return true;
      })
      .catch((e) => {
        return false;
      });
    return re;
  }

  function getUser(): Promise<UserResponse> {
    let re = fetch(`${process.env.REACT_APP_AUTH_AUTHORITY}/api/me`, {
      mode: "cors",
      credentials: "include",
      redirect: "error",
    })
      .then((r) => {
        if (r.status === 200) {
          console.log("got user response");
          return r
            .json()
            .then((f: User) => {
              //happiest of all paths
              return {
                success: true,
                errorMsg: "",
                user: f,
              };
            })
            .catch((e) => {
              //json operation threw
              return {
                success: false,
                errorMsg: e.ToString(),
                user: null,
              };
            });
        } else {
          throw new Error(`Unexpected statuscode: ${r.status.toString()}`);
        }
      })
      .catch((e) => {
        return {
          success: false,
          errorMsg: e.toString(),
          user: null,
        };
      });

    return re;
  }

  async function attemptAuth(): Promise<boolean> {
    let response = fetch(`${process.env.REACT_APP_AUTH_AUTHORITY}/api/me`, {
      mode: "cors",
      credentials: "include",
      redirect: "error",
    })
      .then((r) => {
        if (r.ok) {
          console.log("response is good");
          return true;
        }
        return false;
      })
      .catch((e) => {
        throw e;
      });
    return response;
  }
}
chromeListeners();
