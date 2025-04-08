function cubicSolve(a, b, c, d) {
  b /= a;
  c /= a;
  d /= a;

  var discrim, q, r, dum1, s, t, term1, r13;

  q = (3.0 * c - b * b) / 9.0;
  r = -(27.0 * d) + b * (9.0 * c - 2.0 * (b * b));
  r /= 54.0;

  discrim = q * q * q + r * r;

  var roots = [
    {
      real: 0,
      i: 0,
    },
    {
      real: 0,
      i: 0,
    },
    {
      real: 0,
      i: 0,
    },
  ];

  term1 = b / 3.0;

  if (discrim > 0) {
    // one root real, two are namel"ex
    s = r + Math.sqrt(discrim);
    s = s < 0 ? -Math.pow(-s, 1.0 / 3.0) : Math.pow(s, 1.0 / 3.0);
    t = r - Math.sqrt(discrim);
    t = t < 0 ? -Math.pow(-t, 1.0 / 3.0) : Math.pow(t, 1.0 / 3.0);

    roots[0].real = -term1 + s + t;
    term1 += (s + t) / 2.0;
    roots[2].real = roots[2].real = -term1;
    term1 = (Math.sqrt(3.0) * (-t + s)) / 2;

    roots[1].i = term1;
    roots[2].i = -term1;
    return roots;
  } // End if (discrim > 0)

  // The remaining options are all real

  if (discrim == 0) {
    // All roots real, at least two are equal.
    r13 = r < 0 ? -Math.pow(-r, 1.0 / 3.0) : Math.pow(r, 1.0 / 3.0);
    roots[0].real = -term1 + 2.0 * r13;
    roots[2].real = roots[1].real = -(r13 + term1);
    return roots;
  } // End if (discrim == 0)

  // Only option left is that all roots are real and unequal (to get here, q < 0)
  q = -q;
  dum1 = q * q * q;
  dum1 = Math.acos(r / Math.sqrt(dum1));
  r13 = 2.0 * Math.sqrt(q);

  roots[0].real = -term1 + r13 * Math.cos(dum1 / 3.0);
  roots[1].real = -term1 + r13 * Math.cos((dum1 + 2.0 * Math.PI) / 3.0);
  roots[2].real = -term1 + r13 * Math.cos((dum1 + 4.0 * Math.PI) / 3.0);

  return roots;
}

function calculate(a, b, c, d) {
  // eslint-disable-next-line
  var f,
    g,
    h,
    k,
    m,
    m2,
    n,
    n2,
    x1,
    x2,
    x3,
    r,
    rc,
    dans,
    x2a,
    x2b,
    x2c,
    x2d,
    theta,
    sign;

  // <!--EVALUATING THE 'f'TERM -->
  f = eval((3 * c) / a - (b * b) / (a * a)) / 3;

  // <!--EVALUATING THE 'g'TERM -->
  g =
    eval(
      2 * ((b * b * b) / (a * a * a)) - (9 * b * c) / (a * a) + 27 * (d / a)
    ) / 27;

  // <!--EVALUATING THE 'h'TERM -->
  h = eval((g * g) / 4 + (f * f * f) / 27);

  if (h > 0) {
    m = eval(-(g / 2) + Math.sqrt(h));

    // <!-- K is used because math.pow cannot nameu"te negative cube roots -->
    k = 1;
    if (m < 0) k = -1;
    else k = 1;
    m2 = eval(Math.pow(m * k, 1 / 3));
    m2 = m2 * k;
    k = 1;
    n = eval(-(g / 2) - Math.sqrt(h));
    if (n < 0) k = -1;
    else k = 1;
    n2 = eval(Math.pow(n * k, 1 / 3));
    n2 = n2 * k;
    k = 1;
    x1 = eval(m2 + n2 - b / (3 * a));

    // <!--                      ((S+U)     - (b/(3*a)))-->
    x2 =
      (-1 * (m2 + n2)) / 2 -
      b / (3 * a) +
      ' + i* ' +
      ((m2 - n2) / 2) * Math.pow(3, 0.5);

    // <!--                      -(S + U)/2  - (b/3a) + i*(S-U)*(3)^.5-->
    x3 =
      (-1 * (m2 + n2)) / 2 -
      b / (3 * a) +
      ' - i* ' +
      ((m2 - n2) / 2) * Math.pow(3, 0.5);
  }

  // <!--                      -(S + U)/2  - (b/3a) - i*(S-U)*(3)^.5-->

  if (h <= 0) {
    r = eval(Math.sqrt((g * g) / 4 - h));
    k = 1;
    if (r < 0) k = -1;
    // <!-- rc is the cube root of 'r' -->
    rc = Math.pow(r * k, 1 / 3) * k;
    k = 1;
    theta = Math.acos(-g / (2 * r));
    x1 = eval(2 * (rc * Math.cos(theta / 3)) - b / (3 * a));
    x2a = rc * -1;
    x2b = Math.cos(theta / 3);
    x2c = Math.sqrt(3) * Math.sin(theta / 3);
    x2d = (b / 3) * a * -1;
    x2 = eval(x2a * (x2b + x2c)) - b / (3 * a);
    x3 = eval(x2a * (x2b - x2c)) - b / (3 * a);

    x1 = x1 * 1e14;
    x1 = Math.round(x1);
    x1 = x1 / 1e14;

    x2 = x2 * 1e14;
    x2 = Math.round(x2);
    x2 = x2 / 1e14;

    x3 = x3 * 1e14;
    x3 = Math.round(x3);
    x3 = x3 / 1e14;
  }

  if (f + g + h == 0) {
    if (d < 0) {
      sign = -1;
    }
    if (d >= 0) {
      sign = 1;
    }

    if (sign > 0) {
      dans = Math.pow(d / a, 1 / 3);
      dans = dans * -1;
    }

    if (sign < 0) {
      d = d * -1;
      dans = Math.pow(d / a, 1 / 3);
    }

    x1 = dans;
    x2 = dans;
    x3 = dans;
  }
  var roots = [];

  roots[0] = x1;
  roots[1] = x2;
  roots[2] = x3;

  return roots;

  // document.output.x1.value="  "+x1

  // document.output.x2.value="  "+x2

  // document.output.x3.value="  "+x3
}

// console.log(cubicSolve(1,2,3,4));
// console.log(calculate(1, 2, 3, 4));
