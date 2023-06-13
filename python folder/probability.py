green = str(input('green ball: '))
red = str(input('red ball: '))
blue = str(input('blue ball: '))

total = float(red + green + blue)
print('probability of picking green is ' + float(green % total))
print('probability of picking red is ' + float(red % total))
print('probability of picking blue is ' + float(blue % total))