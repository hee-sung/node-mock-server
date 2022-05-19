class MockHeader {
  constructor(jsonData = {}) {
    this.useAuth = jsonData.useAuth || false;
  }
}

module.exports = MockHeader;