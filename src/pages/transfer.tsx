import { useState } from "react";
import { erc20Abi } from "../libs/abis/erc20Abi";
import { zetoTokenAbi } from "../libs/abis/zetoTokenAbi";
import { useWriteContract } from "wagmi";
import { parseEther } from "viem";
import { JsonRpcSigner } from "ethers";
import axios from "axios";

const Transfer = () => {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const { data: hash, writeContract: approveContract } = useWriteContract();
  const { data: hash1, writeContract: deposit } = useWriteContract();
  // const { data: signer } = useEthersSigner();

  const erc20Address = "0x4a669e1267f6da8b51e21bc3c402a8614ae7cd1a";
  const zetoTokenAddress = "0x26366dd4C51b84490e01233A491Af142a6Ab96Ba";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const amount = (formData.get("amount") as string) || "0";
      const recipient = (formData.get("recipient") as string) || "0";

      // Step1: Get approval
      approveContract({
        address: erc20Address,
        abi: erc20Abi,
        functionName: "approve",
        args: [zetoTokenAddress, parseEther(amount)],
      });

      // Call api to generate the proof
      const response = await axios.post(
        "http://localhost:3001/api/generate-proof",
        { amount }
      );
      const { outputCommitments, encodedProof } = response.data;

      console.log({ outputCommitments, encodedProof });

      deposit({
        address: zetoTokenAddress,
        abi: zetoTokenAbi,
        functionName: "deposit",
        args: [parseEther(amount), outputCommitments[0]],
      });

      // Prepare transfer proofs
      // const transferRes = await axios.post(
      //   "http://localhost:3001/api/transfer-proof",
      //   { recipient, amount }
      // );
    } catch (err) {
      console.log("errrr", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="recipient">Recipient:</label>
        <input
          type="text"
          name="recipient"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="amount">Amount:</label>
        <input
          type="text"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default Transfer;
