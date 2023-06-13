import tkinter as tk

root= tk.Tk()
root.resizable=(False,False)
root.title=('Adekunle yusuf')
root.geometry=('400x300')


label1 = tk.Button(root, text = '1')
label1.place(x= 5, y = 10)

label2 = tk.Button(root, text="2")
label2.place(x= 25, y= 10)

label3 = tk.Button(root, text = '3')
label3.place(x=45, y= 10)

label4 = tk.Button(root, text = '4')
label4.place(x=65, y= 10)

lbl5 = tk.Entry(root)
lbl5.place(x= 5, y = 50)

root.mainloop()
