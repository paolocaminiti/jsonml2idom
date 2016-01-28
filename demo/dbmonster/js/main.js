'use strict';

var I = 0;
var N = 100;

var patch = IncrementalDOM.patch;

function update(dbs) {
  for (var i = 0; i < dbs.length; i++) {
    dbs[i].update();
  }
}

function formatElapsed(v) {
  if (!v) return '';

  var str = parseFloat(v).toFixed(2);

  if (v > 60) {
    var minutes = Math.floor(v / 60);
    var comps = (v % 60).toFixed(2).split('.');
    var seconds = comps[0];
    var ms = comps[1];
    str = minutes + ":" + seconds + "." + ms;
  }

  return str;
}

function labelClass(count) {
  if (count >= 20) {
    return 'label label-important';
  } else if (count >= 10) {
    return 'label label-warning';
  }
  return 'label label-success';
}

function elapsedClass(t) {
  if (t >= 10.0) {
    return 'Query elapsed warn_long';
  } else if (t >= 1.0) {
    return 'Query elapsed warn';
  }
  return 'Query elapsed short';
}

// markup
function topQuery (q) {
  var elapsed = q.elapsed
  return ['td', { class: elapsedClass(elapsed)},
    formatElapsed(elapsed),
    ['div.popover.left',
      ['div.popover-content', q.query],
      ['div.arrow']
    ]
  ]
}

function dbRow(db) {
  var topFiveQueries = db.getTopFiveQueries();
  var count = db.queries.length;

  return ['tr', { key: db.id },
    ['td.dbname', db.name],
    ['td.query-count',
      ['span', { class: labelClass(count) },
        count
      ]
    ]
  ].concat(topFiveQueries.map(topQuery))
}

function app(dbs) {
  return ['table.table.table-striped.table-latest-data',
    ['tbody'].concat(dbs.map(dbRow))
  ]
}

// end of markup

function main() {
  var dbs = [];
  for (var i = 0; i < N; i++) {
    dbs.push(new data.Database('cluster' + i));
    dbs.push(new data.Database('cluster' + i + 'slave'));
  }

  setInterval(function() {
    update(dbs);
  }, I);

  function domUpdate() {
    patch(document.body, jsonml2idom, app(dbs));
    requestAnimationFrame(domUpdate);
  }
  domUpdate();
}

document.addEventListener('DOMContentLoaded', function() {
  main();
});
