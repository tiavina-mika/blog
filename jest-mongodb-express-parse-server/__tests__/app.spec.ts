/* eslint-disable @typescript-eslint/no-unused-vars */

import { requestAcceptedByDriver } from '../src/cloud/services/request.service.cloud';
import { createRequest, driverAcceptRequest } from './mock/request.mock';
import { createRide } from './mock/ride.mock';
import { createUser } from './mock/user.mock';
import { createVehicle } from './mock/vehicle.mock';

const vehicle1Seats = 7;
const rideSeats = 5;
const request1Seats = 1;
const request2Seats = 2;
const request3Seats = 6;

describe('App main features', () => {
  let Ride: Parse.ObjectConstructor;
  let Vehicle: Parse.ObjectConstructor;
  let Request: Parse.ObjectConstructor;
  let Notification: Parse.ObjectConstructor;

  let driver: Parse.User;
  let vehicle1: Parse.Object;
  let passenger1: Parse.User;
  let passenger2: Parse.User;
  let ride: Parse.Object;
  let request1: Parse.Object;
  let request2: Parse.Object;

  beforeAll(async () => {
    // Define a sample Parse Class
    Ride = Parse.Object.extend('Ride');
    Vehicle = Parse.Object.extend('Vehicle');
    Request = Parse.Object.extend('Request');
    Notification = Parse.Object.extend('Notification');

    // driver = await createUser('driver');
    passenger1 = await createUser('passenger1');
    // passenger2 = await createUser('passenger2');
    // vehicle1 = await createVehicle(driver, 'vehicle1', vehicle1Seats);
    // ride = await createRide(driver, vehicle1, rideSeats);
  });

  it('should objects exists', () => {
    // expect(driver).toBeDefined();
    // expect(vehicle1).toBeDefined();
    expect(passenger1).toBeDefined();
    // expect(passenger2).toBeDefined();
    // expect(ride).toBeDefined();
  });

  // sum function test
  it('should sum two numbers 1', () => {
    expect(1 + 2).toBe(3);
  });

  afterAll(async () => {
    const users = await new Parse.Query(Parse.User).find({ useMasterKey: true });
    console.log(' ---------- users 1: ', users);
  });
});
