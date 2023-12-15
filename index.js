const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');
const fs = require('fs');

app.set('view engine', 'ejs');


async function scrapeTelegramPage(link) {
  try {
    const response = await axios.get("https://telegram.me/" + link);
    const html = response.data;
    const $ = cheerio.load(html);

    const title = $('.tgme_page_title span').text() || null;
    const photoUrl = $('.tgme_page_photo img').attr('src') || null;
    const description = $('.tgme_page_description').text() || null;
    const extraInfo = $('.tgme_page_extra').text() || null;
    const username = "@" + link || null;
    const url = "https://t.me/" + link || null;
    const membersData = extraInfo.match(/(\d+) members, (\d+) online/);
    const totalMembers = membersData ? membersData[1] + ' members' : null;
    const onlineMembers = membersData ? membersData[2] + ' online' : null;

    return {
      title,
      photoUrl,
      description,
      members: {
        online: onlineMembers,
        total: totalMembers,
      },
      username,
      url,
    };
  } catch (error) {
    console.error('Error scraping data:', error);
    return null;
  }
}

function replaceTextInSVG(svgContent, replacements) {
  for (const key in replacements) {
    if (Object.prototype.hasOwnProperty.call(replacements, key)) {
      const value = replacements[key];
      const regex = new RegExp(key, 'g');
      svgContent = svgContent.replace(regex, value);
    }
  }
  return svgContent;
}

async function imageToBase64(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  const base64Image = Buffer.from(response.data).toString('base64');
  const mimeType = response.headers['content-type'];
  return `data:${mimeType};base64,${base64Image}`;
}

app.get('/', (req, res) => {
  // Redirect to the home page
  res.redirect('/home');
});

app.get('/home', (req, res) => {
  // Serve a simple HTML page explaining how to use the application
  const html = `

    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Telegram Widget App</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background: linear-gradient(45deg, #FF00CC, #3333FF, #33CCFF, #00FF99);
      background-size: 400% 400%;
      animation: gradient 15s ease infinite;
    }

    .content {
      background: rgba(255, 255, 255, 0.7);
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
      transform: translateZ(50px);
      animation: move 5s ease infinite alternate;
      display: flex;
      flex-direction: column;
      text-align: center;
    }

    h1 {
      font-size: 36px;
      margin: 0;
    }

    p {
      margin: 10px 0;
    }

    .input-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    input {
      width: 300px;
      border: none;
      padding: 10px;
      font-size: 16px;
      background: transparent;
      outline: none;
      border-bottom: 2px solid #333;
      margin-right: 10px;
      transition: border-color 0.2s;
    }

    input::placeholder {
      color: #666;
    }

    button {
      padding: 10px 20px;
      background: #333;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      transition: background 0.2s;
    }

    button:hover {
      background: #444;
    }

    @keyframes gradient {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }

    @keyframes move {
      0% {
        transform: translateZ(50px);
      }
      100% {
        transform: translateZ(55px);
      }
    }
  </style>
</head>
<body>
  <div class="content">
    <h1>Welcome to the Telegram Widget App</h1>
    <p>A simple web app to create Telegram group or channel invite widgets.</p>

    <p><em>To get raw data:</em></p>
    <p>Usage: https://tg-button.repl.co/api/<em>username</em></p>

    <p><em>To get Invite button:</em></p>
    <p>Usage: https://tg-button.repl.co/<em>username</em></p>
    <em>or</em>
    <p>Usage: https://tg-button.repl.co/<em>username</em>/<em>colorName</em></p>
    <em>Color is optional</em>


    <div class="input-container">
      <input type="text" id="username" placeholder="Enter your username/color">
      <button id="preview">Preview</button>
    </div>
  </div>
  <script>
  const previewButton = document.getElementById('preview');
  const usernameInput = document.getElementById('username');
  previewButton.addEventListener('click', () => {
    const username = usernameInput.value;
    if (username) {
      const url = encodeURIComponent(username);
      window.open(url, '_blank');
    }
  });
</script>


</body >
</html >`;

  res.send(html);
});

app.get('/api/:link', async (req, res) => {
  let { link } = req.params;
  if (!link) {
    res.status(400).json({ error: 'Missing username' });
    return;
  }

  const scrapedData = await scrapeTelegramPage(link);
  if (scrapedData) {
    const prettyScrapedData = JSON.stringify(scrapedData, null, 2);
    res.setHeader('Content-Type', 'application/json');
    res.send(prettyScrapedData);
  } else {
    res.status(500).json({ error: 'Data not found.' });
  }
});

app.get('/:link/:color?', async (req, res) => {
  const { link, color } = req.params;
  if (!link) {
    res.status(400).json({ error: 'Missing Username' });
    return;
  }
  const scrapedData = await scrapeTelegramPage(link);

  if (scrapedData) {

    let svgContent;
    if (link === "misfits_zone") {
      svgContent = fs.readFileSync('./demo1.svg', 'utf8');
    } else {
      svgContent = fs.readFileSync('./demo.svg', 'utf8');
    }

    const base64Image = await imageToBase64(scrapedData.photoUrl);
    // Define the replacements as an object
    let replacements = {
      '#invited': "YOU'VE BEEN INVITED TO JOIN A TELEGRAM GROUP",
      '#title': scrapedData.title,
      '#logoImage': base64Image,
      '#membersOnline': scrapedData.members.online,
      '#members': scrapedData.members.total,
      '#tgLink': scrapedData.link,
    };

    if (color) {
      replacements['#2f3136'] = color;
    }

    const modifiedSvgContent = replaceTextInSVG(svgContent, replacements);

    res.setHeader('Content-Type', 'image/svg+xml');
    res.send(modifiedSvgContent);
  } else {
    res.status(500).json({ error: 'Data not found' });
  }
});


const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
