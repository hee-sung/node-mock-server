const MockHeader = require("./MockHeader");
const MockResponse = require("./MockResponse");

class MockObject {
  constructor(jsonData) {
    this.requestUrl = jsonData.requestUrl;
    this.header = new MockHeader(jsonData.header);
    this.response = new MockResponse(jsonData.response);
  }

  useAuth() {
    return this.header.useAuth || false;
  }

  getStatusOfResponse() {
    return this.response.status;
  }

  getStatusTextOfResponse() {
    return this.response.statusText;
  }

  hasDataOfResponse () {
    return this.response.data ? true : false;
  }

  getDataOfResponse() {
    return this.response.data;
  }

  hasErrorOfResponse() {
    return this.response.error ? true : false;
  }

  getErrorMessageOfResponse() {
    return this.response.error.message;
  }

  getErrorNameOfResponse() {
    return this.response.error.name;
  }
}

module.exports = MockObject