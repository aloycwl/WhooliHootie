const abi = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'p',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'q',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 's',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'r',
        type: 'string',
      },
    ],
    name: 'BREED',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 's',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'r',
        type: 'string',
      },
    ],
    name: 'MINT',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'count',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'gen',
    outputs: [
      {
        internalType: 'uint256',
        name: 'maxCount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'currentCount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'a',
        type: 'address',
      },
    ],
    name: 'PLAYERITEMS',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
],abi2 = [
	{
		constant: true,
		inputs: [{ name: '_owner', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ name: 'balance', type: 'uint256' }],
		type: 'function',
	},
];