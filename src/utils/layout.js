export function getLayout(count) {
  switch (count) {
    case 1:
      return { rows: [[ { rotated: false } ]] };
    case 2:
      return { rows: [[ { rotated: true } ], [ { rotated: false } ]] };
    case 3:
      return { rows: [[ { rotated: true } ], [ { rotated: false }, { rotated: false } ]] };
    case 4:
      return { rows: [
        [ { rotated: true }, { rotated: true } ],
        [ { rotated: false }, { rotated: false } ]
      ]};
    case 5:
      return { rows: [
        [ { rotated: true }, { rotated: true } ],
        [ { rotated: false }, { rotated: false }, { rotated: false } ]
      ]};
    case 6:
      return { rows: [
        [ { rotated: true }, { rotated: true }, { rotated: true } ],
        [ { rotated: false }, { rotated: false }, { rotated: false } ]
      ]};
    default:
      return null;
  }
}
