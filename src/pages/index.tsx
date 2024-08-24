import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Transfer from "./transfer";

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <ConnectButton />
      <Transfer />
    </div>
  );
};

export default Home;
