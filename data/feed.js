var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'http://129.41.145.159:9200',
  log: 'trace'
});

client.create({
  index: 'myindex',
  type: 'mytype',
  id: '1',
  body: {
    title: 'Test 1',
    tags: ['y', 'z'],
    published: true,
    published_at: '2013-01-01',
    counter: 1
  }
}, function (error, response) {
  // ...
});
