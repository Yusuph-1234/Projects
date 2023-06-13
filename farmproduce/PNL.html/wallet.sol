// SPDX-License-Identifier: MIT

pragma solidity^ 0.8.17;

contract wallet{
uint public initialBal=3000;
uint remove;
uint add;
uint out;
uint timestamp;

  function withdraw(uint amount) public returns(uint){
    require(initialBal > amount, 'Not sufficient funds');
      assert (initialBal == 0);
remove = (initialBal - amount);
return remove;



  }

  function deposit(uint amount) public returns(uint){
add = (initialBal + amount);
return add;


  }

  function transfer(uint amount)public returns(uint){
    out = (initialBal - amount);
    return out;
  }

}

