const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

class Car{
   park(){
    return 'stopped'
   }

   drive(){
    return 'vroom'
   }
}


describe('car', () =>{
    it('can park', () =>{});
    const car = newCar();
    assert.equal( Car.park() , 'stopped')
});