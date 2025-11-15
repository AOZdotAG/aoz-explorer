import AgentInfo from '../AgentInfo';

export default function AgentInfoExample() {
  return (
    <div className="p-4 max-w-md">
      <AgentInfo
        name="aozAgentDealer"
        verified={true}
        teeAttestation="#0400...0000"
        teeUrl="https://cloud.phala.network/explorer/app_3f34d52ad552e8b14676884de28ac2b240872847"
        walletAddress="7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
        explorerUrl="https://solscan.io/account/7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
        holder="Minter"
        holderUrl="https://solscan.io/account/DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CSKBF"
      />
    </div>
  );
}
