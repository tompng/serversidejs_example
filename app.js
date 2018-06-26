const express = require('express')
const app = express()
const strftime = require('strftime')
app.listen(8080)

// send time
app.get('/time', (req, res) => {
  res.write('<html>\n')
  res.write('<head><title>clock1</title></head>\n')
  res.write('  <body>\n')
  res.write('    <p>12:00:00</p>\n')
  res.write('    <p>12:00:01</p>\n')
  res.write('    <p>12:00:02</p>\n')
  res.write('  </body>\n')
  res.write('</html>')
  res.end()
})

// send time each 1sec
app.get('/clock1', (req, res) => {
  res.write('<html>\n')
  res.write('<head><title>clock1</title></head>\n')
  res.write('<body>\n')
  setInterval(() => {
    res.write(`<p>${new Date}</p>\n`)
  }, 1000)
})

// clock(display: none)
app.get('/clock2', (req, res) => {
  res.write('<style>p{font-size:48px;text-align:center;}</style>\n')
  let i = 0
  setInterval(() => {
    i++
    res.write(`<p id='d${i}'>${strftime('%H:%M:%S', new Date)}</p>\n`)
    res.write(`<style>#d${i-1}{display: none}</style>\n`)
  }, 1000)
})

// clock with handling connection close
app.get('/clock3', (req, res) => {
  res.write('<style>body{font-size:48px;}</style>\n')
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
let message
app.get('/click_action', (req, res) => {
  message = req.query.q || JSON.stringify(req.query)
  res.end(`ok(${message})`)
})
app.get('/click', (req, res) => {
  res.write(`
    <iframe name='ifrm' style='width:200px;height:40px;opacity:0.2'></iframe>
    <a href='/click_action?q=ButtonA' target='ifrm'>ButtonA</a>
    <a href='/click_action?q=ButtonB' target='ifrm'>ButtonB</a>
    <a href='/click_action?q=ButtonC' target='ifrm'>ButtonC</a>
    <form target='ifrm' action='click_action'>
      <input type=image name=q style='border:2px solid red;width:100px;height:100px'>
    </form>
  `)
  setInterval(() => {
    res.write(`<p>${message}</p>`)
  }, 1000)
})


// message with iframe
let resObjects = []
app.get('/message_action', (req, res) => {
  const message = req.query.q || JSON.stringify(req.query)
  res.end(`ok(${message})`)
  resObjects = resObjects.filter(res => {
    const status = res.write(`<b>${message}</b> `)
    if (status) return true
    else res.end()
  })
})
app.get('/message', (req, res) => {
  res.write(`
    <iframe name='ifrm' style='width:200px;height:40px;opacity:0.2'></iframe>
    <a href='/message_action?q=Hello' target='ifrm'>Hello</a>
    <a href='/message_action?q=JavaScript' target='ifrm'>JavaScript</a>
    <a href='/message_action?q=World' target='ifrm'>World</a>
    <form target='ifrm' action='click_action'>
      <input type=image name=q style='border:2px solid red;width:100px;height:100px'>
    </form>
  `)
  resObjects.push(res)
})
