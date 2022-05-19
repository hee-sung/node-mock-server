class MockResponse {
  constructor(jsonData = {}) {
    this.status = jsonData.status || 200;
    this.statusText = jsonData.statusText || '';
    this.data = jsonData.data || null;
    this.error = jsonData.error || null;
  }
}

module.exports = MockResponse;