const GAME_STATE = {
  FirstCardWaits: 'FirstCardWaits',
  SecondCardWaits: 'SecondCardWaits',
  CardsMatchFailed: 'CardsMatchFailed',
  CardsMatched: 'CardsMatched',
  GameFinished: 'GameFinished'
}

//之後把邏輯改成 １－９（四個花色），加起來＝１０得分

const Symbols = [
  'https://img.icons8.com/ios-glyphs/30/000000/spades--v1.png', // 黑桃
  'https://img.icons8.com/ios-filled/50/000000/like--v1.png', // 愛心
  'https://img.icons8.com/ios-filled/50/000000/diamond--v1.png', // 方塊
  'https://img.icons8.com/external-bearicons-glyph-bearicons/64/000000/external-club-graphic-design-bearicons-glyph-bearicons.png' // 梅花
]

const utility = {
  getRandomNumberArray(count) {
    const array = Array.from(Array(count).keys())
    const numberArray = array.map((index) => index + 1)
    for (let index = numberArray.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index - 1));
      [numberArray[index], numberArray[randomIndex]] = [numberArray[randomIndex], numberArray[index]]
    }
    return numberArray
  }
}

const view = {
  displayCards(randomIndex) {
    const rootElement = document.querySelector('#cards')
    let rawHTML = randomIndex.map((index) => this.getCardElement(index)).join('')
    rootElement.innerHTML = rawHTML
  },
  getCardElement(index) {
    return `<div data-index="${index}" class="card back"></div>`
  },
  getCardContent(index) {
    let number = this.transformNumber(index)
    // let number = index
    let symbol = Symbols[0] //先用黑桃
    return `
    <p>${number}</p>
      <img src="${symbol}" alt="">
    <p>${number}</p>`
  },
  flipCards(...cards) {
    cards.map(card => {
      if (card.classList.contains('back')) {
        card.classList.remove('back')
        card.innerHTML = this.getCardContent(Number(card.dataset.index))
        return
      }
      card.classList.add('back')
      card.innerHTML = null

    })
  },
  transformNumber(number) {
    switch (number) {
      case 10:
        return 5
      default:
        return number
    }
  },
  pairedCards(...cards) {
    console.log(cards)
    cards.map(card => {
      card.classList.add('paired')
    })
  },
  renderScore(score) {
    document.querySelector('.score').innerHTML = `總得分: ${score}`
  },
  renderTriedTimes(triedTimes) {
    document.querySelector('.tried').innerHTML = `已嘗試次數: ${triedTimes} 次`
  },
  wrongAnimation(...cards) {
    cards.map((card) => {
      card.classList.add('wrong')
      card.addEventListener('animationend', event => {
        event.target.classList.remove('wrong'), { once: true }
      })
    })
  },
  showGameFinished() {
    alert('恭喜達到完成遊戲')  //! 改彈跳視窗，回到主選單
  }
}


const model = {
  revealedCards: [],
  isCardMatched() {
    if (((Number(this.revealedCards[0].dataset.index) + Number(this.revealedCards[1].dataset.index))) % 10 === 0) {
      return true  //加起來=10
    } else if ((Number(this.revealedCards[0].dataset.index) % 5 === 0 && + Number(this.revealedCards[1].dataset.index) % 5 === 0)) {
      return true //兩個都是5的倍數
    } else {
      return false
    }
  },
  score: 0,
  triedTimes: 0
}

const control = {
  currentState: GAME_STATE.FirstCardWaits,
  generateCards(cardNumber) {
    view.displayCards(utility.getRandomNumberArray(cardNumber))
  },
  dispatchCardAction(card) {
    if (!card.classList.contains('back')) {
      return
    }
    switch (this.currentState) {
      case GAME_STATE.FirstCardWaits:
        console.log('第一張牌 :' + card.dataset.index)
        view.flipCards(card)
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardWaits
        break
      case GAME_STATE.SecondCardWaits:
        console.log('第二張牌:' + card.dataset.index)
        //triedTime + 1 and render
        model.triedTimes += 1
        view.renderTriedTimes(model.triedTimes)

        view.flipCards(card)
        model.revealedCards.push(card)
        if (model.isCardMatched()) {
          this.currentState = GAME_STATE.CardsMatched
          view.pairedCards(...model.revealedCards)
          model.revealedCards = []
          //score + 1
          model.score += 10
          view.renderScore(model.score)
          if (model.score === 50) {
            this.currentState = GAME_STATE.GameFinished
            setTimeout(view.showGameFinished, 200)
            // view.showGameFinished()
          } else {
            this.currentState = GAME_STATE.FirstCardWaits
          }
        } else if (!model.isCardMatched()) {
          this.currentState = GAME_STATE.CardsMatchFailed
          view.wrongAnimation(...model.revealedCards)
          setTimeout(this.resetCards, 1000)
        }
        break
    }
  },
  resetCards() {
    view.flipCards(...model.revealedCards)
    model.revealedCards = []
    control.currentState = GAME_STATE.FirstCardWaits
  }
}

control.generateCards(10)

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', onCLickCard => {
    control.dispatchCardAction(card)
    console.log(control.currentState)
  })
})