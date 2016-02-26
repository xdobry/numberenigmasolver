# Number Enigma Solver
Search formula to solve easy two parameters functions. For example to find that 4 op 6 = 210 (the formula is (b-a)|(a+b)).

The program is implemented in java script and can be run in browser which supports ECMA6.
So you need a modern browser. The computation may take more time so the browser can complain about it by
displaing some dialog about long-time java script processes.
Just let it compute more.

# Inspiration

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
The operation tree generator tries to generate formulas from easy one to more complex by growing
the branches of operation tree in balanced way. This way the easiest formular will be find first
and the program is not wasting time for trying very deep complex tree if the easy solution exist.

The variation of fomulas are determined by parameters and operation.
The parameter are variations of parameter a, b and constants.
For example for operation + there are following formulas possible.
a+a,a+b,b+a,b+b,a+1,b+1 (if there is only one constant 1).
The program does not recognize that a+b is same as b+a.

Depending of tree depth the amount of possible formulas grows quite rapidly.
The program can find the formulas only for depth 2 in reasonable time (one minute).
For depth 2, 5 operations and 1 constant there are already 22 Milions possible formulas.

The program contains the functionality to compute number of possible formulas for
paramaters as tree depth, number of operation, and constant range.

Supported operations
* + plus
* - minus
* * multiplication
* / division (integer part)
* % remainder
* | number concatenation

# Playing with program

By playing with program the interesting thing is that the program can find formulas for
random entered numbers. It whould be quite interesting to find out what are relations between
kind of operations, number ranges, examples amount and complexity of formulas.
Are special numbers that can be not mapped by any formulas (Beside of trivial a op b = c; a op b = d; d<>c).
I have no idea if the formula finder could be usable beside such mathematical plays.

