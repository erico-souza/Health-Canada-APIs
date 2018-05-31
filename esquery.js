
// Bimal Bhagrath
// MODULE : elasticsearch query manager

const builder = require('elastic-builder');

const QS_LIST = ["search", "count", "skip", "limit"];

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

  if (!query.hasOwnProperty("search") && !query.hasOwnProperty("count")) {
    throw {
      error: "query validation",
      status: 400,
      message: "request must contain either search or count parameter"
    };
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

  if (query.hasOwnProperty("search")) {}
};
