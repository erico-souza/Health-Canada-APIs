
// Bimal Bhagrath
// MODULE : elasticsearch query manager

const builder = require('elastic-builder');

const QS_LIST = [
  "search",
  "count",
  "skip",
  "limit"
];
const HISTOGRAM_FIELDS = [];
const HISTOGRAM_INTERVALS = [
  "year",
  "quarter",
  "month",
  "week",
  "day"
];
const MAX_LIMIT = 5000;

exports.validate = (query) => { // expects express req.query object

  for (var param in query) {
     if (!QS_LIST.includes(param)) {
       throw {
         error: "query validation",
         status: 400,
         message: "request contains unexpected paramater: " + param
       };
     }
  }

  if (query.hasOwnProperty("skip")) {
    var skip = parseInt(query.skip);

    if (isNaN(skip)) {
      throw {
        error: "query validation",
        status: 400,
        message: "invalid skip value"
      };
    }
  }

  if (query.hasOwnProperty("limit")) {
    var limit = parseInt(query.limit);

    if (isNaN(limit)) {
      throw {
        error: "query validation",
        status: 400,
        message: "invalid limit value"
      };
    }
  }
};

exports.build = (query) => { // expects validated express req.query object

  var esbody = builder.requestBodySearch();

  if (!query.hasOwnProperty("search") && !query.hasOwnProperty("count")) {
    esbody.query(builder.matchAllQuery());
  }

  if (query.hasOwnProperty("search")) {
    esbody.query(builder.queryStringQuery(query.search));
  }

  if (query.hasOwnProperty("count")) {
    var params = (query.count).split(":");

    if (HISTOGRAM_FIELDS.includes(params[0])) {
      var interval;

      if (params.length > 1) {
        interval = HISTOGRAM_INTERVALS.includes(params[1]) ? params[1] : "days";
      }
      else {
        interval = "days"
      }

      esbody.agg(builder.dateHistogramAggregation());
    }
    else {
      esbody.agg(builder.termsAggregation("term", params[0]));
    }
  }

  if (query.hasOwnProperty("skip")) {
    var skip = parseInt(query.skip);
    esbody.from(skip);
  }

  if (query.hasOwnProperty("limit")) {
    var limit = parseInt(query.limit);

    if (limit > MAX_LIMIT) {
      esbody.size(MAX_LIMIT);
    }
    else {
      esbody.size(limit);
    }

  }

  return esbody.toJSON();
};
