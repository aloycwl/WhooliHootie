_u = 'uint256';
_ua = _u + '[]';
_s = 'string';
_f = 'function';
_d = 'address';
_b = 'balance';
_v = 'view';
_p = 'payable';
PS = {
  internalType: _ua,
  name: '',
  type: _ua,
};
PT = {
  internalType: _u,
  name: 's',
  type: _u,
};
PU = {
  internalType: _s,
  name: 'r',
  type: _s,
};
PV = {
  internalType: _u,
  name: '',
  type: _u,
};
abi = [
  {
    inputs: [
      PT,
      {
        internalType: _u,
        name: 'q',
        type: _u,
      },
      {
        internalType: _u,
        name: 's',
        type: _u,
      },
      PU,
    ],
    name: 'BREED',
    outputs: [],
    stateMutability: _p,
    type: _f,
  },
  {
    inputs: [PT, PU],
    name: 'MINT',
    outputs: [],
    stateMutability: _p,
    type: _f,
  },
  {
    inputs: [],
    name: 'count',
    outputs: [PV],
    stateMutability: _v,
    type: _f,
  },
  {
    inputs: [PV],
    name: 'gen',
    outputs: [PV, PV],
    stateMutability: _v,
    type: _f,
  },
  {
    inputs: [],
    name: 'getBalance',
    outputs: [PV],
    stateMutability: _v,
    type: _f,
  },
  {
    inputs: [
      {
        internalType: _d,
        name: 'a',
        type: _d,
      },
    ],
    name: 'PLAYERITEMS',
    outputs: [PS, PS, PS, PS, PS, PS, PS],
    stateMutability: _v,
    type: _f,
  },
];
abi2 = [
  {
    constant: true,
    inputs: [{ name: '_owner', type: _d }],
    name: _b + 'Of',
    outputs: [{ name: _b, type: _u }],
    type: _f,
  },
];
