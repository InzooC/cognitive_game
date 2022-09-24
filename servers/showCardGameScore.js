const SHOW_LEVEL = {
  levelOne: 'levelOne',
  levelTwo: 'levelTwo',
  levelThree: 'levelThree',
  levelFour: 'levelFour',
  totalLvel: 'totalLvel'
}

const view = {
  showChart() {
    let canvas = document.querySelector('#myChart')
    let ctx = canvas.getContext("2d")
    const myChart = new Chart(ctx, {
      type: 'line',
      data: model.levelOneData,
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'level 1 成績',
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
      data: [
        { x: '2016-12-25', y: 20 },
        { x: '2016-12-26', y: 23 },
        { x: '2016-12-28', y: 26 },
        { x: '2016-12-29', y: 21 },]
    }]
  },
}

view.showChart()

const title = document.querySelector('#title')
const userId = Number(title.dataset.id)

async function getScoreData() {
  try {
    let response = await fetch('/admin//api/cgScore/:userId')
    let data = await response.json()
    console.log('data', data)
  } catch (err) {
    console.log(`Error: ${err}`)
  }
}
getScoreData()
