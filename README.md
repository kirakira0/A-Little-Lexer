# A-Little-Lexer

This project includes a lexer and recursive descent parser that take a string representing a polynomial and responds with the derivative of the polynomial. The following grammar represents the format of valid polynomials in this little language: 

```
  Poly  
    = "-"? term (("+" | "-") term)*  
  term    
    = coefficient "x^" exponent  
    | coefficient "x"  
    | coefficient  
    | "x^" exponent  
    | "x"  
  coefficient  
    = digit+ ("." digit+)?  
  exponent  
    = "-"? digit+  
```
