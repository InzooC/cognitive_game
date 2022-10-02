const SHOW_LEVEL = {
  levelOne: 'level1',
  levelTwo: 'level2',
  levelThree: 'level3',
  levelFour: 'level4',
  totalLvel: 'totalLevel'
}

const SHOW_RANGE = {
  seven: 7,
  twoWeeks: 14,
  oneMonth: 30,
  total: 'total'
}

const view = {
  async showChart(level) {
    if (model.myChart) {
      await model.myChart.destroy()
      model.myChart.config.data.labels = [] //把myChart實例中的labels清空
    }
    let canvas = document.querySelector('#myChart')
    let ctx = canvas.getContext("2d")
    model.myChart = new Chart(ctx, {
      type: 'line',
      data: model.cgData,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            // 圖表title在這邊改
            text: '當日最佳成績',
            font: {
              size: 25
            }
          },
          legend: { //是否要顯示圖示標籤
            display: false,
            position: 'right',
            labels: {
              fontColor: '#000'
            }
          }
        },
        parsing: {
          xAxisKey: 'x',
          yAxisKey: 'y'
        }
      }
    })
  },
  async switchLevelBnt(level) {
    model.levelBtns.forEach(e => e.classList.remove('active'))
    document.querySelector(`#${level}`).classList.add('active')
  }
}

const control = {
  currentLevel: SHOW_LEVEL.levelOne,
  currentRange: SHOW_RANGE.seven,
  myChart,
  switchLevel(level) {
    switch (level) {
      case 'level1':
        this.currentLevel = SHOW_LEVEL.levelOne
        view.switchLevelBnt(level)
        break
      case 'level2':
        this.currentLevel = SHOW_LEVEL.levelTwo
        view.switchLevelBnt(level)
        break
      case 'level3':
        this.currentLevel = SHOW_LEVEL.levelThree
        view.switchLevelBnt(level)
        break
      case 'level4':
        this.currentLevel = SHOW_LEVEL.levelFour
        view.switchLevelBnt(level)
        break
    }
    this.getScoreData()
  },
  async setRange() {
    const switchRange = range.options[range.selectedIndex].value
    switch (switchRange) {
      case '1':
        this.currentRange = SHOW_RANGE.seven
        break
      case '2':
        this.currentRange = SHOW_RANGE.twoWeeks
        break
      case '3':
        this.currentRange = SHOW_RANGE.oneMonth
        break
      case '4':
        this.currentRange = SHOW_RANGE.total
        break
    }
    this.getScoreData()
  },
  async getScoreData() { // 依據controller 裡面的設定進行 fetch 
    try {
      const title = document.querySelector('#title')
      const userId = Number(title.dataset.id)
      let response = await fetch(`/admin//api/cgScore/${userId}?range=${this.currentRange}&level=${this.currentLevel}`)
      let data = await response.json()

      //重置model.cgData.datasets[0].data 資料
      await this.deleteData()
      await this.pushData(data.data)

      //render view
      await view.showChart(this.currentLevel)

    } catch (err) {
      console.log(`Error: ${err}`)
    }
  },
  async pushData(data) {
    //把data放進要顯示的model中
    for (let i = 0; i < data.length; i++) {
      model.cgData.datasets[0].data.push({
        x: data[i].createdAt, y: data[i].duration
      })
    }
  },
  async deleteData() {
    model.cgData.datasets[0].data = []
  }
}

const model = {
  range: document.querySelector('#range'),
  levelBtns: document.querySelectorAll('.level-btn'),
  cgData: {
    datasets: [{
      label: '使用時間(秒)', // 線條名稱,
      lineTension: 0.5, // 曲線的彎度，設0 表示直線
      backgroundColor: "#ea464d",
      borderColor: "#ea464d",
      borderWidth: 3, //外框寬度
      data: [
        { x: '2016-09-24', y: 9 },
        { x: '2016-09-25', y: 9 },
        { x: '2016-09-26', y: 9 }
      ]
    }]
  }
}

control.getScoreData()

model.range.addEventListener('change', (event) => {
  control.setRange()
})

model.levelBtns.forEach(levelBtn => {
  levelBtn.addEventListener('click', onCLickLevel => {
    control.switchLevel(levelBtn.id)
  })
})