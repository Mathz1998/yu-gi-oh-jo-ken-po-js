
// Importação do HTML
const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score_points"),
    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),
    },

    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),
    },

    playerSides: {
        player1: "player-cards",
        player1BOX: document.querySelector("#player-cards"),
        computer: "computer-cards",
        computerBox: document.querySelector("#computer-cards"),
    },

    actions: {
        button: document.getElementById("next-duel"),
    },
};

// Jogadores
const playerSides = {
    player1: "player-cards",
    computer: "computer-cards"
};

// Banco de dados das cards

const cardData = [
    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Papel",
        img: "./src/assets/icons/dragon.png",
        winOf: [1],
        LoseOf: [2],
    },
    {
        id: 1,
        name: "Dark Magician",
        type: "Pedra",
        img: "./src/assets/icons/magician.png",
        winOf: [2],
        LoseOf: [0],
    },
    {
        id: 2,
        name: "Exodia",
        type: "Tesoura",
        img: "./src/assets/icons/exodia.png",
        winOf: [0],
        LoseOf: [1],
    },
];
// Imagem das cartas
async function creatCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img");
    cardImage.setAttribute("height", "100px");
    cardImage.setAttribute("src", "./src/assets/icons/card-back.png");
    cardImage.setAttribute("data-id", IdCard);
    cardImage.classList.add("card");

    if (fieldSide === playerSides.player1) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });

        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        });
    }
    return cardImage;
};

// esconde detalhes das cartas
async function hiddenCardDetails(){
    state.cardSprites.name.innerText = "";
    state.cardSprites.type.innerText = "";
    state.cardSprites.avatar.src = "";
}

async function setCardsField(cardId) {
    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    await hiddenCardDetails();

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;


    let duelResults = await checkDuelResults(cardId, computerCardId);


    await updateScore();
    await drawButton(duelResults);

};

async function updateScore(){
    state.score.scoreBox.innerText = `Vitorias: ${state.score.playerScore} | Derrotas: ${state.score.computerScore}`;

}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Empate";
    let playerCard = cardData[playerCardId];

    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = "Ganhou"
        await  playAudio("Win");
        state.score.playerScore++;

    }

    if (playerCard.LoseOf.includes(computerCardId)) {
        duelResults = "Perdeu";
        await playAudio("lose");
        state.score.computerScore++;
    }

    return duelResults;

}


async function drawButton(text) {
    state.actions.button.innerText = text.toUpperCase();
    state.actions.button.style.display = "block";
};

async function removeAllCardsImages() {
    let { computerBox, player1BOX } = state.playerSides;
    let imgElements = computerBox.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());

    imgElements = player1BOX.querySelectorAll("img");
    imgElements.forEach((img) => img.remove());
};


// Puxa dos dados das cartas e coloca na esquerda
async function drawSelectCard(index) {
    state.cardSprites.avatar.src = cardData[index].img
    state.cardSprites.name.innerText = cardData[index].name
    state.cardSprites.type.innerText = "Atributo: " + cardData[index].type
}

// Gera aleatoriamente as cartas
async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

// Adiciona as cartas ao baralho
async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await creatCardImage(randomIdCard, fieldSide);
        document.getElementById(fieldSide).appendChild(cardImage);

    }
};

// Botao de reset
async function resetDuel(){
    state.cardSprites.avatar.src = ""
    state.actions.button.style.display = "none";
    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"

    // Iniciando novamente
    initialize()
}

async function playAudio(status){
    const audio = new Audio (`./src/assets/audios/${status}.wav`);
    audio.play();
}

function initialize() {
    state.fieldCards.player.style.display = "none"
    state.fieldCards.computer.style.display = "none"
    drawCards(5, playerSides.player1);
    drawCards(5, playerSides.computer);

    const bgm = document.getElementById("bgm")
    bgm.play();
};

initialize();