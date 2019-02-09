if (process.env.NODE_ENV  === 'production')
  module.exports = {url: ''};
else
  module.exports = {url: 'mongodb://localhost/vidjot'};
