export default class AuthFetch {
    constructor (config) {
        this.config = config;

        this.listeners = [];

        const savedToken = localStorage.getItem(config.tokenKey);
        try {
            this.token = JSON.parse(savedToken);

            const refresh_time = this.token.expires_on - this.token.expires_in / 2;
            if (Date.now() / 1000 > refresh_time) {
                this.refreshToken();
            }
        } catch (e) {}
    }

    hasToken() {
      return !!this.token;
    }

    async fetch (url, headers = new Headers()) {
        if (!this.token) {
            throw Error("No token");
        }

        headers.set("Authorization", "Bearer " + this.token.access_token);

        const r = await fetch(url, {
            headers
        });

        if (r.ok) {
            return r.json();
        } else if (r.status === 401) {
            await this.refreshToken();

            // Try again
            return this.fetch(url, headers);
        } else {
            throw Error(r.statusText);
        }
    }

    async getToken (user, pass) {
        const headers = new Headers();

        headers.append("Authorization", "Basic " + btoa(user + ":" + pass));

        const r = await fetch(this.config.tokenURL, {
            headers
        });

        if (r.ok) {
            setToken(this, await r.text());
        } else if (r.status === 401) {
            clearToken(this);
            throw Error("User/Pass Error");
        } else {
            throw Error(r.statusText);
        }
    }

    async refreshToken () {
        const headers = new Headers();
        headers.append("Authorization", "Bearer " + this.token.refresh_token);

        const r = await fetch(this.config.refreshURL, {
            headers
        });

        if (r.ok) {
            setToken(this, await r.text());
        } else if (r.status === 401) {
            clearToken(this);
            throw Error("Invalid Refresh Token");
        } else {
            throw Error(r.statusText);
        }
    }

    async invalidate() {
        const headers = new Headers();
        headers.append("Authorization", "Bearer " + this.token.access_token);

        const r = await fetch(this.config.invalidateURL + "?token=" + this.token.access_token, {
            headers
        });

        if (r.ok) {
            clearToken(this);
        } else {
            throw Error(r.statusText);
        }
    }

    subscribe (cb) {
        this.listeners.push(cb);
    }

    unsubscribe (cb) {
        this.listeners.splice(this.listeners.indexOf(cb), 1);
    }
}

function setToken (self, token) {
    try {
        self.token = JSON.parse(token);
        localStorage.setItem(self.config.tokenKey, token);
        notify(self.listeners, token);
    } catch (e) {
        clearToken(self);
    }
}

function clearToken (self) {
    self.token = null;
    localStorage.removeItem(self.config.tokenKey);
    notify(self.listeners, null);
}

function notify (listeners, event) {
    for (const cb of listeners) {
        cb(event);
    }
}