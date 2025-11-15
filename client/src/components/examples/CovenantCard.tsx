import AozOathCard from '../CovenantCard';

export default function AozOathCardExample() {
  const mockOath = {
    id: 43,
    type: "LOAN" as const,
    status: "minted" as const,
    ask: {
      text: "Please transfer 1 USDC to the wallet address 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU on Solana by July 16, 2025, at 4:58 PM UTC.",
      status: "settled" as const,
      txUrl: "https://solscan.io/tx/5wHu1qwD31j5k5h3dvkGfJp2Fp18bYL5TfNZVBvznGHrG3uN8Lqkd12XxzQ2o7GqP8x9K4j6m3D5s2cV1f"
    },
    promise: {
      text: "Repay a total of 1.01 USDC to your specified wallet address on Solana by July 16, 2025, at 5:08 PM UTC.",
      details: "repay to wallet address: DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CSKBF",
      status: "pending" as const
    },
    agent: {
      name: "aozAgentDealer",
      verified: true,
      teeAttestation: "#0400...0000",
      teeUrl: "https://cloud.phala.network/explorer/app_3f34d52ad552e8b14676884de28ac2b240872847",
      walletAddress: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      explorerUrl: "https://solscan.io/account/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      holder: "Minter",
      holderUrl: "https://solscan.io/account/DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CSKBF"
    },
    openSeaUrl: "https://magiceden.io/item-details/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
  };

  return (
    <div className="p-4 max-w-2xl">
      <AozOathCard oath={mockOath} />
    </div>
  );
}
