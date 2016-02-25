# Number Enigma Solver
Search formula to solve easy two parameters functions. For example to find that 4 op 6 = 210 (the formula is (b-a)|(a+b)).

# Unspiration

The program is to find solution for enigma described in german magazine
http://www.spiegel.de/wissenschaft/mensch/raetsel-der-woche-der-taschenrechner-spinnt-a-1077064.html

The article is based on mathematical enigma twitted by @yabazin_gazou

6 + 4 = 210

9 + 2 = 711

8 + 5 = 313

5 + 2 = 37

7 + 6 = ???

The programm tries to find the solution (formula) by using brute force method.
It tries every possible combination of known operations by defined formula compexity.

# What is solution formula

The solution formula can be represented as operation tree.
The complexity is the depth of tree.

The soultion of example above is formula: (b-a)|(a+b).
The "|" is concatenation operator. The formula are 3 operation (|,+,+) in operation tree of depth 1.
The fomula a+b has only one operation (plus +). The depth is 0.

The solver tries all combination of operation (build all operation trees) of defined depth.

# Implematation

The solver use java script generators to create all possible operation trees.
The another component tries to find the first formula for it all examples match.


