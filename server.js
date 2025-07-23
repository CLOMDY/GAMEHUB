const express = require("express");
const path = require("path");
const fs = require('fs');
const exphbs = require("express-handlebars");

const app = express();
const PORT = process.env.PORT || 3000;

// Setup Handlebars view engine
app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'main',  // 👈 this is your layout file: main.hbs
  layoutsDir: path.join(__dirname, 'templates/layouts')  // 👈 folder containing main.hbs
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'templates'));


// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Route
app.get("/", (req, res) => {
  res.render("home"); // views/home.handlebars must exist
});
app.get("/about", (req, res) => {
  res.render('about', {
    title: 'ABOUT US',
    name: 'MyHelp'
  })
});

const saveGames = function (games) {
  const dataJSON = JSON.stringify(games)
  fs.writeFileSync('gameDB.json', dataJSON)
}

const loadGames = function () {
  try {
    const dataBuffer = fs.readFileSync('gameDB.json')
    const dataJSON = dataBuffer.toString()
    return JSON.parse(dataJSON)
  }
  catch (e) {
    return []
  }
}

app.get('/add', (req, res) => {
  const gameCode = req.query.gameCode;
  const img = req.query.img;
  const title = req.query.title;
  const genre = req.query.genre;
  const about = req.query.about;
  const company = req.query.company;
  const rating = req.query.rating;
  const tournament = req.query.tournament;
  const price = req.query.price;
  const bought = req.query.bought;
  const wallpaper = req.query.wallpaper;
  const video = req.query.video;
  const SS1 = req.query.SS1;
  const SS2 = req.query.SS2;
  const SS3 = req.query.SS3;
  const SS4 = req.query.SS4;

  const games = loadGames();
  const duplicateGames = games.filter(function (game) {
    return game.gameCode === gameCode;
  })

  if (duplicateGames.length === 0) {
    games.push({
      gameCode: gameCode,
      img: img,
      title: title,
      genre: genre,
      about: about,
      company: company,
      rating: parseInt(rating),
      tournament: tournament,
      price: parseInt(price),
      bought: parseInt(bought),
      wallpaper: wallpaper,
      video: video,
      SS1: SS1,
      SS2: SS2,
      SS3: SS3,
      SS4: SS4
    })
    if (rating != null) {
      saveGames(games)
    }
  }

  res.render('add', {
    title: 'Add Game',
    name: 'MyName'
  })
})

app.get("/remove", (req, res) => {
  const gameCode = req.query.gameCode;

  const games = loadGames();
  const gamesToKeep = games.filter((game) => game.gameCode !== gameCode)

  if (games.length > gamesToKeep.length) {
    saveGames(gamesToKeep)
  }

  res.render('remove', {
    title: 'Remove Game',
    name: 'MyName',
    jsonData: games
  })
});
app.get("/contact", (req, res) => {
  res.render('contact', {
    title: 'CONTACT US',
    name: 'MyHelp'
  })
});

app.get("/gameDetail", (req, res) => {
  const gameCode = req.query.gameCode;
  const jsonData = loadGames();
  const game = jsonData.find(game => game.gameCode === gameCode);

  if (game) {
    res.render('gameDetail', {
      title: 'Game Detail',
      name: 'MyName',
      game: game
    });
  } else {
    res.render('gameDetail', {
      title: 'Game Not Found',
      name: 'MyName',
      game: null
    });
  }
});

app.get("/buyGame", (req, res) => {
  const gameCode = req.query.gameCode;
  const jsonData = loadGames();
  const game = jsonData.find(game => game.gameCode === gameCode);

  if (game) {
    game.bought += 1;
    saveGames(jsonData);
    res.redirect(`/gameDetail?gameCode=${gameCode}&bought=true`);

  } else {
    res.status(404).send("Game not found");
  }
});



app.get("/gameList", (req, res) => {
  const jsonData = loadGames();
  res.render('gameList', {
    title: 'Game List',
    name: 'MyName',
    jsonData: jsonData
  })
});


// Add more as needed...



app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
