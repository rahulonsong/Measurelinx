function evaluateFa(z, d, a) {
  let Fa = z[0];

  let FaSum = 0;

  for (let i = 1; i < z.length - 1; i++) {
    FaSum += (z[i] * a) / (d[i] + a * (1 + d[i]));
  }

  Fa = +FaSum;

  Fa -= z[z.length - 1] * a;

  return Fa;
}

function evaluateGa(z, d, a) {
  let Fa = evaluateFa(z, d, a);

  return Fa * ((a + 1) / a);
}

function evaluateGaDash(z, d, a) {
  let GaDash = (-1 * z[0]) / Math.pow(a, 2);

  let GaDashSum = 0;
  for (let i = 1; i < z.length - 1; i++) {
    GaDashSum += z[i] / Math.pow(d[i] + a * (1 + d[i]), 2);
  }
  GaDash -= GaDashSum;
  GaDash -= z[z.length - 1];

  return GaDash;
}

function evaluateHa(z, d, a) {
  let Ha = -1 * z[0] * (1 + a);

  let HaSum = 0;
  for (let i = 1; i < z.length - 1; i++) {
    HaSum += (z[i] * a * (1 + a)) / (d[i] + a * (1 + d[i]));
  }

  Ha -= HaSum;
  Ha += z[z.length - 1] * a * (1 + a);

  return Ha;
}

function evaluateHaDash(z, d, a) {
  let HaDash = -1 * z[0];

  let HaDashSum = 0;
  for (let i = 1; i < z.length - 1; i++) {
    HaDashSum +=
      (z[i] * (d[i] * Math.pow(1 + a, 2) + Math.pow(a, 2))) /
      Math.pow(d[i] + a * (1 + d[i]), 2);
  }

  HaDash -= HaDashSum;
  HaDash += z[z.length - 1] * (1 + 2 * a);

  return HaDash;
}

function NichitaLeibovici(K, z) {
  let phiSelect;
  let h; // increment in the Newton-Raphson method
  let a; // x value for evaluating functions Fa,Ga and Ha
  let epsilon;
  let c = []; // function of equiibrium const, c = (1/(1 - K))
  let d = []; // function of c, di =  (c1− ci)/(cn− c1)
  let Ga;
  let GaDash;
  let Ha;
  let HaDash;
  // Solving Rachford-Rice using D.V. Nichita, C.F. Leibovici / Fluid Phase Equilibria 353 (2013) 38– 49
  //     Evaluating left and Right limits for a value
  let aL = z[0] / (1 - z[0]);
  let aR = (1 - z[z.length - 1]) / z[z.length - 1];

  // Evaluating c and d parameters
  for (let i = 0; i < z.length; i++) {
    c.push(1 / (1 - K[i]));
  }

  d[0] = 0;
  d[z.length - 1] = -1;

  for (let i = 1; i < z.length - 1; i++) {
    d[i] = (c[0] - c[i]) / (c[z.length - 1] - c[0]);
  }

  // Evaluating FaL and FaR

  const FaL = evaluateFa(z, d, aL);
  const FaR = evaluateFa(z, d, aR);

  let mValue = (FaR - FaL) / (aR - aL);
  const a0 = Math.abs(aL - FaL / mValue);

  const Ga0 = evaluateGa(z, d, a0);

  // Checking if Ga0 value is greater than 0 as per algorithm1 of D.V. Nichita, C.F. Leibovici
  //  Fluid Phase Equilibria 353 (2013) 38– 49

  if (Ga0 > 0) {
    // solve for H(a) = 0

    //  // Determining a value by Newton-Raphson method
    epsilon = 0.00001;
    Ga = Ga0;
    GaDash = evaluateGaDash(z, d, a0);
    h = Ga / GaDash;
    a = a0;

    while (Math.abs(h) > epsilon) {
      a = a - h;
      Ga = evaluateGa(z, d, a);
      GaDash = evaluateGaDash(z, d, a);
      h = Ga / GaDash;
    }
    phiSelect = (c[0] + a * c[c.length - 1]) / (1 + a);
  }
  // Ga <=0 solve for H(a) = 0
  else {
    const Ha0 = evaluateHa(z, d, a0);
    //  // Determining a value by Newton-Raphson method
    epsilon = 0.00001;
    Ha = Ha0;
    HaDash = evaluateHaDash(z, d, a0);
    h = Ha / HaDash;
    a = a0;

    while (Math.abs(h) > epsilon) {
      a = a - h;
      Ha = evaluateHa(z, d, a);
      HaDash = evaluateHaDash(z, d, a);
      h = Ha / HaDash;
    }
    phiSelect = (c[0] + a * c[c.length - 1]) / (1 + a);
  }

  return phiSelect;
}

// console.log(NichitaLeibovici);
