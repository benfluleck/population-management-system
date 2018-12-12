import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';

import app from '../index';
import loginUser from './helpers/utils';
import { mongooseConnection } from '../server';
import { parentLocationDetails } from './fixtures/locationData';


chai.use(chaiHttp);
const agent = chai.request.agent(app);

const badId = '507f191e810c19729de860ea';
let locationId;
let secondLocationId;

describe('Location', () => {

  describe('Add Location', () => {
    it(
      'should return a 201 status code when adding a new location',
      (done) => {
        loginUser(agent)
          .then(() => {

            agent
              .post('/api/v1/locations')
              .set('Accept', 'application/x-www-form-urlencoded')
              .send({
                ...parentLocationDetails
              })
              .then((res) => {
                locationId = res.body.data._id;

                expect(res.body.message).to.equal('Location Successfully Created');
                expect(res.body.data.totalPopulation).to.equal(93);
                expect(res.status)
                  .to
                  .equal(201);
                expect(res.body).to.be.a('object');
                done();
              }).catch((err) => {
                done(err)
              })
          });
      }
    );
    it(
      'should return a 201 status code when adding a new location which is inside the parent location',
      (done) => {
        loginUser(agent)
          .then(() => {
            agent
              .post('/api/v1/locations')
              .set('Accept', 'application/x-www-form-urlencoded')
              .send({
                ...parentLocationDetails,
                locationName: "Kampala",
                parentLocation: locationId,

              })
              .then((res) => {
                secondLocationId = res.body.data._id;

                expect(res.body.message).to.equal('Location Successfully Created');
                expect(res.body.data.totalPopulation).to.equal(93);
                expect(res.status)
                  .to
                  .equal(201);
                expect(res.body).to.be.a('object');
                done();
              }).catch((err) => {
                done(err)
              })
          });
      }
    );
    it(
      'should allow for unique location names',
      (done) => {
        loginUser(agent)
          .then(() => {
            agent
              .post('/api/v1/locations')
              .set('Accept', 'application/x-www-form-urlencoded')
              .send({
                ...parentLocationDetails
              })
              .then((res) => {
                expect(res.body.message).to.equal('This location already exists please make it unique');
                expect(res.status)
                  .to
                  .equal(409);
                expect(res.body).to.be.a('object');
                done();
              }).catch((err) => {
                done(err)
              })
          });
      }
    );
    it(
      'should return a 400 status code when adding a new location with invalid population details',
      (done) => {
        loginUser(agent)
          .then(() => {
            agent
              .post('/api/v1/locations')
              .set('Accept', 'application/x-www-form-urlencoded')
              .send({
                malePopulation: 'ghhn',
                femalePopulation: 34,
                locationName: 'Ohio',
              })
              .then((res) => {
                expect(res.body.message).to.equal('Both malePopulation and femalePopulation should be numbers');
                expect(res.status)
                  .to
                  .equal(400);
                expect(res.body).to.be.a('object');
                done();
              }).catch((err) => {
                done(err)
              })
          });
      }
    );
    it(
      'should return a 404 status code when adding a new location with non-existent parent location',
      (done) => {
        loginUser(agent)
          .then(() => {
            agent
              .post('/api/v1/locations')
              .set('Accept', 'application/x-www-form-urlencoded')
              .send({
                malePopulation: '34',
                femalePopulation: '34',
                locationName: 'Ohio',
                parentLocation: badId
              })
              .then((res) => {
                expect(res.body.message).to.equal('This Parent Location does not exist');
                expect(res.status)
                  .to
                  .equal(404);
                expect(res.body).to.be.a('object');
                done();
              }).catch((err) => {
                done(err)
              })
          });
      }
    );
  }
  );
  describe('Get Locations', () => {
    it(
      'should return a location list with a status code of 200',
      (done) => {
        loginUser(agent)
          .then(() => {
            agent
              .get('/api/v1/locations')
              .set('Accept', 'application/x-www-form-urlencoded')
              .then((res) => {
                expect(res.body.message).to.equal('Locations Successfully Retrieved');
                expect(res.status)
                  .to
                  .equal(200);
                expect(res.body).to.be.a('object');
                done();
              }).catch((err) => {
                done(err)
              })
          });
      }
    );
  })
  describe('Get Specific Location ', () => {
    it(
      'should return a current location ',
      (done) => {
        loginUser(agent)
          .then(() => {
            agent
              .get('/api/v1/locations')
              .set('Accept', 'application/x-www-form-urlencoded')
              .then(() => {

                agent
                  .get(`/api/v1/locations/${locationId}`)
                  .set('Accept', 'application/x-www-form-urlencoded')
                  .then((response) => {
                    expect(response.body.data[0].malePopulation).to.equal(86);
                    expect(response.body.data[0].femalePopulation).to.equal(100);
                    expect(response.body.message).to.equal('Location Successfully Retrieved')
                    done();
                  });
              });

          }).catch((err) => {
            done(err)
          })
      });
    it(
      'should return a 404 status code when adding a new location with non-existent parent location',
      (done) => {
        loginUser(agent)
          .then(() => {

            agent
              .get(`/api/v1/locations/${badId}`)
              .set('Accept', 'application/x-www-form-urlencoded')
              .then((response) => {
                expect(response.status)
                  .to
                  .equal(404);
                expect(response.body.message).to.equal('This Location does not exist')
                done();
              });
          })
          .catch((err) => {
            done(err)
          })
      });
  });
  describe('Update Location ', () => {
    it(
      'should update location and return a 200 status code',
      (done) => {
        loginUser(agent)
          .then(() => {
            agent
              .put(`/api/v1/locations/${locationId}`)
              .set('Accept', 'application/x-www-form-urlencoded')
              .send({
                malePopulation: '455',
                femalePopulation: '304',
                locationName: 'Ohio',
              })
              .then((response) => {
                expect(response.body.data.malePopulation).to.equal(455);
                expect(response.body.data.femalePopulation).to.equal(304);
                expect(response.body.data.totalPopulation).to.equal(759);
                expect(response.body.message).to.equal('Location Successfully Updated, Please update the Root Location, if it applies')
                done();
              });
          })
          .catch((err) => {
            done(err)
          })
      });
    it(
      'should return  status error 404 when updating a non-existent location',
      (done) => {
        loginUser(agent)
          .then(() => {
            agent
              .put(`/api/v1/locations/${badId}`)
              .set('Accept', 'application/x-www-form-urlencoded')
              .send({
                malePopulation: '455',
                femalePopulation: '304',
                locationName: 'Ohio',
              })
              .then((response) => {
                expect(response.status)
                  .to
                  .equal(404);
                expect(response.body.message).to.equal('This Location does not exist')
                done();
              });
          })
          .catch((err) => {
            done(err)
          })
      });
    it(
      'should return  status error 404 when updating a location with a non-existent parent location',
      (done) => {
        loginUser(agent)
          .then(() => {
            agent
              .put(`/api/v1/locations/${locationId}`)
              .set('Accept', 'application/x-www-form-urlencoded')
              .send({
                malePopulation: '455',
                femalePopulation: '304',
                locationName: 'Ohio',
                parentLocation: badId,
              })
              .then((response) => {
                expect(response.status)
                  .to
                  .equal(404);
                expect(response.body.message).to.equal('This Parent Location does not exist')
                done();
              });
          })
          .catch((err) => {
            done(err)
          })
      });
  });
  describe('Delete Location ', () => {
    it(
      'should return a 403 status code when trying to delete root locations',
      (done) => {
        loginUser(agent)
          .then(() => {
            agent
              .del(`/api/v1/locations/${locationId}`)
              .set('Accept', 'application/x-www-form-urlencoded')
              .then((response) => {
                expect(response.status)
                  .to
                  .equal(403);
                expect(response.body.message).to.equal('You cannot delete a root locations')
                done();
              });
          })
          .catch((err) => {
            done(err)
          })
      });
    it(
      'should return a 200 status code when successfully deleting a location',
      (done) => {
        loginUser(agent)
          .then(() => {
            agent
              .del(`/api/v1/locations/${secondLocationId}`)
              .set('Accept', 'application/x-www-form-urlencoded')
              .then((response) => {
                // console.log(response.body, '>>>>>>> body')
                expect(response.status)
                  .to
                  .equal(200);
                expect(response.body.message).to.equal('Location Successfully Deleted')
                done();
              });
          })
          .catch((err) => {
            done(err)
          })
      });
  });

}
);

after(() => {
  mongooseConnection.dropDatabase()
});




