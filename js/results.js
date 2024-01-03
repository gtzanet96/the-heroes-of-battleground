//Results page requests and calculations
const battlegroundsUrl = 'https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/sets/Battlegrounds';
const undeadUrl = 'https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/races/Undead';
const minionUrl = 'https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/types/Minion';
const heroUrl = 'https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/types/Hero';

const bringData = async () => {
    try {
        // Fetch Battlegrounds cards
        const battlegroundsResponse = await fetch(battlegroundsUrl, options);
        const battlegroundsResult = await battlegroundsResponse.json();
        
        // Fetch Undead cards
        const undeadResponse = await fetch(undeadUrl, options);
        const undeadResult = await undeadResponse.json();

        // Fetch Minion cards
        const minionResponse = await fetch(minionUrl, options);
        const minionResult = await minionResponse.json();

        // Fetch Hero cards
        const heroResponse = await fetch(heroUrl, options);
        const heroResult = await heroResponse.json();

        // Only get the results which (1) are undead (2) are minions (3) exist in the Battlegrounds set
        const battlegroundsUndeadMinions = filterUndeadMinions(battlegroundsResult, undeadResult, minionResult);

        // Only get the results which exist in both battlegrounds set and hero cards, enemy card id excluded
        const enemyCardId = "BG23_HERO_306";
        const battlegroundsHeroes = filterHeroCards(battlegroundsResult, heroResult, enemyCardId);

        // Only get the results which exist in both battlegrounds set and minion cards
        const battlegroundsMinions = filterBattlegroundsMinions(battlegroundsResult, minionResult)

        // Return the result as an object
        return JSON.stringify({
            battlegroundsUndeadMinions,
            battlegroundsMinions,
            battlegroundsHeroes
        });
    } catch (error) {
        console.error(error);
    }
}
console.log(bringData());

// grabbing our four enemy image elements
const enemyImg1 = document.getElementById('enemy-minion-img-1');
const enemyImg2 = document.getElementById('enemy-minion-img-2');
const enemyImg3 = document.getElementById('enemy-minion-img-3');
const enemyImg4 = document.getElementById('enemy-minion-img-4');
// team minions
const teamImg1 = document.getElementById('team-minion-img-1');
const teamImg2 = document.getElementById('team-minion-img-2');
const teamImg3 = document.getElementById('team-minion-img-3');
const teamImg4 = document.getElementById('team-minion-img-4');
// team hero
const teamHeroImg = document.getElementById('team-hero-img');
const heroHealthText = document.querySelector("#hero-health-text");
// for removing the skeletons after loading the images and showing the life points of the images only after they ve completed loading
const enemyMinions =  document.querySelectorAll('[id^="enemy-minion-img-"]');
const teamMinions =  document.querySelectorAll('[id^="team-minion-img-"]');
const heroPath = document.querySelector("#hero-path");
// for calculating results
const resultText = document.getElementById('result-text');
const opponentScore = document.getElementById('opponent-score');
const teamScore = document.getElementById('team-score');
const enemyFinalText = document.getElementById('enemy-final-text');

bringData().then((resultString) => {
    // parsing the json result so that we can use it as an array
    const { battlegroundsUndeadMinions, battlegroundsMinions, battlegroundsHeroes} = JSON.parse(resultString);

    // we only want array elements that have an img property - not all have
    const enemyMinionsWithImgProperty = battlegroundsUndeadMinions.filter(item => item.hasOwnProperty('img'));
    const teamMinionsWithImgProperty = battlegroundsMinions.filter(item => item.hasOwnProperty('img'));
    const heroWithImgProperty = battlegroundsHeroes.filter(item => item.hasOwnProperty('img'));

    // randomizing the arrays to get different results every time
    const randomize = (array) => array.sort(() => 0.5 - Math.random());
    randomize(enemyMinionsWithImgProperty);
    randomize(teamMinionsWithImgProperty);
    randomize(heroWithImgProperty);

    // Updating HTML elements - we need the first four cards from the randomized undead/team minions of the battleground deck, and first we make sure none is empty
    if (enemyMinionsWithImgProperty[0] && enemyMinionsWithImgProperty[1] && enemyMinionsWithImgProperty[2] && enemyMinionsWithImgProperty[3]) {
        enemyImg1.src = enemyMinionsWithImgProperty[0].img;
        enemyImg2.src = enemyMinionsWithImgProperty[1].img;
        enemyImg3.src = enemyMinionsWithImgProperty[2].img;
        enemyImg4.src = enemyMinionsWithImgProperty[3].img;

        // removing the skeletons after images load
        enemyMinions.forEach((element) => {
            element.classList.remove('skeleton');
        })
    }
    if (teamMinionsWithImgProperty[0] && teamMinionsWithImgProperty[1] && teamMinionsWithImgProperty[2] && teamMinionsWithImgProperty[3]) {
        teamImg1.src = teamMinionsWithImgProperty[0].img;
        teamImg2.src = teamMinionsWithImgProperty[1].img;
        teamImg3.src = teamMinionsWithImgProperty[2].img;
        teamImg4.src = teamMinionsWithImgProperty[3].img;

        teamMinions.forEach((element) => {
            element.classList.remove('skeleton');
        })
    }
    if (heroWithImgProperty[0]) {
        teamHeroImg.src = heroWithImgProperty[0].img;
        heroHealthText.innerHTML = heroWithImgProperty[0].health;
        // getting rid of the skeletons once these load
        teamHeroImg.classList.remove('skeleton');
        heroPath.style.display = 'block';
    }

    // calculate enemy minions total hp
    let enemyHP = 0;
    for (i=0;i<4;i++) {
        enemyHP += enemyMinionsWithImgProperty[i].health;
    }
    // show enemy hp/score
    opponentScore.innerHTML = "Opponent's score: " + enemyHP;

    // calculate team minions total hp
    let teamHP = 0;
    for (i=0;i<4;i++) {
        teamHP += teamMinionsWithImgProperty[i].health;
    }
    // show team hp/score
    teamScore.innerHTML = "Your score: " + teamHP;

    // decide who wins - if enemy hp > team hp then team loses / if team hp >= enemy hp then team wins
    if (enemyHP > teamHP) {
        resultText.innerHTML = "Defeat!"
        // adds an extra class to the result text element for style/color 
        resultText.classList.add('defeat');
        enemyFinalText.innerHTML = "All bow before the Dark Lady!"
    } else {
        resultText.innerHTML = "Victory!"
        resultText.classList.add('victory');
        enemyFinalText.innerHTML = "The Dark Lady deems you worthy!"
    }

}).catch((error) => {
    console.error(error);
});
