const GAME_STATE = {
  FirstCardWaits: 'FirstCardWaits',
  SecondCardWaits: 'SecondCardWaits',
  CardsMatchFailed: 'CardsMatchFailed',
  CardsMatched: 'CardsMatched',
  GameFinished: 'GameFinished'
}

const Symbols = [
  'https://img.icons8.com/ios-glyphs/30/000000/spades--v1.png', // 黑桃
  'https://img.icons8.com/ios-filled/50/000000/like--v1.png', // 愛心
  'https://img.icons8.com/ios-filled/50/000000/diamond--v1.png', // 方塊
  'https://img.icons8.com/external-bearicons-glyph-bearicons/64/000000/external-club-graphic-design-bearicons-glyph-bearicons.png', // 梅花
  'https://img.icons8.com/external-bearicons-glyph-bearicons/64/000000/external-club-graphic-design-bearicons-glyph-bearicons.png', // !先用梅花，之後找別的換
]

const utility = {
  getRandomNumberArray(level) {
    const cardNumber = this.decideCardNumber(level)
    const addCards = this.addCards(level)

    const array = Array.from(Array(cardNumber).keys())
    const numberArray = array.map((index) => index + 1)
    numberArray.push(...addCards)  //依據level多加牌
    for (let index = numberArray.length - 1; index > 0; index--) {
      let randomIndex = Math.floor(Math.random() * (index - 1));
      [numberArray[index], numberArray[randomIndex]] = [numberArray[randomIndex], numberArray[index]]
    }
    return numberArray
  },
  decideCardNumber(level) {
    switch (level) {
      case 1:
        return 10
      case 2:
        return 20
      case 3:
        return 30
      case 4:
        return 40
    }
  },
  addCards(level) {
    switch (level) {
      case 1:
        return []
        break
      case 2:
        return [21, 22, 28, 29] //多加4張牌
        break
      case 3:
        return []
        break
      case 4:
        return []
        break
    }
  }
  ,
  startCount() {
    if (model.timer == null) { // 如果timer為空 則開啟定時器
      model.timer = setInterval(this.begin, 1000)
    }
  },
  begin() {
    model.duration++
    view.renewDuration(model.duration)
  },
  stopCount() {
    clearInterval(model.timer)
    model.timer = null // 將狀態轉為空
  },
  transformTime(duration) {
    let minute = 0
    let second = 0
    if (duration < 60) {
      second += duration
      return `${second}秒`
    } else {
      minute += (Math.floor(duration / 60))
      second += (duration % 60)
      return `${minute}分${second}秒`
    }
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
    let remainder = index % 10
    let quotient = Math.floor(index / 10)
    let number = this.transformNumber(remainder)
    let symbol = Symbols[quotient] //! 目前花色有變化，但需要再討論
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
  transformNumber(remainder) {
    switch (remainder) {
      case 0:
        return 5
        break
      default:
        return remainder
    }
  },
  pairedCards(...cards) {
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
    const myModal = new bootstrap.Modal(document.querySelector('#finishedGame'))
    document.querySelector('#durationInModal').innerHTML = `使用${(utility.transformTime(model.duration))}完成卡片配對`
    myModal.show()
  },
  renewDuration(duration) {
    document.querySelector('.duration').innerHTML = (utility.transformTime(duration))
  }
}

const model = {
  level: Number(document.querySelector('#gamelevel').dataset.level),
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
  triedTimes: 0,
  timer: null,
  duration: 0
}

const control = {
  currentState: GAME_STATE.FirstCardWaits,
  generateCards(level) {
    view.displayCards(utility.getRandomNumberArray(level))
  },
  dispatchCardAction(card) {
    if (!card.classList.contains('back')) {
      return
    }
    switch (this.currentState) {
      case GAME_STATE.FirstCardWaits:
        view.flipCards(card)
        utility.startCount() //翻開第一張卡片之後開始計時
        model.revealedCards.push(card)
        this.currentState = GAME_STATE.SecondCardWaits
        break
      case GAME_STATE.SecondCardWaits:
        model.triedTimes += 1
        view.renderTriedTimes(model.triedTimes)
        view.flipCards(card)
        model.revealedCards.push(card)
        if (model.isCardMatched()) {
          this.currentState = GAME_STATE.CardsMatched
          view.pairedCards(...model.revealedCards)
          model.revealedCards = []
          model.score += 10
          view.renderScore(model.score)
          if (model.level === 1 && model.score === 50 || model.level === 2 && model.score === 120 || model.level === 3 && model.score === 150 || model.level === 4 && model.score === 200) {
            this.currentState = GAME_STATE.GameFinished
            utility.stopCount() //暫停計時
            setTimeout(view.showGameFinished, 200)
            this.postGameRecord() //儲存這筆資料
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
  },
  postGameRecord() {
    let data = {
      "level": `${model.level}`,
      "score": '',
      "duration": `${model.duration}`
    }
    switch (model.level) {
      case 1:
        data.score = "50"
        break
      case 2:
        data.score = "150"
        break
      case 3:
        data.score = "200" //!暫定，再討論
        break
      case 4:
        data.score = "300" //!暫定，再討論
        break
    }

    fetch("/gamerecords/matchTenCardGame", {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST",
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then((json) => console.log(json))
      .catch((err) => console.error("error:", err));

  }
}


control.generateCards(model.level)

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', onCLickCard => {
    control.dispatchCardAction(card)
  })
})