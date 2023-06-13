from math import remainder


number =int(input('enter an integer number: '))
remainder = number % 2
if(remainder == 0):
    print("number is an even number")
else:
    print("number is an odd number")

name = input('Enter your name: ')

print('my name is ' + name)
age = str(input('enter your age: '))

print('i am ' + age + ' years old')