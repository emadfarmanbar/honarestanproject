/*
  Jalaali.js - Persian Calendar Conversion
*/
var jalaali = (function() {
  /*
    Jalaali years starting the 33-year rule.
  */
  var breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];

  /*
    Converts a Gregorian date to Jalaali.
  */
  function toJalaali(gy, gm, gd) {
    if (Object.prototype.toString.call(gy) === '[object Date]') {
      gd = gy.getDate();
      gm = gy.getMonth() + 1;
      gy = gy.getFullYear();
    }
    return d2j(g2d(gy, gm, gd));
  }

  /*
    Converts a Jalaali date to Gregorian.
  */
  function toGregorian(jy, jm, jd) {
    return d2g(j2d(jy, jm, jd));
  }

  /*
    Checks whether a Jalaali date is valid or not.
  */
  function isValidJalaaliDate(jy, jm, jd) {
    return jy >= -61 && jy <= 3177 &&
           jm >= 1 && jm <= 12 &&
           jd >= 1 && jd <= jalaaliMonthLength(jy, jm);
  }

  /*
    Is this a leap year or not?
  */
  function isLeapJalaaliYear(jy) {
    return jalCalLeap(jy) === 0;
  }

  /*
    Number of days in a given month in a Jalaali year.
  */
  function jalaaliMonthLength(jy, jm) {
    if (jm <= 6) return 31;
    if (jm <= 11) return 30;
    if (isLeapJalaaliYear(jy)) return 30;
    return 29;
  }

  /*
    This function determines if the Jalaali (Persian) year is leap (366-day long) or is the common year (365 days)
  */
  function jalCalLeap(jy) {
    var bl = breaks.length,
        jp = breaks[0],
        jm, jump, leap, n, i;

    if (jy < jp || jy >= breaks[bl - 1])
      throw new Error('Invalid Jalaali year ' + jy);

    for (i = 1; i < bl; i += 1) {
      jm = breaks[i];
      jump = jm - jp;
      if (jy < jm)
        break;
      jp = jm;
    }
    n = jy - jp;

    if (jump - n < 6)
      n = n - jump + div(jump + 4, 33) * 33;
    leap = mod(mod(n + 1, 33) - 1, 4);
    if (leap === -1) {
      leap = 4;
    }

    return leap;
  }

  /*
    This function determines if the Jalaali (Persian) year is leap (366-day long) or is the common year (365 days),
    and finds the day in March (Gregorian calendar) of the first day of the Jalaali year (jy).
  */
  function jalCal(jy, withoutLeap) {
    var bl = breaks.length,
        gy = jy + 621,
        leapJ = -14,
        jp = breaks[0],
        jm, jump, leap, leapG, march, n, i;

    if (jy < jp || jy >= breaks[bl - 1])
      throw new Error('Invalid Jalaali year ' + jy);

    for (i = 1; i < bl; i += 1) {
      jm = breaks[i];
      jump = jm - jp;
      if (jy < jm)
        break;
      leapJ = leapJ + div(jump, 33) * 8 + div(mod(jump, 33), 4);
      jp = jm;
    }
    n = jy - jp;

    leapJ = leapJ + div(n, 33) * 8 + div(mod(n, 33) + 3, 4);
    if (mod(jump, 33) === 4 && jump - n === 4)
      leapJ += 1;

    leapG = div(gy, 4) - div((div(gy, 100) + 1) * 3, 4) - 150;
    march = 20 + leapJ - leapG;

    if (withoutLeap) return { gy: gy, march: march };

    if (jump - n < 6)
      n = n - jump + div(jump + 4, 33) * 33;
    leap = mod(mod(n + 1, 33) - 1, 4);
    if (leap === -1) {
      leap = 4;
    }

    return { leap: leap, gy: gy, march: march };
  }

  /*
    Converts a date of the Jalaali calendar to the Julian Day number.
  */
  function j2d(jy, jm, jd) {
    var r = jalCal(jy, true);
    return g2d(r.gy, 3, r.march) + (jm - 1) * 31 - div(jm, 7) * (jm - 7) + jd - 1;
  }

  /*
    Converts the Julian Day number to a date in the Jalaali calendar.
  */
  function d2j(jdn) {
    var gy = d2g(jdn).gy,
        jy = gy - 621,
        r = jalCal(jy, false),
        jdn1f = g2d(gy, 3, r.march),
        jd, jm, k;

    k = jdn - jdn1f;
    if (k >= 0) {
      if (k <= 185) {
        jm = 1 + div(k, 31);
        jd = mod(k, 31) + 1;
        return { jy: jy, jm: jm, jd: jd };
      } else {
        k -= 186;
      }
    } else {
      jy -= 1;
      k += 179;
      if (r.leap === 1)
        k += 1;
    }
    jm = 7 + div(k, 30);
    jd = mod(k, 30) + 1;
    return { jy: jy, jm: jm, jd: jd };
  }

  /*
    Calculates the Julian Day number from Gregorian or Julian calendar dates.
  */
  function g2d(gy, gm, gd) {
    var d = div((gy + div(gm - 8, 6) + 100100) * 1461, 4)
            + div(153 * mod(gm + 9, 12) + 2, 5)
            + gd - 34840408;
    d = d - div(div(gy + 100100 + div(gm - 8, 6), 100) * 3, 4) + 752;
    return d;
  }

  /*
    Calculates Gregorian and Julian calendar dates from the Julian Day number.
  */
  function d2g(jdn) {
    var j = 4 * jdn + 139361631;
    j = j + div(div(4 * jdn + 183187720, 146097) * 3, 4) * 4 - 3908;
    var i = div(mod(j, 1461), 4) * 5 + 308;
    var gd = div(mod(i, 153), 5) + 1;
    var gm = mod(div(i, 153), 12) + 1;
    var gy = div(j, 1461) - 100100 + div(8 - gm, 6);
    return { gy: gy, gm: gm, gd: gd };
  }

  /*
    Utility helper functions.
  */
  function div(a, b) {
    return ~~(a / b);
  }

  function mod(a, b) {
    return a - ~~(a / b) * b;
  }

  return {
    toJalaali: toJalaali,
    toGregorian: toGregorian,
    isValidJalaaliDate: isValidJalaaliDate,
    isLeapJalaaliYear: isLeapJalaaliYear,
    jalaaliMonthLength: jalaaliMonthLength,
    jalCal: jalCal,
    j2d: j2d,
    d2j: d2j,
    g2d: g2d,
    d2g: d2g
  };
})();

// Expose functions globally
window.jalaaliToGregorian = jalaali.toGregorian;
window.gregorianToJalaali = jalaali.toJalaali;