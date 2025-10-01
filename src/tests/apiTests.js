pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response time is less than 200ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(200);
});

pm.test("Response has the required fields - id, name, albumCount, and portrait", function () {
    const responseData = pm.response.json();

    pm.expect(responseData).to.be.an('object');
    pm.expect(responseData.data).to.be.an('array');
    
    responseData.data.forEach(function(artist) {
        pm.expect(artist).to.have.property('id');
        pm.expect(artist).to.have.property('name');
        pm.expect(artist).to.have.property('albumCount');
        pm.expect(artist).to.have.property('portrait');
    });
});


pm.test("Pagination data is present in the response", function () {
    const responseData = pm.response.json();
    pm.expect(responseData.pagination).to.be.an('object');
});


pm.test("Response time is less than 300ms", function () {
  pm.expect(pm.response.responseTime).to.be.below(300);
});


pm.test("Content-Type header is application/json", function () {
    pm.expect(pm.response.headers.get("Content-Type")).to.include("application/json");
});


pm.test("Response data and pagination data should have the correct schema", function () {
    const responseData = pm.response.json();
    
    pm.expect(responseData).to.be.an('object');

    pm.expect(responseData.data).to.be.an('array');
    responseData.data.forEach(function(artist) {
        pm.expect(artist).to.have.property('id').that.is.a('number');
        pm.expect(artist).to.have.property('name').that.is.a('string');
        pm.expect(artist).to.have.property('albumCount').that.is.a('number');
        pm.expect(artist).to.have.property('portrait').that.is.a('string');
    });

    pm.expect(responseData.pagination).to.be.an('object');
    pm.expect(responseData.pagination).to.have.property('current_page').that.is.a('number');
    pm.expect(responseData.pagination).to.have.property('total_pages').that.is.a('number');
    pm.expect(responseData.pagination).to.have.property('per_page').that.is.a('number');
    pm.expect(responseData.pagination).to.have.property('total_items').that.is.a('number');
});

