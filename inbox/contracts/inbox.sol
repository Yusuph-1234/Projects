pragma solidity ^ 0.8.13;

contract Inbox {
    string public constant MY_MESSAGE;
    

constructor( string _initialMessage) {
     MY_MESSAGE = _initialMessage;
   } 
function setMessage(string _newMessage)  public {
     MY_MESSAGE = _newMessage;
    }
 
}