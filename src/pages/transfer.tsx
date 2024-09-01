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
  const { data: tx, writeContract: deposit } = useWriteContract();
  const { data: tx1, writeContract: transfer } = useWriteContract();
  // const { data: signer } = useEthersSigner();
  // const erc20Address = "0x4a669e1267f6da8b51e21bc3c402a8614ae7cd1a";
  // const zetoTokenAddress = "0x26366dd4C51b84490e01233A491Af142a6Ab96Ba";
  const erc20Address = "0xBD1dF8b2eeB22ae2f6cB039a1191878eE06583C5";
  const zetoTokenAddress = "0x2CE73d5A63c948CeFdf2E9ad3b414471c35c905C";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const amount = (formData.get("amount") as string) || "0";
      const recipient = (formData.get("recipient") as string) || "0";
      const amountInWei = parseEther(amount);
      console.log("amountInWei", amountInWei.toString());
      // Step1: Get approval
      approveContract({
        address: erc20Address,
        abi: erc20Abi,
        functionName: "approve",
        args: [zetoTokenAddress, amountInWei.toString()],
      });

      // Call api to generate the proof
      const response = await axios.post(
        "http://localhost:3001/api/generate-proof",
        { amount }
      );
      const { outputCommitments, encodedProof } = await response.data;

      console.log({ outputCommitments, encodedProof });

      deposit({
        address: zetoTokenAddress,
        abi: zetoTokenAbi,
        functionName: "deposit",
        // args: [Number(amountInWei), outputCommitments[0], encodedProof],
        args: [amount, outputCommitments[0], encodedProof],
      });

      // Prepare transfer proofs
      const transferRes = await axios.get(
        "http://localhost:3001/api/transfer-proof"
      );
      const transferProof = await transferRes.data;

      const inputCommitments = transferProof.inputCommitments;
      const outputCommitmentsOfTransfer = transferProof.outputCommitments;
      const encodedProofOfTransfer = transferProof.encodedProof;

      // const outputOwnerAddresses = transferProof.owners.map(
      //   (owner: any) => owner.ethAddress
      // );

      console.log(
        "transfer Proof",
        inputCommitments,
        outputCommitmentsOfTransfer,
        JSON.stringify(encodedProofOfTransfer)
      );

      const txn = await transfer({
        address: zetoTokenAddress,
        abi: zetoTokenAbi,
        functionName: "transfer",
        args: [
          inputCommitments,
          outputCommitmentsOfTransfer,
          encodedProofOfTransfer,
        ],
      });

      console.log("console tx1", txn);
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
