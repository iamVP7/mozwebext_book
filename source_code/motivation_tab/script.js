let random_quote = [
  "In chess, knowledge is a very transient thing. It changes so fast that even a single mouse-slip sometimes changes the evaluation",
  "There is always the risk of being over-confident when you are preparing to face a weaker player.",
  "A win is a win, which is about that particular moment.",
  "I would never suggest to anyone that they drop school for chess. First of all even if you can make it in chess, your social skills need to be developed there.",
  "For every door the computers have closed they have opened a new one",
  "Everyone has their nemesis. For me it was clearly Kasparov. I don’t think I want to make excuses for that.",
  "If revenge motivates you, go for it! But the main thing is to set your game in order."
];

let color_hex = ['#778899','#B0C4DE','#E6E6FA','#90EE90','#00FF7F'
];
function getRandomQuote() {

  var random_num = Math.floor((Math.random() * random_quote.length));

  document.getElementById("quote").innerText = random_quote[random_num];
  
  var random_col_num = Math.floor((Math.random() * color_hex.length));
  
  document.body.style.backgroundColor = color_hex[random_col_num];

}

// Call the method getRandomQuote when this js loads
getRandomQuote();

