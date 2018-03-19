const request = require('request-promise');
const express = require('express')
const app = express()

let API_ROOT = `http://colorhunt.co/hunt.php`;

let ROUTES = {
  'new': 'http://colorhunt.co/',
  'hot': 'http://colorhunt.co/hot',
  'popular': 'http://colorhunt.co/popular',
  'random': 'http://colorhunt.co/random'
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/:filter', (req, res) => {

  if(!Object.keys(ROUTES).includes(req.params.filter)) {
    return res.json({ error: 'filter not found' })
  }

  (async () => {
    const resp = await request.post(API_ROOT, {form:{
      step: 0,
      sort: req.params.filter
    }});

    let results;

    try {
      results = JSON.parse(resp.replace('<script>arr = ', '').replace(', ];</script>', ']'));
    } catch(e) {
      return res.json({
        error: e
      })
    }

    results = results.map(r => {
      r.colors = [];
      for (var i = 0; i < 24; i += 6) {
        r.colors.push(r.code.substring(i, i + 6));
      }
      return r;
    })

    res.json({
      error: null,
      results: results
    })
  })()
});

app.listen(3000, () => console.log('Example app listening on port 3000!'))

