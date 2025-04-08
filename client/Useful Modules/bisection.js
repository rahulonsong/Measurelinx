function dbSum(T, compoDataFull_cloud, pressure_cloud, context) {
  let K = [];
  compoDataFull_cloud.forEach((element) => {
    const kValue =
      ((element.pc * Math.pow(10, 5)) / pressure_cloud) *
      Math.exp(5.37 * (1 + element.acentric) * (1 - element.tc / T));
    K.push(kValue);
  });

  let dewSum = 0;
  let bubbleSum = 0;
  for (let i = 0; i < compoDataFull_cloud.length; i++) {
    let comp = compoDataFull_cloud[i];
    if (context == 'dew') {
      dewSum += comp.compoValue / K[i];
    } else {
      bubbleSum += comp.compoValue * K[i];
    }
  }

  if (context == 'dew') {
    dewSum -= 1;
    return dewSum;
  } else {
    bubbleSum -= 1;
    return bubbleSum;
  }
}

function Bisection(
  dbSum,
  x0,
  x1,
  max_iter,
  tolerance,
  compoDataFull_cloud,
  pressure_cloud,
  context
) {
  let a = x0;
  let b = x1;
  let m = (a + b) / 2;
  let fm = dbSum(m, compoDataFull_cloud, pressure_cloud, context);
  // let fa = dbSum(a,compoDataFull_cloud, pressure_cloud, context)
  // let fb = dbSum(b,compoDataFull_cloud, pressure_cloud, context)
  let epsilon = 0.00001; // Tolerance for Bisection method

  while (b - a > epsilon) {
    m = (a + b) / 2;

    fm = dbSum(m, compoDataFull_cloud, pressure_cloud, context);
    let fa = dbSum(a, compoDataFull_cloud, pressure_cloud, context);

    if ((fm > 0 && fa < 0) || (fm < 0 && fa > 0)) {
      // f(a) and f(m) have different signs: move b
      b = m;
    } else {
      // f(a) and f(m) have same signs: move a
      a = m;
    }

    // phiSelect = 0
  }

  return (a + b) / 2;
}

// console.log(Bisection(dbSum, 0.1, 600, "dew"));

function phiSum(x, K, z) {
  let rrSum = 0;
  for (let i = 0; i < z.length; i++) {
    // Rachford–Rice equation  to determine Vapor fraction phi
    rrSum += (z[i] * (K[i] - 1)) / (1 + x * (K[i] - 1));
  }

  return rrSum;
}

function bisectionForPhi(K, z, x0, x1) {
  let a = x0;
  let b = x1;
  let fa;
  let m = (a + b) / 2;
  let fm = phiSum(m, K, z);
  // let fa = dbSum(a,compoDataFull_cloud, pressure_cloud, context)
  // let fb = dbSum(b,compoDataFull_cloud, pressure_cloud, context)
  let epsilon = 0.00001; // Tolerance for Bisection method

  while (b - a > epsilon) {
    m = (a + b) / 2;

    fm = phiSum(m, K, z);
    fa = phiSum(a, K, z);

    if ((fm > 0 && fa < 0) || (fm < 0 && fa > 0)) {
      // f(a) and f(m) have different signs: move b
      b = m;
    } else {
      // f(a) and f(m) have same signs: move a
      a = m;
    }
  }

  return (a + b) / 2;
}

console.log(bisectionForPhi);
