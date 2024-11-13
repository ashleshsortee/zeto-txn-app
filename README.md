# Zeta Transaction App

Frontend application for private transactions on EVM using Zeta SDK.
Backend repo - https://github.com/ashleshsortee/zeto-backend

## Features

- Web3Modal integration for wallet connection
- Support for multiple chains including Mainnet, Sepolia, etc
- React Query for efficient data fetching and state management
- Wagmi hooks for interacting with Ethereum
- ERC20 token support

## Project Structure

- `src/blockchain/config`: Configuration for Web3Modal and Wagmi
- `src/context`: React context provider for Web3Modal
- `src/libs/abis`: ABI definitions for smart contract interactions

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```
3. Set up your environment variables:
   - Create a `.env.local` file in the root directory
   - Add your WalletConnect Cloud project ID:
     ```
     NEXT_PUBLIC_PROJECT_ID=your_project_id_here
     ```

## Usage

This application provides a user interface for interacting with blockchain networks, specifically for private transactions on EVM using the Zeta SDK. Users can connect their wallets, view account information, and perform transactions.

## Configuration

The project uses Wagmi for blockchain interactions. The configuration can be found in `src/blockchain/config/index.ts`. You can modify the supported chains and other settings there.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
