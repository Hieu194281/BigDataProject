'use strict';

const {
  StatusCodes,
  ReasonPhrases,
} = require('../utils/constants/httpStatusCode');

class SuccessReponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    data = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.data = data;
  }

  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OkResponse extends SuccessReponse {
  constructor({ message, data }) {
    super({ message, data });
  }
}

class CreatedResponse extends SuccessReponse {
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    data,
    options = {},
  }) {
    super({ message, statusCode, reasonStatusCode, data });
    this.options = options;
  }
}

module.exports = {
  SuccessReponse,
  OkResponse,
  CreatedResponse,
};
