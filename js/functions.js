// Only get the heroes who (1) exist in battlegrounds deck (2) are not the enemy boss
function filterHeroCards(battlegroundsSet, heroSet, enemyCardId) {
    return battlegroundsSet.filter(battlegroundsCard => {
        return (
            heroSet.some(heroCard => heroCard.cardId === battlegroundsCard.cardId) &&
            battlegroundsCard.cardId !== enemyCardId
        );
    });
}

// Function to check if a card is an Undead Minion
function isUndeadMinion(card, undeadSet, minionSet) {
    return (
        undeadSet.some(undeadCard => undeadCard.cardId === card.cardId) &&
        minionSet.some(minionCard => minionCard.cardId === card.cardId)
    );
}

// Function to filter cards that are Undead Minions
function filterUndeadMinions(battlegroundsSet, undeadSet, minionSet) {
    return battlegroundsSet.filter(battlegroundsCard => isUndeadMinion(battlegroundsCard, undeadSet, minionSet));
}

// Function to filter cards that are Battlegrounds Minions
function filterBattlegroundsMinions(battlegroundsSet, minionSet) {
    return battlegroundsSet.filter(battlegroundsCard => {
        return minionSet.some(minionCard => minionCard.cardId === battlegroundsCard.cardId);
    });
}