const SHOW_LEVEL = {
  levelOne: 'levelOne',
  levelTwo: 'levelTwo',
  levelThree: 'levelThree',
  levelFour: 'levelFour',
  totalLvel: 'totalLevel'
}

const view = {
  showChart(level) {
    let canvas = document.querySelector('#myChart')
    let ctx = canvas.getContext("2d")
    console.log(' model.levelOneData', model.levelOneData)

    const myChart = new Chart(ctx, {
      type: 'line',
      data: model.levelOneData,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `${level}`,
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
  currentState: SHOW_LEVEL.levelOne,
  switchLevel() {
  },
  async getScoreData() { //!fetch 資料回來 目前撈７天levelOne的
    try {
      const title = document.querySelector('#title')
      const userId = Number(title.dataset.id)
      let response = await fetch(`/admin//api/cgScore/${userId}`)
      let data = await response.json()
      await this.pushData(data.data)
      //render view
      await view.showChart(this.currentState)
    } catch (err) {
      console.log(`Error: ${err}`)
    }
  },
  async pushData(data) {
    //把data放進要顯示的model中
    data.forEach(e => {
      model.levelOneData.datasets[0].data.push({
        x: e.createdAt, y: e.duration
      })
    })
  }
}

const model = {
  levelOneData: {
    datasets: [{
      label: '使用時間(秒)', // 線條名稱,
      lineTension: 0.5, // 曲線的彎度，設0 表示直線
      backgroundColor: "#ea464d",
      borderColor: "#ea464d",
      borderWidth: 3, //外框寬度
      data: []
    }]
  }
}

control.getScoreData()