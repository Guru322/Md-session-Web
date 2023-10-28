//Created By Guru
//Don't edit these lines


const express = require('express');
const path = require('path');
const { toBuffer } = require('qrcode');
const axios = require('axios');
const fs = require('fs');
const pino = require('pino');
const fetch = require('node-fetch');
const { exec } = require('child_process');

const sessionFolder = './SESSION';
if (fs.existsSync(sessionFolder)) {
  try {
    fs.rmdirSync(sessionFolder, { recursive: true });
    console.log('Deleted the "SESSION" folder.');
  } catch (err) {
    console.error('Error deleting the "SESSION" folder:', err);
  }
}

let app = (global.app = express());
const router = express.Router();

const PORT = 3000;

const makeWASocket = require('@whiskeysockets/baileys').default;


const {
  delay,
  useMultiFileAuthState,
  makeInMemoryStore,
} = require('@whiskeysockets/baileys');

app.use(
  '/',
  router.get('/', (req, res) => {



    async function Guru() {
      const { state, saveCreds } = await useMultiFileAuthState('./SESSION');
    
      try {
        let conn = makeWASocket({
            printQRInTerminal: false,
            logger: pino({ level: 'fatal' }),
            auth: state,
            browser: [`GURU BHAY`, "Safari", "3.0"],
          });
    
          conn.ev.on('connection.update', async (s) => {
            console.log(s);
    
            if (s.qr !== undefined) {
              res.end(await toBuffer(s.qr));
            }
    
            const { connection, lastDisconnect } = s;
    
            if (connection === 'open') {
              let botsession = fs.readFileSync('./SESSION/creds.json');
   
              await delay(1000 * 10);
    
              await conn.sendMessage(conn.user.id, { document: botsession, mimetype: `application/json`, fileName: `creds.json` })
    
              await delay(500 * 10);
    
              let Lodushek = `Hi,You are successfully connected!\n\n here is your session file.\n\n Have fun and have a great day ahead! `;
    
              await conn.sendMessage(conn.user.id, {
                image: { url: 'https://cdn.jsdelivr.net/gh/Guru322/api@Guru/K.jpg' },
                caption: Lodushek,
              });
             
              process.send('reset');

            }
           
    
            if (connection === 'close' && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode != 401) {
              await Guru(); // Reconnect asynchronously
              
            
            }
          });
    
          conn.ev.on('creds.update', saveCreds);
    
          conn.ev.on('messages.upsert', () => {});
      } catch (error) {
        console.error(error);
      }
    }
    
    Guru();
  })
);

app.listen(PORT, () => console.log('App listened on port', PORT));
