const express = require('express')
const app = express()
const strftime = require('strftime')

// send time
app.get('/time', (req, res) => {
  res.write('<html>')
  res.write('<head><title>clock1</title></head>')
  res.write('  <body>')
  res.write('    <p>12:00:00</p>')
  res.write('    <p>12:00:01</p>')
  res.write('    <p>12:00:02</p>')
  res.write('  </body>')
  res.write('</html>')
  res.end()
})

// send time each 1sec
app.get('/clock1', (req, res) => {
  res.write('<html>')
  res.write('<head><title>clock1</title></head>')
  res.write('<body>')
  setInterval(() => {
    res.write(`<p>${new Date}</p>`)
  }, 1000)
})

// clock (display:none, handling connection close)
app.get('/clock2', (req, res) => {
  res.write(`
    <html>
      <head>
        <title>clock2</title>
        <style>body{font-size:48px;}</style>
      </head>
      <body>
  `)
  let i = 0
  function sendTime() {
    const date = new Date
    const status = res.write(`
      <center id='d${i}'>
        <small>${strftime('%Y/%m/%d', date)}</small>
        <div>${strftime('%H:%M:%S', date)}</div>
      </center>
      <style>#d${i-1}{display:none}</style>
    `)
    i++
    if (status) {
      setTimeout(sendTime, 1000)
    } else {
      res.end()
    }
  }
  sendTime()
})

// click with iframe
let resObjects = []
app.get('/click_action', (req, res) => {
  const message = req.query.q || JSON.stringify(req.query)
  res.end(`ok(${message})`)
  resObjects = resObjects.filter(res => {
    const status = res.write(`<b>${message}</b> `)
    if (status) return true
    else res.end()
  })
})
app.get('/click', (req, res) => {
  res.write(`
    <iframe name='ifrm' style='width:200px;height:40px;opacity:0.2'></iframe>
    <a href='/click_action?q=Hello' target='ifrm'>Hello</a>
    <a href='/click_action?q=JavaScript' target='ifrm'>JavaScript</a>
    <a href='/click_action?q=World' target='ifrm'>World</a>
    <form target='ifrm' action='click_action'>
      <input type=image name=q style='border:2px solid red;width:100px;height:100px'>
    </form>
  `)
  resObjects.push(res)
})

app.listen(8080)
