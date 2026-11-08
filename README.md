# PS5 Remote: wake your PS5 from your phone

A simple web app to **turn on your PlayStation 5 from an iPhone, an Android phone, or any browser** on your home network. It has a big power button, shows whether the console is on or in rest mode, counts how long it has been on, and includes a "play next" list.

It works with a tiny Node.js server that runs on your Mac, PC or Linux machine. Your phone opens a page served by that server, and the server uses [playactor](https://github.com/dhleong/playactor) to wake the console.

> Guía en español: [README.es.md](README.es.md)

---

## Contents

1. [What it does and what it does not do](#1-what-it-does-and-what-it-does-not-do)
2. [How it works](#2-how-it-works)
3. [What you need](#3-what-you-need)
4. [Step 1: set up the PS5](#step-1-set-up-the-ps5)
5. [Step 2: install Node.js](#step-2-install-nodejs)
6. [Step 3: install playactor](#step-3-install-playactor)
7. [Step 4: download this project](#step-4-download-this-project)
8. [Step 5: register your PS5 (login)](#step-5-register-your-ps5-login)
9. [Step 6: test waking the PS5 from the terminal](#step-6-test-waking-the-ps5-from-the-terminal)
10. [Step 7: start the server](#step-7-start-the-server)
11. [Step 8: open the app on your phone](#step-8-open-the-app-on-your-phone)
12. [Daily use](#daily-use)
13. [Troubleshooting](#troubleshooting)
14. [Known limitations](#known-limitations)
15. [Security and privacy](#security-and-privacy)
16. [Technical reference](#technical-reference)
17. [License](#license)

---

## 1. What it does and what it does not do

| Feature | Status |
| --- | --- |
| Wake the PS5 from rest mode (big power button) | Works |
| Show the status: on, rest mode or not responding | Works |
| Counter of how long the console has been on | Works |
| "Play next" list (saved in your phone's browser) | Works |
| "Put in rest mode" button | **May not work** on your console |
| Sleep timer | **May not work** on your console |
| Launch a specific game from the app | **Not included** (see [known limitations](#known-limitations)) |

The rest-mode button and the sleep timer depend on your PS5 accepting the `playactor standby` command. Some consoles do not accept it. [Known limitations](#known-limitations) explains how to check before you rely on them.

## 2. How it works

```
Phone  --(Wi-Fi, web page)-->  Node server (your Mac/PC)  --(playactor)-->  PS5
```

1. `server.js` runs on your computer. It serves `index.html` and a few API routes.
2. When you tap the button, the page asks the server to wake the console.
3. The server runs `playactor wake` and the PS5 turns on.
4. Every few seconds the page asks for the status, so it can show whether the console is on or in rest mode.

That is why **your computer has to be on, with the server running**, every time you want to use the app.

## 3. What you need

- A **PS5** connected to your network (wired or Wi-Fi).
- A **computer** (macOS, Windows or Linux) on the same network as the PS5, which stays on while you use the app.
- A **phone** or any device with a browser, on the same Wi-Fi network.
- A **PlayStation Network account** (the same one you use on the PS5).
- About 20 minutes the first time.

---

## Step 1: set up the PS5

These settings let the console listen for commands over the network while it is in rest mode. Do them on the PS5 with the controller.

1. Open **Settings** (the gear at the top right of the home screen).
2. Go to **System > Power Saving > Features Available in Rest Mode**.
3. Turn on both options:
   - **Stay Connected to the Internet**
   - **Enable Turning On PS5 from Network**
4. Go back to Settings and open **System > Remote Play**. Turn on **Enable Remote Play**.
5. Write down your PS5's **IP address**: **Settings > Network > View Connection Status**. It looks like `192.168.1.50`. You will need it later.

**Recommended:** in your router, reserve that IP address for the PS5 (this is sometimes called "DHCP reservation" or "static IP"). That way it never changes and you will not have to update it.

## Step 2: install Node.js

1. Go to [nodejs.org](https://nodejs.org) and download the **LTS** version.
2. Open the installer and follow the steps.
3. **Close the terminal completely and open it again.**
4. Check that it installed:

   ```
   node -v
   ```

   It should print a version number, for example `v22.11.0`. If it says `command not found`, repeat step 3.

> **How to open a terminal:** on a Mac, press `Cmd + Space`, type "Terminal" and press Enter. On Windows, search for "PowerShell" in the Start menu. On Linux, use your usual terminal.

## Step 3: install playactor

[playactor](https://github.com/dhleong/playactor) is the tool that talks to the PS5.

```
npm install -g playactor
```

- It takes a minute and prints a lot of text. That is normal.
- If you get a permissions error (`EACCES`), on Mac and Linux run the same command with `sudo` in front and type your password. It is not shown while you type.

Check that it works:

```
playactor --help
```

It should list the commands, including `login`, `check`, `wake` and `standby`.

## Step 4: download this project

**Option A, with git:**

```
git clone https://github.com/hvgfbv/PS5-remote.git
cd PS5-remote
```

**Option B, without git:** on this GitHub page click the green **Code** button, then **Download ZIP**. Unzip the folder and enter it from the terminal:

```
cd path/to/the/folder/PS5-remote
```

Inside the folder you should see `index.html` and `server.js`. Check with `ls` (Mac and Linux) or `dir` (Windows).

## Step 5: register your PS5 (login)

You only do this **once**. It gives playactor permission to talk to your console.

1. **Turn on the PS5** and leave it on the home screen. It must be on the same network as your computer.
2. In the terminal run:

   ```
   playactor login
   ```

3. You will see a message ending in `Hit ENTER to continue`. **Press Enter once.**
4. Your browser opens the PlayStation sign-in page. Sign in with your account.
5. When the page shows the word **"redirect"**, copy the full address from the browser's address bar.
6. Go back to the terminal. **Make sure the cursor is blinking and waiting, with no prompt line ending in `%` or `$`.** Paste the address and press Enter.
7. The terminal shows `Enter PIN here>`. On the PS5 go to **Settings > System > Remote Play > Link Device**. An 8-digit code appears. Type it in the terminal and press Enter.
8. The PS5 shows a "Remote Play connected" notice and then disconnects by itself. That is normal: it means the registration was saved.

> **Important:** that address starting with `https://remoteplay...` contains a code tied to your PlayStation account. **Do not post or share it** (not in GitHub issues, not in chats). It works only once and expires, but it is better not to expose it.

### If the login exits by itself

With very new versions of Node (for example v26), `playactor login` may print `Hit ENTER to continue`, return to the prompt without waiting for anything, and then everything you paste is run as a command. The fix is to run the login with Node 22 just for this step:

```
npx -y node@22 "$(which playactor)" login
```

If `npx` fails with a permissions error on the `~/.npm` folder, it is usually because you installed something with `sudo` earlier. Give yourself ownership back with:

```
sudo chown -R $(id -u):$(id -g) ~/.npm
```

and run the login command again.

## Step 6: test waking the PS5 from the terminal

Before using the app, check that waking works on its own. That way, if something fails, you know the app is not the problem.

1. **Put the PS5 in rest mode** with the controller: hold the PS button, choose **Power**, then **Enter Rest Mode**. The light should turn **orange**. If it is completely off, the console is not in rest mode.
2. Wait about 15 seconds and check that playactor can see it (use your own IP):

   ```
   playactor check --ip 192.168.1.50
   ```

   It should show `"status": "STANDBY"`. If it says `Unable to locate device`, check the settings in [step 1](#step-1-set-up-the-ps5) and that the light is orange.
3. Wake it:

   ```
   playactor wake --ip 192.168.1.50
   ```

   The PS5 should turn on within a few seconds. If it does, the hard part is done.

## Step 7: start the server

In the project folder, run this (with **your** PS5's IP):

**Mac and Linux:**

```
PS5_IP=192.168.1.50 node server.js
```

**Windows (PowerShell):**

```
$env:PS5_IP="192.168.1.50"; node server.js
```

You should see:

```
PS5 Remote ready at http://localhost:3000
```

**Leave that terminal open.** If you close it, the server stops.

First test on the computer itself: open `http://localhost:3000` in a browser. You should see the remote. With the PS5 in rest mode the status should say "Rest mode" (it can take up to 20 seconds to update). Press the big button and check that the console turns on.

> **Important:** always pass `PS5_IP` with the console's IP. With the PS5 in rest mode, playactor sometimes cannot find it if you do not give it the IP.

## Step 8: open the app on your phone

1. Find your **computer's** IP (not the PS5's):
   - **Mac:** `ipconfig getifaddr en0` (if nothing is printed, try `en1`).
   - **Linux:** `hostname -I`.
   - **Windows:** `ipconfig` and look for "IPv4 Address".

   It looks like `192.168.1.23`.
2. Connect your phone to the **same Wi-Fi network** as the computer.
3. Open the phone's browser (Safari on iPhone, Chrome on Android) and type:

   ```
   http://192.168.1.23:3000
   ```

   (with your computer's IP). The remote should appear.
4. **To keep it as an app on iPhone:** tap the Share button (the square with an arrow pointing up), choose **Add to Home Screen** and tap **Add**. Open it from the new icon and it runs full screen.
   **On Android:** Chrome menu (three dots) > **Add to Home screen**.

---

## Daily use

1. On the computer, open a terminal, go to the project folder and start the server ([step 7](#step-7-start-the-server)).
2. Keep the computer from going to sleep. On a Mac, open another terminal tab and run `caffeinate -s`.
3. Open the app on your phone and tap the big button.

To stop the server: in the terminal where it runs, press `Ctrl + C`.

**Statuses the app shows:**

| Text | Meaning |
| --- | --- |
| On | The console is awake. The button does nothing, on purpose. |
| Rest mode | The console is asleep and can be turned on. |
| Not responding | The server cannot find the console, or the server is closed. |
| Status unknown | Still looking. Wait a few seconds. |

## Troubleshooting

| Problem | Likely cause | What to do |
| --- | --- | --- |
| `node: command not found` | Node is not installed, or the terminal was opened before installing | Install Node and open a new terminal |
| `playactor: command not found` | playactor is not installed | Repeat [step 3](#step-3-install-playactor) |
| `Unable to locate device` | The PS5 is fully off, on a different network, or the rest-mode settings are missing | Check that the light is orange and the settings in [step 1](#step-1-set-up-the-ps5). Use `--ip` |
| `EADDRINUSE ... port 3000` | Another server is already open in another terminal | Close it with `Ctrl + C`, or free the port: `lsof -ti :3000 \| xargs kill` (Mac/Linux) |
| Server exits with `ENOENT ... index.html` | `index.html` is missing from the folder | Run the server from the project folder and check both files are there |
| The phone cannot open the page | Different network, firewall or wrong IP | Same Wi-Fi, the computer's IP (not the PS5's), port `3000`, and a firewall that allows Node |
| The button shows "Could not turn it on" | playactor is not registered, or the IP is wrong | Repeat [step 5](#step-5-register-your-ps5-login) and [step 6](#step-6-test-waking-the-ps5-from-the-terminal) |
| `playactor login` exits without waiting | Node version is too new | Run the login with Node 22 (see [above](#if-the-login-exits-by-itself)) |
| `zsh: no matches found: https://...` | You pasted the address when the terminal was not waiting for input | Repeat the login and paste only when the cursor is waiting with no `%` prompt |
| `zsh: parse error` or `bquote>` | Leftover pasted text on the command line | Press `Ctrl + C` or open a new terminal tab |

If nothing works, open an [issue](../../issues) with the error message. **Before pasting anything, remove your username, your IP address, your console's name and any `https://remoteplay...` address.**

## Known limitations

- **Rest mode and launching games may not work.** On the console this project was tested on (a PS5 on system version `14220000`), playactor connected and disconnected without running `standby` or `start-id`, even though registration was fine. Waking did work, because it uses a simpler method (a network wake-up message), while rest mode and launching games need a full Remote Play session. To find out whether your console accepts it, with the PS5 on, try: `playactor standby --ip 192.168.1.50`. If the light turns orange, the app's rest-mode button and sleep timer will work.
- **Launching a game from the app is not included.** playactor's documentation lists starting apps and games as supported on PS4 only, not PS5.
- **The game list is manual.** The PS5 does not give playactor the list of your installed games. The "play next" list is saved only in each device's browser.
- The server has to be running on a computer that is on, on your network.
- This project depends on playactor, which is not an official Sony tool and may stop working if Sony changes the system.

**Alternatives for putting the PS5 in rest mode:** with the controller (PS button, Power, Enter Rest Mode), with the official **PlayStation** app and Remote Play on your phone, or with the console's own setting at Settings > System > Power Saving > Set Time Until PS5 Enters Rest Mode.

## Security and privacy

- **The server has no password.** Anyone on your network who knows the address can turn on your console. Use it only on your home network and **do not expose it to the internet** (no port forwarding, no public tunnels).
- playactor's credentials are stored on your computer (the `~/.config/playactor` folder). **Never commit them to a repository.**
- This project sends no data to any external server. The "play next" list is stored in your browser's local storage.
- The `ps5-data.json` file (the time counter) is created next to `server.js` and is listed in `.gitignore`.

## Technical reference

**Files:**

- `server.js`: dependency-free HTTP server that runs `playactor`.
- `index.html`: the interface (HTML, CSS and JavaScript in a single file).
- `ps5-data.json`: created automatically; stores how many seconds the console has been on.

**Environment variables:**

| Variable | Default | Purpose |
| --- | --- | --- |
| `PS5_IP` | (empty) | The PS5's IP address. Strongly recommended. |
| `PORT` | `3000` | Server port |

**API routes:**

| Route | Method | What it does |
| --- | --- | --- |
| `/api/status` | GET | Returns the status, seconds on and the end time of the sleep timer |
| `/api/wake` | POST | Runs `playactor wake` |
| `/api/standby` | POST | Runs `playactor standby` |
| `/api/sleep-timer` | POST | Schedules rest mode. Body: `{"minutes": 60}`. Use `0` to cancel |

The status is computed with `playactor check` every 20 seconds.

## Contributing

Changes are welcome. If you find that `standby` works on another PS5 system version, or you get game launching working, tell us in an issue or open a pull request.

## License

[MIT](LICENSE). This project is not affiliated with Sony Interactive Entertainment. Use it at your own risk.
