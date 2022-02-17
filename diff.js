export function derivative(poly) {
  return differentiate(parse(tokenize(poly)));
}

function tokenize(poly) {
  let clean = /[a-wyzA-WYZ*%]|\^[-]?\d+(\.\d?)/g;
  if (clean.test(poly)) {
    throw new SyntaxError("Illegal chars in polynomial.");
  }

  const pattern = /\d+(\.\d+)?(x(\^(-)?\d+)?)?|x(\^(-)?\d+)?|[-+]/g;

  return [...poly.match(pattern)].flat();
}

function differentiate(terms) {
  let derivatives = [];

  terms.forEach((term) => {
    // If term list is only one constant, give back a zero.
    // Otherwise, if the term list contains a constant, we
    // don't need to print the 0 out.
    if (term.coefficient * term.exponent === 0) {
      if (terms.length == 1) derivatives.push("0");
      return;
    }
    // x only
    if (term.coefficient === 1 && term.exponent === 1) {
      derivatives.push("1");
      return;
    }
    let newTerm = "";
    const newCoeff = term.coefficient * term.exponent;
    const newExp = term.exponent - 1;

    if (newCoeff !== 1) newTerm += newCoeff;
    if (newExp == 1) {
      newTerm += "x";
    } else if (newExp !== 0) {
      newTerm += "x^" + newExp;
    }
    derivatives.push(newTerm);
  });

  for (let i = 0; i < derivatives.length - 1; i++) {
    if (!derivatives[i + 1].startsWith("-")) {
      derivatives[i] = derivatives[i].concat("+");
    }
  }

  return derivatives.join("");
}

function parse(tokens) {
  let terms = [];

  let current = 0;

  function at(expected) {
    if (expected === Operator) {
      return /[+-]/.test(tokens[current]);
    } else if (expected === Term) {
      return /\d+(\.\d+)?(x(\^\d+)?)?|x(\^\d+)?/.test(tokens[current]);
    } else if (expected === "-") {
      return expected === tokens[current];
    }
    throw new SyntaxError(
      "Unrecognizable input. Ensure input is in polynomial form."
    );
  }

  function match(expected) {
    if (expected === undefined || at(expected)) {
      return tokens[current++];
    } else {
      throw new SyntaxError(`Expected: ${expected}`);
    }
  }

  /**
   * This function builds a Term object.
   * @param {*} negative Whether or not the Term is negative.
   * @param {*} str A string representing the Term.
   * @returns A Term object.
   */
  function buildTermFrom(negative, str) {
    let [coeff, exp] = [1, 0];
    // coefficient "x^" exponent
    if (!str.startsWith("x") && str.includes("x^")) {
      coeff = str.substring(0, str.indexOf("x"));
      exp = str.substring(str.indexOf("x") + 2);
    }
    // coefficient
    else if (!str.includes("x") && !str.includes("^")) {
      coeff = str;
    }
    // coefficient "x"
    else if (str[0] !== "x" && !str.includes("x^")) {
      coeff = str.substring(0, str.indexOf("x")); // from start to x (non including)
      exp = 1;
    }
    // "x^" exponent
    else if (str.substring(0, 2) === "x^") {
      exp = str.substring(2);
    }
    // "x"
    else if (str === "x") {
      exp = 1;
    }
    return negative ? new Term(-coeff, exp) : new Term(coeff, exp);
  }

  let negative = false;

  if (at("-")) {
    match("-");
    negative = true;
  }

  let term = match(Term);

  terms.push(buildTermFrom(negative, term));

  while (at(Operator)) {
    // Extract the lexeme
    let op = match(Operator);
    term = match(Term);
    if (op === "-") {
      // Make coefficient negative if necessary
      terms.push(buildTermFrom(true, term));
    } else {
      terms.push(buildTermFrom(false, term));
    }
  }
  return terms;
}

class Term {
  constructor(coefficient, exponent) {
    this.coefficient = Number(coefficient);
    this.exponent = Number(exponent);
  }
}

class Operator {
  constructor(lexeme) {
    this.lexeme = lexeme;
  }
}
