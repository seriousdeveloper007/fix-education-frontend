import React from 'react'

const Login = () => {

    const BACKEND_URL = 'http://localhost:8000'; // Update if deployed


    function getUserProfile(token) {
        return fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(userInfo => {
                return userInfo;
            })
            .catch(err => {
                throw err;
            });
    }


    async function registerLoginAPI(googleToken) {
        try {
            const response = await fetch(`${BACKEND_URL}/user/auth/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token: googleToken })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || "Login failed");
            }

            const data = await response.json();
            const { user, token } = data;

            // Filter out null/undefined fields
            const filteredUser = {};
            if (user.id) filteredUser.id = user.id;
            if (user.email) filteredUser.email = user.email;
            if (user.name) filteredUser.name = user.name;
            if (user.profile_picture) filteredUser.profile_picture = user.profile_picture;

            // Save to local storage
            chrome.storage.local.set({ user: filteredUser, token }, () => {
            });

            return { success: true, user: filteredUser, token };
        } catch (error) {
            return { success: false, error: error.message || "Unexpected error" };
        }
    }


    async function loginWithGoogle() {
        return new Promise((resolve, reject) => {
            chrome.identity.getAuthToken({ interactive: true }, async function (token) {
                if (chrome.runtime.lastError || !token) {
                    return reject(chrome.runtime.lastError?.message || "Token fetch failed");
                }

                try {
                    await getUserProfile(token);
                    const result = await registerLoginAPI(token);
                    resolve(result);
                } catch (err) {
                    reject(err.message || "Login failed");
                }
            });
        });
    }



    function logoutFromGoogle() {
        chrome.identity.getAuthToken({ interactive: false }, function (token) {
            if (chrome.runtime.lastError || !token) {
                console.warn("⚠️ No token found to remove:", chrome.runtime.lastError?.message || "No token");
                return;
            }

            chrome.identity.removeCachedAuthToken({ token }, function () {
                chrome.storage.local.remove(['user', 'token']);
            });
        });
    }














    return (
        <>
            Login

            <button className='bg-blue-500 text-white px-4 py-2 rounded-md' onClick={loginWithGoogle}>Login</button>
        </>
    )
}

export default Login