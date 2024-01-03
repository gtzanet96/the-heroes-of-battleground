const url = 'https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/BG23_HERO_306';
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': YOUR_API_KEY,
		'X-RapidAPI-Host': 'omgvamp-hearthstone-v1.p.rapidapi.com'
	}
};

const enemyImg = document.querySelector("#enemy-hero-img");
const enemyName = document.querySelector("#enemy-name");
const enemyText = document.querySelector("#enemy-text");
const healthText = document.querySelector("#health-text");
// for displaying elements properly only after the image has loaded
const lifePoints = document.querySelector(".path1");
const line = document.querySelector(".line1");
const enemyPath = document.querySelector("#enemy-path");

const bringEnemyBoss = async () => {
    try {
        const response = await fetch(url, options);
        const result = await response.text();
        return result;
    } catch (error) {
        console.error(error);
    }
}
console.log(bringEnemyBoss());

bringEnemyBoss().then((result) => {
    console.log(result);
    const dataArray = JSON.parse(result);
    // Αναθετουμε το path της εικονας στο element της εικονας που φτιαξαμε προηγουμενως
    // empty checks
    if(enemyImg && healthText) {
        enemyImg.src = dataArray[0].img;
        healthText.innerHTML = dataArray[0].health;
        // empty checks (1) στην περιπτωση που κανει το fetch το results page το οποιο δεν περιεχει αυτα τα στοιχεια (2) στην περιπτωση λαθους, οπως το check στην σειρα 32
        if(enemyName && enemyText) {
            enemyName.innerHTML = dataArray[0].name;
            enemyText.innerHTML = dataArray[0].text;
        }
        // removing the skeleton class once the data has finished loading and shows up
        enemyImg.classList.remove('skeleton');
        //these are for home page only
        lifePoints.style.display = 'block';
        if (line) {
            line.style.display = 'block';
        }
        // this is for results page only
        if (enemyPath) {
            enemyPath.style.display = 'block';
        }
    }

}).catch((error) => {
    console.error(error);
});


/*
// Simulating a tap event
document.getElementById('accept-btn').addEventListener('click', function() {
    // Adding a class to apply the tap state styles
    this.classList.add('tapped');
    console.log(document.getElementById('accept-btn'));
    setTimeout(() => {
      this.classList.remove('tapped'); // Removing the class after the transition
      console.log(document.getElementById('accept-btn'));
    }, 1200);
  });
  */