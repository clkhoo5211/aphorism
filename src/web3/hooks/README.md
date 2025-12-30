# Smart Contract Hooks Documentation

Centralized, reusable hooks for interacting with smart contracts across all screens. These hooks use Wagmi/Viem (standard Web3 libraries) and work with any EIP-1193 compatible wallet (MetaMask, Trust Wallet, Binance Web3, etc.).

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Available Hooks](#available-hooks)
- [Detailed API Reference](#detailed-api-reference)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Technical Details](#technical-details)

---

## 🚀 Quick Start

### Import Hooks

```tsx
import { 
  useContractRead, 
  useContractWrite, 
  useContractWriteDirect,
  useContractReadAuto 
} from '../web3/hooks'
```

### Basic Usage

```tsx
// READ from contract
const { data, isLoading } = useContractRead({
  address: '0x...',
  abi: ERC20_ABI,
  functionName: 'balanceOf',
  args: ['0x...'],
})

// WRITE to contract
const { write, isPending, hash } = useContractWriteDirect()

await write({
  address: '0x...',
  abi: ERC20_ABI,
  functionName: 'transfer',
  args: ['0x...', parseUnits('100', 18)],
})
```

---

## 🎣 Available Hooks

### 1. `useContractRead` - Read Contract Data
Read data from smart contracts (view/pure functions). No transaction needed.

### 2. `useContractWriteDirect` - Write to Contract (Recommended)
Send transactions to smart contracts. Uses Wagmi's standard method. **This is the recommended hook for writing.**

### 3. `useContractWrite` - Write with Retry Logic
Alternative write hook with automatic retry for rate limit errors.

### 4. `useContractReadAuto` - Auto-Refreshing Read
Same as `useContractRead` but with automatic refetching at intervals.

---

## 📚 Detailed API Reference

### `useContractRead`

Read data from smart contracts without sending transactions.

**Parameters:**
```tsx
{
  address: Address          // Contract address (0x...)
  abi: Abi                  // Contract ABI (partial ABI is fine)
  functionName: string      // Function name (e.g., 'balanceOf')
  args?: readonly unknown[] // Function arguments (array)
  chainId?: number         // Optional: chain ID (defaults to connected chain)
  enabled?: boolean         // Optional: enable/disable query (default: true)
  queryKey?: string[]       // Optional: custom query key for caching
}
```

**Returns:**
```tsx
{
  data: T | undefined      // Return value from contract function
  isLoading: boolean        // True if query is loading
  isRefetching: boolean     // True if query is refetching
  isError: boolean         // True if query failed
  error: Error | null      // Error object if query failed
  refetch: () => void      // Function to manually refetch data
  isEnabled: boolean        // True if query is enabled
}
```

**Example:**
```tsx
const { data: balance, isLoading, error } = useContractRead<bigint>({
  address: '0x55d398326f99059fF775485246999027B3197955',
  abi: ERC20_ABI,
  functionName: 'balanceOf',
  args: [userAddress],
})

if (isLoading) return <div>Loading...</div>
if (error) return <div>Error: {error.message}</div>

const formatted = balance ? formatUnits(balance, 18) : '0'
```

---

### `useContractWriteDirect` ⭐ (Recommended)

Send transactions to smart contracts. Uses Wagmi's `writeContractAsync` - the standard method.

**Returns:**
```tsx
{
  write: (config, callbacks?) => Promise<void>           // Function to send transaction
  writeAsync: (config, callbacks?) => Promise<string>    // Async version (returns hash)
  hash: `0x${string}` | undefined                        // Transaction hash
  receipt: any | undefined                                // Transaction receipt
  isPending: boolean                                      // True if transaction is pending
  isConfirming: boolean                                  // True if waiting for confirmation
  isSuccess: boolean                                      // True if transaction succeeded
  isError: boolean                                        // True if transaction failed
  error: Error | null                                     // Error object
  reset: () => void                                       // Reset transaction state
}
```

**Write Function Parameters:**
```tsx
write(
  {
    address: Address,        // Contract address
    abi: Abi,                // Contract ABI (partial is fine)
    functionName: string,     // Function name (e.g., 'transfer')
    args?: readonly unknown[], // Function arguments
    value?: bigint,          // Optional: value to send (in wei)
    gas?: bigint,            // Optional: gas limit
  },
  {
    onSuccess?: (hash) => void,      // Called when transaction is sent
    onError?: (error) => void,       // Called when transaction fails
    onConfirmed?: (receipt) => void,  // Called when transaction is confirmed
  }
)
```

**Example:**
```tsx
const { write, isPending, hash, receipt, error } = useContractWriteDirect()

const handleTransfer = async () => {
  await write(
    {
      address: '0x55d398326f99059fF775485246999027B3197955',
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [recipient, parseUnits('100', 18)],
    },
    {
      onSuccess: (txHash) => {
        console.log('Transaction sent!', txHash)
      },
      onError: (error) => {
        console.error('Transaction failed:', error)
      },
      onConfirmed: (receipt) => {
        console.log('Transaction confirmed!', receipt)
      },
    }
  )
}
```

---

### `useContractWrite`

Alternative write hook with automatic retry logic for rate limit errors.

**Usage:**
```tsx
const { write, isPending, hash } = useContractWrite({
  address: '0x...',
  abi: ERC20_ABI,
  functionName: 'transfer',
})

await write({
  args: ['0x...', parseUnits('100', 18)],
})
```

**Note:** This hook has retry logic but uses the same underlying Wagmi method. `useContractWriteDirect` is recommended for simpler usage.

---

### `useContractReadAuto`

Same as `useContractRead` but with automatic refetching.

**Parameters:**
```tsx
{
  ...useContractReadConfig,
  refetchInterval?: number  // Refetch interval in milliseconds
}
```

**Example:**
```tsx
const { data } = useContractReadAuto({
  address: '0x...',
  abi: ERC20_ABI,
  functionName: 'balanceOf',
  args: [userAddress],
  refetchInterval: 5000, // Refetch every 5 seconds
})
```

---

## 💡 Usage Examples

### Example 1: Read Token Balance

```tsx
import { useContractRead } from '../web3/hooks'
import { formatUnits, Address } from 'viem'

// Partial ABI - only functions you need
const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'decimals',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

function TokenBalance({ tokenAddress, userAddress }: { 
  tokenAddress: Address
  userAddress: Address 
}) {
  const { data: balance, isLoading } = useContractRead<bigint>({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [userAddress],
  })

  const { data: decimals } = useContractRead<bigint>({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'decimals',
  })

  if (isLoading) return <div>Loading...</div>

  const formatted = balance && decimals 
    ? formatUnits(balance, Number(decimals))
    : '0'

  return <div>Balance: {formatted}</div>
}
```

---

### Example 2: Transfer Tokens

```tsx
import { useContractWriteDirect } from '../web3/hooks'
import { useAppKitWallet } from '../web3/hooks'
import { parseUnits, Address } from 'viem'

const ERC20_ABI = [
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const

function TransferButton({ 
  tokenAddress, 
  recipient, 
  amount 
}: { 
  tokenAddress: Address
  recipient: Address
  amount: string
}) {
  const { isConnected } = useAppKitWallet()
  const { write, isPending, hash, isSuccess, error } = useContractWriteDirect()

  const handleTransfer = async () => {
    if (!isConnected) {
      alert('Please connect your wallet')
      return
    }

    await write(
      {
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'transfer',
        args: [recipient, parseUnits(amount, 18)],
      },
      {
        onSuccess: (txHash) => {
          console.log('Transaction sent!', txHash)
        },
        onError: (error) => {
          console.error('Transaction failed:', error)
        },
        onConfirmed: (receipt) => {
          console.log('Transaction confirmed!', receipt)
        },
      }
    )
  }

  return (
    <div>
      <button onClick={handleTransfer} disabled={isPending}>
        {isPending ? 'Processing...' : 'Transfer'}
      </button>
      {hash && <p>Tx Hash: {hash}</p>}
      {isSuccess && <p>✅ Success!</p>}
      {error && <p>❌ Error: {error.message}</p>}
    </div>
  )
}
```

---

### Example 3: Approve Token Spending

```tsx
import { useContractWriteDirect } from '../web3/hooks'
import { parseUnits, Address } from 'viem'

const ERC20_ABI = [
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const

function ApproveButton({ 
  tokenAddress, 
  spenderAddress, 
  amount 
}: { 
  tokenAddress: Address
  spenderAddress: Address
  amount: string
}) {
  const { write, isPending } = useContractWriteDirect()

  const handleApprove = async () => {
    await write({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spenderAddress, parseUnits(amount, 18)],
    })
  }

  return (
    <button onClick={handleApprove} disabled={isPending}>
      {isPending ? 'Approving...' : 'Approve'}
    </button>
  )
}
```

---

### Example 4: Custom Contract Function

```tsx
import { useContractWriteDirect } from '../web3/hooks'
import { parseUnits, Address } from 'viem'

// Your custom contract ABI (partial - only functions you need)
const MY_CONTRACT_ABI = [
  {
    name: 'deposit',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'withdraw',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
] as const

function MyContractInteraction() {
  const { write, isPending } = useContractWriteDirect()

  const handleDeposit = async () => {
    await write({
      address: '0x...', // Your contract address
      abi: MY_CONTRACT_ABI,
      functionName: 'deposit',
      args: [
        '0x55d398326f99059fF775485246999027B3197955', // USDT address
        parseUnits('100', 18),
      ],
    })
  }

  const handleWithdraw = async () => {
    await write({
      address: '0x...', // Your contract address
      abi: MY_CONTRACT_ABI,
      functionName: 'withdraw',
      args: [parseUnits('50', 18)],
    })
  }

  return (
    <div>
      <button onClick={handleDeposit} disabled={isPending}>
        Deposit
      </button>
      <button onClick={handleWithdraw} disabled={isPending}>
        Withdraw
      </button>
    </div>
  )
}
```

---

### Example 5: Multiple Hooks in One Component

```tsx
import { useContractRead, useContractWriteDirect } from '../web3/hooks'
import { useAppKitWallet } from '../web3/hooks'
import { formatUnits, parseUnits, Address } from 'viem'

function TokenOperations({ tokenAddress }: { tokenAddress: Address }) {
  const { address, isConnected } = useAppKitWallet()

  // Read balance
  const { data: balance, refetch: refetchBalance } = useContractRead<bigint>({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    enabled: !!address,
  })

  // Read allowance
  const { data: allowance } = useContractRead<bigint>({
    address: tokenAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address ? [address, SPENDER_ADDRESS] : undefined,
    enabled: !!address,
  })

  // Write hook for transfer
  const { write: transfer, isPending: isTransferring } = useContractWriteDirect()

  // Write hook for approve
  const { write: approve, isPending: isApproving } = useContractWriteDirect()

  const handleTransfer = async () => {
    await transfer({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [RECIPIENT, parseUnits('100', 18)],
    }, {
      onSuccess: () => {
        refetchBalance() // Refresh balance after transfer
      },
    })
  }

  const handleApprove = async () => {
    await approve({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [SPENDER_ADDRESS, parseUnits('1000', 18)],
    })
  }

  return (
    <div>
      <p>Balance: {balance ? formatUnits(balance, 18) : '0'}</p>
      <p>Allowance: {allowance ? formatUnits(allowance, 18) : '0'}</p>
      <button onClick={handleTransfer} disabled={isTransferring}>
        Transfer
      </button>
      <button onClick={handleApprove} disabled={isApproving}>
        Approve
      </button>
    </div>
  )
}
```

---

## ✅ Best Practices

### 1. Always Check Wallet Connection

```tsx
const { isConnected } = useAppKitWallet()

const handleAction = async () => {
  if (!isConnected) {
    alert('Please connect your wallet first')
    return
  }
  // ... proceed with transaction
}
```

### 2. Use Partial ABIs

Only include the functions you need in your ABI:

```tsx
// ✅ Good - Partial ABI
const TRANSFER_ABI = [
  { name: 'transfer', type: 'function', ... },
] as const

// ❌ Unnecessary - Full contract ABI
const FULL_ABI = [/* 100+ functions */]
```

### 3. Handle Errors Gracefully

```tsx
await write({
  address: '0x...',
  abi: ERC20_ABI,
  functionName: 'transfer',
  args: [...],
}, {
  onError: (error) => {
    if (error.message.includes('user rejected')) {
      // User cancelled - don't show error
      return
    }
    // Show user-friendly error
    alert(`Transaction failed: ${error.message}`)
  },
})
```

### 4. Use Auto-Refresh for Real-Time Data

```tsx
const { data } = useContractReadAuto({
  address: '0x...',
  abi: ERC20_ABI,
  functionName: 'balanceOf',
  args: [address],
  refetchInterval: 5000, // Refresh every 5 seconds
})
```

### 5. Reset State Between Transactions

```tsx
const { write, reset } = useContractWriteDirect()

const handleAction = async () => {
  reset() // Clear previous transaction state
  await write({ ... })
}
```

### 6. Use TypeScript Generics for Type Safety

```tsx
// Specify return type
const { data } = useContractRead<bigint>({
  address: '0x...',
  abi: ERC20_ABI,
  functionName: 'balanceOf',
  args: [address],
})

// data is typed as bigint | undefined
```

### 7. Conditional Queries

```tsx
const { data } = useContractRead({
  address: tokenAddress,
  abi: ERC20_ABI,
  functionName: 'balanceOf',
  args: [userAddress],
  enabled: !!userAddress && !!tokenAddress, // Only query if both exist
})
```

---

## 🔧 Troubleshooting

### "Wallet not connected" Error

**Solution:**
- Ensure wallet is connected before calling `write()`
- Check `isConnected` from `useAppKitWallet()`

```tsx
const { isConnected } = useAppKitWallet()
if (!isConnected) {
  // Show connect wallet button
  return
}
```

### Transaction Fails Silently

**Check:**
1. Browser console for errors
2. Contract address is correct
3. ABI matches the contract
4. Function name matches ABI exactly
5. Args match function signature (types and order)

### Gas Estimation Fails

**Common Causes:**
1. Contract address is incorrect
2. Function doesn't exist in ABI
3. Args are wrong type or value
4. Contract would revert the transaction

**Solution:**
- Verify contract address on BscScan
- Check ABI includes the function
- Verify args match function signature

### Rate Limit Errors

**Solution:**
- Wait 10-30 seconds and try again
- Update wallet RPC endpoint in settings
- Use `useContractWrite` (has retry logic) instead of `useContractWriteDirect`

### Wrong Network Error

**Solution:**
- Ensure wallet is connected to BNB Smart Chain (Chain ID: 56)
- Use network switcher component
- Check `chainId` from `useAppKitWallet()`

---

## 🔬 Technical Details

### How It Works

```
User calls write()
    ↓
useContractWriteDirect hook
    ↓
Wagmi's useWriteContract() ← Standard React hook
    ↓
Viem's writeContractAsync() ← Standard library
    ↓
Wallet Provider (window.ethereum) ← EIP-1193 standard
    ↓
Wallet (MetaMask/Trust Wallet) shows popup
    ↓
User approves transaction
    ↓
Transaction broadcast to blockchain
```

### Standard Methods Used

1. **Wagmi's `useWriteContract`** - Industry standard React hook
2. **Viem's `writeContractAsync`** - Industry standard library
3. **EIP-1193** - Official Web3 provider standard
4. **Wallet Provider** - Standard `window.ethereum` interface

### ABI Requirements

- **Partial ABI is fine** - Only include functions you need
- **Function name only** - No need for full signature like `'transfer(address,uint256)'`
- **Just pass values** - Args array contains the actual values

### Example ABI Structure

```tsx
const ERC20_ABI = [
  {
    name: 'transfer',              // ← Function name (just the name)
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [                      // ← Signature info is here
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const

// Usage:
await write({
  address: '0x...',
  abi: ERC20_ABI,
  functionName: 'transfer',        // ← Just the name
  args: ['0x...', parseUnits('100', 18)], // ← Just the values
})
```

---

## 📝 Summary

### What You Need to Pass

✅ **Required:**
- `address`: Contract address
- `abi`: Contract ABI (partial is fine)
- `functionName`: Function name (just the name, not full signature)
- `args`: Function arguments (array of values)

✅ **Optional:**
- `value`: Value to send with transaction (in wei)
- `gas`: Gas limit
- `chainId`: Chain ID (defaults to connected chain)

### What You DON'T Need

❌ Full contract ABI - Partial ABI is fine  
❌ Function signature string - Just the function name  
❌ Parameter types in function name - ABI contains this info  

### Available Hooks

- `useContractRead` - Read contract data
- `useContractWriteDirect` - Write transactions (recommended)
- `useContractWrite` - Write with retry logic
- `useContractReadAuto` - Auto-refreshing read

All hooks are exported from `src/web3/hooks/index.ts` and can be used in any screen component.

---

## 📚 Additional Resources

- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)
- [EIP-1193 Standard](https://eips.ethereum.org/EIPS/eip-1193)

