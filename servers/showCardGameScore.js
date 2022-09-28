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
            text: `${level},目前還沒設定好改title`,
            font: {
              size: 20
            }
          },
          legend: { //是否要顯示圖示標籤
            display: true,
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
  }
}

const control = {
  currentLevel: SHOW_LEVEL.levelOne,
  currentRange: SHOW_RANGE.seven,
  myChart,
  switchLevel() {
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
    console.log('成功抓到改變的range,編號：', switchRange)
    // myChart.destroy()
    this.getScoreData()
  },
  async getScoreData() { //!fetch 資料回來 目前撈７天levelOne的(?range有送去，但serve還沒改)
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

const range = document.querySelector('#range')
range.addEventListener('change', (event) => {
  console.log('改變')
  control.setRange()
});
